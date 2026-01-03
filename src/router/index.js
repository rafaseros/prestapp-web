import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/Login.vue"),
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/pages/Register.vue"),
    meta: { guest: true },
  },
  {
    path: "/",
    component: () => import("@/layouts/AppLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@/pages/Dashboard.vue"),
      },
      {
        path: "clients",
        name: "clients",
        component: () => import("@/pages/clients/ClientList.vue"),
      },
      {
        path: "clients/create",
        name: "clients.create",
        component: () => import("@/pages/clients/ClientForm.vue"),
      },
      {
        path: "clients/:id/edit",
        name: "clients.edit",
        component: () => import("@/pages/clients/ClientForm.vue"),
      },
      {
        path: "loans",
        name: "loans",
        component: () => import("@/pages/loans/LoanList.vue"),
      },
      {
        path: "loans/create",
        name: "loans.create",
        component: () => import("@/pages/loans/LoanForm.vue"),
      },
      {
        path: "loans/:id",
        name: "loans.show",
        component: () => import("@/pages/loans/LoanDetail.vue"),
      },
      {
        path: "payments",
        name: "payments",
        component: () => import("@/pages/payments/PaymentList.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login" });
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
