'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Package, Store as StoreIcon, ArrowRight, Trash2 } from 'lucide-react';
import { useFavorites } from '@/lib/favorites-context';
import { mockProducts, mockStores, getHydratedProducts, getHydratedStores } from '@/lib/data/mock-data';
import ProductCard from '@/components/ui/ProductCard';
import StoreCard from '@/components/ui/StoreCard';

export default function FavoritosPage() {
  const { favoriteProductIds, favoriteStoreIds } = useFavorites();
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');

  const hydratedProducts = getHydratedProducts();
  const hydratedStores = getHydratedStores();

  const favProducts = hydratedProducts.filter((p) => favoriteProductIds.includes(p.id));
  const favStores = hydratedStores.filter((s) => favoriteStoreIds.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Header */}
      <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#EDE5D8]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              <Heart size={14} className="fill-[#C85A32]" />
              <span>Lista de Desejos & Lembranças</span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332] mt-1">
              Seus Itens Favoritos
            </h1>
            <p className="text-xs text-[#7F4F24] mt-1">
              Guarde produtos e ateliês para consultar durante sua viagem ou comprar pelo WhatsApp
            </p>
          </div>

          {/* Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#EDE5D8]">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#7F4F24] hover:text-[#2C2623]'
              }`}
            >
              <Package size={14} />
              <span>Produtos ({favProducts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'stores'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#7F4F24] hover:text-[#2C2623]'
              }`}
            >
              <StoreIcon size={14} />
              <span>Ateliês ({favStores.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'products' && (
        <>
          {favProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE5D8] p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center text-3xl mx-auto">
                ❤️
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1B4332]">
                Sua lista de produtos favoritos está vazia
              </h3>
              <p className="text-xs text-[#7F4F24] max-w-sm mx-auto">
                Ao navegar pelas peças artesanais, clique no ícone de coração para salvar aqui.
              </p>
              <Link
                href="/explorar"
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-[#1B4332] text-white text-xs font-bold shadow-md hover:bg-[#2D6A4F] transition-colors"
              >
                <span>Explorar Produtos de São Roque</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </>
      )}

      {activeTab === 'stores' && (
        <>
          {favStores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE5D8] p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center text-3xl mx-auto">
                🧵
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1B4332]">
                Nenhum ateliê salvo ainda
              </h3>
              <p className="text-xs text-[#7F4F24] max-w-sm mx-auto">
                Favorite ateliês e oficinas para entrar em contato rápido com os mestres artesãos.
              </p>
              <Link
                href="/explorar?tipo=lojas"
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-[#1B4332] text-white text-xs font-bold shadow-md hover:bg-[#2D6A4F] transition-colors"
              >
                <span>Conhecer Ateliês</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
