'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Store as StoreIcon,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Copy,
  Check,
  Send,
  Eye,
  Shield,
  Star,
  Flame,
  Settings,
  Calendar,
} from 'lucide-react';
import { Artisan, ArtisanStatus, OnboardingSource, City, Store, PlanType, AccountStatus } from '@/types';
import { storeService } from '@/lib/data/store-service';
import { VerifiedBadge } from '@/components/ui/Badges';
import { getStoreEffectiveEntitlements, getPlanDisplayName, getAccountStatusBadge, getPlanStatusBadge } from '@/lib/plans/entitlements';
import PlanEditorModal from '@/components/admin/PlanEditorModal';

interface AdminArtesaosListClientProps {
  initialArtisans: Artisan[];
  cities: City[];
}

export default function AdminArtesaosListClient({
  initialArtisans,
  cities,
}: AdminArtesaosListClientProps) {
  const [artisans, setArtisans] = useState<Artisan[]>(initialArtisans);
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'ALL'>('ALL');
  const [planFilter, setPlanFilter] = useState<PlanType | 'ALL'>('ALL');
  const [sourceFilter, setSourceFilter] = useState<OnboardingSource | 'ALL'>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Modal State
  const [selectedStoreForPlan, setSelectedStoreForPlan] = useState<Store | null>(null);

  const handleCopyLink = (token: string) => {
    const fullUrl = `${window.location.origin}/convite/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 3000);
  };

  const handlePlanSaved = (updatedStore: Store) => {
    setArtisans((prev) =>
      prev.map((artisan) => {
        if (artisan.stores?.some((s) => s.id === updatedStore.id)) {
          return {
            ...artisan,
            verified: updatedStore.verified,
            status: updatedStore.accountStatus === 'SUSPENDED' ? 'SUSPENDED' : updatedStore.accountStatus === 'BLOCKED' ? 'REJECTED' : 'APPROVED',
            stores: artisan.stores.map((s) => (s.id === updatedStore.id ? updatedStore : s)),
          };
        }
        return artisan;
      })
    );
    setSelectedStoreForPlan(null);
  };

  const filteredArtisans = artisans.filter((artisan) => {
    const store = artisan.stores?.[0];
    const storePlan: PlanType = store?.planType || 'FREE';
    const storeAccountStatus: AccountStatus = store?.accountStatus || (artisan.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE');

    if (statusFilter !== 'ALL' && storeAccountStatus !== statusFilter) return false;
    if (planFilter !== 'ALL') {
      if (planFilter === 'PROFESSIONAL' && storePlan !== 'PROFESSIONAL' && storePlan !== 'PRO') return false;
      if (planFilter === 'FREE' && storePlan !== 'FREE') return false;
      if (planFilter === 'PREMIUM' && storePlan !== 'PREMIUM') return false;
    }
    if (sourceFilter !== 'ALL' && artisan.onboardingSource !== sourceFilter) return false;

    if (cityFilter !== 'ALL') {
      const hasCity = artisan.stores?.some((s) => s.cityId === cityFilter);
      if (!hasCity) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = artisan.fullName.toLowerCase().includes(q);
      const matchEmail = artisan.email.toLowerCase().includes(q);
      const matchStore = artisan.stores?.some((s) => s.name.toLowerCase().includes(q));
      if (!matchName && !matchEmail && !matchStore) return false;
    }

    return true;
  });

  const getSourceBadge = (source: OnboardingSource) => {
    switch (source) {
      case 'SELF_SERVICE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1B4332] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EDE5D8]">
            Self-Service
          </span>
        );
      case 'ADMIN_ASSISTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#C85A32] bg-[#FDE8E1] px-2 py-0.5 rounded-md">
            Assistido
          </span>
        );
      case 'PARTNER':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#7F4F24] bg-[#FEF9EF] px-2 py-0.5 rounded-md">
            Parceria
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#7F4F24] text-xs font-bold uppercase tracking-wider mb-1 border border-[#EDE5D8]">
            <Users size={13} className="text-[#C85A32]" />
            <span>Gestão Master de Contas & Lojas</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332]">
            Produtores & Planos
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Controle manualmente planos, validades, limites de produtos, status de contas e permissões especiais.
          </p>
        </div>

        <Link
          href="/admin/artesaos/novo"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          <PlusCircle size={16} />
          <span>Cadastrar Artesão (Assistido)</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7F4F24]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por produtor, ateliê ou email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
            />
          </div>

          {/* Plan Filter */}
          <div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-xs font-medium focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
            >
              <option value="ALL">Plano: Todos</option>
              <option value="FREE">Plano Gratuito</option>
              <option value="PROFESSIONAL">Plano Profissional</option>
            </select>
          </div>

          {/* Account Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-xs font-medium focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
            >
              <option value="ALL">Status Conta: Todos</option>
              <option value="ACTIVE">Ativa</option>
              <option value="SUSPENDED">Suspensa</option>
              <option value="PENDING">Pendente</option>
              <option value="BLOCKED">Bloqueada</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-xs font-medium focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
            >
              <option value="ALL">Cidade: Todas</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.uf}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#7F4F24] pt-2 border-t border-[#EDE5D8]">
          <span>Exibindo <strong>{filteredArtisans.length}</strong> produtores</span>
          {(statusFilter !== 'ALL' || planFilter !== 'ALL' || sourceFilter !== 'ALL' || cityFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setPlanFilter('ALL');
                setSourceFilter('ALL');
                setCityFilter('ALL');
                setSearchQuery('');
              }}
              className="text-[#C85A32] hover:underline font-semibold cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Artisans Table / List */}
      <div className="bg-white rounded-3xl border border-[#EDE5D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#4A3525] border-b border-[#EDE5D8] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-5 py-4">Produtor / Loja</th>
                <th className="px-4 py-4">Cidade</th>
                <th className="px-4 py-4">Plano</th>
                <th className="px-4 py-4">Status Conta</th>
                <th className="px-4 py-4">Validade</th>
                <th className="px-4 py-4">Produtos</th>
                <th className="px-4 py-4">Selos</th>
                <th className="px-5 py-4 text-right">Ações Master</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE5D8]">
              {filteredArtisans.map((artisan) => {
                const store = artisan.stores?.[0];
                const entitlements = store ? getStoreEffectiveEntitlements(store) : null;
                const statusBadge = getAccountStatusBadge(store?.accountStatus || (artisan.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE'));

                return (
                  <tr key={artisan.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Artisan Name & Store */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={store?.logoUrl || artisan.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={artisan.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-[#EDE5D8]"
                        />
                        <div>
                          <Link
                            href={`/admin/artesaos/${artisan.id}`}
                            className="font-serif font-bold text-sm text-[#1B4332] hover:text-[#C85A32] transition-colors block"
                          >
                            {store?.name || artisan.fullName}
                          </Link>
                          <p className="text-[11px] text-[#7F4F24]">Por {artisan.fullName}</p>
                          <p className="text-[10px] text-[#9E9188]">{artisan.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* City */}
                    <td className="px-4 py-4">
                      <span className="font-medium text-[#4A3525]">
                        {store?.city?.name || 'São Roque'}
                      </span>
                    </td>

                    {/* Plan Badge */}
                    <td className="px-4 py-4">
                      {store ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            store.planType === 'PROFESSIONAL' || store.planType === 'PRO' || store.planType === 'PREMIUM'
                              ? 'bg-[#D8F3DC] text-[#1B4332]'
                              : 'bg-[#FAF7F2] text-[#7F4F24] border border-[#EDE5D8]'
                          }`}
                        >
                          {getPlanDisplayName(store.planType)}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Account Status */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>

                    {/* Validity */}
                    <td className="px-4 py-4 text-[11px]">
                      {store?.planExpiresAt ? (
                        <span className={entitlements?.isExpired ? 'text-red-600 font-bold' : 'text-[#4A3525]'}>
                          {new Date(store.planExpiresAt).toLocaleDateString('pt-BR')}
                        </span>
                      ) : (
                        <span className="text-[#2D6A4F] font-semibold">Sem expiração</span>
                      )}
                    </td>

                    {/* Product Limits */}
                    <td className="px-4 py-4">
                      {entitlements ? (
                        <div>
                          <span className="font-bold text-xs text-[#1B4332]">
                            {entitlements.usedProducts}
                          </span>
                          <span className="text-[11px] text-[#7F4F24]">
                            {' '}/ {entitlements.maxProducts !== null ? entitlements.maxProducts : '∞'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Badges (Verified & Featured) */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {store?.verified && (
                          <span title="Produtor Verificado">
                            <CheckCircle2 size={15} className="text-[#2D6A4F]" />
                          </span>
                        )}
                        {store?.isFeatured && (
                          <span title="Vitrine em Destaque">
                            <Star size={15} className="text-[#E9C46A] fill-[#E9C46A]" />
                          </span>
                        )}
                        {!store?.verified && !store?.isFeatured && (
                          <span className="text-gray-400 text-[10px]">—</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {store && (
                          <button
                            onClick={() => setSelectedStoreForPlan(store)}
                            className="px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Settings size={13} />
                            <span>Gerenciar Plano</span>
                          </button>
                        )}
                        <Link
                          href={`/admin/artesaos/${artisan.id}`}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#7F4F24] font-semibold text-xs transition-colors"
                        >
                          Ficha
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Editor Modal */}
      {selectedStoreForPlan && (
        <PlanEditorModal
          store={selectedStoreForPlan}
          onClose={() => setSelectedStoreForPlan(null)}
          onSuccess={handlePlanSaved}
        />
      )}
    </div>
  );
}

