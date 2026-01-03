<template>
    <div>
      <div class="mb-6">
        <router-link to="/loans" class="text-indigo-600 hover:text-indigo-800">
          ← Volver a préstamos
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900 mt-2">Nuevo Préstamo</h1>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Form -->
        <div class="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {{ error }}
            </div>
  
            <!-- Cliente -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Cliente *</label>
              <select
                v-model="form.client_id"
                required
                @change="loadClientInfo"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar cliente</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.first_name }} {{ client.last_name }} - {{ client.document_number }}
                </option>
              </select>
            </div>
  
            <!-- Monto y Tasa -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Monto a Prestar (Bs.) *</label>
                <input
                  v-model.number="form.principal_amount"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  @input="calculate"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tasa de Interés (%) *</label>
                <input
                  v-model.number="form.interest_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  @input="calculate"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
  
            <!-- Tipo Interés y Frecuencia -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo de Interés *</label>
                <select
                  v-model="form.interest_type"
                  required
                  @change="calculate"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="flat">Interés Plano</option>
                  <option value="declining">Sobre Saldo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Frecuencia de Pago *</label>
                <select
                  v-model="form.payment_frequency"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quincenal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>
            </div>
  
            <!-- Plazo y Mora -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Número de Cuotas *</label>
                <input
                  v-model.number="form.term"
                  type="number"
                  min="1"
                  max="120"
                  required
                  @input="calculate"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tasa de Mora (%)</label>
                <input
                  v-model.number="form.late_fee_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
  
            <!-- Fechas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha de Desembolso *</label>
                <input
                  v-model="form.disbursement_date"
                  type="date"
                  required
                  :min="today"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha Primera Cuota *</label>
                <input
                  v-model="form.first_payment_date"
                  type="date"
                  required
                  :min="form.disbursement_date || today"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
  
            <!-- Propósito -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Propósito del Préstamo</label>
              <textarea
                v-model="form.purpose"
                rows="2"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: Capital de trabajo, compra de equipos..."
              ></textarea>
            </div>
  
            <!-- Buttons -->
            <div class="flex justify-end space-x-3">
              <router-link
                to="/loans"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </router-link>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ saving ? 'Guardando...' : 'Crear Préstamo' }}
              </button>
            </div>
          </form>
        </div>
  
        <!-- Summary -->
        <div class="bg-white shadow rounded-lg p-6 h-fit">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Resumen del Préstamo</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-500">Capital:</span>
              <span class="font-medium">{{ formatCurrency(form.principal_amount || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Interés Total:</span>
              <span class="font-medium">{{ formatCurrency(calculation.total_interest) }}</span>
            </div>
            <div class="flex justify-between border-t pt-3">
              <span class="text-gray-700 font-medium">Total a Pagar:</span>
              <span class="font-bold text-lg">{{ formatCurrency(calculation.total_amount) }}</span>
            </div>
            <div class="flex justify-between bg-indigo-50 -mx-6 px-6 py-3">
              <span class="text-indigo-700 font-medium">Cuota:</span>
              <span class="font-bold text-xl text-indigo-700">{{ formatCurrency(calculation.installment_amount) }}</span>
            </div>
          </div>
  
          <div v-if="selectedClient" class="mt-6 pt-6 border-t">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Cliente Seleccionado</h4>
            <p class="text-sm text-gray-600">{{ selectedClient.first_name }} {{ selectedClient.last_name }}</p>
            <p class="text-sm text-gray-500">{{ selectedClient.phone }}</p>
            <p v-if="selectedClient.monthly_income" class="text-sm text-gray-500">
              Ingreso: {{ formatCurrency(selectedClient.monthly_income) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/services/api'
  
  const router = useRouter()
  
  const clients = ref([])
  const selectedClient = ref(null)
  const saving = ref(false)
  const error = ref('')
  
  const today = new Date().toISOString().split('T')[0]
  
  const form = reactive({
    client_id: '',
    principal_amount: 10000,
    interest_rate: 12,
    interest_type: 'flat',
    payment_frequency: 'monthly',
    term: 12,
    late_fee_rate: 5,
    disbursement_date: today,
    first_payment_date: '',
    purpose: '',
  })
  
  const calculation = reactive({
    total_interest: 0,
    total_amount: 0,
    installment_amount: 0,
  })
  
  function formatCurrency(value) {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(value || 0)
  }
  
  function calculate() {
    const principal = form.principal_amount || 0
    const rate = form.interest_rate || 0
    const term = form.term || 1
  
    if (form.interest_type === 'flat') {
      calculation.total_interest = principal * (rate / 100) * (term / 12)
      calculation.total_amount = principal + calculation.total_interest
      calculation.installment_amount = calculation.total_amount / term
    } else {
      const monthlyRate = (rate / 100) / 12
      if (monthlyRate > 0) {
        calculation.installment_amount = principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
      } else {
        calculation.installment_amount = principal / term
      }
      calculation.total_amount = calculation.installment_amount * term
      calculation.total_interest = calculation.total_amount - principal
    }
  
    // Round to 2 decimals
    calculation.total_interest = Math.round(calculation.total_interest * 100) / 100
    calculation.total_amount = Math.round(calculation.total_amount * 100) / 100
    calculation.installment_amount = Math.round(calculation.installment_amount * 100) / 100
  }
  
  function loadClientInfo() {
    selectedClient.value = clients.value.find(c => c.id === parseInt(form.client_id)) || null
  }
  
  async function loadClients() {
    try {
      const response = await api.get('/clients', { params: { per_page: 100, status: 'active' } })
      clients.value = response.data.data
    } catch (err) {
      console.error('Error loading clients:', err)
    }
  }
  
  async function handleSubmit() {
    saving.value = true
    error.value = ''
  
    try {
      await api.post('/loans', form)
      router.push('/loans')
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al crear préstamo'
    } finally {
      saving.value = false
    }
  }
  
  onMounted(() => {
    loadClients()
    calculate()
    
    // Set default first payment date (1 month from today)
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    form.first_payment_date = nextMonth.toISOString().split('T')[0]
  })
  </script>