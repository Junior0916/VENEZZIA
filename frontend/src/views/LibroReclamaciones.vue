<template>
  <div class="py-10 sm:py-16 bg-[#faf7fb] min-h-screen">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb (Hidden on print) -->
      <nav class="print:hidden flex items-center gap-2 text-xs text-gray-500 mb-6">
        <router-link to="/" class="hover:text-[#965e9b] transition-colors flex items-center gap-1">
          <Home class="w-3.5 h-3.5" />
          <span>Inicio</span>
        </router-link>
        <span>/</span>
        <span class="text-[#27172b] font-semibold">Libro de Reclamaciones</span>
      </nav>

      <!-- View 1: Formulario Oficial de Reclamación Virtual -->
      <div v-if="!submitted">
        <!-- Header Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)] mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f4eaf6]">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6eef8] border border-[#e8d5ec] text-xs font-semibold text-[#753d77] mb-2">
                <BookOpen class="w-4 h-4 text-[#caa35f]" />
                <span>Conforme a la Directiva de INDECOPI (D.S. N° 011-2011-PCM)</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-serif font-bold text-[#27172b] tracking-tight">
                Libro de Reclamaciones Virtual
              </h1>
              <p class="text-xs text-gray-500 mt-1">
                Hoja de Reclamación N° <strong>{{ claimCodePreview }}</strong> • Fecha: <strong>{{ currentDateString }}</strong>
              </p>
            </div>
            
            <!-- Vendor Data Badge -->
            <div class="p-3.5 bg-[#fcf9fd] rounded-2xl border border-[#eedee9] text-left sm:text-right text-[11px] text-gray-600 shrink-0">
              <span class="block font-bold text-[#27172b] uppercase">VENEZZIA DETALLES</span>
              <span class="block">Lima, Perú</span>
              <span class="block text-gray-500">contacto@venezzia.shop</span>
            </div>
          </div>

          <p class="text-xs text-gray-600 mt-4 leading-relaxed">
            Estimado cliente, de acuerdo con lo establecido en el <strong>Código de Protección y Defensa del Consumidor (Ley N° 29571)</strong>,
            ponemos a su disposición este canal oficial para registrar cualquier disconformidad con respecto a nuestros productos
            o atención brindada.
          </p>
        </div>

        <!-- Form Card -->
        <form @submit.prevent="handleSubmit" class="bg-white rounded-3xl p-6 sm:p-10 border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)] space-y-8">
          <!-- Bloque 1: Consumidor -->
          <div class="space-y-4">
            <h2 class="text-sm sm:text-base font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center justify-between">
              <span class="flex items-center gap-2">
                <User class="w-4 h-4 text-[#caa35f]" />
                1. Identificación del Consumidor Reclamante
              </span>
              <span class="text-[11px] font-normal text-gray-400">* Campos obligatorios</span>
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo o Razón Social *</label>
                <input
                  v-model="form.fullName"
                  type="text"
                  required
                  placeholder="Ej. Carolina Fernández Morales"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Tipo de Documento *</label>
                <select
                  v-model="form.docType"
                  required
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                >
                  <option value="DNI">DNI (Documento Nacional de Identidad)</option>
                  <option value="CE">Carné de Extranjería (CE)</option>
                  <option value="PASAPORTE">Pasaporte</option>
                  <option value="RUC">RUC</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Número de Documento *</label>
                <input
                  v-model="form.docNumber"
                  type="text"
                  required
                  placeholder="Ej. 72849103"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-xs font-semibold text-gray-700">Teléfono / Celular (WhatsApp) *</label>
                  <span
                    class="text-[10px] font-mono transition-colors"
                    :class="form.phone.length === 9 ? 'text-emerald-600 font-bold' : form.phone.length > 0 ? 'text-[#caa35f]' : 'text-gray-400'"
                  >
                    {{ form.phone.length }}/9
                  </span>
                </div>
                <input
                  :value="form.phone"
                  @input="handleLibroPhoneInput"
                  type="tel"
                  inputmode="numeric"
                  maxlength="9"
                  required
                  placeholder="Ej. 932449996"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />
                <span class="text-[10px] text-gray-400 mt-0.5 block">9 dígitos para Perú (empieza con 9)</span>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico (para respuesta formal) *</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Dirección / Domicilio *</label>
                <input
                  v-model="form.address"
                  type="text"
                  required
                  placeholder="Av. Las Flores 340, Dpto 201"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Distrito / Ciudad *</label>
                <input
                  v-model="form.city"
                  type="text"
                  required
                  placeholder="Miraflores, Lima"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />
              </div>
            </div>

            <!-- Menor de edad toggle -->
            <div class="pt-2">
              <label class="inline-flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                <input type="checkbox" v-model="form.isMinor" class="accent-[#caa35f] rounded" />
                <span>El reclamo lo presenta un menor de edad (requiere datos de padre, madre o apoderado)</span>
              </label>

              <div v-if="form.isMinor" class="mt-3 p-3.5 bg-[#fbf7fc] rounded-2xl border border-[#eedee9] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Nombre del Padre, Madre o Tutor *</label>
                  <input
                    v-model="form.parentName"
                    type="text"
                    placeholder="Nombre completo del apoderado"
                    class="w-full text-xs px-3 py-2 rounded-xl border border-[#eedee9] bg-white focus:outline-none focus:border-[#caa35f]"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">DNI del Apoderado *</label>
                  <input
                    v-model="form.parentDoc"
                    type="text"
                    placeholder="DNI del apoderado"
                    class="w-full text-xs px-3 py-2 rounded-xl border border-[#eedee9] bg-white focus:outline-none focus:border-[#caa35f]"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Bloque 2: Bien Contratado -->
          <div class="space-y-4">
            <h2 class="text-sm sm:text-base font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
              <Package class="w-4 h-4 text-[#caa35f]" />
              2. Identificación del Bien Contratado
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Tipo de Bien *</label>
                <div class="flex items-center gap-4 text-xs text-gray-700">
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="PRODUCTO" v-model="form.contractedType" class="accent-[#caa35f]" />
                    <span>Producto (Arreglo floral, box, cosméticos, Hot Wheels)</span>
                  </label>
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="SERVICIO" v-model="form.contractedType" class="accent-[#caa35f]" />
                    <span>Servicio (Despacho / Entrega)</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Monto Reclamado (S/.) *</label>
                <input
                  v-model="form.claimedAmount"
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ej. 110.00"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-gray-700 mb-1">Descripción del Producto o Servicio Adquirido *</label>
                <input
                  v-model="form.itemDescription"
                  type="text"
                  required
                  placeholder="Ej. Ramo 3 Hello Kitty con rosas eternas y cosméticos Jarusa y Reve'l"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />
              </div>
            </div>
          </div>

          <!-- Bloque 3: Detalle de Reclamación -->
          <div class="space-y-4">
            <h2 class="text-sm sm:text-base font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
              <FileText class="w-4 h-4 text-[#caa35f]" />
              3. Detalle de la Reclamación (Reclamo o Queja)
            </h2>

            <!-- Explicación oficial INDECOPI -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                :class="[
                  'p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between',
                  form.claimType === 'RECLAMO'
                    ? 'bg-[#fcf7fc] border-[#965e9b] shadow-xs ring-1 ring-[#965e9b]/20'
                    : 'bg-white border-[#eedee9] hover:bg-[#faf5fb]'
                ]"
              >
                <div class="flex items-center gap-2 font-bold text-[#27172b] mb-1">
                  <input type="radio" value="RECLAMO" v-model="form.claimType" class="accent-[#965e9b]" />
                  <span>RECLAMO</span>
                </div>
                <p class="text-gray-500 text-[11px] leading-relaxed">
                  Disconformidad relacionada a los productos o servicios adquiridos (ejemplo: defecto, rotura o error en el contenido).
                </p>
              </label>

              <label
                :class="[
                  'p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between',
                  form.claimType === 'QUEJA'
                    ? 'bg-[#fcf7fc] border-[#965e9b] shadow-xs ring-1 ring-[#965e9b]/20'
                    : 'bg-white border-[#eedee9] hover:bg-[#faf5fb]'
                ]"
              >
                <div class="flex items-center gap-2 font-bold text-[#27172b] mb-1">
                  <input type="radio" value="QUEJA" v-model="form.claimType" class="accent-[#965e9b]" />
                  <span>QUEJA</span>
                </div>
                <p class="text-gray-500 text-[11px] leading-relaxed">
                  Malestar o descontento respecto a la atención al público (ejemplo: demora en atención, trato o información inadecuada).
                </p>
              </label>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Detalle o Motivo de la Reclamación *</label>
              <textarea
                v-model="form.claimDetail"
                required
                rows="4"
                placeholder="Describa con la mayor precisión posible los hechos ocurridos..."
                class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Pedido Concreto del Consumidor *</label>
              <textarea
                v-model="form.consumerRequest"
                required
                rows="3"
                placeholder="Indique con claridad qué solución solicita a la empresa (ej. reposición del producto, cambio o devolución)..."
                class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
              ></textarea>
            </div>
          </div>

          <!-- Bloque 4: Cláusula Legal INDECOPI -->
          <div class="p-4 bg-[#faf5fb] rounded-2xl border border-[#eedee9] space-y-3">
            <div class="flex items-start gap-2.5 text-xs text-gray-700">
              <AlertCircle class="w-4 h-4 text-[#caa35f] shrink-0 mt-0.5" />
              <div class="space-y-1">
                <p class="font-bold text-[#27172b]">Aviso Legal Obligatorio (INDECOPI):</p>
                <p class="text-[11px] text-gray-600 leading-relaxed">
                  • La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo
                  para interponer una denuncia ante el <strong>INDECOPI</strong>.
                </p>
                <p class="text-[11px] text-gray-600 leading-relaxed">
                  • Conforme a la <strong>Ley N° 29571</strong> y el <strong>D.S. N° 011-2011-PCM</strong>, el proveedor deberá dar
                  respuesta al reclamo en un plazo no mayor a <strong>quince (15) días hábiles improrrogables</strong>
                  al correo electrónico consignado en la presente hoja.
                </p>
              </div>
            </div>

            <div class="pt-2 border-t border-[#eedee9]/80">
              <label class="inline-flex items-start gap-2 cursor-pointer text-xs text-gray-700">
                <input type="checkbox" required v-model="form.acceptedTerms" class="accent-[#caa35f] mt-0.5 rounded" />
                <span>
                  Declaro ser el titular del servicio o estar debidamente autorizado, y que la información proporcionada
                  en esta Hoja de Reclamación es verídica y exacta.
                </span>
              </label>
            </div>
          </div>

          <!-- Submit Action -->
          <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <router-link
              to="/"
              class="text-xs text-gray-500 hover:text-[#965e9b] transition-colors"
            >
              ← Cancelar y volver al inicio
            </router-link>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#27172b] to-[#401f46] hover:from-[#caa35f] hover:to-[#b0873b] hover:text-[#27172b] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md border border-[#caa35f]/50 cursor-pointer disabled:opacity-50"
            >
              {{ submitting ? 'Registrando Hoja...' : 'Registrar Hoja de Reclamación' }}
            </button>
          </div>
        </form>
      </div>

      <!-- View 2: Constancia Oficial Generada (Hoja de Reclamación Emitida) -->
      <div v-else class="space-y-6">
        <!-- Success Alert (Hidden on print) -->
        <div class="print:hidden bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-2">
          <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 class="w-7 h-7" />
          </div>
          <h2 class="text-lg font-serif font-bold text-emerald-900">
            ¡Hoja de Reclamación Registrada Exitosamente!
          </h2>
          <p class="text-xs text-emerald-700 max-w-md mx-auto">
            Se ha generado formalmente su hoja de reclamación con código <strong>{{ receipt.code }}</strong>.
            Hemos enviado una copia de constancia a <strong>{{ receipt.email }}</strong>.
          </p>

          <!-- Action Buttons -->
          <div class="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              @click="printReceipt"
              class="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Printer class="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>

            <a
              :href="whatsappShareUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <IconWhatsApp customClass="w-4 h-4 text-white" />
              <span>Enviar constancia a WhatsApp</span>
            </a>

            <button
              @click="resetForm"
              class="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold tracking-wide transition-all cursor-pointer"
            >
              Registrar otra hoja
            </button>
          </div>
        </div>

        <!-- Official INDECOPI Certificate (Printable Sheet) -->
        <div id="hoja-reclamacion" class="bg-white rounded-3xl p-6 sm:p-10 border border-[#eedee9] shadow-lg print:shadow-none print:border-none print:p-0 space-y-6 text-xs text-gray-800">
          <!-- Sheet Header -->
          <div class="border-b-2 border-[#27172b] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                CONFORME AL D.S. N° 011-2011-PCM / INDECOPI
              </div>
              <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#27172b] uppercase">
                LIBRO DE RECLAMACIONES
              </h2>
              <div class="text-xs font-semibold text-[#965e9b]">
                HOJA DE RECLAMACIÓN VIRTUAL
              </div>
            </div>

            <div class="text-left sm:text-right p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div class="text-[10px] text-gray-500 uppercase">N° DE RECLAMO:</div>
              <div class="text-sm sm:text-base font-mono font-bold text-rose-700">{{ receipt.code }}</div>
              <div class="text-[10px] text-gray-500 mt-1">Fecha y Hora: {{ receipt.date }}</div>
            </div>
          </div>

          <!-- Sheet Provider Data -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-[#faf5fb] rounded-xl border border-[#eedee9] text-[11px]">
            <div><strong>Razón / Proveedor:</strong> VENEZZIA DETALLES</div>
            <div><strong>Canal Web:</strong> https://venezzia.shop</div>
            <div><strong>Domicilio:</strong> Lima, Perú</div>
          </div>

          <!-- Section 1: Customer Data -->
          <div class="space-y-2">
            <h3 class="font-bold text-xs text-[#27172b] uppercase bg-gray-100 p-2 rounded">
              1. Identificación del Consumidor Reclamante
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div><strong>Nombre:</strong> {{ receipt.fullName }}</div>
              <div><strong>Documento:</strong> {{ receipt.docType }} - {{ receipt.docNumber }}</div>
              <div><strong>Teléfono:</strong> {{ receipt.phone }}</div>
              <div><strong>Email:</strong> {{ receipt.email }}</div>
              <div><strong>Domicilio:</strong> {{ receipt.address }}</div>
              <div><strong>Distrito / Ciudad:</strong> {{ receipt.city }}</div>
              <div v-if="receipt.isMinor" class="sm:col-span-2 text-rose-700">
                <strong>Apoderado (Menor de edad):</strong> {{ receipt.parentName }} (DNI: {{ receipt.parentDoc }})
              </div>
            </div>
          </div>

          <!-- Section 2: Contracted Item -->
          <div class="space-y-2">
            <h3 class="font-bold text-xs text-[#27172b] uppercase bg-gray-100 p-2 rounded">
              2. Identificación del Bien Contratado
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div><strong>Tipo de Bien:</strong> {{ receipt.contractedType }}</div>
              <div><strong>Monto Reclamado:</strong> S/ {{ Number(receipt.claimedAmount).toFixed(2) }}</div>
              <div class="sm:col-span-2"><strong>Descripción:</strong> {{ receipt.itemDescription }}</div>
            </div>
          </div>

          <!-- Section 3: Detail -->
          <div class="space-y-2">
            <h3 class="font-bold text-xs text-[#27172b] uppercase bg-gray-100 p-2 rounded">
              3. Detalle de la Reclamación ({{ receipt.claimType }})
            </h3>
            <div class="space-y-2 text-xs">
              <div>
                <strong>Motivo o Detalle expresado por el cliente:</strong>
                <p class="p-3 bg-gray-50 rounded-xl border border-gray-200 mt-1 whitespace-pre-wrap leading-relaxed text-gray-700">
                  {{ receipt.claimDetail }}
                </p>
              </div>
              <div>
                <strong>Pedido Concreto del Consumidor:</strong>
                <p class="p-3 bg-gray-50 rounded-xl border border-gray-200 mt-1 whitespace-pre-wrap leading-relaxed text-gray-700">
                  {{ receipt.consumerRequest }}
                </p>
              </div>
            </div>
          </div>

          <!-- Section 4: Legal Terms & Deadline -->
          <div class="border-t border-gray-200 pt-3 text-[10px] text-gray-500 space-y-1 leading-relaxed">
            <p>
              • <strong>Plazo legal de atención:</strong> Conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571)
              y el D.S. N° 011-2011-PCM, el proveedor dará respuesta en un plazo no mayor a <strong>15 días hábiles</strong>.
            </p>
            <p>
              • <strong>Vía adicional:</strong> La formulación del reclamo no impide acudir a otras vías de solución de controversias
              ni es requisito previo para interponer una denuncia ante el <strong>INDECOPI</strong>.
            </p>
          </div>
        </div>

        <!-- Back to Store (Hidden on print) -->
        <div class="print:hidden text-center pt-4">
          <router-link
            to="/"
            class="px-6 py-2.5 rounded-full bg-[#27172b] hover:bg-[#caa35f] hover:text-[#27172b] text-white text-xs font-semibold tracking-wide transition-all border border-[#caa35f]/40 cursor-pointer"
          >
            ← Volver al Catálogo Principal
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  Home,
  BookOpen,
  User,
  Package,
  FileText,
  AlertCircle,
  CheckCircle2,
  Printer
} from 'lucide-vue-next'
import IconWhatsApp from '../components/icons/IconWhatsApp.vue'

