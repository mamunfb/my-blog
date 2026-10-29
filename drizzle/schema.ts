import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const userRole = pgEnum("role", ["user", "admin"]);
export const postStatus = pgEnum("published", ["draft", "published", "archived"]);
export const commentApproval = pgEnum("approved", ["pending", "approved", "rejected"]);

export const users = pgTable("users", {
  /** Surrogate primary key. Auto-incremented numeric value managed by the database. */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  authorId: integer("authorId").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: integer("categoryId").references(() => categories.id, { onDelete: "set null" }),
  featuredImageUrl: varchar("featuredImageUrl", { length: 500 }),
  published: postStatus("published").default("draft").notNull(),
  viewCount: integer("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  publishedAt: timestamp("publishedAt"),
  scheduledPublishDate: timestamp("scheduledPublishDate"),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

export const postTags = pgTable("postTags", {
  postId: integer("postId").notNull().references(() => posts.id, { onDelete: "cascade" }),
  tagId: integer("tagId").notNull().references(() => tags.id, { onDelete: "cascade" }),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  approved: commentApproval("approved").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

export const languageAnalytics = pgTable("languageAnalytics", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
  language: varchar("language", { length: 10 }).notNull(),
  postId: integer("postId").references(() => posts.id, { onDelete: "cascade" }),
  viewCount: integer("viewCount").default(1).notNull(),
  timeSpent: integer("timeSpent").default(0).notNull(),
  eventType: varchar("eventType", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type LanguageAnalytics = typeof languageAnalytics.$inferSelect;
export type InsertLanguageAnalytics = typeof languageAnalytics.$inferInsert;

export const commentRatings = pgTable("commentRatings", {
  id: serial("id").primaryKey(),
  commentId: integer("commentId").notNull().references(() => comments.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommentRating = typeof commentRatings.$inferSelect;
export type InsertCommentRating = typeof commentRatings.$inferInsert;

export const socialSharingMetrics = pgTable("socialSharingMetrics", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull().references(() => posts.id, { onDelete: "cascade" }),
  platform: varchar("platform", { length: 50 }).notNull(), // facebook, twitter, whatsapp, email, etc
  shareCount: integer("shareCount").default(0).notNull(),
  clickCount: integer("clickCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SocialSharingMetrics = typeof socialSharingMetrics.$inferSelect;
export type InsertSocialSharingMetrics = typeof socialSharingMetrics.$inferInsert;

export const postDrafts = pgTable("postDrafts", {
  id: serial("id").primaryKey(),
  postId: integer("postId").references(() => posts.id, { onDelete: "cascade" }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  content: text("content").notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  featuredImageUrl: varchar("featuredImageUrl", { length: 500 }),
  data: text("data"), // Store additional metadata as JSON string
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PostDraft = typeof postDrafts.$inferSelect;
export type InsertPostDraft = typeof postDrafts.$inferInsert;

// Newsletter Subscribers Table
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: text("name"),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  isActive: integer("is_active").notNull().default(1),
  language: varchar("language", { length: 10 }).default("en"),
  preferences: varchar("preferences", { length: 50 }).default("all"),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
