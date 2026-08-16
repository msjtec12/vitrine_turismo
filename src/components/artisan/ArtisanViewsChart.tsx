'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

interface ChartDataPoint {
  label: string;
  views: number;
  clicks: number;
}

interface ArtisanViewsChartProps {
  initialData?: ChartDataPoint[];
}

export default function ArtisanViewsChart({ initialData }: ArtisanViewsChartProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const data7d = initialData || [
    { label: 'Seg', views: 45, clicks: 6 },
    { label: 'Ter', views: 52, clicks: 8 },
    { label: 'Qua', views: 68, clicks: 11 },
    { label: 'Qui', views: 85, clicks: 14 },
    { label: 'Sex', views: 120, clicks: 22 },
    { label: 'Sáb', views: 185, clicks: 38 },
    { label: 'Dom', views: 210, clicks: 43 },
  ];

  const data30d = [
    { label: 'Semana 1', views: 320, clicks: 48 },
    { label: 'Semana 2', views: 410, clicks: 62 },
    { label: 'Semana 3', views: 550, clicks: 89 },
    { label: 'Semana 4', views: 680, clicks: 115 },
  ];

  const data90d = [
    { label: 'Junho', views: 1420, clicks: 210 },
    { label: 'Julho (Férias)', views: 2890, clicks: 430 },
    { label: 'Agosto (Atual)', views: 1850, clicks: 285 },
  ];

  const currentData = period === '7d' ? data7d : period === '30d' ? data30d : data90d;
  const maxViews = Math.max(...currentData.map((d) => d.views), 1);

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EDE5D8] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE5D8]">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#1B4332] flex items-center gap-2">
            <BarChart3 size={18} className="text-[#C85A32]" />
            <span>Desempenho de Visitas & WhatsApp</span>
          </h3>
          <p className="text-xs text-[#7F4F24] mt-0.5">
            Acompanhe o interesse dos turistas e as conversões em contato direto
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EDE5D8]">
          <button
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              period === '7d' ? 'bg-[#1B4332] text-white shadow-xs' : 'text-[#7F4F24] hover:text-[#2C2623]'
            }`}
          >
            7 dias
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              period === '30d' ? 'bg-[#1B4332] text-white shadow-xs' : 'text-[#7F4F24] hover:text-[#2C2623]'
            }`}
          >
            30 dias
          </button>
          <button
            onClick={() => setPeriod('90d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              period === '90d' ? 'bg-[#1B4332] text-white shadow-xs' : 'text-[#7F4F24] hover:text-[#2C2623]'
            }`}
          >
            90 dias
          </button>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="mt-4 flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm bg-[#1B4332]" />
          <span className="text-[#4A3525] font-medium">Visualizações da Loja e Produtos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm bg-[#25D366]" />
          <span className="text-[#4A3525] font-medium">Cliques no WhatsApp (Conversão)</span>
        </div>
      </div>

      {/* Interactive Bar Chart Visualization */}
      <div className="mt-6 flex items-end gap-3 sm:gap-6 h-60 pt-6 px-2">
        {currentData.map((d, idx) => {
          const heightPercent = Math.round((d.views / maxViews) * 100);
          const clicksHeightPercent = Math.max(Math.round((d.clicks / d.views) * 100), 12);

          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#2C2623] text-white text-[11px] px-2 py-1 rounded-md shadow-md mb-2 text-center pointer-events-none whitespace-nowrap">
                <div>{d.views} visualizações</div>
                <div className="text-[#25D366] font-bold">{d.clicks} no WhatsApp</div>
              </div>

              {/* Stacked / Dual Bar Container */}
              <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-full">
                {/* Views Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-[#1B4332]/80 group-hover:bg-[#1B4332] rounded-t-lg transition-all duration-500 relative"
                />
                {/* Clicks Bar */}
                <div
                  style={{ height: `${(d.clicks / (maxViews * 0.3)) * 100}%` }}
                  className="w-full bg-[#25D366] group-hover:bg-[#1EBE5B] rounded-t-lg transition-all duration-500"
                />
              </div>

              {/* X Axis Label */}
              <span className="text-[11px] font-medium text-[#7F4F24] mt-2.5">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
