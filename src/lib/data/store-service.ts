import {
  mockCities,
  mockCategories,
  getHydratedStores,
  getHydratedProducts,
  mockReviews,
  mockArtisans,
  mockAuditLogs,
  mockNotifications,
} from './mock-data';
import {
  City,
  Category,
  Store,
  Product,
  FilterOptions,
  Review,
  UserProfile,
  Artisan,
  ArtisanStatus,
  StoreStatus,
  ProductStatus,
  OnboardingSource,
  InvitationStatus,
  AuditLog,
  Notification,
  StoreCompleteness,
} from '@/types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vwemuftnfslqejaahkvd.supabase.co';
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZW11ZnRuZnNscWVqYWFoa3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MDg4NzYsImV4cCI6MjEwMjQ4NDg3Nn0.ro-uU8-WbZyoXpymhUPWyy8yMl7qefHMiCsPE-NXg2M';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Production Supabase Fetch Helper
async function fetchFromSupabase<T>(endpoint: string): Promise<T[] | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: 'no-store',
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}

// In-memory / dynamic multi-tenant cache & fallback state
let runtimeArtisans: Artisan[] = [...mockArtisans];
let runtimeStores: Store[] = [...getHydratedStores()];
let runtimeProducts: Product[] = [...getHydratedProducts()];
let runtimeReviews: Review[] = [...mockReviews];
let runtimeAuditLogs: AuditLog[] = [...mockAuditLogs];
let runtimeNotifications: Notification[] = [...mockNotifications];
let runtimeClicks: Array<{ storeId: string; productId?: string; date: string }> = [];

// Hydrate from localStorage on client side
if (typeof window !== 'undefined') {
  try {
    const savedStores = localStorage.getItem('descubra_artes_custom_stores');
    const savedArtisans = localStorage.getItem('descubra_artes_custom_artisans');
    const savedProds = localStorage.getItem('descubra_artes_custom_products');
    if (savedStores) {
      const parsed = JSON.parse(savedStores);
      runtimeStores = [...parsed, ...runtimeStores.filter((s) => !parsed.some((p: any) => p.id === s.id))];
    }
    if (savedArtisans) {
      const parsed = JSON.parse(savedArtisans);
      runtimeArtisans = [...parsed, ...runtimeArtisans.filter((a) => !parsed.some((p: any) => p.id === a.id))];
    }
    if (savedProds) {
      const parsed = JSON.parse(savedProds);
      runtimeProducts = [...parsed, ...runtimeProducts.filter((p) => !parsed.some((ps: any) => ps.id === p.id))];
    }
  } catch {}
}

function persistLocalCustomData() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('descubra_artes_custom_stores', JSON.stringify(runtimeStores));
      localStorage.setItem('descubra_artes_custom_artisans', JSON.stringify(runtimeArtisans));
      localStorage.setItem('descubra_artes_custom_products', JSON.stringify(runtimeProducts));
    } catch {}
  }
}

function mapDbCityToCity(db: any): City {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    state: db.state,
    uf: db.uf,
    description: db.description,
    coverImage: db.cover_image,
    bannerImage: db.banner_image,
    latitude: db.latitude,
    longitude: db.longitude,
    isActive: db.is_active ?? true,
    createdAt: db.created_at || new Date().toISOString(),
  };
}

function mapDbCategoryToCategory(db: any): Category {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    icon: db.icon,
    imageUrl: db.image_url,
    description: db.description,
    sortOrder: db.sort_order || 0,
    isActive: db.is_active ?? true,
  };
}

function mapDbStoreToStore(db: any): Store {
  const city = mockCities.find((c) => c.id === db.city_id);
  const category = mockCategories.find((c) => c.id === db.category_id);
  return {
    id: db.id,
    userId: db.user_id || db.artisan_id || 'user-1',
    artisanId: db.artisan_id,
    cityId: db.city_id,
    categoryId: db.category_id,
    name: db.name,
    slug: db.slug,
    artisanName: db.artisan_name,
    bio: db.bio,
    story: db.story,
    processDescription: db.process_description,
    logoUrl: db.logo_url,
    coverUrl: db.cover_url,
    whatsapp: db.whatsapp,
    instagram: db.instagram,
    facebook: db.facebook,
    website: db.website,
    address: db.address,
    neighborhood: db.neighborhood,
    latitude: db.latitude,
    longitude: db.longitude,
    openingHours: db.opening_hours,
    verified: db.verified,
    foundingMember: db.founding_member,
    status: db.status,
    planType: db.plan_type || 'FREE',
    isFeatured: db.is_featured,
    featuredUntil: db.featured_until,
    rating: Number(db.rating || 5.0),
    reviewsCount: db.reviews_count || 0,
    viewsCount: db.views_count || 0,
    whatsappClicksCount: db.whatsapp_clicks_count || 0,
    adminNotes: db.admin_notes,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    city,
    category,
  };
}

