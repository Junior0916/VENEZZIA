import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { pb } from '../services/pocketbase'
import PocketBase from 'pocketbase'

export const useSiteSettingsStore = defineStore('siteSettings', () => {
  const whatsappNumber = ref('51932449996')
  const announcementText = ref('Rosas eternas de alta duración • Envíos programados a todo Lima y Callao')
  const shippingLimaNorte = ref(10.00)
  const shippingLimaSur = ref(15.00)
  const shippingProvinciaRamo = ref(5.00)
  const shippingProvinciaBox = ref(3.00)
  const advancePaymentAmount = ref(30.00)
  const instagramUrl = ref('https://instagram.com')
  const tiktokUrl = ref('https://www.tiktok.com/@venezzia.detalles')
  const facebookUrl = ref('https://facebook.com')

  // TikTok Live Flash Sale Dynamic State
  const liveActive = ref(false)
  const liveEndsAt = ref('')
  const liveCampaign = ref('hotwheels')
  const liveDiscountDefault = ref(10.00)
  const liveBannerText = ref('¡EN VIVO EN TIKTOK! Descuento especial en Box de Hot Wheels')
  const currentTime = ref(Date.now())
  let timerInterval = null
  let pollInterval = null
  let isSubscribed = false

  // Start internal ticker
  if (typeof window !== 'undefined' && !timerInterval) {
    timerInterval = setInterval(() => {
      currentTime.value = Date.now()
    }, 1000)
  }

  // Active status based on timestamp (pure math, impossible to stay on past expiration)
  const isLiveOfferActive = computed(() => {
    if (!liveEndsAt.value) return false
    const endMs = new Date(liveEndsAt.value).getTime()
    if (isNaN(endMs)) return false
    return endMs > currentTime.value
  })

  // Seconds remaining until expiration
  const liveSecondsLeft = computed(() => {
    if (!liveEndsAt.value) return 0
    const endMs = new Date(liveEndsAt.value).getTime()
    if (isNaN(endMs)) return 0
    const diff = Math.floor((endMs - currentTime.value) / 1000)
    return diff > 0 ? diff : 0
  })

  // Formatted countdown timer: MM:SS (or HH:MM:SS if > 1 hour)
  const formattedLiveTimeLeft = computed(() => {
    const totalSecs = liveSecondsLeft.value
    if (totalSecs <= 0) return '00:00'
    const hours = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60
    const pad = (n) => String(n).padStart(2, '0')
    if (hours > 0) {
      return `${pad(hours)}:${pad(mins)}:${pad(secs)}`
    }
    return `${pad(mins)}:${pad(secs)}`
  })

  // Check if a specific product qualifies for the live discount and return discount amount
  function getProductLiveDiscount(product) {
    if (!isLiveOfferActive.value || !product) return 0

    const targetCamp = (liveCampaign.value || 'hotwheels').toLowerCase()
    const prodCamp = (product.campaign || '').toLowerCase()

    // If a specific campaign is selected, only products from that campaign qualify
    if (targetCamp !== 'all' && prodCamp !== targetCamp) {
      return 0
    }

    // 1. Explicit per-product override in PocketBase
    if (product.live_discount !== undefined && product.live_discount !== null && product.live_discount !== '') {
      const explicit = Number(product.live_discount)
      if (explicit > 0) return explicit
      if (explicit === 0) return 0 // Explicitly excluded
    }

    // 2. Campaign default discount (e.g. 'hotwheels', 'maquillaje', 'cumpleanos', 'graduacion' or 'all')
    if (targetCamp === 'hotwheels') {
      // By default applies to Box products if campaign is hotwheels
      const isBox = (product.name || '').toLowerCase().includes('box') ||
                    (product.category || '').toLowerCase().includes('box')
      if (!isBox) {
        // Non-box Hot Wheels only get discount if explicitly assigned
        return 0
      }
    }

    return Number(liveDiscountDefault.value || 10.00)
  }

  // Get effective price considering live discount
  function getProductFinalPrice(product) {
    if (!product) return 0
    const base = Number(product.price || 0)
    const discount = getProductLiveDiscount(product)
    return Math.max(0, base - discount)
  }

  const formattedPhone = computed(() => {
    const raw = String(whatsappNumber.value).replace(/\D/g, '')
    if (raw.startsWith('51') && raw.length === 11) {
      return `+51 ${raw.slice(2, 5)} ${raw.slice(5, 8)} ${raw.slice(8)}`
    }
    if (raw.length === 9) {
      return `+51 ${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`
    }
    return `+${raw}`
  })

  function whatsappLink(message = '') {
    const num = String(whatsappNumber.value).replace(/\D/g, '')
    const text = message ? `?text=${encodeURIComponent(message)}` : ''
    return `https://wa.me/${num}${text}`
  }

  async function loadSettings() {
    // 1. Try local PocketBase collection
    try {
      const records = await pb.collection('site_settings').getFullList()
      if (records && records.length > 0) {
        applySettings(records[0])
        initRealtimeSubscription(pb)
        startBackgroundPolling()
        return
      }
    } catch (_) {}

    // 2. Try remote PocketBase endpoint
    try {
      const remotePb = new PocketBase('https://admin.venezzia.shop')
      const remoteRecords = await remotePb.collection('site_settings').getFullList()
      if (remoteRecords && remoteRecords.length > 0) {
        applySettings(remoteRecords[0])
        initRealtimeSubscription(remotePb)
        startBackgroundPolling()
        return
      }
    } catch (_) {}

    startBackgroundPolling()
  }

  function startBackgroundPolling() {
    if (typeof window === 'undefined' || pollInterval) return
    // Poll every 15s to keep live countdown & state perfectly synced without user refresh
    pollInterval = setInterval(async () => {
      try {
        const records = await pb.collection('site_settings').getFullList()
        if (records && records.length > 0) {
          applySettings(records[0])
          return
        }
      } catch (_) {}
      try {
        const remotePb = new PocketBase('https://admin.venezzia.shop')
        const records = await remotePb.collection('site_settings').getFullList()
        if (records && records.length > 0) {
          applySettings(records[0])
        }
      } catch (_) {}
    }, 15000)
  }

  function initRealtimeSubscription(client) {
    if (isSubscribed || typeof window === 'undefined') return
    try {
      client.collection('site_settings').subscribe('*', (e) => {
        if (e.record) applySettings(e.record)
      }).then(() => {
        isSubscribed = true
      }).catch(() => {})
    } catch (_) {}
  }

  function applySettings(data) {
    if (!data) return
    const num = data.whatsapp_number || data.whatsappNumber
    if (num) whatsappNumber.value = String(num)

    const ann = data.announcement_text || data.announcementText
    if (ann) announcementText.value = String(ann)

    const sln = data.shipping_lima_norte !== undefined ? data.shipping_lima_norte : data.shippingLimaNorte
    if (sln !== undefined) shippingLimaNorte.value = Number(sln)

    const sls = data.shipping_lima_sur !== undefined ? data.shipping_lima_sur : data.shippingLimaSur
    if (sls !== undefined) shippingLimaSur.value = Number(sls)

    const spr = data.shipping_provincia_ramo !== undefined ? data.shipping_provincia_ramo : data.shippingProvinciaRamo
    if (spr !== undefined) shippingProvinciaRamo.value = Number(spr)

    const spb = data.shipping_provincia_box !== undefined ? data.shipping_provincia_box : data.shippingProvinciaBox
    if (spb !== undefined) shippingProvinciaBox.value = Number(spb)

    const adv = data.advance_payment_amount !== undefined ? data.advance_payment_amount : data.advancePaymentAmount
    if (adv !== undefined) advancePaymentAmount.value = Number(adv)

    const ig = data.instagram_url || data.instagramUrl
    if (ig) instagramUrl.value = String(ig)

    const tt = data.tiktok_url || data.tiktokUrl
    if (tt) tiktokUrl.value = String(tt)

    const fb = data.facebook_url || data.facebookUrl
    if (fb) facebookUrl.value = String(fb)

    // TikTok Live Settings
    if (data.live_active !== undefined) {
      liveActive.value = Boolean(data.live_active)
    }
    if (data.live_ends_at !== undefined) {
      liveEndsAt.value = String(data.live_ends_at || '')
    }
    if (data.live_campaign) {
      liveCampaign.value = String(data.live_campaign)
    }
    if (data.live_discount_default !== undefined && data.live_discount_default !== null) {
      liveDiscountDefault.value = Number(data.live_discount_default)
    }
    if (data.live_banner_text) {
      liveBannerText.value = String(data.live_banner_text)
    }
  }

  return {
    whatsappNumber,
    announcementText,
    shippingLimaNorte,
    shippingLimaSur,
    shippingProvinciaRamo,
    shippingProvinciaBox,
    advancePaymentAmount,
    instagramUrl,
    tiktokUrl,
    facebookUrl,
    // Live promo exports
    liveActive,
    liveEndsAt,
    liveCampaign,
    liveDiscountDefault,
    liveBannerText,
    currentTime,
    isLiveOfferActive,
    liveSecondsLeft,
    formattedLiveTimeLeft,
    getProductLiveDiscount,
    getProductFinalPrice,
    formattedPhone,
    whatsappLink,
    applySettings,
    loadSettings
  }
})
