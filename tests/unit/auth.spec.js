import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";

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

// Mock api
vi.mock("@/services/api", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import api from "@/services/api";

describe("Auth Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should start with no user", () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it("should login successfully", async () => {
    const store = useAuthStore();

    api.post.mockResolvedValueOnce({
      data: {
        data: {
          user: { id: 1, name: "Test User", email: "test@test.com" },
          token: "test-token-123",
        },
      },
    });

    await store.login("test@test.com", "password");

    expect(store.isAuthenticated).toBe(true);
    expect(store.user.email).toBe("test@test.com");
    expect(store.token).toBe("test-token-123");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "token",
      "test-token-123"
    );
  });

  it("should logout and clear data", async () => {
    const store = useAuthStore();

    // Setup logged in state
    store.user = { id: 1, name: "Test" };
    store.token = "test-token";

    api.post.mockResolvedValueOnce({});

    await store.logout();

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });

  it("should register successfully", async () => {
    const store = useAuthStore();

    api.post.mockResolvedValueOnce({
      data: {
        data: {
          user: { id: 2, name: "New User", email: "new@test.com" },
          token: "new-token-456",
        },
      },
    });

    await store.register({
      name: "New User",
      email: "new@test.com",
      password: "password123",
      password_confirmation: "password123",
    });

    expect(store.isAuthenticated).toBe(true);
    expect(store.user.name).toBe("New User");
  });
});
