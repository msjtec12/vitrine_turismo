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

// In-memory / dynamic multi-tenant state
let runtimeArtisans: Artisan[] = [...mockArtisans];
let runtimeStores: Store[] = [...getHydratedStores()];
let runtimeProducts: Product[] = [...getHydratedProducts()];
let runtimeReviews: Review[] = [...mockReviews];
let runtimeAuditLogs: AuditLog[] = [...mockAuditLogs];
let runtimeNotifications: Notification[] = [...mockNotifications];
let runtimeClicks: Array<{ storeId: string; productId?: string; date: string }> = [];

export const storeService = {
  // ==========================================
  // CITIES & CATEGORIES
  // ==========================================
  async getCities(): Promise<City[]> {
    return mockCities.filter((c) => c.isActive);
  },

  async getCityBySlug(slug: string): Promise<City | null> {
    const city = mockCities.find((c) => c.slug.toLowerCase() === slug.toLowerCase() && c.isActive);
    if (!city) return null;

    const storesCount = runtimeStores.filter((s) => s.cityId === city.id && s.status === 'APPROVED').length;
    const productsCount = runtimeProducts.filter((p) => p.cityId === city.id && p.status === 'APPROVED').length;

    return {
      ...city,
      storesCount,
      productsCount,
    };
  },

  async getCategories(): Promise<Category[]> {
    return mockCategories.map((cat) => ({
      ...cat,
      productsCount: runtimeProducts.filter((p) => p.categoryId === cat.id && p.status === 'APPROVED').length,
    }));
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const cat = mockCategories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
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
    let stores = [...runtimeStores].filter((s) => s.status === 'APPROVED');

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
    return runtimeStores
      .filter((s) => s.status === 'APPROVED' && s.isFeatured)
      .slice(0, limit);
  },

  async getStoreBySlug(slug: string): Promise<Store | null> {
    const store = runtimeStores.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
    return store || null;
  },

  async getStoreById(id: string): Promise<Store | null> {
    const store = runtimeStores.find((s) => s.id === id);
    return store || null;
  },

  async getStoresByUserId(userId: string): Promise<Store[]> {
    return runtimeStores.filter((s) => s.userId === userId);
  },

  // ==========================================
  // PRODUCTS (PUBLIC - APPROVED ONLY)
  // ==========================================
  async getProducts(filters: FilterOptions = {}): Promise<Product[]> {
    let products = [...runtimeProducts].filter((p) => {
      // Must be approved and its store must also be approved
      if (p.status !== 'APPROVED') return false;
      const store = runtimeStores.find((s) => s.id === p.storeId);
      return store?.status === 'APPROVED';
    });

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

    if (filters.onlyVerified) {
      products = products.filter((p) => p.store?.verified);
    }

    if (filters.minPrice !== undefined) {
      products = products.filter((p) => (p.isPromo && p.promoPrice ? p.promoPrice : p.price) >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => (p.isPromo && p.promoPrice ? p.promoPrice : p.price) <= filters.maxPrice!);
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.materials?.some((m) => m.toLowerCase().includes(q)) ||
          p.store?.name.toLowerCase().includes(q)
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
    return runtimeProducts
      .filter((p) => p.status === 'APPROVED' && p.isFeatured)
      .slice(0, limit);
  },

  async getPromotionProducts(limit: number = 8): Promise<Product[]> {
    return runtimeProducts
      .filter((p) => p.status === 'APPROVED' && p.isPromo)
      .slice(0, limit);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const product = runtimeProducts.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    return product || null;
  },

  async getProductsByStoreId(storeId: string): Promise<Product[]> {
    return runtimeProducts.filter((p) => p.storeId === storeId);
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
    let list = [...runtimeArtisans];

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
    return list.map((artisan) => ({
      ...artisan,
      stores: runtimeStores.filter((s) => s.artisanId === artisan.id || s.userId === artisan.userId),
    }));
  },

  async getArtisanById(id: string): Promise<Artisan | null> {
    const artisan = runtimeArtisans.find((a) => a.id === id);
    if (!artisan) return null;

    const stores = runtimeStores.filter((s) => s.artisanId === artisan.id || s.userId === artisan.userId);
    return {
      ...artisan,
      stores,
    };
  },

  async getArtisanByUserId(userId: string): Promise<Artisan | null> {
    const artisan = runtimeArtisans.find((a) => a.userId === userId);
    if (!artisan) return null;

    const stores = runtimeStores.filter((s) => s.artisanId === artisan.id || s.userId === artisan.userId);
    return {
      ...artisan,
      stores,
    };
  },

  // ==========================================
  // METHOD 1: SELF-SERVICE ONBOARDING
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
    const artisanId = `artisan-${Date.now()}`;
    const storeId = `store-${Date.now()}`;
    const userId = `user-${Date.now()}`;

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
      neighborhood: payload.neighborhood,
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
      city,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add initial products
    payload.products.forEach((p, idx) => {
      const prodSlug = p.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}-${idx}`;

      const newProd: Product = {
        id: `prod-${Date.now()}-${idx}`,
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
    });

    runtimeArtisans.unshift(newArtisan);
    runtimeStores.unshift(newStore);

    // Record audit log
    runtimeAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      userId,
      userEmail: payload.email,
      action: 'SELF_SERVICE_REGISTRATION',
      entityType: 'ARTISAN',
      entityId: artisanId,
      metadata: { storeName: payload.storeName, productsCount: payload.products.length },
      createdAt: new Date().toISOString(),
    });

    return { artisan: newArtisan, store: newStore };
  },

  // ==========================================
  // METHOD 2: ADMIN-ASSISTED CREATION & INVITATIONS
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
    address?: string;
    logoUrl?: string;
    coverUrl?: string;
    products?: Array<{
      name: string;
      description: string;
      price: number;
      images?: string[];
    }>;
  }): Promise<{ artisan: Artisan; store: Store; invitationToken: string; invitationUrl: string }> {
    const artisanId = `artisan-admin-${Date.now()}`;
    const storeId = `store-admin-${Date.now()}`;
    const cleanSlug = payload.storeName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const token = `convite-${cleanSlug}-${Math.random().toString(36).substring(2, 8)}`;
    const city = mockCities.find((c) => c.id === payload.cityId) || mockCities[0];
    const category = mockCategories.find((c) => c.id === payload.categoryId) || mockCategories[0];

    const newArtisan: Artisan = {
      id: artisanId,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      bio: payload.description,
      avatarUrl: payload.logoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      verified: true,
      foundingMember: runtimeArtisans.length < 50,
      status: 'PENDING',
      onboardingSource: 'ADMIN_ASSISTED',
      invitationToken: token,
      invitationStatus: 'SENT',
      invitedAt: new Date().toISOString(),
      adminNotes: 'Cadastrado via curadoria assistida. Aguardando aceite do convite pelo artesão.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newStore: Store = {
      id: storeId,
      userId: `user-temp-${Date.now()}`,
      artisanId,
      cityId: payload.cityId,
      categoryId: payload.categoryId,
      name: payload.storeName,
      slug: cleanSlug,
      artisanName: payload.fullName,
      bio: payload.description,
      story: payload.description,
      logoUrl: payload.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      coverUrl: payload.coverUrl || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=80',
      whatsapp: payload.phone.replace(/\D/g, ''),
      instagram: payload.instagram,
      address: payload.address || `${city.name} - SP`,
      latitude: city.latitude,
      longitude: city.longitude,
      openingHours: 'Segunda a Sábado, das 9h às 18h',
      verified: true,
      foundingMember: newArtisan.foundingMember,
      status: 'PENDING',
      adminNotes: 'Aguardando validação do artesão',
      planType: 'PRO',
      isFeatured: false,
      rating: 5.0,
      reviewsCount: 0,
      productsCount: payload.products?.length || 0,
      whatsappClicksCount: 0,
      viewsCount: 0,
      city,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (payload.products && payload.products.length > 0) {
      payload.products.forEach((p, idx) => {
        const prodSlug = p.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-') + `-${Date.now().toString().slice(-4)}-${idx}`;

        const newProd: Product = {
          id: `prod-admin-${Date.now()}-${idx}`,
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
      });
    }

    runtimeArtisans.unshift(newArtisan);
    runtimeStores.unshift(newStore);

    // Record audit log
    runtimeAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      userEmail: 'admin@descubraartes.com.br',
      action: 'CREATE_ARTISAN_ADMIN_ASSISTED',
      entityType: 'ARTISAN',
      entityId: artisanId,
      metadata: { storeName: payload.storeName, token },
      createdAt: new Date().toISOString(),
    });

    const invitationUrl = `/convite/${token}`;

    return {
      artisan: newArtisan,
      store: newStore,
      invitationToken: token,
      invitationUrl,
    };
  },

  async getInvitationByToken(token: string): Promise<{ artisan: Artisan; store: Store } | null> {
    const artisan = runtimeArtisans.find((a) => a.invitationToken === token);
    if (!artisan) return null;

    const store = runtimeStores.find((s) => s.artisanId === artisan.id || s.userId === artisan.userId);
    if (!store) return null;

    return { artisan, store };
  },

  async acceptInvitation(token: string, passwordHash?: string): Promise<{ success: boolean; artisan: Artisan; store: Store }> {
    const artisan = runtimeArtisans.find((a) => a.invitationToken === token);
    if (!artisan) throw new Error('Convite inválido ou expirado');

    const store = runtimeStores.find((s) => s.artisanId === artisan.id || s.userId === artisan.userId);
    if (!store) throw new Error('Loja não encontrada para este convite');

    const newUserId = `user-${Date.now()}`;
    artisan.userId = newUserId;
    artisan.invitationStatus = 'ACCEPTED';
    artisan.status = 'APPROVED';
    artisan.acceptedAt = new Date().toISOString();
    artisan.updatedAt = new Date().toISOString();

    store.userId = newUserId;
    store.status = 'APPROVED';
    store.updatedAt = new Date().toISOString();

    // Approve products
    runtimeProducts
      .filter((p) => p.storeId === store.id)
      .forEach((p) => {
        p.status = 'APPROVED';
      });

    // Audit log
    runtimeAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      userId: newUserId,
      userEmail: artisan.email,
      action: 'ACCEPT_INVITATION',
      entityType: 'ARTISAN',
      entityId: artisan.id,
      metadata: { token },
      createdAt: new Date().toISOString(),
    });

    return { success: true, artisan, store };
  },

  // ==========================================
  // MODERATION & CURATION
  // ==========================================
  async moderateStore(
    storeId: string,
    action: 'APPROVE' | 'REJECT' | 'SUSPEND' | 'REQUEST_CHANGES',
    adminNotes?: string
  ): Promise<boolean> {
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

    // Also update associated artisan if exists
    if (store.artisanId) {
      const artisan = runtimeArtisans.find((a) => a.id === store.artisanId);
      if (artisan) {
        artisan.status = action === 'APPROVE' ? 'APPROVED' : action === 'SUSPEND' ? 'SUSPENDED' : 'PENDING';
        artisan.adminNotes = adminNotes;
        artisan.updatedAt = new Date().toISOString();
      }
    }

    // Update products status if store approved
    if (action === 'APPROVE') {
      runtimeProducts
        .filter((p) => p.storeId === storeId)
        .forEach((p) => {
          p.status = 'APPROVED';
        });
    }

    // Audit log
    runtimeAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      userEmail: 'admin@descubraartes.com.br',
      action: `MODERATE_STORE_${action}`,
      entityType: 'STORE',
      entityId: storeId,
      metadata: { storeName: store.name, notes: adminNotes },
      createdAt: new Date().toISOString(),
    });

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

    runtimeAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      userEmail: 'admin@descubraartes.com.br',
      action: `MODERATE_PRODUCT_${action}`,
      entityType: 'PRODUCT',
      entityId: productId,
      metadata: { productName: prod.name },
      createdAt: new Date().toISOString(),
    });

    return true;
  },

  async toggleStoreVerified(id: string): Promise<boolean> {
    const store = runtimeStores.find((s) => s.id === id);
    if (!store) return false;
    store.verified = !store.verified;
    return true;
  },

  async toggleStoreFeatured(id: string): Promise<boolean> {
    const store = runtimeStores.find((s) => s.id === id);
    if (!store) return false;
    store.isFeatured = !store.isFeatured;
    return true;
  },

  async toggleProductFeatured(id: string): Promise<boolean> {
    const prod = runtimeProducts.find((p) => p.id === id);
    if (!prod) return false;
    prod.isFeatured = !prod.isFeatured;
    return true;
  },

  async setStoreStatus(id: string, status: StoreStatus): Promise<boolean> {
    const store = runtimeStores.find((s) => s.id === id);
    if (!store) return false;
    store.status = status;
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

  // ==========================================
  // METRICS & CAMPAIGNS
  // ==========================================
  async getFoundingMembersCampaign() {
    const foundingCount = runtimeArtisans.filter((a) => a.foundingMember).length;
    const target = 50;
    const remaining = Math.max(0, target - foundingCount);
    const percentage = Math.min(100, Math.round((foundingCount / target) * 100));

    return {
      target,
      count: foundingCount,
      remaining,
      percentage,
      isActive: foundingCount < target,
    };
  },

  async getAdminMetrics() {
    const totalArtisans = runtimeArtisans.length;
    const totalStores = runtimeStores.length;
    const approvedStores = runtimeStores.filter((s) => s.status === 'APPROVED').length;
    const pendingStores = runtimeStores.filter((s) => s.status === 'PENDING').length;
    const totalProducts = runtimeProducts.length;
    const pendingProducts = runtimeProducts.filter((p) => p.status === 'PENDING').length;
    const featuredProducts = runtimeProducts.filter((p) => p.isFeatured).length;
    const activePromos = runtimeProducts.filter((p) => p.isPromo).length;

    const selfServiceCount = runtimeArtisans.filter((a) => a.onboardingSource === 'SELF_SERVICE').length;
    const adminAssistedCount = runtimeArtisans.filter((a) => a.onboardingSource === 'ADMIN_ASSISTED').length;

    const foundingCampaign = await this.getFoundingMembersCampaign();

    const totalWhatsAppClicks =
      runtimeStores.reduce((sum, s) => sum + s.whatsappClicksCount, 0) +
      runtimeProducts.reduce((sum, p) => sum + p.whatsappClicksCount, 0);

    const totalViews =
      runtimeStores.reduce((sum, s) => sum + s.viewsCount, 0) +
      runtimeProducts.reduce((sum, p) => sum + p.viewsCount, 0);

    return {
      totalArtisans,
      totalStores,
      approvedStores,
      pendingStores,
      totalProducts,
      pendingProducts,
      featuredProducts,
      activePromos,
      totalCities: mockCities.length,
      totalWhatsAppClicks,
      totalViews,
      sourcesBreakdown: {
        selfService: selfServiceCount,
        adminAssisted: adminAssistedCount,
      },
      foundingCampaign,
      citiesBreakdown: mockCities.map((c) => ({
        name: c.name,
        stores: runtimeStores.filter((s) => s.cityId === c.id).length,
        products: runtimeProducts.filter((p) => p.cityId === c.id).length,
      })),
    };
  },

  async getAllStoresForAdmin(): Promise<Store[]> {
    return [...runtimeStores];
  },

  async getAllProductsForAdmin(): Promise<Product[]> {
    return [...runtimeProducts];
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return [...runtimeAuditLogs];
  },

  // CONVERSIONS & STATS
  async recordWhatsAppClick(storeId: string, productId?: string, cityId?: string) {
    runtimeClicks.push({
      storeId,
      productId,
      date: new Date().toISOString(),
    });

    const store = runtimeStores.find((s) => s.id === storeId);
    if (store) {
      store.whatsappClicksCount += 1;
    }

    if (productId) {
      const prod = runtimeProducts.find((p) => p.id === productId);
      if (prod) {
        prod.whatsappClicksCount += 1;
      }
    }
  },

  async recordStoreView(storeId: string) {
    const store = runtimeStores.find((s) => s.id === storeId);
    if (store) {
      store.viewsCount += 1;
    }
  },

  async recordProductView(productId: string) {
    const prod = runtimeProducts.find((p) => p.id === productId);
    if (prod) {
      prod.viewsCount += 1;
    }
  },

  // ARTISAN CRUD OPERATIONS
  async createProduct(productData: Partial<Product>): Promise<Product> {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      storeId: productData.storeId || 'store-ceramica-da-terra',
      cityId: productData.cityId || 'city-sao-roque',
      categoryId: productData.categoryId || 'cat-ceramica',
      name: productData.name || 'Novo Produto Artesanal',
      slug:
        (productData.name || 'novo-produto')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') + `-${Date.now()}`,
      description: productData.description || 'Descrição artesanal...',
      details: productData.details || [],
      materials: productData.materials || [],
      dimensions: productData.dimensions || '',
      weight: productData.weight || '',
      price: productData.price || 0,
      promoPrice: productData.promoPrice,
      isPromo: !!productData.isPromo,
      promoDiscountPercent:
        productData.promoPrice && productData.price
          ? Math.round(((productData.price - productData.promoPrice) / productData.price) * 100)
          : undefined,
      isFeatured: !!productData.isFeatured,
      isAvailable: productData.isAvailable !== false,
      stockQuantity: productData.stockQuantity || 10,
      status: 'PENDING', // MVP rule: new products go to pending
      images:
        productData.images && productData.images.length > 0
          ? productData.images
          : ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80'],
      coverImage:
        (productData.images && productData.images[0]) ||
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
      viewsCount: 0,
      whatsappClicksCount: 0,
      favoritesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const store = runtimeStores.find((s) => s.id === newProd.storeId);
    const city = mockCities.find((c) => c.id === newProd.cityId);
    const category = mockCategories.find((c) => c.id === newProd.categoryId);

    newProd.store = store;
    newProd.city = city;
    newProd.category = category;

    runtimeProducts.unshift(newProd);
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = runtimeProducts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const current = runtimeProducts[index];
    const updated: Product = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.promoPrice && updates.price) {
      updated.promoDiscountPercent = Math.round(((updates.price - updates.promoPrice) / updates.price) * 100);
    }

    runtimeProducts[index] = updated;
    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const initialLen = runtimeProducts.length;
    runtimeProducts = runtimeProducts.filter((p) => p.id !== id);
    return runtimeProducts.length < initialLen;
  },

  async updateStore(id: string, updates: Partial<Store>): Promise<Store | null> {
    const index = runtimeStores.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated: Store = {
      ...runtimeStores[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    runtimeStores[index] = updated;
    return updated;
  },

  async getArtisanStats(storeId: string) {
    const store = runtimeStores.find((s) => s.id === storeId) || runtimeStores[0];
    const storeProducts = runtimeProducts.filter((p) => p.storeId === store.id);

    const totalProductViews = storeProducts.reduce((sum, p) => sum + p.viewsCount, 0);
    const totalProductClicks = storeProducts.reduce((sum, p) => sum + p.whatsappClicksCount, 0);
    const totalFavorites = storeProducts.reduce((sum, p) => sum + p.favoritesCount, 0);

    return {
      storeViews: store.viewsCount,
      productViews: totalProductViews,
      whatsappClicks: store.whatsappClicksCount + totalProductClicks,
      favorites: totalFavorites,
      conversionRate:
        store.viewsCount > 0
          ? (((store.whatsappClicksCount + totalProductClicks) / (store.viewsCount + totalProductViews)) * 100).toFixed(1)
          : '0.0',
      chartData: [
        { label: 'Seg', views: 45, clicks: 6 },
        { label: 'Ter', views: 52, clicks: 8 },
        { label: 'Qua', views: 68, clicks: 11 },
        { label: 'Qui', views: 85, clicks: 14 },
        { label: 'Sex', views: 120, clicks: 22 },
        { label: 'Sáb', views: 185, clicks: 38 },
        { label: 'Dom', views: 210, clicks: 43 },
      ],
    };
  },
};