const submitted = ref(false)
const submitting = ref(false)
const claimCodePreview = ref('')
const currentDateString = ref('')

const form = reactive({
  fullName: '',
  docType: 'DNI',
  docNumber: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  isMinor: false,
  parentName: '',
  parentDoc: '',
  contractedType: 'PRODUCTO',
  claimedAmount: '',
  itemDescription: '',
  claimType: 'RECLAMO',
  claimDetail: '',
  consumerRequest: '',
  acceptedTerms: false
})

const receipt = reactive({
  code: '',
  date: '',
  fullName: '',
  docType: '',
  docNumber: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  isMinor: false,
  parentName: '',
  parentDoc: '',
  contractedType: '',
  claimedAmount: 0,
  itemDescription: '',
  claimType: '',
  claimDetail: '',
  consumerRequest: ''
})

onMounted(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  claimCodePreview.value = `LR-${y}${m}${d}-${randomSuffix}`
  currentDateString.value = `${d}/${m}/${y}`
})

const whatsappShareUrl = computed(() => {
  const msg = `Hola Venezzia Detalles, acabo de registrar la Hoja de Reclamación N° ${receipt.code} a nombre de ${receipt.fullName}. Adjunto mis datos para su revisión.`
  return `https://wa.me/51932449996?text=${encodeURIComponent(msg)}`
})

