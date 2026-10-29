import PocketBase from 'pocketbase'

function getPocketBaseUrl() {
  const envUrl = import.meta.env.VITE_POCKETBASE_URL
  const isBrowser = typeof window !== 'undefined'
  const isLocalHost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  if (isBrowser && !isLocalHost) {
    return 'https://admin.venezzia.shop'
  }

  if (envUrl && (!envUrl.includes('127.0.0.1') || isLocalHost)) {
    return envUrl
  }

  return 'http://127.0.0.1:8090'
}

export const POCKETBASE_URL = getPocketBaseUrl()
export const pb = new PocketBase(POCKETBASE_URL)

// Catálogo Oficial de Venezzia Detalles organizado por Campañas Especiales
export const MOCK_PRODUCTS = [
  // ==========================================
  // CAMPAÑA 1: DÍA DE REGALAR MAQUILLAJE
  // ==========================================
  {
    id: 'prod-box-basico',
    campaign: 'maquillaje',
    name: 'Box Básico de Maquillaje',
    description: 'Caja temática con luces LED cálidas, mascarilla facial, vincha para skincare, beauty blenders y maquillaje Jarusa.',
    price: 40.00,
    category: 'Boxes de Maquillaje',
    image: '/products/box_basico_centered.webp',
    in_stock: true,
    items_included: [
      'Caja personalizada con tu personaje favorito',
      'Luces cálidas LED integradas',
      'Sticker temático del personaje',
      'Tarjeta personalizada con dedicatoria',
      'Mascarilla Jarusa',
      'Vincha suave para skincare',
      'Ganchitos hawaianos',
      'Beauty blender para rostro (grande)',
      'Beauty blender pequeño (contorno)',
      'Bálsamo labial hidratante 2 en 1',
      'Rubor en crema Jarusa',
      'Tinta de labios'
    ]
  },
  {
    id: 'prod-box-osita',
    campaign: 'maquillaje',
    name: 'Box Osita Dormilona Lotso',
    description: 'Caja especial con peluche Lotso dormilón, paleta de 18 tonos Jarusa, rubor en crema, sombras y labial de larga duración.',
    price: 80.00,
    category: 'Boxes de Maquillaje',
    image: '/products/box_osita_dormilona_centered.webp',
    in_stock: true,
    items_included: [
      'Caja personalizada "Tú eres especial para mí"',
      'Luces LED decorativas',
      'Sticker temático de Lotso',
      'Tarjeta personalizada con dedicatoria',
      'Peluche Lotso dormilón de felpa suave',
      'Mascarilla Jarusa',
      'Vincha para skincare',
      'Corrector Ready Jarusa',
      'Rubor en crema Jarusa',
      'Paleta de sombras de 18 colores Jarusa',
      'Tinta de labios',
      'Labial de larga duración Reve\'l',
      'Delineador de lápiz para cejas Jarusa'
    ]
  },
  {
    id: 'prod-box-kitty',
    campaign: 'maquillaje',
    name: 'Box Kitty Premium Deluxe',
    description: 'El set más completo de Hello Kitty con peluche importado, paleta de 18 colores, polvos compactos, gloss llavero y 16 cosméticos.',
    price: 135.00,
    category: 'Boxes de Maquillaje',
    image: '/products/box_kitty_premium_centered.webp',
    in_stock: true,
    items_included: [
      'Caja personalizada "Un regalo Especialmente Para ti"',
      'Luces LED decorativas',
      'Sticker temático de Hello Kitty',
      'Tarjeta personalizada con dedicatoria',
      'Peluche Hello Kitty Importado de felpa',
      'Mascarilla Jarusa',
      'Crema hidratante para manos',
      'Rubor líquido Jarusa',
      'Paleta de sombras de 18 colores Jarusa',
      'Labial de larga duración Reve\'l',
      'Gloss labial con llavero',
      'Delineador de lápiz para cejas Jarusa',
      'Pestañitas',
      'Polvo compacto Jarusa',
      'Kit de beauty blender + ganchitos Hawai',
      'Mini borlas aplicadoras',
      'Hidratante labial fresita'
    ]
  },
  {
    id: 'prod-ramo-basico',
    campaign: 'maquillaje',
    name: 'Ramo Básico de Maquillaje',
    description: 'Bouquet con 2 rosas eternas hechas a mano, luces LED, labial mate Jarusa, rubor Reve\'l, perfilador y llavero con gloss.',
    price: 40.00,
    category: 'Ramos con Rosas',
    image: '/products/ramo_basico_centered.webp',
    in_stock: true,
    items_included: [
      '2 Rosas eternas artesanales',
      'Luces LED decorativas',
      'Tarjeta personalizada con dedicatoria',
      'Labial mate Jarusa',
      'Rubor Reve\'l',
      'Perfilador facial',
      'Llavero con gloss labial',
      'Labial hidratante fresita',
      'Hidratante PH y rubor'
    ]
  },
  {
    id: 'prod-ramo-chanchita',
    campaign: 'maquillaje',
    name: 'Ramo 1 La Chanchita',
    description: 'Ramo con peluche tierno La Chanchita, 3 rosas eternas, iluminador en polvo, polvo compacto, labial mate y delineador.',
    price: 90.00,
    category: 'Ramos con Rosas',
    image: '/products/ramo_1_chanchita_centered.webp',
    in_stock: true,
    items_included: [
      '3 Rosas eternas artesanales',
      'Luces LED decorativas',
      'Tarjeta personalizada con dedicatoria',
      'Peluche suave La Chanchita',
      'Labial mate Jarusa',
      'Polvo compacto Jarusa',
      'Pestañas postizas',
      'Iluminador en polvo Jarusa',
      'Llavero con gloss',
      'Labial de larga duración Reve\'l',
      'Delineador de labios Reve\'l',
      'Hidratante fresita'
    ]
  },
  {
    id: 'prod-ramo-ovejita',
    campaign: 'maquillaje',
    name: 'Ramo 2 La Ovejita',
    description: 'Ramo bouquet con peluche La Ovejita, 3 rosas eternas, kit beauty blender, corrector Ready de Jarusa y rubor líquido.',
    price: 100.00,
    category: 'Ramos con Rosas',
    image: '/products/ramo_2_ovejita_centered.webp',
    in_stock: true,
    items_included: [
      '3 Rosas eternas artesanales',
      'Luces LED decorativas',
      'Tarjeta personalizada con dedicatoria',
      'Peluche tierno La Ovejita',
      'Tinta labial',
      'Delineador de labios',
      'Kit de beauty blender + ganchitos Hawai',
      'Mini borlas aplicadoras',
      'Corrector Ready de Jarusa',
      'Pestañitas Reve\'l',
      'Lip gloss Reve\'l larga duración',
      'Rubor mate en líquido',
      'Iluminador Ready Jarusa',
      'Labial larga duración Reve\'l',
      'Rubor en líquido Jarusa'
    ]
  },
  {
    id: 'prod-ramo-kitty',
    campaign: 'maquillaje',
    name: 'Ramo 3 Hello Kitty',
    description: 'Bouquet exclusivo de Hello Kitty con 3 rosas eternas, vincha para skincare, lip combo Reve\'l, polvo suelto y sombras.',
    price: 110.00,
    category: 'Ramos con Rosas',
    image: '/products/ramo_3_kitty_centered.webp',
    in_stock: true,
    items_included: [
      '3 Rosas eternas artesanales',
      'Luces LED decorativas',
      'Tarjeta personalizada con dedicatoria',
      'Peluche original de Hello Kitty',
      'Polvo compacto Jarusa',
      'Labial mate Jarusa',
      'Rubor en polvo de Reve\'l',
      'Rubor en líquido Jarusa',
      'Tinta de labios Reve\'l',
      'Labial de larga duración Amorosa Reve\'l',
      'Pestañitas Reve\'l',
      'Delineador de labios waterproof Reve\'l',
      'Vinchita de Skincare',
      'Lip combo para labios Reve\'l',
      'Polvo suelto Reve\'l Professional'
    ]
  },
  {
    id: 'prod-ramo-premium-lotso',
    campaign: 'maquillaje',
    name: 'Ramo Premium Lotso Deluxe',
    description: 'El arreglo más completo y solicitado: Peluche Lotso, 3 rosas eternas, brocha profesional, fijador y más de 18 cosméticos.',
    price: 160.00,
    category: 'Ramos con Rosas',
    image: '/products/ramo_premium_lotso_centered.webp',
    in_stock: true,
    items_included: [
      '3 Rosas eternas artesanales',
      'Luces LED decorativas',
      'Tarjeta personalizada con dedicatoria',
      'Peluche de Lotso importado',
      'Kit de beauty blender + ganchitos Hawai',
      'Mini borlas aplicadoras',
      'Iluminador Jarusa',
      'Tinta de labios Reve\'l',
      'Labial de larga duración Amorosa Reve\'l',
      'Brillo labial llavero de Reve\'l',
      'Polvo compacto Jarusa',
      'Fijador de maquillaje Jarusa',
      'Labial mate Jarusa',
      'Delineador de labios waterproof Reve\'l',
      'Brocha profesional para maquillaje',
      'Pestañitas Reve\'l',
      'Rubor Jarusa',
      'Lip combo para labios Reve\'l',
      'Perfiladoras faciales',
      'Mascarilla hidratante'
    ]
  },

  // ==========================================
  // CAMPAÑA 2: DÍA DE REGALAR HOT WHEELS (2026)
  // ==========================================
  {
    id: 'hw-personalizado',
    campaign: 'hotwheels',
    name: 'Hot Wheels Blister Personalizado',
    description: 'Empaque blister original Hot Wheels 100% personalizado con foto de pareja, escudo del club o diseño temático.',
    price: 25.00,
    category: 'Autos Personalizados',
    image: '/products/hotwheels-personalizado_centered.webp',
    catalog_card: '/products/hotwheels-personalizado_card.webp',
    in_stock: true,
    items_included: [
      '1 Auto Hot Wheels original sellado en empaque blister',
      'Diseño fotográfico personalizado con foto y dedicatoria',
      'Temáticas a elección: Pareja, Alianza Lima, Universitario, Toretto o Libre',
      'Impresión fotográfica de alta resolución con acabado brillo'
    ]
  },
  {
    id: 'hw-ramo-1',
    campaign: 'hotwheels',
    name: 'Ramo Hot Wheels 1 Carrito',
    description: 'Bouquet elegante con 1 auto Hot Wheels a elección, 1 rosa eterna azul rey, tarjeta de dedicatoria y foto polaroid.',
    price: 25.00,
    original_price: 35.00,
    category: 'Ramos Hot Wheels',
    image: '/products/ramo-hotwheels-1_centered.webp',
    catalog_card: '/products/ramo-hotwheels-1_card.webp',
    in_stock: true,
    items_included: [
      '1 Auto Hot Wheels básico a elección',
      '1 Rosa eterna artesanal azul rey',
      'Tarjeta de dedicatoria temática Hot Wheels',
      '1 Foto polaroid personalizada',
      'Envoltura de lujo con lazo de satén azul',
      'Opción con auto personalizado o premium: S/ 45.00'
    ]
  },
  {
    id: 'hw-ramo-2',
    campaign: 'hotwheels',
    name: 'Ramo Hot Wheels 2 Carritos (Promoción)',
    description: 'El favorito de los clientes: 2 Hot Wheels básicos, 3 rosas eternas azules, 2 fotos polaroid, dedicatoria y globito de regalo.',
    price: 50.00,
    original_price: 55.00,
    category: 'Ramos Hot Wheels',
    image: '/products/ramo-hotwheels-2_centered.webp',
    catalog_card: '/products/ramo-hotwheels-2_card.webp',
    in_stock: true,
    items_included: [
      '2 Autos Hot Wheels básicos a elección',
      '3 Rosas eternas azul rey hechas a mano',
      'Tarjeta de dedicatoria "Entrega Especial"',
      'Lazo de satén azul cobalto',
      '2 Fotos polaroid personalizadas',
      'Globito de corazón de regalo'
    ]
  },
  {
    id: 'hw-ramo-3',
    campaign: 'hotwheels',
    name: 'Ramo Hot Wheels 3 Carritos Deluxe',
    description: 'Arreglo deluxe con 3 Hot Wheels a elección, 5 rosas eternas, collar plateado waterproof 316L y polaroids.',
    price: 70.00,
    category: 'Ramos Hot Wheels',
    image: '/products/ramo-hotwheels-3_centered.webp',
    catalog_card: '/products/ramo-hotwheels-3_card.webp',
    in_stock: true,
    items_included: [
      '3 Autos Hot Wheels básicos a elección',
      '5 Rosas eternas azul noche artesanales',
      'Collar plateado original 316L waterproof con estuche Venezzia',
      'Tarjeta dedicatoria personalizada',
      'Lazo de satén',
      '2 Fotos polaroid con broches',
      'Globito metálico de corazón de regalo',
      'Opción sin collar disponible por S/ 50.00'
    ]
  },
  {
    id: 'hw-box-basico',
    campaign: 'hotwheels',
    name: 'Box Básico Hot Wheels',
    description: 'Caja personalizada "Para el mejor novio del mundo", 1 Hot Wheels a elección, collar plateado original 316L waterproof y Bon o Bon.',
    price: 50.00,
    category: 'Gift Boxes & Cuadros',
    image: '/products/box-basico-hotwheels_centered.webp',
    catalog_card: '/products/box-basico-hotwheels_card.webp',
    in_stock: true,
    items_included: [
      '1 Auto Hot Wheels básico a elección',
      'Collar plateado original 316L (waterproof / no se despinta)',
      'Tarjeta dedicatoria "Coincidir contigo mejoró mi vida"',
      '2 Fotos polaroid con mini pinza de madera',
      'Caja personalizada "Para el mejor novio del mundo"',
      '1 Chocolate Bon o Bon',
      'Viruta decorativa protectora',
      'Opción con Hot Wheels personalizado: S/ 60.00'
    ]
  },
  {
    id: 'hw-box-cuadro',
    campaign: 'hotwheels',
    name: 'Box Cuadro Hot Wheels',
    description: 'Box completo con cuadro personalizado en blanco o negro, 1 Hot Wheels, collar 316L con dije, luces LED y chocolates.',
    price: 70.00,
    category: 'Gift Boxes & Cuadros',
    image: '/products/box-cuadro-hotwheels_centered.webp',
    catalog_card: '/products/box-cuadro-hotwheels_card.webp',
    in_stock: true,
    items_included: [
      '1 Auto Hot Wheels básico a elección',
      'Cuadro personalizado (blanco o negro) con marco y vidrio protector',
      'Collar plateado con dije original 316L (waterproof)',
      'Tarjeta dedicatoria',
      '3 Fotos polaroid personalizadas',
      '3 Chocolates Bon o Bon',
      '1 Chocolate Obsesión',
      '1 Chocolate Sublime clásico',
      'Guirnalda de luces LED cálidas',
      'Caja temática de regalo'
    ]
  },
  {
    id: 'hw-box-snacks',
    campaign: 'hotwheels',
    name: 'Box Personalizado Snacks & Joyería',
    description: 'Caja temática con 1 Hot Wheels personalizado, collar con dije 316L, bolsa de Inka Chips, chocolate Vizzio, Bon o Bon y luces LED.',
    price: 70.00,
    category: 'Gift Boxes & Cuadros',
    image: '/products/box-personalizado-snacks_centered.webp',
    catalog_card: '/products/box-personalizado-snacks_card.webp',
    in_stock: true,
    items_included: [
      '1 Auto Hot Wheels básico personalizado a elección',
      'Collar plateado con dije original 316L (waterproof)',
      'Tarjeta dedicatoria',
      '3 Chocolates Bon o Bon',
      '1 Chocolate Obsesión',
      '1 Chocolate Sublime',
      '1 Bolsa de Inka Chips crujientes',
      '1 Paquete de Vizzio chocolate',
      'Caja personalizada decorada',
      'Luces LED cálidas'
    ]
  },
  {
    id: 'hw-box-club',
    campaign: 'hotwheels',
    name: 'Box Personalizado Club de Fútbol',
    description: 'Edición especial para hinchas: temática Alianza Lima, Universitario de Deportes o Cristal con Hot Wheels personalizado, collar 316L y snacks.',
    price: 70.00,
    category: 'Gift Boxes & Cuadros',
    image: '/products/box-personalizado-club_centered.webp',
    catalog_card: '/products/box-personalizado-club_card.webp',
    in_stock: true,
    items_included: [
      '1 Auto Hot Wheels personalizado con escudo del club elegido',
      'Collar plateado con dije original 316L waterproof',
      'Tarjeta dedicatoria oficial del club',
      '2 Chocolates Bon o Bon',
      '1 Bolsa de Inka Chips',
      '1 Chocolate Vizzio',
      'Caja temática con diseño del club',
      'Luces LED integradas',
      'Globo metálico de corazón'
    ]
  },
  {
    id: 'hw-box-toretto',
    campaign: 'hotwheels',
    name: 'Box Fast & Furious Toretto',
    description: 'Inspirado en Rápidos y Furiosos: auto Hot Wheels Dodge Charger, collar con la cruz de Toretto en acero 316L, snacks y caja negra temática.',
    price: 48.00,
    category: 'Gift Boxes & Cuadros',
    image: '/products/box-toretto-fast-furious_centered.webp',
    catalog_card: '/products/box-toretto-fast-furious_card.webp',
    in_stock: true,
    items_included: [
      '1 Auto Hot Wheels Dodge Charger Fast & Furious',
      'Collar con la cruz original de Toretto en acero 316L waterproof',
      'Tarjeta dedicatoria temática "Familia & Velocidad"',
      '2 Chocolates Bon o Bon',
      '1 Bolsa de Inka Chips',
      '1 Chocolate Obsesión',
      'Caja negra edición especial Hot Wheels',
      'Luces LED cálidas',
      'Globo corazón metálico',
      'Opción con cuadro personalizado disponible por S/ 90.00'
    ]
  },
  {
    id: 'hw-box-premium-oro',
    campaign: 'hotwheels',
    name: 'Box Premium Deluxe Inicial Oro 18K',
    description: 'El detalle de mayor categoría: collar de acero quirúrgico 316L con inicial personalizada y enchape en oro de 18K, Hot Wheels personalizado y dulces surtidos.',
    price: 90.00,
    category: 'Gift Boxes & Cuadros',
    image: '/products/box-premium-oro-18k_centered.webp',
    catalog_card: '/products/box-premium-oro-18k_card.webp',
    in_stock: true,
    items_included: [
      'Collar de acero quirúrgico 316L con dije de inicial y enchape en oro de 18K',
      '1 Auto Hot Wheels básico a elección con empaque personalizado',
      'Caja temática Hot Wheels con auto deportivo',
      'Tarjeta dedicatoria en sobre de lujo',
      'Luces LED integradas',
      'Gomitas dulces gourmet',
      '1 Bolsa de Inka Chips',
      '3 Fotos polaroid personalizadas',
      '2 Chocolates Bon o Bon',
      '1 Chocolate Sublime',
      '1 Chocolate Vizzio'
    ]
  },
  {
    id: 'hw-ramo-stitch',
    campaign: 'hotwheels',
    name: 'Ramo Stitch con Rosas Eternas',
    description: 'Ramo bouquet con peluche importado de Stitch, 2 Hot Wheels básicos, 5 rosas eternas azules, luces LED y fotos polaroid.',
    price: 80.00,
    original_price: 90.00,
    category: 'Ramos Hot Wheels',
    image: '/products/ramo-stitch-hotwheels_centered.webp',
    catalog_card: '/products/ramo-stitch-hotwheels_card.webp',
    in_stock: true,
    items_included: [
      '2 Autos Hot Wheels básicos a elección',
      'Peluche importado de Stitch suave al tacto',
      '5 Rosas eternas azul noche artesanales',
      'Tarjeta de dedicatoria personalizada',
      'Guirnalda de luces LED',
      '2 Fotos polaroid con broches',
      'Lazo de satén azul cobalto'
    ]
  },
  {
    id: 'hw-ramo-clubes',
    campaign: 'hotwheels',
    name: 'Ramo Clubes (Alianza, U o Cristal)',
    description: 'Ramo futbolero con peluche temático de chanchito del club, 2 Hot Wheels, 5 rosas eternas, luces LED y tarjeta dedicatoria.',
    price: 68.00,
    original_price: 80.00,
    category: 'Ramos Hot Wheels',
    image: '/products/ramo-clubes-futbol_centered.webp',
    catalog_card: '/products/ramo-clubes-futbol_card.webp',
    in_stock: true,
    items_included: [
      '2 Autos Hot Wheels básicos a elección',
      '1 Peluche temático chanchito con camiseta del club',
      'Clubes a elección: Alianza Lima, Universitario de Deportes o Sporting Cristal',
      '5 Rosas eternas artesanales',
      'Tarjeta dedicatoria del hincha',
      'Luces LED cálidas',
      '2 Fotos polaroid de recuerdo'
    ]
  },
  {
    id: 'hw-ramo-spiderman',
    campaign: 'hotwheels',
    name: 'Ramo Spiderman Hot Wheels',
    description: 'Ramo temático con peluche de Spiderman, 2 Hot Wheels, 5 rosas eternas rojas y azules, telaraña decorativa y luces LED.',
    price: 70.00,
    original_price: 85.00,
    category: 'Ramos Hot Wheels',
    image: '/products/ramo-spiderman-hotwheels_centered.webp',
    catalog_card: '/products/ramo-spiderman-hotwheels_card.webp',
    in_stock: true,
    items_included: [
      '2 Autos Hot Wheels básicos a elección',
      '1 Peluche importado de Spiderman',
      '5 Rosas eternas artesanales (azul cobalto y rojo carmín)',
      'Malla de telaraña temática con pequeñas arañas decorativas',
      'Tarjeta dedicatoria personalizada',
      'Guirnalda de luces LED',
      '2 Fotos polaroid'
    ]
  },
  {
    id: 'hw-box-superheroes',
    campaign: 'hotwheels',
    name: 'Box Superhéroes & Cerveza Pilsen',
    description: 'Box completo para celebrar a lo grande: lata helada de Pilsen Callao o gaseosa, peluche temático (Goku o Spiderman), Hot Wheels y chocolates.',
    price: 70.00,
    category: 'Gift Boxes & Cuadros',
    image: '/products/box-superheroes-pilsen_centered.webp',
    catalog_card: '/products/box-superheroes-pilsen_card.webp',
    in_stock: true,
    items_included: [
      '1 Auto Hot Wheels básico a elección',
      '1 Lata de cerveza Pilsen Callao (o gaseosa a elección)',
      'Peluche temático a elección (Goku, Spiderman, etc.)',
      'Tarjeta dedicatoria personalizada',
      'Luces LED decorativas',
      '2 Fotos polaroid con broche',
      '1 Paquete de galletas Chocochip o Morocha',
      '2 Chocolates Princesa Nestlé',
      '1 Bolsa de Inka Chips',
      'Globo corazón personalizado'
    ]
  },
  {
    id: 'hw-box-pinguino',
    campaign: 'hotwheels',
    name: 'Box Pareja Pingüino & Lucifer',
    description: 'Box romántico y divertido con peluche temático de Pingüino o Lucifer (gatito gruñón), Hot Wheels, bebidas y dulces.',
    price: 75.00,
    original_price: 85.00,
    category: 'Gift Boxes & Cuadros',
    image: '/products/box-pinguino-lucifer_centered.webp',
    catalog_card: '/products/box-pinguino-lucifer_card.webp',
    in_stock: true,
    items_included: [
      '1 Auto Hot Wheels básico a elección',
      '1 Peluche a elección: Pingüino amoroso o Lucifer el gatito gruñón',
      '1 Botella de Coca-Cola o lata de cerveza Pilsen Callao',
      'Tarjeta dedicatoria "¡Hola! Un regalito para ti"',
      'Luces LED cálidas',
      '2 Fotos polaroid personalizadas',
      '1 Bolsa de Inka Chips',
      '1 Galleta Chocochip',
      '2 Chocolates Princesa Nestlé',
      'Globo corazón metálico personalizado con nombre'
    ]
  }
]

