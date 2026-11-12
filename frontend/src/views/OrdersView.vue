<template>
  <div class="min-h-screen bg-[#f4f6f9] text-[#27172b]">
    <!-- TOP NAVIGATION BAR (SISFS / VENEZZIA STYLE) -->
    <header class="bg-[#1b2b48] text-white border-b border-[#2b3e63] sticky top-0 z-40 shadow-md">
      <div class="max-w-[98%] mx-auto px-3 sm:px-6 h-14 flex items-center justify-between">
        <!-- Brand & Title -->
        <div class="flex items-center gap-3">
          <router-link to="/" class="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src="/isotipo_lila.webp" alt="Venezzia" class="h-8 w-auto brightness-0 invert" />
            <span class="font-serif font-bold text-lg tracking-wider text-white hidden sm:inline">VENEZZIA</span>
          </router-link>
          <span class="text-white/30 hidden sm:inline">|</span>
          <div class="flex items-center gap-1.5 bg-[#253858] px-2.5 py-1 rounded text-xs font-semibold text-blue-200">
            <Layers class="w-3.5 h-3.5" />
            <span>SISTEMA DE PEDIDOS</span>
          </div>
        </div>

        <!-- Quick Links & User Info -->
        <div class="flex items-center gap-2 sm:gap-4">
          <router-link
            to="/admin"
            class="text-xs text-blue-200 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
            title="Ir a gestión de catálogo y duplicador"
          >
            <Package class="w-3.5 h-3.5" />
            <span class="hidden md:inline">Gestión Catálogo</span>
          </router-link>

          <router-link
            to="/"
            target="_blank"
            class="text-xs text-blue-200 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
            title="Ver tienda en vivo"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span class="hidden md:inline">Ver Tienda</span>
          </router-link>

          <!-- User Badge -->
          <div class="flex items-center gap-2 pl-2 border-l border-white/20">
            <div class="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shadow-inner">
              J
            </div>
            <div class="hidden lg:block text-left text-xs leading-tight">
              <div class="text-[10px] text-blue-200">Bienvenido,</div>
              <div class="font-bold text-white tracking-wide">JUNIOR ADMIN</div>
            </div>
            <button
              v-if="isAuthenticated"
              @click="handleLogout"
              class="text-white/60 hover:text-rose-300 p-1.5 rounded hover:bg-white/10 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 1. LOGIN GATE: Shown when not authenticated -->
    <div v-if="!isAuthenticated" class="max-w-md mx-auto px-4 py-16">
      <div class="bg-white rounded-2xl p-8 border border-gray-200 text-center shadow-xl">
        <div class="w-14 h-14 rounded-2xl bg-[#1b2b48] text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock class="w-7 h-7" />
        </div>
        <span class="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
          Acceso Restringido • Solo Administradores
        </span>
        <h2 class="text-2xl font-bold text-[#1b2b48] mb-2">
          Gestión de Pedidos Venezzia
        </h2>
        <p class="text-xs text-gray-500 mb-6">
          Ingresa tus credenciales de administrador de PocketBase para acceder a la lista de pedidos.
        </p>

        <form @submit.prevent="loginAsAdmin" class="space-y-4 text-left">
          <div>
            <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Correo de Administrador</label>
            <input
              type="email"
              v-model="loginEmail"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="venezzia@gmail.com"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Contraseña</label>
            <input
              type="password"
              v-model="loginPassword"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div v-if="loginError" class="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ loginError }}</span>
          </div>

          <button
            type="submit"
            :disabled="isLoggingIn"
            class="w-full py-3 bg-[#1b2b48] hover:bg-[#253858] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Loader2 v-if="isLoggingIn" class="w-4 h-4 animate-spin" />
            <span>{{ isLoggingIn ? 'Verificando...' : 'Ingresar al Sistema de Pedidos' }}</span>
          </button>
        </form>
      </div>
    </div>

    <!-- 2. MAIN ORDERS CONTENT (AUTHENTICATED) -->
    <main v-else class="max-w-[98%] mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4">
      <!-- TITLE & TOP ACTIONS -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-[#1b2b48] flex items-center gap-2">
            <span>LISTA DE PEDIDOS</span>
            <span class="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-0.5 rounded-full border border-gray-200">
              {{ stats.total_active }} activos / {{ stats.total_all }} registros
            </span>
          </h1>
          <p class="text-xs text-gray-500 mt-0.5">
            Monitoreo en vivo de pagos online (Culqi), pedidos coordinados por WhatsApp, adelantos y entregas.
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Botón Generar Ruta Delivery (Google Maps) -->
          <button
            type="button"
            @click="openRouteModal"
            :class="[
              'px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer',
              selectedOrderIds.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-300 animate-pulse'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
            ]"
            title="Generar la mejor ruta en Google Maps para el motorizado con los pedidos seleccionados"
          >
            <Route class="w-3.5 h-3.5 text-blue-600" />
            <span>Ruta Delivery</span>
            <span
              v-if="selectedOrderIds.length > 0"
              class="bg-white text-blue-800 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold"
            >
              {{ selectedOrderIds.length }}
            </span>
          </button>

          <!-- Botón Configuración Rápida Número Yape / Plin -->
          <button
            type="button"
            @click="openYapeConfigModal"
            class="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Cambiar número de Yape o Plin para los mensajes de WhatsApp"
          >
            <Smartphone class="w-3.5 h-3.5 text-purple-700" />
            <span>Yape: {{ yapePhoneNumber }}</span>
            <Edit3 class="w-3 h-3 text-purple-600 opacity-60" />
          </button>

          <button
            @click="loadOrders"
            :disabled="isLoading"
            class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Refrescar lista de pedidos"
          >
            <RefreshCw :class="['w-3.5 h-3.5', isLoading ? 'animate-spin text-blue-600' : '']" />
            <span>Refrescar</span>
          </button>

          <button
            @click="showNewOrderModal = true"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus class="w-4 h-4" />
            <span>+ Registrar Pedido</span>
          </button>
        </div>
      </div>

      <!-- FILTERS PANEL (MATCHING SISFS) -->
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <!-- Filtro Estado -->
          <div>
            <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Estado</label>
            <select
              v-model="filters.status"
              @change="loadOrders"
              class="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs font-semibold focus:border-blue-500 focus:outline-none"
            >
              <option value="active">TODOS ACTIVOS (Sin Ocultos)</option>
              <option value="pending">PENDIENTE DE PAGO</option>
              <option value="partial">CON ADELANTO (PAGO PARCIAL)</option>
              <option value="delivery_pending">DELIVERY PENDIENTE (SOLO SALDO DE ENVÍO)</option>
              <option value="paid">PAGADO (100%)</option>
              <option value="delivered">ENTREGADO</option>
              <option value="hidden">OCULTOS / ARCHIVADOS</option>
              <option value="all">TODOS (Incluyendo Ocultos)</option>
            </select>
          </div>

          <!-- Fecha Inicio -->
          <div>
            <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Fecha Inicio</label>
            <input
              type="date"
              v-model="filters.startDate"
              @change="loadOrders"
              class="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <!-- Fecha Fin -->
          <div>
            <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Fecha Fin</label>
            <input
              type="date"
              v-model="filters.endDate"
              @change="loadOrders"
              class="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <!-- Búsqueda por Cliente -->
          <div class="sm:col-span-2 lg:col-span-2">
            <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Buscar por Cliente / Celular / Dirección</label>
            <div class="relative">
              <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                v-model="filters.search"
                @input="handleSearchDebounced"
                placeholder="Nombre, teléfono (ej: 955...), distrito, dedicatoria o código..."
                class="w-full pl-8 pr-8 py-2 bg-white rounded-lg border border-gray-300 text-xs focus:border-blue-500 focus:outline-none"
              />
              <button
                v-if="filters.search"
                @click="clearSearch"
                class="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Filter Reset Pill -->
        <div v-if="hasActiveFilters" class="flex items-center gap-2 pt-1 border-t border-gray-100 text-[11px] text-gray-500">
          <span>Filtros aplicados.</span>
          <button
            @click="resetFilters"
            class="text-blue-600 hover:underline font-semibold"
          >
            Limpiar todos los filtros
          </button>
        </div>
      </div>

      <!-- KPI BADGES ROW (EXACTLY AS IN USER'S SISFS IMAGE) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none">
        <!-- PENDIENTES -->
        <button
          @click="toggleStatusFilter('pending')"
          :class="[
            'px-3.5 py-1.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs',
            filters.status === 'pending'
              ? 'bg-[#0097a7] text-white ring-2 ring-[#0097a7] ring-offset-1'
              : 'bg-[#0097a7]/90 hover:bg-[#0097a7] text-white'
          ]"
        >
          <span>PENDIENTES</span>
          <span class="bg-white/25 px-2 py-0.5 rounded text-[11px] font-extrabold">{{ stats.pending }}</span>
        </button>

        <!-- CON ADELANTO -->
        <button
          @click="toggleStatusFilter('partial')"
          :class="[
            'px-3.5 py-1.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs',
            filters.status === 'partial'
              ? 'bg-[#f59e0b] text-white ring-2 ring-[#f59e0b] ring-offset-1'
              : 'bg-[#f59e0b]/90 hover:bg-[#f59e0b] text-white'
          ]"
        >
          <span>CON ADELANTO</span>
          <span class="bg-white/25 px-2 py-0.5 rounded text-[11px] font-extrabold">{{ stats.partial }}</span>
        </button>

        <!-- DELIVERY PENDIENTE -->
        <button
          @click="toggleStatusFilter('delivery_pending')"
          :class="[
            'px-3.5 py-1.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs',
            filters.status === 'delivery_pending'
              ? 'bg-[#d97706] text-white ring-2 ring-[#d97706] ring-offset-1'
              : 'bg-[#d97706]/90 hover:bg-[#d97706] text-white'
          ]"
          title="Pedidos con arreglos florales pagados, pero con costo de delivery pendiente de abono"
        >
          <Truck class="w-3.5 h-3.5" />
          <span>DELIVERY PENDIENTE</span>
          <span class="bg-white/25 px-2 py-0.5 rounded text-[11px] font-extrabold">{{ stats.delivery_pending }}</span>
        </button>

        <!-- PAGADOS -->
        <button
          @click="toggleStatusFilter('paid')"
          :class="[
            'px-3.5 py-1.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs',
            filters.status === 'paid'
              ? 'bg-[#10b981] text-white ring-2 ring-[#10b981] ring-offset-1'
              : 'bg-[#10b981]/90 hover:bg-[#10b981] text-white'
          ]"
        >
          <span>PAGADOS</span>
          <span class="bg-white/25 px-2 py-0.5 rounded text-[11px] font-extrabold">{{ stats.paid }}</span>
        </button>

        <!-- ENTREGADOS -->
        <button
          @click="toggleStatusFilter('delivered')"
          :class="[
            'px-3.5 py-1.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs',
            filters.status === 'delivered'
              ? 'bg-[#2563eb] text-white ring-2 ring-[#2563eb] ring-offset-1'
              : 'bg-[#2563eb]/90 hover:bg-[#2563eb] text-white'
          ]"
        >
          <span>ENTREGADOS</span>
          <span class="bg-white/25 px-2 py-0.5 rounded text-[11px] font-extrabold">{{ stats.delivered }}</span>
        </button>

        <!-- OCULTOS / ARCHIVADOS -->
        <button
          @click="toggleStatusFilter('hidden')"
          :class="[
            'px-3.5 py-1.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs',
            filters.status === 'hidden'
              ? 'bg-[#64748b] text-white ring-2 ring-[#64748b] ring-offset-1'
              : 'bg-[#64748b]/90 hover:bg-[#64748b] text-white'
          ]"
        >
          <span>OCULTOS / ARCHIVADOS</span>
          <span class="bg-white/25 px-2 py-0.5 rounded text-[11px] font-extrabold">{{ stats.hidden }}</span>
        </button>

        <!-- TOTAL GENERAL -->
        <button
          @click="toggleStatusFilter('active')"
          :class="[
            'px-3.5 py-1.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs ml-auto',
            filters.status === 'active'
              ? 'bg-[#1e293b] text-white ring-2 ring-[#1e293b] ring-offset-1'
              : 'bg-[#1e293b]/90 hover:bg-[#1e293b] text-white'
          ]"
        >
          <span>N° PEDIDOS</span>
          <span class="bg-white/25 px-2 py-0.5 rounded text-[11px] font-extrabold">{{ stats.total_active }}</span>
        </button>
      </div>

      <!-- BANNER DE RUTA RÁPIDA CUANDO HAY PEDIDOS SELECCIONADOS -->
      <div
        v-if="selectedOrderIds.length > 0"
        class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-3 px-4 rounded-xl shadow-md flex items-center justify-between gap-3 flex-wrap animate-in fade-in duration-200"
      >
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center shrink-0">
            <Route class="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <div class="font-bold text-xs">
              {{ selectedOrderIds.length }} {{ selectedOrderIds.length === 1 ? 'pedido seleccionado' : 'pedidos seleccionados' }} para reparto
            </div>
            <div class="text-[10px] text-blue-200">
              Listos para armar la ruta en Google Maps
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            @click="openRouteModal"
            class="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Navigation class="w-3.5 h-3.5" />
            <span>🗺️ Generar Ruta Google Maps</span>
          </button>
          <button
            type="button"
            @click="copyQuickRouteSheet"
            class="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check v-if="copiedRouteToast" class="w-3.5 h-3.5 text-emerald-400" />
            <Copy v-else class="w-3.5 h-3.5" />
            <span>{{ copiedRouteToast ? '¡Copiado!' : 'Copiar para WhatsApp' }}</span>
          </button>
          <button
            type="button"
            @click="clearSelection"
            class="px-2.5 py-1.5 text-blue-200 hover:text-white text-xs underline cursor-pointer"
          >
            Limpiar
          </button>
        </div>
      </div>

      <!-- MAIN DATA TABLE -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <!-- Table container with horizontal scroll -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <!-- HEADER -->
            <thead class="bg-[#24334a] text-white uppercase text-[11px] tracking-wider font-bold select-none">
              <tr>
                <th class="py-3 px-2 text-center w-9">
                  <input
                    type="checkbox"
                    :checked="isAllVisibleSelected"
                    @change="toggleSelectAllVisible"
                    class="w-3.5 h-3.5 rounded text-blue-600 cursor-pointer accent-blue-600"
                    title="Seleccionar / Deseleccionar todos los pedidos visibles"
                  />
                </th>
                <th class="py-3 px-2 text-center w-9">#</th>
                <th class="py-3 px-2 text-center w-24">ACCIONES</th>
                <th class="py-3 px-3 w-28">COD</th>
                <th class="py-3 px-3 w-32">FECHA</th>
                <th class="py-3 px-3 min-w-[160px]">CLIENTE</th>
                <th class="py-3 px-3 w-32">CELULAR</th>
                <th class="py-3 px-3 min-w-[180px]">DISTRITO / CIUDAD</th>
                <th class="py-3 px-3 text-right w-24">M. PROD</th>
                <th class="py-3 px-3 text-right w-24">DELIVERY</th>
                <th class="py-3 px-3 text-right w-24">TOTAL</th>
                <th class="py-3 px-3 text-right w-24">ADEL.</th>
                <th class="py-3 px-3 text-right w-24">SALDO</th>
                <th class="py-3 px-3 text-center w-32">ESTADO</th>
                <th class="py-3 px-3 text-center w-24">MÉTODO</th>
              </tr>
            </thead>

            <!-- BODY -->
            <tbody class="divide-y divide-gray-100 font-medium">
              <!-- Loading state -->
              <tr v-if="isLoading">
                <td colspan="15" class="py-12 text-center text-gray-500">
                  <div class="flex items-center justify-center gap-2">
                    <Loader2 class="w-5 h-5 animate-spin text-blue-600" />
                    <span>Cargando pedidos...</span>
                  </div>
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-else-if="orders.length === 0">
                <td colspan="15" class="py-12 text-center text-gray-500">
                  <div class="max-w-sm mx-auto text-center space-y-2">
                    <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                      <Inbox class="w-6 h-6" />
                    </div>
                    <p class="font-bold text-gray-700">No se encontraron pedidos con los filtros actuales</p>
                    <p class="text-xs text-gray-400">
                      Prueba seleccionando otro estado o limpiando el campo de búsqueda.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Order Rows with Accordion -->
              <template v-for="order in orders" :key="order.id">
                <!-- Master Row -->
                <tr
                  :class="[
                    'hover:bg-blue-50/40 transition-colors',
                    expandedOrderId === order.id ? 'bg-blue-50/70 border-b-0' : '',
                    selectedOrderIds.includes(order.id) ? 'bg-blue-50/80' : '',
                    order.hidden ? 'opacity-60 bg-gray-50' : ''
                  ]"
                >
                  <!-- Checkbox de Selección para Ruta -->
                  <td class="py-2.5 px-2 text-center">
                    <input
                      type="checkbox"
                      :checked="selectedOrderIds.includes(order.id)"
                      @change="toggleSelectOrder(order.id)"
                      class="w-3.5 h-3.5 rounded text-blue-600 cursor-pointer accent-blue-600"
                      title="Seleccionar pedido para ruta de delivery"
                    />
                  </td>

                  <!-- (+) / (-) Expand button -->
                  <td class="py-2.5 px-2 text-center">
                    <button
                      type="button"
                      @click="toggleExpand(order.id)"
                      :class="[
                        'w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-xs transition-all shadow-xs cursor-pointer',
                        expandedOrderId === order.id
                          ? 'bg-rose-500 hover:bg-rose-600 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      ]"
                      :title="expandedOrderId === order.id ? 'Cerrar detalle del pedido' : 'Ver productos y detalle completo'"
                    >
                      <Minus v-if="expandedOrderId === order.id" class="w-3.5 h-3.5 stroke-[3]" />
                      <Plus v-else class="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </td>

                  <!-- Action Buttons -->
                  <td class="py-2.5 px-2 text-center relative">
                    <div class="flex items-center justify-center gap-1.5">
                      <!-- Gear Nut Icon Button (SISFS Style Dropdown Trigger) -->
                      <button
                        type="button"
                        @click.stop="toggleActionMenu(order.id, $event)"
                        :class="[
                          'p-1.5 rounded shadow-2xs transition-colors cursor-pointer',
                          activeActionMenuId === order.id
                            ? 'bg-emerald-800 text-white ring-2 ring-emerald-400'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        ]"
                        title="Opciones del pedido (Ver, Editar, Eliminar)"
                      >
                        <Settings class="w-3.5 h-3.5" />
                      </button>

                      <!-- Direct Official WhatsApp Action Button -->
                      <a
                        :href="buildWhatsAppLink(order)"
                        target="_blank"
                        class="p-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded shadow-2xs transition-all hover:scale-105 flex items-center justify-center"
                        title="Abrir WhatsApp oficial con mensaje predeterminado"
                      >
                        <IconWhatsApp customClass="w-3.5 h-3.5 text-white fill-current" />
                      </a>
                    </div>

                    <!-- FLOATING OPTIONS DROPDOWN (EXACTLY AS IN USER'S SISFS SCREENSHOT) -->
                    <div
                      v-if="activeActionMenuId === order.id"
                      @click.stop
                      class="absolute left-10 top-1 z-50 bg-white rounded-lg border border-gray-200 shadow-xl py-1.5 w-44 text-left divide-y divide-gray-100 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <div class="py-0.5">
                        <!-- Ver pedido -->
                        <button
                          type="button"
                          @click="handleViewOrder(order)"
                          class="w-full px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-cyan-50 hover:text-cyan-800 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                        >
                          <Eye class="w-4 h-4 text-[#0097a7] shrink-0" />
                          <span>Ver pedido</span>
                        </button>

                        <!-- Editar Pedido -->
                        <button
                          type="button"
                          @click="handleEditOrder(order)"
                          class="w-full px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                        >
                          <Edit3 class="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Editar Pedido</span>
                        </button>
                      </div>

                      <div class="py-0.5">
                        <!-- Eliminar Pedido -->
                        <button
                          type="button"
                          @click="handleDeleteOrderRequest(order)"
                          class="w-full px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                        >
                          <Trash2 class="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Eliminar Pedido</span>
                        </button>
                      </div>
                    </div>
                  </td>

                  <!-- COD (ID) -->
                  <td class="py-2.5 px-3 font-mono font-bold text-gray-700">
                    <span class="text-[#1b2b48]">VZ-{{ order.id.substring(0, 6).toUpperCase() }}</span>
                  </td>

                  <!-- FECHA -->
                  <td class="py-2.5 px-3 text-gray-600 whitespace-nowrap">
                    <div>{{ formatOrderDate(order.created) }}</div>
                    <div class="text-[10px] text-gray-400">{{ formatOrderTime(order.created) }}</div>
                  </td>

                  <!-- CLIENTE -->
                  <td class="py-2.5 px-3 font-bold text-gray-800">
                    <div class="truncate max-w-[200px]" :title="order.customer_name">{{ order.customer_name }}</div>
                    <div v-if="order.customer_email" class="text-[10px] text-gray-400 font-normal truncate max-w-[200px]">
                      {{ order.customer_email }}
                    </div>
                  </td>

                  <!-- CELULAR -->
                  <td class="py-2.5 px-3 font-mono text-gray-700 whitespace-nowrap">
                    <a
                      v-if="order.customer_phone"
                      :href="`tel:${order.customer_phone}`"
                      class="hover:text-blue-600 flex items-center gap-1"
                    >
                      <span>{{ order.customer_phone }}</span>
                    </a>
                    <span v-else class="text-gray-400 italic">Sin teléfono</span>
                  </td>

                  <!-- DISTRITO / CIUDAD (ENLACE A GOOGLE MAPS DIRECTO) -->
                  <td class="py-2.5 px-3">
                    <a
                      :href="getMapsLink(order)"
                      target="_blank"
                      class="group inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline max-w-[240px]"
                      :title="`Abrir en Google Maps: ${order.customer_address}`"
                    >
                      <MapPin class="w-3.5 h-3.5 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span class="truncate">{{ order.customer_address || 'Entrega coordinada' }}</span>
                      <ExternalLink class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
                    </a>
                  </td>

                  <!-- M. PROD -->
                  <td class="py-2.5 px-3 text-right font-mono text-gray-700 whitespace-nowrap">
                    S/ {{ order.products_total.toFixed(2) }}
                  </td>

                  <!-- DELIVERY (MANUAL) -->
                  <td class="py-2.5 px-3 text-right font-mono whitespace-nowrap">
                    <span v-if="order.delivery_cost > 0" class="text-gray-800 font-semibold">
                      S/ {{ order.delivery_cost.toFixed(2) }}
                    </span>
                    <span v-else class="text-gray-400 text-[11px] italic">
                      S/ 0.00
                    </span>
                  </td>

                  <!-- TOTAL -->
                  <td class="py-2.5 px-3 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                    S/ {{ order.total.toFixed(2) }}
                  </td>

                  <!-- ADEL. (ADELANTO) -->
                  <td class="py-2.5 px-3 text-right font-mono whitespace-nowrap">
                    <span v-if="order.advance > 0" class="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      S/ {{ order.advance.toFixed(2) }}
                    </span>
                    <span v-else class="text-gray-400">
                      S/ 0.00
                    </span>
                  </td>

                  <!-- SALDO (TOTAL - ADELANTO) -->
                  <td class="py-2.5 px-3 text-right font-mono font-bold whitespace-nowrap">
                    <span
                      v-if="order.balance > 0"
                      class="text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded"
                      :title="`Resta pagar S/ ${order.balance.toFixed(2)}`"
                    >
                      S/ {{ order.balance.toFixed(2) }}
                    </span>
                    <span
                      v-else
                      class="text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded text-[10px] tracking-wide"
                    >
                      CANCELADO
                    </span>
                  </td>

                  <!-- ESTADO BADGE -->
                  <td class="py-2.5 px-3 text-center whitespace-nowrap">
                    <!-- OCULTO / ARCHIVADO -->
                    <span
                      v-if="order.hidden"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-200 text-gray-700 text-[10px] font-extrabold tracking-wider uppercase border border-gray-300"
                    >
                      <EyeOff class="w-3 h-3 text-gray-600" />
                      <span>OCULTO</span>
                    </span>

                    <!-- ENTREGADO -->
                    <span
                      v-else-if="order.status === 'delivered'"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-[10px] font-extrabold tracking-wider uppercase border border-blue-300"
                    >
                      <Truck class="w-3 h-3 text-blue-700" />
                      <span>ENTREGADO</span>
                    </span>

                    <!-- DELIVERY PENDIENTE (Productos pagados, delivery pendiente de cobro) -->
                    <span
                      v-else-if="order.status === 'delivery_pending' || (order.advance >= order.products_total && order.delivery_cost > 0 && order.balance > 0)"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-[10px] font-extrabold tracking-wider uppercase border border-amber-300 shadow-2xs"
                      :title="`Productos 100% pagados. Saldo pendiente por delivery: S/ ${order.balance.toFixed(2)}`"
                    >
                      <Truck class="w-3 h-3 text-amber-700" />
                      <span>DELIVERY PEND.</span>
                    </span>

                    <!-- PAGADO (100% CANCELADO, SALDO 0) -->
                    <span
                      v-else-if="(order.status === 'paid' || order.balance <= 0) && order.total > 0"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold tracking-wider uppercase border border-emerald-300"
                    >
                      <CheckCircle2 class="w-3 h-3 text-emerald-700" />
                      <span>PAGADO</span>
                    </span>

                    <!-- CON ADELANTO (PAGO PARCIAL DE PRODUCTOS) -->
                    <span
                      v-else-if="order.advance > 0 && order.balance > 0"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-[10px] font-extrabold tracking-wider uppercase border border-amber-300"
                    >
                      <Clock class="w-3 h-3 text-amber-700" />
                      <span>ADELANTO</span>
                    </span>

                    <!-- PENDIENTE DE PAGO -->
                    <span
                      v-else
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0097a7]/15 text-[#007b8a] text-[10px] font-extrabold tracking-wider uppercase border border-[#0097a7]/40"
                    >
                      <Clock class="w-3 h-3" />
                      <span>PENDIENTE</span>
                    </span>
                  </td>

                  <!-- MÉTODO -->
                  <td class="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      v-if="order.payment_method === 'culqi'"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase"
                      title="Pagado online mediante pasarela Culqi"
                    >
                      <CreditCard class="w-3 h-3 text-purple-600" />
                      <span>Culqi</span>
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase"
                      title="Coordinación y pago vía WhatsApp"
                    >
                      <IconWhatsApp customClass="w-3 h-3 text-emerald-600 fill-current" />
                      <span>WhatsApp</span>
                    </span>
                  </td>
                </tr>

                <!-- ========================================================= -->
                <!-- ACCORDION EXPANDED SUB-TABLE (MATCHING USER'S SISFS IMAGE) -->
                <!-- ========================================================= -->
                <tr v-if="expandedOrderId === order.id" class="bg-blue-50/40">
                  <td colspan="15" class="p-3 sm:p-5 border-t border-b border-blue-200">
                    <div class="space-y-4 max-w-6xl mx-auto">
                      <!-- 1. NESTED SUB-TABLE OF ITEMS (Identical to Image 2 & 3) -->
                      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
                        <div class="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                          <span class="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                            <ShoppingBag class="w-3.5 h-3.5 text-blue-600" />
                            <span>Detalle de Productos / Arreglos del Pedido</span>
                          </span>
                          <span class="text-[11px] text-gray-500 font-semibold">
                            {{ (order.items || []).length }} item(s) en este pedido
                          </span>
                        </div>

                        <table class="w-full text-left text-xs">
                          <thead class="bg-gray-50 text-gray-600 border-b border-gray-200 text-[11px] uppercase font-bold">
                            <tr>
                              <th class="py-2.5 px-3 w-16 text-center">Foto</th>
                              <th class="py-2.5 px-3">Detalle del Arreglo / Producto</th>
                              <th class="py-2.5 px-3 text-center w-24">Unidades</th>
                              <th class="py-2.5 px-3 text-right w-28">Precio Unitario</th>
                              <th class="py-2.5 px-3 text-right w-28">Total</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-100 font-medium">
                            <tr v-for="(it, idx) in order.items" :key="idx" class="hover:bg-gray-50/50">
                              <!-- Foto (con fallback inteligente a imagen del catálogo) -->
                              <td class="py-2 px-3 text-center">
                                <img
                                  :src="getItemImage(it)"
                                  :alt="it.name || it.producto"
                                  class="w-11 h-11 object-cover rounded-lg border border-gray-200 mx-auto shadow-2xs"
                                  loading="lazy"
                                />
                              </td>

                              <!-- Detalle -->
                              <td class="py-2 px-3 font-semibold text-gray-800">
                                <div class="text-xs">{{ it.name || it.producto || 'Detalle Floral Venezzia' }}</div>
                                <div v-if="it.addon" class="text-[11px] text-purple-700 font-normal">
                                  + {{ it.addon }}
                                </div>
                              </td>

                              <!-- Unidades -->
                              <td class="py-2 px-3 text-center font-mono font-bold text-gray-800">
                                {{ getItemQty(it) }}
                              </td>

                              <!-- Precio Unitario (Formateado y limpio de S/ NaN) -->
                              <td class="py-2 px-3 text-right font-mono text-gray-700 font-semibold">
                                S/ {{ getItemPrice(it, order).toFixed(2) }}
                              </td>

                              <!-- Subtotal -->
                              <td class="py-2 px-3 text-right font-mono font-bold text-gray-900">
                                S/ {{ getItemSubtotal(it, order).toFixed(2) }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- 2. LOWER DETAIL SECTION (Delivery Info, GPS, Dedication & Financial Editor) -->
                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <!-- CARD 1: ENTREGA Y DEDICATORIA (CON ENLACE CLICKLEABLE DIRECTO A MAPS) -->
                        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-xs space-y-3">
                          <h4 class="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                            <MapPin class="w-3.5 h-3.5 text-rose-500" />
                            <span>Datos de Entrega y Dedicatoria</span>
                          </h4>

                          <div class="space-y-2 text-xs">
                            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
                              <span>Dirección de Entrega:</span>
                              <span class="text-blue-600 font-normal text-[10px]">Toca para abrir Maps ↗</span>
                            </div>

                            <!-- Enlace de dirección que abre en la app o navegador de Maps -->
                            <a
                              :href="getMapsLink(order)"
                              target="_blank"
                              class="group block bg-blue-50/80 hover:bg-blue-100 p-2.5 rounded-lg border border-blue-200 transition-colors"
                              title="Toca para abrir esta ubicación en Google Maps (Móvil o PC)"
                            >
                              <div class="flex items-start gap-2">
                                <MapPin class="w-4 h-4 text-rose-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span class="font-semibold text-blue-900 group-hover:underline break-words leading-relaxed">
                                  {{ order.customer_address || 'Dirección por coordinar' }}
                                </span>
                                <ExternalLink class="w-3.5 h-3.5 text-blue-600 shrink-0 opacity-70 group-hover:opacity-100 ml-auto mt-0.5" />
                              </div>
                            </a>

                            <!-- Sección GPS Exacto / Pegar link de WhatsApp -->
                            <div class="pt-1.5 space-y-1.5">
                              <div
                                v-if="order.location_url && activeGpsEditingOrderId !== order.id"
                                class="flex items-center justify-between gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs"
                              >
                                <div class="flex items-center gap-1.5 text-emerald-800 font-semibold truncate">
                                  <Navigation class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span class="truncate">GPS Vinculado</span>
                                </div>
                                <div class="flex items-center gap-2 shrink-0">
                                  <a
                                    :href="order.location_url"
                                    target="_blank"
                                    class="text-emerald-700 hover:text-emerald-900 underline font-bold text-[11px] flex items-center gap-0.5"
                                  >
                                    <span>Ver en Maps</span>
                                    <ExternalLink class="w-3 h-3" />
                                  </a>
                                  <button
                                    type="button"
                                    @click="openGpsEditor(order)"
                                    class="text-blue-600 hover:text-blue-800 font-semibold text-[11px] underline cursor-pointer"
                                  >
                                    Cambiar
                                  </button>
                                </div>
                              </div>

                              <div v-else-if="activeGpsEditingOrderId !== order.id">
                                <button
                                  type="button"
                                  @click="openGpsEditor(order)"
                                  class="w-full py-1.5 px-3 border border-dashed border-emerald-400 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                  title="Si el cliente te mandó su ubicación por WhatsApp, pégala aquí para incluirla en la ruta de Google Maps"
                                >
                                  <Navigation class="w-3.5 h-3.5 text-emerald-600" />
                                  <span>+ Pegar link GPS enviado por WhatsApp</span>
                                </button>
                              </div>

                              <!-- Formulario inline para pegar link de WhatsApp -->
                              <div
                                v-if="activeGpsEditingOrderId === order.id"
                                class="p-2.5 bg-emerald-50/90 border border-emerald-300 rounded-lg space-y-2 text-xs animate-in fade-in"
                              >
                                <div class="flex items-center justify-between font-bold text-emerald-900 text-[11px]">
                                  <span>Pegar enlace de WhatsApp o Google Maps:</span>
                                  <button
                                    type="button"
                                    @click="activeGpsEditingOrderId = null"
                                    class="text-gray-400 hover:text-gray-600 cursor-pointer"
                                  >
                                    <X class="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div class="flex items-center gap-1.5">
                                  <input
                                    type="url"
                                    v-model="tempGpsUrl"
                                    placeholder="https://maps.app.goo.gl/... o https://maps.google.com/?q=..."
                                    class="flex-1 px-2.5 py-1.5 bg-white rounded border border-gray-300 text-xs focus:border-emerald-600 focus:outline-none"
                                    @keydown.enter.prevent="saveOrderGps(order)"
                                  />
                                  <button
                                    type="button"
                                    @click="saveOrderGps(order)"
                                    :disabled="isSavingGps"
                                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold cursor-pointer transition-colors disabled:opacity-50 shrink-0"
                                  >
                                    {{ isSavingGps ? '...' : 'Guardar' }}
                                  </button>
                                </div>
                                <p class="text-[10px] text-gray-500">
                                  Copia el enlace de ubicación del chat de WhatsApp y pégalo aquí para incluirlo automáticamente en la ruta.
                                </p>
                              </div>
                            </div>

                            <!-- Dedicatoria -->
                            <div class="pt-1 border-t border-gray-100">
                              <div class="text-gray-500 text-[11px] flex items-center gap-1 mb-1 font-bold">
                                <Heart class="w-3 h-3 text-rose-400" />
                                <span>Dedicatoria para la Tarjeta:</span>
                              </div>
                              <blockquote v-if="order.notes" class="italic text-gray-800 bg-amber-50/70 p-2.5 rounded-lg border-l-4 border-amber-400 text-xs">
                                "{{ order.notes }}"
                              </blockquote>
                              <div v-else class="text-gray-400 italic text-[11px] bg-gray-50 p-2 rounded">
                                Sin dedicatoria registrada en este pedido
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- CARD 2: GESTIÓN FINANCIERA (DELIVERY & ADELANTO EDITABLE) -->
                        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-xs space-y-3">
                          <h4 class="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                            <DollarSign class="w-3.5 h-3.5 text-emerald-600" />
                            <span>Ajuste Financiero (Delivery y Adelanto)</span>
                          </h4>

                          <!-- Input Costo Delivery Manual -->
                          <div class="space-y-1.5">
                            <div class="flex items-center justify-between text-[11px]">
                              <label class="font-bold text-gray-700 uppercase">Costo Delivery (S/)</label>
                              <span class="text-gray-400">0 si es recojo / agencia</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                              <span class="text-xs font-bold text-gray-500">S/</span>
                              <input
                                type="number"
                                step="1"
                                min="0"
                                v-model.number="editingDelivery[order.id]"
                                class="w-24 px-2.5 py-1.5 rounded border border-gray-300 text-xs font-mono font-bold focus:border-blue-500 focus:outline-none"
                              />
                              <button
                                @click="saveFinancials(order)"
                                :disabled="isSavingFinancials[order.id]"
                                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer transition-colors"
                              >
                                {{ isSavingFinancials[order.id] ? '...' : 'Guardar' }}
                              </button>
                            </div>

                            <!-- Botones rápidos de 1 toque para delivery -->
                            <div class="flex items-center gap-1 flex-wrap pt-1 text-[10px]">
                              <button
                                @click="setQuickDelivery(order, 0)"
                                class="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200 cursor-pointer"
                              >
                                S/ 0 (Recojo)
                              </button>
                              <button
                                @click="setQuickDelivery(order, 10)"
                                class="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200 cursor-pointer"
                              >
                                S/ 10
                              </button>
                              <button
                                @click="setQuickDelivery(order, 15)"
                                class="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200 cursor-pointer"
                              >
                                S/ 15
                              </button>
                              <button
                                @click="setQuickDelivery(order, 20)"
                                class="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200 cursor-pointer"
                              >
                                S/ 20
                              </button>
                            </div>
                          </div>

                          <!-- Input Adelanto Manual -->
                          <div class="space-y-1.5 pt-2 border-t border-gray-100">
                            <div class="flex items-center justify-between text-[11px]">
                              <label class="font-bold text-gray-700 uppercase">Adelanto Recibido (S/)</label>
                              <span class="text-gray-400">Normalmente S/ 30 o 50%</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                              <span class="text-xs font-bold text-gray-500">S/</span>
                              <input
                                type="number"
                                step="1"
                                min="0"
                                v-model.number="editingAdvance[order.id]"
                                class="w-24 px-2.5 py-1.5 rounded border border-gray-300 text-xs font-mono font-bold focus:border-blue-500 focus:outline-none"
                              />
                              <button
                                @click="saveFinancials(order)"
                                :disabled="isSavingFinancials[order.id]"
                                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold cursor-pointer transition-colors"
                              >
                                {{ isSavingFinancials[order.id] ? '...' : 'Aplicar' }}
                              </button>
                            </div>

                            <!-- Botones rápidos de 1 toque para adelanto -->
                            <div class="flex items-center gap-1 flex-wrap pt-1 text-[10px]">
                              <button
                                @click="setQuickAdvance(order, 30)"
                                class="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 font-semibold cursor-pointer"
                              >
                                S/ 30 (Fijo)
                              </button>
                              <button
                                @click="setQuickAdvance(order, Math.round(order.total / 2))"
                                class="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 font-semibold cursor-pointer"
                              >
                                50% (S/ {{ Math.round(order.total / 2) }})
                              </button>
                              <button
                                @click="setQuickAdvance(order, order.total)"
                                class="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 font-semibold cursor-pointer"
                              >
                                100% Total
                              </button>
                            </div>
                          </div>

                          <!-- Resumen de Saldo Calculado en Tiempo Real -->
                          <div class="bg-gray-50 p-2.5 rounded-lg border border-gray-200 space-y-1 text-xs">
                            <div class="flex justify-between text-gray-500">
                              <span>Monto Productos:</span>
                              <span class="font-mono">S/ {{ (order.products_total || 0).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-gray-500">
                              <span>Delivery:</span>
                              <span class="font-mono">+ S/ {{ getSafeDelivery(order).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between font-bold text-gray-800 border-t pt-1">
                              <span>Total a Pagar:</span>
                              <span class="font-mono">S/ {{ getSafeTotal(order).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-emerald-700">
                              <span>Adelanto Abonado:</span>
                              <span class="font-mono">- S/ {{ getSafeAdvance(order).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between font-bold text-base border-t pt-1">
                              <span>Saldo Restante:</span>
                              <span
                                :class="[
                                  'font-mono',
                                  getSafeBalance(order) > 0
                                    ? 'text-rose-600'
                                    : 'text-emerald-700'
                                ]"
                              >
                                S/ {{ getSafeBalance(order).toFixed(2) }}
                                <span
                                  v-if="getSafeBalance(order) === 0"
                                  class="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded ml-1"
                                >
                                  CANCELADO
                                </span>
                              </span>
                            </div>
                          </div>

                          <!-- Botón rápido directo si solo resta pagar el delivery -->
                          <div
                            v-if="order.delivery_cost > 0 && order.advance >= order.products_total && order.balance > 0"
                            class="pt-1"
                          >
                            <button
                              type="button"
                              @click="payDeliveryAndClearBalance(order)"
                              :disabled="isSavingFinancials[order.id]"
                              class="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                              title="Registrar pago del delivery por Yape/Plin y pasar a PAGADO"
                            >
                              <Truck class="w-3.5 h-3.5" />
                              <span>Cobrar Delivery (+S/ {{ order.balance.toFixed(2) }}) → Marcar PAGADO</span>
                            </button>
                          </div>
                        </div>

                        <!-- CARD 3: ACCIONES RÁPIDAS DE ESTADO Y COMUNICACIÓN -->
                        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-xs space-y-3">
                          <h4 class="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                            <Tag class="w-3.5 h-3.5 text-blue-600" />
                            <span>Cambiar Estado y Acciones</span>
                          </h4>

                          <!-- Botones de Cambio de Estado con 1 Clic -->
                          <div class="space-y-1.5">
                            <div class="text-[11px] font-bold text-gray-600 uppercase">Cambiar Estado Directo:</div>
                            <div class="grid grid-cols-3 gap-1.5">
                              <button
                                @click="quickUpdateStatus(order, 'pending')"
                                :class="[
                                  'py-2 px-1 rounded text-[11px] font-bold uppercase transition-all cursor-pointer text-center',
                                  order.status === 'pending'
                                    ? 'bg-[#0097a7] text-white shadow-xs'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                ]"
                              >
                                Pendiente
                              </button>
                              <button
                                @click="quickUpdateStatus(order, 'paid')"
                                :class="[
                                  'py-2 px-1 rounded text-[11px] font-bold uppercase transition-all cursor-pointer text-center',
                                  order.status === 'paid'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                ]"
                              >
                                Pagado
                              </button>
                              <button
                                @click="quickUpdateStatus(order, 'delivered')"
                                :class="[
                                  'py-2 px-1 rounded text-[11px] font-bold uppercase transition-all cursor-pointer text-center',
                                  order.status === 'delivered'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                ]"
                              >
                                Entregado
                              </button>
                            </div>
                          </div>

                          <!-- Contactar WhatsApp con Icono Oficial -->
                          <div class="pt-2">
                            <a
                              :href="buildWhatsAppLink(order)"
                              target="_blank"
                              class="w-full py-2.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs hover:scale-[1.01]"
                            >
                              <IconWhatsApp customClass="w-4 h-4 text-white fill-current" />
                              <span>Escribir por WhatsApp</span>
                            </a>
                            <p class="text-[10px] text-gray-400 text-center mt-1">
                              {{ (order.advance >= order.products_total && order.delivery_cost > 0 && order.balance > 0) ? 'Mensaje: Saldo pendiente por delivery' : (order.balance <= 0 ? 'Mensaje: Pedido 100% Pagado' : 'Mensaje: Saldo pendiente y anticipo') }}
                            </p>
                          </div>

                          <!-- Ocultar (Soft Delete) y Eliminar (Hard Delete) -->
                          <div class="pt-2 border-t border-gray-100 flex items-center gap-2">
                            <button
                              v-if="!order.hidden"
                              @click="handleHideOrder(order)"
                              class="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-800 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              title="Ocultar de la lista activa conservando los datos del cliente"
                            >
                              <EyeOff class="w-3.5 h-3.5" />
                              <span>Ocultar / Archivar</span>
                            </button>
                            <button
                              v-else
                              @click="handleUnhideOrder(order)"
                              class="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              title="Restaurar a la lista activa"
                            >
                              <Eye class="w-3.5 h-3.5" />
                              <span>Restaurar</span>
                            </button>

                            <button
                              @click="confirmPermanentDelete(order)"
                              class="py-1.5 px-2 bg-gray-100 hover:bg-rose-100 text-gray-500 hover:text-rose-700 rounded text-xs transition-colors cursor-pointer"
                              title="Eliminar registro definitivamente"
                            >
                              <Trash2 class="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- ========================================================= -->
    <!-- MODAL: + REGISTRAR PEDIDO MANUAL (CUANDO LLAMAN O EN TIENDA) -->
    <!-- ========================================================= -->
    <div
      v-if="showNewOrderModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-2xl max-w-xl w-full p-6 border border-gray-200 shadow-2xl my-auto space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Plus class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-gray-800 text-base">Registrar Nuevo Pedido</h3>
              <p class="text-xs text-gray-500">Para clientes que compran por llamada, tienda o chat manual.</p>
            </div>
          </div>
          <button @click="showNewOrderModal = false" class="text-gray-400 hover:text-gray-600 p-1">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitManualOrder" class="space-y-3 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 uppercase mb-1">Nombre del Cliente *</label>
              <input
                type="text"
                v-model="newOrder.customer_name"
                required
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Ej: Lucía Rodríguez"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 uppercase mb-1">Celular *</label>
              <input
                type="tel"
                v-model="newOrder.customer_phone"
                required
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Ej: 955316516"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-700 uppercase mb-1">Dirección y Distrito de Entrega *</label>
            <input
              type="text"
              v-model="newOrder.customer_address"
              required
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="Ej: Av. Pardo 450, Miraflores, Lima"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-700 uppercase mb-1">Enlace GPS / Google Maps (Opcional)</label>
            <input
              type="url"
              v-model="newOrder.location_url"
              placeholder="https://maps.app.goo.gl/... o https://maps.google.com/?q=..."
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
            />
            <p class="text-[10px] text-gray-400 mt-0.5">Enlace enviado por WhatsApp para fijar en la ruta del motorizado.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block font-bold text-gray-700 uppercase mb-1">Producto o Arreglo *</label>
              <input
                type="text"
                v-model="newOrder.product_name"
                required
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Ej: Ramo 24 Rosas Eternas + Osito"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 uppercase mb-1">Precio Producto (S/) *</label>
              <input
                type="number"
                step="0.5"
                min="0"
                v-model.number="newOrder.product_price"
                required
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none font-mono font-bold"
                placeholder="85.00"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 uppercase mb-1">Costo Delivery (S/)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                v-model.number="newOrder.delivery_cost"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none font-mono font-bold"
                placeholder="0.00"
              />
              <span class="text-[10px] text-gray-400">0 si es recojo o pago en agencia</span>
            </div>
            <div>
              <label class="block font-bold text-gray-700 uppercase mb-1">Adelanto Recibido (S/)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                v-model.number="newOrder.advance"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none font-mono font-bold"
                placeholder="0.00"
              />
              <span class="text-[10px] text-gray-400">Normalmente S/ 30 o 50%</span>
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-700 uppercase mb-1">Dedicatoria para la Tarjeta (Opcional)</label>
            <textarea
              v-model="newOrder.notes"
              rows="2"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="Mensaje de amor, cumpleaños o felicitaciones..."
            ></textarea>
          </div>

          <!-- Total Preview -->
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center text-xs">
            <div>
              <span class="text-gray-500">Total a pagar: </span>
              <span class="font-bold font-mono text-gray-900">S/ {{ ((newOrder.product_price || 0) + (newOrder.delivery_cost || 0)).toFixed(2) }}</span>
            </div>
            <div>
              <span class="text-rose-600 font-bold">Saldo restante: </span>
              <span class="font-bold font-mono text-rose-600">
                S/ {{ Math.max(0, ((newOrder.product_price || 0) + (newOrder.delivery_cost || 0)) - (newOrder.advance || 0)).toFixed(2) }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              @click="showNewOrderModal = false"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmittingOrder"
              class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="isSubmittingOrder" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmittingOrder ? 'Guardando...' : 'Guardar Pedido' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- MODAL: EDITAR PEDIDO (DESDE EL MENÚ DE LA TUERCA) -->
    <!-- ========================================================= -->
    <div
      v-if="showEditOrderModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      @click.self="showEditOrderModal = false"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 border border-gray-200 shadow-2xl my-auto space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Edit3 class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-gray-800 text-base">Editar Pedido VZ-{{ editOrderForm.id.substring(0, 6).toUpperCase() }}</h3>
              <p class="text-xs text-gray-500">Modifica datos del cliente, entrega, delivery o estado.</p>
            </div>
          </div>
          <button @click="showEditOrderModal = false" class="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitEditOrder" class="space-y-3 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 uppercase mb-1">Nombre del Cliente</label>
              <input
                type="text"
                v-model="editOrderForm.customer_name"
                required
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 uppercase mb-1">Celular</label>
              <input
                type="tel"
                v-model="editOrderForm.customer_phone"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-700 uppercase mb-1">Dirección / Distrito de Entrega</label>
            <input
              type="text"
              v-model="editOrderForm.customer_address"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block font-bold text-gray-700 uppercase mb-1">Enlace GPS / Google Maps (WhatsApp)</label>
            <input
              type="url"
              v-model="editOrderForm.location_url"
              placeholder="https://maps.app.goo.gl/... o https://maps.google.com/?q=..."
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
            />
            <p class="text-[10px] text-gray-400 mt-0.5">Pega aquí el enlace si el cliente lo mandó por WhatsApp para incluirlo en la ruta.</p>
          </div>

          <div>
            <label class="block font-bold text-gray-700 uppercase mb-1">Dedicatoria para la Tarjeta</label>
            <textarea
              v-model="editOrderForm.notes"
              rows="2"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 uppercase mb-1">Costo Delivery (S/)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                v-model.number="editOrderForm.delivery_cost"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none font-mono font-bold"
              />
              <div class="flex items-center gap-1 pt-1 text-[10px]">
                <button type="button" @click="editOrderForm.delivery_cost = 0" class="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded border cursor-pointer">S/ 0</button>
                <button type="button" @click="editOrderForm.delivery_cost = 10" class="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded border cursor-pointer">S/ 10</button>
                <button type="button" @click="editOrderForm.delivery_cost = 15" class="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded border cursor-pointer">S/ 15</button>
                <button type="button" @click="editOrderForm.delivery_cost = 20" class="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded border cursor-pointer">S/ 20</button>
              </div>
            </div>

            <div>
              <label class="block font-bold text-gray-700 uppercase mb-1">Adelanto Recibido (S/)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                v-model.number="editOrderForm.advance"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none font-mono font-bold"
              />
              <div class="flex items-center gap-1 pt-1 text-[10px]">
                <button type="button" @click="editOrderForm.advance = 30" class="px-1.5 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 font-semibold cursor-pointer">S/ 30</button>
                <button type="button" @click="editOrderForm.advance = (selectedOrderTotal)" class="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 font-semibold cursor-pointer">100%</button>
              </div>
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-700 uppercase mb-1">Estado del Pedido</label>
            <select
              v-model="editOrderForm.status"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-semibold focus:border-blue-500 focus:outline-none"
            >
              <option value="pending">PENDIENTE DE PAGO</option>
              <option value="delivery_pending">DELIVERY PENDIENTE (SOLO SALDO DE ENVÍO)</option>
              <option value="paid">PAGADO (100%)</option>
              <option value="delivered">ENTREGADO</option>
            </select>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              @click="showEditOrderModal = false"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSavingEditOrder"
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="isSavingEditOrder" class="w-4 h-4 animate-spin" />
              <span>{{ isSavingEditOrder ? 'Guardando...' : 'Guardar Cambios' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- MODAL: ELIMINAR PEDIDO CON VERIFICACIÓN DE CONTRASEÑA -->
    <!-- ========================================================= -->
    <div
      v-if="orderToDelete"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="orderToDelete = null"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Trash2 class="w-6 h-6" />
        </div>

        <div>
          <h3 class="font-bold text-gray-900 text-base">Eliminar Pedido</h3>
          <p class="text-xs text-gray-700 font-bold mt-1">
            VZ-{{ orderToDelete.id.substring(0, 6).toUpperCase() }} • {{ orderToDelete.customer_name }}
          </p>
          <p class="text-[11px] text-gray-500 mt-1">
            Esta acción borrará permanentemente este registro. Por seguridad, confirma con tu contraseña de administrador:
          </p>
        </div>

        <!-- Formulario con campo de contraseña -->
        <form @submit.prevent="executePermanentDelete" class="space-y-3 text-left">
          <div>
            <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1 flex items-center justify-between">
              <span>Contraseña de Administrador *</span>
              <Lock class="w-3.5 h-3.5 text-gray-400" />
            </label>
            <input
              type="password"
              v-model="deletePassword"
              required
              autofocus
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div v-if="deletePasswordError" class="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-1.5">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ deletePasswordError }}</span>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              @click="orderToDelete = null"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isDeletingOrder"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <Loader2 v-if="isDeletingOrder" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isDeletingOrder ? 'Verificando...' : 'Confirmar y Eliminar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- MODAL: CONFIGURAR NÚMERO YAPE / PLIN -->
    <!-- ========================================================= -->
    <div
      v-if="showYapeConfigModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showYapeConfigModal = false"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        <div class="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
          <Smartphone class="w-6 h-6" />
        </div>

        <div>
          <h3 class="font-bold text-gray-900 text-base">Número de Yape / Plin</h3>
          <p class="text-xs text-gray-500 mt-1">
            Este número se insertará automáticamente en todos los mensajes de WhatsApp para el cobro de delivery o saldos.
          </p>
        </div>

        <form @submit.prevent="saveYapePhoneNumber" class="space-y-3 text-left">
          <div>
            <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">
              Número de Celular (Yape / Plin) *
            </label>
            <input
              type="text"
              v-model="tempYapePhone"
              required
              placeholder="926 420 003"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              @click="showYapeConfigModal = false"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-colors"
            >
              Guardar Número
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- FLOATING ROUTE BAR (STICKY AT BOTTOM WHEN ORDERS SELECTED) -->
    <!-- ========================================================= -->
    <div
      v-if="selectedOrderIds.length > 0"
      class="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700/60 flex items-center gap-3 sm:gap-5 animate-in slide-in-from-bottom duration-200 max-w-xl w-[92%]"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
          <Route class="w-4 h-4 text-blue-400" />
        </div>
        <div class="truncate">
          <div class="font-bold text-xs truncate">
            {{ selectedOrderIds.length }} {{ selectedOrderIds.length === 1 ? 'pedido seleccionado' : 'pedidos seleccionados' }}
          </div>
          <div class="text-[10px] text-gray-400 truncate">
            Listo para armar la ruta en Google Maps
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 ml-auto shrink-0">
        <button
          type="button"
          @click="openRouteModal"
          class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
        >
          <Navigation class="w-3.5 h-3.5" />
          <span>Generar Ruta</span>
        </button>
        <button
          type="button"
          @click="clearSelection"
          class="text-gray-400 hover:text-white p-1.5 rounded-lg text-xs cursor-pointer"
          title="Deseleccionar todos"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- MODAL: GENERADOR Y PLANIFICADOR DE RUTA DE DELIVERY -->
    <!-- ========================================================= -->
    <div
      v-if="showRouteModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      @click.self="showRouteModal = false"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        <!-- Header -->
        <div class="px-5 py-3.5 bg-gradient-to-r from-[#1e293b] to-[#2563eb] text-white flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shadow-xs">
              <Route class="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 class="font-bold text-sm">Ruta de Despacho en Google Maps</h3>
              <p class="text-[11px] text-blue-100">
                {{ routeOrdersList.length }} {{ routeOrdersList.length === 1 ? 'parada de entrega' : 'paradas de entrega' }}
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="showRouteModal = false"
            class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          <!-- Punto de partida (Origen) -->
          <div class="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/90 shadow-2xs space-y-2">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <label class="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                <MapPin class="w-3.5 h-3.5 text-rose-500" />
                <span>Punto de Partida (Taller / Tienda):</span>
              </label>

              <!-- Actions on top right -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="openOriginMapModal"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
                  title="Fijar ubicación exacta del taller en el mapa interactivo con GPS o buscador"
                >
                  <MapPin class="w-3 h-3 text-white" />
                  <span>Fijar en Mapa</span>
                </button>

                <button
                  v-if="!isEditingOrigin"
                  type="button"
                  @click="isEditingOrigin = true; tempOriginInput = deliveryOrigin"
                  class="text-blue-700 hover:text-blue-900 font-bold text-[11px] underline cursor-pointer"
                >
                  Editar texto
                </button>
              </div>
            </div>

            <!-- View mode -->
            <div v-if="!isEditingOrigin" class="space-y-1 pl-5">
              <div class="font-semibold text-gray-800 text-xs flex items-center gap-2 flex-wrap">
                <span class="break-words">{{ deliveryOrigin }}</span>
                <span
                  v-if="deliveryOriginCoords"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold"
                >
                  <Navigation class="w-2.5 h-2.5 text-emerald-600" />
                  GPS: {{ deliveryOriginCoords.lat.toFixed(5) }}, {{ deliveryOriginCoords.lng.toFixed(5) }}
                </span>
              </div>

              <div class="flex items-center gap-3 text-[10px] text-blue-600 flex-wrap">
                <span>Desde aquí iniciará la navegación el motorizado.</span>
                <a
                  v-if="deliveryOriginMapUrl"
                  :href="deliveryOriginMapUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold underline"
                >
                  <ExternalLink class="w-2.5 h-2.5" />
                  Ver punto en Google Maps
                </a>
                <button
                  v-if="deliveryOrigin !== DEFAULT_DELIVERY_ORIGIN || deliveryOriginCoords"
                  type="button"
                  @click="resetDeliveryOriginToDefault"
                  class="text-gray-400 hover:text-gray-600 underline cursor-pointer"
                >
                  Restablecer por defecto
                </button>
              </div>
            </div>

            <!-- Edit mode (Text Input + Map Button) -->
            <div v-else class="space-y-2 pt-1 pl-5">
              <div class="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  v-model="tempOriginInput"
                  placeholder="Dirección o referencia del taller (ej: Venezzia Detalles, Lima, Peru)"
                  class="flex-1 min-w-[200px] px-3 py-1.5 bg-white rounded-lg border border-blue-300 text-xs focus:border-blue-600 focus:outline-none"
                  @keydown.enter.prevent="saveDeliveryOrigin"
                />
                <button
                  type="button"
                  @click="saveDeliveryOrigin"
                  class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-2xs"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  @click="openOriginMapModal"
                  class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-2xs"
                >
                  <MapPin class="w-3.5 h-3.5" />
                  <span>Fijar en Mapa</span>
                </button>
                <button
                  type="button"
                  @click="isEditingOrigin = false"
                  class="px-2.5 py-1.5 text-gray-500 hover:text-gray-700 text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
              <p class="text-[10px] text-blue-600">
                Puedes escribir la dirección o hacer clic en <strong>Fijar en Mapa</strong> para ubicarlo con GPS o el mapa interactivo.
              </p>
            </div>
          </div>

          <!-- Secuencia de paradas -->
          <div class="space-y-2">
            <!-- Header con botón Ordenar por Distancia -->
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                  Secuencia de Entregas (Paradas)
                </span>
                <span
                  v-if="routeTotalKmText"
                  class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-mono font-bold flex items-center gap-1"
                >
                  <Zap class="w-2.5 h-2.5 text-purple-600" />
                  <span>~${routeTotalKmText} total</span>
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="optimizeRouteByDistance"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-[11px] shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
                  title="Ordenar automáticamente las paradas por distancia más cercana desde el taller (ruta óptima)"
                >
                  <Zap class="w-3 h-3 text-amber-300" />
                  <span>Ordenar por Distancia</span>
                </button>
                <span class="text-gray-400 text-[10px] hidden sm:inline">
                  Usa ▲ ▼ para ordenar
                </span>
              </div>
            </div>

            <!-- Toast de confirmación de ruta optimizada -->
            <div
              v-if="routeOptimizedToast"
              class="p-2.5 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in"
            >
              <div class="flex items-center gap-2">
                <Zap class="w-4 h-4 text-purple-600 shrink-0" />
                <span>¡Ruta ordenada por distancia desde el punto de inicio!</span>
              </div>
              <span class="text-[11px] font-mono text-purple-700 font-bold">~${routeTotalKmText} total</span>
            </div>

            <!-- Lista de paradas -->
            <div class="space-y-2">
              <div
                v-for="(order, idx) in routeOrdersList"
                :key="order.id"
                class="p-3 bg-gray-50 hover:bg-white rounded-xl border border-gray-200 shadow-2xs flex items-center gap-3 transition-colors"
              >
                <!-- Stop Number Badge -->
                <div class="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs shadow-xs">
                  {{ idx + 1 }}
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0 space-y-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-mono font-bold text-gray-900 bg-gray-200/80 px-1.5 py-0.2 rounded text-[11px]">
                      VZ-{{ order.id.substring(0, 6).toUpperCase() }}
                    </span>
                    <span class="font-bold text-gray-800 truncate">{{ order.customer_name }}</span>
                    <span v-if="order.customer_phone" class="text-gray-500 font-mono text-[11px]">
                      📞 {{ order.customer_phone }}
                    </span>
                  </div>

                  <div class="text-gray-600 truncate flex items-center gap-1.5">
                    <MapPin class="w-3 h-3 text-rose-500 shrink-0" />
                    <span class="truncate">{{ order.customer_address || 'Dirección a coordinar' }}</span>
                  </div>

                  <!-- Badge GPS vs Texto + Distancia + Botón Waze -->
                  <div class="flex items-center gap-2 flex-wrap text-[10px] pt-0.5">
                    <!-- Distancia calculada -->
                    <span
                      v-if="getStopDistanceInfo(idx)"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold"
                    >
                      <Zap class="w-2.5 h-2.5 text-purple-600" />
                      <span>~{{ getStopDistanceInfo(idx).legKm }} km desde {{ getStopDistanceInfo(idx).from }}</span>
                    </span>

                    <!-- Badge GPS vs Texto -->
                    <span
                      v-if="order.location_url"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold"
                    >
                      <Navigation class="w-2.5 h-2.5" />
                      <span>GPS Exacto</span>
                    </span>
                    <button
                      v-else
                      type="button"
                      @click="openStopMapModal(order)"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold transition-colors cursor-pointer"
                      title="Fijar ubicación exacta de esta entrega en el mapa"
                    >
                      <MapPin class="w-2.5 h-2.5 text-amber-700" />
                      <span>🏠 Texto (Fijar GPS)</span>
                    </button>

                    <!-- Botón Waze -->
                    <a
                      :href="getWazeUrlForOrder(order)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8f7fd] hover:bg-[#d0f0fa] text-[#006080] border border-[#a6e2f5] font-bold transition-all cursor-pointer active:scale-95"
                      title="Navegar a esta parada en Waze con tráfico en tiempo real"
                    >
                      <Car class="w-2.5 h-2.5 text-[#0080aa]" />
                      <span>Abrir en Waze ↗</span>
                    </a>

                    <!-- Saldo -->
                    <span
                      v-if="order.balance > 0"
                      class="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200"
                    >
                      Cobrar: S/ {{ order.balance.toFixed(2) }}
                    </span>
                    <span
                      v-else
                      class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                    >
                      PAGADO 100%
                    </span>
                  </div>
                </div>

                <!-- Reorder Controls -->
                <div class="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    @click="moveStopUp(idx)"
                    :disabled="idx === 0"
                    class="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                    title="Mover antes en la ruta"
                  >
                    <ArrowUp class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    @click="moveStopDown(idx)"
                    :disabled="idx === routeOrdersList.length - 1"
                    class="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                    title="Mover después en la ruta"
                  >
                    <ArrowDown class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    @click="removeStopFromRoute(order.id)"
                    class="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer ml-1"
                    title="Quitar de esta ruta"
                  >
                    <X class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Celular del motorizado para envío directo -->
          <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <label class="block font-bold text-gray-700 text-[11px] uppercase">
              Celular del Motorizado (WhatsApp):
            </label>
            <div class="flex items-center gap-2">
              <input
                type="tel"
                v-model="motorizadoPhone"
                @blur="saveMotorizadoPhone"
                placeholder="Ej: 987654321"
                class="flex-1 px-3 py-1.5 bg-white rounded-lg border border-gray-300 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                @click="sendRouteToMotorizadoWhatsApp"
                class="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                <IconWhatsApp class="w-3.5 h-3.5 text-white" />
                <span>Enviar al WhatsApp</span>
              </button>
            </div>
            <p class="text-[10px] text-gray-400">
              Se guardará automáticamente para tus próximos despachos.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2 flex-wrap shrink-0">
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Botón 1: Abrir en Google Maps (Ruta completa) -->
            <a
              :href="getGoogleMapsRouteUrl()"
              target="_blank"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-102 cursor-pointer"
              title="Abrir la ruta secuencial completa en Google Maps"
            >
              <Navigation class="w-3.5 h-3.5" />
              <span>Abrir Ruta en Google Maps ↗</span>
            </a>

            <!-- Botón 2: Iniciar en Waze (1ra Parada) -->
            <a
              :href="firstStopWazeUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3.5 py-2 bg-[#33ccff] hover:bg-[#20b8eb] text-[#00384d] rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-102 cursor-pointer"
              title="Abrir la primera parada en Waze con alertas de tráfico"
            >
              <Car class="w-3.5 h-3.5 text-[#00384d]" />
              <span>Iniciar en Waze (1ra Parada) ↗</span>
            </a>

            <!-- Botón 2: Copiar Hoja de Ruta -->
            <button
              type="button"
              @click="copyRouteSheet"
              class="px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Check v-if="copiedRouteToast" class="w-3.5 h-3.5 text-emerald-600" />
              <Copy v-else class="w-3.5 h-3.5 text-gray-600" />
              <span>{{ copiedRouteToast ? '¡Copiado!' : 'Copiar Texto para WhatsApp' }}</span>
            </button>
          </div>

          <button
            type="button"
            @click="showRouteModal = false"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer ml-auto"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para fijar punto de partida en el mapa interactivo -->
    <LocationPickerModal
      :is-open="showOriginMapModal"
      :initial-coords="deliveryOriginCoords"
      title="Fijar Punto de Partida (Taller / Tienda)"
      subtitle="Mueve el mapa o usa el buscador/GPS para ubicar el punto donde iniciará el delivery"
      @close="showOriginMapModal = false"
      @select="handleOriginSelectedFromMap"
    />

    <!-- Modal para fijar ubicación de una parada específica -->
    <LocationPickerModal
      :is-open="showStopMapModal"
      :initial-coords="activeMapStopOrder ? extractOrderCoordinates(activeMapStopOrder) : null"
      :title="'Fijar Ubicación de Parada • ' + (activeMapStopOrder?.customer_name || '')"
      subtitle="Mueve el mapa o usa el buscador/GPS para ubicar el destino exacto de entrega"
      @close="showStopMapModal = false; activeMapStopOrder = null"
      @select="handleStopLocationSelected"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import {
  Layers,
  Package,
  ExternalLink,
  Lock,
  LogOut,
  RefreshCw,
  Plus,
  Minus,
  Search,
  X,
  Settings,
  Edit3,
  MapPin,
  Navigation,
  Heart,
  DollarSign,
  Tag,
  CheckCircle2,
  Clock,
  Truck,
  EyeOff,
  Eye,
  Trash2,
  AlertCircle,
  Loader2,
  Inbox,
  CreditCard,
  ShoppingBag,
  Smartphone,
  Route,
  Copy,
  Zap,
  Car,
  ArrowUp,
  ArrowDown,
  Check
} from 'lucide-vue-next'
import IconWhatsApp from '../components/icons/IconWhatsApp.vue'
import LocationPickerModal from '../components/LocationPickerModal.vue'
import { fetchOrders, createOrder, updateOrder, deleteOrder } from '../services/orders'
import { pb, resolveProductImage } from '../services/pocketbase'

// Auth state
const isAuthenticated = ref(false)
const loginEmail = ref('')
const loginPassword = ref('')
const isLoggingIn = ref(false)
const loginError = ref('')

// =========================================================
// CONFIGURACIÓN OFICIAL DE NÚMERO YAPE / PLIN
// Puedes cambiar el valor por defecto aquí o desde el botón en la pantalla
// =========================================================
const DEFAULT_YAPE_PHONE = '926 420 003'
const yapePhoneNumber = ref(localStorage.getItem('venezzia_yape_phone') || DEFAULT_YAPE_PHONE)
const showYapeConfigModal = ref(false)
const tempYapePhone = ref(yapePhoneNumber.value)

function openYapeConfigModal() {
  tempYapePhone.value = yapePhoneNumber.value
  showYapeConfigModal.value = true
}

function saveYapePhoneNumber() {
  const clean = tempYapePhone.value.trim() || DEFAULT_YAPE_PHONE
  yapePhoneNumber.value = clean
  localStorage.setItem('venezzia_yape_phone', clean)
  showYapeConfigModal.value = false
}

// Orders data & stats
const orders = ref([])
const stats = reactive({
  pending: 0,
  partial: 0,
  delivery_pending: 0,
  paid: 0,
  delivered: 0,
  hidden: 0,
  total_active: 0,
  total_all: 0
})
const isLoading = ref(false)

// Accordion expanded order ID
const expandedOrderId = ref(null)

// In-line editing models for Delivery & Advance
const editingDelivery = reactive({})
const editingAdvance = reactive({})
const isSavingFinancials = reactive({})

// Safe financial helpers for reactive template rendering & calculation
function getSafeDelivery(order) {
  if (!order) return 0
  const val = editingDelivery[order.id]
  if (val === '') return 0
  if (val === null || val === undefined || isNaN(val)) {
    return Number(order.delivery_cost || 0)
  }
  return Number(val)
}

function getSafeAdvance(order) {
  if (!order) return 0
  const val = editingAdvance[order.id]
  if (val === '') return 0
  if (val === null || val === undefined || isNaN(val)) {
    return Number(order.advance || 0)
  }
  return Number(val)
}

function getSafeTotal(order) {
  if (!order) return 0
  const prodTotal = Number(order.products_total || 0)
  return prodTotal + getSafeDelivery(order)
}

function getSafeBalance(order) {
  if (!order) return 0
  return Math.max(0, getSafeTotal(order) - getSafeAdvance(order))
}

// Filters state
const filters = reactive({
  status: 'active',
  search: '',
  startDate: '',
  endDate: ''
})

let searchDebounceTimer = null

// Modals and action menus
const activeActionMenuId = ref(null)
const showNewOrderModal = ref(false)
const isSubmittingOrder = ref(false)
const orderToDelete = ref(null)
const deletePassword = ref('')
const deletePasswordError = ref('')
const isDeletingOrder = ref(false)

// Edit Order Modal state
const showEditOrderModal = ref(false)
const isSavingEditOrder = ref(false)
const editOrderForm = reactive({
  id: '',
  customer_name: '',
  customer_phone: '',
  customer_address: '',
  notes: '',
  location_url: '',
  delivery_cost: 0,
  advance: 0,
  status: 'pending'
})

const selectedOrderTotal = computed(() => {
  const o = orders.value.find(x => x.id === editOrderForm.id)
  return o ? o.total : 0
})

// New manual order form model
const newOrder = reactive({
  customer_name: '',
  customer_phone: '',
  customer_address: '',
  product_name: '',
  product_price: 85,
  delivery_cost: 0,
  advance: 0,
  notes: '',
  location_url: ''
})

// =========================================================
// GESTIÓN DE RUTAS Y DELIVERY MULTI-PARADA (OPCIÓN A HÍBRIDA)
// =========================================================
const selectedOrderIds = ref([])
const showRouteModal = ref(false)
const DEFAULT_DELIVERY_ORIGIN = 'Venezzia Detalles, Lima, Peru'
const deliveryOrigin = ref(localStorage.getItem('venezzia_delivery_origin') || DEFAULT_DELIVERY_ORIGIN)
const deliveryOriginCoords = ref((() => {
  try {
    const raw = localStorage.getItem('venezzia_delivery_origin_coords')
    return raw ? JSON.parse(raw) : null
  } catch (_) {
    return null
  }
})())
const deliveryOriginMapUrl = ref(localStorage.getItem('venezzia_delivery_origin_map_url') || '')
const showOriginMapModal = ref(false)
const motorizadoPhone = ref(localStorage.getItem('venezzia_motorizado_phone') || '')
const isEditingOrigin = ref(false)
const tempOriginInput = ref('')
const routeOrdersList = ref([])
const copiedRouteToast = ref(false)
const routeOptimizedToast = ref(false)
const activeMapStopOrder = ref(null)
const showStopMapModal = ref(false)

// Inline GPS editor per order
const activeGpsEditingOrderId = ref(null)
const tempGpsUrl = ref('')
const isSavingGps = ref(false)

function toggleSelectOrder(orderId) {
  const idx = selectedOrderIds.value.indexOf(orderId)
  if (idx > -1) {
    selectedOrderIds.value.splice(idx, 1)
  } else {
    selectedOrderIds.value.push(orderId)
  }
}

const isAllVisibleSelected = computed(() => {
  if (orders.value.length === 0) return false
  return orders.value.every(o => selectedOrderIds.value.includes(o.id))
})

function toggleSelectAllVisible() {
  if (isAllVisibleSelected.value) {
    const visibleIds = orders.value.map(o => o.id)
    selectedOrderIds.value = selectedOrderIds.value.filter(id => !visibleIds.includes(id))
  } else {
    orders.value.forEach(o => {
      if (!selectedOrderIds.value.includes(o.id)) {
        selectedOrderIds.value.push(o.id)
      }
    })
  }
}

function clearSelection() {
  selectedOrderIds.value = []
}

function openRouteModal() {
  if (selectedOrderIds.value.length === 0) {
    alert('Por favor selecciona al menos un pedido marcando su casilla para armar la ruta.')
    return
  }
  routeOrdersList.value = selectedOrderIds.value
    .map(id => orders.value.find(o => o.id === id))
    .filter(Boolean)
  showRouteModal.value = true
}

function moveStopUp(index) {
  if (index <= 0) return
  const item = routeOrdersList.value.splice(index, 1)[0]
  routeOrdersList.value.splice(index - 1, 0, item)
}

function moveStopDown(index) {
  if (index >= routeOrdersList.value.length - 1) return
  const item = routeOrdersList.value.splice(index, 1)[0]
  routeOrdersList.value.splice(index + 1, 0, item)
}

function removeStopFromRoute(orderId) {
  routeOrdersList.value = routeOrdersList.value.filter(o => o.id !== orderId)
  const idx = selectedOrderIds.value.indexOf(orderId)
  if (idx > -1) selectedOrderIds.value.splice(idx, 1)
  if (routeOrdersList.value.length === 0) {
    showRouteModal.value = false
  }
}

// =========================================================
// DISTANCIA HAVERSINE, OPTIMIZACIÓN DE RUTA Y SOPORTE WAZE
// =========================================================
function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function extractOrderCoordinates(order) {
  if (!order) return null
  if (order.location_url) {
    const match = order.location_url.match(/([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)/)
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
    }
  }
  if (order.customer_address) {
    const match = order.customer_address.match(/([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)/)
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
    }
  }
  return null
}

function getEffectiveOriginCoords() {
  if (deliveryOriginCoords.value && deliveryOriginCoords.value.lat && deliveryOriginCoords.value.lng) {
    return deliveryOriginCoords.value
  }
  const match = (deliveryOrigin.value || '').match(/([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)/)
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
  }
  return null
}

function optimizeRouteByDistance() {
  if (!routeOrdersList.value || routeOrdersList.value.length <= 1) {
    alert('Se necesitan al menos 2 paradas para ordenar la ruta.')
    return
  }

  const originCoords = getEffectiveOriginCoords()
  if (!originCoords) {
    const shouldPick = confirm(
      'Para ordenar las paradas por distancia con respecto al punto de inicio, primero fija el Punto de Partida (Taller) en el mapa.\n\n¿Deseas abrir el mapa para fijarlo ahora?'
    )
    if (shouldPick) {
      openOriginMapModal()
    }
    return
  }

  // Separar pedidos con GPS de los que sólo tienen texto
  const withCoords = []
  const withoutCoords = []

  routeOrdersList.value.forEach(order => {
    const coords = extractOrderCoordinates(order)
    if (coords) {
      withCoords.push({ order, coords })
    } else {
      withoutCoords.push(order)
    }
  })

  if (withCoords.length === 0) {
    alert('Ninguna de las paradas tiene ubicación GPS fijada aún. Fija la ubicación de los pedidos para calcular las distancias.')
    return
  }

  // Algoritmo Heurístico de Reparto (Sequential Nearest-Neighbor TSP):
  // Comienza en el punto de partida (Taller) y visita en cada paso la parada no visitada más cercana.
  const orderedStops = []
  let currentPos = originCoords
  const unvisited = [...withCoords]

  while (unvisited.length > 0) {
    let nearestIdx = 0
    let minDistance = Infinity

    for (let i = 0; i < unvisited.length; i++) {
      const dist = getHaversineDistanceKm(
        currentPos.lat,
        currentPos.lng,
        unvisited[i].coords.lat,
        unvisited[i].coords.lng
      )
      if (dist < minDistance) {
        minDistance = dist
        nearestIdx = i
      }
    }

    const nextStop = unvisited.splice(nearestIdx, 1)[0]
    orderedStops.push(nextStop.order)
    currentPos = nextStop.coords
  }

  // Agregar paradas sin coordenadas al final
  routeOrdersList.value = [...orderedStops, ...withoutCoords]

  routeOptimizedToast.value = true
  setTimeout(() => {
    routeOptimizedToast.value = false
  }, 4000)
}

function getStopDistanceInfo(idx) {
  if (!routeOrdersList.value || idx < 0 || idx >= routeOrdersList.value.length) return null
  const order = routeOrdersList.value[idx]
  const coords = extractOrderCoordinates(order)
  if (!coords) return null

  const originCoords = getEffectiveOriginCoords()
  if (!originCoords) return null

  if (idx === 0) {
    const dist = getHaversineDistanceKm(originCoords.lat, originCoords.lng, coords.lat, coords.lng)
    return {
      legKm: dist.toFixed(1),
      from: 'Taller',
      isOrigin: true
    }
  }

  let prevCoords = originCoords
  let prevLabel = 'Taller'
  for (let i = idx - 1; i >= 0; i--) {
    const pCoords = extractOrderCoordinates(routeOrdersList.value[i])
    if (pCoords) {
      prevCoords = pCoords
      prevLabel = `Parada ${i + 1}`
      break
    }
  }

  const dist = getHaversineDistanceKm(prevCoords.lat, prevCoords.lng, coords.lat, coords.lng)
  return {
    legKm: dist.toFixed(1),
    from: prevLabel,
    isOrigin: false
  }
}

const routeTotalKmText = computed(() => {
  if (!routeOrdersList.value || routeOrdersList.value.length === 0) return ''
  const originCoords = getEffectiveOriginCoords()
  if (!originCoords) return ''

  let total = 0
  let current = originCoords
  let countWithCoords = 0

  routeOrdersList.value.forEach(order => {
    const coords = extractOrderCoordinates(order)
    if (coords) {
      total += getHaversineDistanceKm(current.lat, current.lng, coords.lat, coords.lng)
      current = coords
      countWithCoords++
    }
  })

  if (countWithCoords === 0) return ''
  return `${total.toFixed(1)} km`
})

function getWazeUrlForOrder(order) {
  if (!order) return '#'
  const coords = extractOrderCoordinates(order)
  if (coords) {
    return `https://waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes`
  }
  const clean = (order.customer_address || '')
    .replace(/\|\s*GPS:[^|]+/g, '')
    .replace(/\|\s*Dedicatoria:[^|]+/g, '')
    .trim()
  const fullAddress = clean.toLowerCase().includes('lima') || clean.toLowerCase().includes('peru')
    ? clean
    : `${clean}, Lima, Peru`
  return `https://waze.com/ul?q=${encodeURIComponent(fullAddress)}&navigate=yes`
}

const firstStopWazeUrl = computed(() => {
  if (!routeOrdersList.value || routeOrdersList.value.length === 0) return '#'
  return getWazeUrlForOrder(routeOrdersList.value[0])
})

function openStopMapModal(order) {
  activeMapStopOrder.value = order
  showStopMapModal.value = true
}

async function handleStopLocationSelected({ lat, lng, mapUrl, addressText }) {
  if (!activeMapStopOrder.value) return
  const order = activeMapStopOrder.value
  const targetId = order.id

  order.location_url = mapUrl
  if (addressText && (!order.customer_address || !order.customer_address.trim())) {
    order.customer_address = addressText
  }

  showStopMapModal.value = false
  activeMapStopOrder.value = null

  try {
    await updateOrder(targetId, {
      location_url: mapUrl,
      customer_address: order.customer_address
    })
  } catch (err) {
    console.error('Error al guardar GPS de la orden:', err)
  }
}

function openOriginMapModal() {
  showOriginMapModal.value = true
}

function handleOriginSelectedFromMap({ lat, lng, mapUrl, addressText }) {
  deliveryOriginCoords.value = { lat, lng }
  deliveryOriginMapUrl.value = mapUrl

  const label = addressText && addressText.trim()
    ? addressText.trim()
    : `Ubicación GPS (${lat.toFixed(5)}, ${lng.toFixed(5)})`

  deliveryOrigin.value = label
  tempOriginInput.value = label
  isEditingOrigin.value = false

  localStorage.setItem('venezzia_delivery_origin', label)
  localStorage.setItem('venezzia_delivery_origin_coords', JSON.stringify({ lat, lng }))
  localStorage.setItem('venezzia_delivery_origin_map_url', mapUrl)
}

function resetDeliveryOriginToDefault() {
  deliveryOrigin.value = DEFAULT_DELIVERY_ORIGIN
  tempOriginInput.value = DEFAULT_DELIVERY_ORIGIN
  deliveryOriginCoords.value = null
  deliveryOriginMapUrl.value = ''
  localStorage.removeItem('venezzia_delivery_origin')
  localStorage.removeItem('venezzia_delivery_origin_coords')
  localStorage.removeItem('venezzia_delivery_origin_map_url')
  isEditingOrigin.value = false
}

function saveDeliveryOrigin() {
  const val = tempOriginInput.value.trim() || DEFAULT_DELIVERY_ORIGIN
  deliveryOrigin.value = val
  localStorage.setItem('venezzia_delivery_origin', val)

  const match = val.match(/([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)/)
  if (match) {
    const coords = { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
    deliveryOriginCoords.value = coords
    deliveryOriginMapUrl.value = `https://maps.google.com/?q=${coords.lat},${coords.lng}`
    localStorage.setItem('venezzia_delivery_origin_coords', JSON.stringify(coords))
    localStorage.setItem('venezzia_delivery_origin_map_url', deliveryOriginMapUrl.value)
  } else {
    deliveryOriginCoords.value = null
    deliveryOriginMapUrl.value = ''
    localStorage.removeItem('venezzia_delivery_origin_coords')
    localStorage.removeItem('venezzia_delivery_origin_map_url')
  }
  isEditingOrigin.value = false
}

function saveMotorizadoPhone() {
  const val = motorizadoPhone.value.trim()
  localStorage.setItem('venezzia_motorizado_phone', val)
}

function getGoogleMapsRouteUrl() {
  if (!routeOrdersList.value || routeOrdersList.value.length === 0) return '#'
  
  let originStr = ''
  if (deliveryOriginCoords.value && deliveryOriginCoords.value.lat && deliveryOriginCoords.value.lng) {
    originStr = `${deliveryOriginCoords.value.lat},${deliveryOriginCoords.value.lng}`
  } else {
    const match = (deliveryOrigin.value || '').match(/([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)/)
    if (match) {
      originStr = `${match[1]},${match[2]}`
    } else {
      originStr = encodeURIComponent((deliveryOrigin.value || DEFAULT_DELIVERY_ORIGIN).trim())
    }
  }
  
  const stops = routeOrdersList.value.map(order => {
    if (order.location_url) {
      const match = order.location_url.match(/([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)/)
      if (match) {
        return `${match[1]},${match[2]}`
      }
    }
    const clean = (order.customer_address || '')
      .replace(/\|\s*GPS:[^|]+/g, '')
      .replace(/\|\s*Dedicatoria:[^|]+/g, '')
      .trim()
    const fullAddress = clean.toLowerCase().includes('lima') || clean.toLowerCase().includes('peru')
      ? clean
      : `${clean}, Lima, Peru`
    return encodeURIComponent(fullAddress)
  })

  return `https://www.google.com/maps/dir/${originStr}/${stops.join('/')}`
}

function buildRouteWhatsAppSheet() {
  const list = routeOrdersList.value.length > 0
    ? routeOrdersList.value
    : selectedOrderIds.value.map(id => orders.value.find(o => o.id === id)).filter(Boolean)

  if (!list || list.length === 0) return ''
  const now = new Date()
  const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const count = list.length

  let lines = []
  lines.push(`🛵 *HOJA DE RUTA DE ENTREGAS - VENEZZIA DETALLES*`)
  lines.push(`📅 *Fecha:* ${dateStr}  |  📦 *Total pedidos:* ${count}`)
  const originWhatsAppText = deliveryOriginCoords.value
    ? `${deliveryOrigin.value || DEFAULT_DELIVERY_ORIGIN} (📍 GPS: ${deliveryOriginCoords.value.lat.toFixed(5)}, ${deliveryOriginCoords.value.lng.toFixed(5)})`
    : (deliveryOrigin.value || DEFAULT_DELIVERY_ORIGIN)
  lines.push(`🌸 *Punto de Salida:* ${originWhatsAppText}`)
  if (routeTotalKmText.value) {
    lines.push(`📏 *Distancia Total Estimada:* ~${routeTotalKmText.value}`)
  }
  lines.push(`═══════════════════════════`)
  lines.push(``)

  list.forEach((order, idx) => {
    const stopNum = idx + 1
    const cod = `VZ-${order.id.substring(0, 6).toUpperCase()}`
    const phone = order.customer_phone ? order.customer_phone.replace(/\D/g, '') : ''
    const cleanAddr = (order.customer_address || 'Dirección por coordinar')
      .replace(/\|\s*GPS:[^|]+/g, '')
      .replace(/\|\s*Dedicatoria:[^|]+/g, '')
      .trim()

    const coords = extractOrderCoordinates(order)
    const gmapsUrl = coords
      ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanAddr + ', Lima, Peru')}`
    const wazeUrl = getWazeUrlForOrder(order)
    const distInfo = getStopDistanceInfo(idx)

    lines.push(`📦 *PARADA #${stopNum}:* ${order.customer_name} (${cod})`)
    if (distInfo) {
      lines.push(`⚡ *Tramo:* ~${distInfo.legKm} km desde ${distInfo.from}`)
    }
    if (phone) lines.push(`📞 *Teléfono:* +51 ${phone}`)
    lines.push(`🏠 *Dirección:* ${cleanAddr}`)

    if (order.balance > 0) {
      lines.push(`💵 *Cobrar Saldo:* S/ ${Number(order.balance).toFixed(2)}`)
    } else {
      lines.push(`✅ *Estado de Pago:* PAGADO 100%`)
    }

    lines.push(`🗺️ *Google Maps:* ${gmapsUrl}`)
    lines.push(`🚗 *Waze:* ${wazeUrl}`)
    lines.push(`───────────────────────────`)
  })

  const fullRouteUrl = getGoogleMapsRouteUrl()
  if (fullRouteUrl && fullRouteUrl !== '#') {
    lines.push(``)
    lines.push(`🗺️ *Ruta Completa en Google Maps (todas las paradas):*`)
    lines.push(fullRouteUrl)
  }

  return lines.join('\n')
}

async function copyRouteSheet() {
  const text = buildRouteWhatsAppSheet()
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copiedRouteToast.value = true
    setTimeout(() => { copiedRouteToast.value = false }, 3000)
  } catch (_) {
    alert('No se pudo copiar automáticamente. Puedes seleccionar y copiar el texto.')
  }
}

async function copyQuickRouteSheet() {
  if (routeOrdersList.value.length === 0 && selectedOrderIds.value.length > 0) {
    routeOrdersList.value = selectedOrderIds.value
      .map(id => orders.value.find(o => o.id === id))
      .filter(Boolean)
  }
  await copyRouteSheet()
}

function sendRouteToMotorizadoWhatsApp() {
  const phone = (motorizadoPhone.value || '').replace(/\D/g, '')
  saveMotorizadoPhone()
  const text = buildRouteWhatsAppSheet()
  const intlPhone = phone ? (phone.startsWith('51') ? phone : `51${phone}`) : ''
  const url = intlPhone
    ? `https://api.whatsapp.com/send?phone=${intlPhone}&text=${encodeURIComponent(text)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

function openGpsEditor(order) {
  activeGpsEditingOrderId.value = order.id
  tempGpsUrl.value = order.location_url || ''
}

async function saveOrderGps(order) {
  const val = tempGpsUrl.value.trim()
  isSavingGps.value = true
  try {
    await updateOrder({
      id: order.id,
      location_url: val
    })
    order.location_url = val
    activeGpsEditingOrderId.value = null
  } catch (err) {
    alert('Error al guardar ubicación GPS: ' + err.message)
  } finally {
    isSavingGps.value = false
  }
}

// Check if user is authenticated (checks localStorage pb_admin_auth or PocketBase authStore)
function checkAuth() {
  try {
    const raw = localStorage.getItem('pb_admin_auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.token) {
        isAuthenticated.value = true
        return true
      }
    }
  } catch (_) {}

  if (pb.authStore.isValid && pb.authStore.isSuperuser) {
    isAuthenticated.value = true
    return true
  }

  isAuthenticated.value = false
  return false
}

// Login
async function loginAsAdmin() {
  if (!loginEmail.value || !loginPassword.value) return
  isLoggingIn.value = true
  loginError.value = ''

  try {
    let authData = null
    try {
      authData = await pb.collection('_superusers').authWithPassword(loginEmail.value, loginPassword.value)
    } catch (_) {
      authData = await pb.admins.authWithPassword(loginEmail.value, loginPassword.value)
    }

    if (authData && authData.token) {
      localStorage.setItem('pb_admin_auth', JSON.stringify({
        token: authData.token,
        record: authData.record || authData.admin
      }))
      isAuthenticated.value = true
      loginPassword.value = ''
      await loadOrders()
    } else {
      throw new Error('No se pudo verificar credenciales.')
    }
  } catch (err) {
    loginError.value = 'Credenciales incorrectas. Verifica tu usuario y contraseña de PocketBase.'
  } finally {
    isLoggingIn.value = false
  }
}

function handleLogout() {
  localStorage.removeItem('pb_admin_auth')
  pb.authStore.clear()
  isAuthenticated.value = false
}

// Helper para limpiar strings monetarios (ej: "S/ 85.00" -> 85.00)
function parseCleanNum(val) {
  if (val === null || val === undefined) return 0
  if (typeof val === 'number') return isNaN(val) ? 0 : val
  const cleaned = String(val).replace(/[^0-9.-]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function getItemPrice(it, order) {
  const p = parseCleanNum(it.price !== undefined ? it.price : (it.precio_unitario !== undefined ? it.precio_unitario : it.unitPrice))
  if (p > 0) return p
  const sub = parseCleanNum(it.subtotal !== undefined ? it.subtotal : it.total)
  const q = getItemQty(it)
  if (sub > 0 && q > 0) return sub / q
  if (order && order.products_total > 0 && (!order.items || order.items.length <= 1)) {
    return order.products_total / q
  }
  return 0
}

function getItemQty(it) {
  return parseInt(it.quantity || it.cantidad || 1) || 1
}

function getItemSubtotal(it, order) {
  const sub = parseCleanNum(it.subtotal !== undefined ? it.subtotal : it.total)
  if (sub > 0) return sub
  return getItemPrice(it, order) * getItemQty(it)
}

function getItemImage(it) {
  if (it.image && it.image.length > 5) return it.image
  return resolveProductImage({ id: it.id, name: it.name || it.producto })
}

function getMapsLink(order) {
  if (order.location_url && order.location_url.startsWith('http')) {
    return order.location_url
  }
  const clean = (order.customer_address || '').replace(/\|\s*GPS:[^|]+/g, '').replace(/\|\s*Dedicatoria:[^|]+/g, '').trim()
  if (clean) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clean)}`
  }
  return '#'
}

// Load Orders from API
async function loadOrders() {
  if (!isAuthenticated.value) return
  isLoading.value = true

  try {
    const res = await fetchOrders({
      status: filters.status,
      search: filters.search,
      startDate: filters.startDate,
      endDate: filters.endDate
    })

    orders.value = res.orders || []
    if (res.stats) {
      Object.assign(stats, res.stats)
    }

    // Initialize local edit buffers
    orders.value.forEach(o => {
      editingDelivery[o.id] = o.delivery_cost
      editingAdvance[o.id] = o.advance
    })
  } catch (err) {
    console.error('Error al cargar pedidos:', err)
  } finally {
    isLoading.value = false
  }
}

function handleSearchDebounced() {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    loadOrders()
  }, 350)
}

function clearSearch() {
  filters.search = ''
  loadOrders()
}

const hasActiveFilters = computed(() => {
  return filters.status !== 'active' || !!filters.search || !!filters.startDate || !!filters.endDate
})

function resetFilters() {
  filters.status = 'active'
  filters.search = ''
  filters.startDate = ''
  filters.endDate = ''
  loadOrders()
}

function toggleStatusFilter(statusVal) {
  if (filters.status === statusVal) {
    filters.status = 'active'
  } else {
    filters.status = statusVal
  }
  loadOrders()
}

function toggleExpand(orderId) {
  if (expandedOrderId.value === orderId) {
    expandedOrderId.value = null
  } else {
    expandedOrderId.value = orderId
  }
}

// Quick status change
async function quickUpdateStatus(order, newStatus) {
  try {
    const payload = { id: order.id, status: newStatus }
    if (newStatus === 'paid' && order.balance > 0) {
      payload.advance = order.total
    }
    await updateOrder(payload)
    order.status = newStatus
    await loadOrders()
  } catch (err) {
    alert('Error al actualizar estado: ' + err.message)
  }
}

// Quick delivery & advance presets
function setQuickDelivery(order, amount) {
  editingDelivery[order.id] = Number(amount || 0)
}

function setQuickAdvance(order, amount) {
  editingAdvance[order.id] = Number(amount || 0)
}

// Save delivery and advance changes
async function saveFinancials(order) {
  const delivery = getSafeDelivery(order)
  const advance = getSafeAdvance(order)

  isSavingFinancials[order.id] = true
  try {
    await updateOrder({
      id: order.id,
      delivery_cost: delivery,
      advance: advance
    })
    await loadOrders()
  } catch (err) {
    alert('Error al guardar datos financieros: ' + err.message)
  } finally {
    isSavingFinancials[order.id] = false
  }
}

// 1-Clic para cobrar el delivery acordado y dejar el pedido 100% pagado (saldo 0)
async function payDeliveryAndClearBalance(order) {
  const delivery = getSafeDelivery(order)
  const fullTotal = (order.products_total || 0) + delivery
  editingAdvance[order.id] = fullTotal

  isSavingFinancials[order.id] = true
  try {
    await updateOrder({
      id: order.id,
      delivery_cost: delivery,
      advance: fullTotal,
      status: 'paid'
    })
    await loadOrders()
  } catch (err) {
    alert('Error al cobrar delivery: ' + err.message)
  } finally {
    isSavingFinancials[order.id] = false
  }
}

// Soft-delete (Ocultar)
async function handleHideOrder(order) {
  try {
    await deleteOrder(order.id, false)
    await loadOrders()
  } catch (err) {
    alert('Error al ocultar pedido: ' + err.message)
  }
}

async function handleUnhideOrder(order) {
  try {
    await updateOrder({ id: order.id, hidden: false, status: 'pending' })
    await loadOrders()
  } catch (err) {
    alert('Error al restaurar pedido: ' + err.message)
  }
}

// Action Dropdown Menu handlers
function toggleActionMenu(orderId, event) {
  if (event) event.stopPropagation()
  if (activeActionMenuId.value === orderId) {
    activeActionMenuId.value = null
  } else {
    activeActionMenuId.value = orderId
  }
}

function closeActionMenu() {
  activeActionMenuId.value = null
}

function handleViewOrder(order) {
  activeActionMenuId.value = null
  if (expandedOrderId.value !== order.id) {
    expandedOrderId.value = order.id
  }
}

function handleEditOrder(order) {
  activeActionMenuId.value = null
  editOrderForm.id = order.id
  editOrderForm.customer_name = order.customer_name || ''
  editOrderForm.customer_phone = order.customer_phone || ''
  editOrderForm.customer_address = order.customer_address || ''
  editOrderForm.notes = order.notes || ''
  editOrderForm.location_url = order.location_url || ''
  editOrderForm.delivery_cost = getSafeDelivery(order)
  editOrderForm.advance = getSafeAdvance(order)
  editOrderForm.status = order.status || 'pending'
  showEditOrderModal.value = true
}

async function submitEditOrder() {
  if (!editOrderForm.id) return
  isSavingEditOrder.value = true

  try {
    await updateOrder({
      id: editOrderForm.id,
      customer_name: editOrderForm.customer_name,
      customer_phone: editOrderForm.customer_phone,
      customer_address: editOrderForm.customer_address,
      notes: editOrderForm.notes,
      location_url: editOrderForm.location_url ? editOrderForm.location_url.trim() : '',
      delivery_cost: Number(editOrderForm.delivery_cost || 0),
      advance: Number(editOrderForm.advance || 0),
      status: editOrderForm.status
    })

    showEditOrderModal.value = false
    await loadOrders()
  } catch (err) {
    alert('Error al guardar cambios: ' + err.message)
  } finally {
    isSavingEditOrder.value = false
  }
}

function handleDeleteOrderRequest(order) {
  activeActionMenuId.value = null
  orderToDelete.value = order
  deletePassword.value = ''
  deletePasswordError.value = ''
}

function confirmPermanentDelete(order) {
  handleDeleteOrderRequest(order)
}

function getStoredAdminEmail() {
  try {
    const raw = localStorage.getItem('pb_admin_auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.record?.email) return parsed.record.email
      if (parsed?.admin?.email) return parsed.admin.email
    }
  } catch (_) {}
  return loginEmail.value || 'admin@venezzia.shop'
}

async function executePermanentDelete() {
  if (!orderToDelete.value) return
  if (!deletePassword.value) {
    deletePasswordError.value = 'Por favor ingresa tu contraseña de administrador.'
    return
  }

  isDeletingOrder.value = true
  deletePasswordError.value = ''

  try {
    const adminEmail = getStoredAdminEmail()
    let authOk = false

    // 1. Probar con el correo del superusuario almacenado
    try {
      await pb.collection('_superusers').authWithPassword(adminEmail, deletePassword.value)
      authOk = true
    } catch (_) {}

    // 2. Probar con el correo alternativo 'venezzia@gmail.com'
    if (!authOk) {
      try {
        await pb.collection('_superusers').authWithPassword('venezzia@gmail.com', deletePassword.value)
        authOk = true
      } catch (_) {}
    }

    // 3. Fallback adicional
    if (!authOk) {
      try {
        await pb.collection('_superusers').authWithPassword('admin@venezzia.shop', deletePassword.value)
        authOk = true
      } catch (_) {}
    }

    if (!authOk) {
      deletePasswordError.value = 'Contraseña incorrecta. No tienes permiso para eliminar este pedido.'
      isDeletingOrder.value = false
      return
    }

    // Contraseña correcta -> Ejecutar eliminación permanente
    await deleteOrder(orderToDelete.value.id, true)
    orderToDelete.value = null
    deletePassword.value = ''
    await loadOrders()
  } catch (err) {
    deletePasswordError.value = 'Error al eliminar pedido: ' + err.message
  } finally {
    isDeletingOrder.value = false
  }
}

// Quick action modal
function openOrderActionModal(order) {
  handleEditOrder(order)
}

// Format dates (dd/mm/aaaa)
function formatOrderDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  } catch (_) {
    return dateStr
  }
}

function formatOrderTime(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    const hours = String(d.getHours()).padStart(2, '0')
    const mins = String(d.getMinutes()).padStart(2, '0')
    return `${hours}:${mins}`
  } catch (_) {
    return ''
  }
}

// Pre-fill WhatsApp message (Diferenciado para DELIVERY PENDIENTE vs 100% PAGADO vs PENDIENTE)
function buildWhatsAppLink(order) {
  const phone = (order.customer_phone || '').replace(/\D/g, '')
  const intlPhone = phone.startsWith('51') ? phone : (phone ? `51${phone}` : '')

  const cod = `VZ-${order.id.substring(0, 6).toUpperCase()}`
  let lines = []

  const isDeliveryPending = (order.advance >= order.products_total && order.delivery_cost > 0 && order.balance > 0)
  const isFullyPaid = (order.balance <= 0 && order.total > 0)
  const yapeNum = yapePhoneNumber.value || DEFAULT_YAPE_PHONE

  if (isDeliveryPending) {
    // 1. Mensaje para pedidos con productos 100% pagados y solo delivery pendiente
    lines.push(`¡Hola ${order.customer_name}! Te saludamos de Venezzia Detalles.`)
    lines.push(``)
    lines.push(`Confirmamos tu compra: *Pedido ${cod}*`)
    lines.push(``)

    if (order.items && order.items.length) {
      lines.push(`*Detalle de tu detalle floral:*`)
      order.items.forEach(it => {
        lines.push(`• ${getItemQty(it)}x ${it.name || it.producto || 'Detalle Floral'}`)
      })
      lines.push(``)
    }

    lines.push(`*Productos:* S/ ${order.products_total.toFixed(2)} *(PAGADO CON ÉXITO)*`)
    lines.push(`*Costo de Envío / Delivery:* S/ ${order.delivery_cost.toFixed(2)}`)
    lines.push(`*Saldo pendiente por delivery:* S/ ${order.balance.toFixed(2)}`)
    lines.push(``)
    lines.push(`Para programar el despacho con nuestro motorizado a *${order.customer_address || 'tu dirección'}*, puedes cancelar los S/ ${order.balance.toFixed(2)} del delivery mediante Yape o Plin al *${yapeNum}*.`)
    lines.push(``)
    lines.push(`(O si prefieres enviar a tu propio motorizado o aplicativo como InDrive, indícanoslo para dejar el costo de delivery en S/ 0.00).`)
    lines.push(``)
    lines.push(`¡Quedamos atentos a tu confirmación para agendarlo! Muchas gracias.`)
  } else if (isFullyPaid) {
    // 2. Mensaje para pedidos 100% PAGADOS (Productos + Delivery si correspondía)
    lines.push(`¡Hola ${order.customer_name}! Te saludamos de Venezzia Detalles.`)
    lines.push(``)
    lines.push(`Confirmamos la recepción de tu compra: *Pedido ${cod}* *(100% CANCELADO)*`)
    lines.push(``)

    if (order.items && order.items.length) {
      lines.push(`*Detalle de tu compra:*`)
      order.items.forEach(it => {
        lines.push(`• ${getItemQty(it)}x ${it.name || it.producto || 'Detalle Floral'}`)
      })
      lines.push(``)
    }

    lines.push(`*Total Pagado:* S/ ${order.total.toFixed(2)} *(Pago confirmado)*`)
    lines.push(``)

    if (order.delivery_cost > 0) {
      lines.push(`*Dirección de entrega:* ${order.customer_address || 'A coordinar'}`)
      lines.push(`Tu envío con motorizado ya está confirmado y en programación.`)
    } else {
      lines.push(`Para coordinar la entrega de tu detalle:`)
      lines.push(`¿Prefieres pasar a recogerlo / enviar a tu propio motorizado, o deseas que te lo enviemos con nuestro motorizado / por aplicativo (ej. InDrive)?`)
    }

    lines.push(``)
    lines.push(`¡Quedamos atentos a tu confirmación para agendarlo! Muchas gracias.`)
  } else {
    // 3. Mensaje para pedidos PENDIENTES o con ADELANTO PARCIAL
    lines.push(`¡Hola ${order.customer_name}! Te saludamos de Venezzia Detalles.`)
    lines.push(``)
    lines.push(`Te escribimos para coordinar los detalles de tu *Pedido ${cod}*:`)
    lines.push(``)

    if (order.items && order.items.length) {
      lines.push(`*Detalles seleccionados:*`)
      order.items.forEach(it => {
        lines.push(`• ${getItemQty(it)}x ${it.name || it.producto || 'Detalle Floral'}`)
      })
      lines.push(``)
    }

    lines.push(`*Total a pagar:* S/ ${order.total.toFixed(2)}`)
    if (order.advance > 0) {
      lines.push(`*Adelanto recibido:* S/ ${order.advance.toFixed(2)}`)
      lines.push(`*Saldo pendiente:* S/ ${order.balance.toFixed(2)}`)
    } else {
      lines.push(`*Saldo pendiente de pago:* S/ ${order.balance.toFixed(2)}`)
    }

    lines.push(``)
    lines.push(`¿Cómo coordinamos el anticipo y horario de despacho? Puedes yaparnos o plinearnos al *${yapeNum}*. ¡Muchas gracias!`)
  }

  const text = encodeURIComponent(lines.join('\n'))

  if (intlPhone) {
    return `https://api.whatsapp.com/send/?phone=${intlPhone}&text=${text}`
  }
  return `https://api.whatsapp.com/send/?text=${text}`
}

// Submit manual order
async function submitManualOrder() {
  if (!newOrder.customer_name || !newOrder.product_name) return
  isSubmittingOrder.value = true

  try {
    const prodPrice = Number(newOrder.product_price || 0)
    const delivCost = Number(newOrder.delivery_cost || 0)
    const adv = Number(newOrder.advance || 0)
    const total = prodPrice + delivCost

    await createOrder({
      customer_name: newOrder.customer_name,
      customer_phone: newOrder.customer_phone,
      customer_address: newOrder.customer_address,
      items: [
        {
          name: newOrder.product_name,
          quantity: 1,
          price: prodPrice,
          subtotal: prodPrice
        }
      ],
      total: total,
      delivery_cost: delivCost,
      advance: adv,
      notes: newOrder.notes,
      location_url: newOrder.location_url ? newOrder.location_url.trim() : '',
      payment_method: 'whatsapp',
      status: adv >= total && total > 0 ? 'paid' : 'pending'
    })

    showNewOrderModal.value = false
    // Reset form
    newOrder.customer_name = ''
    newOrder.customer_phone = ''
    newOrder.customer_address = ''
    newOrder.product_name = ''
    newOrder.product_price = 85
    newOrder.delivery_cost = 0
    newOrder.advance = 0
    newOrder.notes = ''
    newOrder.location_url = ''

    await loadOrders()
  } catch (err) {
    alert('Error al registrar pedido manual: ' + err.message)
  } finally {
    isSubmittingOrder.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', closeActionMenu)
  if (checkAuth()) {
    loadOrders()
  }
})

onUnmounted(() => {
  window.removeEventListener('click', closeActionMenu)
})
</script>
