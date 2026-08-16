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
} from 'lucide-react';
import { Artisan, ArtisanStatus, OnboardingSource, City } from '@/types';
import { storeService } from '@/lib/data/store-service';
import { VerifiedBadge } from '@/components/ui/Badges';

interface AdminArtesaosListClientProps {
  initialArtisans: Artisan[];
  cities: City[];
}

export default function AdminArtesaosListClient({
  initialArtisans,
  cities,
}: AdminArtesaosListClientProps) {
  const [artisans, setArtisans] = useState<Artisan[]>(initialArtisans);
  const [statusFilter, setStatusFilter] = useState<ArtisanStatus | 'ALL'>('ALL');
  const [sourceFilter, setSourceFilter] = useState<OnboardingSource | 'ALL'>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopyLink = (token: string) => {
    const fullUrl = `${window.location.origin}/convite/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 3000);
  };

  const filteredArtisans = artisans.filter((artisan) => {
    if (statusFilter !== 'ALL' && artisan.status !== statusFilter) return false;
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

  const getStatusBadge = (status: ArtisanStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D8F3DC] text-[#1B4332] text-[11px] font-bold">
            <CheckCircle2 size={12} className="text-[#2D6A4F]" />
            <span>Aprovado</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF9EF] text-[#C85A32] text-[11px] font-bold border border-[#EDE5D8]">
            <Clock size={12} className="text-[#C85A32]" />
            <span>Pendente</span>
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
            <AlertTriangle size={12} />
            <span>Suspenso</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-bold">
            <XCircle size={12} />
            <span>Rejeitado</span>
          </span>
        );
    }
  };

  const getSourceBadge = (source: OnboardingSource) => {
    switch (source) {
      case 'SELF_SERVICE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B4332] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EDE5D8]">
            Self-Service
          </span>
        );
      case 'ADMIN_ASSISTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C85A32] bg-[#FDE8E1] px-2 py-0.5 rounded-md">
            Assistido (Admin)
          </span>
        );
      case 'PARTNER':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7F4F24] bg-[#FEF9EF] px-2 py-0.5 rounded-md">
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
            <span>Gestão de Contas & Lojas</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332]">
            Artesãos & Ateliês
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Supervisione cadastros próprios (self-service), convites assistidos e moderação de vitrines.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7F4F24]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, email ou loja..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-xs font-medium focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
            >
              <option value="ALL">Status: Todos</option>
              <option value="PENDING">Status: Pendentes</option>
              <option value="APPROVED">Status: Aprovados</option>
              <option value="SUSPENDED">Status: Suspensos</option>
              <option value="REJECTED">Status: Rejeitados</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-xs font-medium focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
            >
              <option value="ALL">Origem: Todas</option>
              <option value="SELF_SERVICE">Origem: Self-Service</option>
              <option value="ADMIN_ASSISTED">Origem: Admin-Assisted (Convite)</option>
              <option value="PARTNER">Origem: Parcerias Locais</option>
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
          <span>Exibindo <strong>{filteredArtisans.length}</strong> artesãos</span>
          {(statusFilter !== 'ALL' || sourceFilter !== 'ALL' || cityFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setSourceFilter('ALL');
                setCityFilter('ALL');
                setSearchQuery('');
              }}
              className="text-[#C85A32] hover:underline font-semibold"
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
                <th className="px-6 py-4">Artesão & Contato</th>
                <th className="px-6 py-4">Loja Vinculada</th>
                <th className="px-6 py-4">Origem</th>
                <th className="px-6 py-4">Status & Selos</th>
                <th className="px-6 py-4">Convite</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE5D8]">
              {filteredArtisans.map((artisan) => {
                const store = artisan.stores?.[0];
                return (
                  <tr key={artisan.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Artisan Name & Phone */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={artisan.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={artisan.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-[#EDE5D8]"
                        />
                        <div>
                          <Link
                            href={`/admin/artesaos/${artisan.id}`}
                            className="font-serif font-bold text-sm text-[#1B4332] hover:text-[#C85A32] transition-colors"
                          >
                            {artisan.fullName}
                          </Link>
                          <p className="text-[11px] text-[#7F4F24] mt-0.5">{artisan.email}</p>
                          <p className="text-[11px] text-[#7F4F24] font-medium">{artisan.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Store Name & City */}
                    <td className="px-6 py-4">
                      {store ? (
                        <div>
                          <div className="font-semibold text-xs text-[#2C2623]">
                            {store.name}
                          </div>
                          <span className="text-[11px] text-[#7F4F24]">
                            {store.city?.name || 'São Roque'} • {store.productsCount || 0} produtos
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Sem loja ativa</span>
                      )}
                    </td>

                    {/* Origin */}
                    <td className="px-6 py-4">
                      {getSourceBadge(artisan.onboardingSource)}
                    </td>

                    {/* Status & Badges */}
                    <td className="px-6 py-4 space-y-1">
                      <div>{getStatusBadge(artisan.status)}</div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {artisan.verified && <VerifiedBadge size="sm" showText={false} />}
                        {artisan.foundingMember && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FEF9EF] text-[#7F4F24] text-[10px] font-bold border border-[#EDE5D8]">
                            <Star size={10} className="text-[#E9C46A] fill-[#E9C46A]" />
                            <span>Fundador</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Invitation Status & Token */}
                    <td className="px-6 py-4">
                      {artisan.invitationToken ? (
                        <div className="space-y-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              artisan.invitationStatus === 'ACCEPTED'
                                ? 'bg-[#D8F3DC] text-[#1B4332]'
                                : 'bg-[#FEF9EF] text-[#C85A32]'
                            }`}
                          >
                            {artisan.invitationStatus === 'ACCEPTED' ? 'Aceito' : 'Aguardando Aceite'}
                          </span>
                          {artisan.invitationStatus !== 'ACCEPTED' && (
                            <div>
                              <button
                                onClick={() => handleCopyLink(artisan.invitationToken!)}
                                className="inline-flex items-center gap-1 text-[11px] text-[#C85A32] hover:underline font-semibold cursor-pointer"
                              >
                                {copiedToken === artisan.invitationToken ? (
                                  <>
                                    <Check size={12} className="text-green-600" />
                                    <span className="text-green-600">Copiado!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={12} />
                                    <span>Copiar Convite</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/artesaos/${artisan.id}`}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#1B4332] font-bold text-xs transition-colors"
                        >
                          Ver Detalhes
                        </Link>
                        {store && (
                          <Link
                            href={`/loja/${store.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-[#7F4F24] hover:bg-[#FAF7F2] transition-colors"
                            title="Ver vitrine pública"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
