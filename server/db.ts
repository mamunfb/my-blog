import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  posts,
  categories,
  tags,
  comments,
  postTags,
  socialSharingMetrics,
  languageAnalytics,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getFeaturedPosts(limit = 3) {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.published, 'published'))
    .orderBy(desc(posts.viewCount))
    .limit(limit);
  return result;
}

export async function getLatestPosts(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.published, 'published'))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);
  return result;
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPostsByCategory(categoryId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.categoryId, categoryId), eq(posts.published, 'published')))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return result;
}

export async function getPostsByTag(tagId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select()
    .from(posts)
    .innerJoin(postTags, eq(posts.id, postTags.postId))
    .where(and(eq(postTags.tagId, tagId), eq(posts.published, 'published')))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return result.map(r => r.posts);
}

export async function searchPosts(query: string, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.published, 'published'))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return result.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.excerpt?.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.name);
}

export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tags).orderBy(tags.name);
}

export async function getPostComments(postId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(comments)
    .where(and(eq(comments.postId, postId), eq(comments.approved, 'approved')))
    .orderBy(desc(comments.createdAt));
}

export async function getPostsByAuthor(authorId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.authorId, authorId), eq(posts.published, 'published')))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function getAuthorPosts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(eq(posts.authorId, userId)).orderBy(desc(posts.publishedAt));
}

// Admin functions for post management
export async function createPost(input: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  categoryId?: number;
  tags?: number[];
  status?: "draft" | "published" | "archived";
  featuredImageUrl?: string;
  scheduledPublishDate?: Date | null;
}, authorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.insert(posts).values({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      categoryId: input.categoryId,
      authorId,
      published: input.scheduledPublishDate ? "draft" : input.status || "draft",
      featuredImageUrl: input.featuredImageUrl,
      publishedAt: input.status === "published" && !input.scheduledPublishDate ? new Date() : null,
      scheduledPublishDate: input.scheduledPublishDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdPost = await db.select().from(posts).where(eq(posts.slug, input.slug)).limit(1);
    const postId = createdPost[0]?.id;

    if (input.tags && input.tags.length > 0 && postId) {
      await db.insert(postTags).values(input.tags.map(tagId => ({ postId, tagId })));
    }

    return { id: postId, ...input };
  } catch (error) {
    console.error("[Database] Failed to create post:", error);
    throw error;
  }
}

export async function updatePost(postId: number, input: {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  categoryId?: number;
  tags?: number[];
  status?: "draft" | "published" | "archived";
  featuredImageUrl?: string;
  scheduledPublishDate?: Date | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (input.title !== undefined) updateData.title = input.title;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.categoryId !== undefined) updateData.categoryId = input.categoryId;
    if (input.status !== undefined) {
      updateData.published = input.status;
      if (input.status === "published") {
        updateData.publishedAt = new Date();
        updateData.scheduledPublishDate = null;
      }
    }
    if (input.featuredImageUrl !== undefined) updateData.featuredImageUrl = input.featuredImageUrl;
    if (input.scheduledPublishDate !== undefined) {
      updateData.scheduledPublishDate = input.scheduledPublishDate;
      if (input.scheduledPublishDate) {
        updateData.published = "draft";
        updateData.publishedAt = null;
      }
    }

    await db.update(posts).set(updateData).where(eq(posts.id, postId));

    if (input.tags !== undefined) {
      await db.delete(postTags).where(eq(postTags.postId, postId));
      if (input.tags.length > 0) {
        await db.insert(postTags).values(input.tags.map(tagId => ({ postId, tagId })));
      }
    }

    return { id: postId, ...input };
  } catch (error) {
    console.error("[Database] Failed to update post:", error);
    throw error;
  }
}

export async function deletePost(postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.delete(postTags).where(eq(postTags.postId, postId));
    await db.delete(comments).where(eq(comments.postId, postId));
    await db.delete(posts).where(eq(posts.id, postId));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to delete post:", error);
    throw error;
  }
}

export async function getAllPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPostById(postId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function trackPostEngagement(input: {
  postId: number;
  eventType: "view" | "share" | "comment" | "read_time";
  userId?: number;
  language?: string;
  durationSeconds?: number;
  platform?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (input.eventType === "view") {
    await db.update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.id, input.postId));
  }

  if (input.eventType === "share" && input.platform) {
    const existing = await db.select()
      .from(socialSharingMetrics)
      .where(and(
        eq(socialSharingMetrics.postId, input.postId),
        eq(socialSharingMetrics.platform, input.platform),
      ))
      .limit(1);

    if (existing[0]) {
      await db.update(socialSharingMetrics)
        .set({
          shareCount: sql`${socialSharingMetrics.shareCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(socialSharingMetrics.id, existing[0].id));
    } else {
      await db.insert(socialSharingMetrics).values({
        postId: input.postId,
        platform: input.platform,
        shareCount: 1,
        clickCount: 0,
      });
    }
  }

  await db.insert(languageAnalytics).values({
    postId: input.postId,
    userId: input.userId ?? null,
    language: input.language || "en",
    eventType: input.eventType,
    viewCount: input.eventType === "view" ? 1 : 0,
    timeSpent: input.durationSeconds || 0,
  });

  return { success: true };
}

export async function getPostStatistics() {
  const db = await getDb();
  if (!db) return [];
  const allPosts = await db.select().from(posts).orderBy(desc(posts.viewCount));

  return Promise.all(allPosts.map(async (post) => {
    const [shares, commentCount, reading] = await Promise.all([
      db.select({ value: sql<number>`COALESCE(SUM(${socialSharingMetrics.shareCount}), 0)` })
        .from(socialSharingMetrics)
        .where(eq(socialSharingMetrics.postId, post.id)),
      db.select({ value: sql<number>`COUNT(*)` })
        .from(comments)
        .where(eq(comments.postId, post.id)),
      db.select({ value: sql<number>`COALESCE(AVG(CASE WHEN ${languageAnalytics.eventType} = 'read_time' THEN ${languageAnalytics.timeSpent} END), 0)` })
        .from(languageAnalytics)
        .where(eq(languageAnalytics.postId, post.id)),
    ]);

    return {
      postId: post.id,
      views: post.viewCount || 0,
      shares: Number(shares[0]?.value || 0),
      comments: Number(commentCount[0]?.value || 0),
      averageReadTimeSeconds: Math.round(Number(reading[0]?.value || 0)),
    };
  }));
}

export async function createComment(postId: number, userId: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(comments).values({ postId, userId, content, approved: "pending", createdAt: new Date(), updatedAt: new Date() });
    return { success: true, message: "Comment submitted for moderation" };
  } catch (error) {
    console.error("[Database] Failed to create comment:", error);
    throw error;
  }
}

export async function getPendingComments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(eq(comments.approved, "pending")).orderBy(desc(comments.createdAt));
}

export async function approveComment(commentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(comments).set({ approved: "approved", updatedAt: new Date() }).where(eq(comments.id, commentId));
  return { success: true };
}

export async function rejectComment(commentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(comments).set({ approved: "rejected", updatedAt: new Date() }).where(eq(comments.id, commentId));
  return { success: true };
}

export async function deleteComment(commentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(comments).where(eq(comments.id, commentId));
  return { success: true };
}
