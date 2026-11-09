import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { pb } from '../services/pocketbase'
import PocketBase from 'pocketbase'

export const DEFAULT_CAMPAIGNS = [
  {
    id: 'maquillaje',
    name: 'Día de Regalar Maquillaje',
    navTitle: 'Día del Maquillaje',
    shortName: 'Maquillaje',
    slug: 'dia-de-regalar-maquillaje',
    badge: 'Edición Especial Belleza & Rosas',
    tagline: 'Celebra su brillo con los exclusivos Makeup Boxes & Ramos Eternos',
    description: 'Arreglos boutique con rosas eternas hechas a mano, peluches originales de Hello Kitty y Lotso, y cosméticos premium Jarusa y Reve\'l.',
    heroTitle: 'Ramos y boxes de maquillaje que enamoran',
    heroSubtitle: 'Diseños que cautivan: combinamos cosmética premium Jarusa & Reve\'l, peluches importados y rosas eternas artesanales.',
    heroPrimaryImage: '/products/box_osita_dormilona_centered.webp',
    heroPrimaryTitle: 'Box Osita Dormilona Lotso',
    heroSideImage: '/products/ramo_3_kitty_centered.webp',
    heroSideTitle: 'Ramo 3 Hello Kitty',
    heroSidePrice: 110.00,
    accentColor: '#965e9b',
    accentBadgeBg: 'bg-[#f6eef8] text-[#753d77] border-[#e8d5ec]',
    filterTabs: [
      { label: 'Todos los Arreglos', value: 'all' },
      { label: 'Boxes de Maquillaje', value: 'Boxes de Maquillaje' },
      { label: 'Ramos con Rosas', value: 'Ramos con Rosas' }
    ],
    categories: [
      {
        name: 'Boxes de Maquillaje',
        filter: 'Boxes de Maquillaje',
        image: '/products/box_kitty_premium_centered.webp'
      },
      {
        name: 'Ramos con Rosas',
        filter: 'Ramos con Rosas',
        image: '/products/ramo_premium_lotso_centered.webp'
      },
      {
        name: 'Hello Kitty',
        filter: 'Hello Kitty',
        image: '/products/ramo_3_kitty_centered.webp'
      },
      {
        name: 'Colección Lotso',
        filter: 'Lotso',
        image: '/products/box_osita_dormilona_centered.webp'
      },
      {
        name: 'Peluches Tiernos',
        filter: 'Chanchita',
        image: '/products/ramo_1_chanchita_centered.webp'
      }
    ]
  },
  {
    id: 'hotwheels',
    name: 'Día de Regalar Hot Wheels',
    navTitle: 'Día Hot Wheels',
    shortName: 'Hot Wheels',
    slug: 'dia-de-regalar-hotwheels',
    badge: 'Colección Oficial • Hot Wheels',
    tagline: 'El regalo definitivo para él: Ramos con Rosas Eternas, Boxes Temáticos y Joyería 316L',
    description: 'Modelos de autos clásicos y premium a elección, empaques blister personalizados con foto, cervezas Pilsen, chocolates y collares de acero quirúrgico waterproof.',
    heroTitle: 'El regalo de Hot Wheels que siempre soñó',
    heroSubtitle: 'Ramos con rosas eternas azules y negras, cajas temáticas con joyería 316L, snacks premium y empaques blister 100% personalizados.',
    heroPrimaryImage: '/products/box-toretto-fast-furious_centered.webp',
    heroPrimaryTitle: 'Box Fast & Furious Toretto',
    heroSideImage: '/products/ramo-spiderman-hotwheels_centered.webp',
    heroSideTitle: 'Ramo Spiderman Hot Wheels',
    heroSidePrice: 70.00,
    accentColor: '#c22b38',
    accentBadgeBg: 'bg-[#fff1f2] text-[#be123c] border-[#fecdd3]',
    filterTabs: [
      { label: 'Todos los Detalles', value: 'all' },
      { label: 'Ramos Hot Wheels', value: 'Ramos Hot Wheels' },
      { label: 'Gift Boxes & Cuadros', value: 'Gift Boxes & Cuadros' },
      { label: 'Autos Personalizados', value: 'Autos Personalizados' }
    ],
    categories: [
      {
        name: 'Ramos Hot Wheels',
        filter: 'Ramos Hot Wheels',
        image: '/products/ramo-hotwheels-2_centered.webp'
      },
      {
        name: 'Boxes & Cuadros',
        filter: 'Gift Boxes & Cuadros',
        image: '/products/box-cuadro-hotwheels_centered.webp'
      },
      {
        name: 'Edición Spiderman',
        filter: 'Spiderman',
        image: '/products/ramo-spiderman-hotwheels_centered.webp'
      },
      {
        name: 'Clubes de Fútbol',
        filter: 'Clubes',
        image: '/products/ramo-clubes-futbol_centered.webp'
      },
      {
        name: 'Joyería Oro 18K',
        filter: 'Oro',
        image: '/products/box-premium-oro-18k_centered.webp'
      }
    ]
  },
  {
    id: 'graduacion',
    name: 'Colección Graduación & Éxitos',
    navTitle: 'Graduación',
    shortName: 'Graduación',
    slug: 'graduacion-y-exitos',
    badge: 'Colección Grados & Promociones',
    tagline: 'Celebra su gran meta con ramos de birrete, rosas eternas y detalles inolvidables',
    description: 'Bouquets con birretes artesanales, peluches graduados importados, diplomas de rosas eternas y copas de brindis con espumante.',
    heroTitle: 'Arreglos y boxes que celebran su mayor logro',
    heroSubtitle: 'Bouquets con birretes de gala, peluches graduados, rosas eternas doradas y azules, y copas grabadas para un brindis inolvidable.',
    heroPrimaryImage: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=600&q=80',
    heroPrimaryTitle: 'Box Éxito de Gala con Birrete',
    heroSideImage: 'https://images.unsplash.com/photo-1538677685457-bfe8192dbdf6?auto=format&fit=crop&w=600&q=80',
    heroSideTitle: 'Ramo Triunfo de Rosas & Girasol',
    heroSidePrice: 85.00,
    accentColor: '#b45309',
    accentBadgeBg: 'bg-[#fefce8] text-[#854d0e] border-[#fef08a]',
    filterTabs: [
      { label: 'Todos los Grados', value: 'all' },
      { label: 'Ramos de Graduación', value: 'Ramos de Graduación' },
      { label: 'Boxes de Birrete & Gala', value: 'Boxes de Birrete & Gala' },
      { label: 'Peluches Graduados', value: 'Peluches Graduados' }
    ],
    categories: [
      {
        name: 'Ramos con Birrete',
        filter: 'Birrete',
        image: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Rosas & Girasol',
        filter: 'Girasol',
        image: 'https://images.unsplash.com/photo-1538677685457-bfe8192dbdf6?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Boxes con Espumante',
        filter: 'Espumante',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Peluche Graduado',
        filter: 'Peluche',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Diplomas & Rosas',
        filter: 'Diploma',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'cumpleanos',
    name: 'Colección Cumpleaños Mágico',
    navTitle: 'Cumpleaños',
    shortName: 'Cumpleaños',
    slug: 'cumpleanos-magico',
    badge: 'Edición Cumpleaños & Sorpresas',
    tagline: 'Haz que su día sea mágico con boxes sorpresa, globos personalizados y ramos de ensueño',
    description: 'Arreglos festivos con globos metalizados, cajas sorpresa de regalo, pasteles gourmet, flores eternas radiantes y finos chocolates.',
    heroTitle: 'Regalos de cumpleaños que hacen latir el corazón',
    heroSubtitle: 'Sorprende en su día especial con cajas temáticas de globos, pasteles finos, chocolates premium y ramos de flores eternas.',
    heroPrimaryImage: 'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?auto=format&fit=crop&w=600&q=80',
    heroPrimaryTitle: 'Box Cumpleaños Feliz con Globos',
    heroSideImage: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80',
    heroSideTitle: 'Ramo Fiesta Pastel & Rosas',
    heroSidePrice: 80.00,
    accentColor: '#c026d3',
    accentBadgeBg: 'bg-[#fdf2f8] text-[#9d174d] border-[#fbcfe8]',
    filterTabs: [
      { label: 'Todos los Cumpleaños', value: 'all' },
      { label: 'Boxes de Cumpleaños', value: 'Boxes de Cumpleaños' },
      { label: 'Ramos Festivos', value: 'Ramos Festivos' },
      { label: 'Tortas & Dulces', value: 'Tortas & Dulces' }
    ],
    categories: [
      {
        name: 'Boxes con Globos',
        filter: 'Globos',
        image: 'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Ramos Festivos',
        filter: 'Ramos Festivos',
        image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Pasteles & Tortas',
        filter: 'Tortas',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Chocolates & Dulces',
        filter: 'Chocolates',
        image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Cajas Sorpresa',
        filter: 'Sorpresa',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'navidad',
    name: 'Colección Navidad & Nochebuena',
    navTitle: 'Navidad',
    shortName: 'Navidad',
    slug: 'navidad',
    badge: 'Edición Especial Limitada • Navidad 2026',
    tagline: '12 Días • 14 Sorpresas: El regalo navideño más esperado de Venezzia Detalles',
    description: 'Arreglos navideños de edición limitada con rosas eternas rojas y doradas, follaje navideño, piñas de pino, finos bombones Ferrero Rocher y luces LED mágicas.',
    heroTitle: 'Calendario de Adviento: 12 Días de Magia & Sorpresas',
    heroSubtitle: 'Descubre la magia de la Navidad abriendo una sorpresa cada día. Edición limitada de 12 días y 14 sorpresas en una exclusiva caja interactiva de gala.',
    heroPrimaryImage: '/products/calendario-de-adviento-2026.webp',
    heroPrimaryTitle: 'Calendario de Adviento 2026 • 12 Días 14 Sorpresas',
    heroSideImage: '/products/ramo-pinguino-hotwheels_centered.webp',
    heroSideTitle: 'Ramo Nochebuena con Rosas Eternas',
    heroSidePrice: 75.00,
    accentColor: '#15803d',
    accentBadgeBg: 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]',
    filterTabs: [
      { label: 'Todos los Arreglos', value: 'all' },
      { label: 'Calendario de Adviento', value: 'Calendario de Adviento' },
      { label: 'Boxes Navideños', value: 'Boxes Navideños' },
      { label: 'Ramos con Rosas', value: 'Ramos con Rosas' },
      { label: 'Detalles con Luces', value: 'Detalles con Luces' }
    ],
    categories: [
      {
        name: 'Calendario Adviento',
        filter: 'Calendario',
        image: '/products/calendario-de-adviento-2026.webp'
      },
      {
        name: 'Boxes Navideños',
        filter: 'Boxes',
        image: '/products/box-pinguino-lucifer_centered.webp'
      },
      {
        name: 'Ramos Nochebuena',
        filter: 'Ramos',
        image: '/products/ramo-pinguino-hotwheels_centered.webp'
      },
      {
        name: 'Peluches Festivos',
        filter: 'Peluche',
        image: '/products/ramo_premium_lotso_centered.webp'
      },
      {
        name: 'Chocolates & Brindis',
        filter: 'Chocolates',
        image: '/products/box_osita_dormilona_centered.webp'
      },
      {
        name: 'Luces & Detalles',
        filter: 'Luces',
        image: '/products/box-premium-oro-18k_centered.webp'
      }
    ]
  }
]

export const CAMPAIGNS = DEFAULT_CAMPAIGNS

export const useCampaignStore = defineStore('campaign', () => {
  const campaigns = ref(DEFAULT_CAMPAIGNS)
  const activeCampaignId = ref('maquillaje')
  const products = ref([])

  function setProducts(newProducts) {
    if (Array.isArray(newProducts)) {
      products.value = newProducts
    }
  }

  async function loadCampaigns() {
    // Helper to map DB record to campaign object
    const mapCampaignRecord = (r) => {
      let filterTabs = []
      let categories = []
      try {
        filterTabs = typeof r.filter_tabs === 'string' ? JSON.parse(r.filter_tabs) : (r.filter_tabs || [])
      } catch (_) {}
      try {
        categories = typeof r.categories === 'string' ? JSON.parse(r.categories) : (r.categories || [])
      } catch (_) {}

      const id = r.slug || r.id
      const defaultMatch = DEFAULT_CAMPAIGNS.find(d => d.id === id)

      return {
        id,
        slug: r.slug || id,
        name: r.name || defaultMatch?.name || '',
        navTitle: r.nav_title || r.name || defaultMatch?.navTitle || '',
        shortName: r.short_name || r.name || defaultMatch?.shortName || '',
        badge: r.badge || defaultMatch?.badge || '',
        tagline: r.tagline || defaultMatch?.tagline || '',
        description: r.description || defaultMatch?.description || '',
        heroTitle: r.hero_title || defaultMatch?.heroTitle || '',
        heroSubtitle: r.hero_subtitle || defaultMatch?.heroSubtitle || '',
        heroPrimaryImage: r.hero_primary_image || defaultMatch?.heroPrimaryImage || '',
        heroPrimaryTitle: r.hero_primary_title || defaultMatch?.heroPrimaryTitle || '',
        heroSideImage: r.hero_side_image || defaultMatch?.heroSideImage || '',
        heroSideTitle: r.hero_side_title || defaultMatch?.heroSideTitle || '',
        heroSidePrice: r.hero_side_price ? Number(r.hero_side_price) : (defaultMatch?.heroSidePrice || 0),
        accentColor: r.accent_color || defaultMatch?.accentColor || '#965e9b',
        accentBadgeBg: defaultMatch?.accentBadgeBg || 'bg-[#f6eef8] text-[#753d77] border-[#e8d5ec]',
        filterTabs: filterTabs.length ? filterTabs : (defaultMatch?.filterTabs || [{ label: 'Todos', value: 'all' }]),
        categories: categories.length ? categories : (defaultMatch?.categories || [])
      }
    }

    // 1. Try local PocketBase
    try {
      const records = await pb.collection('campaigns').getFullList({
        sort: 'order',
        filter: 'is_active = true'
      })
      if (records && records.length > 0) {
        campaigns.value = records.map(mapCampaignRecord)
        return
      }
    } catch (_) {}

    // 2. Try remote PocketBase
    try {
      const remotePb = new PocketBase('https://admin.venezzia.shop')
      const remoteRecords = await remotePb.collection('campaigns').getFullList({
        sort: 'order',
        filter: 'is_active = true'
      })
      if (remoteRecords && remoteRecords.length > 0) {
        campaigns.value = remoteRecords.map(mapCampaignRecord)
        return
      }
    } catch (_) {}
  }

  const activeCampaign = computed(() => {
    const list = campaigns.value.length ? campaigns.value : DEFAULT_CAMPAIGNS
    const base = list.find(c => c.id === activeCampaignId.value) || list[0]
    const campProducts = products.value.filter(p => (p.campaign || 'maquillaje') === base.id)

    // Helper to find image by product name or id
    const findProductImage = (searchStr, fallback) => {
      if (!campProducts.length) return fallback
      const match = campProducts.find(p => 
        p.id === searchStr || 
        (p.name && p.name.toLowerCase().includes(searchStr.toLowerCase()))
      )
      return match?.image || fallback
    }

    const findProductPrice = (searchStr, fallback) => {
      if (!campProducts.length) return fallback
      const match = campProducts.find(p => 
        p.id === searchStr || 
        (p.name && p.name.toLowerCase().includes(searchStr.toLowerCase()))
      )
      return match ? Number(match.price) : fallback
    }

    // Dynamic Hero Primary
    let dynamicHeroPrimaryImage = base.heroPrimaryImage
    if (base.id === 'maquillaje') {
      dynamicHeroPrimaryImage = findProductImage('Osita Dormilona', base.heroPrimaryImage)
    } else if (base.id === 'hotwheels') {
      dynamicHeroPrimaryImage = findProductImage('Toretto', base.heroPrimaryImage)
    } else if (base.id === 'graduacion') {
      dynamicHeroPrimaryImage = findProductImage('Birrete', base.heroPrimaryImage)
    } else if (base.id === 'cumpleanos') {
      dynamicHeroPrimaryImage = findProductImage('Globos', base.heroPrimaryImage)
    } else if (base.id === 'navidad') {
      dynamicHeroPrimaryImage = findProductImage('Adviento', base.heroPrimaryImage)
    }

    // Dynamic Hero Side
    let dynamicHeroSideImage = base.heroSideImage
    let dynamicHeroSidePrice = base.heroSidePrice
    if (base.id === 'maquillaje') {
      dynamicHeroSideImage = findProductImage('Hello Kitty', base.heroSideImage)
      dynamicHeroSidePrice = findProductPrice('Hello Kitty', base.heroSidePrice)
    } else if (base.id === 'hotwheels') {
      dynamicHeroSideImage = findProductImage('Spiderman', base.heroSideImage)
      dynamicHeroSidePrice = findProductPrice('Spiderman', base.heroSidePrice)
    } else if (base.id === 'graduacion') {
      dynamicHeroSideImage = findProductImage('Girasol', base.heroSideImage)
      dynamicHeroSidePrice = findProductPrice('Girasol', base.heroSidePrice)
    } else if (base.id === 'cumpleanos') {
      dynamicHeroSideImage = findProductImage('Tulipanes', base.heroSideImage)
      dynamicHeroSidePrice = findProductPrice('Tulipanes', base.heroSidePrice)
    } else if (base.id === 'navidad') {
      dynamicHeroSideImage = findProductImage('Nieve', base.heroSideImage)
      dynamicHeroSidePrice = findProductPrice('Nieve', base.heroSidePrice)
    }

    // Dynamic categories images from live products
    const dynamicCategories = (base.categories || []).map(cat => {
      let catImage = cat.image
      if (campProducts.length > 0) {
        const catMatch = campProducts.find(p => 
          (p.category && p.category.toLowerCase().includes(cat.filter.toLowerCase())) ||
          (p.name && p.name.toLowerCase().includes(cat.filter.toLowerCase()))
        )
        if (catMatch?.image) {
          catImage = catMatch.image
        }
      }
      return {
        ...cat,
        image: catImage
      }
    })

    return {
      ...base,
      heroPrimaryImage: dynamicHeroPrimaryImage,
      heroSideImage: dynamicHeroSideImage,
      heroSidePrice: dynamicHeroSidePrice,
      categories: dynamicCategories
    }
  })

  function setCampaign(id) {
    if (campaigns.value.some(c => c.id === id)) {
      activeCampaignId.value = id
    }
  }

  return {
    campaigns,
    activeCampaignId,
    activeCampaign,
    products,
    setProducts,
    setCampaign,
    loadCampaigns
  }
})
