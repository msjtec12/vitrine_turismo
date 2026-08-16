import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  ArrowRight,
  Package,
  Flame,
  Store as StoreIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import ArtisanStatsCard from '@/components/artisan/ArtisanStatsCard';
import ArtisanViewsChart from '@/components/artisan/ArtisanViewsChart';

export const metadata = {
  title: 'Painel do Artesão | Descubra Artes',
  description: 'Gestão da sua loja, catálogo de produtos e estatísticas de conversão no WhatsApp.',
};

export default async function PainelDashboardPage() {
  const store = await storeService.getStoreById('store-ceramica-da-terra');
  const stats = await storeService.getArtisanStats('store-ceramica-da-terra');
  const products = await storeService.getProductsByStoreId('store-ceramica-da-terra');
  const completeness = store ? storeService.calculateStoreCompleteness(store, products) : undefined;

  const getStatusBanner = () => {
    if (!store) return null;

    if (store.status === 'APPROVED') {
      return (
        <div className="bg-[#D8F3DC] border border-[#2D6A4F]/20 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#1B4332]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <span className="font-serif font-bold text-sm block">
                🟢 Sua loja está publicada e ativa na vitrine regional
              </span>
              <span className="text-xs text-[#2D6A4F]">
                Turistas de São Roque já podem encontrar seu ateliê e enviar mensagens no WhatsApp.
              </span>
            </div>
          </div>

          <Link
            href={`/loja/${store.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#2D6A4F] transition-colors shrink-0 shadow-2xs"
          >
            <span>Ver Vitrine Pública</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      );
    }

    if (store.adminNotes && store.status === 'PENDING') {
      return (
        <div className="bg-amber-50 border border-amber-300 p-5 rounded-2xl space-y-3 text-amber-900">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertTriangle size={18} className="text-amber-700" />
            <span>⚠️ Precisamos de algumas alterações antes de publicar sua loja</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 border border-amber-200 text-xs">
            <span className="font-bold block text-amber-900 mb-1">Mensagem da Equipe de Curadoria:</span>
            <p className="text-amber-800 leading-relaxed italic">{store.adminNotes}</p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Link
              href="/painel/loja"
              className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors"
            >
              Editar Minha Loja
            </Link>
            <span className="text-xs text-amber-800">
              Após ajustar, nossa equipe revisará seu ateliê em até 24h.
            </span>
          </div>
        </div>
      );
    }

    if (store.status === 'PENDING') {
      return (
        <div className="bg-[#FEF9EF] border border-[#EDE5D8] p-5 rounded-2xl flex items-center gap-3 text-[#7F4F24]">
          <div className="w-8 h-8 rounded-full bg-[#E9C46A] text-[#1B4332] flex items-center justify-center shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <span className="font-serif font-bold text-sm block text-[#1B4332]">
              🟡 Sua loja está em análise pela curadoria
            </span>
            <span className="text-xs text-[#7F4F24]">
              Nossa equipe está revisando suas informações. Você pode continuar cadastrando produtos enquanto isso!
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-center gap-3 text-red-900">
        <XCircle size={20} className="text-red-600 shrink-0" />
        <div>
          <span className="font-bold text-sm block">🔴 Loja temporariamente suspensa</span>
          <span className="text-xs text-red-800">Entre em contato com o suporte para reativação.</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            <Sparkles size={14} />
            <span>Visão Geral do Ateliê</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332] mt-1">
            Olá, {store?.artisanName || 'Mestre Artesão'} 👋
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Vamos deixar sua loja ainda mais completa para encantar turistas e clientes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/painel/produtos"
            className="px-5 py-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 shrink-0"
          >
            <Plus size={16} />
            <span>Adicionar Produto</span>
          </Link>
        </div>
      </div>

      {/* Dynamic Status Banner */}
      {getStatusBanner()}

      {/* Store Completeness Progress Box */}
      {completeness && (
        <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
                Qualidade da Vitrine
              </span>
              <h3 className="font-serif font-bold text-lg text-[#1B4332]">
                Perfil da loja: {completeness.score}% completo
              </h3>
            </div>
            <div className="w-full sm:w-48 h-3 bg-[#EDE5D8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1B4332] rounded-full transition-all duration-500"
                style={{ width: `${completeness.score}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {completeness.checklist.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  item.completed
                    ? 'bg-[#FAF7F2] border-[#EDE5D8] text-[#1B4332]'
                    : 'bg-white border-dashed border-[#EDE5D8] text-[#7F6A5D]'
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
                )}
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <ArtisanStatsCard stats={stats} />

      {/* Views and Conversion Chart */}
      <ArtisanViewsChart initialData={stats.chartData} />

      {/* Recent Products Overview */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EDE5D8]">
          <h3 className="font-serif font-bold text-lg text-[#1B4332] flex items-center gap-2">
            <Package size={18} className="text-[#C85A32]" />
            <span>Seus Produtos Cadastrados ({products.length})</span>
          </h3>

          <Link
            href="/painel/produtos"
            className="text-xs font-bold text-[#1B4332] hover:text-[#C85A32] flex items-center gap-1"
          >
            <span>Gerenciar todos</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-2"
            >
              <img
                src={product.coverImage}
                alt={product.name}
                className="w-full h-36 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#1B4332] truncate">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-bold text-[#C85A32]">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#7F4F24] font-medium">
                    {product.whatsappClicksCount} cliques
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
