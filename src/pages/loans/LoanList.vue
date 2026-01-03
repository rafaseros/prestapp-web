<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Préstamos</h1>
        <router-link
          to="/loans/create"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Nuevo Préstamo
        </router-link>
      </div>
  
      <!-- Filters -->
      <div class="mb-4 flex flex-wrap gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por código o cliente..."
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @input="debouncedSearch"
        />
        <select
          v-model="statusFilter"
          @change="loadLoans(1)"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="approved">Aprobado</option>
          <option value="active">Activo</option>
          <option value="completed">Completado</option>
          <option value="defaulted">En mora</option>
        </select>
      </div>
  
      <!-- Table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-gray-500">
          Cargando...
        </div>
  
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="loan in loans" :key="loan.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link :to="`/loans/${loan.id}`" class="text-indigo-600 hover:text-indigo-900 font-medium">
                  {{ loan.loan_code }}
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">
                  {{ loan.client?.first_name }} {{ loan.client?.last_name }}
                </div>
                <div class="text-sm text-gray-500">{{ loan.client?.document_number }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                {{ formatCurrency(loan.principal_amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                {{ formatCurrency(loan.outstanding_balance) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="statusClass(loan.status)"
                >
                  {{ statusLabels[loan.status] }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                <button
                  v-if="loan.status === 'pending'"
                  @click="approveLoan(loan)"
                  class="text-green-600 hover:text-green-900"
                >
                  Aprobar
                </button>
                <button
                  v-if="loan.status === 'approved'"
                  @click="disburseLoan(loan)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Desembolsar
                </button>
                <router-link
                  :to="`/loans/${loan.id}`"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Ver
                </router-link>
              </td>
            </tr>
            <tr v-if="loans.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                No hay préstamos registrados
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
              @click="loadLoans(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              @click="loadLoans(pagination.current_page + 1)"
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
  
  const loans = ref([])
  const loading = ref(true)
  const search = ref('')
  const statusFilter = ref('')
  const pagination = ref({})
  
  const statusLabels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    active: 'Activo',
    completed: 'Completado',
    defaulted: 'En mora',
    cancelled: 'Cancelado',
  }
  
  function statusClass(status) {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      defaulted: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  function formatCurrency(value) {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(value || 0)
  }
  
  let searchTimeout = null
  function debouncedSearch() {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => loadLoans(1), 300)
  }
  
  async function loadLoans(page = 1) {
    loading.value = true
    try {
      const params = { page }
      if (search.value) params.search = search.value
      if (statusFilter.value) params.status = statusFilter.value
      
      const response = await api.get('/loans', { params })
      loans.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        from: response.data.from,
        to: response.data.to,
        total: response.data.total,
      }
    } catch (error) {
      console.error('Error loading loans:', error)
    } finally {
      loading.value = false
    }
  }
  
  async function approveLoan(loan) {
    if (!confirm(`¿Aprobar el préstamo ${loan.loan_code}?`)) return
    try {
      await api.post(`/loans/${loan.id}/approve`)
      loadLoans(pagination.value.current_page)
    } catch (error) {
      alert(error.response?.data?.message || 'Error al aprobar')
    }
  }
  
  async function disburseLoan(loan) {
    if (!confirm(`¿Desembolsar el préstamo ${loan.loan_code}? Esto generará el cronograma de pagos.`)) return
    try {
      await api.post(`/loans/${loan.id}/disburse`)
      loadLoans(pagination.value.current_page)
    } catch (error) {
      alert(error.response?.data?.message || 'Error al desembolsar')
    }
  }
  
  onMounted(() => loadLoans())
  </script>