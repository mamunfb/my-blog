export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { createLoginUrl } from "./lib/authUrl";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  return createLoginUrl(
    import.meta.env.VITE_OAUTH_PORTAL_URL,
    import.meta.env.VITE_APP_ID,
    window.location.origin
  );
};
