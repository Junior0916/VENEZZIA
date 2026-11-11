import PocketBase from 'pocketbase'

function getPocketBaseUrl() {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_POCKETBASE_URL : undefined
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
  },

  // -------------------------------------------------------------
  // CAMPAÑA: GRADUACIÓN & ÉXITOS
  // -------------------------------------------------------------
  {
    id: 'grad-box-gala',
    campaign: 'graduacion',
    name: 'Box Éxito de Gala con Birrete & Rosas',
    description: 'Caja circular rígida con mini birrete de gala con borla dorada, 6 rosas eternas preservadas, diploma personalizado enrollado con lazo y luces LED.',
    price: 95.00,
    original_price: 110.00,
    category: 'Boxes de Birrete & Gala',
    image: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '1 Mini birrete de gala artesanal con borla dorada',
      '6 Rosas eternas preservadas (tonos azul real y oro champán)',
      'Diploma personalizado con nombre del graduado y dedicatoria',
      'Guirnalda de luces LED micro-alambre cálidas',
      'Caja rígida boutique con finos acabados en lila y oro',
      'Tarjeta de felicitaciones de lujo'
    ]
  },
  {
    id: 'grad-ramo-girasoles',
    campaign: 'graduacion',
    name: 'Ramo Triunfo de Rosas Eternas & Girasol',
    description: 'Bouquet de rosas eternas doradas con girasol artesanal central, detalles de gala con mini birrete y lazo de satén conmemorativo.',
    price: 85.00,
    original_price: 95.00,
    category: 'Ramos de Graduación',
    image: 'https://images.unsplash.com/photo-1538677685457-bfe8192dbdf6?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '1 Girasol artesanal central de diseño',
      '4 Rosas eternas color oro champán',
      'Mini birrete decorativo para bouquet',
      'Follaje fino decorativo de gala',
      'Envoltura coreana impermeable bitono de lujo',
      'Lazo de seda satén dorado con dedicatoria'
    ]
  },
  {
    id: 'grad-peluche-oso',
    campaign: 'graduacion',
    name: 'Arreglo Oso Graduado con Birrete & Diploma',
    description: 'Peluche tierno con toga y birrete con borla real, sosteniendo un diploma enrollado, acompañado de 3 rosas eternas rojas y luces LED.',
    price: 79.00,
    category: 'Peluches Graduados',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '1 Peluche importado de 25cm con toga y birrete',
      'Mini diploma con medalla dorada',
      '3 Rosas eternas preservadas de calidad premium',
      'Luces LED decorativas integradas',
      'Caja base cilíndrica de diseño Venezzia',
      'Tarjeta dedicatoria especial de graduación'
    ]
  },
  {
    id: 'grad-box-brindis',
    campaign: 'graduacion',
    name: 'Box Brindis de Honor & Chocolates Ferrero',
    description: 'El detalle definitivo para celebrar la titulación: mini espumante Riccadonna, copa de cristal grabada, 8 bombones Ferrero Rocher y rosas eternas.',
    price: 120.00,
    original_price: 135.00,
    category: 'Boxes de Birrete & Gala',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '1 Botella mini de espumante Riccadonna Asti 200ml',
      '1 Copa de cristal para brindis grabada "Licenciad@ / Éxitos"',
      '8 Bombones italianos Ferrero Rocher',
      'Mini birrete con detalles dorados',
      '4 Rosas eternas preservadas',
      'Caja cofre de madera lacada o cartón rígido premium',
      'Luces micro-LED con interruptor'
    ]
  },
  {
    id: 'grad-ramo-rosas-azules',
    campaign: 'graduacion',
    name: 'Ramo Magna Cum Laude de Rosas Azules',
    description: 'Elegante bouquet de 12 rosas artesanales en azul cobalto y blanco perla con mariposa dorada 3D, birrete y mensaje personalizado.',
    price: 90.00,
    category: 'Ramos de Graduación',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '12 Rosas artesanales azul rey y blanco perla',
      'Mariposa dorada troquelada en 3D',
      'Mini birrete de graduación',
      'Papel coreano mate negro y filo dorado',
      'Guirnalda de luces LED blanco cálido',
      'Tarjeta formal con mensaje de felicitación'
    ]
  },
  {
    id: 'grad-box-diploma',
    campaign: 'graduacion',
    name: 'Box Floral Diploma de Oro & Fotografías',
    description: 'Caja rectangular con porta-título decorativo, 3 fotos polaroid del camino universitario, rosas preservadas y deliciosos snacks.',
    price: 88.00,
    category: 'Boxes de Birrete & Gala',
    image: 'https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      'Tubo porta-diploma decorativo con cinta dorada',
      '3 Fotos polaroid personalizadas de la carrera universitaria',
      '5 Rosas eternas preservadas color vino y oro',
      '1 Paquete de bombones finos surtidos',
      'Luces LED cálidas',
      'Caja de presentación personalizada con nombre de la promoción'
    ]
  },
  {
    id: 'grad-peluche-stitch',
    campaign: 'graduacion',
    name: 'Ramo Stitch Graduado con Birrete & Rosas',
    description: 'El personaje más querido en su versión graduado con toga y birrete, 4 rosas eternas, luces LED y globito de felicitación.',
    price: 85.00,
    original_price: 98.00,
    category: 'Peluches Graduados',
    image: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '1 Peluche de Stitch con birrete de graduado',
      '4 Rosas eternas azul real artesanales',
      'Globo metalizado miniatura "Felicidades Graduad@"',
      'Luces LED decorativas',
      'Papel de envoltura coreano especial para promociones',
      'Tarjeta dedicatoria de egresados'
    ]
  },

  // -------------------------------------------------------------
  // CAMPAÑA: CUMPLEAÑOS MÁGICO
  // -------------------------------------------------------------
  {
    id: 'bday-box-pastel-globos',
    campaign: 'cumpleanos',
    name: 'Box Cumpleaños Feliz con Globos Metalizados',
    description: 'Caja de celebración con globo burbuja personalizado con nombre, 5 rosas eternas artesanales, chocolates finos y serpentinas con luces LED.',
    price: 85.00,
    original_price: 95.00,
    category: 'Boxes de Cumpleaños',
    image: 'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      'Globo burbuja transparente de 40cm con frase personalizada en vinil dorado',
      '5 Rosas eternas preservadas con aroma floral suave',
      'Caja redonda de lujo con lazo de organza',
      '1 Paquete de bombones Bon o Bon',
      'Guirnalda de luces LED multicolor',
      'Tarjeta de felicitaciones de cumpleaños caligrafiada'
    ]
  },
  {
    id: 'bday-ramo-tulipanes',
    campaign: 'cumpleanos',
    name: 'Ramo Fiesta Radiante de Rosas Eternas',
    description: 'Bouquet con rosas eternas en delicadas tonalidades pastel, acentos decorativos, papel coreano con mensaje especial y luces LED.',
    price: 80.00,
    category: 'Ramos Festivos',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '6 Rosas eternas en degradé rosa y lila',
      'Follaje y acentos florales decorativos',
      'Topper dorado de felicitación',
      'Luces LED decorativas',
      'Envoltura doble en papel coreano con borde perlado',
      'Lazo de raso de alta gama'
    ]
  },
  {
    id: 'bday-box-torta-gourmet',
    campaign: 'cumpleanos',
    name: 'Box Sweet Birthday con Bento Cake & Rosas',
    description: 'La combinación perfecta: mini torta artesanal Bento Cake con dedicatoria personalizada, 4 rosas eternas, vela chispeante mágica y espátula.',
    price: 105.00,
    original_price: 120.00,
    category: 'Tortas & Dulces',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '1 Mini Bento Cake artesanal con diseño y mensaje a elección (vainilla o chocolate)',
      '1 Vela mágica de chispas doradas',
      '4 Rosas eternas preservadas en tono crema y blush',
      'Mini espátula de madera y servilletas de gala',
      'Caja con visor transparente y lazo de satén',
      'Tarjeta dedicatoria especial'
    ]
  },
  {
    id: 'bday-box-chocolates-deluxe',
    campaign: 'cumpleanos',
    name: 'Box Celebración Chocolatosa & Ferrero',
    description: 'El regalo soñado para amantes del chocolate: selección de chocolates premium (Ferrero Rocher, Vizzio, Hershey\'s), mini globo y rosas eternas.',
    price: 90.00,
    category: 'Boxes de Cumpleaños',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '1 Caja de bombones Ferrero Rocher x 8 unidades',
      '1 Paquete de almendras cubiertas de chocolate Vizzio',
      '2 Barras de chocolate Hershey\'s Cookies \'n\' Creme',
      'Mini globo metálico de corazón con número o frase',
      '3 Rosas eternas artesanales',
      'Luces LED integradas',
      'Caja rígida con confeti de estrellas doradas'
    ]
  },
  {
    id: 'bday-ramo-arcoiris',
    campaign: 'cumpleanos',
    name: 'Ramo Arcoíris de Rosas Eternas & Globito',
    description: 'Un bouquet súper alegre y juvenil con 7 rosas eternas en colores vibrantes, mariposas decorativas, luces y mini globo metalizado "Happy Birthday".',
    price: 75.00,
    category: 'Ramos Festivos',
    image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '7 Rosas eternas multicolores hechas a mano',
      'Mini globo metálico "Happy Birthday"',
      'Mariposas doradas 3D',
      'Luces LED micro-alambre',
      'Envoltura coreana impermeable rosa pastel',
      'Tarjeta personalizada con dedicatoria emotiva'
    ]
  },
  {
    id: 'bday-box-sorpresa-polaroid',
    campaign: 'cumpleanos',
    name: 'Box Sorpresa Recuerdos & Luces Polaroid',
    description: 'Caja sorpresa con tapa que al abrirse revela 4 fotos polaroid con los momentos más especiales del cumpleañero, rosas y deliciosos snacks.',
    price: 82.00,
    category: 'Boxes de Cumpleaños',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '4 Fotos polaroid impresas en alta resolución con broches de madera',
      '4 Rosas eternas artesanales de larga duración',
      '1 Bolsa de Inka Chips o snacks a elección',
      '2 Chocolates Princesa Nestlé',
      'Caja explosiva / sorpresa con detalles en foil dorado',
      'Guirnalda de luces LED de tono cálido'
    ]
  },
  {
    id: 'bday-box-brindis-cumple',
    campaign: 'cumpleanos',
    name: 'Box Brindis & Cumpleaños de Lujo',
    description: 'Para brindar por una vuelta más al sol: botella de espumante Riccadonna, copa de cristal personalizada, caja de bombones y flores de gala.',
    price: 115.00,
    original_price: 130.00,
    category: 'Tortas & Dulces',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
    items_included: [
      '1 Botella de espumante Riccadonna Ruby o Asti 200ml',
      '1 Copa flauta de cristal con grabado "Feliz Cumpleaños"',
      '1 Caja de chocolates finos surtidos',
      'Rosas eternas decorativas con follaje fino',
      'Vela chispeante de cumpleaños',
      'Caja cofre rígida con tapa de imán y lazo'
    ]
  },
  // ==========================================
  // CAMPAÑA 5: COLECCIÓN NAVIDAD & NOCHEBUENA
  // ==========================================
  {
    id: 'advi2026calend',
    campaign: 'navidad',
    name: 'Calendario de Adviento 2026 • 12 Días 14 Sorpresas',
    description: 'Edición limitada 2026: Caja interactiva de doble puerta con 12 compartimentos y 14 sorpresas exclusivas. Cada día descubre un detalle mágico para llenar tu Navidad de ilusión y alegría.',
    price: 120.00,
    original_price: 140.00,
    category: 'Calendario de Adviento',
    image: '/products/calendario-de-adviento-2026.webp',
    catalog_card: '/products/calendario-de-adviento-2026.webp',
    in_stock: true,
    order: 1,
    items_included: [
      'Caja interactiva de doble puerta con diseño navideño exclusivo en tonos lila y dorado',
      '12 Compartimentos mágicos numerados del 1 al 12',
      '14 Sorpresas y detalles exclusivos en su interior',
      'Mensajes inspiradores y dedicatorias en cada puertecita',
      'Acabados de gala con foil brillante y lazo satinado',
      'Ideal para regalar a esa persona especial o como autorregalo navideño',
      'Edición limitada oficial Venezzia Detalles 2026'
    ]
  },
  {
    id: 'navi001boxnoche',
    is_active: false,
    campaign: 'navidad',
    name: 'Box Navideño Nochebuena con Luces LED & Rosas Eternas',
    description: 'Caja festiva con rosas rojas eternas, follaje de pino navideño, luces LED cálidas integradas y tarjeta dedicatoria.',
    price: 85.00,
    original_price: 100.00,
    category: 'Boxes Navideños',
    image: '/products/box-pinguino-lucifer_centered.webp',
    in_stock: true,
    items_included: [
      'Caja de regalo navideña con acabados dorados',
      'Rosas eternas rojas de larga duración',
      'Luces micro LED tono cálido integradas',
      'Follaje navideño con piñas de pino naturales',
      'Tarjeta de felicitación navideña personalizada'
    ]
  },
  {
    id: 'navi002ramorosas',
    is_active: false,
    campaign: 'navidad',
    name: 'Ramo Nochebuena Radiante de Rosas Eternas',
    description: 'Ramo de gala con rosas rojas y detalles dorados en envoltura navideña de alta calidad con lazo de satén.',
    price: 75.00,
    original_price: 90.00,
    category: 'Ramos con Rosas',
    image: '/products/ramo_premium_lotso_centered.webp',
    in_stock: true,
    items_included: [
      'Rosas rojas eternas seleccionadas',
      'Topper con mensaje de Feliz Navidad en foil dorado',
      'Papel coreano premium en tonos festivos',
      'Lazo de cinta de satén con filo dorado',
      'Tarjeta personalizada para dedicatoria'
    ]
  },
  {
    id: 'navi003boxchocol',
    is_active: false,
    campaign: 'navidad',
    name: 'Box Dulce Navidad con Bombones Ferrero & Rosas',
    description: 'Elegante box navideño que incluye caja de bombones Ferrero Rocher, rosas eternas rojas y luces mágicas.',
    price: 95.00,
    original_price: 110.00,
    category: 'Boxes Navideños',
    image: '/products/box_osita_dormilona_centered.webp',
    in_stock: true,
    items_included: [
      'Caja cofre de lujo con acabado navideño',
      '1 Caja de bombones Ferrero Rocher x8',
      'Rosas eternas preservadas con acentos dorados',
      'Guirnalda de luces LED mágicas',
      'Tarjeta de dedicatoria personalizada'
    ]
  },
  {
    id: 'navi004ramonieve',
    is_active: false,
    campaign: 'navidad',
    name: 'Ramo Nieve Mágica & Topper Navideño con Luces',
    description: 'Ramo temático en tonos blanco nieve y rojo rubí con mini luces LED y detalles de follaje invernal.',
    price: 80.00,
    original_price: 95.00,
    category: 'Ramos con Rosas',
    image: '/products/ramo-pinguino-hotwheels_centered.webp',
    in_stock: true,
    items_included: [
      'Rosas eternas bicolor rojas y blancas',
      'Micro luces LED decorativas con pilas incluidas',
      'Topper de Feliz Navidad brillante',
      'Envoltura satinada con detalles brillantes',
      'Tarjeta con dedicatoria impresa'
    ]
  },
  {
    id: 'navi005boxbrindi',
    is_active: false,
    campaign: 'navidad',
    name: 'Box Estrella Navideña Deluxe con Mini Espumante',
    description: 'Exclusivo box para brindar en Nochebuena: botella de espumante Riccadonna, copa, bombones y rosas eternas.',
    price: 115.00,
    original_price: 130.00,
    category: 'Boxes Navideños',
    image: '/products/box-premium-oro-18k_centered.webp',
    in_stock: true,
    items_included: [
      'Botella de espumante Riccadonna 200ml',
      'Copa con lazo navideño decorativo',
      'Bombones finos seleccionados',
      'Rosas eternas y piñas navideñas',
      'Caja rígida con visor y luces LED'
    ]
  },
  {
    id: 'navi006peluchen',
    is_active: false,
    campaign: 'navidad',
    name: 'Ramo Festivo con Peluche Navideño & Rosas Eternas',
    description: 'Tierno detalle navideño con peluche temático de felpa suave, rosas eternas rojas y luces cálidas.',
    price: 88.00,
    original_price: 105.00,
    category: 'Ramos con Rosas',
    image: '/products/ramo_3_kitty_centered.webp',
    in_stock: true,
    items_included: [
      'Peluche suave con gorrito navideño',
      'Rosas eternas rojas aterciopeladas',
      'Envoltura festiva con moño de gala',
      'Luces cálidas LED',
      'Tarjeta de dedicatoria navideña'
    ]
  }
];

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

