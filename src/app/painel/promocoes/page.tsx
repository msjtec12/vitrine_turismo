import React from 'react';
import { Flame, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import { Product } from '@/types';
import Link from 'next/link';

export default async function PainelPromocoesPage() {
  const products = await storeService.getStoreProducts('store-ceramica-da-terra');
  const promoProducts = products.filter((p: Product) => p.isPromo);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1B4332] flex items-center gap-2">
            <Flame size={22} className="text-[#C85A32]" />
            <span>Gestão de Promoções & Ofertas</span>
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Crie descontos para atrair turistas em feriados, festivais de inverno e datas comemorativas
          </p>
        </div>

        <Link
          href="/painel/produtos"
          className="px-5 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#A4421F] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
        >
          <span>Ativar Oferta em Produto</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {promoProducts.map((p: Product) => (
          <div
            key={p.id}
            className="bg-white p-5 rounded-2xl border border-[#EDE5D8] shadow-xs space-y-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={p.coverImage}
                alt={p.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#EDE5D8]"
              />
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-sm text-[#1B4332] truncate">
                  {p.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-[#C85A32] text-sm">
                    R$ {p.promoPrice?.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-xs text-[#9E9188] line-through">
                    R$ {p.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#FAF7F2] rounded-xl text-[11px] text-[#7F4F24] flex items-center justify-between">
              <span>Desconto ativo:</span>
              <span className="font-bold text-[#C85A32]">-{p.promoDiscountPercent || 20}% OFF</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
