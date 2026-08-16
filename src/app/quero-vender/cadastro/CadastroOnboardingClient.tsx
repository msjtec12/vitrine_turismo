'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Store as StoreIcon,
  Package,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Upload,
  AlertCircle,
  HelpCircle,
  Eye,
  Flame,
  Star,
} from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import { City, Category } from '@/types';
import { useAuth } from '@/lib/auth-context';
import Logo from '@/components/ui/Logo';
import ImageUpload from '@/components/ui/ImageUpload';
import CepAddressForm from '@/components/ui/CepAddressForm';

interface CadastroOnboardingClientProps {
  cities: City[];
  categories: Category[];
  foundingCount: number;
}

export default function CadastroOnboardingClient({
  cities,
  categories,
  foundingCount,
}: CadastroOnboardingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Account
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Store & Address
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [cityId, setCityId] = useState(cities[0]?.id || 'city-sao-roque');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-ceramica');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  // Address fields with CEP
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');

  // Step 3: Products
  const [products, setProducts] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      promoPrice?: number;
      materials: string;
      imageUrl: string;
    }>
  >([
    {
      id: 'prod-1',
      name: '',
      description: '',
      price: 0,
      materials: 'Argila, Cerâmica manual',
      imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    },
  ]);

  // Validation Helpers
  const validateStep1 = () => {
    if (!fullName.trim()) return 'Por favor, informe seu nome completo.';
    if (!email.includes('@') || !email.includes('.')) return 'Informe um e-mail válido.';
    if (phone.replace(/\D/g, '').length < 10) return 'Informe um número de telefone/WhatsApp com DDD válido.';
    if (password.length < 6) return 'A senha deve conter no mínimo 6 caracteres.';
    if (password !== confirmPassword) return 'As senhas digitadas não coincidem.';
    return null;
  };

  const validateStep2 = () => {
    if (!storeName.trim()) return 'Informe o nome da sua loja ou ateliê.';
    if (description.trim().length < 20) return 'Escreva uma descrição com pelo menos 20 caracteres sobre o que você produz.';
    if (!whatsapp.replace(/\D/g, '')) return 'Informe o WhatsApp oficial da sua loja para receber pedidos.';
    if (!street.trim()) return 'Informe o logradouro / endereço do seu ateliê em São Roque.';
    if (!neighborhood.trim()) return 'Informe o bairro ou roteiro do seu ateliê.';
    return null;
  };

  const validateStep3 = () => {
    const validProds = products.filter((p) => p.name.trim() && p.price > 0);
    if (validProds.length === 0) {
      return 'Cadastre pelo menos 1 produto com nome e preço para enviar à curadoria.';
    }
    return null;
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setError(err);
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setError(err);
        return;
      }
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 3) {
      const err = validateStep3();
      if (err) {
        setError(err);
        return;
      }
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: `prod-${Date.now()}`,
        name: '',
        description: '',
        price: 0,
        materials: 'Artesanal',
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

  const { loginWithEmail, setActiveStoreId } = useAuth();

  const handleSubmitRegistration = async () => {
    setLoading(true);
    setError('');

    const fullAddress = formatFullAddress();

    try {
      const { store, artisan } = await storeService.createArtisanSelfService({
        fullName,
        email,
        phone,
        storeName,
        description,
        story,
        cityId,
        categoryId,
        whatsapp,
        instagram,
        address: fullAddress,
        neighborhood: neighborhood || 'São Roque',
        logoUrl: logoUrl || undefined,
        coverUrl: coverUrl || undefined,
        products: products
          .filter((p) => p.name.trim() && p.price > 0)
          .map((p) => ({
            name: p.name,
            description: p.description || p.name,
            price: Number(p.price),
            promoPrice: p.promoPrice ? Number(p.promoPrice) : undefined,
            materials: p.materials ? p.materials.split(',').map((m) => m.trim()) : ['Artesanal'],
            images: [p.imageUrl],
          })),
      });

      // Automatically authenticate session for the new artisan
      loginWithEmail(email, 'ARTISAN', store.id, fullName);
      setActiveStoreId(store.id);

      setStep(5);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header / Brand */}
      <div className="text-center space-y-3 mb-8">
        <Logo variant="icon-only" size="xl" href="/" />
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#1B4332]">
          Coloque sua arte no mapa
        </h1>
        <p className="text-sm text-[#7F4F24] max-w-xl mx-auto">
          Crie sua vitrine digital e mostre seus produtos para pessoas que querem conhecer e comprar o que é produzido localmente.
        </p>

        {foundingCount < 50 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF9EF] text-[#7F4F24] border border-[#EDE5D8] text-xs font-semibold">
            <Sparkles size={13} className="text-[#C85A32]" />
            <span>
              Campanha Fundadores de São Roque: <strong>{50 - foundingCount} vagas restantes</strong> para o selo oficial ⭐
            </span>
          </div>
        )}
      </div>

      {/* Progress Steps Header */}
      {step < 5 && (
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#EDE5D8] shadow-xs mb-8">
          <div className="flex items-center justify-between max-w-lg mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#EDE5D8] -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#C85A32] -translate-y-1/2 transition-all duration-500 z-0"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: 'Conta', icon: <User size={15} /> },
              { num: 2, label: 'Loja & Endereço', icon: <StoreIcon size={15} /> },
              { num: 3, label: 'Produtos', icon: <Package size={15} /> },
              { num: 4, label: 'Revisão', icon: <CheckCircle2 size={15} /> },
            ].map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#1B4332] text-white ring-4 ring-[#D8F3DC]'
                        : isCurrent
                        ? 'bg-[#C85A32] text-white ring-4 ring-[#FDE8E1]'
                        : 'bg-[#EDE5D8] text-[#7F6A5D]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 tracking-tight ${
                      isCurrent ? 'text-[#C85A32] font-bold' : isCompleted ? 'text-[#1B4332]' : 'text-[#7F6A5D]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FDE8E1] border border-[#C85A32]/30 text-[#C85A32] text-xs font-semibold flex items-center gap-2 animate-shake">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: CONTA */}
      {step === 1 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EDE5D8] shadow-artisan space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-[#EDE5D8] pb-4">
            <h2 className="font-serif font-bold text-2xl text-[#1B4332]">
              Etapa 1: Crie sua Conta de Artesão
            </h2>
            <p className="text-xs text-[#7F4F24] mt-1">
              Informe seus dados para identificação e acesso ao painel de gerenciamento.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Maria Ramos da Silva"
                className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] outline-hidden text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  E-mail para Login *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maria@artesanato.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  Telefone / WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  Crie sua Senha * (mínimo 6 dígitos)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Link
              href="/quero-vender"
              className="text-xs font-semibold text-[#7F4F24] hover:text-[#C85A32]"
            >
              ← Voltar aos Benefícios
            </Link>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-8 py-3.5 rounded-xl bg-[#C85A32] hover:bg-[#A4421F] text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2"
            >
              <span>Avançar para Dados da Loja</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: LOJA & ENDEREÇO */}
      {step === 2 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EDE5D8] shadow-artisan space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-[#EDE5D8] pb-4">
            <h2 className="font-serif font-bold text-2xl text-[#1B4332]">
              Etapa 2: Monte seu Ateliê & Endereço
            </h2>
            <p className="text-xs text-[#7F4F24] mt-1">
              Essas informações aparecerão no seu perfil público e guiarão turistas até você.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                Nome da Loja / Ateliê *
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ex: Ateliê Maria Bordados & Cerâmica"
                className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] outline-hidden text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  Cidade do Ateliê *
                </label>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm bg-white"
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.uf}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  Categoria Principal *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                Breve Descrição do Ateliê * (mínimo 20 caracteres)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Ex: Peças utilitárias e decorativas feitas à mão com técnicas tradicionais de queima e bordado."
                className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                História do Artesão e Processo de Criação (Opcional)
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={3}
                placeholder="Conte como você começou, de onde vêm seus materiais e o que torna sua arte especial em São Roque..."
                className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  WhatsApp Oficial para Contato / Pedidos *
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="11999999999"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                  Instagram (@nomedaloja)
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@mariabordados"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm"
                />
              </div>
            </div>

            {/* Photos (File Upload) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EDE5D8]">
              <ImageUpload
                label="Logo / Marca do Ateliê"
                helperText="Carregue o logotipo ou foto de perfil (PNG, JPG)"
                aspectRatio="square"
                value={logoUrl}
                onChange={setLogoUrl}
              />

              <ImageUpload
                label="Foto de Capa do Ateliê"
                helperText="Carregue uma foto horizontal da fachada ou oficina"
                aspectRatio="video"
                value={coverUrl}
                onChange={setCoverUrl}
              />
            </div>

            {/* Address with CEP Verification */}
            <div className="pt-4 border-t border-[#EDE5D8] space-y-2">
              <h3 className="font-serif font-bold text-base text-[#1B4332]">
                Endereço & Localização em São Roque
              </h3>
              <p className="text-xs text-[#7F4F24]">
                Digite o CEP para preenchimento automático. Se o CEP for geral da cidade, você poderá preencher a rua manualmente.
              </p>

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

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#4A3525] font-semibold text-sm transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              <span>Voltar</span>
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-8 py-3.5 rounded-xl bg-[#C85A32] hover:bg-[#A4421F] text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2"
            >
              <span>Avançar para Produtos</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PRODUTOS */}
      {step === 3 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EDE5D8] shadow-artisan space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE5D8] pb-4">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#1B4332]">
                Etapa 3: Adicione Seus Primeiros Produtos
              </h2>
              <p className="text-xs text-[#7F4F24] mt-1">
                Cadastre as peças principais que você deseja expor para os turistas.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddProduct}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D8F3DC] text-[#1B4332] hover:bg-[#B7E4C7] font-bold text-xs transition-colors shrink-0"
            >
              <Plus size={15} />
              <span>Adicionar Outro Produto</span>
            </button>
          </div>

          <div className="space-y-6">
            {products.map((p, idx) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] relative space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#EDE5D8] pb-2">
                  <span className="text-xs font-bold text-[#C85A32] uppercase tracking-wider">
                    Produto #{idx + 1}
                  </span>
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(p.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      <span>Remover</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#4A3525] uppercase tracking-wider mb-1">
                      Nome da Peça *
                    </label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => handleProductChange(p.id, 'name', e.target.value)}
                      placeholder="Ex: Vaso Grés Terracota Orgânico"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3525] uppercase tracking-wider mb-1">
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={p.price || ''}
                      onChange={(e) => handleProductChange(p.id, 'price', e.target.value)}
                      placeholder="120.00"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3525] uppercase tracking-wider mb-1">
                      Preço Promo (Opcional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={p.promoPrice || ''}
                      onChange={(e) => handleProductChange(p.id, 'promoPrice', e.target.value)}
                      placeholder="99.00"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#4A3525] uppercase tracking-wider mb-1">
                      Materiais / Técnicas
                    </label>
                    <input
                      type="text"
                      value={p.materials}
                      onChange={(e) => handleProductChange(p.id, 'materials', e.target.value)}
                      placeholder="Ex: Argila local, Esmalte botânico"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm bg-white"
                    />
                  </div>

                  {/* Photo File Upload */}
                  <div className="sm:col-span-2">
                    <ImageUpload
                      label="Foto da Peça (Carregar Arquivo)"
                      helperText="Carregue uma foto da peça artesanal em boa iluminação"
                      aspectRatio="square"
                      value={p.imageUrl}
                      onChange={(url) => handleProductChange(p.id, 'imageUrl', url)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#4A3525] font-semibold text-sm transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              <span>Voltar</span>
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-8 py-3.5 rounded-xl bg-[#C85A32] hover:bg-[#A4421F] text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2"
            >
              <span>Revisar e Enviar</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVISÃO */}
      {step === 4 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EDE5D8] shadow-artisan space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-[#EDE5D8] pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8F3DC] text-[#1B4332] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} />
              <span>Quase Tudo Pronto!</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332]">
              Etapa 4: Revise as Informações do seu Ateliê
            </h2>
            <p className="text-xs text-[#7F4F24] mt-1">
              Confira se está tudo correto antes de submeter sua vitrine para a curadoria do portal.
            </p>
          </div>

          {/* Review Card */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center font-bold font-serif text-xl shrink-0 overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  storeName.charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1B4332]">{storeName}</h3>
                <p className="text-xs text-[#7F4F24]">
                  Artesão: {fullName} • WhatsApp: {whatsapp}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-[#EDE5D8]">
              <div>
                <span className="font-bold text-[#4A3525] block">Endereço Completo:</span>
                <span className="text-[#7F4F24]">{formatFullAddress()}</span>
              </div>
              <div>
                <span className="font-bold text-[#4A3525] block">Produtos para análise:</span>
                <span className="text-[#7F4F24]">{products.filter((p) => p.name).length} peças</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#4A3525] font-semibold text-sm transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              <span>Voltar e Ajustar</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleSubmitRegistration}
              className="px-9 py-4 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              {loading ? (
                <span>Enviando para aprovação...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Enviar para Aprovação</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUCESSO / AGUARDANDO APROVAÇÃO */}
      {step === 5 && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EDE5D8] shadow-artisan text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif font-extrabold text-3xl text-[#1B4332]">
              Sua loja foi enviada com sucesso!
            </h2>
            <p className="text-xs sm:text-sm text-[#7F4F24] max-w-md mx-auto">
              Nossa equipe de curadoria de São Roque recebeu seu cadastro e entrará em contato em breve pelo WhatsApp.
            </p>
          </div>

          {/* Status Checklist Card */}
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] max-w-md mx-auto text-left space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#2D6A4F] font-bold">
              <CheckCircle2 size={16} />
              <span>Conta de artesão criada com sucesso</span>
            </div>
            <div className="flex items-center gap-2 text-[#2D6A4F] font-bold">
              <CheckCircle2 size={16} />
              <span>Loja e {products.length} peças cadastradas</span>
            </div>
            <div className="flex items-center gap-2 text-[#C85A32] font-bold">
              <Clock size={16} />
              <span>Aguardando análise da curadoria (até 24 horas)</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/painel"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-xs transition-colors"
            >
              Acessar Meu Painel do Artesão
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#4A3525] font-semibold text-xs transition-colors"
            >
              Voltar para a Página Inicial
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
