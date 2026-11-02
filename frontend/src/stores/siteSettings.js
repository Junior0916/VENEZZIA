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
        return
      }
    } catch (_) {}

    // 2. Try remote PocketBase endpoint
    try {
      const remotePb = new PocketBase('https://admin.venezzia.shop')
      const remoteRecords = await remotePb.collection('site_settings').getFullList()
      if (remoteRecords && remoteRecords.length > 0) {
        applySettings(remoteRecords[0])
        return
      }
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
    formattedPhone,
    whatsappLink,
    applySettings,
    loadSettings
  }
})
