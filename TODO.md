# PrestApp Frontend - Tareas Pendientes

## 🎯 Estado Actual

### ✅ Completado

- [x] Estructura base Vue 3 + Vite + Tailwind CSS
- [x] Autenticación (Login/Register/Logout)
- [x] Dashboard con estadísticas
- [x] CRUD de Clientes
- [x] Lista de Préstamos
- [x] Crear Préstamo con cálculo en tiempo real
- [x] Detalle de Préstamo con cronograma
- [x] Aprobar y Desembolsar préstamos
- [x] Registrar pagos
- [x] Lista de pagos con filtros
- [x] CI/CD con GitHub Actions
- [x] Deploy en producción

---

## 🔥 Prioridad Alta

### Mejoras de UX/UI

- [ ] Agregar loading skeletons en lugar de texto "Cargando..."
- [ ] Implementar notificaciones toast para acciones (éxito/error)
- [ ] Agregar confirmación visual después de acciones exitosas
- [ ] Mejorar responsive en tablas (scroll horizontal o cards en móvil)
- [ ] Agregar breadcrumbs para navegación

### Funcionalidades Críticas

- [ ] Editar préstamo (solo en estado pendiente)
- [ ] Ver detalle de cliente con historial de préstamos
- [ ] Búsqueda global (clientes + préstamos)
- [ ] Filtros avanzados en lista de clientes (por ciudad, estado)
- [ ] Paginación mejorada (mostrar números de página)

### Validaciones

- [ ] Validación de formularios en frontend antes de enviar
- [ ] Mostrar errores de validación por campo
- [ ] Validar formato de teléfono boliviano
- [ ] Validar CI/NIT según formato

---

## 🚀 Prioridad Media

### PWA (Progressive Web App)

- [ ] Configurar manifest.json
- [ ] Agregar service worker
- [ ] Iconos para instalación (192x192, 512x512)
- [ ] Splash screens
- [ ] Modo offline básico (mostrar mensaje)
- [ ] Push notifications para cuotas vencidas

### Dashboard Mejorado

- [ ] Gráfico de préstamos por mes (Chart.js o ApexCharts)
- [ ] Gráfico de ingresos vs capital prestado
- [ ] Lista de cuotas próximas a vencer (7 días)
- [ ] Lista de cuotas vencidas
- [ ] Indicadores de tendencia (↑↓)

### Reportes

- [ ] Generar PDF de cronograma de pagos
- [ ] Generar PDF de estado de cuenta
- [ ] Generar PDF de recibo de pago
- [ ] Exportar lista de clientes a Excel
- [ ] Exportar lista de préstamos a Excel
- [ ] Reporte de cobranza del día

### Gestión de Pagos

- [ ] Pago parcial con selección de cuota
- [ ] Pago múltiple (varias cuotas a la vez)
- [ ] Historial de pagos por cliente
- [ ] Reversar pago con motivo

---

## 📋 Prioridad Baja

### Perfil de Usuario

- [ ] Página de perfil
- [ ] Cambiar contraseña
- [ ] Actualizar datos personales
- [ ] Foto de perfil

### Configuraciones

- [ ] Configurar tasas de interés predeterminadas
- [ ] Configurar tasa de mora predeterminada
- [ ] Configurar frecuencias de pago disponibles
- [ ] Configurar moneda (BOB/USD)

### Mejoras de Interfaz

- [ ] Modo oscuro
- [ ] Selector de tema (colores)
- [ ] Personalizar logo
- [ ] Animaciones de transición entre páginas
- [ ] Atajos de teclado (Ctrl+N para nuevo cliente, etc.)

### Multi-idioma

- [ ] Implementar vue-i18n
- [ ] Traducción español (completo)
- [ ] Traducción inglés

---

## 🛡️ Seguridad

- [ ] Refresh token automático
- [ ] Logout automático por inactividad (15 min)
- [ ] Proteger rutas por rol (admin/usuario)
- [ ] Rate limiting visual (mostrar cuando se excede)
- [ ] Sanitizar inputs para prevenir XSS

