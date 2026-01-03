<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
        <router-link
          to="/clients/create"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Nuevo Cliente
        </router-link>
      </div>
  
      <!-- Search -->
      <div class="mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nombre, documento o teléfono..."
          class="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @input="debouncedSearch"
        />
      </div>
  
      <!-- Table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-gray-500">
          Cargando...
        </div>
  
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in clients" :key="client.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ client.first_name }} {{ client.last_name }}</div>
                <div class="text-sm text-gray-500">{{ client.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ client.document_type }} {{ client.document_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ client.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': client.status === 'active',
                    'bg-gray-100 text-gray-800': client.status === 'inactive',
                    'bg-red-100 text-red-800': client.status === 'blocked',
                  }"
                >
                  {{ statusLabels[client.status] }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <router-link
                  :to="`/clients/${client.id}/edit`"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </router-link>
                <button
                  @click="deleteClient(client)"
                  class="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
            <tr v-if="clients.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                No hay clientes registrados
              </td>
            </tr>
          </tbody>
        </table>
  
        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="px-6 py-3 border-t flex justify-between items-center">
          <span class="text-sm text-gray-500">
            Mostrando {{ pagination.from }} - {{ pagination.to }} de {{ pagination.total }}
          </span>
          <div class="flex space-x-2">
            <button
              @click="loadClients(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              @click="loadClients(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '@/services/api'
  
  const clients = ref([])
  const loading = ref(true)
  const search = ref('')
  const pagination = ref({})
  
  const statusLabels = {
    active: 'Activo',
    inactive: 'Inactivo',
    blocked: 'Bloqueado',
  }
  
  let searchTimeout = null
  
  function debouncedSearch() {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      loadClients(1)
    }, 300)
  }
  
  async function loadClients(page = 1) {
    loading.value = true
    try {
      const params = { page }
      if (search.value) {
        params.search = search.value
      }
      const response = await api.get('/clients', { params })
      clients.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        from: response.data.from,
        to: response.data.to,
        total: response.data.total,
      }
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      loading.value = false
    }
  }
  
  async function deleteClient(client) {
    if (!confirm(`¿Eliminar a ${client.first_name} ${client.last_name}?`)) {
      return
    }
    try {
      await api.delete(`/clients/${client.id}`)
      loadClients(pagination.value.current_page)
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar')
    }
  }
  
  onMounted(() => {
    loadClients()
  })
  </script>