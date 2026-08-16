import pg from 'pg';

const { Client } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.vwemuftnfslqejaahkvd:sqdIrWgKVn21@aws-0-sa-east-1.pooler.supabase.com:5432/postgres';

const mockCities = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'São Roque',
    slug: 'sao-roque',
    state: 'São Paulo',
    uf: 'SP',
    description: 'A Terra do Vinho e da Gastronomia artesanal. Famosa pelo Roteiro do Vinho, ateliês cerâmicos, marcenaria rústica e doces típicos.',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85',
    latitude: -23.5325,
    longitude: -47.1353,
    isActive: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Embu das Artes',
    slug: 'embu-das-artes',
    state: 'São Paulo',
    uf: 'SP',
    description: 'O maior polo artístico e de feiras artesanais da Grande São Paulo.',
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=2000&q=85',
    latitude: -23.6489,
    longitude: -46.8522,
    isActive: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Campos do Jordão',
    slug: 'campos-do-jordao',
    state: 'São Paulo',
    uf: 'SP',
    description: 'A Suíça Brasileira, conhecida pelos chocolates artesanais e malharias.',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85',
    latitude: -22.7394,
    longitude: -45.5913,
    isActive: true,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Holambra',
    slug: 'holambra',
    state: 'São Paulo',
    uf: 'SP',
    description: 'A Cidade das Flores, tradição holandesa e cerâmica artística.',
    coverImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=2000&q=85',
    latitude: -22.6322,
    longitude: -47.0544,
    isActive: true,
  },
];

const mockCategories = [
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Cerâmica & Barro', slug: 'ceramica', icon: 'Sparkles', imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80', description: 'Vasos em torno, travessas em grés, azulejos e utilitários moldados à mão.', sortOrder: 1 },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Marcenaria & Madeira', slug: 'madeira', icon: 'Hammer', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', description: 'Tábuas de corte com madeiras nobres, esculturas rústicas e mobiliário autoral.', sortOrder: 2 },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Bordados & Tecelagem', slug: 'tecelagem', icon: 'Scissors', imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80', description: 'Bordados à mão, caminhos de mesa, mantas de tear e rendas regionais.', sortOrder: 3 },
  { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', name: 'Doces, Queijos & Sabores', slug: 'gastronomia', icon: 'Utensils', imageUrl: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=800&q=80', description: 'Geleias artesanais, queijos maturados, licores e doces de tacho típicos de São Roque.', sortOrder: 4 },
  { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Vinhos & Licores Artesanais', slug: 'vinhos', icon: 'Wine', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80', description: 'Vinhos de colheita de inverno, frisantes e licores produzidos no Roteiro do Vinho.', sortOrder: 5 },
  { id: 'ffffffff-ffff-ffff-ffff-ffffffffffff', name: 'Velas & Aromas Botânicos', slug: 'velas', icon: 'Flame', imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80', description: 'Velas de cera vegetal, essências de lavanda, difusores e saboaria natural.', sortOrder: 6 },
];

const mockArtisans = [
  {
    id: 'aaaaaaaa-1111-2222-3333-111111111111',
    fullName: 'Mestre Cláudio Fontana',
    email: 'claudio@ceramicadaterra.com.br',
    phone: '(11) 99876-1234',
    bio: 'Mais de 30 anos moldando argila vermelha e cinzas de poda de parreiras em São Roque.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    verified: true,
    foundingMember: true,
    status: 'APPROVED',
    onboardingSource: 'SELF_SERVICE',
    invitationStatus: 'ACCEPTED',
  },
  {
    id: 'aaaaaaaa-1111-2222-3333-222222222222',
    fullName: 'Roberto Silveira',
    email: 'roberto@madeiraevinho.com.br',
    phone: '(11) 98765-4321',
    bio: 'Marceneiro autoral especialista em tábuas de corte com madeiras de poda e barris recuperados.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    verified: true,
    foundingMember: true,
    status: 'APPROVED',
    onboardingSource: 'ADMIN_ASSISTED',
    invitationStatus: 'ACCEPTED',
  },
  {
    id: 'aaaaaaaa-1111-2222-3333-333333333333',
    fullName: 'Dona Helena Ramos',
    email: 'helena@bordadosdaserra.com.br',
    phone: '(11) 97654-3210',
    bio: 'Bordadeira de mão cheia com mais de 40 anos dedicados ao ponto cruz e crivo fino.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    verified: true,
    foundingMember: true,
    status: 'APPROVED',
    onboardingSource: 'SELF_SERVICE',
    invitationStatus: 'ACCEPTED',
  },
  {
    id: 'aaaaaaaa-1111-2222-3333-444444444444',
    fullName: 'Família Giordani',
    email: 'contato@vinhosgiordani.com.br',
    phone: '(11) 96543-2109',
    bio: '3ª geração de viticultores artesanais no Roteiro do Vinho de São Roque.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    verified: true,
    foundingMember: true,
    status: 'APPROVED',
    onboardingSource: 'PARTNER',
    invitationStatus: 'ACCEPTED',
  },
];

