<template>
    <div>
      <div class="mb-6">
        <router-link to="/clients" class="text-indigo-600 hover:text-indigo-800">
          ← Volver a clientes
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900 mt-2">
          {{ isEditing ? 'Editar Cliente' : 'Nuevo Cliente' }}
        </h1>
      </div>
  
      <div class="bg-white shadow rounded-lg p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {{ error }}
          </div>
  
          <!-- Documento -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo Documento *</label>
              <select
                v-model="form.document_type"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="CI">CI</option>
                <option value="NIT">NIT</option>
                <option value="Passport">Pasaporte</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Número Documento *</label>
              <input
                v-model="form.document_number"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
  
          <!-- Nombre -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre *</label>
              <input
                v-model="form.first_name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Apellido *</label>
              <input
                v-model="form.last_name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
  
          <!-- Contacto -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono *</label>
              <input
                v-model="form.phone"
                type="tel"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono Secundario</label>
              <input
                v-model="form.phone_secondary"
                type="tel"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
  
          <!-- Personal -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha Nacimiento</label>
              <input
                v-model="form.birth_date"
                type="date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Género</label>
              <select
                v-model="form.gender"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ingreso Mensual (Bs.)</label>
              <input
                v-model="form.monthly_income"
                type="number"
                step="0.01"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
  
          <!-- Dirección -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              v-model="form.address"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Ciudad</label>
              <input
                v-model="form.city"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Departamento</label>
              <select
                v-model="form.department"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar</option>
                <option value="Santa Cruz">Santa Cruz</option>
                <option value="La Paz">La Paz</option>
                <option value="Cochabamba">Cochabamba</option>
                <option value="Tarija">Tarija</option>
                <option value="Chuquisaca">Chuquisaca</option>
                <option value="Oruro">Oruro</option>
                <option value="Potosí">Potosí</option>
                <option value="Beni">Beni</option>
                <option value="Pando">Pando</option>
              </select>
            </div>
          </div>
  
          <!-- Trabajo -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Ocupación</label>
              <input
                v-model="form.occupation"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Lugar de Trabajo</label>
              <input
                v-model="form.workplace"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
  
          <!-- Referencia -->
          <div class="border-t pt-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Referencia Personal</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  v-model="form.reference_name"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  v-model="form.reference_phone"
                  type="tel"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Relación</label>
                <input
                  v-model="form.reference_relationship"
                  type="text"
                  placeholder="Ej: Hermano, Padre, Amigo"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
  
          <!-- Notas -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Notas</label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
  
          <!-- Buttons -->
          <div class="flex justify-end space-x-3">
            <router-link
              to="/clients"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </router-link>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import api from '@/services/api'
  
  const route = useRoute()
  const router = useRouter()
  
  const isEditing = computed(() => !!route.params.id)
  const saving = ref(false)
  const error = ref('')
  
  const form = reactive({
    document_type: 'CI',
    document_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    phone_secondary: '',
    birth_date: '',
    gender: '',
    address: '',
    city: '',
    department: 'Santa Cruz',
    occupation: '',
    workplace: '',
    monthly_income: '',
    reference_name: '',
    reference_phone: '',
    reference_relationship: '',
    notes: '',
  })
  
  async function loadClient() {
    if (!isEditing.value) return
    
    try {
      const response = await api.get(`/clients/${route.params.id}`)
      const client = response.data.data
      Object.keys(form).forEach(key => {
        if (client[key] !== null) {
          form[key] = client[key]
        }
      })
    } catch (err) {
      error.value = 'Error al cargar cliente'
    }
  }
  
  async function handleSubmit() {
    saving.value = true
    error.value = ''
  
    try {
      if (isEditing.value) {
        await api.put(`/clients/${route.params.id}`, form)
      } else {
        await api.post('/clients', form)
      }
      router.push('/clients')
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al guardar'
    } finally {
      saving.value = false
    }
  }
  
  onMounted(() => {
    loadClient()
  })
  </script>