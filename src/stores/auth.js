import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const token = ref(localStorage.getItem("token") || null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    token.value = response.data.data.token;
    user.value = response.data.data.user;
    localStorage.setItem("token", token.value);
    localStorage.setItem("user", JSON.stringify(user.value));
    return response.data;
  }

  async function register(data) {
    const response = await api.post("/auth/register", data);
    token.value = response.data.data.token;
    user.value = response.data.data.user;
    localStorage.setItem("token", token.value);
    localStorage.setItem("user", JSON.stringify(user.value));
    return response.data;
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  async function fetchUser() {
    try {
      const response = await api.get("/auth/me");
      user.value = response.data.data;
      localStorage.setItem("user", JSON.stringify(user.value));
    } catch {
      logout();
    }
  }

  return { user, token, isAuthenticated, login, register, logout, fetchUser };
});
