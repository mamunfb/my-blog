import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { newsletterSubscribers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { getDb } from "./db";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().optional(),
      language: z.string().optional().default("en"),
      preferences: z.string().optional().default("all"),
    }))
    .mutation(async ({ input }: any) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check if already subscribed
        const existing = await db
          .select()
          .from(newsletterSubscribers)
          .where(eq(newsletterSubscribers.email, input.email))
          .limit(1);

        if (existing.length > 0) {
          if (existing[0].isActive) {
            throw new Error("Already subscribed");
          }
          // Reactivate subscription
          await db
            .update(newsletterSubscribers)
            .set({
              isActive: 1,
              unsubscribedAt: null,
              name: input.name,
              language: input.language,
              preferences: input.preferences,
            })
            .where(eq(newsletterSubscribers.email, input.email));
          return { success: true, message: "Resubscribed successfully" };
        }

        // Create new subscription
        await db.insert(newsletterSubscribers).values({
          email: input.email,
          name: input.name,
          language: input.language,
          preferences: input.preferences,
          isActive: 1,
        } as any);

        return { success: true, message: "Subscribed successfully" };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Subscription failed");
      }
    }),

  unsubscribe: publicProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ input }: any) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const existing = await db
          .select()
          .from(newsletterSubscribers)
          .where(eq(newsletterSubscribers.email, input.email))
          .limit(1);

        if (existing.length === 0) {
          throw new Error("Email not found");
        }

        await db
          .update(newsletterSubscribers)
          .set({
            isActive: 0,
            unsubscribedAt: new Date(),
          })
          .where(eq(newsletterSubscribers.email, input.email));

        return { success: true, message: "Unsubscribed successfully" };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Unsubscription failed");
      }
    }),

  getSubscribers: protectedProcedure
    .query(async ({ ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.isActive, 1));
    }),

  getStats: protectedProcedure
    .query(async ({ ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const total = await db.select().from(newsletterSubscribers);
      const active = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.isActive, 1));

      return {
        total: total.length,
        active: active.length,
        inactive: total.length - active.length,
      };
    }),
});
