import { Request, Response } from "express";
import { eq, lte, and, isNotNull } from "drizzle-orm";
import { sdk } from "./_core/sdk";
import { getDb } from "./db";
import { posts } from "../drizzle/schema";

export function isScheduleDue(scheduledPublishDate: Date | null | undefined, now = new Date()) {
  return Boolean(scheduledPublishDate && scheduledPublishDate.getTime() <= now.getTime());
}

/**
 * Publishes all draft posts whose scheduled time has arrived.
 * Configure a Heartbeat job to POST to /api/scheduled/publish-posts.
 */
export async function handleScheduledPublishing(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not available" });

    const now = new Date();
    const duePosts = await db
      .select({ id: posts.id, title: posts.title, slug: posts.slug, scheduledPublishDate: posts.scheduledPublishDate })
      .from(posts)
      .where(and(
        eq(posts.published, "draft"),
        isNotNull(posts.scheduledPublishDate),
        lte(posts.scheduledPublishDate, now),
      ));

    for (const post of duePosts) {
      await db.update(posts).set({
        published: "published",
        publishedAt: now,
        scheduledPublishDate: null,
        updatedAt: now,
      }).where(eq(posts.id, post.id));
    }

    return res.json({
      ok: true,
      publishedCount: duePosts.length,
      posts: duePosts.map((post) => ({ id: post.id, title: post.title, slug: post.slug })),
      ranAt: now.toISOString(),
    });
  } catch (error) {
    console.error("Scheduled publishing error:", error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
