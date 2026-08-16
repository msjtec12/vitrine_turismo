'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Store as StoreIcon, Check, ExternalLink, Sparkles, MapPin } from 'lucide-react';
import { Store } from '@/types';
import { storeService } from '@/lib/data/store-service';
import ImageUpload from '@/components/ui/ImageUpload';
import CepAddressForm from '@/components/ui/CepAddressForm';

export default function LojaEditorClient({ initialStore }: { initialStore: Store | null }) {
  const [store, setStore] = useState<Store | null>(initialStore);
  const [name, setName] = useState(store?.name || '');
  const [artisanName, setArtisanName] = useState(store?.artisanName || '');
  const [bio, setBio] = useState(store?.bio || '');
  const [story, setStory] = useState(store?.story || '');
  const [processDescription, setProcessDescription] = useState(store?.processDescription || '');
  const [whatsapp, setWhatsapp] = useState(store?.whatsapp || '');
  const [instagram, setInstagram] = useState(store?.instagram || '');
  const [openingHours, setOpeningHours] = useState(store?.openingHours || '');
  const [coverUrl, setCoverUrl] = useState(store?.coverUrl || '');
  const [logoUrl, setLogoUrl] = useState(store?.logoUrl || '');

  // Address fields
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState(store?.address || '');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState(store?.neighborhood || 'São Roque');
  const [complement, setComplement] = useState('');

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!store) return;
    setIsSaving(true);

    const fullAddress = formatFullAddress();

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
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1B4332] flex items-center gap-2">
            <StoreIcon size={22} className="text-[#C85A32]" />
            <span>Perfil do Ateliê & História</span>
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Personalize as informações públicas que os turistas verão ao visitar sua página
          </p>
        </div>

        {store && (
          <Link
            href={`/loja/${store.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-xs font-bold text-[#1B4332] border border-[#EDE5D8] transition-colors"
          >
            <span>Ver Loja Pública</span>
            <ExternalLink size={13} />
          </Link>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-6">
        {isSaved && (
          <div className="p-4 rounded-2xl bg-[#D8F3DC] text-[#1B4332] text-xs font-bold flex items-center gap-2 border border-[#2D6A4F]/20">
            <Check size={16} />
            <span>Informações do ateliê salvas com sucesso!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
              Nome da Loja / Ateliê *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
              Nome do Artesão / Mestres *
            </label>
            <input
              type="text"
              required
              value={artisanName}
              onChange={(e) => setArtisanName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden font-medium"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
            Descrição Curta (Bio para os cards)
          </label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs text-[#2C2623] focus:border-[#C85A32] outline-hidden leading-relaxed"
          />
        </div>

        {/* Story */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
            Sua História & Tradição (Seção &ldquo;Sobre o Artesão&rdquo;)
          </label>
          <textarea
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Conte sua trajetória, há quantos anos produz em São Roque, a conexão com a cultura local..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs text-[#2C2623] focus:border-[#C85A32] outline-hidden leading-relaxed"
          />
        </div>

        {/* Process description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
            Processo de Produção e Técnicas Utilizadas
          </label>
          <textarea
            rows={3}
            value={processDescription}
            onChange={(e) => setProcessDescription(e.target.value)}
            placeholder="Descreva passo a passo como as matérias-primas são transformadas..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs text-[#2C2623] focus:border-[#C85A32] outline-hidden leading-relaxed"
          />
        </div>

        {/* Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#EDE5D8]">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
              WhatsApp para Vendas *
            </label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
              Instagram (@usuario)
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@ceramicadaterrasr"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden"
            />
          </div>
        </div>

        {/* Location with CEP Verification */}
        <div className="pt-4 border-t border-[#EDE5D8] space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-[#C85A32]" />
            <h3 className="font-serif font-bold text-base text-[#1B4332]">
              Endereço Físico do Ateliê & CEP
            </h3>
          </div>

          <CepAddressForm
            cep={cep}
            onCepChange={setCep}
            street={street}
            onStreetChange={setStreet}
            number={number}
            onNumberChange={setNumber}
            neighborhood={neighborhood}
            onNeighborhoodChange={setNeighborhood}
            complement={complement}
            onComplementChange={setComplement}
            city="São Roque"
            state="SP"
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5 mt-3">
              Horário de Atendimento
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              placeholder="Ex: Seg a Sáb das 09h às 18h / Dom das 10h às 16h"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs text-[#2C2623] focus:border-[#C85A32] outline-hidden"
            />
          </div>
        </div>

        {/* Photos Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#EDE5D8]">
          <ImageUpload
            label="Logo ou Foto do Artesão"
            helperText="Carregue uma imagem quadrada para o perfil"
            aspectRatio="square"
            value={logoUrl}
            onChange={setLogoUrl}
          />

          <ImageUpload
            label="Foto de Capa do Ateliê"
            helperText="Carregue uma foto em alta resolução da sua vitrine"
            aspectRatio="video"
            value={coverUrl}
            onChange={setCoverUrl}
          />
        </div>

        <div className="pt-4 border-t border-[#EDE5D8] flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <span>Salvando alterações...</span>
            ) : (
              <>
                <Check size={16} />
                <span>Salvar Alterações da Loja</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
