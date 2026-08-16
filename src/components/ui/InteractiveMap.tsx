'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Star, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { Store } from '@/types';
import WhatsAppButton from './WhatsAppButton';

interface InteractiveMapProps {
  stores: Store[];
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
  className?: string;
  selectedStoreId?: string;
  onSelectStore?: (store: Store) => void;
}

export default function InteractiveMap({
  stores,
  initialLat = -23.5304,
  initialLng = -47.1353,
  initialZoom = 13,
  className = 'h-[500px] w-full',
  selectedStoreId,
  onSelectStore,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [activeStore, setActiveStore] = useState<Store | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initLeafletMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        // Fix default icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], initialZoom);

        // Warm styled map tiles (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      if (!map) return;

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Custom artisan marker icon
      const createArtisanIcon = (isFeatured: boolean) => {
        const pinColor = isFeatured ? '#C85A32' : '#1B4332';
        const ringColor = isFeatured ? '#E9C46A' : '#D8F3DC';
        return L.divIcon({
          className: 'custom-artisan-pin',
          html: `
            <div style="
              position: relative;
              width: 38px;
              height: 46px;
              cursor: pointer;
              filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
              transition: transform 0.2s ease-out;
            " onmouseenter="this.style.transform='scale(1.15) translateY(-4px)'" onmouseleave="this.style.transform='scale(1) translateY(0)'">
              <svg width="38" height="46" viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0C8.50659 0 0 8.50659 0 19C0 30.2 16.5 44.5 17.8 45.6C18.5 46.1 19.5 46.1 20.2 45.6C21.5 44.5 38 30.2 38 19C38 8.50659 29.4934 0 19 0Z" fill="${pinColor}"/>
                <circle cx="19" cy="18" r="14" fill="white" fill-opacity="0.2"/>
                <circle cx="19" cy="18" r="11" fill="white"/>
                <!-- Craft Urn / Needle Vector Icon -->
                <path d="M15 13H23M16 13C16 16 14 18 14 20C14 22 16 23 19 23C22 23 24 22 24 20C24 18 22 16 22 13M16 13V12C16 11.4 16.4 11 17 11H21C21.6 11 22 11.4 22 12V13" stroke="${pinColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              ${isFeatured ? `<div style="position:absolute; top:-2px; right:-2px; width:12px; height:12px; border-radius:50%; background:#E9C46A; border:2px solid white;"></div>` : ''}
            </div>
          `,
          iconSize: [38, 46],
          iconAnchor: [19, 46],
        });
      };

      // Add store markers
      stores.forEach((store) => {
        if (store.latitude && store.longitude) {
          const marker = L.marker([store.latitude, store.longitude], {
            icon: createArtisanIcon(store.isFeatured),
          }).addTo(map);

          marker.on('click', () => {
            if (isMounted) {
              setActiveStore(store);
              if (onSelectStore) onSelectStore(store);
            }
          });

          markersRef.current.push(marker);
        }
      });

      // If stores exist, fit bounds
      if (stores.length > 0) {
        const bounds = L.latLngBounds(stores.map((s) => [s.latitude, s.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }

    initLeafletMap();

    return () => {
      isMounted = false;
    };
  }, [stores, initialLat, initialLng, initialZoom, onSelectStore]);

  // Geolocation Handler ("Encontrar perto de mim")
  const handleFindNearMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 14);
        }
      },
      (error) => {
        setIsLocating(false);
        alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
      }
    );
  };

  return (
    <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-[#EDE5D8] shadow-artisan">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className={className} style={{ zIndex: 1 }} />

      {/* Geolocation Button */}
      <button
        onClick={handleFindNearMe}
        disabled={isLocating}
        className="absolute top-4 right-4 z-20 px-3.5 py-2.5 rounded-xl bg-white/95 backdrop-blur-md hover:bg-white text-[#1B4332] font-semibold text-xs shadow-md border border-[#EDE5D8] flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
      >
        <Navigation size={15} className={`text-[#C85A32] ${isLocating ? 'animate-spin' : ''}`} />
        <span>{isLocating ? 'Buscando...' : 'Perto de mim'}</span>
      </button>

      {/* Active Store Modal / Bottom Drawer Card on Map */}
      {activeStore && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#EDE5D8] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start gap-3">
            <img
              src={activeStore.logoUrl}
              alt={activeStore.name}
              className="w-14 h-14 rounded-xl object-cover border border-[#EDE5D8] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#7F4F24] tracking-wider">
                  {activeStore.city?.name || 'São Roque'}
                </span>
                <button
                  onClick={() => setActiveStore(null)}
                  className="text-xs text-[#9E9188] hover:text-[#2C2623] px-1"
                >
                  ✕
                </button>
              </div>

              <h4 className="font-serif font-bold text-sm text-[#1B4332] truncate">
                {activeStore.name}
              </h4>

              <p className="text-xs text-[#7F4F24] truncate">
                {activeStore.artisanName}
              </p>

              <div className="flex items-center gap-1 mt-1 text-xs text-[#4A3525]">
                <Star size={12} className="text-[#D4A373] fill-[#D4A373]" />
                <span className="font-bold">{activeStore.rating.toFixed(1)}</span>
                <span className="text-[#9E9188]">({activeStore.productsCount || 0} produtos)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#6B625B] line-clamp-2 mt-2 leading-relaxed">
            {activeStore.bio}
          </p>

          <div className="mt-3 pt-2.5 border-t border-[#F4EFE6] flex items-center justify-between gap-2">
            <WhatsAppButton
              phone={activeStore.whatsapp}
              storeName={activeStore.name}
              storeId={activeStore.id}
              cityId={activeStore.cityId}
              variant="secondary"
              customLabel="WhatsApp"
            />

            <Link
              href={`/loja/${activeStore.slug}`}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-[#1B4332] hover:bg-[#2D6A4F] text-white transition-colors"
            >
              <span>Ver Ateliê</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
