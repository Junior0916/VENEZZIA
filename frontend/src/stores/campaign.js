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
  },
  {
    id: 'graduacion',
    name: 'Colección Graduación & Éxitos',
    navTitle: 'Graduación',
    shortName: 'Graduación',
    slug: 'graduacion-y-exitos',
    badge: '🎓 Colección Grados & Promociones',
    tagline: 'Celebra su gran meta con ramos de birrete, rosas eternas y detalles inolvidables',
    description: 'Bouquets con birretes artesanales, peluches graduados importados, diplomas de rosas preservadas y copas de brindis con espumante.',
    heroTitle: 'Arreglos y boxes que celebran su mayor logro',
    heroSubtitle: 'Bouquets con birretes de gala, peluches graduados, rosas eternas doradas y azules, y copas grabadas para un brindis inolvidable.',
    heroPrimaryImage: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=600&q=80',
    heroPrimaryTitle: 'Box Éxito de Gala con Birrete',
    heroSideImage: 'https://images.unsplash.com/photo-1538677685457-bfe8192dbdf6?auto=format&fit=crop&w=600&q=80',
    heroSideTitle: 'Ramo Triunfo de Girasoles & Rosas',
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
        name: 'Girasoles del Éxito',
        filter: 'Girasoles',
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
    badge: '🎂 Edición Cumpleaños & Sorpresas',
    tagline: 'Haz que su día sea mágico con boxes explosivos, globos personalizados y ramos de ensueño',
    description: 'Arreglos festivos con globos metalizados, cajas sorpresa de regalo, pasteles gourmet, flores radiantes y finos chocolates.',
    heroTitle: 'Regalos de cumpleaños que hacen latir el corazón',
    heroSubtitle: 'Sorprende en su día especial con cajas temáticas de globos, pasteles finos, chocolates premium y ramos de flores eternas vibrantes.',
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
      dynamicHeroSideImage = findProductImage('Girasoles', base.heroSideImage)
      dynamicHeroSidePrice = findProductPrice('Girasoles', base.heroSidePrice)
    } else if (base.id === 'cumpleanos') {
      dynamicHeroSideImage = findProductImage('Tulipanes', base.heroSideImage)
      dynamicHeroSidePrice = findProductPrice('Tulipanes', base.heroSidePrice)
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
