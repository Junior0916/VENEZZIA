import { defineStore } from 'pinia'

const STORAGE_KEY = 'venezzia_special_dates_v1'
const POPUP_SESSION_KEY = 'venezzia_special_dates_popup_dismissed_v1'

// Ocasiones predeterminadas inspiradas en Rosatel y adaptadas al catálogo de Venezzia
export const OCCASIONS_LIST = [
  { id: 'cumpleanos', label: 'Cumpleaños', icon: '🎂', color: '#965e9b' },
  { id: 'aniversario', label: 'Aniversario', icon: '💍', color: '#caa35f' },
  { id: 'amor', label: 'Amor & Romance', icon: '❤️', color: '#e11d48' },
  { id: 'amistad', label: 'Amistad', icon: '🤝', color: '#2563eb' },
  { id: 'graduacion', label: 'Graduación', icon: '🎓', color: '#7c3aed' },
  { id: 'bodas', label: 'Bodas', icon: '💒', color: '#d97706' },
  { id: 'condolencias', label: 'Condolencias', icon: '🕊️', color: '#4b5563' },
  { id: 'mejorate', label: 'Mejórate Pronto', icon: '💐', color: '#059669' },
  { id: 'para_el', label: 'Para Él', icon: '🎁', color: '#0284c7' },
  { id: 'para_ninos', label: 'Para Niños', icon: '🧸', color: '#f59e0b' },
  { id: 'inauguracion', label: 'Inauguración', icon: '🎀', color: '#ec4899' },
  { id: 'agradecimiento', label: 'Agradecimiento', icon: '🌸', color: '#db2777' },
  { id: 'dia_madre', label: 'Día de la Madre', icon: '👑', color: '#be185d' },
  { id: 'san_valentin', label: 'San Valentín', icon: '💖', color: '#dc2626' }
]

export const ANTICIPATION_OPTIONS = [
  { value: 3, label: '3 días antes' },
  { value: 5, label: '5 días antes (Recomendado)' },
  { value: 7, label: '1 semana antes (7 días)' },
  { value: 15, label: '15 días antes' }
]

function getInitialDates() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (_) {}
  return []
}

