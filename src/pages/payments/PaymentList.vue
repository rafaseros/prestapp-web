<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Pagos</h1>
      </div>
  
      <!-- Filters -->
      <div class="mb-4 flex flex-wrap gap-4">
        <select
          v-model="methodFilter"
          @change="loadPayments(1)"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los métodos</option>
          <option value="cash">Efectivo</option>
          <option value="transfer">Transferencia</option>
          <option value="qr">QR</option>
          <option value="check">Cheque</option>
        </select>
        <input
          v-model="fromDate"
          type="date"
          @change="loadPayments(1)"
          class="px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          v-model="toDate"
          type="date"
          @change="loadPayments(1)"
          class="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
  
      <!-- Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white shadow rounded-lg p-4">
          <p class="text-sm text-gray-500">Total Pagos</p>
          <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalAmount) }}</p>
        </div>
        <div class="bg-white shadow rounded-lg p-4">
          <p class="text-sm text-gray-500">Número de Pagos</p>
          <p class="text-2xl font-bold">{{ pagination.total || 0 }}</p>
        </div>
        <div class="bg-white shadow rounded-lg p-4">
          <p class="text-sm text-gray-500">Promedio por Pago</p>
          <p class="text-2xl font-bold">{{ formatCurrency(averageAmount) }}</p>
        </div>
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Préstamo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Método</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ payment.payment_code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <router-link :to="`/loans/${payment.loan_id}`" class="text-indigo-600 hover:text-indigo-900">
                  {{ payment.loan?.loan_code }}
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ payment.loan?.client?.first_name }} {{ payment.loan?.client?.last_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(payment.payment_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                {{ formatCurrency(payment.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {{ methodLabels[payment.payment_method] }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="statusClass(payment.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ statusLabels[payment.status] }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  v-if="payment.status === 'confirmed'"
                  @click="cancelPayment(payment)"
                  class="text-red-600 hover:text-red-900"
                >
                  Cancelar
                </button>
              </td>
            </tr>
            <tr v-if="payments.length === 0">
              <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                No hay pagos registrados
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
              @click="loadPayments(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              @click="loadPayments(pagination.current_page + 1)"
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
  import { ref, computed, onMounted } from 'vue'
  import api from '@/services/api'
  
  const payments = ref([])
  const loading = ref(true)
  const methodFilter = ref('')
  const fromDate = ref('')
  const toDate = ref('')
  const pagination = ref({})
  
  const methodLabels = {
    cash: 'Efectivo',
    transfer: 'Transferencia',
    qr: 'QR',
    check: 'Cheque',
    other: 'Otro',
  }
  
  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
  }
  
  function statusClass(status) {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return classes[status]
  }
  
  function formatCurrency(value) {
    return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(value || 0)
  }
  
  function formatDate(date) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-BO')
  }
  
  const totalAmount = computed(() => {
    return payments.value
      .filter(p => p.status === 'confirmed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
  })
  
  const averageAmount = computed(() => {
    const confirmed = payments.value.filter(p => p.status === 'confirmed')
    if (confirmed.length === 0) return 0
    return totalAmount.value / confirmed.length
  })
  
  async function loadPayments(page = 1) {
    loading.value = true
    try {
      const params = { page }
      if (methodFilter.value) params.payment_method = methodFilter.value
      if (fromDate.value) params.from_date = fromDate.value
      if (toDate.value) params.to_date = toDate.value
  
      const response = await api.get('/payments', { params })
      payments.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        from: response.data.from,
        to: response.data.to,
        total: response.data.total,
      }
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      loading.value = false
    }
  }
  
  async function cancelPayment(payment) {
    if (!confirm(`¿Cancelar el pago ${payment.payment_code}? Esta acción revertirá el saldo del préstamo.`)) {
      return
    }
    try {
      await api.post(`/payments/${payment.id}/cancel`)
      loadPayments(pagination.value.current_page)
    } catch (error) {
      alert(error.response?.data?.message || 'Error al cancelar pago')
    }
  }
  
  onMounted(() => loadPayments())
  </script>