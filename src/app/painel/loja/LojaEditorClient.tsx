'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store as StoreIcon, Check, ExternalLink, Sparkles, MapPin, Plus } from 'lucide-react';
import { Store } from '@/types';
import { storeService } from '@/lib/data/store-service';
import { useAuth } from '@/lib/auth-context';
import ImageUpload from '@/components/ui/ImageUpload';
import CepAddressForm from '@/components/ui/CepAddressForm';

export default function LojaEditorClient({ initialStore }: { initialStore?: Store | null }) {
  const { activeStoreId, setActiveStoreId, user } = useAuth();
  const [store, setStore] = useState<Store | null>(initialStore || null);
  const [name, setName] = useState('');
  const [artisanName, setArtisanName] = useState(user?.fullName || '');
  const [bio, setBio] = useState('');
  const [story, setStory] = useState('');
  const [processDescription, setProcessDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [openingHours, setOpeningHours] = useState('Segunda a Sábado, das 9h às 18h');
  const [coverUrl, setCoverUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Address fields
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('São Roque');
  const [complement, setComplement] = useState('');

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function refreshStore() {
      setLoading(true);
      let s: Store | null = null;
      if (activeStoreId) {
        s = await storeService.getStoreById(activeStoreId);
      }
      if (!s && user?.email) {
        s = await storeService.getStoreByEmail(user.email);
      }
      if (!s && initialStore) {
        s = initialStore;
      }
      if (s) {
        setStore(s);
        setName(s.name || '');
        setArtisanName(s.artisanName || user?.fullName || '');
        setBio(s.bio || '');
        setStory(s.story || '');
        setProcessDescription(s.processDescription || '');
        setWhatsapp(s.whatsapp || '');
        setInstagram(s.instagram || '');
        setOpeningHours(s.openingHours || 'Segunda a Sábado, das 9h às 18h');
        setCoverUrl(s.coverUrl || '');
        setLogoUrl(s.logoUrl || '');
        setStreet(s.address || '');
        setNeighborhood(s.neighborhood || 'São Roque');
      } else {
        setStore(null);
        setName('');
        setArtisanName(user?.fullName || '');
        setBio('');
        setStory('');
        setProcessDescription('');
        setWhatsapp('');
        setInstagram('');
        setCoverUrl('');
        setLogoUrl('');
        setStreet('');
        setNeighborhood('São Roque');
      }
      setLoading(false);
    }
    refreshStore();
  }, [activeStoreId, user, initialStore]);

  const formatFullAddress = () => {
    if (!street) return store?.address || '';
    const parts = [street];
    if (number) parts.push(`nº ${number}`);
    if (complement) parts.push(complement);
    if (neighborhood) parts.push(neighborhood);
    if (cep) parts.push(`CEP ${cep}`);
    return parts.join(', ');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const fullAddress = formatFullAddress();

    if (store) {
      // Update existing store
      const updated = await storeService.updateStore(store.id, {
        name,
        artisanName,
        bio,
        story,
        processDescription,
        whatsapp,
        instagram,
        address: fullAddress,
        neighborhood,
        openingHours,
        coverUrl,
        logoUrl,
      });

      if (updated) {
        setStore(updated);
      }
    } else {
      // Create new store for this user
      const { store: newStore } = await storeService.createArtisanSelfService({
        fullName: artisanName || user?.fullName || 'Artesão',
        email: user?.email || 'artesao@descubraartes.com.br',
        phone: whatsapp || '11999999999',
        storeName: name || 'Meu Ateliê',
        description: bio || 'Ateliê de artesanato regional em São Roque',
        story,
        cityId: 'city-sao-roque',
        categoryId: 'cat-ceramica',
        whatsapp: whatsapp || '11999999999',
        instagram,
        address: fullAddress || 'São Roque - SP',
        neighborhood,
        logoUrl,
        coverUrl,
        products: [],
      });

      setStore(newStore);
      setActiveStoreId(newStore.id);
    }

    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-white rounded-3xl border border-[#EDE5D8]" />
        <div className="h-96 bg-white rounded-3xl border border-[#EDE5D8]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332] flex items-center gap-2">
            <StoreIcon size={24} className="text-[#C85A32]" />
            <span>Perfil do Ateliê & História</span>
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Personalize as informações públicas que os turistas verão ao visitar sua página
          </p>
        </div>

        {store?.status === 'APPROVED' && store?.slug && (
          <Link
            href={`/loja/${store.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] border border-[#EDE5D8] text-[#1B4332] text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <span>Ver Loja Pública</span>
            <ExternalLink size={13} />
          </Link>
        )}
      </div>

      {isSaved && (
        <div className="p-4 bg-[#D8F3DC] text-[#1B4332] border border-[#2D6A4F]/20 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <Check size={18} />
          <span>Informações do ateliê salvas com sucesso!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
              Nome da Loja / Ateliê *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ateliê Barro Vivo"
              className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] text-xs text-[#2C2623] focus:bg-white focus:border-[#1B4332] focus:outline-hidden transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
              Nome do Artesão / Mestres *
            </label>
            <input
              type="text"
              required
              value={artisanName}
              onChange={(e) => setArtisanName(e.target.value)}
              placeholder="Ex: Maria Silveira"
              className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] text-xs text-[#2C2623] focus:bg-white focus:border-[#1B4332] focus:outline-hidden transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
            Descrição Curta (Bio para os cards)
          </label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Ex: Peças em cerâmica artesanal de alta temperatura e esmaltes naturais."
            className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] text-xs text-[#2C2623] focus:bg-white focus:border-[#1B4332] focus:outline-hidden transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
            Sua História & Tradição (Seção "Sobre o Artesão")
          </label>
          <textarea
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Conte aos turistas como você começou, a tradição familiar e o amor pelo artesanato regional de São Roque..."
            className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] text-xs text-[#2C2623] focus:bg-white focus:border-[#1B4332] focus:outline-hidden transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
            Processo de Produção e Técnicas Utilizadas
          </label>
          <textarea
            rows={3}
            value={processDescription}
            onChange={(e) => setProcessDescription(e.target.value)}
            placeholder="Ex: Torno manual, queima em forno a lenha a 1240ºC e esmaltes formulados no próprio ateliê com cinzas da poda de videiras..."
            className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] text-xs text-[#2C2623] focus:bg-white focus:border-[#1B4332] focus:outline-hidden transition-all"
          />
        </div>

        {/* Visual Identity: Cover & Logo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EDE5D8]">
          <ImageUpload
            label="Logo ou Foto do Artesão"
            helperText="Formato quadrado (1:1), PNG ou JPG."
            value={logoUrl}
            onChange={setLogoUrl}
            aspectRatio="square"
          />

          <ImageUpload
            label="Foto de Capa do Ateliê"
            helperText="Foto horizontal (16:9) do seu espaço ou bancada."
            value={coverUrl}
            onChange={setCoverUrl}
            aspectRatio="banner"
          />
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EDE5D8]">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
              WhatsApp para Pedidos (com DDD) *
            </label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: 11999998888"
              className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] text-xs text-[#2C2623] focus:bg-white focus:border-[#1B4332] focus:outline-hidden transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
              Instagram (opcional)
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Ex: @ateliebarrovivo"
              className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] text-xs text-[#2C2623] focus:bg-white focus:border-[#1B4332] focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Address with CEP */}
        <div className="pt-4 border-t border-[#EDE5D8] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            <MapPin size={15} />
            <span>Endereço e Localização do Ateliê em São Roque</span>
          </div>

          <CepAddressForm
            cep={cep}
            street={street}
            number={number}
            neighborhood={neighborhood}
            complement={complement}
            city="São Roque"
            state="SP"
            onCepChange={setCep}
            onStreetChange={setStreet}
            onNumberChange={setNumber}
            onNeighborhoodChange={setNeighborhood}
            onComplementChange={setComplement}
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
            Horário de Atendimento / Visitação
          </label>
          <input
            type="text"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            placeholder="Ex: Sexta a Domingo, das 10h às 18h"
            className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] text-xs text-[#2C2623] focus:bg-white focus:border-[#1B4332] focus:outline-hidden transition-all"
          />
        </div>

        <div className="pt-6 border-t border-[#EDE5D8] flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : store ? 'Salvar Alterações' : 'Criar e Publicar Ateliê'}
          </button>
        </div>
      </form>
    </div>
  );
}
