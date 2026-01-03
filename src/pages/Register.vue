<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h1 class="text-center text-3xl font-bold text-indigo-600">PrestApp</h1>
          <h2 class="mt-6 text-center text-2xl font-bold text-gray-900">
            Crear cuenta
          </h2>
        </div>
  
        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {{ error }}
          </div>
  
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
  
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
  
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                minlength="8"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
  
            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
  
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>
  
          <p class="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="text-indigo-600 hover:text-indigo-500">
              Inicia sesión
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  
  const loading = ref(false)
  const error = ref('')
  
  async function handleRegister() {
    loading.value = true
    error.value = ''
  
    try {
      await authStore.register(form)
      router.push('/')
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al registrarse'
    } finally {
      loading.value = false
    }
  }
  </script>