import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: vi.fn((key) => localStorageMock.store[key] || null),
  setItem: vi.fn((key, value) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("API Service", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should have correct base configuration", async () => {
    const api = (await import("@/services/api")).default;

    expect(api.defaults.headers["Content-Type"]).toBe("application/json");
    expect(api.defaults.headers["Accept"]).toBe("application/json");
  });

  it("should add auth token to requests when available", async () => {
    localStorageMock.store["token"] = "my-auth-token";

    // Re-import to get fresh instance
    vi.resetModules();
    const api = (await import("@/services/api")).default;

    // Simulate request interceptor
    const config = { headers: {} };
    const interceptor = api.interceptors.request.handlers[0].fulfilled;
    const result = interceptor(config);

    expect(result.headers.Authorization).toBe("Bearer my-auth-token");
  });

  it("should not add auth header when no token", async () => {
    localStorageMock.store = {};

    vi.resetModules();
    const api = (await import("@/services/api")).default;

    const config = { headers: {} };
    const interceptor = api.interceptors.request.handlers[0].fulfilled;
    const result = interceptor(config);

    expect(result.headers.Authorization).toBeUndefined();
  });
});
