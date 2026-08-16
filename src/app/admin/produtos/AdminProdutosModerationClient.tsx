'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Flame,
  Star,
  Store as StoreIcon,
} from 'lucide-react';
import { Product, ProductStatus } from '@/types';
import { storeService } from '@/lib/data/store-service';

interface AdminProdutosModerationClientProps {
  initialProducts: Product[];
}

export default function AdminProdutosModerationClient({
  initialProducts,
}: AdminProdutosModerationClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleModerate = async (productId: string, action: 'APPROVE' | 'REJECT' | 'SUSPEND') => {
    await storeService.moderateProduct(productId, action);
    setProducts(
      products.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            status: action === 'APPROVE' ? 'APPROVED' : action === 'REJECT' ? 'REJECTED' : 'SUSPENDED',
          };
        }
        return p;
      })
    );
  };

  const handleToggleFeatured = async (productId: string) => {
    await storeService.toggleProductFeatured(productId);
    setProducts(
      products.map((p) => {
        if (p.id === productId) {
          return { ...p, isFeatured: !p.isFeatured };
        }
        return p;
      })
    );
  };

  const filteredProducts = products.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchStore = p.store?.name.toLowerCase().includes(q);
      if (!matchName && !matchStore) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#7F4F24] text-xs font-bold uppercase tracking-wider mb-1 border border-[#EDE5D8]">
            <Package size={13} className="text-[#C85A32]" />
            <span>Curadoria de Peças</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332]">
            Moderação de Produtos
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Revise as peças submetidas por artesãos antes da publicação na vitrine regional.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7F4F24]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome da peça ou ateliê..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-xs font-medium focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
            >
              <option value="ALL">Status: Todos</option>
              <option value="PENDING">Status: Pendentes de Análise</option>
              <option value="APPROVED">Status: Aprovados (Públicos)</option>
              <option value="REJECTED">Status: Rejeitados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#EDE5D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#4A3525] border-b border-[#EDE5D8] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Peça Artesanal</th>
                <th className="px-6 py-4">Ateliê / Loja</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Destaque</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE5D8]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  {/* Photo & Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.coverImage}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#EDE5D8]"
                      />
                      <div>
                        <span className="font-serif font-bold text-sm text-[#1B4332] block">
                          {product.name}
                        </span>
                        <span className="text-[11px] text-[#7F4F24] line-clamp-1 max-w-xs">
                          {product.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Store Name */}
                  <td className="px-6 py-4">
                    <span className="font-semibold text-xs text-[#2C2623] block">
                      {product.store?.name || 'Ateliê'}
                    </span>
                    <span className="text-[10px] text-[#7F4F24]">
                      {product.city?.name || 'São Roque'} - SP
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-xs text-[#C85A32]">
                      R$ {product.price.toFixed(2)}
                    </div>
                    {product.isPromo && product.promoPrice && (
                      <span className="text-[10px] text-green-700 font-semibold block">
                        Promo: R$ {product.promoPrice.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        product.status === 'APPROVED'
                          ? 'bg-[#D8F3DC] text-[#1B4332]'
                          : 'bg-[#FEF9EF] text-[#C85A32] border border-[#EDE5D8]'
                      }`}
                    >
                      {product.status === 'APPROVED' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      <span>{product.status === 'APPROVED' ? 'Aprovado' : 'Pendente'}</span>
                    </span>
                  </td>

                  {/* Toggle Featured */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleFeatured(product.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        product.isFeatured
                          ? 'bg-[#FEF9EF] text-[#C85A32] border border-[#D4A373]'
                          : 'bg-[#FAF7F2] text-[#7F6A5D] hover:bg-[#EDE5D8]'
                      }`}
                    >
                      <Sparkles size={13} className={product.isFeatured ? 'text-[#C85A32]' : 'text-gray-400'} />
                      <span>{product.isFeatured ? 'Em Destaque' : 'Comum'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {product.status !== 'APPROVED' ? (
                        <button
                          onClick={() => handleModerate(product.id, 'APPROVE')}
                          className="px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          Aprovar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerate(product.id, 'REJECT')}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Pausar
                        </button>
                      )}

                      <Link
                        href={`/produto/${product.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-[#7F4F24] hover:bg-[#FAF7F2] transition-colors"
                        title="Ver vitrine"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
