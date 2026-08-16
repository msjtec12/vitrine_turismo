export type UserRole = 'ADMIN' | 'ARTISAN' | 'CUSTOMER' | 'MASTER';

export type ArtisanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'BLOCKED';

export type StoreStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type ProductStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type OnboardingSource = 'SELF_SERVICE' | 'ADMIN_ASSISTED' | 'PARTNER';

export type InvitationStatus = 'NOT_SENT' | 'SENT' | 'ACCEPTED' | 'EXPIRED';

export type PlanType = 'FREE' | 'PROFESSIONAL' | 'PRO' | 'PREMIUM';

export type PlanStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'MANUAL';

export type BillingSource = 'MANUAL' | 'MERCADOPAGO' | 'STRIPE' | 'COURTESY';

export type FeaturedType = 'PRODUCT_FEATURED' | 'STORE_FEATURED' | 'CITY_FEATURED';

export interface PlanEntitlements {
  maxProducts: number | null; // null = unlimited
  maxPhotosPerProduct: number;
  canCreateOffers: boolean;
  canFeatured: boolean;
  canVerifiedBadge: boolean;
  canAdvancedStats: boolean;
  canPriorityExposure: boolean;
}

export interface ManualOverrides {
  maxProducts?: number | null;
  maxPhotosPerProduct?: number;
  canCreateOffers?: boolean;
  canFeatured?: boolean;
  canVerifiedBadge?: boolean;
  canAdvancedStats?: boolean;
  canPriorityExposure?: boolean;
}

export interface PlanHistoryEntry {
  id: string;
  action: string;
  previousPlan?: PlanType;
  newPlan?: PlanType;
  previousStatus?: AccountStatus | PlanStatus;
  newStatus?: AccountStatus | PlanStatus;
  performedBy: string;
  notes?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  status?: string;
  createdAt: string;
}

export interface Artisan {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  email: string;
  document?: string; // CPF/CNPJ
  bio?: string;
  avatarUrl?: string;
  verified: boolean;
  foundingMember: boolean;
  status: ArtisanStatus;
  onboardingSource: OnboardingSource;
  invitationToken?: string;
  invitationStatus: InvitationStatus;
  invitedAt?: string;
  acceptedAt?: string;
  adminNotes?: string;
  stores?: Store[];
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
  uf: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  highlightsCount?: number;
  storesCount?: number;
  productsCount?: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  imageUrl: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  productsCount?: number;
}

export interface Store {
  id: string;
  userId: string;
  artisanId?: string;
  cityId: string;
  categoryId: string;
  name: string;
  slug: string;
  artisanName: string;
  bio: string;
  story: string;
  processDescription?: string;
  processImages?: string[];
  logoUrl: string;
  coverUrl: string;
  whatsapp: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  address: string;
  neighborhood?: string;
  city?: City;
  category?: Category;
  artisan?: Artisan;
  latitude: number;
  longitude: number;
  openingHours: string;
  verified: boolean;
  foundingMember?: boolean;
  status: StoreStatus;
  accountStatus?: AccountStatus;
  adminNotes?: string;
  planType: PlanType;
  planStatus?: PlanStatus;
  planStartedAt?: string;
  planExpiresAt?: string | null;
  billingSource?: BillingSource;
  manualOverrides?: ManualOverrides;
  planHistory?: PlanHistoryEntry[];
  isFeatured: boolean;
  featuredUntil?: string;
  rating: number;
  reviewsCount: number;
  productsCount?: number;
  whatsappClicksCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isCover: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  storeId: string;
  cityId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  details?: string[];
  materials?: string[];
  dimensions?: string;
  weight?: string;
  price: number;
  promoPrice?: number;
  isPromo: boolean;
  promoDiscountPercent?: number;
  promoStartsAt?: string;
  promoEndsAt?: string;
  isFeatured: boolean;
  featuredStartsAt?: string;
  featuredEndsAt?: string;
  isAvailable: boolean;
  stockQuantity?: number;
  status: ProductStatus;
  images: string[];
  coverImage: string;
  store?: Store;
  city?: City;
  category?: Category;
  viewsCount: number;
  whatsappClicksCount: number;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  productId: string;
  storeId: string;
  originalPrice: number;
  promoPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  product?: Product;
}

export interface FeaturedItem {
  id: string;
  type: FeaturedType;
  targetId: string; // productId, storeId, or cityId
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl: string;
  citySlug?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  badgeText?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | 'STORE_APPROVED'
    | 'STORE_REJECTED'
    | 'STORE_CHANGE_REQUESTED'
    | 'PRODUCT_APPROVED'
    | 'PRODUCT_REJECTED'
    | 'INVITATION'
    | 'FEATURED_APPROVED';
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface StoreCompleteness {
  score: number; // 0 to 100
  checklist: {
    label: string;
    completed: boolean;
    importance: 'high' | 'medium' | 'low';
  }[];
}

export interface Review {
  id: string;
  storeId: string;
  userId: string;
  authorName: string;
  authorCity?: string;
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface FavoriteItem {
  id: string;
  type: 'store' | 'product';
  store?: Store;
  product?: Product;
  addedAt: string;
}

export interface WhatsAppClickLog {
  id: string;
  storeId: string;
  productId?: string;
  cityId: string;
  referrer?: string;
  userAgent?: string;
  createdAt: string;
}

export interface FilterOptions {
  query?: string;
  citySlug?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  onlyPromotions?: boolean;
  onlyFeatured?: boolean;
  onlyVerified?: boolean;
  sortBy?: 'recommended' | 'price-asc' | 'price-desc' | 'popular' | 'newest' | 'distance';
  userLat?: number;
  userLng?: number;
}