function handleLibroPhoneInput(e) {
  let val = (e.target.value || '').replace(/\D/g, '')
  if (val.length > 9) val = val.slice(0, 9)
  form.phone = val
  if (e.target.value !== val) {
    e.target.value = val
  }
}

function handleSubmit() {
  const cleanPhone = (form.phone || '').replace(/\D/g, '')
  if (!cleanPhone) {
    alert('Por favor ingresa tu número de celular o WhatsApp.')
    return
  }
  if (cleanPhone.startsWith('9')) {
    if (cleanPhone.length !== 9) {
      alert(`El número de celular en Perú debe tener exactamente 9 dígitos (ingresaste ${cleanPhone.length}).`)
      return
    }
  } else {
    alert('El número de celular en Perú debe empezar con 9 y tener 9 dígitos.')
    return
  }

  submitting.value = true
  const now = new Date()
  const dateStr = now.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })

  // Populate receipt
  Object.assign(receipt, {
    code: claimCodePreview.value,
    date: dateStr,
    fullName: form.fullName,
    docType: form.docType,
    docNumber: form.docNumber,
    phone: form.phone,
    email: form.email,
    address: form.address,
    city: form.city,
    isMinor: form.isMinor,
    parentName: form.parentName,
    parentDoc: form.parentDoc,
    contractedType: form.contractedType,
    claimedAmount: form.claimedAmount,
    itemDescription: form.itemDescription,
    claimType: form.claimType,
    claimDetail: form.claimDetail,
    consumerRequest: form.consumerRequest
  })

  // Save to localStorage for historical persistence
  try {
    const existing = JSON.parse(localStorage.getItem('venezzia_claims') || '[]')
    existing.push({ ...receipt })
    localStorage.setItem('venezzia_claims', JSON.stringify(existing))
  } catch (e) {
    // safe fallback
  }

  setTimeout(() => {
    submitting.value = false
    submitted.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 400)
}

function printReceipt() {
  window.print()
}

function resetForm() {
  submitted.value = false
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  claimCodePreview.value = `LR-${y}${m}${d}-${randomSuffix}`
  form.claimDetail = ''
  form.consumerRequest = ''
  form.itemDescription = ''
  form.claimedAmount = ''
  form.acceptedTerms = false
}
</script>

<style>
@media print {
  body {
    background-color: white !important;
  }
  header, footer, nav {
    display: none !important;
  }
}
</style>
