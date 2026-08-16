import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Store,
  Package,
  MapPin,
  Sparkles,
  MessageCircle,
  Eye,
  CheckCircle2,
  Users,
  Clock,
  Star,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import StoreModerationList from '@/components/admin/StoreModerationList';

export const metadata = {
  title: 'Painel Administrativo | Descubra Artes',
  description: 'Gestão de artesãos, produtos, moderação e curadoria turística regional.',
};

export default async function AdminPage() {
  const metrics = await storeService.getAdminMetrics();
  const allStores = await storeService.getAllStoresForAdmin();

  const cards = [
    {
      title: 'Total de Artesãos',
      value: metrics.totalArtisans,
      sub: `${metrics.sourcesBreakdown.selfService} self-service • ${metrics.sourcesBreakdown.adminAssisted} assistidos`,
      icon: <Users size={22} className="text-[#1B4332]" />,
      bg: 'bg-[#D8F3DC]',
    },
    {
      title: 'Lojas Cadastradas',
      value: metrics.totalStores,
      sub: `${metrics.approvedStores} ativas • ${metrics.pendingStores} pendentes`,
      icon: <Store size={22} className="text-[#7F4F24]" />,
      bg: 'bg-[#FEF9EF]',
    },
    {
      title: 'Produtos & Peças',
      value: metrics.totalProducts,
      sub: `${metrics.pendingProducts} pendentes de análise`,
      icon: <Package size={22} className="text-[#C85A32]" />,
      bg: 'bg-[#FDE8E1]',
    },
    {
      title: 'Cliques no WhatsApp',
      value: metrics.totalWhatsAppClicks,
      sub: 'Conversões diretas de turistas',
      icon: <MessageCircle size={22} className="text-[#1EBE5B]" />,
      bg: 'bg-[#E8F8EE]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#7F4F24] text-xs font-bold uppercase tracking-wider mb-1 border border-[#EDE5D8]">
            <Shield size={13} className="text-[#C85A32]" />
            <span>Curadoria Oficial do Portal</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332]">
            Painel Geral do Administrador
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Supervisione ateliês de São Roque, aprove cadastros, defina destaques e conceda selos verificados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/artesaos/novo"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <PlusCircle size={15} />
            <span>+ Cadastrar Artesão</span>
          </Link>
        </div>
      </div>

      {/* Campaign 50 Founding Artisans Banner */}
      <div className="bg-linear-to-r from-[#1B4332] to-[#2D6A4F] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9C46A] text-[#1B4332] text-xs font-extrabold uppercase tracking-wider">
            <Star size={13} className="fill-[#1B4332]" />
            <span>Campanha de Lançamento — São Roque</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-white">
            Primeiros 50 Artesãos Fundadores
          </h2>
          <p className="text-xs text-white/80 leading-relaxed font-light">
            Meta inicial de cadastros assistidos e self-service para consolidar a rota turística e vitrine de artesanato de São Roque.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 min-w-[280px] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#E9C46A]">
            <span>ARTESÃOS FUNDADORES</span>
            <span>{metrics.foundingCampaign.count} / {metrics.foundingCampaign.target}</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#E9C46A] to-[#F4A261] rounded-full transition-all duration-500"
              style={{ width: `${metrics.foundingCampaign.percentage}%` }}
            />
          </div>
          <span className="text-[11px] text-white/90 block text-right font-medium">
            {metrics.foundingCampaign.remaining} vagas restantes para fechar 50
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-[#EDE5D8] shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#7F4F24] uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-serif font-extrabold text-[#2C2623]">
                {card.value}
              </div>
              <p className="text-[11px] text-[#7F4F24] mt-0.5">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Origins Breakdown & Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Onboarding Source Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#1B4332] flex items-center gap-2">
            <Users size={16} className="text-[#C85A32]" />
            <span>Origem dos Cadastros</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#1B4332] block">Self-Service</span>
                <span className="text-[11px] text-[#7F4F24]">Artesãos que cadastraram pelo portal</span>
              </div>
              <span className="text-xl font-serif font-extrabold text-[#1B4332]">
                {metrics.sourcesBreakdown.selfService}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#C85A32] block">Admin-Assisted (Convites)</span>
                <span className="text-[11px] text-[#7F4F24]">Cadastrados pela curadoria</span>
              </div>
              <span className="text-xl font-serif font-extrabold text-[#C85A32]">
                {metrics.sourcesBreakdown.adminAssisted}
              </span>
            </div>
          </div>
        </div>

        {/* Cities Breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#1B4332] flex items-center gap-2">
              <MapPin size={16} className="text-[#C85A32]" />
              <span>Distribuição por Destinos Turísticos</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {metrics.citiesBreakdown.map((city, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8]">
                <div className="font-serif font-bold text-xs text-[#1B4332]">
                  {city.name}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#7F4F24] mt-2">
                  <span>{city.stores} ateliês</span>
                  <span>{city.products} peças</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Moderation List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-[#1B4332]">
            Moderação Rápida de Ateliês
          </h3>
          <Link
            href="/admin/artesaos"
            className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1"
          >
            <span>Ver todos os artesãos</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <StoreModerationList initialStores={allStores} />
      </div>
    </div>
  );
}
