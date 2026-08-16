'use client';

import React from 'react';
import { Filter, X, SlidersHorizontal, Sparkles, Flame, CheckCircle2, RotateCcw } from 'lucide-react';
import { Category, City, FilterOptions } from '@/types';

interface FiltersProps {
  categories: Category[];
  cities: City[];
  filters: FilterOptions;
  onChange: (newFilters: FilterOptions) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Filters({
  categories,
  cities,
  filters,
  onChange,
  onReset,
  isMobileOpen = false,
  onCloseMobile,
}: FiltersProps) {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const Content = (
    <div className="space-y-6">
      {/* Header with clear button */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EDE5D8]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-[#C85A32]" />
          <h3 className="font-serif font-bold text-base text-[#1B4332]">Filtros</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-[#7F4F24] hover:text-[#C85A32] flex items-center gap-1 font-medium cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>Limpar</span>
        </button>
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
          Cidade / Destino
        </label>
        <select
          value={filters.citySlug || ''}
          onChange={(e) => updateFilter('citySlug', e.target.value || undefined)}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] focus:outline-hidden font-medium"
        >
          <option value="">Todas as cidades</option>
          {cities.map((city) => (
            <option key={city.id} value={city.slug}>
              {city.name} - {city.uf}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
          Categoria
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => updateFilter('categorySlug', undefined)}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
              !filters.categorySlug
                ? 'bg-[#1B4332] text-white font-bold'
                : 'hover:bg-[#EDE5D8]/50 text-[#4A3525]'
            }`}
          >
            <span>Todas as categorias</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateFilter('categorySlug', cat.slug)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                filters.categorySlug === cat.slug
                  ? 'bg-[#1B4332] text-white font-bold'
                  : 'hover:bg-[#EDE5D8]/50 text-[#4A3525]'
              }`}
            >
              <span>{cat.name}</span>
              {cat.productsCount !== undefined && (
                <span className="text-[10px] opacity-75">({cat.productsCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="space-y-3 pt-3 border-t border-[#EDE5D8]">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
          Destaques & Selos
        </label>

        {/* Promo Toggle */}
        <label className="flex items-center gap-2.5 text-xs text-[#2C2623] cursor-pointer hover:text-[#C85A32]">
          <input
            type="checkbox"
            checked={!!filters.onlyPromotions}
            onChange={(e) => updateFilter('onlyPromotions', e.target.checked || undefined)}
            className="w-4 h-4 rounded-sm text-[#C85A32] accent-[#C85A32] cursor-pointer"
          />
          <Flame size={14} className="text-[#C85A32]" />
          <span>Apenas ofertas & promoções</span>
        </label>

        {/* Featured Toggle */}
        <label className="flex items-center gap-2.5 text-xs text-[#2C2623] cursor-pointer hover:text-[#C85A32]">
          <input
            type="checkbox"
            checked={!!filters.onlyFeatured}
            onChange={(e) => updateFilter('onlyFeatured', e.target.checked || undefined)}
            className="w-4 h-4 rounded-sm text-[#E9C46A] accent-[#1B4332] cursor-pointer"
          />
          <Sparkles size={14} className="text-[#D4A373]" />
          <span>Apenas produtos em destaque</span>
        </label>

        {/* Verified Toggle */}
        <label className="flex items-center gap-2.5 text-xs text-[#2C2623] cursor-pointer hover:text-[#2D6A4F]">
          <input
            type="checkbox"
            checked={!!filters.onlyVerified}
            onChange={(e) => updateFilter('onlyVerified', e.target.checked || undefined)}
            className="w-4 h-4 rounded-sm text-[#2D6A4F] accent-[#2D6A4F] cursor-pointer"
          />
          <CheckCircle2 size={14} className="text-[#2D6A4F]" />
          <span>Artesão Verificado</span>
        </label>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-3 border-t border-[#EDE5D8]">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
          Faixa de Preço (R$)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-1/2 px-3 py-2 rounded-xl bg-white border border-[#EDE5D8] text-xs text-[#2C2623] outline-hidden"
          />
          <span className="text-[#9E9188]">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-1/2 px-3 py-2 rounded-xl bg-white border border-[#EDE5D8] text-xs text-[#2C2623] outline-hidden"
          />
        </div>
      </div>
    </div>
  );

  // Mobile Drawer
  if (isMobileOpen) {
    return (
      <div className="fixed inset-0 z-50 flex lg:hidden">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onCloseMobile} />
        <div className="relative ml-auto w-full max-w-xs h-full bg-[#FAF7F2] p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE5D8] mb-4">
              <h3 className="font-serif font-bold text-lg text-[#1B4332]">Filtrar Busca</h3>
              <button onClick={onCloseMobile} className="p-1 text-[#4A3525]">
                <X size={20} />
              </button>
            </div>
            {Content}
          </div>

          <div className="pt-6">
            <button
              onClick={onCloseMobile}
              className="w-full py-3 rounded-xl bg-[#1B4332] text-white font-bold text-sm shadow-md"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Sticky Sidebar
  return (
    <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-[#EDE5D8] shadow-xs h-fit sticky top-28">
      {Content}
    </aside>
  );
}
