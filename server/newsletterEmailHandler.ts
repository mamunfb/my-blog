import { Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { getDb } from "./db";
import { newsletterSubscribers, posts } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

type NewsletterPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
};

export type EmailBrand = {
  name: string;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  appUrl: string;
};

export function getEmailBrand(): EmailBrand {
  return {
    name: process.env.BLOG_BRAND_NAME || "My Blog",
    logoUrl: process.env.BLOG_LOGO_URL || undefined,
    primaryColor: process.env.BLOG_PRIMARY_COLOR || "#4f46e5",
    accentColor: process.env.BLOG_ACCENT_COLOR || "#ec4899",
    appUrl: (process.env.VITE_APP_URL || "https://blog.local").replace(/\/$/, ""),
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Creates a responsive email with the blog's logo, colors, CTA, and unsubscribe footer.
 * Environment variables: BLOG_BRAND_NAME, BLOG_LOGO_URL, BLOG_PRIMARY_COLOR,
 * BLOG_ACCENT_COLOR, and VITE_APP_URL.
 */
export function buildBrandedNewsletterEmail(
  post: NewsletterPost,
  innerContent?: string,
  brand = getEmailBrand(),
) {
  const safeTitle = escapeHtml(post.title);
  const safeExcerpt = escapeHtml(post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 240));
  const postUrl = `${brand.appUrl}/blog/${encodeURIComponent(post.slug)}`;
  const unsubscribeUrl = `${brand.appUrl}/unsubscribe`;
  const logo = brand.logoUrl
    ? `<img src="${escapeHtml(brand.logoUrl)}" width="56" height="56" alt="${escapeHtml(brand.name)} logo" style="display:block;border-radius:14px;object-fit:cover;margin:0 auto 14px;" />`
    : `<div style="font-size:34px;line-height:1;margin-bottom:14px;">✦</div>`;

  const content = innerContent && !/<html|<body/i.test(innerContent)
    ? innerContent
    : `<p style="font-size:18px;line-height:1.7;color:#334155;margin:0 0 20px;">${safeExcerpt}</p>`;

  return `<!doctype html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${safeTitle}</title></head>
<body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <div style="width:100%;padding:32px 12px;background:linear-gradient(135deg,${brand.primaryColor},${brand.accentColor});">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,.2);">
      <div style="padding:32px 28px;text-align:center;color:#ffffff;background:linear-gradient(135deg,${brand.primaryColor},${brand.accentColor});">
        ${logo}
        <div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;opacity:.9;">${escapeHtml(brand.name)}</div>
        <h1 style="font-size:30px;line-height:1.18;margin:16px 0 0;color:#ffffff;">A fresh story is waiting for you</h1>
      </div>
      <div style="padding:32px 28px;">
        <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${brand.accentColor};font-weight:700;margin-bottom:10px;">New on the blog</div>
        <h2 style="font-size:26px;line-height:1.25;margin:0 0 18px;color:#111827;">${safeTitle}</h2>
        ${content}
        <p style="text-align:center;margin:28px 0 8px;">
          <a href="${postUrl}" style="display:inline-block;padding:15px 26px;border-radius:999px;color:#ffffff;background:linear-gradient(135deg,${brand.primaryColor},${brand.accentColor});text-decoration:none;font-weight:700;">Read the full post →</a>
        </p>
      </div>
      <div style="padding:22px 28px;background:#f1f5f9;border-top:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:12px;line-height:1.6;">
        <p style="margin:0 0 8px;">You received this email because you subscribed to ${escapeHtml(brand.name)}.</p>
        <a href="${unsubscribeUrl}" style="color:${brand.primaryColor};text-decoration:underline;">Unsubscribe</a>
        <span style="padding:0 6px;">·</span>
        <a href="${brand.appUrl}" style="color:${brand.primaryColor};text-decoration:underline;">Visit the blog</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/** Sends a branded email notification to active subscribers for the latest published post. */
export async function handleNewsletterEmail(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not available" });

    const lastPost = await db
      .select()
      .from(posts)
      .where(eq(posts.published, "published"))
      .orderBy(desc(posts.publishedAt))
      .limit(1);
    if (lastPost.length === 0) return res.json({ ok: true, skipped: "no-posts" });

    const post = lastPost[0];
    const subscribers = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.isActive, 1));
    if (subscribers.length === 0) return res.json({ ok: true, skipped: "no-subscribers" });

    const emailContent = await generateEmailContent(post);
    const results = { sent: 0, failed: 0, errors: [] as string[] };

    for (const subscriber of subscribers) {
      try {
        const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/v1/notification/send-email`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: subscriber.email,
            subject: `New from ${getEmailBrand().name}: ${post.title}`,
            html: emailContent,
            replyTo: process.env.OWNER_EMAIL || "noreply@blog.local",
          }),
        });
        if (response.ok) results.sent++;
        else {
          results.failed++;
          results.errors.push(`Failed to send to ${subscriber.email}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Error sending to ${subscriber.email}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    await notifyOwner({
      title: `Newsletter Email Campaign: ${post.title}`,
      content: `Sent to ${results.sent} subscribers, ${results.failed} failed. ${results.errors.slice(0, 3).join(", ")}`,
    });

    return res.json({ ok: true, postId: post.id, postTitle: post.title, subscribers: subscribers.length, sent: results.sent, failed: results.failed });
  } catch (error) {
    console.error("Newsletter email handler error:", error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}

async function generateEmailContent(post: NewsletterPost): Promise<string> {
  let generated = "";
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Write only a short HTML email fragment (two concise paragraphs) for a newsletter. Do not include html, head, body, styles, buttons, or unsubscribe links. Keep it warm, clear, and accessible.",
        },
        {
          role: "user",
          content: `Title: ${post.title}\nExcerpt: ${post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 400)}`,
        },
      ],
    });
    const messageContent = response.choices?.[0]?.message?.content;
    generated = typeof messageContent === "string" ? messageContent : "";
  } catch (error) {
    console.error("Error generating newsletter copy:", error);
  }

  return buildBrandedNewsletterEmail(post, generated);
}
