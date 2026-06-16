import { Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { getDb } from "./db";
import { newsletterSubscribers, posts } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

/**
 * Newsletter Email Handler
 * Sends email notifications to subscribers when a new post is published
 * Called via Heartbeat cron: /api/scheduled/newsletter-email
 */
export async function handleNewsletterEmail(req: Request, res: Response) {
  try {
    // Authenticate as cron
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    // Get the last published post (most recent)
    const lastPost = await db
      .select()
      .from(posts)
      .where(eq(posts.published, "published"))
      .orderBy(posts => posts.publishedAt)
      .limit(1);

    if (lastPost.length === 0) {
      return res.json({ ok: true, skipped: "no-posts" });
    }

    const post = lastPost[0];
    
    // Get active subscribers
    const subscribers = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.isActive, 1));

    if (subscribers.length === 0) {
      return res.json({ ok: true, skipped: "no-subscribers" });
    }

    // Generate email content using LLM
    const emailContent = await generateEmailContent(post);

    // Send emails to all subscribers
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const subscriber of subscribers) {
      try {
        // Use Manus built-in notification API to send email
        const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/v1/notification/send-email`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: subscriber.email,
            subject: `New Blog Post: ${post.title}`,
            html: emailContent,
            replyTo: process.env.OWNER_EMAIL || "noreply@blog.local",
          }),
        });

        if (response.ok) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push(`Failed to send to ${subscriber.email}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Error sending to ${subscriber.email}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    // Notify owner of the email campaign result
    await notifyOwner({
      title: `Newsletter Email Campaign: ${post.title}`,
      content: `Sent to ${results.sent} subscribers, ${results.failed} failed. ${
        results.errors.length > 0 ? `Errors: ${results.errors.slice(0, 3).join(", ")}` : ""
      }`,
    });

    res.json({
      ok: true,
      postId: post.id,
      postTitle: post.title,
      subscribers: subscribers.length,
      sent: results.sent,
      failed: results.failed,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Newsletter email handler error:", error);
    
    res.status(500).json({
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        url: req.url,
        taskUid: (await sdk.authenticateRequest(req)).taskUid,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Generate email content using LLM
 */
async function generateEmailContent(post: any): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an email marketing specialist. Generate a professional, engaging HTML email announcing a new blog post. 
          Include:
          - A warm greeting
          - The post title as the main headline
          - A brief excerpt or summary (use the excerpt if available, or summarize the content)
          - A call-to-action button to read the full post
          - Footer with unsubscribe information
          
          Format as clean, professional HTML suitable for email clients.` as any,
        },
        {
          role: "user",
          content: `Blog Post Details:
          Title: ${post.title}
          Excerpt: ${post.excerpt || "No excerpt provided"}
          Content Preview: ${post.content?.substring(0, 200) || ""}
          Post URL: ${process.env.VITE_APP_URL || "https://blog.local"}/blog/${post.slug}` as any,
        },
      ],
    });

    const messageContent = response.choices?.[0]?.message?.content;
    const content = typeof messageContent === 'string' ? messageContent : '';
    
    // Wrap in basic HTML structure if needed
    if (!content.includes("<html")) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
            .content { padding: 20px 0; }
            .cta { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
            .footer { border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            ${content}
          </div>
        </body>
        </html>
      `;
    }

    return content;
  } catch (error) {
    console.error("Error generating email content:", error);
    // Return a fallback email template
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .cta { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Blog Post Published!</h2>
          <h3>${post.title}</h3>
          <p>${post.excerpt || post.content?.substring(0, 200)}</p>
          <p><a href="${process.env.VITE_APP_URL || "https://blog.local"}/blog/${post.slug}" class="cta">Read Full Post</a></p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            You received this email because you're subscribed to our newsletter.
            <a href="${process.env.VITE_APP_URL || "https://blog.local"}?unsubscribe=true">Unsubscribe</a>
          </p>
        </div>
      </body>
      </html>
    `;
  }
}