const mockStores = [
  {
    id: '11111111-2222-3333-4444-111111111111',
    artisanId: 'aaaaaaaa-1111-2222-3333-111111111111',
    cityId: '11111111-1111-1111-1111-111111111111',
    categoryId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Cerâmica da Terra São Roque',
    slug: 'ceramica-da-terra-sao-roque',
    artisanName: 'Mestre Cláudio Fontana',
    bio: 'Peças em grés de alta temperatura e esmaltes formulados com cinzas locais.',
    story: 'O ateliê nasceu há mais de 30 anos no Roteiro do Vinho de São Roque.',
    processDescription: 'Utilizamos argila pura moldada em torno elétrico e manual.',
    logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=80',
    whatsapp: '11998761234',
    instagram: '@ceramicadaterrasr',
    address: 'Estrada do Vinho, km 4,5',
    neighborhood: 'Roteiro do Vinho',
    latitude: -23.5385,
    longitude: -47.1412,
    openingHours: 'Terça a Domingo, das 9h às 18h',
    verified: true,
    foundingMember: true,
    status: 'APPROVED',
    planType: 'PRO',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 28,
    whatsappClicksCount: 142,
    viewsCount: 1250,
  },
  {
    id: '11111111-2222-3333-4444-222222222222',
    artisanId: 'aaaaaaaa-1111-2222-3333-222222222222',
    cityId: '11111111-1111-1111-1111-111111111111',
    categoryId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Ateliê Madeira & Vinho',
    slug: 'atelie-madeira-e-vinho',
    artisanName: 'Roberto Silveira',
    bio: 'Design em madeira nobre reaproveitada de podas e antigos tonéis de vinho.',
    story: 'Transformamos madeiras esquecidas em peças de arte rústica para gastronomia.',
    processDescription: 'Corte, aparelhamento, tratamento natural com óleo mineral e cera de abelha.',
    logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    whatsapp: '11987654321',
    instagram: '@madeiraevinho.sr',
    address: 'Estrada do Vinho, km 7',
    neighborhood: 'Roteiro do Vinho',
    latitude: -23.545,
    longitude: -47.148,
    openingHours: 'Quarta a Domingo, das 10h às 17h30',
    verified: true,
    foundingMember: true,
    status: 'APPROVED',
    planType: 'PRO',
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 19,
    whatsappClicksCount: 98,
    viewsCount: 890,
  },
  {
    id: '11111111-2222-3333-4444-333333333333',
    artisanId: 'aaaaaaaa-1111-2222-3333-333333333333',
    cityId: '11111111-1111-1111-1111-111111111111',
    categoryId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: 'Bordados da Serra',
    slug: 'bordados-da-serra',
    artisanName: 'Dona Helena Ramos',
    bio: 'Bordados manuais, caminhos de mesa e peças que contam causos do interior.',
    story: 'Helena aprendeu a bordar com sua avó e hoje lidera um grupo de 8 bordadeiras em São Roque.',
    processDescription: 'Linho puro, algodão cru e fios tingidos artesanalmente com casca de cebola e eucalipto.',
    logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1600&q=80',
    whatsapp: '11976543210',
    instagram: '@bordadosdaserra.sr',
    address: 'Rua das Flores, 120',
    neighborhood: 'Centro Histórico',
    latitude: -23.531,
    longitude: -47.133,
    openingHours: 'Segunda a Sábado, das 9h às 18h',
    verified: true,
    foundingMember: true,
    status: 'APPROVED',
    planType: 'FREE',
    isFeatured: false,
    rating: 5.0,
    reviewsCount: 15,
    whatsappClicksCount: 76,
    viewsCount: 620,
  },
  {
    id: '11111111-2222-3333-4444-444444444444',
    artisanId: 'aaaaaaaa-1111-2222-3333-444444444444',
    cityId: '11111111-1111-1111-1111-111111111111',
    categoryId: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    name: 'Vinhos & Licores Família Giordani',
    slug: 'vinhos-e-licores-familia-giordani',
    artisanName: 'Família Giordani',
    bio: 'Vinhos artesanais de pequenas tiragens, frisantes naturais e licores botânicos.',
    story: 'Tradição italiana trazida em 1912 para as colinas de São Roque.',
    processDescription: 'Colheita manual de uvas selecionadas e fermentação lenta em barris de carvalho.',
    logoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80',
    whatsapp: '11965432109',
    instagram: '@vinhosgiordani',
    address: 'Estrada do Vinho, km 2,8',
    neighborhood: 'Roteiro do Vinho',
    latitude: -23.535,
    longitude: -47.138,
    openingHours: 'Todos os dias, das 9h às 18h',
    verified: true,
    foundingMember: true,
    status: 'APPROVED',
    planType: 'PRO',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 42,
    whatsappClicksCount: 210,
    viewsCount: 1890,
  },
];

