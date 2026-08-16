import { PlanType, PlanEntitlements, ManualOverrides, Store, AccountStatus, PlanStatus } from '@/types';

export const PLAN_LIMITS: Record<PlanType, PlanEntitlements> = {
  FREE: {
    maxProducts: 10,
    maxPhotosPerProduct: 10,
    canCreateOffers: false,
    canFeatured: false,
    canVerifiedBadge: false,
    canAdvancedStats: false,
    canPriorityExposure: false,
  },
  PROFESSIONAL: {
    maxProducts: null, // Ilimitado
    maxPhotosPerProduct: 20,
    canCreateOffers: true,
    canFeatured: true,
    canVerifiedBadge: true,
    canAdvancedStats: true,
    canPriorityExposure: true,
  },
  PRO: {
    maxProducts: null, // Alias para PROFESSIONAL
    maxPhotosPerProduct: 20,
    canCreateOffers: true,
    canFeatured: true,
    canVerifiedBadge: true,
    canAdvancedStats: true,
    canPriorityExposure: true,
  },
  PREMIUM: {
    maxProducts: null,
    maxPhotosPerProduct: 30,
    canCreateOffers: true,
    canFeatured: true,
    canVerifiedBadge: true,
    canAdvancedStats: true,
    canPriorityExposure: true,
  },
};

export interface EffectiveEntitlements extends PlanEntitlements {
  effectivePlan: PlanType;
  isExpired: boolean;
  isActive: boolean;
  isSuspended: boolean;
  isBlocked: boolean;
  isPending: boolean;
  isVerifiedEffective: boolean;
  isFeaturedEffective: boolean;
  usedProducts: number;
  remainingProducts: number | null;
  canAddProduct: boolean;
  productLimitPercentage: number | null;
  lockReason?: string;
}

/**
 * Calcula os entitlements e permissões consolidadas de uma loja
 * considerando plano, data de validade, status da conta e overrides manuais.
 */