function mapDbProductToProduct(db: any): Product {
  const city = mockCities.find((c) => c.id === db.city_id);
  const category = mockCategories.find((c) => c.id === db.category_id);
  const store = runtimeStores.find((s) => s.id === db.store_id);
  return {
    id: db.id,
    storeId: db.store_id,
    cityId: db.city_id,
    categoryId: db.category_id,
    name: db.name,
    slug: db.slug,
    description: db.description,
    price: Number(db.price),
    promoPrice: db.promo_price ? Number(db.promo_price) : undefined,
    isPromo: db.is_promo,
    materials: db.materials || ['Artesanal'],
    dimensions: db.dimensions || '',
    isFeatured: db.is_featured,
    isAvailable: db.is_available ?? true,
    stockQuantity: db.stock_quantity || 10,
    status: db.status,
    images: db.images || [db.cover_image],
    coverImage: db.cover_image,
    viewsCount: db.views_count || 0,
    whatsappClicksCount: db.whatsapp_clicks_count || 0,
    favoritesCount: db.favorites_count || 0,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    city,
    category,
    store,
  };
}

function mapDbArtisanToArtisan(db: any): Artisan {
  return {
    id: db.id,
    userId: db.user_id,
    fullName: db.full_name,
    phone: db.phone,
    email: db.email,
    document: db.document,
    bio: db.bio,
    avatarUrl: db.avatar_url,
    verified: db.verified,
    foundingMember: db.founding_member,
    status: db.status,
    onboardingSource: db.onboarding_source,
    invitationToken: db.invitation_token,
    invitationStatus: db.invitation_status,
    invitedAt: db.invited_at,
    acceptedAt: db.accepted_at,
    adminNotes: db.admin_notes,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export const storeService = {
  // ==========================================
  // CITIES & CATEGORIES
  // ==========================================
  async getCities(): Promise<City[]> {
    const dbCities = await fetchFromSupabase<any>('cities?select=*&order=name.asc');
    if (dbCities && dbCities.length > 0) {
      return dbCities.map(mapDbCityToCity);
    }
    return mockCities.filter((c) => c.isActive);
  },

  async getCityBySlug(slug: string): Promise<City | null> {
    const dbCity = await fetchFromSupabase<any>(`cities?slug=eq.${slug.toLowerCase()}&select=*`);
    let city = dbCity && dbCity[0] ? mapDbCityToCity(dbCity[0]) : mockCities.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
    if (!city) return null;

    const storesCount = runtimeStores.filter((s) => s.cityId === city!.id && s.status === 'APPROVED').length;
    const productsCount = runtimeProducts.filter((p) => p.cityId === city!.id && p.status === 'APPROVED').length;

    return {
      ...city,
      storesCount,
      productsCount,
    };
  },

  async getCategories(): Promise<Category[]> {
    const dbCategories = await fetchFromSupabase<any>('categories?select=*&order=sort_order.asc');
    if (dbCategories && dbCategories.length > 0) {
      return dbCategories.map((c) => ({
        ...mapDbCategoryToCategory(c),
        productsCount: runtimeProducts.filter((p) => p.categoryId === c.id && p.status === 'APPROVED').length,
      }));
    }
    return mockCategories.map((cat) => ({
      ...cat,
      productsCount: runtimeProducts.filter((p) => p.categoryId === cat.id && p.status === 'APPROVED').length,
    }));
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const dbCat = await fetchFromSupabase<any>(`categories?slug=eq.${slug.toLowerCase()}&select=*`);
    const cat = dbCat && dbCat[0] ? mapDbCategoryToCategory(dbCat[0]) : mockCategories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
    if (!cat) return null;
    return {
      ...cat,
      productsCount: runtimeProducts.filter((p) => p.categoryId === cat.id && p.status === 'APPROVED').length,
    };
  },

  // ==========================================
  // STORES (PUBLIC DISCOVERY - APPROVED ONLY)
  // ==========================================
  async getStores(filters: FilterOptions = {}): Promise<Store[]> {
    const dbStores = await fetchFromSupabase<any>('stores?status=eq.APPROVED&select=*&order=created_at.desc');
    let stores = dbStores && dbStores.length > 0 ? dbStores.map(mapDbStoreToStore) : [...runtimeStores].filter((s) => s.status === 'APPROVED');

    if (filters.citySlug) {
      const city = mockCities.find((c) => c.slug === filters.citySlug);
      if (city) stores = stores.filter((s) => s.cityId === city.id);
    }

    if (filters.categorySlug) {
      const category = mockCategories.find((c) => c.slug === filters.categorySlug);
      if (category) stores = stores.filter((s) => s.categoryId === category.id);
    }

    if (filters.onlyVerified) {
      stores = stores.filter((s) => s.verified);
    }

    if (filters.onlyFeatured) {
      stores = stores.filter((s) => s.isFeatured);
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      stores = stores.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.artisanName.toLowerCase().includes(q) ||
          s.bio.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q)
      );
    }

    return stores;
  },

  async getFeaturedStores(limit: number = 6): Promise<Store[]> {
    const dbStores = await fetchFromSupabase<any>(`stores?status=eq.APPROVED&is_featured=eq.true&select=*&limit=${limit}`);
    if (dbStores && dbStores.length > 0) {
      return dbStores.map(mapDbStoreToStore);
    }
    return runtimeStores
      .filter((s) => s.status === 'APPROVED' && s.isFeatured)
      .slice(0, limit);
  },

  async getStoreBySlug(slug: string): Promise<Store | null> {
    const dbStore = await fetchFromSupabase<any>(`stores?slug=eq.${slug.toLowerCase()}&select=*`);
    if (dbStore && dbStore[0]) {
      return mapDbStoreToStore(dbStore[0]);
    }
    const store = runtimeStores.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
    return store || null;
  },

  async getStoreById(id: string): Promise<Store | null> {
    if (!id) return null;
    const dbStore = await fetchFromSupabase<any>(`stores?id=eq.${id}&select=*`);
    if (dbStore && dbStore[0]) {
      return mapDbStoreToStore(dbStore[0]);
    }
    const store = runtimeStores.find((s) => s.id === id || s.slug === id || s.userId === id || s.artisanId === id);
    return store || null;
  },

  async getStoreByEmail(email: string): Promise<Store | null> {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    // In runtime
    const artisan = runtimeArtisans.find((a) => a.email.toLowerCase() === cleanEmail);
    if (artisan) {
      const store = runtimeStores.find((s) => s.artisanId === artisan.id || s.userId === artisan.userId);
      if (store) return store;
    }
    // In Supabase
    const dbArt = await fetchFromSupabase<any>(`artisans?email=eq.${encodeURIComponent(cleanEmail)}&select=*`);
    if (dbArt && dbArt[0]) {
      const dbStore = await fetchFromSupabase<any>(`stores?artisan_id=eq.${dbArt[0].id}&select=*`);
      if (dbStore && dbStore[0]) return mapDbStoreToStore(dbStore[0]);
    }
    return null;
  },

  async getAllStoresForAdmin(): Promise<Store[]> {
    const dbStores = await fetchFromSupabase<any>('stores?select=*&order=created_at.desc');
    if (dbStores && dbStores.length > 0) {
      return dbStores.map(mapDbStoreToStore);
    }
    return [...runtimeStores];
  },

  // ==========================================
  // PRODUCTS (PUBLIC DISCOVERY - APPROVED ONLY)
  // ==========================================
  async getProducts(filters: FilterOptions = {}): Promise<Product[]> {
    const dbProducts = await fetchFromSupabase<any>('products?status=eq.APPROVED&select=*&order=created_at.desc');
    let products = dbProducts && dbProducts.length > 0 ? dbProducts.map(mapDbProductToProduct) : [...runtimeProducts].filter((p) => p.status === 'APPROVED');

    if (filters.citySlug) {
      const city = mockCities.find((c) => c.slug === filters.citySlug);
      if (city) products = products.filter((p) => p.cityId === city.id);
    }

    if (filters.categorySlug) {
      const category = mockCategories.find((c) => c.slug === filters.categorySlug);
      if (category) products = products.filter((p) => p.categoryId === category.id);
    }

    if (filters.onlyPromotions) {
      products = products.filter((p) => p.isPromo);
    }

    if (filters.onlyFeatured) {
      products = products.filter((p) => p.isFeatured);
    }

    if (filters.minPrice !== undefined) {
      products = products.filter((p) => (p.isPromo && p.promoPrice ? p.promoPrice : p.price) >= (filters.minPrice || 0));
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => (p.isPromo && p.promoPrice ? p.promoPrice : p.price) <= (filters.maxPrice || 999999));
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.materials?.some((m) => m.toLowerCase().includes(q))
      );
    }

    if (filters.sortBy === 'price-asc') {
      products.sort((a, b) => (a.isPromo && a.promoPrice ? a.promoPrice : a.price) - (b.isPromo && b.promoPrice ? b.promoPrice : b.price));
    } else if (filters.sortBy === 'price-desc') {
      products.sort((a, b) => (b.isPromo && b.promoPrice ? b.promoPrice : b.price) - (a.isPromo && a.promoPrice ? a.promoPrice : a.price));
    } else if (filters.sortBy === 'popular') {
      products.sort((a, b) => b.whatsappClicksCount - a.whatsappClicksCount);
    } else if (filters.sortBy === 'newest') {
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return products;
  },

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const dbProds = await fetchFromSupabase<any>(`products?status=eq.APPROVED&is_featured=eq.true&select=*&limit=${limit}`);
    if (dbProds && dbProds.length > 0) {
      return dbProds.map(mapDbProductToProduct);
    }
    return runtimeProducts
      .filter((p) => p.status === 'APPROVED' && p.isFeatured)
      .slice(0, limit);
  },

  async getPromotionProducts(limit: number = 8): Promise<Product[]> {
    const dbProds = await fetchFromSupabase<any>(`products?status=eq.APPROVED&is_promo=eq.true&select=*&limit=${limit}`);
    if (dbProds && dbProds.length > 0) {
      return dbProds.map(mapDbProductToProduct);
    }
    return runtimeProducts
      .filter((p) => p.status === 'APPROVED' && p.isPromo)
      .slice(0, limit);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const dbProd = await fetchFromSupabase<any>(`products?slug=eq.${slug.toLowerCase()}&select=*`);
    if (dbProd && dbProd[0]) {
      return mapDbProductToProduct(dbProd[0]);
    }
    const product = runtimeProducts.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    return product || null;
  },

  async getProductsByStoreId(storeId: string): Promise<Product[]> {
    const dbProds = await fetchFromSupabase<any>(`products?store_id=eq.${storeId}&select=*`);
    if (dbProds && dbProds.length > 0) {
      return dbProds.map(mapDbProductToProduct);
    }
    return runtimeProducts.filter((p) => p.storeId === storeId || p.store?.slug === storeId);
  },

  async getStoreProducts(storeId: string): Promise<Product[]> {
    return this.getProductsByStoreId(storeId);
  },

  async getPromoProducts(limit: number = 8): Promise<Product[]> {
    return this.getPromotionProducts(limit);
  },

  async getStoreReviews(storeId: string): Promise<Review[]> {
    return runtimeReviews.filter((r) => r.storeId === storeId);
  },

  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    const product = runtimeProducts.find((p) => p.id === productId);
    if (!product) return [];
    return runtimeProducts
      .filter((p) => p.id !== productId && (p.categoryId === product.categoryId || p.cityId === product.cityId))
      .slice(0, limit);
  },

  // ==========================================
  // ARTISANS & MULTI-ACCOUNTS (ADMIN & PANEL)
  // ==========================================
  async getAllArtisans(filters: {
    status?: ArtisanStatus | 'ALL';
    source?: OnboardingSource | 'ALL';
    cityId?: string;
    query?: string;
  } = {}): Promise<Artisan[]> {
    const dbArtisans = await fetchFromSupabase<any>('artisans?select=*&order=created_at.desc');
    let list = dbArtisans && dbArtisans.length > 0 ? dbArtisans.map(mapDbArtisanToArtisan) : [...runtimeArtisans];

    if (filters.status && filters.status !== 'ALL') {
      list = list.filter((a) => a.status === filters.status);
    }

    if (filters.source && filters.source !== 'ALL') {
      list = list.filter((a) => a.onboardingSource === filters.source);
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.phone.includes(q)
      );
    }

    // Hydrate stores
    return list.map((artisan) => {
      const stores = runtimeStores.filter((s) => s.artisanId === artisan.id || s.userId === artisan.userId);
      return {
        ...artisan,
        stores,
      };
    });
  },

  async getArtisanById(id: string): Promise<Artisan | null> {
    const dbArt = await fetchFromSupabase<any>(`artisans?id=eq.${id}&select=*`);
    let artisan = dbArt && dbArt[0] ? mapDbArtisanToArtisan(dbArt[0]) : runtimeArtisans.find((a) => a.id === id);
    if (!artisan) return null;

    const stores = runtimeStores.filter((s) => s.artisanId === artisan!.id || s.userId === artisan!.userId);
    return {
      ...artisan,
      stores,
    };
  },

  async getArtisanByUserId(userId: string): Promise<Artisan | null> {
    const artisan = runtimeArtisans.find((a) => a.userId === userId);
    if (!artisan) return null;
    const stores = runtimeStores.filter((s) => s.artisanId === artisan.id || s.userId === artisan.userId);
    return { ...artisan, stores };
  },

  // ==========================================
  // ONBOARDING (SELF-SERVICE)
  // ==========================================
  async createArtisanSelfService(payload: {
    fullName: string;
    email: string;
    phone: string;
    storeName: string;
    description: string;
    story?: string;
    cityId: string;
    categoryId: string;
    whatsapp: string;
    instagram?: string;
    address: string;
    neighborhood?: string;
    logoUrl?: string;
    coverUrl?: string;
    products: Array<{
      name: string;
      description: string;
      price: number;
      promoPrice?: number;
      materials?: string[];
      dimensions?: string;
      images?: string[];
    }>;
  }): Promise<{ artisan: Artisan; store: Store }> {
    const artisanId = generateUUID();
    const storeId = generateUUID();
    const userId = generateUUID();

    const newArtisan: Artisan = {
      id: artisanId,
      userId,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      bio: payload.description,
      avatarUrl: payload.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      verified: false,
      foundingMember: runtimeArtisans.length < 50,
      status: 'PENDING',
      onboardingSource: 'SELF_SERVICE',
      invitationStatus: 'NOT_SENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const storeSlug = payload.storeName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

    const city = mockCities.find((c) => c.id === payload.cityId) || mockCities[0];
    const category = mockCategories.find((c) => c.id === payload.categoryId) || mockCategories[0];

    const newStore: Store = {
      id: storeId,
      userId,
      artisanId,
      cityId: payload.cityId,
      categoryId: payload.categoryId,
      name: payload.storeName,
      slug: storeSlug,
      artisanName: payload.fullName,
      bio: payload.description,
      story: payload.story || payload.description,
      logoUrl: payload.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      coverUrl: payload.coverUrl || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=80',
      whatsapp: payload.whatsapp.replace(/\D/g, ''),
      instagram: payload.instagram,
      address: payload.address,
      neighborhood: payload.neighborhood || 'São Roque',
      latitude: city.latitude + (Math.random() - 0.5) * 0.02,
      longitude: city.longitude + (Math.random() - 0.5) * 0.02,
      openingHours: 'Segunda a Sábado, das 9h às 18h',
      verified: false,
      foundingMember: newArtisan.foundingMember,
      status: 'PENDING',
      planType: 'FREE',
      isFeatured: false,
      rating: 5.0,
      reviewsCount: 0,
      productsCount: payload.products.length,
      whatsappClicksCount: 0,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      city,
      category,
    };

    runtimeArtisans.unshift(newArtisan);
    runtimeStores.unshift(newStore);

    const createdProducts: Product[] = [];

    payload.products.forEach((p, idx) => {
      const prodSlug = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}-${idx}`;
      const newProd: Product = {
        id: generateUUID(),
        storeId,
        cityId: payload.cityId,
        categoryId: payload.categoryId,
        name: p.name,
        slug: prodSlug,
        description: p.description,
        price: p.price,
        promoPrice: p.promoPrice,
        isPromo: !!p.promoPrice,
        materials: p.materials || ['Feito à mão'],
        dimensions: p.dimensions || '',
        isFeatured: false,
        isAvailable: true,
        stockQuantity: 10,
        status: 'PENDING',
        images: p.images || ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80'],
        coverImage:
          (p.images && p.images[0]) ||
          'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
        viewsCount: 0,
        whatsappClicksCount: 0,
        favoritesCount: 0,
        store: newStore,
        city,
        category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      runtimeProducts.unshift(newProd);
      createdProducts.push(newProd);
    });

    persistLocalCustomData();

    // Async write to Supabase PostgreSQL in background
    try {
      if (SUPABASE_URL && SUPABASE_KEY) {
        fetch(`${SUPABASE_URL}/rest/v1/artisans`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            id: artisanId,
            full_name: payload.fullName,
            phone: payload.phone,
            email: payload.email,
            bio: payload.description,
            avatar_url: newArtisan.avatarUrl,
            verified: false,
            founding_member: newArtisan.foundingMember,
            status: 'PENDING',
            onboarding_source: 'SELF_SERVICE',
          }),
        }).catch(() => {});

        fetch(`${SUPABASE_URL}/rest/v1/stores`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            id: storeId,
            artisan_id: artisanId,
            city_id: payload.cityId,
            category_id: payload.categoryId,
            name: payload.storeName,
            slug: storeSlug,
            artisan_name: payload.fullName,
            bio: payload.description,
            story: payload.story || payload.description,
            logo_url: newStore.logoUrl,
            cover_url: newStore.coverUrl,
            whatsapp: payload.whatsapp.replace(/\D/g, ''),
            instagram: payload.instagram || '',
            address: payload.address,
            neighborhood: payload.neighborhood || 'São Roque',
            latitude: newStore.latitude,
            longitude: newStore.longitude,
            opening_hours: newStore.openingHours,
            verified: false,
            founding_member: newStore.foundingMember,
            status: 'PENDING',
            plan_type: 'FREE',
            is_featured: false,
          }),
        }).catch(() => {});
      }
    } catch {}

    return { artisan: newArtisan, store: newStore };
  },

  // ==========================================
  // ONBOARDING (ADMIN-ASSISTED)
  // ==========================================
  async createArtisanAdminAssisted(payload: {
    fullName: string;
    email: string;
    phone: string;
    storeName: string;
    description: string;
    cityId: string;
    categoryId: string;
    instagram?: string;
    address: string;
    logoUrl?: string;
    coverUrl?: string;
    products?: Array<{
      name: string;
      description: string;
      price: number;
      images?: string[];
    }>;
  }): Promise<{ artisan: Artisan; store: Store; invitationToken: string; invitationUrl: string }> {
    const artisanId = generateUUID();
    const storeId = generateUUID();
    const slugBase = payload.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const token = `convite-${slugBase}-${Math.random().toString(36).substring(2, 8)}`;

    const newArtisan: Artisan = {
      id: artisanId,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      bio: payload.description,
      avatarUrl: payload.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      verified: true,
      foundingMember: runtimeArtisans.length < 50,
      status: 'APPROVED',
      onboardingSource: 'ADMIN_ASSISTED',
      invitationToken: token,
      invitationStatus: 'SENT',
      invitedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const city = mockCities.find((c) => c.id === payload.cityId) || mockCities[0];
    const category = mockCategories.find((c) => c.id === payload.categoryId) || mockCategories[0];

    const newStore: Store = {
      id: storeId,
      userId: artisanId,
      artisanId,
      cityId: payload.cityId,
      categoryId: payload.categoryId,
      name: payload.storeName,
      slug: slugBase,
      artisanName: payload.fullName,
      bio: payload.description,
      story: payload.description,
      logoUrl: payload.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      coverUrl: payload.coverUrl || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=80',
      whatsapp: payload.phone.replace(/\D/g, ''),
      instagram: payload.instagram,
      address: payload.address,
      latitude: city.latitude + (Math.random() - 0.5) * 0.015,
      longitude: city.longitude + (Math.random() - 0.5) * 0.015,
      openingHours: 'Terça a Domingo, das 9h às 18h',
      verified: true,
      foundingMember: newArtisan.foundingMember,
      status: 'APPROVED',
      planType: 'PRO',
      isFeatured: true,
      rating: 5.0,
      reviewsCount: 0,
      productsCount: payload.products ? payload.products.length : 0,
      whatsappClicksCount: 0,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      city,
      category,
    };

    runtimeArtisans.unshift(newArtisan);
    runtimeStores.unshift(newStore);

    if (payload.products) {
      payload.products.forEach((p, idx) => {
        const prodSlug = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}-${idx}`;
        const newProd: Product = {
          id: generateUUID(),
          storeId,
          cityId: payload.cityId,
          categoryId: payload.categoryId,
          name: p.name,
          slug: prodSlug,
          description: p.description,
          price: p.price,
          isPromo: false,
          materials: ['Artesanal'],
          isFeatured: false,
          isAvailable: true,
          status: 'APPROVED',
          images: p.images || ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80'],
          coverImage:
            (p.images && p.images[0]) ||
            'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
          viewsCount: 0,
          whatsappClicksCount: 0,
          favoritesCount: 0,
          store: newStore,
          city,
          category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        runtimeProducts.unshift(newProd);
      });
    }

    persistLocalCustomData();

    return {
      artisan: newArtisan,
      store: newStore,
      invitationToken: token,
      invitationUrl: `/convite/${token}`,
    };
  },

  // ==========================================
  // INVITATIONS
  // ==========================================
  async getInvitationByToken(token: string): Promise<{ artisan: Artisan; store: Store } | null> {
    const artisan = runtimeArtisans.find((a) => a.invitationToken === token);
    if (!artisan) return null;
    const store = runtimeStores.find((s) => s.artisanId === artisan.id || s.userId === artisan.userId);
    if (!store) return null;
    return { artisan, store };
  },

  async acceptInvitation(token: string, passwordHash: string): Promise<boolean> {
    const artisan = runtimeArtisans.find((a) => a.invitationToken === token);
    if (!artisan) return false;

    artisan.invitationStatus = 'ACCEPTED';
    artisan.acceptedAt = new Date().toISOString();
    artisan.userId = generateUUID();
    artisan.status = 'APPROVED';

    const store = runtimeStores.find((s) => s.artisanId === artisan.id || s.userId === artisan.userId);
    if (store) {
      store.userId = artisan.userId;
      store.status = 'APPROVED';
    }

    persistLocalCustomData();
    return true;
  },

  // ==========================================
  // MODERATION (ADMIN)
  // ==========================================
  async moderateStore(storeId: string, action: 'APPROVE' | 'REJECT' | 'SUSPEND' | 'REQUEST_CHANGES', adminNotes?: string): Promise<boolean> {
    const store = runtimeStores.find((s) => s.id === storeId);
    if (!store) return false;

    const statusMap: Record<string, StoreStatus> = {
      APPROVE: 'APPROVED',
      REJECT: 'REJECTED',
      SUSPEND: 'SUSPENDED',
      REQUEST_CHANGES: 'PENDING',
    };

    store.status = statusMap[action] || 'PENDING';
    store.adminNotes = adminNotes;
    store.updatedAt = new Date().toISOString();

    const artisan = runtimeArtisans.find((a) => a.id === store.artisanId || a.userId === store.userId);
    if (artisan) {
      artisan.status = action === 'APPROVE' ? 'APPROVED' : action === 'SUSPEND' ? 'SUSPENDED' : action === 'REJECT' ? 'REJECTED' : 'PENDING';
      artisan.adminNotes = adminNotes;
    }

    if (action === 'APPROVE') {
      runtimeProducts
        .filter((p) => p.storeId === storeId)
        .forEach((p) => {
          p.status = 'APPROVED';
        });
    }

    persistLocalCustomData();
    return true;
  },

  async moderateProduct(productId: string, action: 'APPROVE' | 'REJECT' | 'SUSPEND'): Promise<boolean> {
    const prod = runtimeProducts.find((p) => p.id === productId);
    if (!prod) return false;

    const statusMap: Record<string, ProductStatus> = {
      APPROVE: 'APPROVED',
      REJECT: 'REJECTED',
      SUSPEND: 'SUSPENDED',
    };

    prod.status = statusMap[action] || 'PENDING';
    prod.updatedAt = new Date().toISOString();
    persistLocalCustomData();
    return true;
  },

  async toggleStoreVerified(id: string): Promise<boolean> {
    const store = runtimeStores.find((s) => s.id === id);
    if (!store) return false;
    store.verified = !store.verified;
    persistLocalCustomData();
    return true;
  },

  async toggleStoreFeatured(id: string): Promise<boolean> {
    const store = runtimeStores.find((s) => s.id === id);
    if (!store) return false;
    store.isFeatured = !store.isFeatured;
    persistLocalCustomData();
    return true;
  },

  async toggleProductFeatured(id: string): Promise<boolean> {
    const prod = runtimeProducts.find((p) => p.id === id);
    if (!prod) return false;
    prod.isFeatured = !prod.isFeatured;
    persistLocalCustomData();
    return true;
  },

  async setStoreStatus(id: string, status: StoreStatus): Promise<boolean> {
    const store = runtimeStores.find((s) => s.id === id);
    if (!store) return false;
    store.status = status;
    persistLocalCustomData();
    return true;
  },

  async toggleFoundingMember(artisanId: string): Promise<boolean> {
    const artisan = runtimeArtisans.find((a) => a.id === artisanId);
    if (!artisan) return false;

    artisan.foundingMember = !artisan.foundingMember;
    const store = runtimeStores.find((s) => s.artisanId === artisan.id || s.userId === artisan.userId);
    if (store) {
      store.foundingMember = artisan.foundingMember;
    }
    persistLocalCustomData();
    return true;
  },

  // ==========================================
  // STORE COMPLETENESS CHECKLIST & CALCULATOR
  // ==========================================
  calculateStoreCompleteness(store: Store, products: Product[] = []): StoreCompleteness {
    const checklist = [
      { label: 'Nome da loja e do artesão', completed: !!store.name && !!store.artisanName, importance: 'high' as const },
      { label: 'WhatsApp de contato direto', completed: !!store.whatsapp && store.whatsapp.length >= 10, importance: 'high' as const },
      { label: 'História e técnicas de produção', completed: !!store.story && store.story.length >= 50, importance: 'high' as const },
      { label: 'Foto de capa e logo do ateliê', completed: !!store.coverUrl && !!store.logoUrl, importance: 'high' as const },
      { label: 'Endereço e bairro em São Roque', completed: !!store.address && !!store.cityId, importance: 'high' as const },
      { label: 'Perfil no Instagram vinculado', completed: !!store.instagram, importance: 'medium' as const },
      { label: 'Pelo menos 3 produtos cadastrados', completed: products.length >= 3, importance: 'high' as const },
      { label: 'Horário de atendimento preenchido', completed: !!store.openingHours, importance: 'medium' as const },
    ];

    const completedCount = checklist.filter((item) => item.completed).length;
    const score = Math.round((completedCount / checklist.length) * 100);

    return {
      score,
      checklist,
    };
  },

  async getFoundingMembersCampaign(): Promise<{ count: number; target: number; remaining: number; percentage: number; isActive: boolean }> {
    const count = runtimeArtisans.filter((a) => a.foundingMember).length;
    const target = 50;
    const remaining = Math.max(0, target - count);
    const percentage = Math.min(100, Math.round((count / target) * 100));
    return {
      count,
      target,
      remaining,
      percentage,
      isActive: count < target,
    };
  },

  // ==========================================
  // ADMIN METRICS
  // ==========================================
  async getAdminMetrics(): Promise<{
    totalArtisans: number;
    totalStores: number;
    approvedStores: number;
    pendingStores: number;
    totalProducts: number;
    pendingProducts: number;
    totalWhatsAppClicks: number;
    totalViews: number;
    sourcesBreakdown: {
      selfService: number;
      adminAssisted: number;
      partner: number;
    };
    foundingCampaign: {
      count: number;
      target: number;
      remaining: number;
      percentage: number;
    };
    citiesBreakdown: Array<{ name: string; stores: number; products: number }>;
  }> {
    const totalArtisans = runtimeArtisans.length;
    const totalStores = runtimeStores.length;
    const approvedStores = runtimeStores.filter((s) => s.status === 'APPROVED').length;
    const pendingStores = runtimeStores.filter((s) => s.status === 'PENDING').length;
    const totalProducts = runtimeProducts.length;
    const pendingProducts = runtimeProducts.filter((p) => p.status === 'PENDING').length;
    const totalWhatsAppClicks = runtimeStores.reduce((acc, s) => acc + s.whatsappClicksCount, 0);
    const totalViews = runtimeStores.reduce((acc, s) => acc + s.viewsCount, 0);

    const sourcesBreakdown = {
      selfService: runtimeArtisans.filter((a) => a.onboardingSource === 'SELF_SERVICE').length,
      adminAssisted: runtimeArtisans.filter((a) => a.onboardingSource === 'ADMIN_ASSISTED').length,
      partner: runtimeArtisans.filter((a) => a.onboardingSource === 'PARTNER').length,
    };

    const campaign = await this.getFoundingMembersCampaign();

    const citiesBreakdown = mockCities.map((c) => ({
      name: c.name,
      stores: runtimeStores.filter((s) => s.cityId === c.id).length,
      products: runtimeProducts.filter((p) => p.cityId === c.id).length,
    }));

    return {
      totalArtisans,
      totalStores,
      approvedStores,
      pendingStores,
      totalProducts,
      pendingProducts,
      totalWhatsAppClicks,
      totalViews,
      sourcesBreakdown,
      foundingCampaign: {
        count: campaign.count,
        target: campaign.target,
        remaining: campaign.remaining,
        percentage: campaign.percentage,
      },
      citiesBreakdown,
    };
  },

  async getAllProductsForAdmin(): Promise<Product[]> {
    const dbProds = await fetchFromSupabase<any>('products?select=*&order=created_at.desc');
    if (dbProds && dbProds.length > 0) {
      return dbProds.map(mapDbProductToProduct);
    }
    return [...runtimeProducts];
  },

  // ==========================================
  // ARTISAN PANEL & PRODUCTS MANAGEMENT
  // ==========================================
  async getArtisanStats(storeId: string): Promise<{
    storeViews: number;
    productViews: number;
    whatsappClicks: number;
    favorites: number;
    viewsCount: number;
    whatsappClicksCount: number;
    favoritesCount: number;
    totalProducts: number;
    conversionRate: string;
    chartData: Array<{ label: string; date?: string; views: number; clicks: number }>;
  }> {
    const store = runtimeStores.find((s) => s.id === storeId || s.slug === storeId);
    const products = runtimeProducts.filter((p) => p.storeId === (store?.id || storeId));

    const totalProducts = products.length;
    const viewsCount = store?.viewsCount || 0;
    const whatsappClicksCount = store?.whatsappClicksCount || 0;
    const favoritesCount = products.reduce((acc, p) => acc + p.favoritesCount, 0);
    const conversionRate = viewsCount > 0 ? ((whatsappClicksCount / viewsCount) * 100).toFixed(1) : '0.0';

    const chartData = [
      { label: 'Seg', date: 'Seg', views: Math.round(viewsCount * 0.1), clicks: Math.round(whatsappClicksCount * 0.1) },
      { label: 'Ter', date: 'Ter', views: Math.round(viewsCount * 0.15), clicks: Math.round(whatsappClicksCount * 0.12) },
      { label: 'Qua', date: 'Qua', views: Math.round(viewsCount * 0.12), clicks: Math.round(whatsappClicksCount * 0.1) },
      { label: 'Qui', date: 'Qui', views: Math.round(viewsCount * 0.18), clicks: Math.round(whatsappClicksCount * 0.2) },
      { label: 'Sex', date: 'Sex', views: Math.round(viewsCount * 0.2), clicks: Math.round(whatsappClicksCount * 0.25) },
      { label: 'Sáb', date: 'Sáb', views: Math.round(viewsCount * 0.25), clicks: Math.round(whatsappClicksCount * 0.33) },
    ];

    return {
      storeViews: viewsCount,
      productViews: products.reduce((acc, p) => acc + p.viewsCount, 0),
      whatsappClicks: whatsappClicksCount,
      favorites: favoritesCount,
      viewsCount,
      whatsappClicksCount,
      favoritesCount,
      totalProducts,
      conversionRate,
      chartData,
    };
  },

  async updateStore(storeId: string, payload: Partial<Store>): Promise<Store | null> {
    const storeIndex = runtimeStores.findIndex((s) => s.id === storeId);
    if (storeIndex === -1) return null;

    runtimeStores[storeIndex] = {
      ...runtimeStores[storeIndex],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    persistLocalCustomData();
    return runtimeStores[storeIndex];
  },

  async createProduct(
    payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'whatsappClicksCount' | 'favoritesCount' | 'slug' | 'status'> & {
      slug?: string;
      status?: ProductStatus;
    }
  ): Promise<Product> {
    const slug =
      payload.slug ||
      payload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newProduct: Product = {
      ...payload,
      id: generateUUID(),
      slug,
      status: payload.status || 'APPROVED',
      viewsCount: 0,
      whatsappClicksCount: 0,
      favoritesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    runtimeProducts.unshift(newProduct);
    persistLocalCustomData();
    return newProduct;
  },

  async updateProduct(id: string, payload: Partial<Product>): Promise<Product | null> {
    const prodIndex = runtimeProducts.findIndex((p) => p.id === id);
    if (prodIndex === -1) return null;

    runtimeProducts[prodIndex] = {
      ...runtimeProducts[prodIndex],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    persistLocalCustomData();
    return runtimeProducts[prodIndex];
  },

  async deleteProduct(id: string): Promise<boolean> {
    const beforeLength = runtimeProducts.length;
    runtimeProducts = runtimeProducts.filter((p) => p.id !== id);
    persistLocalCustomData();
    return runtimeProducts.length < beforeLength;
  },

  // ==========================================
  // ANALYTICS & CLICKS
  // ==========================================
  async trackWhatsAppClick(storeId: string, productId?: string, cityId?: string): Promise<boolean> {
    const store = runtimeStores.find((s) => s.id === storeId);
    if (store) store.whatsappClicksCount += 1;

    if (productId) {
      const prod = runtimeProducts.find((p) => p.id === productId);
      if (prod) prod.whatsappClicksCount += 1;
    }

    runtimeClicks.push({
      storeId,
      productId,
      date: new Date().toISOString(),
    });

    persistLocalCustomData();
    return true;
  },

  async recordWhatsAppClick(storeId: string, productId?: string, cityId?: string): Promise<boolean> {
    return this.trackWhatsAppClick(storeId, productId, cityId);
  },

  async trackStoreView(storeId: string): Promise<boolean> {
    const store = runtimeStores.find((s) => s.id === storeId);
    if (store) store.viewsCount += 1;
    persistLocalCustomData();
    return true;
  },

  async recordStoreView(storeId: string): Promise<boolean> {
    return this.trackStoreView(storeId);
  },

  async trackProductView(productId: string): Promise<boolean> {
    const prod = runtimeProducts.find((p) => p.id === productId);
    if (prod) prod.viewsCount += 1;
    persistLocalCustomData();
    return true;
  },

  async recordProductView(productId: string): Promise<boolean> {
    return this.trackProductView(productId);
  },
};
