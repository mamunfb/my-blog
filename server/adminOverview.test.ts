import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({
  getAdminOverview: vi.fn().mockResolvedValue({
    totalPosts: 4,
    publishedPosts: 2,
    draftPosts: 1,
    scheduledPosts: 1,
    pendingComments: 3,
    recentPosts: [],
  }),
}));

type Role = NonNullable<TrpcContext["user"]>["role"];

function createContext(role: Role): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-admin-overview",
      email: "admin@example.com",
      name: "Test User",
      loginMethod: "test",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("blog.getAdminOverview", () => {
  it("returns only the overview summary to an administrator", async () => {
    const caller = appRouter.createCaller(createContext("admin"));

    await expect(caller.blog.getAdminOverview()).resolves.toEqual({
      totalPosts: 4,
      publishedPosts: 2,
      draftPosts: 1,
      scheduledPosts: 1,
      pendingComments: 3,
      recentPosts: [],
    });
  });

  it("rejects a regular authenticated user", async () => {
    const caller = appRouter.createCaller(createContext("user"));

    await expect(caller.blog.getAdminOverview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
