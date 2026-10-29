-- APPROVED AND APPLIED to Supabase project my-blog (mbwtfbpoefqjfbnxozbx) on 2026-10-29.
-- This file records the applied SQL; do not rerun it (named policies already exist).
-- Purpose: public reads for explicitly public blog content, while removing
-- the currently observed broad anon/authenticated table privileges.
-- The current app uses Manus OAuth/custom cookies, not Supabase Auth. Therefore
-- this file deliberately creates NO INSERT/UPDATE/DELETE policies. Existing
-- authenticated app writes must go through the Express/tRPC server until a
-- trusted Supabase Auth identity mapping and app-admin claim are implemented.
--
-- IMPORTANT: RLS filters rows, not columns. Column-level SELECT grants below
-- keep internal columns out of the public Data API surface. The app's direct
-- DATABASE_URL connection may bypass RLS if it uses an owner/BYPASSRLS role;
-- these policies do not replace the Express router's authorization checks.

BEGIN;

-- Keep RLS enabled on every application table.
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."commentRatings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."languageAnalytics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."postDrafts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."postTags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."socialSharingMetrics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- The live project currently grants ALL table privileges to anon and
-- authenticated, including TRUNCATE (which RLS does not protect). Remove
-- direct table privileges first; re-grant only the read surface below.
REVOKE ALL PRIVILEGES ON TABLE
  public.categories,
  public."commentRatings",
  public.comments,
  public."languageAnalytics",
  public.newsletter_subscribers,
  public."postDrafts",
  public."postTags",
  public.posts,
  public."socialSharingMetrics",
  public.tags,
  public.users
FROM anon, authenticated;

-- Remove sequence usage as well; direct Data API roles should not consume
-- serial IDs. The trusted server/database owner can continue to use them.
REVOKE ALL PRIVILEGES ON SEQUENCE
  public.categories_id_seq,
  public."commentRatings_id_seq",
  public.comments_id_seq,
  public."languageAnalytics_id_seq",
  public.newsletter_subscribers_id_seq,
  public."postDrafts_id_seq",
  public.posts_id_seq,
  public."socialSharingMetrics_id_seq",
  public.tags_id_seq,
  public.users_id_seq
FROM anon, authenticated;

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Public read column grants only. Internal/private tables get no SELECT grant.
GRANT SELECT (id, name, slug, description, "createdAt")
  ON TABLE public.categories TO anon, authenticated;
GRANT SELECT (id, name, slug, "createdAt")
  ON TABLE public.tags TO anon, authenticated;
GRANT SELECT (id, title, slug, content, excerpt, "categoryId", "featuredImageUrl", "publishedAt", published)
  ON TABLE public.posts TO anon, authenticated;
GRANT SELECT ("postId", "tagId")
  ON TABLE public."postTags" TO anon, authenticated;
GRANT SELECT (id, "postId", content, approved, "createdAt")
  ON TABLE public.comments TO anon, authenticated;
GRANT SELECT (id, "commentId", rating, "createdAt")
  ON TABLE public."commentRatings" TO anon, authenticated;
GRANT SELECT (id, "postId", platform, "shareCount", "clickCount")
  ON TABLE public."socialSharingMetrics" TO anon, authenticated;

-- Every category/tag row is treated as public in this draft. Reconsider if
-- the app later adds hidden/private taxonomy rows.
CREATE POLICY public_read_categories
  ON public.categories FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY public_read_tags
  ON public.tags FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY public_read_published_posts
  ON public.posts FOR SELECT TO anon, authenticated
  USING (published = 'published');

CREATE POLICY public_read_post_tags_for_published_posts
  ON public."postTags" FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.posts AS p
      WHERE p.id = "postTags"."postId"
        AND p.published = 'published'
    )
  );

CREATE POLICY public_read_approved_comments_for_published_posts
  ON public.comments FOR SELECT TO anon, authenticated
  USING (
    approved = 'approved'
    AND EXISTS (
      SELECT 1
      FROM public.posts AS p
      WHERE p.id = comments."postId"
        AND p.published = 'published'
    )
  );

CREATE POLICY public_read_ratings_for_public_comments
  ON public."commentRatings" FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.comments AS c
      JOIN public.posts AS p ON p.id = c."postId"
      WHERE c.id = "commentRatings"."commentId"
        AND c.approved = 'approved'
        AND p.published = 'published'
    )
  );

CREATE POLICY public_read_metrics_for_published_posts
  ON public."socialSharingMetrics" FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.posts AS p
      WHERE p.id = "socialSharingMetrics"."postId"
        AND p.published = 'published'
    )
  );

-- Intentionally no SELECT policies or SELECT grants for:
-- users, newsletter_subscribers, postDrafts, languageAnalytics.
-- Intentionally no INSERT/UPDATE/DELETE policies or table grants for any
-- anon/authenticated role. RLS denies row access when no matching policy exists.

COMMIT;