---

## 🧪 Testing

- [ ] Configurar Vitest
- [ ] Tests unitarios para stores (auth, etc.)
- [ ] Tests de componentes
- [ ] Tests E2E con Playwright o Cypress
- [ ] Cobertura mínima 60%

---

## 🔧 Técnico / Deuda Técnica

### Refactoring

- [ ] Extraer lógica de formateo a composables (useCurrency, useDate)
- [ ] Crear componentes reutilizables:
  - [ ] `BaseTable.vue` - Tabla con paginación
  - [ ] `BaseModal.vue` - Modal reutilizable
  - [ ] `BaseInput.vue` - Input con validación
  - [ ] `BaseSelect.vue` - Select estilizado
  - [ ] `StatusBadge.vue` - Badge de estado
  - [ ] `LoadingSpinner.vue`
  - [ ] `EmptyState.vue`
  - [ ] `ConfirmDialog.vue`
- [ ] Centralizar constantes (estados, métodos de pago, etc.)
- [ ] Implementar manejo de errores global

### Performance

- [ ] Lazy loading de rutas (ya implementado)
- [ ] Caché de datos con Pinia
- [ ] Debounce en búsquedas (ya implementado)
- [ ] Optimizar bundle size
- [ ] Comprimir imágenes

### DevOps

- [ ] Variables de entorno por ambiente (.env.production, .env.staging)
- [ ] Healthcheck endpoint en frontend
- [ ] Logs de errores (Sentry o similar)
- [ ] Analytics (Plausible o similar)

---

## 📱 Funcionalidades Futuras

### Notificaciones

- [ ] Centro de notificaciones en navbar
- [ ] Notificación de cuotas vencidas
- [ ] Notificación de pagos recibidos
- [ ] Integración WhatsApp para recordatorios
- [ ] Integración Email para recordatorios

### Módulos Adicionales

- [ ] Módulo de gastos/egresos
- [ ] Módulo de caja diaria
- [ ] Módulo de reportes avanzados
- [ ] Módulo de usuarios y roles
- [ ] Auditoría de acciones

### Integraciones

- [ ] Exportar a Google Sheets
- [ ] Backup automático a Google Drive
- [ ] Integración con pasarelas de pago QR

---

## 📝 Notas de Desarrollo

### Convenciones de Código

- Usar Composition API con `<script setup>`
- Nombres de componentes en PascalCase
- Nombres de archivos de páginas en PascalCase
- Composables con prefijo `use` (useAuth, useClients)
- Stores con prefijo `use` y sufijo `Store` (useAuthStore)

### Estructura de Carpetas

```txt
src/
├── components/     # Componentes reutilizables
│   ├── base/       # Componentes base (Button, Input, Modal)
│   └── shared/     # Componentes compartidos
├── composables/    # Lógica reutilizable
├── layouts/        # Layouts de página
├── pages/          # Vistas/páginas
├── router/         # Configuración de rutas
├── services/       # Llamadas API
├── stores/         # Estado global (Pinia)
├── utils/          # Utilidades y helpers
└── assets/         # Imágenes, fuentes, etc.
```

### Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

---

## 🗓️ Roadmap Sugerido

### Fase 1 - MVP Mejorado (1-2 semanas)

1. Notificaciones toast
2. Validaciones de formulario
3. Componentes base reutilizables
4. Detalle de cliente
5. Editar préstamo

### Fase 2 - PWA (1 semana)

1. Configurar PWA
2. Iconos y manifest
3. Instalable en móvil

### Fase 3 - Reportes (1-2 semanas)

1. PDF de cronograma
2. PDF de recibo
3. Exportar a Excel

### Fase 4 - Dashboard Avanzado (1 semana)

1. Gráficos
2. Cuotas próximas/vencidas
3. Métricas de negocio

### Fase 5 - Notificaciones (2 semanas)

1. Centro de notificaciones
2. WhatsApp integration
3. Email integration

---

Última actualización: Enero 2026
