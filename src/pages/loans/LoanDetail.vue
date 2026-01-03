<template>
    <div>
      <div class="mb-6">
        <router-link to="/loans" class="text-indigo-600 hover:text-indigo-800">
          ← Volver a préstamos
        </router-link>
      </div>
  
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Cargando...</p>
      </div>
  
      <div v-else-if="loan" class="space-y-6">
        <!-- Header -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ loan.loan_code }}</h1>
              <p class="text-gray-500">
                {{ loan.client?.first_name }} {{ loan.client?.last_name }}
                <span class="mx-2">•</span>
                {{ loan.client?.phone }}
              </p>
            </div>
            <span :class="statusClass(loan.status)" class="px-3 py-1 text-sm font-medium rounded-full">
              {{ statusLabels[loan.status] }}
            </span>
          </div>
  
          <!-- Actions -->
          <div class="mt-4 flex space-x-3">
            <button
              v-if="loan.status === 'pending'"
              @click="approveLoan"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Aprobar
            </button>
            <button
              v-if="loan.status === 'approved'"
              @click="disburseLoan"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Desembolsar
            </button>
            <button
              v-if="loan.status === 'active'"
              @click="showPaymentModal = true"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Registrar Pago
            </button>
          </div>
        </div>
  
        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white shadow rounded-lg p-4">
            <p class="text-sm text-gray-500">Capital</p>
            <p class="text-xl font-bold">{{ formatCurrency(loan.principal_amount) }}</p>
          </div>
          <div class="bg-white shadow rounded-lg p-4">
            <p class="text-sm text-gray-500">Interés</p>
            <p class="text-xl font-bold">{{ formatCurrency(loan.total_interest) }}</p>
          </div>
          <div class="bg-white shadow rounded-lg p-4">
            <p class="text-sm text-gray-500">Total</p>
            <p class="text-xl font-bold">{{ formatCurrency(loan.total_amount) }}</p>
          </div>
          <div class="bg-white shadow rounded-lg p-4">
            <p class="text-sm text-gray-500">Saldo Pendiente</p>
            <p class="text-xl font-bold text-indigo-600">{{ formatCurrency(loan.outstanding_balance) }}</p>
          </div>
        </div>
  
        <!-- Details -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Detalles</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Tasa de Interés</p>
              <p class="font-medium">{{ loan.interest_rate }}% {{ loan.interest_type === 'flat' ? '(Plano)' : '(Sobre saldo)' }}</p>
            </div>
            <div>
              <p class="text-gray-500">Cuota</p>
              <p class="font-medium">{{ formatCurrency(loan.installment_amount) }}</p>
            </div>
            <div>
              <p class="text-gray-500">Plazo</p>
              <p class="font-medium">{{ loan.term }} cuotas ({{ frequencyLabels[loan.payment_frequency] }})</p>
            </div>
            <div>
              <p class="text-gray-500">Fecha Desembolso</p>
              <p class="font-medium">{{ formatDate(loan.disbursement_date) }}</p>
            </div>
          </div>
        </div>
  
        <!-- Payment Schedule -->
        <div v-if="loan.payment_schedules?.length" class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6 border-b">
            <h2 class="text-lg font-medium text-gray-900">Cronograma de Pagos</h2>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Interés</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pagado</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="schedule in loan.payment_schedules" :key="schedule.id" class="hover:bg-gray-50">
                <td class="px-6 py-3 text-sm">{{ schedule.installment_number }}</td>
                <td class="px-6 py-3 text-sm">{{ formatDate(schedule.due_date) }}</td>
                <td class="px-6 py-3 text-sm text-right">{{ formatCurrency(schedule.principal_amount) }}</td>
                <td class="px-6 py-3 text-sm text-right">{{ formatCurrency(schedule.interest_amount) }}</td>
                <td class="px-6 py-3 text-sm text-right font-medium">{{ formatCurrency(schedule.total_amount) }}</td>
                <td class="px-6 py-3 text-sm text-right">{{ formatCurrency(schedule.total_paid) }}</td>
                <td class="px-6 py-3 text-center">
                  <span :class="scheduleStatusClass(schedule.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ scheduleStatusLabels[schedule.status] }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Payment Modal -->
      <div v-if="showPaymentModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Registrar Pago</h3>
          
          <form @submit.prevent="submitPayment" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Monto (Bs.) *</label>
              <input
                v-model.number="paymentForm.amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha *</label>
              <input
                v-model="paymentForm.payment_date"
                type="date"
                required
                :max="today"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Método de Pago *</label>
              <select v-model="paymentForm.payment_method" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia</option>
                <option value="qr">QR</option>
                <option value="check">Cheque</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Referencia</label>
              <input
                v-model="paymentForm.reference_number"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Número de transacción"
              />
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="showPaymentModal = false" class="px-4 py-2 border rounded-md">
                Cancelar
              </button>
              <button type="submit" :disabled="savingPayment" class="px-4 py-2 bg-indigo-600 text-white rounded-md">
                {{ savingPayment ? 'Guardando...' : 'Registrar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/services/api'
  
  const route = useRoute()
  const loan = ref(null)
  const loading = ref(true)
  const showPaymentModal = ref(false)
  const savingPayment = ref(false)
  
  const today = new Date().toISOString().split('T')[0]
  
  const paymentForm = reactive({
    amount: 0,
    payment_date: today,
    payment_method: 'cash',
    reference_number: '',
  })
  
  const statusLabels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    active: 'Activo',
    completed: 'Completado',
    defaulted: 'En mora',
  }
  
  const frequencyLabels = {
    daily: 'Diario',
    weekly: 'Semanal',
    biweekly: 'Quincenal',
    monthly: 'Mensual',
  }
  
  const scheduleStatusLabels = {
    pending: 'Pendiente',
    partial: 'Parcial',
    paid: 'Pagado',
    overdue: 'Vencido',
  }
  
  function statusClass(status) {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      defaulted: 'bg-red-100 text-red-800',
    }
    return classes[status]
  }
  
  function scheduleStatusClass(status) {
    const classes = {
      pending: 'bg-gray-100 text-gray-800',
      partial: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
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
  
  async function loadLoan() {
    try {
      const response = await api.get(`/loans/${route.params.id}`)
      loan.value = response.data.data
      paymentForm.amount = parseFloat(loan.value.installment_amount)
    } catch (error) {
      console.error('Error loading loan:', error)
    } finally {
      loading.value = false
    }
  }
  
  async function approveLoan() {
    if (!confirm('¿Aprobar este préstamo?')) return
    try {
      await api.post(`/loans/${loan.value.id}/approve`)
      loadLoan()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al aprobar')
    }
  }
  
  async function disburseLoan() {
    if (!confirm('¿Desembolsar este préstamo? Se generará el cronograma de pagos.')) return
    try {
      await api.post(`/loans/${loan.value.id}/disburse`)
      loadLoan()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al desembolsar')
    }
  }
  
  async function submitPayment() {
    savingPayment.value = true
    try {
      await api.post('/payments', {
        loan_id: loan.value.id,
        ...paymentForm,
      })
      showPaymentModal.value = false
      loadLoan()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al registrar pago')
    } finally {
      savingPayment.value = false
    }
  }
  
  onMounted(() => loadLoan())
  </script>