export function resolveProductImage(record, client = pb) {
  // 1. Highest Priority: PocketBase User Uploaded File
  // When a user uploads a new image in PocketBase, record.image contains the uploaded filename (e.g. 'ramo_123.webp')
  if (record?.image && client?.files?.getURL && !record.image.startsWith('http://') && !record.image.startsWith('https://') && !record.image.startsWith('/')) {
    const isWebP = (record.image || '').toLowerCase().endsWith('.webp')
    let url = isWebP
      ? client.files.getURL(record, record.image)
      : client.files.getURL(record, record.image, { thumb: '800x0' })
    if (record.updated) {
      const sep = url.includes('?') ? '&' : '?'
      url += `${sep}v=${new Date(record.updated).getTime()}`
    }
    return url
  }

  // 2. Direct external URL (e.g. Unsplash) or direct public path (/products/...)
  if (record?.image && (record.image.startsWith('http://') || record.image.startsWith('https://') || record.image.startsWith('/products/'))) {
    return record.image
  }

  // 3. Fallback to optimized catalog assets if user hasn't uploaded a replacement in PocketBase yet
  if (record?.id && PRODUCT_OPTIMIZED_ASSETS[record.id]) {
    return PRODUCT_OPTIMIZED_ASSETS[record.id]
  }

  // 4. Name-based match for catalog products
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

  // Navidad names
  if (norm.includes('adviento') || norm.includes('calendario')) return '/products/calendario-de-adviento-2026.webp'
  if (norm.includes('nochebuena') || norm.includes('navideño') || norm.includes('navidad') || norm.includes('nieve')) {
    if (norm.includes('box') || norm.includes('caja')) return '/products/box-pinguino-lucifer_centered.webp'
    return '/products/ramo-nochebuena-rosas_centered.webp'
  }

  return '/products/box_basico_centered.webp'
}