const PRODUCT_OPTIMIZED_ASSETS = {
  // Makeup Products (All 8 updated today from PocketBase)
  'wtflhywy1xh62su': '/products/box_basico_centered.webp',
  'cw4r0vwwapz9bwy': '/products/box_osita_dormilona_centered.webp',
  'eo4abuk5zt6urst': '/products/box_kitty_premium_centered.webp',
  '8c29i2ivnaellwc': '/products/ramo_basico_centered.webp',
  '8ecp42hmvj1g22m': '/products/ramo_1_chanchita_centered.webp',
  'u1b5w7z3y7t4pmf': '/products/ramo_2_ovejita_centered.webp',
  '4ldwj93qh60jm1n': '/products/ramo_3_kitty_centered.webp',
  '8vni5zbd1ktrqm0': '/products/ramo_premium_lotso_centered.webp',

  // Mock IDs
  'prod-box-basico': '/products/box_basico_centered.webp',
  'prod-box-osita': '/products/box_osita_dormilona_centered.webp',
  'prod-box-kitty': '/products/box_kitty_premium_centered.webp',
  'prod-ramo-basico': '/products/ramo_basico_centered.webp',
  'prod-ramo-1-chanchita': '/products/ramo_1_chanchita_centered.webp',
  'prod-ramo-2-ovejita': '/products/ramo_2_ovejita_centered.webp',
  'prod-ramo-3-kitty': '/products/ramo_3_kitty_centered.webp',
  'prod-ramo-premium-lotso': '/products/ramo_premium_lotso_centered.webp',

  // Hot Wheels Products
  'k6pb4b7yr7wtvyf': '/products/hotwheels-personalizado_centered.webp',
  'ep5euoouk0ddg0d': '/products/ramo-hotwheels-1_centered.webp',
  'tbu6ddejbimcx1j': '/products/ramo-hotwheels-2_centered.webp',
  'fgbjb7vu0j401ko': '/products/ramo-hotwheels-3_centered.webp',
  '8b6pkzn4irmxvhx': '/products/box-basico-hotwheels_centered.webp',
  'bv0ez8n5yez3qsh': '/products/box-cuadro-hotwheels_centered.webp',
  '5p4sw85g259hl1n': '/products/box-personalizado-snacks_centered.webp',
  'xw26wh4ugkky7my': '/products/box-personalizado-club_centered.webp',
  'eodijs3ju1h1p73': '/products/box-toretto-fast-furious_centered.webp',
  'ki8o8aep535a5hw': '/products/box-premium-oro-18k_centered.webp',
  'u4a9pl7xyot0scf': '/products/ramo-stitch-hotwheels_centered.webp',
  'fkaup04w28ugiic': '/products/ramo-clubes-futbol_centered.webp',
  'at700ggzd3qp5tm': '/products/ramo-spiderman-hotwheels_centered.webp',
  'tcn4yq2cb2buurn': '/products/box-superheroes-pilsen_centered.webp',
  'hso5k926u81bb7k': '/products/box-pinguino-lucifer_centered.webp',

  // Hot Wheels mock IDs
  'hw-blister-personalizado': '/products/hotwheels-personalizado_centered.webp',
  'hw-ramo-1': '/products/ramo-hotwheels-1_centered.webp',
  'hw-ramo-2': '/products/ramo-hotwheels-2_centered.webp',
  'hw-ramo-3': '/products/ramo-hotwheels-3_centered.webp',
  'hw-box-basico': '/products/box-basico-hotwheels_centered.webp',
  'hw-box-cuadro': '/products/box-cuadro-hotwheels_centered.webp',
  'hw-box-snacks': '/products/box-personalizado-snacks_centered.webp',
  'hw-box-club': '/products/box-personalizado-club_centered.webp',
  'hw-box-toretto': '/products/box-toretto-fast-furious_centered.webp',
  'hw-box-oro': '/products/box-premium-oro-18k_centered.webp',
  'hw-ramo-stitch': '/products/ramo-stitch-hotwheels_centered.webp',
  'hw-ramo-clubes': '/products/ramo-clubes-futbol_centered.webp',
  'hw-ramo-spiderman': '/products/ramo-spiderman-hotwheels_centered.webp',
  'hw-box-superheroes': '/products/box-superheroes-pilsen_centered.webp',
  'hw-box-pinguino': '/products/box-pinguino-lucifer_centered.webp'
}

