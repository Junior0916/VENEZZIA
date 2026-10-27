import PocketBase from 'pocketbase'

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'

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
    image: '/products/box_basico_centered.jpg',
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
    image: '/products/box_osita_dormilona_centered.jpg',
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
    image: '/products/box_kitty_premium_centered.jpg',
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
    image: '/products/ramo_basico_centered.jpg',
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
    image: '/products/ramo_1_chanchita_centered.jpg',
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
    image: '/products/ramo_2_ovejita_centered.jpg',
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
    image: '/products/ramo_3_kitty_centered.jpg',
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
    image: '/products/ramo_premium_lotso_centered.jpg',
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
    image: '/products/hotwheels-personalizado_centered.jpg',
    catalog_card: '/products/hotwheels-personalizado_card.jpg',
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
    image: '/products/ramo-hotwheels-1_centered.jpg',
    catalog_card: '/products/ramo-hotwheels-1_card.jpg',
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
    image: '/products/ramo-hotwheels-2_centered.jpg',
    catalog_card: '/products/ramo-hotwheels-2_card.jpg',
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
    image: '/products/ramo-hotwheels-3_centered.jpg',
    catalog_card: '/products/ramo-hotwheels-3_card.jpg',
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
    image: '/products/box-basico-hotwheels_centered.jpg',
    catalog_card: '/products/box-basico-hotwheels_card.jpg',
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
    image: '/products/box-cuadro-hotwheels_centered.jpg',
    catalog_card: '/products/box-cuadro-hotwheels_card.jpg',
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
    image: '/products/box-personalizado-snacks_centered.jpg',
    catalog_card: '/products/box-personalizado-snacks_card.jpg',
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
    image: '/products/box-personalizado-club_centered.jpg',
    catalog_card: '/products/box-personalizado-club_card.jpg',
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
    image: '/products/box-toretto-fast-furious_centered.jpg',
    catalog_card: '/products/box-toretto-fast-furious_card.jpg',
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
    image: '/products/box-premium-oro-18k_centered.jpg',
    catalog_card: '/products/box-premium-oro-18k_card.jpg',
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
    image: '/products/ramo-stitch-hotwheels_centered.jpg',
    catalog_card: '/products/ramo-stitch-hotwheels_card.jpg',
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
    image: '/products/ramo-clubes-futbol_centered.jpg',
    catalog_card: '/products/ramo-clubes-futbol_card.jpg',
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
    image: '/products/ramo-spiderman-hotwheels_centered.jpg',
    catalog_card: '/products/ramo-spiderman-hotwheels_card.jpg',
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
    image: '/products/box-superheroes-pilsen_centered.jpg',
    catalog_card: '/products/box-superheroes-pilsen_card.jpg',
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
    image: '/products/box-pinguino-lucifer_centered.jpg',
    catalog_card: '/products/box-pinguino-lucifer_card.jpg',
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

export async function fetchProducts() {
  try {
    const records = await pb.collection('products').getFullList({
      sort: '-created',
      filter: 'in_stock = true'
    })

    if (records.length === 0) {
      return MOCK_PRODUCTS
    }

    return records.map(record => ({
      id: record.id,
      campaign: record.campaign || 'maquillaje',
      name: record.name,
      description: record.description,
      price: record.price,
      original_price: record.original_price,
      category: record.category || 'General',
      image: record.image 
        ? pb.files.getURL(record, record.image) 
        : '/products/box_basico_centered.jpg',
      catalog_card: record.catalog_card,
      in_stock: record.in_stock,
      items_included: record.items_included || []
    }))
  } catch (err) {
    return MOCK_PRODUCTS
  }
}