export const useSpecialDatesStore = defineStore('specialDates', {
  state: () => ({
    dates: getInitialDates(),
    isPopupOpen: false,
    isModalOpen: false,
    modalTab: 'add', // 'add' | 'list'
    selectedDateForEdit: null
  }),

  getters: {
    totalDates: (state) => state.dates.length,

    // Fechas ordenadas por la más próxima a cumplirse (recurrencia anual automática)
    sortedUpcomingDates: (state) => {
      const copy = [...state.dates]
      return copy.map(item => {
        const remaining = calculateDaysUntil(item.date)
        return {
          ...item,
          daysUntil: remaining.days,
          nextDate: remaining.nextDate,
          formattedNextDate: remaining.formattedNextDate
        }
      }).sort((a, b) => a.daysUntil - b.daysUntil)
    }
  },

  actions: {
    saveToStorage() {
      if (typeof window === 'undefined') return
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.dates))
      } catch (e) {
        console.warn('Error saving special dates to localStorage:', e)
      }
    },

    addDate(payload) {
      const newEntry = {
        id: `date_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: (payload.title || '').trim(),
        occasion: payload.occasion || 'cumpleanos',
        date: payload.date, // Formato 'YYYY-MM-DD'
        hasReminder: payload.hasReminder !== false,
        anticipationDays: Number(payload.anticipationDays) || 5,
        customerName: (payload.customerName || '').trim(),
        customerPhone: (payload.customerPhone || '').trim(),
        notes: (payload.notes || '').trim(),
        createdAt: new Date().toISOString()
      }

      this.dates.unshift(newEntry)
      this.saveToStorage()
      return newEntry
    },

    updateDate(id, payload) {
      const idx = this.dates.findIndex(d => d.id === id)
      if (idx !== -1) {
        this.dates[idx] = {
          ...this.dates[idx],
          ...payload,
          title: (payload.title || this.dates[idx].title).trim(),
          updatedAt: new Date().toISOString()
        }
        this.saveToStorage()
      }
    },

    removeDate(id) {
      this.dates = this.dates.filter(d => d.id !== id)
      this.saveToStorage()
    },

    openPopup() {
      this.isPopupOpen = true
    },

    closePopup() {
      this.isPopupOpen = false
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(POPUP_SESSION_KEY, 'true')
        } catch (_) {}
      }
    },

    isPopupDismissed() {
      if (typeof window === 'undefined') return true
      try {
        return sessionStorage.getItem(POPUP_SESSION_KEY) === 'true'
      } catch (_) {
        return false
      }
    },

    openModal(tab = 'add') {
      this.modalTab = tab
      this.isModalOpen = true
      this.isPopupOpen = false
    },

    closeModal() {
      this.isModalOpen = false
      this.selectedDateForEdit = null
    },

    // Genera enlace de WhatsApp para que el cliente envíe su fecha a Venezzia
    generateClientWhatsAppLink(dateItem, shopPhone = '51935817179') {
      const occ = OCCASIONS_LIST.find(o => o.id === dateItem.occasion)
      const occLabel = occ ? `${occ.icon} ${occ.label}` : dateItem.occasion
      const remaining = calculateDaysUntil(dateItem.date)

      const lines = [
        '¡Hola Venezzia Detalles! 🌸✨',
        '',
        'Deseo registrar una *Fecha Especial* para recibir asesoría personalizada y recordatorio con anticipación:',
        '',
        `📌 *Evento / Agasajado:* ${dateItem.title}`,
        `🎉 *Ocasión:* ${occLabel}`,
        `🗓️ *Fecha:* ${remaining.formattedNextDate} (Faltan ${remaining.days} días)`,
        `⏰ *Anticipación de aviso:* ${dateItem.anticipationDays} días antes`,
        dateItem.customerName ? `👤 *Mi Nombre:* ${dateItem.customerName}` : '',
        dateItem.customerPhone ? `📱 *Mi Teléfono:* ${dateItem.customerPhone}` : '',
        dateItem.notes ? `📝 *Detalles / Preferencias:* ${dateItem.notes}` : '',
        '',
        '¡Quedo atento(a) a sus sugerencias y catálogos de flores y regalos para esa fecha! Muchas gracias.'
      ].filter(Boolean)

      const text = encodeURIComponent(lines.join('\n'))
      const cleanPhone = String(shopPhone).replace(/\D/g, '')
      return `https://wa.me/${cleanPhone}?text=${text}`
    },

    // Genera enlace de WhatsApp para que Venezzia Admin envíe el recordatorio al cliente
    generateAdminReminderLink(dateItem) {
      if (!dateItem.customerPhone) return '#'
      const cleanPhone = String(dateItem.customerPhone).replace(/\D/g, '')
      const targetPhone = cleanPhone.startsWith('51') ? cleanPhone : `51${cleanPhone}`

      const occ = OCCASIONS_LIST.find(o => o.id === dateItem.occasion)
      const occLabel = occ ? `${occ.icon} ${occ.label}` : dateItem.occasion
      const remaining = calculateDaysUntil(dateItem.date)
      const clientName = dateItem.customerName ? ` ${dateItem.customerName}` : ''

      const lines = [
        `¡Hola${clientName}! 🌸 Te saludamos de *Venezzia Detalles*.`,
        '',
        `Te escribimos para recordarte que se acerca una fecha muy importante para ti:`,
        `✨ *${dateItem.title}* (${occLabel})`,
        `🗓️ *Fecha:* ${remaining.formattedNextDate}`,
        remaining.days === 0
          ? '🎉 ¡Hoy es el gran día!'
          : `⏳ *Faltan:* ${remaining.days} día(s)`,
        '',
        '¿Deseas que te ayudemos a preparar su ramo de flores, box personalizado o detalle sorpresa para no dejarlo a última hora?',
        '',
        'Puedes ver nuestras opciones y catálogo en vivo aquí: https://venezzia.shop',
        '¡Estamos listos para atenderte con mucho cariño!'
      ]

      const text = encodeURIComponent(lines.join('\n'))
      return `https://wa.me/${targetPhone}?text=${text}`
    }
  }
})

/**
 * Calcula los días restantes para la próxima ocurrencia de la fecha.
 * Si la fecha de este año ya pasó, calcula para el próximo año automáticamente (cumpleaños / aniversario recurrente).
 */
export function calculateDaysUntil(dateString) {
  if (!dateString) {
    return { days: 0, nextDate: null, formattedNextDate: '' }
  }

  try {
    const parts = dateString.split('-')
    const month = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)

    const now = new Date()
    const currentYear = now.getFullYear()

    let target = new Date(currentYear, month, day, 0, 0, 0)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)

    // Si ya pasó en este año, la próxima ocurrencia es el próximo año
    if (target.getTime() < today.getTime()) {
      target = new Date(currentYear + 1, month, day, 0, 0, 0)
    }

    const diffTime = target.getTime() - today.getTime()
    const days = Math.round(diffTime / (1000 * 60 * 60 * 24))

    const monthsEs = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]

    const formattedNextDate = `${day} de ${monthsEs[month]}`

    return {
      days,
      nextDate: target,
      formattedNextDate
    }
  } catch (e) {
    return { days: 0, nextDate: null, formattedNextDate: dateString }
  }
}