function resolveProductImage(record, client) {
  // 1. Direct ID match for optimized WebP
  if (record?.id && PRODUCT_OPTIMIZED_ASSETS[record.id]) {
    return PRODUCT_OPTIMIZED_ASSETS[record.id]
  }

  // 2. Name-based match for catalog products
  const norm = (record?.name || '').toLowerCase()
  if (norm.includes('osita dormilona')) return '/products/box_osita_dormilona_centered.webp'
  if (norm.includes('kitty premium')) return '/products/box_kitty_premium_centered.webp'
  if (norm.includes('ramo 3') && norm.includes('kitty')) return '/products/ramo_3_kitty_centered.webp'
  if (norm.includes('ramo 2') && norm.includes('ovejita')) return '/products/ramo_2_ovejita_centered.webp'
  if (norm.includes('ramo 1') && norm.includes('chanchita')) return '/products/ramo_1_chanchita_centered.webp'
  if (norm.includes('ramo basico') || norm.includes('ramo básico')) return '/products/ramo_basico_centered.webp'
  if (norm.includes('box basico') || norm.includes('box básico')) return '/products/box_basico_centered.webp'
  if (norm.includes('lotso deluxe') || norm.includes('ramo premium lotso')) return '/products/ramo_premium_lotso_centered.webp'

  // Hot Wheels names
  if (norm.includes('toretto') || norm.includes('fast & furious')) return '/products/box-toretto-fast-furious_centered.webp'
  if (norm.includes('spiderman')) return '/products/ramo-spiderman-hotwheels_centered.webp'
  if (norm.includes('stitch')) return '/products/ramo-stitch-hotwheels_centered.webp'
  if (norm.includes('cuadro hot wheels')) return '/products/box-cuadro-hotwheels_centered.webp'
  if (norm.includes('superhéroes') || norm.includes('pilsen')) return '/products/box-superheroes-pilsen_centered.webp'
  if (norm.includes('pingüino') || norm.includes('lucifer')) return '/products/box-pinguino-lucifer_centered.webp'
  if (norm.includes('blister') || norm.includes('personalizado')) return '/products/hotwheels-personalizado_centered.webp'
  if (norm.includes('1 carrito')) return '/products/ramo-hotwheels-1_centered.webp'
  if (norm.includes('2 carritos')) return '/products/ramo-hotwheels-2_centered.webp'
  if (norm.includes('3 carritos')) return '/products/ramo-hotwheels-3_centered.webp'

  // 3. Fallback to client URL if user adds new custom records
  if (record?.image && client?.files?.getURL) {
    return client.files.getURL(record, record.image, { thumb: '600x750' })
  }

  return '/products/box_basico_centered.webp'
}

export async function fetchProducts() {
  const mapRecord = (record, client) => ({
    id: record.id,
    campaign: record.campaign || 'maquillaje',
    name: record.name,
    description: record.description,
    price: record.price,
    original_price: record.compare_at_price || record.original_price,
    category: record.category || 'General',
    image: resolveProductImage(record, client),
    catalog_card: record.catalog_card,
    in_stock: record.in_stock,
    items_included: record.items_included || []
  })

  try {
    const records = await pb.collection('products').getFullList({
      sort: '-created',
      filter: 'in_stock = true'
    })

    if (records && records.length > 0) {
      return records.map(r => mapRecord(r, pb))
    }
  } catch (err) {
    // continue to remote check
  }

  // If local pb had 0 records or failed, try live remote PocketBase
  try {
    const remotePb = new PocketBase('https://admin.venezzia.shop')
    const remoteRecords = await remotePb.collection('products').getFullList({
      sort: '-created',
      filter: 'in_stock = true'
    })
    if (remoteRecords && remoteRecords.length > 0) {
      return remoteRecords.map(r => mapRecord(r, remotePb))
    }
  } catch (remoteErr) {
    // continue to mock fallback
  }

  return MOCK_PRODUCTS
}
