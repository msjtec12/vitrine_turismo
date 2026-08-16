'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Shield,
  Star,
} from 'lucide-react';
import { Store, StoreStatus } from '@/types';
import { storeService } from '@/lib/data/store-service';

interface StoreModerationListProps {
  initialStores: Store[];
}

export default function StoreModerationList({ initialStores }: StoreModerationListProps) {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const handleStatusChange = async (storeId: string, newStatus: StoreStatus) => {
    const success = await storeService.setStoreStatus(storeId, newStatus);
    if (success) {
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, status: newStatus } : s))
      );
    }
  };

  const handleToggleVerified = async (storeId: string) => {
    const success = await storeService.toggleStoreVerified(storeId);
    if (success) {
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, verified: !s.verified } : s))
      );
    }
  };

  const handleToggleFeatured = async (storeId: string) => {
    const success = await storeService.toggleStoreFeatured(storeId);
    if (success) {
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, isFeatured: !s.isFeatured } : s))
      );
    }
  };

  const filteredStores = filterStatus === 'ALL'
    ? stores
    : stores.filter((s) => s.status === filterStatus);

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5D8] shadow-xs overflow-hidden">
      {/* Header & Filter Tabs */}
      <div className="p-5 border-b border-[#EDE5D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#1B4332] flex items-center gap-2">
            <Shield size={20} className="text-[#C85A32]" />
            <span>Moderação de Lojas & Ateliês</span>
          </h3>
          <p className="text-xs text-[#7F4F24] mt-0.5">
            Gerencie aprovações, selos de verificação e posições de destaque
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EDE5D8]">
          {['ALL', 'APPROVED', 'PENDING', 'SUSPENDED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#7F4F24] hover:text-[#2C2623]'
              }`}
            >
              {st === 'ALL'
                ? `Todos (${stores.length})`
                : st === 'APPROVED'
                ? 'Aprovados'
                : st === 'PENDING'
                ? 'Pendentes'
                : 'Suspensos'}
            </button>
          ))}
        </div>
      </div>

      {/* Stores Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2] text-[#7F4F24] uppercase font-bold tracking-wider border-b border-[#EDE5D8]">
            <tr>
              <th className="px-5 py-3.5">Ateliê / Artesão</th>
              <th className="px-4 py-3.5">Cidade & Categoria</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Selo Verificado</th>
              <th className="px-4 py-3.5">Destaque</th>
              <th className="px-5 py-3.5 text-right">Ações de Moderação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE5D8]">
            {filteredStores.map((store) => (
              <tr key={store.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                {/* Store Name and Logo */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={store.logoUrl}
                      alt={store.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#EDE5D8] shrink-0"
                    />
                    <div>
                      <div className="font-serif font-bold text-sm text-[#1B4332] flex items-center gap-1.5">
                        <span>{store.name}</span>
                        <Link href={`/loja/${store.slug}`} target="_blank" className="text-[#9E9188] hover:text-[#C85A32]">
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                      <span className="text-xs text-[#7F4F24]">{store.artisanName}</span>
                    </div>
                  </div>
                </td>

                {/* City and Category */}
                <td className="px-4 py-4">
                  <div className="font-medium text-[#2C2623]">
                    {store.city?.name || 'São Roque'} - {store.city?.uf || 'SP'}
                  </div>
                  <span className="text-[11px] text-[#9E9188]">
                    {store.category?.name || 'Geral'}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="px-4 py-4">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      store.status === 'APPROVED'
                        ? 'bg-[#D8F3DC] text-[#1B4332]'
                        : store.status === 'PENDING'
                        ? 'bg-[#FEF9EF] text-[#D4A373]'
                        : 'bg-[#FDE8E1] text-[#C85A32]'
                    }`}
                  >
                    {store.status === 'APPROVED'
                      ? 'Aprovado'
                      : store.status === 'PENDING'
                      ? 'Pendente'
                      : 'Suspenso'}
                  </span>
                </td>

                {/* Verified Toggle */}
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleToggleVerified(store.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                      store.verified
                        ? 'bg-[#D8F3DC] text-[#1B4332] border-[#2D6A4F]/30'
                        : 'bg-gray-100 text-gray-500 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    <span>{store.verified ? 'Verificado' : 'Não Verificado'}</span>
                  </button>
                </td>

                {/* Featured Toggle */}
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleToggleFeatured(store.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                      store.isFeatured
                        ? 'bg-[#E9C46A] text-[#4A3525] border-[#D4A373]'
                        : 'bg-gray-100 text-gray-500 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Sparkles size={12} />
                    <span>{store.isFeatured ? 'Em Destaque' : 'Normal'}</span>
                  </button>
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right space-x-1.5">
                  {store.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleStatusChange(store.id, 'APPROVED')}
                      className="px-2.5 py-1 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Aprovar
                    </button>
                  )}
                  {store.status === 'APPROVED' && (
                    <button
                      onClick={() => handleStatusChange(store.id, 'SUSPENDED')}
                      className="px-2.5 py-1 bg-[#C85A32] hover:bg-[#A4421F] text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Suspender
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
