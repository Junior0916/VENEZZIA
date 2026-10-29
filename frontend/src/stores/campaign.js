import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const CAMPAIGNS = [
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
    heroSubtitle: 'Diseños que cautivan: combinamos cosmética premium Jarusa & Reve\'l, peluches importados y rosas eternas preservadas.',
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
    badge: 'Colección Oficial • Hot Wheels Venta',
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
  }
]

export const useCampaignStore = defineStore('campaign', () => {
  const activeCampaignId = ref('maquillaje')
  const products = ref([])

  function setProducts(newProducts) {
    if (Array.isArray(newProducts)) {
      products.value = newProducts
    }
  }

  const activeCampaign = computed(() => {
    const base = CAMPAIGNS.find(c => c.id === activeCampaignId.value) || CAMPAIGNS[0]
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

    // Dynamic Hero Primary (e.g. Box Osita Dormilona Lotso in Maquillaje, Box Toretto in Hot Wheels)
    let dynamicHeroPrimaryImage = base.heroPrimaryImage
    if (base.id === 'maquillaje') {
      dynamicHeroPrimaryImage = findProductImage('Osita Dormilona', base.heroPrimaryImage)
    } else {
      dynamicHeroPrimaryImage = findProductImage('Toretto', base.heroPrimaryImage)
    }

    // Dynamic Hero Side (e.g. Ramo 3 Hello Kitty in Maquillaje, Ramo Spiderman in Hot Wheels)
    let dynamicHeroSideImage = base.heroSideImage
    let dynamicHeroSidePrice = base.heroSidePrice
    if (base.id === 'maquillaje') {
      dynamicHeroSideImage = findProductImage('Hello Kitty', base.heroSideImage)
      dynamicHeroSidePrice = findProductPrice('Hello Kitty', base.heroSidePrice)
    } else {
      dynamicHeroSideImage = findProductImage('Spiderman', base.heroSideImage)
      dynamicHeroSidePrice = findProductPrice('Spiderman', base.heroSidePrice)
    }

    // Dynamic categories images from live products
    const dynamicCategories = base.categories.map(cat => {
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
    if (CAMPAIGNS.some(c => c.id === id)) {
      activeCampaignId.value = id
    }
  }

  return {
    campaigns: CAMPAIGNS,
    activeCampaignId,
    activeCampaign,
    products,
    setProducts,
    setCampaign
  }
})
