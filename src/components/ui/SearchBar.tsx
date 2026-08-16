'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { City } from '@/types';

interface SearchBarProps {
  cities?: City[];
  initialQuery?: string;
  initialCity?: string;
  compact?: boolean;
}

export default function SearchBar({
  cities = [],
  initialQuery = '',
  initialCity = '',
  compact = false,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState(initialCity || 'sao-roque');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedCity) params.set('cidade', selectedCity);
    router.push(`/explorar?${params.toString()}`);
  };

  const handleQuickTag = (tag: string) => {
    const params = new URLSearchParams();
    params.set('q', tag);
    if (selectedCity) params.set('cidade', selectedCity);
    router.push(`/explorar?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="relative flex items-center w-full max-w-lg">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7F6A5D]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cerâmica, madeira, doces..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EDE5D8] focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20 text-sm text-[#2C2623] placeholder-[#9E9188] outline-hidden transition-all"
          />
        </div>
        <button
          type="submit"
          className="ml-2 px-4 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl text-sm font-semibold transition-colors shrink-0 shadow-xs"
        >
          Buscar
        </button>
      </form>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Container Card */}
      <form
        onSubmit={handleSearch}
        className="glass-panel p-2.5 md:p-3 rounded-2xl md:rounded-3xl shadow-artisan flex flex-col md:flex-row items-stretch md:items-center gap-2 border border-[#EDE5D8]"
      >
        {/* Keyword Search Input */}
        <div className="flex-1 relative flex items-center px-3 py-2 bg-white md:bg-transparent rounded-xl md:rounded-none border md:border-none border-[#EDE5D8]">
          <Search size={20} className="text-[#C85A32] shrink-0 mr-3" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold tracking-wider uppercase text-[#7F4F24]">
              O que você procura?
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: cerâmica, kit vinho, queijo, tábua..."
              className="w-full bg-transparent text-sm md:text-base text-[#2C2623] placeholder-[#9E9188] focus:outline-hidden font-medium"
            />
          </div>
        </div>

        {/* Divider Desktop */}
        <div className="hidden md:block w-px h-10 bg-[#EDE5D8]" />

        {/* City Selector */}
        <div className="relative flex items-center px-3 py-2 bg-white md:bg-transparent rounded-xl md:rounded-none border md:border-none border-[#EDE5D8] md:w-56 shrink-0">
          <MapPin size={20} className="text-[#2D6A4F] shrink-0 mr-2.5" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold tracking-wider uppercase text-[#7F4F24]">
              Destino / Cidade
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent text-sm text-[#2C2623] font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="">Todas as Cidades</option>
              <option value="sao-roque">São Roque - SP (Foco MVP)</option>
              <option value="embu-das-artes">Embu das Artes - SP</option>
              <option value="holambra">Holambra - SP</option>
              <option value="paraty">Paraty - RJ</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-7 py-4 rounded-xl md:rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
        >
          <span>Explorar</span>
          <ArrowRight size={18} />
        </button>
      </form>

      {/* Quick Suggestions / Popular Tags */}
      <div className="mt-3.5 flex items-center justify-center gap-2 flex-wrap text-xs text-[#6B625B]">
        <span className="font-medium flex items-center gap-1 text-[#7F4F24]">
          <Sparkles size={13} className="text-[#C85A32]" />
          Mais buscados em São Roque:
        </span>
        {['Kit Presente', 'Taças em Cerâmica', 'Licor de Alcachofra', 'Tábua de Vinho', 'Queijo Imperial'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleQuickTag(tag)}
            className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white border border-[#EDE5D8] hover:border-[#C85A32] text-[#4A3525] hover:text-[#C85A32] transition-colors cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
