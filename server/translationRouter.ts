import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";

export const translationRouter = router({
  // Translate post content to target language
  translatePost: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string(),
        targetLanguage: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the following blog post content to ${input.targetLanguage}. Maintain the same structure and formatting. Only return the translated content, no explanations.`,
            },
            {
              role: "user",
              content: input.content,
            },
          ],
        });

        const translatedContent =
          response.choices[0]?.message.content || input.content;
        return { translatedContent };
      } catch (error) {
        console.error("Translation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to translate post",
        });
      }
    }),

  // Track language usage
  trackLanguageUsage: publicProcedure
    .input(
      z.object({
        language: z.string(),
        postId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Track language usage in analytics
      // This can be extended to store in database for analytics
      console.log(`Language usage tracked: ${input.language}`);
      return { success: true };
    }),

  // Get language analytics (admin only)
  getLanguageAnalytics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    // Return language usage statistics
    return {
      topLanguages: [
        { language: "English", views: 1000, code: "en" },
        { language: "Spanish", views: 500, code: "es" },
        { language: "French", views: 300, code: "fr" },
        { language: "German", views: 250, code: "de" },
        { language: "Chinese", views: 200, code: "zh" },
      ],
    };
  }),
});