const mockProducts = [
  {
    id: 'bbbbbbbb-1111-2222-3333-111111111111',
    storeId: '11111111-2222-3333-4444-111111111111',
    cityId: '11111111-1111-1111-1111-111111111111',
    categoryId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Vaso Terracota Orgânico São Roque',
    slug: 'vaso-terracota-organico-sao-roque',
    description: 'Vaso decorativo moldado manualmente no torno elétrico com queima em alta temperatura (1240°C). Acabamento rústico com textura agradável ao toque.',
    price: 145.0,
    promoPrice: 120.0,
    isPromo: true,
    materials: ['Argila vermelha local', 'Esmalte mineral acetinado'],
    dimensions: '22cm altura x 14cm diâmetro',
    isFeatured: true,
    isAvailable: true,
    stockQuantity: 8,
    status: 'APPROVED',
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
    viewsCount: 480,
    whatsappClicksCount: 38,
    favoritesCount: 22,
  },
  {
    id: 'bbbbbbbb-1111-2222-3333-222222222222',
    storeId: '11111111-2222-3333-4444-111111111111',
    cityId: '11111111-1111-1111-1111-111111111111',
    categoryId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Conjunto de Xícaras Esmaltadas Café da Tarde',
    slug: 'conjunto-xicaras-esmaltadas-cafe',
    description: 'Dupla de xícaras de café em cerâmica artesanal com pires rústico. Mantém a temperatura da bebida por mais tempo.',
    price: 89.0,
    promoPrice: null,
    isPromo: false,
    materials: ['Grés', 'Esmalte verde botânico'],
    dimensions: '180ml cada xícara',
    isFeatured: false,
    isAvailable: true,
    stockQuantity: 12,
    status: 'APPROVED',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
    viewsCount: 310,
    whatsappClicksCount: 24,
    favoritesCount: 15,
  },
  {
    id: 'bbbbbbbb-1111-2222-3333-333333333333',
    storeId: '11111111-2222-3333-4444-222222222222',
    cityId: '11111111-1111-1111-1111-111111111111',
    categoryId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Tábua Gourmet em Madeira Nobre Rústica',
    slug: 'tabua-gourmet-madeira-nobre-rustica',
    description: 'Tábua para frios, queijos e carnes produzida a partir de podas sustentáveis de jequitibá e peroba. Tratada com cera de abelha e óleo atóxico.',
    price: 185.0,
    promoPrice: 159.0,
    isPromo: true,
    materials: ['Jequitibá Rosa', 'Cera de abelha natural'],
    dimensions: '45cm x 26cm x 3.5cm',
    isFeatured: true,
    isAvailable: true,
    stockQuantity: 5,
    status: 'APPROVED',
    images: ['https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80',
    viewsCount: 520,
    whatsappClicksCount: 45,
    favoritesCount: 34,
  },
  {
    id: 'bbbbbbbb-1111-2222-3333-444444444444',
    storeId: '11111111-2222-3333-4444-444444444444',
    cityId: '11111111-1111-1111-1111-111111111111',
    categoryId: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    name: 'Vinho Tinto Artesanal Reserva de Inverno',
    slug: 'vinho-tinto-artesanal-reserva-inverno',
    description: 'Vinho Syrah de dupla poda colheita de inverno. Encorpado, notas de amoras silvestres e estágio de 8 meses em carvalho francês.',
    price: 95.0,
    promoPrice: 85.0,
    isPromo: true,
    materials: ['Uvas Syrah 100%', 'Fermentação natural'],
    dimensions: 'Garrafa 750ml',
    isFeatured: true,
    isAvailable: true,
    stockQuantity: 24,
    status: 'APPROVED',
    images: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
    viewsCount: 780,
    whatsappClicksCount: 82,
    favoritesCount: 58,
  },
];

async function seed() {
  console.log('🌱 Seeding production data on Supabase...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log(' Connected to DB.');

    // 1. Cities
    console.log('Seeding cities...');
    for (const c of mockCities) {
      await client.query(
        `INSERT INTO public.cities (id, name, slug, state, uf, description, cover_image, banner_image, latitude, longitude, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;`,
        [c.id, c.name, c.slug, c.state, c.uf, c.description, c.coverImage, c.bannerImage, c.latitude, c.longitude, c.isActive]
      );
    }
    console.log(' Cities seeded!');

    // 2. Categories
    console.log('Seeding categories...');
    for (const cat of mockCategories) {
      await client.query(
        `INSERT INTO public.categories (id, name, slug, icon, image_url, description, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;`,
        [cat.id, cat.name, cat.slug, cat.icon, cat.imageUrl, cat.description, cat.sortOrder, true]
      );
    }
    console.log(' Categories seeded!');

    // 3. Artisans
    console.log('Seeding artisans...');
    for (const a of mockArtisans) {
      await client.query(
        `INSERT INTO public.artisans (id, full_name, phone, email, bio, avatar_url, verified, founding_member, status, onboarding_source, invitation_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, status = EXCLUDED.status;`,
        [a.id, a.fullName, a.phone, a.email, a.bio, a.avatarUrl, a.verified, a.foundingMember, a.status, a.onboardingSource, a.invitationStatus]
      );
    }
    console.log(' Artisans seeded!');

    // 4. Stores
    console.log('Seeding stores...');
    for (const s of mockStores) {
      await client.query(
        `INSERT INTO public.stores (
           id, artisan_id, city_id, category_id, name, slug, artisan_name, bio, story,
           process_description, logo_url, cover_url, whatsapp, instagram, address,
           neighborhood, latitude, longitude, opening_hours, verified, founding_member,
           status, plan_type, is_featured, rating, reviews_count,
           whatsapp_clicks_count, views_count
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, is_featured = EXCLUDED.is_featured, status = EXCLUDED.status;`,
        [
          s.id, s.artisanId, s.cityId, s.categoryId, s.name, s.slug, s.artisanName, s.bio, s.story,
          s.processDescription, s.logoUrl, s.coverUrl, s.whatsapp, s.instagram, s.address,
          s.neighborhood, s.latitude, s.longitude, s.openingHours, s.verified, s.foundingMember,
          s.status, s.planType, s.isFeatured, s.rating, s.reviewsCount,
          s.whatsappClicksCount, s.viewsCount
        ]
      );
    }
    console.log(' Stores seeded!');

    // 5. Products
    console.log('Seeding products...');
    for (const p of mockProducts) {
      await client.query(
        `INSERT INTO public.products (
           id, store_id, city_id, category_id, name, slug, description, price, promo_price,
           is_promo, materials, dimensions, is_featured, is_available, stock_quantity,
           status, images, cover_image, views_count, whatsapp_clicks_count, favorites_count
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, price = EXCLUDED.price, is_featured = EXCLUDED.is_featured;`,
        [
          p.id, p.storeId, p.cityId, p.categoryId, p.name, p.slug, p.description, p.price, p.promoPrice,
          p.isPromo, p.materials, p.dimensions, p.isFeatured, p.isAvailable, p.stockQuantity,
          p.status, p.images, p.coverImage, p.viewsCount, p.whatsappClicksCount, p.favoritesCount
        ]
      );
    }
    console.log(' Products seeded!');

    console.log('\n🎉 ALL PRODUCTION SEED DATA COMPLETED ON SUPABASE!');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
