'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Store as StoreIcon,
  User,
  MapPin,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Send,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Package,
  Trash2,
} from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import { City, Category } from '@/types';
import ImageUpload from '@/components/ui/ImageUpload';
import CepAddressForm from '@/components/ui/CepAddressForm';

interface AdminNovoArtesaoClientProps {
  cities: City[];
  categories: Category[];
}

export default function AdminNovoArtesaoClient({
  cities,
  categories,
}: AdminNovoArtesaoClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Artisan Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Store Info
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [cityId, setCityId] = useState(cities[0]?.id || 'city-sao-roque');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-ceramica');
  const [instagram, setInstagram] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  // Address fields with CEP
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');

  // Initial Products
  const [products, setProducts] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      imageUrl: string;
    }>
  >([
    {
      id: 'prod-1',
      name: '',
      description: '',
      price: 0,
      imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    },
  ]);

  // Result state
  const [createdInvite, setCreatedInvite] = useState<{
    token: string;
    url: string;
    artisanName: string;
    storeName: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: `prod-${Date.now()}`,
        name: '',
        description: '',
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      },
    ]);
  };

  const handleRemoveProduct = (id: string) => {
    if (products.length <= 1) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleProductChange = (id: string, field: string, value: any) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  const formatFullAddress = () => {
    const parts = [];
    if (street) parts.push(street);
    if (number) parts.push(`nº ${number}`);
    if (complement) parts.push(complement);
    if (neighborhood) parts.push(neighborhood);
    if (cep) parts.push(`CEP ${cep}`);
    return parts.join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Informe o nome do artesão.');
      return;
    }
    if (!email.includes('@')) {
      setError('Informe um e-mail válido para envio do convite.');
      return;
    }
    if (!phone.replace(/\D/g, '')) {
      setError('Informe o WhatsApp do artesão.');
      return;
    }
    if (!storeName.trim()) {
      setError('Informe o nome da loja ou ateliê.');
      return;
    }

    const fullAddress = formatFullAddress();
    if (!fullAddress) {
      setError('Informe o endereço do ateliê.');
      return;
    }

    setLoading(true);
    try {
      const res = await storeService.createArtisanAdminAssisted({
        fullName,
        email,
        phone,
        storeName,
        description: description || `Ateliê autoral de ${fullName} em São Roque.`,
        cityId,
        categoryId,
        instagram,
        address: fullAddress,
        logoUrl,
        coverUrl,
        products: products
          .filter((p) => p.name.trim() && p.price > 0)
          .map((p) => ({
            name: p.name,
            description: p.description || p.name,
            price: Number(p.price),
            images: [p.imageUrl],
          })),
      });

      setCreatedInvite({
        token: res.invitationToken,
        url: `${window.location.origin}${res.invitationUrl}`,
        artisanName: fullName,
        storeName,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar artesão.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdInvite) return;
    navigator.clipboard.writeText(createdInvite.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (createdInvite) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-[#EDE5D8] shadow-artisan text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8F3DC] text-[#1B4332] text-xs font-bold uppercase tracking-wider">
            <span>Convite Criado com Sucesso!</span>
          </span>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#1B4332]">
            {createdInvite.storeName}
          </h2>
          <p className="text-xs text-[#7F4F24]">
            Artesão: <strong>{createdInvite.artisanName}</strong> • Status: <strong>Aguardando aceite</strong>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] text-left space-y-3">
          <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider">
            Link Exclusivo de Convite:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={createdInvite.url}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#EDE5D8] bg-white text-xs text-[#2C2623] font-mono outline-hidden"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#A4421F] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
          <p className="text-[11px] text-[#7F4F24] leading-relaxed">
            Envie este link para o artesão pelo WhatsApp ou e-mail. Ao abrir, ele definirá sua própria senha e terá acesso imediato à gestão da loja.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#EDE5D8]">
          <Link
            href="/admin/artesaos"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs transition-colors"
          >
            Ver Lista de Artesãos
          </Link>
          <button
            onClick={() => {
              setCreatedInvite(null);
              setFullName('');
              setEmail('');
              setPhone('');
              setStoreName('');
              setDescription('');
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#4A3525] font-semibold text-xs transition-colors cursor-pointer"
          >
            + Cadastrar Outro Artesão
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/artesaos"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#7F4F24] hover:text-[#C85A32]"
        >
          <ArrowLeft size={14} />
          <span>Voltar para Artesãos</span>
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-8">
        <div className="border-b border-[#EDE5D8] pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDE8E1] text-[#C85A32] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Cadastro Assistido pela Curadoria</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332]">
            Cadastrar Novo Artesão & Loja
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Cadastre as informações colhidas na visita presencial. O sistema criará a loja e gerará o link de convite para o artesão definir sua senha.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-[#FDE8E1] border border-[#C85A32]/30 text-[#C85A32] text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Artisan Info */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1B4332] flex items-center gap-2">
              <User size={18} className="text-[#C85A32]" />
              <span>1. Dados do Mestre Artesão</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Maria Ramos"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  E-mail de Contato *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maria@artesanatosr.com.br"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Store Info */}
          <div className="space-y-4 pt-4 border-t border-[#EDE5D8]">
            <h3 className="font-serif font-bold text-lg text-[#1B4332] flex items-center gap-2">
              <StoreIcon size={18} className="text-[#C85A32]" />
              <span>2. Perfil do Ateliê / Loja</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  Nome da Loja / Ateliê *
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ex: Cerâmica da Mantiqueira"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  Cidade *
                </label>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-xs font-medium focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.uf}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  Categoria *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-xs font-medium focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  Instagram (@nomedaloja)
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@ceramicamantiqueira"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                Descrição do Ateliê & Técnicas
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o tipo de peça, materiais utilizados e diferencial da produção..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-xs focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
              />
            </div>

            {/* Photos Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <ImageUpload
                label="Logo / Foto de Perfil"
                helperText="Selecione um arquivo de imagem (PNG, JPG)"
                aspectRatio="square"
                value={logoUrl}
                onChange={setLogoUrl}
              />

              <ImageUpload
                label="Foto de Capa do Ateliê"
                helperText="Selecione uma foto da oficina ou ateliê"
                aspectRatio="video"
                value={coverUrl}
                onChange={setCoverUrl}
              />
            </div>

            {/* CEP Address Verification */}
            <div className="pt-3 border-t border-[#EDE5D8] space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#1B4332]">
                Endereço com Verificação por CEP
              </h4>
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
            </div>
          </div>

          {/* Section 3: Initial Products */}
          <div className="space-y-4 pt-4 border-t border-[#EDE5D8]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#1B4332] flex items-center gap-2">
                <Package size={18} className="text-[#C85A32]" />
                <span>3. Produtos Iniciais (Opcional)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddProduct}
                className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>+ Adicionar Outra Peça</span>
              </button>
            </div>

            <div className="space-y-4">
              {products.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#EDE5D8] pb-1">
                    <span className="text-[11px] font-bold text-[#C85A32] uppercase">
                      Peça #{idx + 1}
                    </span>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(p.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Remover</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#7F4F24] uppercase mb-1">
                        Nome da Peça
                      </label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => handleProductChange(p.id, 'name', e.target.value)}
                        placeholder="Ex: Travessa Rústica em Grés"
                        className="w-full px-3 py-2 rounded-xl border border-[#EDE5D8] text-xs bg-white focus:border-[#C85A32] outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#7F4F24] uppercase mb-1">
                        Preço (R$)
                      </label>
                      <input
                        type="number"
                        value={p.price || ''}
                        onChange={(e) => handleProductChange(p.id, 'price', e.target.value)}
                        placeholder="85.00"
                        className="w-full px-3 py-2 rounded-xl border border-[#EDE5D8] text-xs bg-white focus:border-[#C85A32] outline-hidden"
                      />
                    </div>
                  </div>

                  <ImageUpload
                    label="Foto da Peça (Carregar Arquivo)"
                    helperText="Selecione um arquivo de foto do produto"
                    aspectRatio="square"
                    value={p.imageUrl}
                    onChange={(url) => handleProductChange(p.id, 'imageUrl', url)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#EDE5D8] flex items-center justify-between">
            <Link
              href="/admin/artesaos"
              className="px-6 py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#4A3525] font-semibold text-xs transition-colors"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Salvando e gerando convite...</span>
              ) : (
                <>
                  <Send size={15} />
                  <span>Salvar e Gerar Convite</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
