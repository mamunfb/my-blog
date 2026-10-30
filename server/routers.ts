import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { translationRouter } from "./translationRouter";
import { newsletterRouter } from "./newsletterRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  translation: translationRouter,
  newsletter: newsletterRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  blog: router({
    getAdminOverview: adminProcedure.query(async () => {
      const { getAdminOverview } = await import("../server/db");
      return getAdminOverview();
    }),
    // Public queries
    getFeaturedPosts: publicProcedure.query(async () => {
      const { getFeaturedPosts } = await import("../server/db");
      return getFeaturedPosts(3);
    }),
    getLatestPosts: publicProcedure
      .input(z.object({ limit: z.number().default(10), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        const { getLatestPosts } = await import("../server/db");
        return getLatestPosts(input.limit, input.offset);
      }),
    getPostBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const { getPostBySlug } = await import("../server/db");
        return getPostBySlug(input.slug);
      }),
    getPostsByCategory: publicProcedure
      .input(z.object({ categoryId: z.number(), limit: z.number().default(10) }))
      .query(async ({ input }) => {
        const { getPostsByCategory } = await import("../server/db");
        return getPostsByCategory(input.categoryId, input.limit);
      }),
    searchPosts: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().default(10) }))
      .query(async ({ input }) => {
        const { searchPosts } = await import("../server/db");
        return searchPosts(input.query, input.limit);
      }),
    getAllCategories: publicProcedure.query(async () => {
      const { getAllCategories } = await import("../server/db");
      return getAllCategories();
    }),
    getAllTags: publicProcedure.query(async () => {
      const { getAllTags } = await import("../server/db");
      return getAllTags();
    }),
    getPostComments: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        const { getPostComments } = await import("../server/db");
        return getPostComments(input.postId);
      }),
    getPostsByAuthor: publicProcedure
      .input(z.object({ authorId: z.number(), limit: z.number().default(10) }))
      .query(async ({ input }) => {
        const { getPostsByAuthor } = await import("../server/db");
        return getPostsByAuthor(input.authorId, input.limit);
      }),

    // Admin mutations
    createPost: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        categoryId: z.number().optional(),
        tags: z.array(z.number()).optional(),
        status: z.enum(["draft", "published", "archived"]).default("draft"),
        featuredImageUrl: z.string().optional(),
        scheduledPublishDate: z.coerce.date().nullable().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { createPost } = await import("../server/db");
        return createPost(input, ctx.user.id);
      }),

    updatePost: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        content: z.string().min(1).optional(),
        categoryId: z.number().optional(),
        tags: z.array(z.number()).optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
        featuredImageUrl: z.string().optional(),
        scheduledPublishDate: z.coerce.date().nullable().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { updatePost } = await import("../server/db");
        return updatePost(input.id, input);
      }),

    deletePost: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { deletePost } = await import("../server/db");
        return deletePost(input.id);
      }),

    getAllPosts: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getAllPosts } = await import("../server/db");
      return getAllPosts();
    }),

    getPostById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { getPostById } = await import("../server/db");
        return getPostById(input.id);
      }),
    getPostStatistics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getPostStatistics } = await import("../server/db");
      return getPostStatistics();
    }),
    trackEngagement: publicProcedure
      .input(z.object({
        postId: z.number(),
        eventType: z.enum(["view", "share", "comment", "read_time"]),
        userId: z.number().optional(),
        language: z.string().optional(),
        durationSeconds: z.number().int().min(0).max(86400).optional(),
        platform: z.string().max(50).optional(),
      }))
      .mutation(async ({ input }) => {
        const { trackPostEngagement } = await import("../server/db");
        return trackPostEngagement(input);
      }),
    createComment: protectedProcedure
      .input(z.object({
        postId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        const { createComment } = await import("../server/db");
        return createComment(input.postId, ctx.user.id, input.content);
      }),
    getPendingComments: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getPendingComments } = await import("../server/db");
      return getPendingComments();
    }),
    approveComment: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { approveComment } = await import("../server/db");
        return approveComment(input.id);
      }),
    rejectComment: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { rejectComment } = await import("../server/db");
        return rejectComment(input.id);
      }),
    deleteComment: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { deleteComment } = await import("../server/db");
        return deleteComment(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
