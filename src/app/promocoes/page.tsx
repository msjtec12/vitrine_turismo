import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Sparkles } from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import ProductCard from '@/components/ui/ProductCard';

export const metadata = {
  title: 'Ofertas & Promoções da Região | Descubra Artes',
  description: 'Confira produtos artesanais com preços promocionais exclusivos em São Roque e cidades parceiras.',
};

export default async function PromocoesPage() {
  const promoProducts = await storeService.getPromoProducts(20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Header */}
      <div className="bg-[#FAF7F2] p-8 md:p-12 rounded-3xl border border-[#EDE5D8] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C85A32] text-white text-xs font-bold uppercase tracking-wider mb-3">
            <Flame size={14} />
            <span>Ofertas por Tempo Limitado</span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#1B4332]">
            Promoções & Lembranças da Região
          </h1>
          <p className="text-sm text-[#7F4F24] mt-2 leading-relaxed">
            Peças artesanais e sabores locais selecionados com valores especiais de temporada. Compre direto do produtor pelo WhatsApp.
          </p>
        </div>

        <Link
          href="/explorar"
          className="px-6 py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-all shadow-md shrink-0 text-center"
        >
          Explorar Todo o Catálogo
        </Link>
      </div>

      {/* Grid */}
      {promoProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promoProducts.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE5D8]">
          <p className="text-sm text-[#7F4F24]">Nenhuma promoção ativa no momento.</p>
        </div>
      )}
    </div>
  );
}
