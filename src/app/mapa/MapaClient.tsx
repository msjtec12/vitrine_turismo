'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Sparkles, Filter, Store as StoreIcon } from 'lucide-react';
import { Store, City, Category } from '@/types';
import InteractiveMap from '@/components/ui/InteractiveMap';
import StoreCard from '@/components/ui/StoreCard';

interface MapaClientProps {
  stores: Store[];
  cities: City[];
  categories: Category[];
}

export default function MapaClient({ stores, cities, categories }: MapaClientProps) {
  const [selectedCitySlug, setSelectedCitySlug] = useState<string>('sao-roque');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');

  const currentCity = cities.find((c) => c.slug === selectedCitySlug) || cities[0];

  const filteredStores = stores.filter((s) => {
    if (selectedCitySlug && s.city?.slug !== selectedCitySlug) return false;
    if (selectedCategorySlug && s.category?.slug !== selectedCategorySlug) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      {/* Header */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#EDE5D8]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              <MapPin size={14} />
              <span>Roteiro & Descoberta Georreferenciada</span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332] mt-1">
              Mapa de Ateliês & Mestres em {currentCity?.name || 'São Roque'}
            </h1>
            <p className="text-xs text-[#7F4F24] mt-1">
              Clique nos marcadores do mapa para ver detalhes, fotos e entrar em contato direto no WhatsApp.
            </p>
          </div>

          {/* City Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCitySlug(city.slug)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCitySlug === city.slug
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'bg-white text-[#4A3525] border border-[#EDE5D8] hover:bg-[#EDE5D8]'
                }`}
              >
                {city.name} ({stores.filter((s) => s.cityId === city.id).length})
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 pt-4 border-t border-[#EDE5D8] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategorySlug('')}
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
              !selectedCategorySlug
                ? 'bg-[#C85A32] text-white font-bold'
                : 'bg-white text-[#4A3525] border border-[#EDE5D8] hover:bg-[#EDE5D8]'
            }`}
          >
            Todas as Categorias
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                selectedCategorySlug === cat.slug
                  ? 'bg-[#C85A32] text-white font-bold'
                  : 'bg-white text-[#4A3525] border border-[#EDE5D8] hover:bg-[#EDE5D8]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map */}
      <InteractiveMap
        stores={filteredStores}
        initialLat={currentCity?.latitude || -23.5304}
        initialLng={currentCity?.longitude || -47.1353}
        className="h-[550px] w-full"
      />

      {/* Stores List Below Map */}
      <div className="space-y-4 pt-4">
        <h2 className="font-serif font-bold text-xl text-[#1B4332] flex items-center gap-2">
          <StoreIcon size={18} className="text-[#C85A32]" />
          <span>Ateliês Marcados no Roteiro ({filteredStores.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </div>
  );
}
