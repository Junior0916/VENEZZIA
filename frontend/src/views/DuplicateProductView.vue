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
              Organizador y Duplicador de Productos
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
              Elige el orden exacto de los productos arrastrándolos con el mouse o clonando productos existentes para no crearlos desde cero.
            </p>
          </div>

          <!-- Environment, PB link & Logout Button -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="p-2.5 bg-[#faf5fb] rounded-2xl border border-[#eedee9] text-left shrink-0">
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
              class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#27172b] text-white text-xs font-semibold hover:bg-[#3d2444] transition-all shadow-sm shrink-0"
            >
              <span>PocketBase</span>
              <ArrowUpRight class="w-3.5 h-3.5 text-[#caa35f]" />
            </a>

            <!-- Cerrar Sesion Button -->
            <button
              @click="logoutAdmin"
              class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all shrink-0 cursor-pointer"
              title="Cerrar sesión y bloquear el acceso"
            >
              <LogOut class="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        <!-- Mode Navigation Tabs: Live vs Duplicar vs Organizar Arrastrando -->
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <button
            @click="activeToolTab = 'live'"
            :class="[
              'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs',
              activeToolTab === 'live'
                ? 'bg-[#ff0050] text-white ring-2 ring-[#00f2fe]/60 shadow-md'
                : 'bg-[#faf7fb] border border-[#eedee9] text-gray-600 hover:bg-[#f3edf5]'
            ]"
          >
            <span v-if="siteSettingsStore.isLiveOfferActive" class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <Flame v-else class="w-4 h-4 text-[#ff0050]" />
            <span>Dinámica TikTok Live Flash (Temporizador)</span>
            <span
              v-if="siteSettingsStore.isLiveOfferActive"
              class="px-2 py-0.5 rounded-full bg-black/30 text-white font-mono text-[10px] ml-1"
            >
              {{ siteSettingsStore.formattedLiveTimeLeft }}
            </span>
          </button>

          <button
            @click="activeToolTab = 'reorder'"
            :class="[
              'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs',
              activeToolTab === 'reorder'
                ? 'bg-[#27172b] text-white ring-2 ring-[#caa35f]/50'
                : 'bg-[#faf7fb] border border-[#eedee9] text-gray-600 hover:bg-[#f3edf5]'
            ]"
          >
            <Move class="w-4 h-4 text-[#caa35f]" />
            <span>Organizar Orden (Arrastrar y Soltar)</span>
          </button>

          <button
            @click="activeToolTab = 'duplicate'"
            :class="[
              'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs',
              activeToolTab === 'duplicate'
                ? 'bg-[#27172b] text-white ring-2 ring-[#caa35f]/50'
                : 'bg-[#faf7fb] border border-[#eedee9] text-gray-600 hover:bg-[#f3edf5]'
            ]"
          >
            <Copy class="w-4 h-4 text-[#caa35f]" />
            <span>Duplicador de Productos</span>
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
        <!-- TAB 0: DINÁMICA TIKTOK LIVE FLASH (TEMPORIZADOR) -->
        <!-- ========================================== -->
        <div v-if="activeToolTab === 'live'" class="space-y-6">
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
        <div v-else class="space-y-6">
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
                  :to="`/?prod=${duplicateSuccess.id}`"
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
  Flame, Clock, Play, Square, Plus
} from 'lucide-vue-next'
import { useSiteSettingsStore } from '../stores/siteSettings'

const siteSettingsStore = useSiteSettingsStore()

const AUTH_STORAGE_KEY = 'venezzia_admin_auth'

const activeToolTab = ref('live') // 'live', 'reorder' o 'duplicate'

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

  // Check saved session in localStorage
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed && parsed.token && parsed.server === targetServer.value) {
        currentPbClient.value.authStore.save(parsed.token, parsed.record)
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
      // Save session securely on this device
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        token: authData.token,
        record: authData.record,
        server: targetServer.value
      }))

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
        const isWebp = (r.image || '').toLowerCase().endsWith('.webp')
        displayImg = isWebp
          ? currentPbClient.value.files.getURL(r, r.image)
          : currentPbClient.value.files.getURL(r, r.image, { thumb: '0x800' })
      }
      return {
        ...r,
        order: r.order !== undefined && r.order !== null ? Number(r.order) : 1,
        live_discount: r.live_discount !== undefined && r.live_discount !== null && r.live_discount !== '' ? Number(r.live_discount) : 0,
        displayImage: displayImg
      }
    })

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

onMounted(() => {
  initPbClient()
})
</script>
