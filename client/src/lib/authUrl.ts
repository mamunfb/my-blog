export function createLoginUrl(
  portalUrl: string | undefined,
  appId: string | undefined,
  origin: string
): string | null {
  const configuredPortal = portalUrl?.trim();
  const configuredAppId = appId?.trim();
  if (!configuredPortal || !configuredAppId) return null;

  try {
    const url = new URL(configuredPortal);
    if ((url.protocol !== "https:" && url.protocol !== "http:") || !url.hostname) return null;
    if (url.username || url.password || url.search || url.hash) return null;

    url.pathname = `${url.pathname.replace(/\/+$/, "")}/app-auth`;
    const redirectUri = `${origin}/api/oauth/callback`;
    url.searchParams.set("appId", configuredAppId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", btoa(redirectUri));
    url.searchParams.set("type", "signIn");
    return url.toString();
  } catch {
    return null;
  }
}
