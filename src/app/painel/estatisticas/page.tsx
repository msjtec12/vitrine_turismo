import React from 'react';
import { BarChart3, TrendingUp, Sparkles, MessageCircle, Eye, Heart } from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import ArtisanStatsCard from '@/components/artisan/ArtisanStatsCard';
import ArtisanViewsChart from '@/components/artisan/ArtisanViewsChart';

export default async function PainelEstatisticasPage() {
  const stats = await storeService.getArtisanStats('store-ceramica-da-terra');

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs">
        <h1 className="font-serif font-bold text-2xl text-[#1B4332] flex items-center gap-2">
          <BarChart3 size={22} className="text-[#C85A32]" />
          <span>Estatísticas & Métricas de Conversão</span>
        </h1>
        <p className="text-xs text-[#7F4F24] mt-1">
          Acompanhe como os turistas estão descobrindo sua vitrine e entrando em contato pelo WhatsApp
        </p>
      </div>

      <ArtisanStatsCard stats={stats} />

      <ArtisanViewsChart initialData={stats.chartData} />

      <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-lg text-[#1B4332]">
          💡 Dicas de Conversão Turística
        </h3>
        <ul className="space-y-2 text-xs text-[#4A3525]">
          <li className="flex items-start gap-2">
            <span className="text-[#C85A32] font-bold">•</span>
            <span>Responda as mensagens no WhatsApp em menos de 15 minutos para fechar mais encomendas durante os finais de semana.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C85A32] font-bold">•</span>
            <span>Inclua fotos do processo de produção: turistas adoram ver o barro sendo torneado ou a madeira sendo esculpida.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
