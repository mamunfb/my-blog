import { describe, expect, it } from "vitest";
import { createLoginUrl } from "./authUrl";

describe("createLoginUrl", () => {
  it("returns null when preview build variables are missing", () => {
    expect(createLoginUrl(undefined, undefined, "https://preview.example" )).toBeNull();
    expect(createLoginUrl("https://oauth.example", "", "https://preview.example")).toBeNull();
  });

  it("returns null for a malformed or unsafe portal URL", () => {
    expect(createLoginUrl("undefined/app-auth", "app-123", "https://preview.example")).toBeNull();
    expect(createLoginUrl("javascript:alert(1)", "app-123", "https://preview.example")).toBeNull();
  });

  it("builds the callback from the current preview origin", () => {
    const loginUrl = createLoginUrl("https://oauth.example/portal/", "app-123", "https://preview.example");
    expect(loginUrl).not.toBeNull();
    const parsed = new URL(loginUrl!);
    expect(parsed.origin).toBe("https://oauth.example");
    expect(parsed.pathname).toBe("/portal/app-auth");
    expect(parsed.searchParams.get("appId")).toBe("app-123");
    expect(parsed.searchParams.get("redirectUri")).toBe("https://preview.example/api/oauth/callback");
    expect(parsed.searchParams.get("type")).toBe("signIn");
  });
});
