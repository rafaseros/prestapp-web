<template>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
  
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Cargando...</p>
      </div>
  
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Clientes -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Clientes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.total_clients }}</p>
            </div>
          </div>
        </div>
  
        <!-- Préstamos Activos -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Préstamos Activos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.active_loans }}</p>
            </div>
          </div>
        </div>
  
        <!-- Préstamos en Mora -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">En Mora</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.overdue_loans }}</p>
            </div>
          </div>
        </div>
  
        <!-- Saldo Pendiente -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Saldo Pendiente</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(stats.total_outstanding) }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Quick Actions -->
      <div class="mt-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Acciones rápidas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link
            to="/clients/create"
            class="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center"
          >
            <div class="p-2 bg-indigo-100 rounded-lg mr-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span class="text-gray-700 font-medium">Nuevo Cliente</span>
          </router-link>
  
          <router-link
            to="/loans/create"
            class="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center"
          >
            <div class="p-2 bg-green-100 rounded-lg mr-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span class="text-gray-700 font-medium">Nuevo Préstamo</span>
          </router-link>
  
          <router-link
            to="/payments"
            class="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center"
          >
            <div class="p-2 bg-yellow-100 rounded-lg mr-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span class="text-gray-700 font-medium">Registrar Pago</span>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '@/services/api'
  
  const loading = ref(true)
  const stats = ref({
    total_clients: 0,
    active_loans: 0,
    overdue_loans: 0,
    total_disbursed: 0,
    total_outstanding: 0,
  })
  
  function formatCurrency(value) {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(value || 0)
  }
  
  onMounted(async () => {
    try {
      const response = await api.get('/dashboard/summary')
      stats.value = response.data
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      loading.value = false
    }
  })
  </script>