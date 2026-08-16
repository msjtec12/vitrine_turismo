import React from 'react';
import Link from 'next/link';
import { Sparkles, Store as StoreIcon, Package, CheckCircle2, Star, ArrowRight, ExternalLink } from 'lucide-react';
import { storeService } from '@/lib/data/store-service';

export const metadata = {
  title: 'Gestão de Destaques | Admin Descubra Artes',
  description: 'Controle de vitrines em destaque na Home e nas páginas das cidades.',
};

export default async function AdminDestaquesPage() {
  const [stores, products] = await Promise.all([
    storeService.getFeaturedStores(20),
    storeService.getFeaturedProducts(20),
  ]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF9EF] text-[#7F4F24] text-xs font-bold uppercase tracking-wider mb-2 border border-[#EDE5D8]">
          <Sparkles size={13} className="text-[#C85A32]" />
          <span>Curadoria de Exposição</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332]">
          Destaques na Home & Cidades
        </h1>
        <p className="text-xs text-[#7F4F24] mt-1">
          Lojas e peças com prioridade de exibição para turistas em São Roque e polos culturais.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Stores */}
        <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDE5D8] pb-3">
            <h3 className="font-serif font-bold text-lg text-[#1B4332] flex items-center gap-2">
              <StoreIcon size={18} className="text-[#C85A32]" />
              <span>Ateliês em Destaque ({stores.length})</span>
            </h3>
            <Link
              href="/admin/artesaos"
              className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1"
            >
              <span>Gerenciar</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={store.logoUrl}
                    alt={store.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#EDE5D8]"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1B4332]">
                      {store.name}
                    </h4>
                    <span className="text-[11px] text-[#7F4F24]">
                      {store.city?.name || 'São Roque'} • {store.whatsappClicksCount} contatos
                    </span>
                  </div>
                </div>

                <Link
                  href={`/admin/artesaos/${store.artisanId || store.id}`}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#EDE5D8] text-xs font-bold text-[#1B4332] hover:bg-[#EDE5D8] transition-colors"
                >
                  Editar
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDE5D8] pb-3">
            <h3 className="font-serif font-bold text-lg text-[#1B4332] flex items-center gap-2">
              <Package size={18} className="text-[#C85A32]" />
              <span>Peças em Destaque ({products.length})</span>
            </h3>
            <Link
              href="/admin/produtos"
              className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1"
            >
              <span>Moderar</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.coverImage}
                    alt={product.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#EDE5D8]"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1B4332]">
                      {product.name}
                    </h4>
                    <span className="text-[11px] text-[#C85A32] font-bold">
                      R$ {product.price.toFixed(2)} • {product.store?.name}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/produto/${product.slug}`}
                  target="_blank"
                  className="p-2 rounded-xl text-[#7F4F24] hover:bg-[#EDE5D8] transition-colors"
                >
                  <ExternalLink size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
