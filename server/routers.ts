import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
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
  }),
});

export type AppRouter = typeof appRouter;
