import React from 'react';
import { Eye, MessageCircle, Heart, TrendingUp, Package } from 'lucide-react';

interface ArtisanStatsCardProps {
  stats: {
    storeViews: number;
    productViews: number;
    whatsappClicks: number;
    favorites: number;
    conversionRate: string;
  };
}

export default function ArtisanStatsCard({ stats }: ArtisanStatsCardProps) {
  const cards = [
    {
      title: 'Visualizações da Loja',
      value: stats.storeViews.toLocaleString('pt-BR'),
      change: '+14% esta semana',
      icon: <Eye size={22} className="text-[#1B4332]" />,
      bgColor: 'bg-[#D8F3DC]',
    },
    {
      title: 'Visualizações de Produtos',
      value: stats.productViews.toLocaleString('pt-BR'),
      change: '+22% esta semana',
      icon: <Package size={22} className="text-[#C85A32]" />,
      bgColor: 'bg-[#FDE8E1]',
    },
    {
      title: 'Cliques no WhatsApp',
      value: stats.whatsappClicks.toLocaleString('pt-BR'),
      change: '+38% conversão direta',
      icon: <MessageCircle size={22} className="text-[#1EBE5B]" />,
      bgColor: 'bg-[#E8F8EE]',
    },
    {
      title: 'Favoritos Recebidos',
      value: stats.favorites.toLocaleString('pt-BR'),
      change: 'Lista de desejos de turistas',
      icon: <Heart size={22} className="text-[#D4A373]" />,
      bgColor: 'bg-[#FEF9EF]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white p-5 rounded-2xl border border-[#EDE5D8] shadow-xs hover:shadow-artisan transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7F4F24] uppercase tracking-wider">
              {card.title}
            </span>
            <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-[#2C2623]">
              {card.value}
            </div>
            <div className="mt-1 text-xs text-[#2D6A4F] flex items-center gap-1 font-medium">
              <TrendingUp size={12} />
              <span>{card.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
