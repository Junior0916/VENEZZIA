<template>
  <div class="py-10 sm:py-16 bg-[#faf7fb] min-h-screen">
    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <nav class="flex items-center gap-2 text-xs text-gray-500">
        <router-link to="/" class="hover:text-[#965e9b] transition-colors flex items-center gap-1">
          <Home class="w-3.5 h-3.5" />
          <span>Inicio</span>
        </router-link>
        <span>/</span>
        <span class="text-[#27172b] font-semibold">Gestión de Catálogo y Orden</span>
      </nav>
    </div>

    <!-- 1. LOGIN GATE: Shown when user is NOT authenticated as Superuser -->
    <div v-if="!isAuthenticated" class="max-w-md mx-auto px-4 py-8">
      <div class="bg-white rounded-3xl p-8 sm:p-10 border border-[#eedee9] text-center shadow-xl">
        <div class="w-14 h-14 rounded-2xl bg-[#27172b] text-[#caa35f] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock class="w-7 h-7" />
        </div>

        <span class="text-[10px] font-bold text-[#caa35f] uppercase tracking-wider block mb-1">
          Área Restringida • Solo Administradores
        </span>
        <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#27172b] mb-2">
          Acceso a Gestión de Catálogo
        </h2>
        <p class="text-xs text-gray-500 mb-6 leading-relaxed">
          Ingresa tus credenciales de administrador de PocketBase para acceder al organizador y duplicador de productos.
        </p>

        <form @submit.prevent="loginAsAdmin" class="space-y-4 text-left">
          <div>
            <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Correo de Administrador</label>
            <input
              type="email"
              v-model="loginEmail"
              required
              autocomplete="username"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#965e9b] focus:outline-none"
              placeholder="venezzia@gmail.com"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Contraseña</label>
            <input
              type="password"
              v-model="loginPassword"
              required
              autocomplete="current-password"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#965e9b] focus:outline-none"
              placeholder="••••••••••••"
            />
          </div>

          <!-- Environment Selector -->
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase mb-1">Conectar con:</label>
            <select
              v-model="targetServer"
              @change="onServerChange"
              class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-[#faf7fb] text-gray-700 focus:outline-none"
            >
              <option value="remote">Servidor de Producción (admin.venezzia.shop)</option>
              <option value="local">Servidor Local (127.0.0.1:8090)</option>
            </select>
          </div>

          <div v-if="loginError" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ loginError }}</span>
          </div>

          <button
            type="submit"
            :disabled="isLoggingIn"
            class="w-full py-3 rounded-xl bg-[#27172b] text-white text-xs font-bold hover:bg-[#3d2444] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <RefreshCw v-if="isLoggingIn" class="w-4 h-4 animate-spin text-[#caa35f]" />
            <span>{{ isLoggingIn ? 'Verificando credenciales...' : 'Iniciar Sesión' }}</span>
          </button>

          <div class="pt-3 text-center border-t border-gray-100">
            <router-link to="/" class="text-xs text-gray-400 hover:text-[#965e9b] transition-colors">
              ← Volver a la Tienda Pública
            </router-link>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. PROTECTED WORKSPACE: Only visible when Authenticated -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Card with Logout button -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)] mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#f4eaf6]">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6eef8] border border-[#e8d5ec] text-xs font-semibold text-[#753d77] mb-2">
              <Sparkles class="w-3.5 h-3.5 text-[#caa35f]" />
              <span>Gestión de Catálogo Venezzia • Sesión Activa</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-serif font-bold text-[#27172b] tracking-tight">
              Panel de Catálogo y Productos
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
              Edita la información de tus productos (precios, fotos, descripciones, contenido y stock), organiza su orden visualmente o crea nuevos lanzamientos.
            </p>
          </div>

          <!-- Quick Actions, Server, PB & Logout -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Link to Orders View -->
            <router-link
              to="/pedidos"
              class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#27172b] to-[#451f4c] text-white text-xs font-semibold hover:opacity-95 transition-all shadow-sm shrink-0"
              title="Ir al panel de pedidos y clientes"
            >
              <ShoppingBag class="w-3.5 h-3.5 text-[#caa35f]" />
              <span>Ver Pedidos</span>
            </router-link>

            <!-- New Product Quick Button -->
            <button
              @click="openCreateProductModal"
              class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#caa35f] text-[#27172b] text-xs font-bold hover:bg-[#d8b475] transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <Plus class="w-4 h-4 text-[#27172b]" />
              <span>+ Nuevo Producto</span>
            </button>

            <!-- WhatsApp Support Config Button -->
            <button
              @click="openWhatsAppConfigModal"
              type="button"
              class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
              title="Configurar número oficial de WhatsApp para atención y pedidos"
            >
              <IconWhatsApp class="w-4 h-4 text-[#25D366] shrink-0" />
              <span>WhatsApp: <strong class="font-mono text-emerald-900">{{ siteSettingsStore.formattedPhone || '+51 935 817 179' }}</strong></span>
              <Edit3 class="w-3.5 h-3.5 text-emerald-600/70 ml-0.5" />
            </button>

            <!-- Environment selector -->
            <div class="p-2 bg-[#faf5fb] rounded-2xl border border-[#eedee9] text-left shrink-0">
              <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Servidor</span>
              <select
                v-model="targetServer"
                @change="onServerChange"
                class="text-xs font-semibold text-[#27172b] bg-transparent outline-none cursor-pointer"
              >
                <option value="remote">admin.venezzia.shop</option>
                <option value="local">127.0.0.1:8090</option>
              </select>
            </div>

            <a
              :href="adminUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-all shadow-2xs shrink-0"
              title="Abrir base de datos directa en PocketBase"
            >
              <span>PocketBase</span>
              <ArrowUpRight class="w-3.5 h-3.5 text-gray-400" />
            </a>

            <!-- Cerrar Sesion Button -->
            <button
              @click="logoutAdmin"
              class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all shrink-0 cursor-pointer"
              title="Cerrar sesión y bloquear el acceso"
            >
              <LogOut class="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>

        <!-- Mode Navigation Tabs: Catalogo vs Live vs Duplicar vs Organizar Arrastrando vs Visibilidad -->
        <div class="mt-6 flex flex-wrap items-center gap-2.5">
          <!-- TAB 1: CATÁLOGO Y EDICIÓN (Default) -->
          <button
            @click="activeToolTab = 'catalogo'"
            :class="[
              'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs',
              activeToolTab === 'catalogo'
                ? 'bg-[#27172b] text-white ring-2 ring-[#caa35f]/50 shadow-md'
                : 'bg-[#faf7fb] border border-[#eedee9] text-gray-600 hover:bg-[#f3edf5]'
            ]"
          >
            <Package class="w-4 h-4 text-[#caa35f]" />
            <span>Catálogo y Edición</span>
            <span class="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] ml-1">
              {{ products.length }}
            </span>
          </button>

          <!-- TAB 2: ORGANIZAR ORDEN -->
          <button
            @click="activeToolTab = 'reorder'"
            :class="[
              'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs',
              activeToolTab === 'reorder'
                ? 'bg-[#27172b] text-white ring-2 ring-[#caa35f]/50'
                : 'bg-[#faf7fb] border border-[#eedee9] text-gray-600 hover:bg-[#f3edf5]'
            ]"
          >
            <Move class="w-4 h-4 text-[#caa35f]" />
            <span>Organizar Orden (Arrastrar)</span>
          </button>

          <!-- TAB 3: VISIBILIDAD -->
          <button
            @click="activeToolTab = 'visibility'; loadCampaignsAdmin()"
            :class="[
              'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs',
              activeToolTab === 'visibility'
                ? 'bg-[#27172b] text-white ring-2 ring-[#caa35f]/50'
                : 'bg-[#faf7fb] border border-[#eedee9] text-gray-600 hover:bg-[#f3edf5]'
            ]"
          >
            <Eye class="w-4 h-4 text-[#caa35f]" />
            <span>Visibilidad de Menús</span>
          </button>

          <!-- TAB 4: DUPLICADOR -->
          <button
            @click="activeToolTab = 'duplicate'"
            :class="[
              'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs',
              activeToolTab === 'duplicate'
                ? 'bg-[#27172b] text-white ring-2 ring-[#caa35f]/50'
                : 'bg-[#faf7fb] border border-[#eedee9] text-gray-600 hover:bg-[#f3edf5]'
            ]"
          >
            <Copy class="w-4 h-4 text-[#caa35f]" />
            <span>Duplicador Rápido</span>
          </button>

          <!-- TAB 5: TIKTOK LIVE -->
          <button
            @click="activeToolTab = 'live'"
            :class="[
              'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs',
              activeToolTab === 'live'
                ? 'bg-[#ff0050] text-white ring-2 ring-[#00f2fe]/60 shadow-md'
                : 'bg-[#faf7fb] border border-[#eedee9] text-gray-600 hover:bg-[#f3edf5]'
            ]"
          >
            <span v-if="siteSettingsStore.isLiveOfferActive" class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <Flame v-else class="w-4 h-4 text-[#ff0050]" />
            <span>TikTok Live Flash</span>
            <span
              v-if="siteSettingsStore.isLiveOfferActive"
              class="px-2 py-0.5 rounded-full bg-black/30 text-white font-mono text-[10px] ml-1"
            >
              {{ siteSettingsStore.formattedLiveTimeLeft }}
            </span>
          </button>

          <!-- TAB 6: WHATSAPP CONFIG -->
          <button
            @click="openWhatsAppConfigModal"
            type="button"
            class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs bg-[#faf7fb] border border-[#eedee9] text-gray-700 hover:bg-[#f3edf5] hover:text-emerald-700 hover:border-emerald-200"
            title="Configurar número oficial de WhatsApp para clientes"
          >
            <IconWhatsApp class="w-4 h-4 text-[#25D366]" />
            <span>Configurar WhatsApp</span>
          </button>
        </div>
      </div>

      <!-- WebP Image Health & Optimizer Bar -->
      <div class="bg-white rounded-3xl p-5 border border-[#eedee9] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <div :class="[
            'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs',
            unoptimizedProducts.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          ]">
            <Sparkles class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-[#27172b]">Optimización de Formato de Imágenes</span>
              <span :class="[
                'text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider',
                unoptimizedProducts.length > 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              ]">
                {{ unoptimizedProducts.length > 0 ? `${unoptimizedProducts.length} imagen(es) no WebP` : '100% WebP Activo' }}
              </span>
            </div>
            <p class="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
              {{ unoptimizedProducts.length > 0
                ? 'Se detectaron fotos en PNG/JPG pesado. Conviértelas a formato WebP ultraligero con 1 solo clic para acelerar la carga en móviles.'
                : 'Todas las imágenes del catálogo están convertidas a WebP de alta fidelidad (~90KB). La tienda carga de forma instantánea.' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            v-if="unoptimizedProducts.length > 0"
            @click="optimizeAllToWebP"
            :disabled="isOptimizingWebp"
            class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw v-if="isOptimizingWebp" class="w-3.5 h-3.5 animate-spin text-white" />
            <Zap v-else class="w-3.5 h-3.5 text-amber-200" />
            <span>{{ isOptimizingWebp ? optimizeWebpProgress : `Optimizar ${unoptimizedProducts.length} a WebP (-95% peso)` }}</span>
          </button>
          <div v-else class="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" />
            <span>Carga ultrarrápida (WebP)</span>
          </div>
        </div>
      </div>

      <!-- MAIN WORKSPACE -->
      <div class="space-y-6">

        <!-- ========================================== -->
        <!-- TAB 1: CATÁLOGO Y EDICIÓN DE PRODUCTOS      -->
        <!-- ========================================== -->
        <div v-if="activeToolTab === 'catalogo'" class="space-y-6">
          <!-- Top Stats & New Product Banner -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#eedee9] shadow-xs">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#f4eaf6]">
              <div>
                <span class="text-[10px] font-bold text-[#caa35f] uppercase tracking-wider block mb-1">
                  Catálogo Oficial • Gestión Integral
                </span>
                <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#27172b]">
                  Catálogo y Edición de Productos
                </h2>
                <p class="text-xs text-gray-500 mt-1 max-w-xl">
                  Modifica precios, fotos, descripciones, contenido y stock en tiempo real con una interfaz clara y moderna.
                </p>
              </div>

              <button
                @click="openCreateProductModal"
                class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#27172b] hover:bg-[#3d2444] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
              >
                <Plus class="w-4 h-4 text-[#caa35f]" />
                <span>+ Crear Nuevo Producto</span>
              </button>
            </div>

            <!-- Stats Counters -->
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6">
              <div class="p-3.5 rounded-2xl bg-[#faf7fb] border border-[#eedee9]">
                <div class="text-[10px] uppercase font-bold text-gray-400">Total Productos</div>
                <div class="text-2xl font-bold text-[#27172b] mt-1">{{ products.length }}</div>
              </div>
              <div class="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div class="text-[10px] uppercase font-bold text-emerald-700">En Stock</div>
                <div class="text-2xl font-bold text-emerald-800 mt-1">{{ inStockCount }}</div>
              </div>
              <div class="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
                <div class="text-[10px] uppercase font-bold text-rose-700">Agotados</div>
                <div class="text-2xl font-bold text-rose-800 mt-1">{{ outOfStockCount }}</div>
              </div>
              <div class="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                <div class="text-[10px] uppercase font-bold text-blue-700">Visibles</div>
                <div class="text-2xl font-bold text-blue-800 mt-1">{{ visibleProductsCount }}</div>
              </div>
              <div class="p-3.5 rounded-2xl bg-gray-100/70 border border-gray-200">
                <div class="text-[10px] uppercase font-bold text-gray-500">Ocultos / Borradores</div>
                <div class="text-2xl font-bold text-gray-700 mt-1">{{ hiddenProductsCount }}</div>
              </div>
            </div>
          </div>

          <!-- Filter, Search and View Toolbar -->
          <div class="bg-white rounded-3xl p-5 border border-[#eedee9] shadow-xs space-y-4">
            <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <!-- Search Bar -->
              <div class="relative flex-1">
                <Search class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  v-model="catalogSearchQuery"
                  placeholder="Buscar producto por nombre, categoría, descripción o contenido..."
                  class="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-xs text-[#27172b] focus:border-[#965e9b] focus:outline-none"
                />
                <button
                  v-if="catalogSearchQuery"
                  @click="catalogSearchQuery = ''"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold p-1 cursor-pointer"
                  title="Limpiar búsqueda"
                >
                  ✕
                </button>
              </div>

              <!-- Stock & Visibility Selects + Grid/Table Toggle -->
              <div class="flex flex-wrap items-center gap-2">
                <!-- Stock Select -->
                <select
                  v-model="catalogStockFilter"
                  class="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-[#faf7fb] focus:outline-none cursor-pointer"
                >
                  <option value="all">📦 Todos los stocks</option>
                  <option value="in_stock">🟢 Solo en Stock</option>
                  <option value="out_of_stock">🔴 Solo Agotados</option>
                </select>

                <!-- Visibility Select -->
                <select
                  v-model="catalogVisibilityFilter"
                  class="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-[#faf7fb] focus:outline-none cursor-pointer"
                >
                  <option value="all">👁️ Todas las visibilidades</option>
                  <option value="visible">Mostrar solo Visibles</option>
                  <option value="hidden">Mostrar solo Ocultos</option>
                </select>

                <!-- Grid / Table View Switcher -->
                <div class="flex items-center bg-[#faf7fb] border border-gray-200 rounded-xl p-1 shrink-0">
                  <button
                    @click="catalogViewMode = 'grid'"
                    :class="[
                      'p-1.5 rounded-lg transition-all cursor-pointer',
                      catalogViewMode === 'grid' ? 'bg-white text-[#27172b] shadow-xs' : 'text-gray-400 hover:text-gray-600'
                    ]"
                    title="Vista en Tarjetas"
                  >
                    <LayoutGrid class="w-4 h-4" />
                  </button>
                  <button
                    @click="catalogViewMode = 'table'"
                    :class="[
                      'p-1.5 rounded-lg transition-all cursor-pointer',
                      catalogViewMode === 'table' ? 'bg-white text-[#27172b] shadow-xs' : 'text-gray-400 hover:text-gray-600'
                    ]"
                    title="Vista en Tabla Compacta"
                  >
                    <List class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Campaign Filter Pills with Counts -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-[#f4eaf6]">
              <button
                v-for="camp in catalogCampaignFilters"
                :key="camp.id"
                @click="catalogSelectedCampaign = camp.id"
                :class="[
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0',
                  catalogSelectedCampaign === camp.id
                    ? 'bg-[#27172b] text-white shadow-xs'
                    : 'bg-[#faf7fb] border border-[#eedee9] text-gray-600 hover:bg-[#f3edf5]'
                ]"
              >
                <span>{{ camp.name }}</span>
                <span
                  :class="[
                    'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                    catalogSelectedCampaign === camp.id ? 'bg-[#caa35f] text-[#27172b]' : 'bg-gray-200/70 text-gray-600'
                  ]"
                >
                  {{ getProductCountForFilter(camp.id) }}
                </span>
              </button>
            </div>
          </div>

          <!-- Product Cards Grid View -->
          <div
            v-if="catalogViewMode === 'grid' && filteredCatalogProducts.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <div
              v-for="prod in filteredCatalogProducts"
              :key="prod.id"
              class="bg-white rounded-3xl p-4 border border-[#eedee9] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <!-- Image Container with Badges -->
                <div class="aspect-square relative rounded-2xl overflow-hidden bg-[#faf7fb] border border-[#f4eaf6] mb-3">
                  <img
                    v-if="prod.displayImage"
                    :src="prod.displayImage"
                    :alt="prod.name"
                    class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                    <Package class="w-10 h-10" />
                  </div>

                  <!-- Campaign Pill (Top-Left) -->
                  <div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#27172b]/85 backdrop-blur-xs text-white shadow-xs">
                    {{ getCampaignName(prod.campaign) }}
                  </div>

                  <!-- Stock Badge (Top-Right) -->
                  <div class="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
                    <div
                      :class="[
                        'px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs backdrop-blur-xs',
                        prod.in_stock !== false
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-rose-500/90 text-white'
                      ]"
                    >
                      {{ prod.in_stock !== false ? 'En Stock' : 'Agotado' }}
                    </div>

                    <!-- Hidden Badge if Inactive -->
                    <div
                      v-if="prod.is_active === false"
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-900/80 text-gray-200 shadow-xs backdrop-blur-xs"
                    >
                      Oculto en Tienda
                    </div>
                  </div>

                  <!-- Bottom Badges: Destacado / Addon Car / Descuento -->
                  <div class="absolute bottom-2.5 left-2.5 flex items-center gap-1">
                    <span
                      v-if="prod.featured"
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 shadow-xs flex items-center gap-1"
                    >
                      <Star class="w-3 h-3 fill-amber-950" />
                      <span>Destacado</span>
                    </span>
                    <span
                      v-if="prod.addon_car"
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs flex items-center gap-1"
                    >
                      <Car class="w-3 h-3" />
                      <span>Auto</span>
                    </span>
                  </div>

                  <!-- Discount % Badge if compare_at_price > price -->
                  <div
                    v-if="prod.compare_at_price && Number(prod.compare_at_price) > Number(prod.price)"
                    class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#ff0050] text-white shadow-xs"
                  >
                    -{{ Math.round((1 - Number(prod.price) / Number(prod.compare_at_price)) * 100) }}%
                  </div>
                </div>

                <!-- Product Details -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-[10px] font-bold tracking-wider uppercase text-[#965e9b] truncate">
                      {{ prod.category || 'General' }}
                    </span>
                    <span class="text-[10px] text-gray-400 font-mono shrink-0">
                      #{{ prod.order || 1 }}
                    </span>
                  </div>

                  <h3 class="text-sm font-serif font-bold text-[#27172b] line-clamp-2 leading-snug group-hover:text-[#965e9b] transition-colors">
                    {{ prod.name }}
                  </h3>

                  <!-- Prices -->
                  <div class="flex items-baseline gap-2 pt-0.5">
                    <span class="text-base font-bold text-[#27172b]">
                      S/ {{ Number(prod.price).toFixed(2) }}
                    </span>
                    <span
                      v-if="prod.compare_at_price && Number(prod.compare_at_price) > Number(prod.price)"
                      class="text-xs text-gray-400 line-through"
                    >
                      S/ {{ Number(prod.compare_at_price).toFixed(2) }}
                    </span>
                  </div>

                  <!-- Description preview -->
                  <p v-if="prod.description" class="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                    {{ prod.description }}
                  </p>

                  <!-- Items included summary -->
                  <div v-if="prod.items_included" class="text-[10px] text-gray-400 flex items-center gap-1 pt-0.5">
                    <CheckSquare class="w-3 h-3 text-[#caa35f]" />
                    <span>{{ getItemsCount(prod) }} elementos incluidos</span>
                  </div>
                </div>
              </div>

              <!-- Quick Toggles & Action Buttons -->
              <div class="mt-4 pt-3 border-t border-[#f4eaf6] space-y-2.5">
                <!-- Inline Quick 1-Click Toggles -->
                <div class="grid grid-cols-2 gap-2">
                  <!-- Stock Quick Toggle -->
                  <button
                    @click="toggleProductStock(prod)"
                    :disabled="savingStockProdId === prod.id"
                    :class="[
                      'w-full py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border',
                      prod.in_stock !== false
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    ]"
                    :title="prod.in_stock !== false ? 'Clic para marcar como Agotado' : 'Clic para marcar como En Stock'"
                  >
                    <RefreshCw v-if="savingStockProdId === prod.id" class="w-3 h-3 animate-spin text-gray-500" />
                    <span v-else class="w-2 h-2 rounded-full shrink-0" :class="prod.in_stock !== false ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                    <span class="truncate">{{ prod.in_stock !== false ? 'En Stock' : 'Agotado' }}</span>
                  </button>

                  <!-- Visibility Quick Toggle -->
                  <button
                    @click="toggleProductActive(prod)"
                    :disabled="savingProductActiveId === prod.id"
                    :class="[
                      'w-full py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border',
                      prod.is_active !== false
                        ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                    ]"
                    :title="prod.is_active !== false ? 'Clic para ocultar en la tienda' : 'Clic para hacer visible'"
                  >
                    <RefreshCw v-if="savingProductActiveId === prod.id" class="w-3 h-3 animate-spin text-gray-500" />
                    <template v-else>
                      <Eye v-if="prod.is_active !== false" class="w-3 h-3 text-blue-600 shrink-0" />
                      <EyeOff v-else class="w-3 h-3 text-gray-500 shrink-0" />
                    </template>
                    <span class="truncate">{{ prod.is_active !== false ? 'Visible' : 'Oculto' }}</span>
                  </button>
                </div>

                <!-- Primary Action Buttons Row -->
                <div class="flex items-center gap-1.5">
                  <!-- EDIT BUTTON (Primary) -->
                  <button
                    @click="openEditProductModal(prod)"
                    class="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#27172b] to-[#451f4c] text-white text-xs font-bold hover:from-[#351a3b] hover:to-[#572460] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Edit3 class="w-3.5 h-3.5 text-[#caa35f]" />
                    <span>Editar</span>
                  </button>

                  <!-- DUPLICATE BUTTON -->
                  <button
                    @click="openDuplicateModal(prod)"
                    class="p-2 rounded-xl border border-gray-200 hover:border-[#caa35f] text-gray-600 hover:text-[#27172b] hover:bg-[#faf7fb] transition-all cursor-pointer"
                    title="Duplicar / Clonar este producto"
                  >
                    <Copy class="w-3.5 h-3.5" />
                  </button>

                  <!-- VIEW IN STORE BUTTON -->
                  <a
                    :href="`/${getProductSlug(prod)}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-2 rounded-xl border border-gray-200 hover:border-[#965e9b] text-gray-600 hover:text-[#965e9b] hover:bg-[#faf7fb] transition-all"
                    :title="`Ver en la tienda: venezzia.shop/${getProductSlug(prod)}`"
                  >
                    <ExternalLink class="w-3.5 h-3.5" />
                  </a>

                  <!-- COPY DIRECT LINK BUTTON -->
                  <button
                    @click="copyProductLink(prod)"
                    class="p-2 rounded-xl border border-gray-200 hover:border-[#caa35f] text-gray-600 hover:text-[#27172b] hover:bg-[#faf7fb] transition-all cursor-pointer"
                    :title="`Copiar enlace para cliente: venezzia.shop/${getProductSlug(prod)}`"
                  >
                    <Check v-if="copiedCardLinkId === prod.id" class="w-3.5 h-3.5 text-emerald-600" />
                    <LinkIcon v-else class="w-3.5 h-3.5 text-[#caa35f]" />
                  </button>

                  <!-- DELETE BUTTON -->
                  <button
                    @click="confirmDeleteProduct(prod)"
                    class="p-2 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
                    title="Eliminar este producto"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Table View -->
          <div
            v-else-if="catalogViewMode === 'table' && filteredCatalogProducts.length > 0"
            class="bg-white rounded-3xl border border-[#eedee9] shadow-xs overflow-hidden"
          >
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-[#faf7fb] border-b border-[#eedee9] text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    <th class="py-3 px-4">Producto</th>
                    <th class="py-3 px-4">Campaña / Categoría</th>
                    <th class="py-3 px-4">Precio</th>
                    <th class="py-3 px-4 text-center">Stock</th>
                    <th class="py-3 px-4 text-center">Visibilidad</th>
                    <th class="py-3 px-4 text-center">Orden</th>
                    <th class="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#f4eaf6]">
                  <tr
                    v-for="prod in filteredCatalogProducts"
                    :key="prod.id"
                    class="hover:bg-[#faf7fb]/70 transition-colors"
                  >
                    <!-- Product Thumb & Name -->
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <img
                          v-if="prod.displayImage"
                          :src="prod.displayImage"
                          :alt="prod.name"
                          class="w-12 h-12 rounded-xl object-cover border border-[#eedee9] shrink-0"
                        />
                        <div v-else class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                          <Package class="w-5 h-5" />
                        </div>
                        <div class="min-w-0 max-w-xs sm:max-w-md">
                          <div class="font-bold text-[#27172b] truncate">{{ prod.name }}</div>
                          <div class="text-[10px] text-gray-400 font-mono">ID: {{ prod.id }}</div>
                        </div>
                      </div>
                    </td>

                    <!-- Campaign & Category -->
                    <td class="py-3 px-4">
                      <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#27172b]/10 text-[#27172b] mb-0.5">
                        {{ getCampaignName(prod.campaign) }}
                      </span>
                      <div class="text-[11px] text-gray-500">{{ prod.category || 'General' }}</div>
                    </td>

                    <!-- Price -->
                    <td class="py-3 px-4 font-bold text-[#27172b] whitespace-nowrap">
                      <div>S/ {{ Number(prod.price).toFixed(2) }}</div>
                      <div
                        v-if="prod.compare_at_price && Number(prod.compare_at_price) > Number(prod.price)"
                        class="text-[10px] text-gray-400 line-through"
                      >
                        S/ {{ Number(prod.compare_at_price).toFixed(2) }}
                      </div>
                    </td>

                    <!-- Stock Toggle -->
                    <td class="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        @click="toggleProductStock(prod)"
                        :disabled="savingStockProdId === prod.id"
                        :class="[
                          'px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer',
                          prod.in_stock !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        ]"
                      >
                        <RefreshCw v-if="savingStockProdId === prod.id" class="w-3 h-3 animate-spin inline mr-1 text-gray-400" />
                        <span>{{ prod.in_stock !== false ? 'En Stock' : 'Agotado' }}</span>
                      </button>
                    </td>

                    <!-- Visibility Toggle -->
                    <td class="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        @click="toggleProductActive(prod)"
                        :disabled="savingProductActiveId === prod.id"
                        :class="[
                          'px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer',
                          prod.is_active !== false
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        ]"
                      >
                        <RefreshCw v-if="savingProductActiveId === prod.id" class="w-3 h-3 animate-spin inline mr-1 text-gray-400" />
                        <span>{{ prod.is_active !== false ? 'Visible' : 'Oculto' }}</span>
                      </button>
                    </td>

                    <!-- Order -->
                    <td class="py-3 px-4 text-center font-mono font-bold text-gray-600 whitespace-nowrap">
                      #{{ prod.order || 1 }}
                    </td>

                    <!-- Actions -->
                    <td class="py-3 px-4 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          @click="openEditProductModal(prod)"
                          class="px-2.5 py-1.5 rounded-xl bg-[#27172b] hover:bg-[#3d2444] text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 class="w-3 h-3 text-[#caa35f]" />
                          <span>Editar</span>
                        </button>

                        <button
                          @click="copyProductLink(prod)"
                          class="p-1.5 rounded-xl border border-gray-200 hover:border-[#caa35f] text-gray-600 hover:text-[#27172b] transition-all cursor-pointer"
                          :title="`Copiar enlace para cliente: venezzia.shop/${getProductSlug(prod)}`"
                        >
                          <Check v-if="copiedCardLinkId === prod.id" class="w-3.5 h-3.5 text-emerald-600" />
                          <LinkIcon v-else class="w-3.5 h-3.5 text-[#caa35f]" />
                        </button>

                        <button
                          @click="openDuplicateModal(prod)"
                          class="p-1.5 rounded-xl border border-gray-200 hover:border-[#caa35f] text-gray-600 hover:text-[#27172b] transition-all cursor-pointer"
                          title="Duplicar"
                        >
                          <Copy class="w-3.5 h-3.5" />
                        </button>

                        <button
                          @click="confirmDeleteProduct(prod)"
                          class="p-1.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="text-center py-16 bg-white rounded-3xl border border-[#eedee9] shadow-xs px-4"
          >
            <div class="w-14 h-14 rounded-2xl bg-[#faf7fb] text-gray-400 flex items-center justify-center mx-auto mb-3">
              <Package class="w-7 h-7" />
            </div>
            <h3 class="text-sm font-bold text-[#27172b]">No se encontraron productos</h3>
            <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              No hay productos que coincidan con la búsqueda o con los filtros activos.
            </p>
            <div class="mt-4 flex items-center justify-center gap-2">
              <button
                @click="catalogSearchQuery = ''; catalogSelectedCampaign = 'all'; catalogStockFilter = 'all'; catalogVisibilityFilter = 'all'"
                class="px-4 py-2 rounded-xl bg-[#27172b] text-white text-xs font-semibold hover:bg-[#3d2444] transition-colors cursor-pointer"
              >
                Limpiar Filtros
              </button>
              <button
                @click="openCreateProductModal"
                class="px-4 py-2 rounded-xl bg-[#caa35f] text-[#27172b] text-xs font-bold hover:bg-[#d8b475] transition-colors cursor-pointer"
              >
                + Crear Producto
              </button>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 0: DINÁMICA TIKTOK LIVE FLASH (TEMPORIZADOR) -->
        <!-- ========================================== -->
        <div v-else-if="activeToolTab === 'live'" class="space-y-6">
          <!-- Live Active Status & Urgent Timer Card -->
          <div
            v-if="siteSettingsStore.isLiveOfferActive"
            class="bg-gradient-to-br from-[#180010] via-[#27172b] to-[#12000a] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#ff0050] shadow-2xl relative overflow-hidden"
          >
            <!-- Glowing background aura -->
            <div class="absolute -top-24 -right-24 w-72 h-72 bg-[#ff0050]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff0050] text-white text-xs font-black uppercase tracking-wider mb-3 shadow-md animate-pulse">
                  <span class="w-2 h-2 rounded-full bg-white"></span>
                  <span>EN VIVO EN TIKTOK ACTIVO</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
                  Descuentos Flash Transmitiéndose
                </h2>
                <p class="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                  {{ siteSettingsStore.liveBannerText || 'Descuentos especiales activos en toda la tienda web.' }}
                </p>
                <div class="mt-3 flex items-center gap-3 text-xs text-gray-400">
                  <span>Campaña: <strong class="text-white uppercase">{{ siteSettingsStore.liveCampaign }}</strong></span>
                  <span>•</span>
                  <span>Descuento base: <strong class="text-white">S/ {{ siteSettingsStore.liveDiscountDefault }}</strong></span>
                </div>
              </div>

              <!-- Huge Timer Display & Quick Actions -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col items-center text-center shrink-0 min-w-[260px]">
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#00f2fe]">Tiempo Restante en la Web</span>
                <div class="font-mono text-4xl sm:text-5xl font-black text-white my-1 tracking-wider">
                  {{ siteSettingsStore.formattedLiveTimeLeft }}
                </div>
                <span class="text-[11px] text-gray-300 mb-4">
                  Se apagará solo al llegar a 00:00
                </span>

                <!-- Quick live controls (+5m, +10m, stop) -->
                <div class="flex flex-wrap items-center justify-center gap-2 w-full">
                  <button
                    @click="extendLiveTime(5)"
                    :disabled="isSavingLiveSettings"
                    class="flex-1 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                    title="Añadir 5 minutos al temporizador en tiempo real"
                  >
                    <Plus class="w-3.5 h-3.5 text-[#00f2fe]" />
                    <span>+5 Min</span>
                  </button>

                  <button
                    @click="extendLiveTime(10)"
                    :disabled="isSavingLiveSettings"
                    class="flex-1 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                    title="Añadir 10 minutos al temporizador"
                  >
                    <Plus class="w-3.5 h-3.5 text-[#00f2fe]" />
                    <span>+10 Min</span>
                  </button>

                  <button
                    @click="stopLiveOffer"
                    :disabled="isSavingLiveSettings"
                    class="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                    title="Finalizar la dinámica y restablecer precios regulares inmediatamente"
                  >
                    <Square class="w-3.5 h-3.5" />
                    <span>Apagar Dinámica Ahora</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Live Inactive Activation Form -->
          <div
            v-else
            class="bg-white rounded-3xl p-6 sm:p-8 border border-[#eedee9] shadow-xs space-y-6"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#ff0050]/10 text-[#ff0050] flex items-center justify-center shrink-0">
                <Flame class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <span>Modo Transmisión en Vivo</span>
                </div>
                <h3 class="text-xl sm:text-2xl font-serif font-bold text-[#27172b]">
                  Lanzar Descuento Flash para TikTok Live
                </h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
                  Activa los descuentos con temporizador regresivo. Al finalizar el tiempo elegido (ej: 15 min), todos los precios vuelven a su valor normal automáticamente sin que tengas que intervenir.
                </p>
              </div>
            </div>

            <!-- Configuration Grid -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 border-t border-[#f4eaf6]">
              <!-- Duration Selector (Cols 1-6) -->
              <div class="md:col-span-6 space-y-2">
                <label class="block text-xs font-bold text-[#27172b] uppercase tracking-wider">
                  ⏱️ Duración del Descuento Flash:
                </label>
                <div class="grid grid-cols-4 gap-2">
                  <button
                    v-for="mins in [10, 15, 20, 30]"
                    :key="mins"
                    type="button"
                    @click="selectedLiveDuration = mins; customLiveMinutes = ''"
                    :class="[
                      'py-3 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center',
                      selectedLiveDuration === mins && !customLiveMinutes
                        ? 'bg-[#27172b] text-white ring-2 ring-[#caa35f] shadow-sm'
                        : 'bg-[#faf7fb] border border-[#eedee9] text-gray-700 hover:bg-[#f2e7f4]'
                    ]"
                  >
                    {{ mins }} min
                    <span v-if="mins === 15" class="block text-[9px] text-[#caa35f] font-normal">Recomendado</span>
                  </button>
                </div>

                <!-- Custom minutes input -->
                <div class="pt-1 flex items-center gap-2">
                  <span class="text-xs text-gray-500">O escribir minutos libres:</span>
                  <input
                    v-model="customLiveMinutes"
                    type="number"
                    min="1"
                    max="300"
                    placeholder="Ej: 45"
                    class="w-24 text-xs font-bold px-3 py-1.5 rounded-xl border border-[#eedee9] bg-[#faf7fb] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/40"
                  />
                  <span class="text-xs text-gray-500">minutos</span>
                </div>
              </div>

              <!-- Campaign & Headline (Cols 7-12) -->
              <div class="md:col-span-6 space-y-3">
                <div>
                  <label class="block text-xs font-bold text-[#27172b] uppercase tracking-wider mb-1">
                    Colección a Aplicar Descuento:
                  </label>
                  <select
                    v-model="selectedLiveCampaign"
                    @change="onLiveCampaignChange"
                    class="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#faf7fb] focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="hotwheels">Día de Regalar Hot Wheels</option>
                    <option value="maquillaje">Día de Regalar Maquillaje</option>
                    <option value="navidad">Colección Navidad</option>
                    <option value="cumpleanos">Colección Cumpleaños</option>
                    <option value="graduacion">Colección Graduación</option>
                    <option value="all">Todas las Colecciones</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#27172b] uppercase tracking-wider mb-1">
                    Texto para el Cintillo Superior en la Tienda:
                  </label>
                  <input
                    v-model="liveBannerTextInput"
                    type="text"
                    placeholder="¡EN VIVO EN TIKTOK! S/ 10 de descuento en Box Hot Wheels"
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#faf7fb] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Big Start Button -->
            <div class="pt-4 border-t border-[#f4eaf6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="text-xs text-gray-500">
                Al presionar el botón, la tienda web mostrará el cintillo rojo y aplicará los precios rebajados durante <strong>{{ customLiveMinutes ? customLiveMinutes : selectedLiveDuration }} minutos</strong>.
              </div>

              <button
                @click="startLiveOffer"
                :disabled="isSavingLiveSettings"
                class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff0050] to-[#c22b38] hover:from-[#e60047] hover:to-[#a9222e] text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <RefreshCw v-if="isSavingLiveSettings" class="w-4 h-4 animate-spin" />
                <Play v-else class="w-4 h-4 fill-white" />
                <span>{{ isSavingLiveSettings ? 'Iniciando Dinámica...' : `▶️ Iniciar Oferta Flash (${customLiveMinutes ? customLiveMinutes : selectedLiveDuration} min)` }}</span>
              </button>
            </div>
          </div>

          <!-- Product Discount Configuration Table / Grid -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#eedee9] shadow-xs space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f4eaf6]">
              <div>
                <h3 class="text-base font-bold text-[#27172b]">
                  Precios y Descuentos Asignados por Producto
                </h3>
                <p class="text-xs text-gray-500">
                  Aquí puedes ver y cambiar el descuento exacto que tendrá cada producto durante la transmisión.
                </p>
              </div>
              <div class="text-xs font-semibold text-[#caa35f] bg-[#fffaf2] px-3 py-1.5 rounded-xl border border-[#eedee9]">
                <span v-if="selectedLiveCampaign === 'hotwheels'">Box Básico: -S/ 5.00 | Otros Box: -S/ 10.00</span>
                <span v-else>Asigna el descuento en soles (S/) que desees a cada producto</span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div
                v-for="prod in liveProductsDisplayList"
                :key="prod.id"
                class="bg-[#faf7fb] rounded-2xl p-4 border border-[#eedee9] flex flex-col justify-between"
              >
                <div>
                  <div class="aspect-[4/5] w-full rounded-xl bg-white mb-3 p-2 flex items-center justify-center relative overflow-hidden">
                    <img
                      v-if="prod.displayImage"
                      :src="prod.displayImage"
                      :alt="prod.name"
                      class="w-full h-full object-contain rounded-lg"
                      loading="lazy"
                    />
                    <div v-else class="text-gray-300"><Package class="w-8 h-8" /></div>
                    <div class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#27172b] text-white">
                      Base: S/ {{ Number(prod.price).toFixed(2) }}
                    </div>
                  </div>

                  <h4 class="text-xs font-bold text-[#27172b] line-clamp-2 mb-2 leading-snug">
                    {{ prod.name }}
                  </h4>
                </div>

                <div class="pt-3 border-t border-[#eedee9] space-y-2">
                  <div class="flex items-center justify-between gap-2 text-xs">
                    <span class="text-gray-500 font-medium">Descuento Live:</span>
                    <div class="flex items-center gap-1">
                      <span class="font-bold text-gray-700">S/</span>
                      <input
                        v-model.number="prod.live_discount"
                        type="number"
                        min="0"
                        max="100"
                        class="w-16 px-2 py-1 rounded-lg border border-gray-300 text-xs font-bold text-center bg-white focus:outline-none focus:ring-2 focus:ring-[#ff0050]"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-xs pt-1">
                    <span class="text-gray-500 font-medium">Precio en Live:</span>
                    <span class="font-black text-[#ff0050] text-sm">
                      S/ {{ Math.max(0, Number(prod.price) - Number(prod.live_discount || 0)).toFixed(2) }}
                    </span>
                  </div>

                  <button
                    @click="saveSingleProductDiscount(prod)"
                    :disabled="savingProductDiscountId === prod.id"
                    class="w-full py-1.5 px-3 rounded-xl bg-[#27172b] hover:bg-[#965e9b] text-white text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <RefreshCw v-if="savingProductDiscountId === prod.id" class="w-3 h-3 animate-spin" />
                    <Save v-else class="w-3 h-3 text-[#caa35f]" />
                    <span>{{ savingProductDiscountId === prod.id ? 'Guardando...' : 'Guardar Descuento' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 1: ORGANIZAR ORDEN (DRAG & DROP) -->
        <!-- ========================================== -->
        <div v-else-if="activeToolTab === 'reorder'" class="space-y-6">
          <!-- Instruction Banner for User & Partner -->
          <div class="bg-white rounded-3xl p-6 border border-[#eedee9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-2xl bg-[#caa35f]/15 flex items-center justify-center shrink-0 text-[#caa35f]">
                <Move class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-[#27172b]">
                  Arrastra los productos con el mouse para colocarlos en la posición que quieras
                </h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  La posición <strong>#1</strong> es la que se mostrará primero en la tienda. También puedes usar las flechas <strong>▲</strong> y <strong>▼</strong> si estás desde el celular.
                </p>
              </div>
            </div>

            <!-- Save Order Floating Button -->
            <div class="flex items-center gap-2 shrink-0">
              <button
                @click="saveCustomOrder"
                :disabled="isSavingOrder || !hasUnsavedOrder"
                :class="[
                  'px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer',
                  hasUnsavedOrder
                    ? 'bg-[#15803d] hover:bg-[#166534] text-white animate-pulse'
                    : 'bg-[#27172b] text-white hover:bg-[#3d2444] disabled:opacity-50'
                ]"
              >
                <RefreshCw v-if="isSavingOrder" class="w-3.5 h-3.5 animate-spin text-[#caa35f]" />
                <Save v-else class="w-3.5 h-3.5 text-[#caa35f]" />
                <span>{{ isSavingOrder ? 'Guardando en PocketBase...' : hasUnsavedOrder ? 'Guardar Nuevo Orden' : 'Orden Guardado' }}</span>
              </button>

              <button
                v-if="hasUnsavedOrder"
                @click="revertOrderChanges"
                class="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Deshacer
              </button>
            </div>
          </div>

          <!-- Campaign Selector Tabs for Reorder -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              v-for="camp in campaignsReorderList"
              :key="camp.id"
              @click="selectReorderCampaign(camp.id)"
              :class="[
                'px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer',
                reorderCampaign === camp.id
                  ? 'bg-[#27172b] text-white shadow-xs'
                  : 'bg-white border border-[#eedee9] text-gray-600 hover:bg-[#f3edf5]'
              ]"
            >
              {{ camp.name }} ({{ getProductCountByCampaign(camp.id) }})
            </button>
          </div>

          <!-- Drag and Drop List / Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
              v-for="(prod, index) in reorderProductList"
              :key="prod.id"
              draggable="true"
              @dragstart="onDragStart(index, $event)"
              @dragover="onDragOver(index, $event)"
              @dragenter="onDragEnter(index, $event)"
              @dragleave="onDragLeave(index, $event)"
              @drop="onDrop(index, $event)"
              @dragend="onDragEnd"
              :class="[
                'bg-white rounded-2xl border p-3.5 flex flex-col justify-between transition-all select-none',
                draggedOverIndex === index
                  ? 'border-2 border-[#caa35f] bg-[#fffaf2] scale-102 shadow-lg'
                  : 'border-[#eedee9] hover:border-[#caa35f]/60 hover:shadow-sm',
                draggedItemIndex === index ? 'opacity-40' : 'opacity-100'
              ]"
            >
              <div>
                <!-- Top Row: Position Badge & Grip Handle -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-1.5">
                    <span
                      :class="[
                        'w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-xs',
                        index === 0
                          ? 'bg-[#caa35f] text-[#27172b]'
                          : index === 1
                            ? 'bg-[#965e9b]'
                            : 'bg-[#27172b]'
                      ]"
                    >
                      #{{ index + 1 }}
                    </span>
                    <span v-if="index === 0" class="text-[10px] font-bold text-[#caa35f] uppercase tracking-wider">
                      #1 Primer Lugar
                    </span>
                    <span
                      v-if="prod.in_stock === false"
                      class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3]"
                    >
                      Agotado
                    </span>
                    <span
                      v-else
                      class="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      En stock
                    </span>
                  </div>

                  <!-- Grip Handle Icon -->
                  <div class="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-[#caa35f]">
                    <GripVertical class="w-4 h-4" />
                  </div>
                </div>

                <!-- Product Thumbnail Preview -->
                <div class="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#faf6f5] mb-2.5 flex items-center justify-center p-2">
                  <img
                    v-if="prod.displayImage"
                    :src="prod.displayImage"
                    :alt="prod.name"
                    class="w-full h-full object-contain object-center rounded-lg pointer-events-none"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                    <Package class="w-8 h-8" />
                  </div>

                  <div class="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 shadow-2xs backdrop-blur-xs text-[#27172b]">
                    S/ {{ Number(prod.price).toFixed(2) }}
                  </div>
                </div>

                <!-- Product Title & Category -->
                <span class="text-[10px] font-bold tracking-wider uppercase text-[#965e9b] block mb-0.5">
                  {{ prod.category || prod.campaign }}
                </span>
                <h4 class="text-xs font-semibold text-[#27172b] line-clamp-2 leading-snug">
                  {{ prod.name }}
                </h4>
              </div>

              <!-- Reorder Action Buttons (Move Up / Down for touch devices) -->
              <div class="mt-3 pt-2.5 border-t border-[#f4eaf6] flex items-center justify-between gap-1">
                <span class="text-[10px] text-gray-400 font-mono">Posición: {{ index + 1 }}</span>

                <div class="flex items-center gap-1">
                  <!-- Quick Edit in Reorder tab -->
                  <button
                    @click="openEditProductModal(prod)"
                    title="Editar datos de este producto"
                    class="p-1.5 rounded-lg border border-[#caa35f]/40 bg-[#faf7fb] text-[#27172b] hover:bg-[#27172b] hover:text-white transition-colors cursor-pointer mr-1"
                  >
                    <Edit3 class="w-3.5 h-3.5" />
                  </button>

                  <button
                    @click="moveItemUp(index)"
                    :disabled="index === 0"
                    title="Mover arriba"
                    class="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#965e9b] hover:bg-gray-50 disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronUp class="w-3.5 h-3.5" />
                  </button>

                  <button
                    @click="moveItemDown(index)"
                    :disabled="index === reorderProductList.length - 1"
                    title="Mover abajo"
                    class="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#965e9b] hover:bg-gray-50 disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronDown class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 2: DUPLICADOR DE PRODUCTOS -->
        <!-- ========================================== -->
        <div v-else-if="activeToolTab === 'duplicate'" class="space-y-6">
          <!-- Bookmarklet Banner -->
          <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fbf7fc] via-[#fff] to-[#fcf9f5] border border-[#caa35f]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-xl bg-[#caa35f]/15 flex items-center justify-center shrink-0 text-[#caa35f]">
                <Copy class="w-5 h-5" />
              </div>
              <div>
                <h4 class="text-xs sm:text-sm font-bold text-[#27172b] flex items-center gap-2">
                  <span>¿Prefieres duplicar con 1 clic directamente dentro de PocketBase?</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#caa35f]/20 text-[#8a6829] uppercase">Tip</span>
                </h4>
                <p class="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                  Arrastra este botón a tu <strong>barra de marcadores de tu navegador</strong>. Cuando estés editando cualquier producto en PocketBase Admin, haz clic en el marcador y se duplicará al instante.
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 w-full md:w-auto shrink-0">
              <a
                :href="bookmarkletHref"
                onclick="alert('¡Excelente! Para instalarlo, arrastra este botón a la barra de marcadores de tu navegador (Chrome/Edge/Firefox). Luego, cuando estés en PocketBase viendo un producto, solo dale clic para duplicarlo.'); return false;"
                title="Arrastra este botón a tu barra de marcadores"
                class="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#caa35f] text-[#27172b] text-xs font-bold shadow-sm hover:bg-[#b8914c] transition-all cursor-grab active:cursor-grabbing border border-[#caa35f]"
              >
                <Sparkles class="w-4 h-4" />
                <span>Duplicar en PocketBase</span>
              </a>
              <button
                @click="copyBookmarkletCode"
                class="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                :title="copiedBookmarklet ? '¡Código copiado!' : 'Copiar código del marcador'"
              >
                <Check v-if="copiedBookmarklet" class="w-4 h-4 text-green-600" />
                <Copy v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Filter & Search Toolbar -->
          <div class="bg-white rounded-2xl p-4 border border-[#eedee9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <!-- Campaign Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                v-for="camp in campaignsList"
                :key="camp.id"
                @click="selectedCampaign = camp.id"
                :class="[
                  'px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer',
                  selectedCampaign === camp.id
                    ? 'bg-[#27172b] text-white shadow-xs'
                    : 'bg-[#faf7fb] text-gray-600 hover:bg-[#f3edf5]'
                ]"
              >
                {{ camp.name }}
              </button>
            </div>

            <!-- Search Input -->
            <div class="relative min-w-[240px]">
              <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Buscar producto por nombre..."
                class="w-full pl-9 pr-4 py-2 rounded-xl bg-[#faf7fb] border border-gray-200 text-xs text-[#27172b] focus:border-[#965e9b] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoadingProducts" class="py-20 text-center">
            <RefreshCw class="w-8 h-8 animate-spin text-[#965e9b] mx-auto mb-3" />
            <p class="text-xs text-gray-500">Cargando productos de PocketBase...</p>
          </div>

          <!-- Products Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div
              v-for="prod in filteredProducts"
              :key="prod.id"
              class="bg-white rounded-2xl border border-[#eedee9] p-4 flex flex-col justify-between hover:border-[#caa35f]/60 hover:shadow-md transition-all group"
            >
              <div>
                <!-- Product Image Thumbnail -->
                <div class="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#faf6f5] mb-3 flex items-center justify-center p-2">
                  <img
                    v-if="prod.image"
                    :src="prod.displayImage"
                    :alt="prod.name"
                    class="w-full h-full object-contain object-center rounded-lg"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                    <Package class="w-8 h-8" />
                  </div>

                  <div class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 shadow-2xs backdrop-blur-xs text-[#27172b]">
                    S/ {{ Number(prod.price).toFixed(2) }}
                  </div>

                  <div class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#27172b] text-[#caa35f] shadow-2xs">
                    #{{ prod.order || 1 }}
                  </div>

                  <div
                    v-if="prod.in_stock === false"
                    class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] shadow-2xs"
                  >
                    Agotado
                  </div>
                  <div
                    v-else
                    class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-2xs"
                  >
                    En stock
                  </div>
                </div>

                <!-- Product Info -->
                <span class="text-[10px] font-bold tracking-wider uppercase text-[#965e9b] block mb-1">
                  {{ prod.category || prod.campaign }}
                </span>
                <h3 class="text-sm font-semibold text-[#27172b] line-clamp-2 leading-snug mb-1">
                  {{ prod.name }}
                </h3>
                <p class="text-[11px] text-gray-400 font-mono mb-3">
                  ID: {{ prod.id }}
                </p>
              </div>

              <!-- Actions -->
              <div class="pt-3 border-t border-[#f4eaf6] flex items-center gap-2">
                <button
                  @click="openEditProductModal(prod)"
                  class="py-2 px-3 rounded-xl border border-[#caa35f]/40 bg-[#faf7fb] text-[#27172b] text-xs font-semibold hover:bg-[#27172b] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Editar este producto"
                >
                  <Edit3 class="w-3.5 h-3.5 text-[#caa35f]" />
                  <span>Editar</span>
                </button>

                <button
                  @click="openDuplicateModal(prod)"
                  class="flex-1 py-2 px-3 rounded-xl bg-[#27172b] text-white text-xs font-semibold hover:bg-[#965e9b] transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Copy class="w-3.5 h-3.5 text-[#caa35f]" />
                  <span>Duplicar</span>
                </button>

                <a
                  :href="getRecordAdminUrl(prod.id)"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir este producto en PocketBase Admin"
                  class="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-[#965e9b] hover:border-[#965e9b] transition-all"
                >
                  <ExternalLink class="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 3: VISIBILIDAD DE MENÚS Y PRODUCTOS     -->
        <!-- ========================================== -->
        <div v-else-if="activeToolTab === 'visibility'" class="space-y-8">
          <!-- SECCIÓN 1: ACTIVAR U OCULTAR MENÚS DE LA TIENDA -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#eedee9] shadow-xs">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#f4eaf6] mb-6">
              <div>
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6eef8] border border-[#e8d5ec] text-xs font-semibold text-[#753d77] mb-2">
                  <Layers class="w-3.5 h-3.5 text-[#caa35f]" />
                  <span>Navegación de la Tienda</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#27172b]">
                  Menús y Fechas Especiales
                </h2>
                <p class="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                  Activa o desactiva qué campañas aparecen a los clientes en la barra de navegación, el menú lateral y el pie de página. Si desactivas un menú (por ejemplo Cumpleaños), dejará de aparecer en la tienda inmediatamente hasta que lo vuelvas a activar.
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button
                  @click="loadCampaignsAdmin"
                  :disabled="isLoadingCampaigns"
                  class="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw class="w-3.5 h-3.5" :class="isLoadingCampaigns ? 'animate-spin text-[#caa35f]' : ''" />
                  <span>Actualizar Menús</span>
                </button>
              </div>
            </div>

            <!-- Grid de Menús / Campañas -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="camp in adminCampaigns"
                :key="camp.id"
                :class="[
                  'rounded-2xl p-4 border transition-all flex flex-col justify-between',
                  camp.is_active
                    ? 'bg-white border-[#eedee9] shadow-2xs hover:border-[#965e9b]/60'
                    : 'bg-gray-50/90 border-gray-200 opacity-80'
                ]"
              >
                <div>
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <div class="flex items-center gap-2 min-w-0">
                      <span
                        class="w-3 h-3 rounded-full shrink-0"
                        :style="{ backgroundColor: camp.accent_color || '#965e9b' }"
                      />
                      <span class="text-xs font-bold text-[#27172b] truncate">
                        {{ camp.name }}
                      </span>
                    </div>
                    <span
                      :class="[
                        'text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 border',
                        camp.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-200 text-gray-600 border-gray-300'
                      ]"
                    >
                      {{ camp.is_active ? 'Visible en Web' : 'Menú Oculto' }}
                    </span>
                  </div>

                  <p class="text-[11px] text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                    {{ camp.tagline || camp.description || 'Campaña especial de la tienda' }}
                  </p>
                </div>

                <div class="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <span class="text-[10px] text-gray-400 font-mono">
                    {{ camp.slug }}
                  </span>

                  <button
                    @click="toggleCampaignActive(camp)"
                    :disabled="savingCampaignId === camp.id"
                    :class="[
                      'px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50',
                      camp.is_active
                        ? 'bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-900 border border-gray-200'
                        : 'bg-[#15803d] hover:bg-[#166534] text-white shadow-xs'
                    ]"
                  >
                    <RefreshCw v-if="savingCampaignId === camp.id" class="w-3.5 h-3.5 animate-spin" />
                    <template v-else>
                      <EyeOff v-if="camp.is_active" class="w-3.5 h-3.5" />
                      <Eye v-else class="w-3.5 h-3.5" />
                    </template>
                    <span>{{ camp.is_active ? 'Ocultar Menú' : 'Activar Menú' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 2: CONTROL DE VISIBILIDAD DE PRODUCTOS INDIVIDUALES -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#eedee9] shadow-xs">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#f4eaf6] mb-6">
              <div>
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6eef8] border border-[#e8d5ec] text-xs font-semibold text-[#753d77] mb-2">
                  <Eye class="w-3.5 h-3.5 text-[#caa35f]" />
                  <span>Catálogo de Productos</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#27172b]">
                  Mostrar u Ocultar Productos en la Tienda
                </h2>
                <p class="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                  Oculta productos que aún no vas a vender (como muestras de Navidad) sin borrarlos. Los productos ocultos no se muestran en el catálogo, ni en el buscador, ni en la portada, pero se conservan intactos aquí para que puedas activarlos en cualquier momento con un solo clic.
                </p>
              </div>

              <div class="flex items-center gap-3 shrink-0">
                <div class="text-right">
                  <div class="text-xs font-bold text-[#27172b]">
                    {{ visibleProductsCount }} Visibles • {{ hiddenProductsCount }} Ocultos
                  </div>
                  <span class="text-[10px] text-gray-400">Total: {{ products.length }} productos cargados</span>
                </div>
              </div>
            </div>

            <!-- Filtros de Colección y Búsqueda -->
            <div class="bg-[#faf7fb] rounded-2xl p-4 border border-[#eedee9] mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <!-- Selector de Colección -->
              <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  v-for="camp in campaignsList"
                  :key="camp.id"
                  @click="visibilityFilterCampaign = camp.id"
                  :class="[
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer',
                    visibilityFilterCampaign === camp.id
                      ? 'bg-[#27172b] text-white shadow-xs'
                      : 'bg-white border border-[#eedee9] text-gray-600 hover:bg-[#f3edf5]'
                  ]"
                >
                  {{ camp.name }}
                </button>
              </div>

              <div class="flex items-center gap-2">
                <!-- Filtro Estado: Todos, Visibles, Ocultos -->
                <select
                  v-model="visibilityFilterStatus"
                  class="text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none cursor-pointer"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="visible">Solo Visibles en Web</option>
                  <option value="hidden">Solo Ocultos</option>
                </select>

                <!-- Buscador -->
                <div class="relative min-w-[200px]">
                  <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    v-model="visibilitySearchQuery"
                    placeholder="Buscar por nombre..."
                    class="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Lista de Productos con Acciones Rápidas -->
            <div v-if="filteredVisibilityProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="prod in filteredVisibilityProducts"
                :key="prod.id"
                :class="[
                  'rounded-2xl border p-4 transition-all flex flex-col justify-between',
                  prod.is_active !== false
                    ? 'bg-white border-[#eedee9] shadow-2xs hover:border-[#caa35f]/60'
                    : 'bg-gray-50/90 border-gray-200 opacity-80'
                ]"
              >
                <div class="flex gap-3 mb-3">
                  <img
                    :src="prod.displayImage || '/products/box_basico_centered.webp'"
                    :alt="prod.name"
                    class="w-16 h-20 rounded-xl object-contain bg-[#faf7fb] border border-[#eedee9] p-1 shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 flex-wrap mb-1">
                      <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                        {{ getCampaignName(prod.campaign) }}
                      </span>
                      <span
                        :class="[
                          'text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 border',
                          prod.is_active !== false
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        ]"
                      >
                        {{ prod.is_active !== false ? 'Visible en Web' : 'Oculto' }}
                      </span>
                    </div>

                    <h4 class="text-xs font-bold text-[#27172b] line-clamp-2 leading-snug">
                      {{ prod.name }}
                    </h4>
                    <div class="text-xs font-bold text-[#27172b] mt-1">
                      S/ {{ Number(prod.price).toFixed(2) }}
                    </div>
                  </div>
                </div>

                <div class="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <!-- Botón de Stock: Agotado / En Stock -->
                  <button
                    @click="toggleProductStock(prod)"
                    :disabled="savingStockProdId === prod.id"
                    :class="[
                      'px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer',
                      prod.in_stock !== false
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                    ]"
                    :title="prod.in_stock !== false ? 'Clic para marcar como Agotado' : 'Clic para marcar como En Stock'"
                  >
                    {{ prod.in_stock !== false ? 'En Stock' : 'Agotado' }}
                  </button>

                  <!-- Botón Principal: Ocultar / Mostrar en Tienda -->
                  <button
                    @click="toggleProductActive(prod)"
                    :disabled="savingProductActiveId === prod.id"
                    :class="[
                      'px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50',
                      prod.is_active !== false
                        ? 'bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-900 border border-gray-200'
                        : 'bg-[#15803d] hover:bg-[#166534] text-white shadow-xs'
                    ]"
                  >
                    <RefreshCw v-if="savingProductActiveId === prod.id" class="w-3.5 h-3.5 animate-spin" />
                    <template v-else>
                      <EyeOff v-if="prod.is_active !== false" class="w-3.5 h-3.5" />
                      <Eye v-else class="w-3.5 h-3.5" />
                    </template>
                    <span>{{ prod.is_active !== false ? 'Ocultar' : 'Hacer Visible' }}</span>
                  </button>

                  <!-- Editar en Visibilidad -->
                  <button
                    @click="openEditProductModal(prod)"
                    class="p-2 rounded-xl border border-[#eedee9] text-gray-600 hover:text-[#27172b] hover:border-[#caa35f] hover:bg-[#faf7fb] transition-all cursor-pointer"
                    title="Editar información completa del producto"
                  >
                    <Edit3 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 bg-[#faf7fb] rounded-2xl border border-[#eedee9]">
              <EyeOff class="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p class="text-xs font-semibold text-gray-600">No hay productos que coincidan con el filtro seleccionado</p>
              <button
                @click="visibilityFilterCampaign = 'all'; visibilityFilterStatus = 'all'; visibilitySearchQuery = ''"
                class="mt-3 px-4 py-1.5 rounded-full bg-[#27172b] text-white text-xs font-semibold hover:bg-[#3d2444] transition-colors cursor-pointer"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Duplicate Confirmation Modal -->
      <div v-if="activeModalProduct" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#eedee9]">
          <div class="flex items-center justify-between pb-4 border-b border-[#f4eaf6] mb-5">
            <div>
              <span class="text-[10px] font-bold tracking-wider uppercase text-[#965e9b] block">Clonar Producto</span>
              <h3 class="text-lg font-bold text-[#27172b]">Confirmar Duplicación</h3>
            </div>
            <button
              @click="closeDuplicateModal"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Form Fields for the clone -->
          <div class="space-y-4">
            <!-- Image & Original preview -->
            <div class="p-3.5 rounded-2xl bg-[#faf7fb] border border-[#eedee9] flex items-center gap-3">
              <img
                v-if="activeModalProduct.image"
                :src="activeModalProduct.displayImage"
                class="w-14 h-14 object-contain rounded-xl bg-white border border-[#eedee9] shrink-0"
              />
              <div class="min-w-0">
                <span class="text-[10px] text-gray-400 font-medium block">Producto base a clonar:</span>
                <h4 class="text-xs font-semibold text-[#27172b] truncate">{{ activeModalProduct.name }}</h4>
                <span class="text-[11px] text-[#caa35f] font-bold">S/ {{ Number(activeModalProduct.price).toFixed(2) }}</span>
              </div>
            </div>

            <!-- New Name Input -->
            <div>
              <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Nombre del nuevo producto:</label>
              <input
                type="text"
                v-model="duplicateForm.name"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#965e9b] focus:outline-none"
                placeholder="Nombre para el nuevo producto"
              />
            </div>

            <!-- Position/Order Input -->
            <div>
              <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Posición / Orden en la tienda:
              </label>
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  v-model.number="duplicateForm.order"
                  min="1"
                  class="w-24 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#27172b] focus:border-[#965e9b] focus:outline-none"
                />
                <span class="text-[11px] text-[#965e9b] font-medium">
                  (Por defecto: 1 para salir al inicio del menú)
                </span>
              </div>
            </div>

            <!-- Price & Compare Price -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Precio (S/):</label>
                <input
                  type="number"
                  step="0.5"
                  v-model="duplicateForm.price"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#27172b] focus:border-[#965e9b] focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Precio Promo / Anterior (S/):</label>
                <input
                  type="number"
                  step="0.5"
                  v-model="duplicateForm.compare_at_price"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-500 focus:border-[#965e9b] focus:outline-none"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <!-- Campaign & Category -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Campaña:</label>
                <select
                  v-model="duplicateForm.campaign"
                  class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#965e9b] focus:outline-none cursor-pointer"
                >
                  <option value="maquillaje">Maquillaje</option>
                  <option value="hotwheels">Hot Wheels</option>
                  <option value="navidad">Navidad</option>
                  <option value="graduacion">Graduación</option>
                  <option value="cumpleanos">Cumpleaños</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Categoría:</label>
                <input
                  type="text"
                  v-model="duplicateForm.category"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#965e9b] focus:outline-none"
                />
              </div>
            </div>

            <!-- Items Included Textarea -->
            <div>
              <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Elementos Incluidos (uno por línea):</label>
              <textarea
                v-model="duplicateForm.items_included"
                rows="4"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:border-[#965e9b] focus:outline-none leading-relaxed"
                placeholder="1 Ramo&#10;Luces LED&#10;Tarjeta dedicatoria"
              ></textarea>
            </div>

            <!-- Options: Clone Image checkbox -->
            <label class="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                v-model="duplicateForm.copyImage"
                class="w-4 h-4 rounded text-[#965e9b] accent-[#965e9b]"
              />
              <span class="text-xs text-gray-700 font-medium">Clonar y transferir la misma foto al nuevo producto</span>
            </label>

            <!-- Success message card if already duplicated -->
            <div v-if="duplicateSuccess" class="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs space-y-2">
              <div class="flex items-center gap-2 font-bold text-green-900">
                <CheckCircle2 class="w-4 h-4 text-green-600" />
                <span>¡Producto duplicado con éxito!</span>
              </div>
              <p class="text-[11px] text-green-700">
                Nuevo producto creado con ID <code>{{ duplicateSuccess.id }}</code> en la posición <strong>#{{ duplicateForm.order || 1 }}</strong>.
              </p>
              <div class="flex items-center gap-2 pt-1">
                <a
                  :href="getRecordAdminUrl(duplicateSuccess.id)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-700 text-white font-bold text-[11px] hover:bg-green-800 transition-colors"
                >
                  <span>Abrir en PocketBase</span>
                  <ExternalLink class="w-3 h-3" />
                </a>
                <router-link
                  :to="`/${getProductSlug(duplicateSuccess)}`"
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-green-300 text-green-800 font-semibold text-[11px] hover:bg-green-100 transition-colors"
                >
                  <span>Ver en la Tienda</span>
                </router-link>
              </div>
            </div>

            <!-- Error message if failed -->
            <div v-if="duplicateError" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>{{ duplicateError }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 pt-4 border-t border-[#f4eaf6] flex items-center justify-end gap-3">
            <button
              @click="closeDuplicateModal"
              class="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {{ duplicateSuccess ? 'Cerrar' : 'Cancelar' }}
            </button>

            <button
              v-if="!duplicateSuccess"
              @click="executeDuplication"
              :disabled="isDuplicating"
              class="px-5 py-2.5 rounded-xl bg-[#27172b] text-white text-xs font-bold hover:bg-[#965e9b] transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <RefreshCw v-if="isDuplicating" class="w-3.5 h-3.5 animate-spin text-[#caa35f]" />
              <span>{{ isDuplicating ? 'Duplicando...' : 'Confirmar y Duplicar Ahora' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- PRODUCT EDITOR / CREATOR MODAL -->
      <div
        v-if="showProductModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      >
        <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#eedee9] overflow-hidden my-auto">
          <!-- Modal Header -->
          <div class="p-5 sm:p-6 pb-4 border-b border-[#f4eaf6] flex items-center justify-between shrink-0 bg-[#faf7fb]/70">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-[#27172b] text-[#caa35f] flex items-center justify-center shrink-0 shadow-xs">
                <Edit3 v-if="!isCreatingProduct" class="w-5 h-5" />
                <Plus v-else class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-[#965e9b]">
                    {{ isCreatingProduct ? 'Nuevo Registro' : 'Edición de Producto' }}
                  </span>
                  <span v-if="!isCreatingProduct && editingProductId" class="text-[10px] text-gray-400 font-mono">
                    ID: {{ editingProductId }}
                  </span>
                </div>
                <h3 class="text-base sm:text-lg font-serif font-bold text-[#27172b] line-clamp-1">
                  {{ isCreatingProduct ? 'Crear Nuevo Producto' : (productForm.name || 'Editar Información del Producto') }}
                </h3>
              </div>
            </div>

            <button
              @click="closeProductModal"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm transition-colors cursor-pointer shrink-0"
              title="Cerrar modal"
            >
              ✕
            </button>
          </div>

          <!-- Modal Tabs Switcher -->
          <div class="flex items-center gap-1.5 px-5 sm:px-6 py-2.5 bg-white border-b border-[#f4eaf6] overflow-x-auto shrink-0 no-scrollbar">
            <button
              @click="productModalTab = 'info'"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5',
                productModalTab === 'info'
                  ? 'bg-[#27172b] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-[#faf7fb]'
              ]"
            >
              <Tag class="w-3.5 h-3.5 text-[#caa35f]" />
              <span>1. Datos & Precios</span>
            </button>

            <button
              @click="productModalTab = 'images'"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5',
                productModalTab === 'images'
                  ? 'bg-[#27172b] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-[#faf7fb]'
              ]"
            >
              <ImageIcon class="w-3.5 h-3.5 text-[#caa35f]" />
              <span>2. Fotos e Imágenes</span>
              <span v-if="newMainImageFile || newCatalogCardFile" class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            </button>

            <button
              @click="productModalTab = 'content'"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5',
                productModalTab === 'content'
                  ? 'bg-[#27172b] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-[#faf7fb]'
              ]"
            >
              <FileText class="w-3.5 h-3.5 text-[#caa35f]" />
              <span>3. Descripción & Contenido</span>
            </button>

            <button
              @click="productModalTab = 'options'"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5',
                productModalTab === 'options'
                  ? 'bg-[#27172b] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-[#faf7fb]'
              ]"
            >
              <Layers class="w-3.5 h-3.5 text-[#caa35f]" />
              <span>4. Stock & Opciones</span>
            </button>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1">

            <!-- TAB 1: DATOS & PRECIOS -->
            <div v-show="productModalTab === 'info'" class="space-y-5">
              <!-- Product Name -->
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nombre Comercial del Producto *
                </label>
                <input
                  type="text"
                  v-model="productForm.name"
                  required
                  placeholder="Ej: Box de Rosas Eternas & Hot Wheels Premium"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#27172b] focus:border-[#965e9b] focus:outline-none focus:ring-1 focus:ring-[#965e9b]"
                />
                <span class="text-[11px] text-gray-400 mt-1 block">
                  El nombre visible para tus clientes en la tienda y en los recibos de WhatsApp.
                </span>
              </div>

              <!-- Friendly Slug / Direct Link -->
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Enlace Amigable Directo (URL limpia para compartir)</span>
                  <span class="text-[10px] text-[#caa35f] font-mono font-bold">
                    venezzia.shop/{{ productForm.slug || generateSlug(productForm.name) }}
                  </span>
                </label>
                <div class="relative flex items-center">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 select-none">
                    venezzia.shop/
                  </span>
                  <input
                    type="text"
                    v-model="productForm.slug"
                    :placeholder="generateSlug(productForm.name) || 'ej: CalendarioAdviento'"
                    class="w-full pl-28 pr-24 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#27172b] focus:border-[#965e9b] focus:outline-none"
                  />
                  <button
                    type="button"
                    @click="copyCleanLinkFromForm"
                    class="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#faf7fb] hover:bg-[#27172b] hover:text-white border border-[#eedee9] text-[10px] font-bold text-[#753d77] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Copy class="w-3 h-3 text-[#caa35f]" />
                    <span>{{ copiedFormLink ? '¡Copiado!' : 'Copiar' }}</span>
                  </button>
                </div>
                <span class="text-[11px] text-gray-400 mt-1 block">
                  Tus clientes podrán ingresar directamente con este enlace bonito y confiable sin signos de interrogación ni códigos extraños.
                </span>
              </div>

              <!-- Campaign Visual Selector -->
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Campaña / Colección *
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    v-for="camp in availableCampaignOptions"
                    :key="camp.id"
                    @click="productForm.campaign = camp.id"
                    :class="[
                      'p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5',
                      productForm.campaign === camp.id
                        ? 'border-[#27172b] bg-[#27172b] text-white shadow-sm ring-2 ring-[#caa35f]/50'
                        : 'border-gray-200 bg-[#faf7fb] text-gray-700 hover:border-gray-300'
                    ]"
                  >
                    <span class="text-base">{{ camp.emoji }}</span>
                    <div>
                      <div class="text-xs font-bold">{{ camp.name }}</div>
                      <span class="text-[9px] opacity-70 block">{{ camp.id }}</span>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Category Input + Quick Suggestion Chips -->
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Categoría del Producto *
                </label>
                <input
                  type="text"
                  v-model="productForm.category"
                  placeholder="Ej: Boxes de Maquillaje, Ramos con Rosas, etc."
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#27172b] focus:border-[#965e9b] focus:outline-none"
                />
                <!-- Quick Category Suggestions -->
                <div class="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span class="text-[10px] text-gray-400 font-medium">Sugerencias rápidas:</span>
                  <button
                    type="button"
                    v-for="cat in categorySuggestions"
                    :key="cat"
                    @click="selectCategory(cat)"
                    class="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#faf7fb] border border-[#eedee9] text-[#753d77] hover:bg-[#27172b] hover:text-white transition-colors cursor-pointer"
                  >
                    + {{ cat }}
                  </button>
                </div>
              </div>

              <!-- Prices & Order Row -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <!-- Sale Price -->
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Precio de Venta (S/) *
                  </label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">S/</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      v-model="productForm.price"
                      required
                      placeholder="0.00"
                      class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#27172b] focus:border-[#965e9b] focus:outline-none"
                    />
                  </div>
                  <span class="text-[10px] text-gray-400 mt-1 block">Precio que pagará el cliente.</span>
                </div>

                <!-- Compare At Price (Strikethrough) -->
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Precio Antes / Tachado (S/)
                  </label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">S/</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      v-model="productForm.compare_at_price"
                      placeholder="Opcional"
                      class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-600 focus:border-[#965e9b] focus:outline-none"
                    />
                  </div>
                  <span class="text-[10px] text-gray-400 mt-1 block">Aparece tachado para mostrar descuento.</span>
                </div>

                <!-- Order Position -->
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Posición en Catálogo
                  </label>
                  <input
                    type="number"
                    min="1"
                    v-model.number="productForm.order"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#27172b] focus:border-[#965e9b] focus:outline-none"
                  />
                  <span class="text-[10px] text-gray-400 mt-1 block">1 = primero en el catálogo.</span>
                </div>
              </div>

              <!-- Savings Preview Banner -->
              <div
                v-if="formSavingsText"
                class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2"
              >
                <Sparkles class="w-4 h-4 text-emerald-600 shrink-0" />
                <span class="font-semibold">{{ formSavingsText }}</span>
              </div>
            </div>

            <!-- TAB 2: FOTOS E IMÁGENES -->
            <div v-show="productModalTab === 'images'" class="space-y-6">
              <!-- WebP Performance Note -->
              <div class="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-start gap-2.5">
                <Sparkles class="w-4 h-4 text-[#caa35f] shrink-0 mt-0.5" />
                <div class="text-[11px] leading-relaxed">
                  <strong>Conversión Automática a WebP:</strong> Puedes subir fotos en cualquier formato (PNG, JPG o WebP). Al guardar, el sistema optimizará la foto automáticamente a formato WebP ultraligero (~90KB) para que cargue instantáneamente en los celulares de tus clientes.
                </div>
              </div>

              <!-- 1. MAIN PRODUCT IMAGE (image) -->
              <div class="p-5 rounded-2xl bg-[#faf7fb] border border-[#eedee9] space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-xs font-bold text-[#27172b] uppercase tracking-wider">
                      Foto Principal del Producto *
                    </h4>
                    <p class="text-[11px] text-gray-500">Es la imagen principal que se muestra en la tienda y en WhatsApp.</p>
                  </div>
                  <span class="text-[10px] font-bold text-[#965e9b] bg-white px-2.5 py-1 rounded-full border border-[#eedee9]">
                    Campo: image
                  </span>
                </div>

                <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <!-- Preview Container -->
                  <div class="w-32 h-32 rounded-2xl overflow-hidden bg-white border border-[#eedee9] shrink-0 relative shadow-2xs flex items-center justify-center">
                    <img
                      v-if="newMainImagePreview"
                      :src="newMainImagePreview"
                      alt="Nueva foto preview"
                      class="w-full h-full object-cover"
                    />
                    <img
                      v-else-if="productForm.currentImage"
                      :src="productForm.currentImage"
                      alt="Foto actual"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="text-center p-3 text-gray-300">
                      <ImageIcon class="w-8 h-8 mx-auto mb-1" />
                      <span class="text-[10px] block text-gray-400">Sin foto</span>
                    </div>

                    <!-- Badge if new file picked -->
                    <div
                      v-if="newMainImagePreview"
                      class="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[8px] uppercase tracking-wider shadow-xs"
                    >
                      Nueva
                    </div>
                  </div>

                  <!-- Upload Controls -->
                  <div class="flex-1 w-full space-y-2">
                    <label class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#27172b] text-white text-xs font-bold hover:bg-[#3d2444] transition-all cursor-pointer shadow-sm w-full sm:w-auto">
                      <UploadCloud class="w-4 h-4 text-[#caa35f]" />
                      <span>{{ (newMainImageFile || productForm.currentImage) ? 'Cambiar Foto Principal' : 'Subir Foto Principal' }}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        @change="onMainImageSelected"
                        class="hidden"
                      />
                    </label>

                    <button
                      v-if="newMainImagePreview"
                      type="button"
                      @click="clearNewMainImage"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all ml-0 sm:ml-2 cursor-pointer"
                    >
                      <X class="w-3.5 h-3.5" />
                      <span>Cancelar nueva foto</span>
                    </button>

                    <p class="text-[11px] text-gray-400 leading-snug">
                      Formatos recomendados: JPG, PNG o WebP. Resolución recomendada: cuadrada (ej: 1000x1000 px).
                    </p>
                  </div>
                </div>
              </div>

              <!-- 2. CATALOG CARD / SECONDARY FLYER (catalog_card) -->
              <div class="p-5 rounded-2xl bg-[#faf7fb] border border-[#eedee9] space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-xs font-bold text-[#27172b] uppercase tracking-wider">
                      Tarjeta de Catálogo / Flyer Secundario
                    </h4>
                    <p class="text-[11px] text-gray-500">Foto complementaria o flyer con la dedicatoria / detalles del box.</p>
                  </div>
                  <span class="text-[10px] font-bold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-[#eedee9]">
                    Campo: catalog_card
                  </span>
                </div>

                <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <!-- Preview -->
                  <div class="w-32 h-32 rounded-2xl overflow-hidden bg-white border border-[#eedee9] shrink-0 relative shadow-2xs flex items-center justify-center">
                    <img
                      v-if="newCatalogCardPreview"
                      :src="newCatalogCardPreview"
                      alt="Nueva tarjeta preview"
                      class="w-full h-full object-cover"
                    />
                    <img
                      v-else-if="productForm.currentCatalogCard && !removeCatalogCard"
                      :src="productForm.currentCatalogCard"
                      alt="Tarjeta actual"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="text-center p-3 text-gray-300">
                      <ImageIcon class="w-8 h-8 mx-auto mb-1" />
                      <span class="text-[10px] block text-gray-400">{{ removeCatalogCard ? 'Se eliminará' : 'Opcional' }}</span>
                    </div>

                    <div
                      v-if="newCatalogCardPreview"
                      class="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[8px] uppercase tracking-wider shadow-xs"
                    >
                      Nueva
                    </div>
                  </div>

                  <!-- Upload Controls -->
                  <div class="flex-1 w-full space-y-2">
                    <label class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-all cursor-pointer shadow-2xs w-full sm:w-auto">
                      <UploadCloud class="w-4 h-4 text-[#caa35f]" />
                      <span>{{ (newCatalogCardFile || (productForm.currentCatalogCard && !removeCatalogCard)) ? 'Cambiar Tarjeta' : 'Subir Tarjeta' }}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        @change="onCatalogCardSelected"
                        class="hidden"
                      />
                    </label>

                    <button
                      v-if="productForm.currentCatalogCard && !removeCatalogCard && !newCatalogCardFile"
                      type="button"
                      @click="markRemoveCatalogCard"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all ml-0 sm:ml-2 cursor-pointer"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                      <span>Quitar tarjeta</span>
                    </button>

                    <button
                      v-if="newCatalogCardPreview || removeCatalogCard"
                      type="button"
                      @click="clearNewCatalogCard(); removeCatalogCard = false"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-semibold transition-all ml-0 sm:ml-2 cursor-pointer"
                    >
                      <X class="w-3.5 h-3.5" />
                      <span>Restaurar anterior</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 3: DESCRIPCIÓN & CONTENIDO -->
            <div v-show="productModalTab === 'content'" class="space-y-5">
              <!-- Marketing Description -->
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Descripción Comercial del Producto
                </label>
                <textarea
                  v-model="productForm.description"
                  rows="3"
                  placeholder="Ej: Hermoso detalle personalizado con luces LED cálidas, rosas eternas de satén hechas a mano y acabados de lujo."
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-[#27172b] focus:border-[#965e9b] focus:outline-none leading-relaxed"
                ></textarea>
                <span class="text-[11px] text-gray-400 mt-1 block">
                  Aparece debajo del título del producto para enamorar al cliente.
                </span>
              </div>

              <!-- Included Items (One per line) -->
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Contenido del Box / Ramo (Ítems Incluidos)
                </label>
                <textarea
                  v-model="productForm.items_included"
                  rows="6"
                  placeholder="Caja personalizada con personaje favorito&#10;Luces cálidas LED integradas&#10;Tarjeta personalizada con dedicatoria&#10;Mascarilla facial hidratante&#10;Vincha suave para skincare"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono text-[#27172b] focus:border-[#965e9b] focus:outline-none leading-relaxed"
                ></textarea>
                <div class="p-3 mt-2 rounded-xl bg-[#faf7fb] border border-[#eedee9] text-[11px] text-gray-600 flex items-start gap-2">
                  <Info class="w-4 h-4 text-[#caa35f] shrink-0 mt-0.5" />
                  <span>
                    <strong>Escribe cada elemento en una línea nueva.</strong> En la tienda web se mostrará automáticamente con viñetas elegantes y organizadas.
                  </span>
                </div>
              </div>

              <!-- Live Preview of Items Included -->
              <div v-if="itemsIncludedList.length > 0" class="p-4 rounded-2xl bg-white border border-[#eedee9] shadow-2xs space-y-2">
                <span class="text-[10px] font-bold text-[#caa35f] uppercase tracking-wider block">
                  Vista Previa en Tienda ({{ itemsIncludedList.length }} ítems):
                </span>
                <ul class="space-y-1.5 text-xs text-gray-700">
                  <li v-for="(item, idx) in itemsIncludedList" :key="idx" class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#caa35f] shrink-0"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- TAB 4: STOCK & OPCIONES -->
            <div v-show="productModalTab === 'options'" class="space-y-5">
              <!-- Stock Toggle Card -->
              <div class="p-4 rounded-2xl border transition-all" :class="productForm.in_stock ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :class="productForm.in_stock ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'">
                      <CheckCircle2 v-if="productForm.in_stock" class="w-5 h-5" />
                      <AlertCircle v-else class="w-5 h-5" />
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-gray-900">
                        {{ productForm.in_stock ? '🟢 Producto En Stock (Disponible para Compra)' : '🔴 Producto Agotado' }}
                      </h4>
                      <p class="text-[11px] text-gray-600">
                        {{ productForm.in_stock ? 'Los clientes pueden añadir este producto al carrito y comprarlo.' : 'Se mostrará con la etiqueta "Agotado" y no permitirá procesar compras.' }}
                      </p>
                    </div>
                  </div>

                  <label class="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" v-model="productForm.in_stock" class="sr-only peer" />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              <!-- Visibility Toggle Card -->
              <div class="p-4 rounded-2xl border transition-all" :class="productForm.is_active ? 'bg-blue-50/70 border-blue-200' : 'bg-gray-100 border-gray-300'">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :class="productForm.is_active ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'">
                      <Eye v-if="productForm.is_active" class="w-5 h-5" />
                      <EyeOff v-else class="w-5 h-5" />
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-gray-900">
                        {{ productForm.is_active ? '👁️ Visible en la Tienda Pública' : '🔒 Oculto en Tienda (Borrador Privado)' }}
                      </h4>
                      <p class="text-[11px] text-gray-600">
                        {{ productForm.is_active ? 'Visible en el menú y catálogo para todos los visitantes.' : 'Oculto al público sin necesidad de eliminarlo. Puedes reactivarlo cuando quieras.' }}
                      </p>
                    </div>
                  </div>

                  <label class="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" v-model="productForm.is_active" class="sr-only peer" />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <!-- Featured & Car Addon Toggles -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Featured (Destacado) -->
                <div class="p-4 rounded-2xl bg-[#faf7fb] border border-[#eedee9] flex items-center justify-between">
                  <div>
                    <div class="flex items-center gap-1.5 text-xs font-bold text-[#27172b]">
                      <Star class="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>Producto Destacado</span>
                    </div>
                    <p class="text-[10px] text-gray-500 mt-0.5">Resalta con insignia dorada</p>
                  </div>
                  <input
                    type="checkbox"
                    v-model="productForm.featured"
                    class="w-5 h-5 rounded text-[#caa35f] accent-[#caa35f] cursor-pointer"
                  />
                </div>

                <!-- Addon Car -->
                <div class="p-4 rounded-2xl bg-[#faf7fb] border border-[#eedee9] flex items-center justify-between">
                  <div>
                    <div class="flex items-center gap-1.5 text-xs font-bold text-[#27172b]">
                      <Car class="w-4 h-4 text-blue-600" />
                      <span>Accesorio para Auto</span>
                    </div>
                    <p class="text-[10px] text-gray-500 mt-0.5">Ofrecido como adicional en compras</p>
                  </div>
                  <input
                    type="checkbox"
                    v-model="productForm.addon_car"
                    class="w-5 h-5 rounded text-blue-600 accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              <!-- TikTok Live Discount Input -->
              <div class="p-4 rounded-2xl bg-gradient-to-r from-[#faf7fb] to-[#fff5f8] border border-[#ff0050]/20 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Flame class="w-4 h-4 text-[#ff0050]" />
                    <span class="text-xs font-bold text-[#27172b]">Descuento TikTok Live Flash (S/)</span>
                  </div>
                  <span class="text-[10px] font-bold text-[#ff0050] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Opcional
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="relative w-36">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">S/</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      v-model.number="productForm.live_discount"
                      placeholder="0"
                      class="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#27172b] focus:border-[#ff0050] focus:outline-none"
                    />
                  </div>
                  <span class="text-[11px] text-gray-500">
                    Descuento automático que se aplicará únicamente cuando la dinámica de TikTok Live esté encendida.
                  </span>
                </div>
              </div>
            </div>

            <!-- Error banner -->
            <div v-if="saveProductError" class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>{{ saveProductError }}</span>
            </div>

            <!-- Success banner -->
            <div v-if="saveProductSuccess" class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 shrink-0" />
              <span>{{ saveProductSuccess }}</span>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 sm:p-5 border-t border-[#f4eaf6] bg-[#faf7fb] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <!-- Left: Delete button (only when editing) -->
            <div>
              <button
                v-if="!isCreatingProduct && editingProductId"
                type="button"
                @click="confirmDeleteProduct({ id: editingProductId, name: productForm.name, price: productForm.price, displayImage: productForm.currentImage })"
                class="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 class="w-3.5 h-3.5" />
                <span>Eliminar Producto</span>
              </button>
            </div>

            <!-- Right: Cancel & Save -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="closeProductModal"
                :disabled="isSavingProduct"
                class="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                @click="saveEditedProduct"
                :disabled="isSavingProduct"
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#27172b] to-[#451f4c] text-white text-xs font-bold hover:from-[#351a3b] hover:to-[#572460] transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw v-if="isSavingProduct" class="w-3.5 h-3.5 animate-spin text-[#caa35f]" />
                <Save v-else class="w-3.5 h-3.5 text-[#caa35f]" />
                <span>{{ isSavingProduct ? 'Guardando en PocketBase...' : (isCreatingProduct ? 'Crear y Publicar Producto' : 'Guardar Todos los Cambios') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SAFE DELETE CONFIRMATION MODAL -->
      <div
        v-if="showDeleteConfirmModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-100 text-center space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
            <Trash2 class="w-7 h-7" />
          </div>

          <div>
            <h3 class="text-lg font-serif font-bold text-[#27172b]">¿Eliminar este producto?</h3>
            <p class="text-xs text-gray-500 mt-1 leading-relaxed">
              Esta acción no se puede deshacer. El producto desaparecerá de la tienda web y de la base de datos de PocketBase.
            </p>
          </div>

          <!-- Product Preview -->
          <div v-if="productToDelete" class="p-3 rounded-2xl bg-[#faf7fb] border border-[#eedee9] flex items-center gap-3 text-left">
            <img
              v-if="productToDelete.displayImage"
              :src="productToDelete.displayImage"
              :alt="productToDelete.name"
              class="w-12 h-12 rounded-xl object-cover border border-[#eedee9] shrink-0"
            />
            <div class="min-w-0">
              <h4 class="text-xs font-bold text-[#27172b] truncate">{{ productToDelete.name }}</h4>
              <span class="text-xs text-[#caa35f] font-bold">S/ {{ Number(productToDelete.price || 0).toFixed(2) }}</span>
            </div>
          </div>

          <div class="pt-2 flex items-center justify-center gap-2">
            <button
              @click="cancelDeleteProduct"
              :disabled="isDeletingProduct"
              class="w-1/2 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              @click="executeDeleteProduct"
              :disabled="isDeletingProduct"
              class="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw v-if="isDeletingProduct" class="w-3.5 h-3.5 animate-spin text-white" />
              <span>{{ isDeletingProduct ? 'Eliminando...' : 'Sí, Eliminar' }}</span>
            </button>
          </div>
        </div>
      </div>
      <!-- WHATSAPP SUPPORT NUMBER CONFIG MODAL -->
      <div
        v-if="showWhatsAppModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeWhatsAppConfigModal"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#eedee9] text-left relative overflow-hidden space-y-5 animate-in fade-in zoom-in-95 duration-150">
          <!-- Glow top background -->
          <div class="absolute -top-16 -right-16 w-44 h-44 bg-emerald-100/60 rounded-full blur-2xl pointer-events-none"></div>

          <!-- Header -->
          <div class="flex items-start justify-between gap-4 relative z-10">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center shrink-0 shadow-xs">
                <IconWhatsApp class="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  <Sparkles class="w-3 h-3 text-emerald-600" />
                  <span>Atención y Pedidos Web</span>
                </div>
                <h3 class="text-lg sm:text-xl font-serif font-bold text-[#27172b]">
                  Número de WhatsApp de la Tienda
                </h3>
              </div>
            </div>
            <button
              @click="closeWhatsAppConfigModal"
              class="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              title="Cerrar ventana"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <p class="text-xs text-gray-500 leading-relaxed relative z-10">
            Este es el número oficial al que serán dirigidos tus clientes cuando den clic en cualquier botón de WhatsApp en <strong class="text-[#27172b]">venezzia.shop</strong> (Navbar, Botón Flotante, Carrito de Compras, Catálogo y Footer).
          </p>

          <!-- Current Active Number Banner -->
          <div class="p-3.5 rounded-2xl bg-[#faf5fb] border border-[#eedee9] flex items-center justify-between gap-3 relative z-10">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Número Actual Activo</span>
                <span class="text-sm font-mono font-bold text-[#27172b]">{{ siteSettingsStore.formattedPhone || '+51 935 817 179' }}</span>
              </div>
            </div>
            <span class="text-[10px] text-gray-500 bg-white px-2.5 py-1 rounded-xl border border-gray-200 font-medium">
              Sincronizado en vivo
            </span>
          </div>

          <!-- Phone Input Section -->
          <div class="space-y-2 relative z-10">
            <label class="block text-xs font-bold text-gray-700">
              Nuevo Número de WhatsApp:
            </label>
            <div class="relative flex items-center">
              <div class="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-gray-600 text-xs font-bold">
                <span>🇵🇪</span>
                <span class="text-gray-400 font-mono">+51</span>
              </div>
              <input
                v-model="whatsappInput"
                type="tel"
                placeholder="932 449 996"
                class="w-full pl-18 pr-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-mono font-bold text-[#27172b] focus:border-[#25D366] focus:ring-4 focus:ring-emerald-50 focus:outline-none transition-all shadow-inner"
                @keyup.enter="saveWhatsAppConfig"
              />
            </div>
            <p class="text-[11px] text-gray-400">
              Escribe el número de 9 dígitos de Perú (ej: <strong>932449996</strong>) o con prefijo (<strong>51932449996</strong>). Se formateará automáticamente.
            </p>
          </div>

          <!-- Live Formatting & Test Link Preview -->
          <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2.5 relative z-10">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500 font-medium">Formato visible en tienda:</span>
              <span class="font-mono font-bold text-emerald-800">{{ previewWhatsAppFormatted }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500 font-medium">Enlace directo a generar:</span>
              <span class="font-mono text-[11px] text-emerald-700 truncate max-w-[200px] sm:max-w-[260px]">wa.me/{{ normalizedWhatsAppNumber || '...' }}</span>
            </div>

            <!-- Test Chat Button -->
            <div class="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
              <span class="text-[11px] text-emerald-700 font-medium">¿Deseas verificar tu chat antes de guardar?</span>
              <a
                :href="previewWhatsAppTestUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all shadow-2xs border border-emerald-200 cursor-pointer"
              >
                <ExternalLink class="w-3.5 h-3.5 text-emerald-600" />
                <span>Probar en WhatsApp</span>
              </a>
            </div>
          </div>

          <!-- Feedback Alert: Success or Error -->
          <div
            v-if="whatsappSaveSuccess"
            class="p-3.5 rounded-2xl bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 relative z-10"
          >
            <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
            <span>¡Número de WhatsApp actualizado exitosamente! Todos los botones de la tienda ahora redirigen a este nuevo número.</span>
          </div>

          <div
            v-if="whatsappSaveError"
            class="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2.5 relative z-10"
          >
            <AlertCircle class="w-4 h-4 text-red-600 shrink-0" />
            <span>{{ whatsappSaveError }}</span>
          </div>

          <!-- Footer Actions -->
          <div class="pt-2 flex items-center justify-end gap-2.5 relative z-10">
            <button
              type="button"
              @click="closeWhatsAppConfigModal"
              class="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="saveWhatsAppConfig"
              :disabled="isSavingWhatsApp || !normalizedWhatsAppNumber"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw v-if="isSavingWhatsApp" class="w-4 h-4 animate-spin text-white" />
              <Save v-else class="w-4 h-4 text-white" />
              <span>{{ isSavingWhatsApp ? 'Guardando en PocketBase...' : 'Guardar Nuevo Número' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PocketBase from 'pocketbase'
import {
  Copy, Check, Search, ExternalLink, Sparkles, Filter,
  ArrowRight, RefreshCw, AlertCircle, Home, CheckCircle2,
  Package, Tag, DollarSign, Layers, PlusCircle, ArrowUpRight,
  Move, GripVertical, ChevronUp, ChevronDown, Save, Lock, LogOut, Zap,
  Flame, Clock, Play, Square, Plus, Eye, EyeOff,
  Edit3, Trash2, UploadCloud, X, Star, Car, LayoutGrid, List,
  FileText, Image as ImageIcon, ShoppingBag, Info, CheckSquare,
  Link as LinkIcon
} from 'lucide-vue-next'
import { useSiteSettingsStore } from '../stores/siteSettings'
import IconWhatsApp from '../components/icons/IconWhatsApp.vue'
import { getProductSlug, getProductUrl, generateSlug } from '../utils/productUrl'

const siteSettingsStore = useSiteSettingsStore()

const AUTH_STORAGE_KEY = 'venezzia_admin_auth'

// Default active tab: 'catalogo'
const activeToolTab = ref('catalogo')

// Catalog View & Filter State
const catalogSearchQuery = ref('')
const catalogSelectedCampaign = ref('all')
const catalogStockFilter = ref('all') // 'all', 'in_stock', 'out_of_stock'
const catalogVisibilityFilter = ref('all') // 'all', 'visible', 'hidden'
const catalogViewMode = ref('grid') // 'grid' | 'table'

// Product Editor Modal State
const showProductModal = ref(false)
const isCreatingProduct = ref(false)
const editingProductId = ref(null)
const productModalTab = ref('info') // 'info', 'images', 'content', 'options'
const newMainImageFile = ref(null)
const newMainImagePreview = ref('')
const newCatalogCardFile = ref(null)
const newCatalogCardPreview = ref('')
const removeCatalogCard = ref(false)
const isSavingProduct = ref(false)
const saveProductError = ref('')
const saveProductSuccess = ref('')
const copiedFormLink = ref(false)
const copiedCardLinkId = ref(null)

const productForm = ref({
  name: '',
  slug: '',
  price: 0,
  compare_at_price: null,
  campaign: 'maquillaje',
  category: 'Boxes de Maquillaje',
  description: '',
  items_included: '',
  order: 1,
  in_stock: true,
  is_active: true,
  featured: false,
  addon_car: false,
  live_discount: 0,
  currentImage: '',
  currentCatalogCard: ''
})

// Safe Delete Confirmation Modal State
const showDeleteConfirmModal = ref(false)
const productToDelete = ref(null)
const isDeletingProduct = ref(false)

const availableCampaignOptions = [
  { id: 'maquillaje', name: 'Maquillaje', emoji: '💄' },
  { id: 'hotwheels', name: 'Hot Wheels', emoji: '🏎️' },
  { id: 'graduacion', name: 'Graduación', emoji: '🎓' },
  { id: 'cumpleanos', name: 'Cumpleaños', emoji: '🎂' },
  { id: 'navidad', name: 'Navidad', emoji: '🎄' }
]

const categorySuggestions = [
  'Boxes de Maquillaje',
  'Ramos con Rosas',
  'Autos Personalizados',
  'Ramos Hot Wheels',
  'Gift Boxes & Cuadros',
  'Peluches Graduados',
  'Boxes de Birrete & Gala',
  'Ramos de Graduación',
  'Boxes de Cumpleaños',
  'Ramos Festivos',
  'Boxes Navideños',
  'Calendario de Adviento'
]

function selectCategory(cat) {
  productForm.value.category = cat
}

function getItemsCount(prod) {
  if (!prod.items_included) return 0
  if (Array.isArray(prod.items_included)) return prod.items_included.length
  return String(prod.items_included).split('\n').filter(line => line.trim().length > 0).length
}

const itemsIncludedList = computed(() => {
  if (!productForm.value.items_included) return []
  return String(productForm.value.items_included)
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
})

const formSavingsText = computed(() => {
  const price = Number(productForm.value.price) || 0
  const compare = Number(productForm.value.compare_at_price) || 0
  if (compare > price && price > 0) {
    const diff = compare - price
    const pct = Math.round((diff / compare) * 100)
    return `Ahorro de S/ ${diff.toFixed(2)} (-${pct}% de descuento para el cliente)`
  }
  return null
})

const inStockCount = computed(() => products.value.filter(p => p.in_stock !== false).length)
const outOfStockCount = computed(() => products.value.filter(p => p.in_stock === false).length)

const catalogCampaignFilters = computed(() => [
  { id: 'all', name: 'Todos' },
  { id: 'maquillaje', name: 'Maquillaje' },
  { id: 'hotwheels', name: 'Hot Wheels' },
  { id: 'graduacion', name: 'Graduación' },
  { id: 'cumpleanos', name: 'Cumpleaños' },
  { id: 'navidad', name: 'Navidad' }
])

function getProductCountForFilter(campId) {
  if (campId === 'all') return products.value.length
  return products.value.filter(p => (p.campaign || '').toLowerCase() === campId.toLowerCase()).length
}

const filteredCatalogProducts = computed(() => {
  let list = products.value

  if (catalogSelectedCampaign.value !== 'all') {
    list = list.filter(p => (p.campaign || '').toLowerCase() === catalogSelectedCampaign.value.toLowerCase())
  }

  if (catalogStockFilter.value === 'in_stock') {
    list = list.filter(p => p.in_stock !== false)
  } else if (catalogStockFilter.value === 'out_of_stock') {
    list = list.filter(p => p.in_stock === false)
  }

  if (catalogVisibilityFilter.value === 'visible') {
    list = list.filter(p => p.is_active !== false)
  } else if (catalogVisibilityFilter.value === 'hidden') {
    list = list.filter(p => p.is_active === false)
  }

  if (catalogSearchQuery.value.trim()) {
    const q = catalogSearchQuery.value.toLowerCase().trim()
    list = list.filter(p => {
      const name = (p.name || '').toLowerCase()
      const cat = (p.category || '').toLowerCase()
      const desc = (p.description || '').toLowerCase()
      const items = (p.items_included || '').toLowerCase()
      return name.includes(q) || cat.includes(q) || desc.includes(q) || items.includes(q)
    })
  }

  return list
})

function openCreateProductModal() {
  isCreatingProduct.value = true
  editingProductId.value = null
  productModalTab.value = 'info'
  saveProductError.value = ''
  saveProductSuccess.value = ''
  newMainImageFile.value = null
  newMainImagePreview.value = ''
  newCatalogCardFile.value = null
  newCatalogCardPreview.value = ''
  removeCatalogCard.value = false

  productForm.value = {
    name: '',
    slug: '',
    price: 0,
    compare_at_price: null,
    campaign: catalogSelectedCampaign.value !== 'all' ? catalogSelectedCampaign.value : 'maquillaje',
    category: 'Boxes de Maquillaje',
    description: '',
    items_included: '',
    order: 1,
    in_stock: true,
    is_active: true,
    featured: false,
    addon_car: false,
    live_discount: 0,
    currentImage: '',
    currentCatalogCard: ''
  }

  showProductModal.value = true
}

function openEditProductModal(prod) {
  isCreatingProduct.value = false
  editingProductId.value = prod.id
  productModalTab.value = 'info'
  saveProductError.value = ''
  saveProductSuccess.value = ''
  newMainImageFile.value = null
  newMainImagePreview.value = ''
  newCatalogCardFile.value = null
  newCatalogCardPreview.value = ''
  removeCatalogCard.value = false

  let curImg = prod.displayImage || ''
  if (!curImg && prod.image && currentPbClient.value) {
    curImg = currentPbClient.value.files.getURL(prod, prod.image)
  }

  let curCard = ''
  if (prod.catalog_card && currentPbClient.value) {
    curCard = currentPbClient.value.files.getURL(prod, prod.catalog_card)
  }

  productForm.value = {
    name: prod.name || '',
    slug: prod.slug || getProductSlug(prod),
    price: prod.price !== undefined && prod.price !== null ? Number(prod.price) : 0,
    compare_at_price: prod.compare_at_price !== undefined && prod.compare_at_price !== null && prod.compare_at_price !== '' && Number(prod.compare_at_price) > 0 ? Number(prod.compare_at_price) : null,
    campaign: prod.campaign || 'maquillaje',
    category: prod.category || 'General',
    description: prod.description || '',
    items_included: typeof prod.items_included === 'string'
      ? prod.items_included
      : Array.isArray(prod.items_included)
        ? prod.items_included.join('\n')
        : '',
    order: prod.order !== undefined && prod.order !== null ? Number(prod.order) : 1,
    in_stock: prod.in_stock !== false,
    is_active: prod.is_active !== false,
    featured: prod.featured === true,
    addon_car: prod.addon_car === true,
    live_discount: prod.live_discount !== undefined && prod.live_discount !== null ? Number(prod.live_discount) : 0,
    currentImage: curImg,
    currentCatalogCard: curCard
  }

  showProductModal.value = true
}

function copyCleanLinkFromForm() {
  const slug = productForm.value.slug?.trim() || generateSlug(productForm.value.name)
  const fullUrl = `${window.location.origin}/${slug}`
  navigator.clipboard.writeText(fullUrl).then(() => {
    copiedFormLink.value = true
    setTimeout(() => {
      copiedFormLink.value = false
    }, 2500)
  })
}

function copyProductLink(prod) {
  const fullUrl = getProductUrl(prod)
  navigator.clipboard.writeText(fullUrl).then(() => {
    copiedCardLinkId.value = prod.id
    setTimeout(() => {
      copiedCardLinkId.value = null
    }, 2500)
  })
}

function closeProductModal() {
  showProductModal.value = false
  editingProductId.value = null
  newMainImageFile.value = null
  if (newMainImagePreview.value) {
    URL.revokeObjectURL(newMainImagePreview.value)
    newMainImagePreview.value = ''
  }
  newCatalogCardFile.value = null
  if (newCatalogCardPreview.value) {
    URL.revokeObjectURL(newCatalogCardPreview.value)
    newCatalogCardPreview.value = ''
  }
  removeCatalogCard.value = false
  saveProductError.value = ''
  saveProductSuccess.value = ''
}

function onMainImageSelected(event) {
  const file = event.target.files && event.target.files[0]
  if (!file) return
  newMainImageFile.value = file
  if (newMainImagePreview.value) {
    URL.revokeObjectURL(newMainImagePreview.value)
  }
  newMainImagePreview.value = URL.createObjectURL(file)
}

function clearNewMainImage() {
  newMainImageFile.value = null
  if (newMainImagePreview.value) {
    URL.revokeObjectURL(newMainImagePreview.value)
    newMainImagePreview.value = ''
  }
}

function onCatalogCardSelected(event) {
  const file = event.target.files && event.target.files[0]
  if (!file) return
  newCatalogCardFile.value = file
  removeCatalogCard.value = false
  if (newCatalogCardPreview.value) {
    URL.revokeObjectURL(newCatalogCardPreview.value)
  }
  newCatalogCardPreview.value = URL.createObjectURL(file)
}

function clearNewCatalogCard() {
  newCatalogCardFile.value = null
  if (newCatalogCardPreview.value) {
    URL.revokeObjectURL(newCatalogCardPreview.value)
    newCatalogCardPreview.value = ''
  }
}

function markRemoveCatalogCard() {
  clearNewCatalogCard()
  removeCatalogCard.value = true
}

async function saveEditedProduct() {
  if (!productForm.value.name.trim()) {
    saveProductError.value = 'El nombre del producto es obligatorio.'
    productModalTab.value = 'info'
    return
  }
  if (productForm.value.price === null || productForm.value.price === undefined || isNaN(productForm.value.price) || Number(productForm.value.price) < 0) {
    saveProductError.value = 'Por favor ingresa un precio válido.'
    productModalTab.value = 'info'
    return
  }

  isSavingProduct.value = true
  saveProductError.value = ''
  saveProductSuccess.value = ''

  try {
    const formData = new FormData()
    formData.append('name', productForm.value.name.trim())
    formData.append('price', String(Number(productForm.value.price)))
    if (productForm.value.compare_at_price !== null && productForm.value.compare_at_price !== '' && !isNaN(productForm.value.compare_at_price) && Number(productForm.value.compare_at_price) > 0) {
      formData.append('compare_at_price', String(Number(productForm.value.compare_at_price)))
    } else {
      formData.append('compare_at_price', '0')
    }
    formData.append('campaign', productForm.value.campaign || 'maquillaje')
    formData.append('category', productForm.value.category || 'General')
    formData.append('description', productForm.value.description || '')
    formData.append('items_included', productForm.value.items_included || '')
    formData.append('order', String(productForm.value.order || 1))
    formData.append('in_stock', productForm.value.in_stock ? 'true' : 'false')
    formData.append('is_active', productForm.value.is_active ? 'true' : 'false')
    formData.append('featured', productForm.value.featured ? 'true' : 'false')
    formData.append('addon_car', productForm.value.addon_car ? 'true' : 'false')
    formData.append('live_discount', String(Number(productForm.value.live_discount || 0)))

    // Friendly Slug
    const finalSlug = (productForm.value.slug && productForm.value.slug.trim()) || generateSlug(productForm.value.name)
    if (finalSlug) {
      formData.append('slug', finalSlug)
    }

    // Handle Main Image file upload (with automatic WebP optimization)
    if (newMainImageFile.value) {
      let blob = newMainImageFile.value
      let filename = newMainImageFile.value.name || 'product.webp'
      if (!filename.toLowerCase().endsWith('.webp')) {
        blob = await convertBlobToWebP(blob, 1200, 0.86)
        filename = filename.replace(/\.[^/.]+$/, '') + '.webp'
      }
      formData.append('image', blob, filename)
    }

    // Handle Catalog Card file upload
    if (newCatalogCardFile.value) {
      let blob = newCatalogCardFile.value
      let filename = newCatalogCardFile.value.name || 'catalog_card.webp'
      if (!filename.toLowerCase().endsWith('.webp')) {
        blob = await convertBlobToWebP(blob, 1400, 0.86)
        filename = filename.replace(/\.[^/.]+$/, '') + '.webp'
      }
      formData.append('catalog_card', blob, filename)
    } else if (removeCatalogCard.value) {
      formData.append('catalog_card', '')
    }

    if (isCreatingProduct.value) {
      await currentPbClient.value.collection('products').create(formData)
      saveProductSuccess.value = '¡Producto creado y publicado con éxito!'
    } else {
      await currentPbClient.value.collection('products').update(editingProductId.value, formData)
      saveProductSuccess.value = '¡Producto actualizado correctamente!'
    }

    await loadProducts()
    setTimeout(() => {
      closeProductModal()
    }, 1200)
  } catch (err) {
    console.error('Error saving product:', err)
    saveProductError.value = err?.message || 'Error al guardar el producto en PocketBase.'
  } finally {
    isSavingProduct.value = false
  }
}

function confirmDeleteProduct(prod) {
  productToDelete.value = prod
  showDeleteConfirmModal.value = true
}

function cancelDeleteProduct() {
  productToDelete.value = null
  showDeleteConfirmModal.value = false
}

async function executeDeleteProduct() {
  if (!productToDelete.value || !currentPbClient.value) return
  isDeletingProduct.value = true
  try {
    await currentPbClient.value.collection('products').delete(productToDelete.value.id)
    if (showProductModal.value && editingProductId.value === productToDelete.value.id) {
      closeProductModal()
    }
    cancelDeleteProduct()
    await loadProducts()
  } catch (err) {
    console.error('Error deleting product:', err)
    alert('Error al eliminar el producto: ' + (err?.message || 'Error desconocido'))
  } finally {
    isDeletingProduct.value = false
  }
}

const selectedLiveDuration = ref(15)
const customLiveMinutes = ref('')
const selectedLiveCampaign = ref('hotwheels')
const selectedLiveDiscount = ref(10)
const liveBannerTextInput = ref('¡EN VIVO EN TIKTOK! S/ 10 de descuento en Box Hot Wheels')
const isSavingLiveSettings = ref(false)
const savingProductDiscountId = ref(null)

const targetServer = ref('remote')
const currentPbClient = ref(null)

const isAuthenticated = ref(false)
const loginEmail = ref('')
const loginPassword = ref('')
const isLoggingIn = ref(false)
const loginError = ref('')

const products = ref([])
const isLoadingProducts = ref(false)
const selectedCampaign = ref('all')
const searchQuery = ref('')

// Reorder State
const reorderCampaign = ref('maquillaje')
const reorderProductList = ref([])
const hasUnsavedOrder = ref(false)
const isSavingOrder = ref(false)
const draggedItemIndex = ref(null)
const draggedOverIndex = ref(null)

// Duplicate modal state
const activeModalProduct = ref(null)
const isDuplicating = ref(false)
const duplicateSuccess = ref(null)
const duplicateError = ref('')
const copiedBookmarklet = ref(false)

const duplicateForm = ref({
  name: '',
  price: 0,
  compare_at_price: null,
  campaign: 'maquillaje',
  category: '',
  items_included: '',
  order: 1,
  copyImage: true
})

// WebP Image Optimization State
const isOptimizingWebp = ref(false)
const optimizeWebpProgress = ref('')
const unoptimizedProducts = computed(() => {
  return products.value.filter(p => p.image && !p.image.toLowerCase().endsWith('.webp'))
})

function convertBlobToWebP(blob, maxDim = 1200, quality = 0.86) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let w = img.width
      let h = img.height
      if (Math.max(w, h) > maxDim) {
        const ratio = maxDim / Math.max(w, h)
        w = Math.round(w * ratio)
        h = Math.round(h * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob((webpBlob) => {
        resolve(webpBlob || blob)
      }, 'image/webp', quality)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(blob)
    }
    img.src = url
  })
}

async function optimizeAllToWebP() {
  if (unoptimizedProducts.value.length === 0 || isOptimizingWebp.value) return
  isOptimizingWebp.value = true
  optimizeWebpProgress.value = `Iniciando optimización de ${unoptimizedProducts.value.length} imágenes...`

  let successCount = 0
  const total = unoptimizedProducts.value.length

  for (let i = 0; i < total; i++) {
    const prod = unoptimizedProducts.value[i]
    optimizeWebpProgress.value = `Optimizando (${i + 1}/${total}): ${prod.name}...`
    try {
      const origUrl = currentPbClient.value.files.getURL(prod, prod.image)
      const res = await fetch(origUrl)
      if (!res.ok) continue
      const rawBlob = await res.blob()
      const webpBlob = await convertBlobToWebP(rawBlob, 1200, 0.86)

      const baseName = prod.image.replace(/\.[^/.]+$/, '')
      const newName = `${baseName}.webp`

      const formData = new FormData()
      formData.append('image', webpBlob, newName)

      await currentPbClient.value.collection('products').update(prod.id, formData)
      successCount++
    } catch (err) {
      console.error(`Error optimizando ${prod.name}:`, err)
    }
  }

  optimizeWebpProgress.value = `¡Completado! Se optimizaron ${successCount} imágenes a WebP.`
  await loadProducts()
  setTimeout(() => {
    isOptimizingWebp.value = false
    optimizeWebpProgress.value = ''
  }, 4000)
}

const campaignsList = [
  { id: 'all', name: 'Todos los Productos' },
  { id: 'maquillaje', name: 'Maquillaje' },
  { id: 'hotwheels', name: 'Hot Wheels' },
  { id: 'navidad', name: 'Navidad' },
  { id: 'graduacion', name: 'Graduación' },
  { id: 'cumpleanos', name: 'Cumpleaños' }
]

const campaignsReorderList = [
  { id: 'maquillaje', name: 'Día del Maquillaje' },
  { id: 'hotwheels', name: 'Día Hot Wheels' },
  { id: 'navidad', name: 'Navidad' },
  { id: 'graduacion', name: 'Graduación' },
  { id: 'cumpleanos', name: 'Cumpleaños' }
]

function getTargetBaseUrl() {
  return targetServer.value === 'remote' ? 'https://admin.venezzia.shop' : 'http://127.0.0.1:8090'
}

const adminUrl = computed(() => {
  return `${getTargetBaseUrl()}/_/`
})

function getRecordAdminUrl(recordId) {
  return `${getTargetBaseUrl()}/_/#/collections?collectionId=pbc_products_01&recordId=${recordId}`
}

function initPbClient() {
  const url = getTargetBaseUrl()
  currentPbClient.value = new PocketBase(url)

  // Check saved session in localStorage (checks both venezzia_admin_auth and pb_admin_auth from orders)
  try {
    let saved = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!saved) {
      saved = localStorage.getItem('pb_admin_auth')
    }
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed && parsed.token) {
        currentPbClient.value.authStore.save(parsed.token, parsed.record || parsed.admin)
        if (currentPbClient.value.authStore.isValid && currentPbClient.value.authStore.isSuperuser) {
          isAuthenticated.value = true
          loadProducts()
          return
        }
      }
    }
  } catch (_) {}

  isAuthenticated.value = false
}

async function loginAsAdmin() {
  if (!loginEmail.value || !loginPassword.value) return
  isLoggingIn.value = true
  loginError.value = ''

  try {
    const url = getTargetBaseUrl()
    currentPbClient.value = new PocketBase(url)
    const authData = await currentPbClient.value.collection('_superusers').authWithPassword(
      loginEmail.value.trim(),
      loginPassword.value
    )

    if (authData && authData.token) {
      // Save session securely on this device (synced with orders panel)
      const sessionData = JSON.stringify({
        token: authData.token,
        record: authData.record,
        server: targetServer.value
      })
      localStorage.setItem(AUTH_STORAGE_KEY, sessionData)
      localStorage.setItem('pb_admin_auth', sessionData)

      isAuthenticated.value = true
      loginPassword.value = '' // Clear password from memory
      await loadProducts()
    } else {
      throw new Error('No se pudo autenticar como superusuario.')
    }
  } catch (err) {
    loginError.value = 'Credenciales incorrectas. Verifica tu correo y contraseña de PocketBase.'
    isAuthenticated.value = false
  } finally {
    isLoggingIn.value = false
  }
}

function logoutAdmin() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem('pb_admin_auth')
    if (currentPbClient.value && currentPbClient.value.authStore) {
      currentPbClient.value.authStore.clear()
    }
  } catch (_) {}

  isAuthenticated.value = false
  products.value = []
  reorderProductList.value = []
  loginPassword.value = ''
  loginError.value = ''
}

function onServerChange() {
  logoutAdmin()
  initPbClient()
}

async function loadProducts() {
  if (!currentPbClient.value || !isAuthenticated.value) return
  isLoadingProducts.value = true
  try {
    const records = await currentPbClient.value.collection('products').getFullList()
    
    // Sort records following the official rule:
    // 1. Explicit order 1, 2, 3...
    // 2. Unassigned (0 or null) goes first
    // 3. Newest created first
    records.sort((a, b) => {
      const orderA = (a.order !== null && a.order !== undefined && a.order !== '') ? Number(a.order) : 0
      const orderB = (b.order !== null && b.order !== undefined && b.order !== '') ? Number(b.order) : 0
      if (orderA !== orderB) {
        if (orderA === 0) return -1
        if (orderB === 0) return 1
        return orderA - orderB
      }
      const dateA = a.created ? new Date(a.created).getTime() : 0
      const dateB = b.created ? new Date(b.created).getTime() : 0
      return dateB - dateA
    })

    products.value = records.map(r => {
      let displayImg = ''
      if (r.image) {
        if (r.image.startsWith('http') || r.image.startsWith('/')) {
          displayImg = r.image
        } else {
          const isWebp = (r.image || '').toLowerCase().endsWith('.webp')
          displayImg = isWebp
            ? currentPbClient.value.files.getURL(r, r.image)
            : currentPbClient.value.files.getURL(r, r.image, { thumb: '0x800' })
        }
      }
      return {
        ...r,
        order: r.order !== undefined && r.order !== null ? Number(r.order) : 1,
        live_discount: r.live_discount !== undefined && r.live_discount !== null && r.live_discount !== '' ? Number(r.live_discount) : 0,
        in_stock: r.in_stock !== false,
        is_active: r.is_active !== false,
        displayImage: displayImg
      }
    })

    loadCampaignsAdmin()
    syncReorderList()
  } catch (err) {
    console.error('Error loading products:', err)
    if (err?.status === 401 || err?.status === 403) {
      logoutAdmin()
    }
  } finally {
    isLoadingProducts.value = false
  }
}

function onLiveCampaignChange() {
  if (selectedLiveCampaign.value === 'hotwheels') {
    liveBannerTextInput.value = '¡EN VIVO EN TIKTOK! S/ 10 de descuento en Box Hot Wheels'
  } else if (selectedLiveCampaign.value === 'maquillaje') {
    liveBannerTextInput.value = '¡EN VIVO EN TIKTOK! Descuento especial en Colección Maquillaje'
  } else if (selectedLiveCampaign.value === 'navidad') {
    liveBannerTextInput.value = '¡EN VIVO EN TIKTOK! Descuento especial en Colección Navidad'
  } else if (selectedLiveCampaign.value === 'cumpleanos') {
    liveBannerTextInput.value = '¡EN VIVO EN TIKTOK! Descuento especial en Colección Cumpleaños'
  } else if (selectedLiveCampaign.value === 'graduacion') {
    liveBannerTextInput.value = '¡EN VIVO EN TIKTOK! Descuento especial en Colección Graduación'
  } else {
    liveBannerTextInput.value = '¡EN VIVO EN TIKTOK! Descuentos Flash activos en toda la tienda'
  }
}

const liveProductsDisplayList = computed(() => {
  return products.value.filter(p => {
    if (selectedLiveCampaign.value === 'all') return true
    return (p.campaign || '').toLowerCase() === selectedLiveCampaign.value.toLowerCase()
  })
})

async function startLiveOffer() {
  const duration = customLiveMinutes.value ? Number(customLiveMinutes.value) : Number(selectedLiveDuration.value || 15)
  if (isNaN(duration) || duration <= 0) return

  isSavingLiveSettings.value = true
  try {
    const endsAt = new Date(Date.now() + duration * 60 * 1000).toISOString()
    const settingsList = await currentPbClient.value.collection('site_settings').getFullList()
    const targetId = settingsList.length > 0 ? settingsList[0].id : 'settgeneral0001'

    const payload = {
      live_active: true,
      live_ends_at: endsAt,
      live_campaign: selectedLiveCampaign.value,
      live_discount_default: Number(selectedLiveDiscount.value || 10),
      live_banner_text: liveBannerTextInput.value || '¡EN VIVO EN TIKTOK! Descuento especial en Box de Hot Wheels'
    }

    await currentPbClient.value.collection('site_settings').update(targetId, payload)
    siteSettingsStore.applySettings(payload)
  } catch (err) {
    console.error('Error starting live offer:', err)
    alert('Error al iniciar dinámica en PocketBase: ' + (err.message || 'Error'))
  } finally {
    isSavingLiveSettings.value = false
  }
}

async function extendLiveTime(extraMinutes) {
  isSavingLiveSettings.value = true
  try {
    const currentEnd = siteSettingsStore.liveEndsAt ? new Date(siteSettingsStore.liveEndsAt).getTime() : Date.now()
    const baseTime = currentEnd > Date.now() ? currentEnd : Date.now()
    const newEnd = new Date(baseTime + extraMinutes * 60 * 1000).toISOString()

    const settingsList = await currentPbClient.value.collection('site_settings').getFullList()
    const targetId = settingsList.length > 0 ? settingsList[0].id : 'settgeneral0001'

    const payload = {
      live_active: true,
      live_ends_at: newEnd
    }

    await currentPbClient.value.collection('site_settings').update(targetId, payload)
    siteSettingsStore.applySettings(payload)
  } catch (err) {
    console.error('Error extending live time:', err)
  } finally {
    isSavingLiveSettings.value = false
  }
}

async function stopLiveOffer() {
  if (!confirm('¿Seguro que deseas apagar la dinámica de TikTok Live y restaurar precios normales ahora?')) return
  isSavingLiveSettings.value = true
  try {
    const settingsList = await currentPbClient.value.collection('site_settings').getFullList()
    const targetId = settingsList.length > 0 ? settingsList[0].id : 'settgeneral0001'

    const payload = {
      live_active: false,
      live_ends_at: ''
    }

    await currentPbClient.value.collection('site_settings').update(targetId, payload)
    siteSettingsStore.applySettings(payload)
  } catch (err) {
    console.error('Error stopping live offer:', err)
  } finally {
    isSavingLiveSettings.value = false
  }
}

async function saveSingleProductDiscount(prod) {
  savingProductDiscountId.value = prod.id
  try {
    const discountVal = prod.live_discount !== undefined && prod.live_discount !== null && prod.live_discount !== ''
      ? Number(prod.live_discount)
      : 0
    await currentPbClient.value.collection('products').update(prod.id, {
      live_discount: discountVal
    })
    prod.live_discount = discountVal
  } catch (err) {
    console.error('Error saving product live discount:', err)
    alert('Error al guardar descuento del producto: ' + err.message)
  } finally {
    savingProductDiscountId.value = null
  }
}

function getProductCountByCampaign(campId) {
  return products.value.filter(p => (p.campaign || 'maquillaje') === campId).length
}

function selectReorderCampaign(campId) {
  if (hasUnsavedOrder.value) {
    if (!confirm('Tienes cambios de orden sin guardar en esta campaña. ¿Deseas cambiar de campaña de todos modos?')) {
      return
    }
  }
  reorderCampaign.value = campId
  hasUnsavedOrder.value = false
  syncReorderList()
}


// Visibility State & Functions
const defaultAdminCampaigns = [
  { id: 'maquillaje', slug: 'maquillaje', name: 'Día de Regalar Maquillaje', accent_color: '#965e9b', tagline: 'Makeup Boxes & Ramos Eternos', is_active: true },
  { id: 'hotwheels', slug: 'hotwheels', name: 'Día de Regalar Hot Wheels', accent_color: '#c22b38', tagline: 'Ramos con Rosas, Boxes Temáticos y Joyería', is_active: true },
  { id: 'navidad', slug: 'navidad', name: 'Colección Navidad & Nochebuena', accent_color: '#15803d', tagline: 'Calendario de Adviento & Boxes Navideños', is_active: true },
  { id: 'graduacion', slug: 'graduacion', name: 'Colección Graduación & Éxitos', accent_color: '#b45309', tagline: 'Bouquets con Birretes & Peluches Graduados', is_active: true },
  { id: 'cumpleanos', slug: 'cumpleanos', name: 'Colección Cumpleaños Mágico', accent_color: '#c026d3', tagline: 'Boxes sorpresa y ramos de ensueño', is_active: false }
]
const adminCampaigns = ref([...defaultAdminCampaigns])
const isLoadingCampaigns = ref(false)
const savingCampaignId = ref(null)

const visibilityFilterCampaign = ref('all')
const visibilityFilterStatus = ref('all')
const visibilitySearchQuery = ref('')
const savingProductActiveId = ref(null)
const savingStockProdId = ref(null)

function getCampaignName(campId) {
  if (!campId) return 'General'
  const match = campaignsList.find(c => c.id.toLowerCase() === String(campId).toLowerCase())
  if (match && match.name) return match.name
  const adminMatch = adminCampaigns.value.find(c => (c.slug || c.id || '').toLowerCase() === String(campId).toLowerCase())
  if (adminMatch && adminMatch.name) return adminMatch.name
  return String(campId).charAt(0).toUpperCase() + String(campId).slice(1)
}

async function loadCampaignsAdmin() {
  if (!currentPbClient.value) return
  isLoadingCampaigns.value = true
  try {
    let records = []
    try {
      records = await currentPbClient.value.collection('campaigns').getFullList({ sort: 'order' })
    } catch (_) {
      records = await currentPbClient.value.collection('campaigns').getFullList()
    }
    if (records && records.length > 0) {
      adminCampaigns.value = records.map(r => ({
        ...r,
        is_active: r.is_active !== false
      }))
    }
  } catch (err) {
    console.error('Error loading admin campaigns:', err)
  } finally {
    isLoadingCampaigns.value = false
  }
}

async function toggleCampaignActive(camp) {
  if (!currentPbClient.value || savingCampaignId.value) return
  savingCampaignId.value = camp.id
  const newStatus = !camp.is_active
  try {
    try {
      await currentPbClient.value.collection('campaigns').update(camp.id, {
        is_active: newStatus
      })
    } catch (updateErr) {
      const match = await currentPbClient.value.collection('campaigns').getFirstListItem(`slug="${camp.slug || camp.id}"`)
      if (match) {
        await currentPbClient.value.collection('campaigns').update(match.id, {
          is_active: newStatus
        })
        camp.id = match.id
      } else {
        throw updateErr
      }
    }
    camp.is_active = newStatus
  } catch (err) {
    console.error('Error toggling campaign active status:', err)
    alert('Error al actualizar visibilidad del menú: ' + (err.message || 'Error'))
  } finally {
    savingCampaignId.value = null
  }
}

async function toggleProductActive(prod) {
  if (!currentPbClient.value || savingProductActiveId.value) return
  savingProductActiveId.value = prod.id
  const newStatus = prod.is_active === false ? true : false
  try {
    await currentPbClient.value.collection('products').update(prod.id, {
      is_active: newStatus
    })
    prod.is_active = newStatus
  } catch (err) {
    console.error('Error toggling product active status:', err)
    alert('Error al actualizar visibilidad del producto: ' + (err.message || 'Error'))
  } finally {
    savingProductActiveId.value = null
  }
}

async function toggleProductStock(prod) {
  if (!currentPbClient.value || savingStockProdId.value) return
  savingStockProdId.value = prod.id
  const newStock = prod.in_stock === false ? true : false
  try {
    await currentPbClient.value.collection('products').update(prod.id, {
      in_stock: newStock
    })
    prod.in_stock = newStock
  } catch (err) {
    console.error('Error toggling product stock:', err)
    alert('Error al actualizar stock del producto: ' + (err.message || 'Error'))
  } finally {
    savingStockProdId.value = null
  }
}

const filteredVisibilityProducts = computed(() => {
  let list = products.value

  if (visibilityFilterCampaign.value !== 'all') {
    list = list.filter(p => (p.campaign || '').toLowerCase() === visibilityFilterCampaign.value.toLowerCase())
  }

  if (visibilityFilterStatus.value === 'visible') {
    list = list.filter(p => p.is_active !== false)
  } else if (visibilityFilterStatus.value === 'hidden') {
    list = list.filter(p => p.is_active === false)
  }

  if (visibilitySearchQuery.value.trim()) {
    const q = visibilitySearchQuery.value.toLowerCase().trim()
    list = list.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    )
  }

  return list
})

const visibleProductsCount = computed(() => {
  return products.value.filter(p => p.is_active !== false).length
})

const hiddenProductsCount = computed(() => {
  return products.value.filter(p => p.is_active === false).length
})


function syncReorderList() {
  reorderProductList.value = products.value
    .filter(p => (p.campaign || 'maquillaje') === reorderCampaign.value)
    .map(p => ({ ...p }))
  hasUnsavedOrder.value = false
}

// Drag & Drop Handlers
function onDragStart(index, event) {
  draggedItemIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(index))
}

function onDragOver(index, event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

function onDragEnter(index, event) {
  event.preventDefault()
  draggedOverIndex.value = index
}

function onDragLeave(index, event) {
  // Clear if leaving
}

function onDrop(dropIndex, event) {
  event.preventDefault()
  if (draggedItemIndex.value === null || draggedItemIndex.value === dropIndex) {
    draggedOverIndex.value = null
    draggedItemIndex.value = null
    return
  }

  const list = [...reorderProductList.value]
  const moved = list.splice(draggedItemIndex.value, 1)[0]
  list.splice(dropIndex, 0, moved)

  reorderProductList.value = list
  hasUnsavedOrder.value = true
  draggedOverIndex.value = null
  draggedItemIndex.value = null
}

function onDragEnd() {
  draggedItemIndex.value = null
  draggedOverIndex.value = null
}

function moveItemUp(index) {
  if (index <= 0) return
  const list = [...reorderProductList.value]
  const temp = list[index]
  list[index] = list[index - 1]
  list[index - 1] = temp
  reorderProductList.value = list
  hasUnsavedOrder.value = true
}

function moveItemDown(index) {
  if (index >= reorderProductList.value.length - 1) return
  const list = [...reorderProductList.value]
  const temp = list[index]
  list[index] = list[index + 1]
  list[index + 1] = temp
  reorderProductList.value = list
  hasUnsavedOrder.value = true
}

function revertOrderChanges() {
  syncReorderList()
}

async function saveCustomOrder() {
  if (!currentPbClient.value || reorderProductList.value.length === 0) return
  isSavingOrder.value = true

  try {
    // Update each product with its sequential order 1, 2, 3...
    for (let i = 0; i < reorderProductList.value.length; i++) {
      const prod = reorderProductList.value[i]
      const newOrder = i + 1
      await currentPbClient.value.collection('products').update(prod.id, {
        order: newOrder
      })
      prod.order = newOrder
    }

    hasUnsavedOrder.value = false
    alert('¡Nuevo orden guardado con éxito! La tienda web ya se ha actualizado con las nuevas posiciones.')
    await loadProducts()
  } catch (err) {
    console.error('Error saving order:', err)
    alert('Error al guardar el nuevo orden: ' + (err?.message || 'Error desconocido'))
  } finally {
    isSavingOrder.value = false
  }
}

const filteredProducts = computed(() => {
  let list = products.value
  if (selectedCampaign.value !== 'all') {
    list = list.filter(p => (p.campaign || 'maquillaje') === selectedCampaign.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q))
  }
  return list
})

function openDuplicateModal(product) {
  activeModalProduct.value = product
  duplicateSuccess.value = null
  duplicateError.value = ''
  duplicateForm.value = {
    name: `${product.name} (Copia)`,
    price: product.price || 0,
    compare_at_price: product.compare_at_price || null,
    campaign: product.campaign || 'maquillaje',
    category: product.category || 'General',
    items_included: typeof product.items_included === 'string'
      ? product.items_included
      : Array.isArray(product.items_included)
        ? product.items_included.join('\n')
        : '',
    order: 1, // Default to 1 so newly duplicated products go to the front
    copyImage: true
  }
}

function closeDuplicateModal() {
  activeModalProduct.value = null
  duplicateSuccess.value = null
  duplicateError.value = ''
}

async function executeDuplication() {
  if (!activeModalProduct.value || !currentPbClient.value) return
  isDuplicating.value = true
  duplicateError.value = ''
  duplicateSuccess.value = null

  try {
    const orig = activeModalProduct.value
    const formData = new FormData()
    formData.append('name', duplicateForm.value.name.trim())
    formData.append('campaign', duplicateForm.value.campaign)
    formData.append('description', orig.description || '')
    formData.append('price', String(duplicateForm.value.price))
    if (duplicateForm.value.compare_at_price) {
      formData.append('compare_at_price', String(duplicateForm.value.compare_at_price))
    }
    formData.append('category', duplicateForm.value.category || 'General')
    formData.append('in_stock', 'true')
    formData.append('order', String(duplicateForm.value.order || 1))
    formData.append('items_included', duplicateForm.value.items_included || '')

    // Download original image file and append to FormData as Blob (auto-converting to WebP if needed)
    if (duplicateForm.value.copyImage && orig.image) {
      const origImgUrl = currentPbClient.value.files.getURL(orig, orig.image)
      const res = await fetch(origImgUrl)
      if (res.ok) {
        let blob = await res.blob()
        let filename = orig.image
        if (!orig.image.toLowerCase().endsWith('.webp')) {
          blob = await convertBlobToWebP(blob)
          filename = orig.image.replace(/\.[^/.]+$/, '') + '.webp'
        }
        formData.append('image', blob, filename)
      }
    }

    const newRecord = await currentPbClient.value.collection('products').create(formData)
    duplicateSuccess.value = newRecord

    // Refresh products list
    await loadProducts()
  } catch (err) {
    console.error('Duplication error:', err)
    duplicateError.value = err?.message || 'Error al duplicar el producto en PocketBase.'
  } finally {
    isDuplicating.value = false
  }
}

// Bookmarklet Code that runs directly inside PocketBase Admin
const bookmarkletRawCode = `javascript:(async function(){try{if(!window.location.href.includes('/_/')){alert('Por favor abre esta herramienta mientras estes dentro de PocketBase Admin (https://admin.venezzia.shop/_/)');return;}let token='';const cookieMatch=document.cookie.match(/pb_auth=([^;]+)/);if(cookieMatch){try{token=JSON.parse(decodeURIComponent(cookieMatch[1])).token;}catch(_){}}if(!token){for(let i=0;i<localStorage.length;i++){try{const val=JSON.parse(localStorage.getItem(localStorage.key(i)));if(val&&val.token){token=val.token;break;}}catch(_){}}}if(!token){alert('No se detecto sesion de PocketBase. Por favor inicia sesion primero.');return;}let recordId='';const hash=window.location.hash;const urlParams=new URLSearchParams(hash.includes('?')?hash.split('?')[1]:'');recordId=urlParams.get('recordId')||'';if(!recordId){const idInput=document.querySelector('input[readonly][value]');if(idInput&&idInput.value&&idInput.value.length>=15){recordId=idInput.value;}}if(!recordId){recordId=prompt('Ingresa el ID del producto que deseas duplicar:');if(!recordId)return;}const toast=document.createElement('div');toast.style.cssText='position:fixed;top:20px;right:20px;background:#27172b;color:#fff;padding:16px 24px;border-radius:12px;font-family:sans-serif;font-size:14px;z-index:999999;box-shadow:0 10px 30px rgba(0,0,0,0.3);border:2px solid #caa35f;';toast.innerHTML='Obteniendo producto y duplicando imagen...';document.body.appendChild(toast);const recRes=await fetch('/api/collections/products/records/'+recordId,{headers:{Authorization:token}});if(!recRes.ok){toast.remove();alert('Error al obtener el producto con ID: '+recordId);return;}const orig=await recRes.json();const newName=prompt('Nombre para el nuevo producto duplicado:',orig.name+' (Copia)');if(!newName){toast.remove();return;}const formData=new FormData();formData.append('name',newName);formData.append('campaign',orig.campaign||'maquillaje');formData.append('description',orig.description||'');formData.append('price',String(orig.price));if(orig.compare_at_price)formData.append('compare_at_price',String(orig.compare_at_price));formData.append('category',orig.category||'General');formData.append('in_stock',String(orig.in_stock));formData.append('order','1');if(orig.items_included)formData.append('items_included',orig.items_included);if(orig.image){toast.innerHTML='Copiando imagen del producto...';const imgUrl='/api/files/'+orig.collectionId+'/'+orig.id+'/'+orig.image;const imgRes=await fetch(imgUrl);const imgBlob=await imgRes.blob();formData.append('image',imgBlob,orig.image);}toast.innerHTML='Guardando nuevo producto en PocketBase...';const createRes=await fetch('/api/collections/products/records',{method:'POST',headers:{Authorization:token},body:formData});if(!createRes.ok){const errData=await createRes.json();toast.remove();alert('Error al duplicar: '+(errData.message||'Error'));return;}const newRec=await createRes.json();toast.style.background='#15803d';toast.innerHTML='¡Producto duplicado con éxito!<br>Abriendo nueva copia...';setTimeout(()=>{toast.remove();window.location.hash='#/collections?collectionId='+orig.collectionId+'&recordId='+newRec.id;window.location.reload();},1200);}catch(e){alert('Error al duplicar: '+e.message);}})();`

const bookmarkletHref = computed(() => bookmarkletRawCode)

function copyBookmarkletCode() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(bookmarkletRawCode)
    copiedBookmarklet.value = true
    setTimeout(() => {
      copiedBookmarklet.value = false
    }, 2500)
  }
}


// ==========================================
// WHATSAPP STORE CONFIGURATION STATE & LOGIC
// ==========================================
const showWhatsAppModal = ref(false)
const whatsappInput = ref('')
const isSavingWhatsApp = ref(false)
const whatsappSaveSuccess = ref(false)
const whatsappSaveError = ref('')

const cleanWhatsAppDigits = computed(() => {
  return String(whatsappInput.value || '').replace(/\D/g, '')
})

const normalizedWhatsAppNumber = computed(() => {
  const digits = cleanWhatsAppDigits.value
  if (!digits) return ''
  if (digits.length === 9) {
    return '51' + digits
  }
  if (digits.length === 11 && digits.startsWith('51')) {
    return digits
  }
  return digits
})

const previewWhatsAppFormatted = computed(() => {
  const num = normalizedWhatsAppNumber.value
  if (!num) return 'Por ingresar...'
  if (num.startsWith('51') && num.length === 11) {
    return '+51 ' + num.slice(2, 5) + ' ' + num.slice(5, 8) + ' ' + num.slice(8)
  }
  if (num.length === 9) {
    return '+51 ' + num.slice(0, 3) + ' ' + num.slice(3, 6) + ' ' + num.slice(6)
  }
  return '+' + num
})

const previewWhatsAppTestUrl = computed(() => {
  const num = normalizedWhatsAppNumber.value
  if (!num) return '#'
  const testMsg = encodeURIComponent('ASESORIA ONLINE VENEZZIA\n\n¡Hola! Mensaje de prueba de configuración de WhatsApp.')
  return 'https://wa.me/' + num + '?text=' + testMsg
})

function openWhatsAppConfigModal() {
  const current = siteSettingsStore.whatsappNumber || '51935817179'
  whatsappInput.value = current
  whatsappSaveSuccess.value = false
  whatsappSaveError.value = ''
  showWhatsAppModal.value = true
}

function closeWhatsAppConfigModal() {
  showWhatsAppModal.value = false
  whatsappSaveSuccess.value = false
  whatsappSaveError.value = ''
}

async function saveWhatsAppConfig() {
  const normalized = normalizedWhatsAppNumber.value
  if (!normalized || normalized.length < 8) {
    whatsappSaveError.value = 'Por favor ingresa un número de teléfono válido (por ejemplo, 9 dígitos: 932 449 996).'
    return
  }

  isSavingWhatsApp.value = true
  whatsappSaveError.value = ''
  whatsappSaveSuccess.value = false

  try {
    if (!currentPbClient.value) {
      const url = getTargetBaseUrl()
      currentPbClient.value = new PocketBase(url)
    }

    let targetId = 'settgeneral0001'
    try {
      const settingsList = await currentPbClient.value.collection('site_settings').getFullList()
      if (settingsList && settingsList.length > 0) {
        targetId = settingsList[0].id
      }
    } catch (_) {}

    const payload = {
      whatsapp_number: normalized
    }

    await currentPbClient.value.collection('site_settings').update(targetId, payload)
    siteSettingsStore.applySettings(payload)

    // Also sync to remote if current PB is local
    if (targetServer.value === 'local') {
      try {
        const remotePb = new PocketBase('https://admin.venezzia.shop')
        const remoteSaved = localStorage.getItem(AUTH_STORAGE_KEY)
        if (remoteSaved) {
          const parsed = JSON.parse(remoteSaved)
          if (parsed && parsed.token) {
            remotePb.authStore.save(parsed.token, parsed.record || parsed.admin)
            if (remotePb.authStore.isValid) {
              const remoteList = await remotePb.collection('site_settings').getFullList()
              const rId = remoteList.length > 0 ? remoteList[0].id : 'settgeneral0001'
              await remotePb.collection('site_settings').update(rId, payload)
            }
          }
        }
      } catch (_) {}
    }

    whatsappSaveSuccess.value = true
  } catch (err) {
    console.error('Error saving WhatsApp settings:', err)
    whatsappSaveError.value = 'Error al guardar en PocketBase: ' + (err.message || 'Verifica permisos de administrador')
  } finally {
    isSavingWhatsApp.value = false
  }
}

onMounted(() => {
  initPbClient()
})
</script>