export function getStoreEffectiveEntitlements(
  store?: Store | null,
  currentProductsCount?: number
): EffectiveEntitlements {
  if (!store) {
    const freeBase = PLAN_LIMITS.FREE;
    const usedProducts = currentProductsCount || 0;
    const maxProducts = freeBase.maxProducts;
    const remainingProducts = maxProducts !== null ? Math.max(0, maxProducts - usedProducts) : null;
    const canAddProduct = maxProducts === null || usedProducts < maxProducts;
    return {
      ...freeBase,
      effectivePlan: 'FREE',
      isExpired: false,
      isActive: true,
      isSuspended: false,
      isBlocked: false,
      isPending: false,
      isVerifiedEffective: false,
      isFeaturedEffective: false,
      usedProducts,
      remainingProducts,
      canAddProduct,
      productLimitPercentage: maxProducts !== null ? Math.min(100, Math.round((usedProducts / maxProducts) * 100)) : 0,
      lockReason: canAddProduct ? undefined : `Seu plano atual permite até ${maxProducts} produtos. Faça upgrade para continuar cadastrando.`,
    };
  }

  // 1. Checa expiração da validade
  const now = Date.now();
  const isExpired = Boolean(
    store.planExpiresAt &&
    new Date(store.planExpiresAt).getTime() < now &&
    store.planStatus === 'ACTIVE'
  );

  // 2. Determina o plano efetivo
  let effectivePlan: PlanType = store.planType || 'FREE';
  if (isExpired || store.planStatus === 'EXPIRED') {
    effectivePlan = 'FREE';
  }

  const base = PLAN_LIMITS[effectivePlan] || PLAN_LIMITS.FREE;
  const overrides: ManualOverrides = store.manualOverrides || {};

  // 3. Aplica overrides administrativos individuais (se houver)
  const maxProducts = overrides.maxProducts !== undefined ? overrides.maxProducts : base.maxProducts;
  const maxPhotosPerProduct = overrides.maxPhotosPerProduct !== undefined ? overrides.maxPhotosPerProduct : base.maxPhotosPerProduct;
  const canCreateOffers = overrides.canCreateOffers !== undefined ? overrides.canCreateOffers : base.canCreateOffers;
  const canFeatured = overrides.canFeatured !== undefined ? overrides.canFeatured : base.canFeatured;
  const canVerifiedBadge = overrides.canVerifiedBadge !== undefined ? overrides.canVerifiedBadge : base.canVerifiedBadge;
  const canAdvancedStats = overrides.canAdvancedStats !== undefined ? overrides.canAdvancedStats : base.canAdvancedStats;
  const canPriorityExposure = overrides.canPriorityExposure !== undefined ? overrides.canPriorityExposure : base.canPriorityExposure;

  // 4. Status da conta
  const accountStatus: AccountStatus = store.accountStatus || (store.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE');
  const isSuspended = accountStatus === 'SUSPENDED' || store.status === 'SUSPENDED';
  const isBlocked = accountStatus === 'BLOCKED';
  const isPending = accountStatus === 'PENDING' || store.status === 'PENDING';
  const isActive = accountStatus === 'ACTIVE' && !isSuspended && !isBlocked;

  // 5. Selos e Destaques efetivos
  const isVerifiedEffective = Boolean(canVerifiedBadge && store.verified);
  const isFeaturedEffective = Boolean(canFeatured && store.isFeatured);

  // 6. Limite de Produtos
  const usedProducts = currentProductsCount ?? store.productsCount ?? 0;
  const remainingProducts = maxProducts !== null ? Math.max(0, maxProducts - usedProducts) : null;
  
  let canAddProduct = isActive;
  let lockReason: string | undefined = undefined;

  if (isBlocked) {
    canAddProduct = false;
    lockReason = 'Sua conta está bloqueada pelo administrador. Entre em contato com o suporte.';
  } else if (isSuspended) {
    canAddProduct = false;
    lockReason = 'Sua conta está suspensa temporariamente.';
  } else if (maxProducts !== null && usedProducts >= maxProducts) {
    canAddProduct = false;
    lockReason = `Seu plano atual permite até ${maxProducts} produtos. Faça upgrade para continuar cadastrando.`;
  }

  const productLimitPercentage = maxProducts !== null
    ? Math.min(100, Math.round((usedProducts / maxProducts) * 100))
    : null;

  return {
    effectivePlan,
    maxProducts,
    maxPhotosPerProduct,
    canCreateOffers,
    canFeatured,
    canVerifiedBadge,
    canAdvancedStats,
    canPriorityExposure,
    isExpired,
    isActive,
    isSuspended,
    isBlocked,
    isPending,
    isVerifiedEffective,
    isFeaturedEffective,
    usedProducts,
    remainingProducts,
    canAddProduct,
    productLimitPercentage,
    lockReason,
  };
}

export function getPlanDisplayName(plan?: PlanType): string {
  switch (plan) {
    case 'PROFESSIONAL':
    case 'PRO':
      return 'Plano Profissional';
    case 'PREMIUM':
      return 'Plano Premium';
    case 'FREE':
    default:
      return 'Plano Gratuito';
  }
}

export function getAccountStatusBadge(status?: AccountStatus) {
  switch (status) {
    case 'ACTIVE':
      return { label: 'Ativa', color: 'bg-[#D8F3DC] text-[#1B4332] border-[#2D6A4F]/30' };
    case 'SUSPENDED':
      return { label: 'Suspensa', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'BLOCKED':
      return { label: 'Bloqueada', color: 'bg-red-100 text-red-800 border-red-300' };
    case 'PENDING':
      return { label: 'Pendente', color: 'bg-[#FEF9EF] text-[#7F4F24] border-[#EDE5D8]' };
    default:
      return { label: 'Ativa', color: 'bg-[#D8F3DC] text-[#1B4332] border-[#2D6A4F]/30' };
  }
}

export function getPlanStatusBadge(status?: PlanStatus) {
  switch (status) {
    case 'ACTIVE':
      return { label: 'Ativo', color: 'bg-[#D8F3DC] text-[#1B4332]' };
    case 'EXPIRED':
      return { label: 'Expirado', color: 'bg-red-100 text-red-800' };
    case 'CANCELLED':
      return { label: 'Cancelado', color: 'bg-gray-100 text-gray-700' };
    case 'MANUAL':
      return { label: 'Manual', color: 'bg-purple-100 text-purple-800' };
    default:
      return { label: 'Ativo', color: 'bg-[#D8F3DC] text-[#1B4332]' };
  }
}
