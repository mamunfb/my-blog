export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { createLoginUrl } from "./lib/authUrl";

declare global {
  interface Window {
    __MY_BLOG_CONFIG__?: {
      appId?: string;
      oauthPortalUrl?: string;
    };
  }
}

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  return createLoginUrl(
    window.__MY_BLOG_CONFIG__?.oauthPortalUrl ?? import.meta.env.VITE_OAUTH_PORTAL_URL,
    window.__MY_BLOG_CONFIG__?.appId ?? import.meta.env.VITE_APP_ID,
    window.location.origin
  );
};
