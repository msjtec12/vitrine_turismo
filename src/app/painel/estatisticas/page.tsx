'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Sparkles, MessageCircle, Eye, Heart, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { storeService } from '@/lib/data/store-service';
import { Store } from '@/types';
import { getStoreEffectiveEntitlements } from '@/lib/plans/entitlements';
import ArtisanStatsCard from '@/components/artisan/ArtisanStatsCard';
import ArtisanViewsChart from '@/components/artisan/ArtisanViewsChart';

export default function PainelEstatisticasPage() {
  const { activeStoreId, user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      let targetStoreId = activeStoreId;
      if (!targetStoreId && user?.email) {
        const s = await storeService.getStoreByEmail(user.email);
        if (s) targetStoreId = s.id;
      }
      if (targetStoreId) {
        const [loadedStore, res] = await Promise.all([
          storeService.getStoreById(targetStoreId),
          storeService.getArtisanStats(targetStoreId),
        ]);
        if (loadedStore) setStore(loadedStore);
        setStats(res);
      } else {
        setStore(null);
        setStats({
          storeViews: 0,
          productViews: 0,
          whatsappClicks: 0,
          favorites: 0,
          viewsCount: 0,
          whatsappClicksCount: 0,
          favoritesCount: 0,
          totalProducts: 0,
          conversionRate: '0.0',
          chartData: [
            { label: 'Seg', date: 'Seg', views: 0, clicks: 0 },
            { label: 'Ter', date: 'Ter', views: 0, clicks: 0 },
            { label: 'Qua', date: 'Qua', views: 0, clicks: 0 },
            { label: 'Qui', date: 'Qui', views: 0, clicks: 0 },
            { label: 'Sex', date: 'Sex', views: 0, clicks: 0 },
            { label: 'Sáb', date: 'Sáb', views: 0, clicks: 0 },
          ],
        });
      }
      setLoading(false);
    }
    loadStats();
  }, [activeStoreId, user]);

  const entitlements = getStoreEffectiveEntitlements(store);

  const whatsappUpgradeUrl = `https://wa.me/5516991551200?text=${encodeURIComponent(
    `Olá! Gostaria de fazer o upgrade para o Plano Profissional (R$ 49,90/mês) no Descubra Artes para liberar as estatísticas avançadas da loja "${store?.name || 'meu ateliê'}".`
  )}`;

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-white rounded-3xl border border-[#EDE5D8]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-[#EDE5D8]" />
          ))}
        </div>
      </div>
    );
  }

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

      {entitlements.canAdvancedStats ? (
        <ArtisanViewsChart initialData={stats.chartData} />
      ) : (
        /* Locked Advanced Analytics Teaser for Free Tier */
        <div className="bg-white p-8 rounded-3xl border border-[#EDE5D8] shadow-xs text-center space-y-4 relative overflow-hidden">
          <div className="filter blur-xs select-none opacity-40 pointer-events-none">
            <ArtisanViewsChart initialData={stats.chartData} />
          </div>

          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex flex-col items-center justify-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF9EF] text-[#C85A32] flex items-center justify-center border border-[#EDE5D8]">
              <Lock size={22} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1B4332]">
              Gráficos Detalhados & Origem de Tráfego
            </h3>
            <p className="text-xs text-[#7F4F24] max-w-md">
              Desbloqueie relatórios de conversão diária por dia da semana e comportamento de turistas no <strong>Plano Profissional (R$ 49,90/mês)</strong>.
            </p>
            <a
              href={whatsappUpgradeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Desbloquear no Plano Profissional</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}

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
