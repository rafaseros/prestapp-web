<template>
    <div class="min-h-screen bg-gray-100">
      <!-- Navbar -->
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <span class="text-xl font-bold text-indigo-600">PrestApp</span>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <router-link
                  to="/"
                  class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                  :class="$route.name === 'dashboard' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'"
                >
                  Dashboard
                </router-link>
                <router-link
                  to="/clients"
                  class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                  :class="$route.path.startsWith('/clients') ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'"
                >
                  Clientes
                </router-link>
                <router-link
                  to="/loans"
                  class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                  :class="$route.path.startsWith('/loans') ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'"
                >
                  Préstamos
                </router-link>
                <router-link
                  to="/payments"
                  class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                  :class="$route.path.startsWith('/payments') ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'"
                >
                  Pagos
                </router-link>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-700 mr-4">{{ authStore.user?.name }}</span>
              <button
                @click="handleLogout"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- Mobile menu -->
      <div class="sm:hidden bg-white border-t">
        <div class="flex justify-around py-2">
          <router-link to="/" class="text-gray-500 hover:text-indigo-600 p-2">
            Dashboard
          </router-link>
          <router-link to="/clients" class="text-gray-500 hover:text-indigo-600 p-2">
            Clientes
          </router-link>
          <router-link to="/loans" class="text-gray-500 hover:text-indigo-600 p-2">
            Préstamos
          </router-link>
          <router-link to="/payments" class="text-gray-500 hover:text-indigo-600 p-2">
            Pagos
          </router-link>
        </div>
      </div>
  
      <!-- Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <router-view />
      </main>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  async function handleLogout() {
    await authStore.logout()
    router.push('/login')
  }
  </script>