export function parseItemsIncluded(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map(s => String(s).trim()).filter(Boolean)
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return []

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map(s => String(s).trim()).filter(Boolean)
        }
      } catch (e) {
        // Fallback to line splitting
      }
    }

    const lines = trimmed
      .split(/\r?\n|•|;/)
      .map(s => s.trim().replace(/^[-*•\d+.)]\s*/, '').trim())
      .filter(Boolean)

    if (lines.length > 0) return lines

    return trimmed
      .split(',')
      .map(s => s.trim().replace(/^[-*•\d+.)]\s*/, '').trim())
      .filter(Boolean)
  }
  return []
}

export async function fetchProducts() {
  const mapRecord = (record, client) => {
    let catalogCardUrl = record.catalog_card || ''
    if (catalogCardUrl && client?.files?.getURL && !catalogCardUrl.startsWith('http://') && !catalogCardUrl.startsWith('https://') && !catalogCardUrl.startsWith('/')) {
      const isCardWebP = (catalogCardUrl || '').toLowerCase().endsWith('.webp')
      catalogCardUrl = isCardWebP
        ? client.files.getURL(record, catalogCardUrl)
        : client.files.getURL(record, catalogCardUrl, { thumb: '800x0' })
      if (record.updated) {
        const sep = catalogCardUrl.includes('?') ? '&' : '?'
        catalogCardUrl += `${sep}v=${new Date(record.updated).getTime()}`
      }
    }
    return {
      id: record.id,
      campaign: record.campaign || 'maquillaje',
      name: record.name,
      description: record.description,
      price: record.price,
      original_price: record.compare_at_price || record.original_price,
      category: record.category || 'General',
      image: resolveProductImage(record, client),
      catalog_card: catalogCardUrl,
      in_stock: record.in_stock !== false,
      is_active: record.is_active !== false,
      items_included: parseItemsIncluded(record.items_included),
      live_discount: record.live_discount !== undefined && record.live_discount !== null && record.live_discount !== '' ? Number(record.live_discount) : null,
      order: record.order !== undefined && record.order !== null ? Number(record.order) : 0,
      created: record.created || ''
    }
  }

  let liveProducts = null

  try {
    const records = await pb.collection('products').getFullList({


    })

    if (records && records.length > 0) {
      liveProducts = records.map(r => mapRecord(r, pb))
    }
  } catch (err) {
    // continue to remote check
  }

  // If local pb had 0 records or failed, try live remote PocketBase
  if (!liveProducts || liveProducts.length === 0) {
    try {
      const remotePb = new PocketBase('https://admin.venezzia.shop')
      const remoteRecords = await remotePb.collection('products').getFullList({
  
  
      })
      if (remoteRecords && remoteRecords.length > 0) {
        liveProducts = remoteRecords.map(r => mapRecord(r, remotePb))
      }
    } catch (remoteErr) {
      // continue to mock fallback
    }
  }

  if (liveProducts && liveProducts.length > 0) {
    // Filtrar solo productos activos (visibles) para los clientes en la tienda pública
    const publicProducts = liveProducts.filter(p => p.is_active !== false)

    publicProducts.sort((a, b) => {
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

    // Merge any campaigns that don't have records in PocketBase yet from MOCK_PRODUCTS (only active ones)
    const campaignsInLive = new Set(publicProducts.map(p => p.campaign || 'maquillaje'))
    const missingCampaignMocks = MOCK_PRODUCTS.filter(p => p.is_active !== false && !campaignsInLive.has(p.campaign))
    return [...publicProducts, ...missingCampaignMocks]
  }

  return MOCK_PRODUCTS.filter(p => p.is_active !== false)
}


/**
 * Escucha cambios en tiempo real (SSE) en PocketBase.
 * Cuando alguien edita, añade o borra un producto, campaña o configuración,
 * se ejecutan los callbacks proporcionados sin necesidad de recargar la página.
 */
export function subscribeToRealtime({ onProductsChange, onCampaignsChange, onSettingsChange } = {}) {
  const clients = [pb]
  if (POCKETBASE_URL !== 'https://admin.venezzia.shop') {
    try {
      clients.push(new PocketBase('https://admin.venezzia.shop'))
    } catch (_) {}
  }

  const cleanups = []

  for (const client of clients) {
    try {
      if (onProductsChange) {
        client.collection('products').subscribe('*', (e) => {
          onProductsChange(e)
        }).then(unsub => cleanups.push(unsub)).catch(err => {
          console.warn('[PB Realtime] Products subscription warning:', err?.message || err)
        })
      }

      if (onCampaignsChange) {
        client.collection('campaigns').subscribe('*', (e) => {
          onCampaignsChange(e)
        }).then(unsub => cleanups.push(unsub)).catch(err => {
          console.warn('[PB Realtime] Campaigns subscription warning:', err?.message || err)
        })
      }

      if (onSettingsChange) {
        client.collection('site_settings').subscribe('*', (e) => {
          onSettingsChange(e)
        }).then(unsub => cleanups.push(unsub)).catch(err => {
          console.warn('[PB Realtime] Settings subscription warning:', err?.message || err)
        })
      }
    } catch (err) {
      console.warn('[PB Realtime] Setup error:', err?.message || err)
    }
  }

  return () => {
    cleanups.forEach(fn => {
      try {
        if (typeof fn === 'function') fn()
      } catch (_) {}
    })
    for (const client of clients) {
      try {
        client.collection('products').unsubscribe('*').catch(() => {})
        client.collection('campaigns').unsubscribe('*').catch(() => {})
        client.collection('site_settings').unsubscribe('*').catch(() => {})
      } catch (_) {}
    }
  }
}
