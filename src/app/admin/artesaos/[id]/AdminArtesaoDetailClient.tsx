'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Store as StoreIcon,
  Package,
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Star,
  Copy,
  Check,
  ArrowLeft,
  MessageSquare,
  Award,
} from 'lucide-react';
import { Artisan, Store, Product, StoreCompleteness, PlanType } from '@/types';
import { storeService } from '@/lib/data/store-service';
import { VerifiedBadge } from '@/components/ui/Badges';
import { getStoreEffectiveEntitlements, getPlanDisplayName, getAccountStatusBadge, getPlanStatusBadge } from '@/lib/plans/entitlements';
import PlanEditorModal from '@/components/admin/PlanEditorModal';

interface AdminArtesaoDetailClientProps {
  artisan: Artisan;
  store?: Store;
  products: Product[];
  completeness?: StoreCompleteness;
}

export default function AdminArtesaoDetailClient({
  artisan: initialArtisan,
  store: initialStore,
  products,
  completeness,
}: AdminArtesaoDetailClientProps) {
  const router = useRouter();
  const [artisan, setArtisan] = useState<Artisan>(initialArtisan);
  const [store, setStore] = useState<Store | undefined>(initialStore);
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [adminNotes, setAdminNotes] = useState(artisan.adminNotes || store?.adminNotes || '');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleModerate = async (action: 'APPROVE' | 'REJECT' | 'SUSPEND' | 'REQUEST_CHANGES') => {
    if (!store) return;
    setActionLoading(true);
    try {
      await storeService.moderateStore(store.id, action, adminNotes);
      const updatedStore = await storeService.getStoreById(store.id);
      const updatedArtisan = await storeService.getArtisanById(artisan.id);
      if (updatedStore) setStore(updatedStore);
      if (updatedArtisan) setArtisan(updatedArtisan);
      setShowNotesModal(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleVerified = async () => {
    if (!store) return;
    await storeService.toggleStoreVerified(store.id);
    const updatedStore = await storeService.getStoreById(store.id);
    if (updatedStore) setStore(updatedStore);
    router.refresh();
  };

  const handleToggleFounding = async () => {
    await storeService.toggleFoundingMember(artisan.id);
    const updatedArtisan = await storeService.getArtisanById(artisan.id);
    if (updatedArtisan) setArtisan(updatedArtisan);
    router.refresh();
  };

  const handleCopyInvitation = () => {
    if (!artisan.invitationToken) return;
    const url = `${window.location.origin}/convite/${artisan.invitationToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/artesaos"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7F4F24] hover:text-[#C85A32] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Voltar para Lista de Artesãos</span>
        </Link>

        {store && (
          <Link
            href={`/loja/${store.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4332] hover:text-[#C85A32] bg-white px-3.5 py-1.5 rounded-xl border border-[#EDE5D8] transition-colors shadow-2xs"
          >
            <span>Ver Vitrine Pública</span>
            <ExternalLink size={13} />
          </Link>
        )}
      </div>

      {/* Header Info Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={artisan.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={artisan.fullName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#EDE5D8] shadow-xs shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#1B4332]">
                {artisan.fullName}
              </h1>
              {store?.verified && <VerifiedBadge size="sm" />}
              {artisan.foundingMember && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF9EF] text-[#7F4F24] text-xs font-bold border border-[#EDE5D8]">
                  <Star size={12} className="text-[#E9C46A] fill-[#E9C46A]" />
                  <span>Artesão Fundador</span>
                </span>
              )}
            </div>

            <p className="text-xs text-[#7F4F24]">
              {store?.name} • Cadastrado em {new Date(artisan.createdAt).toLocaleDateString('pt-BR')} • Origem: <strong>{artisan.onboardingSource}</strong>
            </p>

            <div className="flex items-center gap-4 text-xs text-[#4A3525] pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Phone size={13} className="text-[#C85A32]" />
                <span>{artisan.phone}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail size={13} className="text-[#C85A32]" />
                <span>{artisan.email}</span>
              </span>
              {store?.instagram && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 fill-current text-[#C85A32]" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>{store.instagram}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Current Status Pill */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              artisan.status === 'APPROVED'
                ? 'bg-[#D8F3DC] text-[#1B4332]'
                : artisan.status === 'SUSPENDED'
                ? 'bg-red-100 text-red-700'
                : 'bg-[#FEF9EF] text-[#C85A32] border border-[#EDE5D8]'
            }`}
          >
            Status: {artisan.status === 'APPROVED' ? 'Aprovado' : artisan.status === 'SUSPENDED' ? 'Suspenso' : 'Pendente de Análise'}
          </div>

          {completeness && (
            <div className="text-right">
              <span className="text-[11px] font-bold text-[#7F4F24] block">
                Perfil {completeness.score}% completo
              </span>
              <div className="w-28 h-2 bg-[#EDE5D8] rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#1B4332] rounded-full"
                  style={{ width: `${completeness.score}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Moderation Actions Bar */}
      <div className="bg-[#FAF7F2] p-5 rounded-3xl border border-[#EDE5D8] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleModerate('APPROVE')}
            disabled={actionLoading}
            className="px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 size={15} />
            <span>Aprovar & Publicar Loja</span>
          </button>

          <button
            onClick={() => setShowNotesModal(true)}
            disabled={actionLoading}
            className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle size={15} />
            <span>Solicitar Alterações</span>
          </button>

          <button
            onClick={() => handleModerate('SUSPEND')}
            disabled={actionLoading}
            className="px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <XCircle size={15} />
            <span>Suspender</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {store && (
            <button
              onClick={() => setShowPlanModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles size={14} className="text-[#E9C46A]" />
              <span>Gerenciar Plano & Permissões</span>
            </button>
          )}

          <button
            onClick={handleToggleVerified}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EDE5D8] border border-[#EDE5D8] text-xs font-bold text-[#1B4332] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck size={14} className="text-[#2D6A4F]" />
            <span>{store?.verified ? 'Remover Selo Verificado' : 'Conceder Selo Verificado'}</span>
          </button>

          <button
            onClick={handleToggleFounding}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EDE5D8] border border-[#EDE5D8] text-xs font-bold text-[#7F4F24] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Star size={14} className="text-[#E9C46A] fill-[#E9C46A]" />
            <span>{artisan.foundingMember ? 'Remover Fundador' : '⭐ Marcar como Fundador'}</span>
          </button>
        </div>
      </div>

      {/* Plan & Entitlements Overview Card */}
      {store && (
        <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDE5D8] pb-3">
            <h3 className="font-serif font-bold text-base text-[#1B4332] flex items-center gap-2">
              <Sparkles size={16} className="text-[#C85A32]" />
              <span>Plano & Entitlements da Conta</span>
            </h3>

            <button
              onClick={() => setShowPlanModal(true)}
              className="text-xs font-bold text-[#C85A32] hover:underline"
            >
              Editar Plano
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8]">
              <span className="text-[10px] uppercase font-bold text-[#7F4F24] block">Plano Atual</span>
              <span className="font-bold text-sm text-[#1B4332]">{getPlanDisplayName(store.planType)}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8]">
              <span className="text-[10px] uppercase font-bold text-[#7F4F24] block">Status da Conta</span>
              <span className="font-bold text-sm text-[#2C2623]">{store.accountStatus || 'Ativa'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8]">
              <span className="text-[10px] uppercase font-bold text-[#7F4F24] block">Validade</span>
              <span className="font-bold text-sm text-[#1B4332]">
                {store.planExpiresAt ? new Date(store.planExpiresAt).toLocaleDateString('pt-BR') : 'Sem expiração'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8]">
              <span className="text-[10px] uppercase font-bold text-[#7F4F24] block">Limite de Produtos</span>
              <span className="font-bold text-sm text-[#1B4332]">
                {products.length} / {getStoreEffectiveEntitlements(store).maxProducts ?? '∞'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Invitation Section (if token exists) */}
      {artisan.invitationToken && (
        <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#1B4332] flex items-center gap-2">
              <Sparkles size={16} className="text-[#C85A32]" />
              <span>Link de Convite do Artesão</span>
            </h3>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                artisan.invitationStatus === 'ACCEPTED'
                  ? 'bg-[#D8F3DC] text-[#1B4332]'
                  : 'bg-[#FEF9EF] text-[#C85A32] border border-[#EDE5D8]'
              }`}
            >
              Status: {artisan.invitationStatus === 'ACCEPTED' ? 'Aceito pelo artesão' : 'Aguardando definição de senha'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/convite/${artisan.invitationToken}`}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] text-xs font-mono text-[#2C2623]"
            />
            <button
              onClick={handleCopyInvitation}
              className="px-4 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#A4421F] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar Convite'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Admin Notes Display */}
      {artisan.adminNotes && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
          <span className="font-bold text-amber-900 flex items-center gap-1.5">
            <AlertTriangle size={14} />
            <span>Observação da Curadoria / Solicitação de Alteração:</span>
          </span>
          <p className="text-amber-800">{artisan.adminNotes}</p>
        </div>
      )}

      {/* Store & Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Store Profile */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1B4332] border-b border-[#EDE5D8] pb-3">
              Dados do Ateliê
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-[10px] text-[#7F4F24] uppercase block">Endereço</span>
                <span className="text-[#2C2623]">{store?.address}</span>
              </div>

              <div>
                <span className="font-bold text-[10px] text-[#7F4F24] uppercase block">Categoria</span>
                <span className="text-[#2C2623]">{store?.category?.name || 'Cerâmica & Barro'}</span>
              </div>

              <div>
                <span className="font-bold text-[10px] text-[#7F4F24] uppercase block">Horário</span>
                <span className="text-[#2C2623]">{store?.openingHours}</span>
              </div>

              <div>
                <span className="font-bold text-[10px] text-[#7F4F24] uppercase block">Descrição</span>
                <p className="text-[#6B625B] leading-relaxed mt-0.5">{store?.bio}</p>
              </div>
            </div>
          </div>

          {/* Completeness Checklist */}
          {completeness && (
            <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-base text-[#1B4332] border-b border-[#EDE5D8] pb-2">
                Checklist de Qualidade
              </h3>
              <div className="space-y-2 text-xs">
                {completeness.checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
                    )}
                    <span className={item.completed ? 'text-[#2C2623]' : 'text-[#7F6A5D]'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Products List */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDE5D8] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#1B4332] flex items-center gap-2">
                <Package size={18} className="text-[#C85A32]" />
                <span>Catálogo de Peças ({products.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] flex items-center gap-4 hover:bg-white transition-colors"
                >
                  <img
                    src={product.coverImage}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#EDE5D8]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-[#1B4332] truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-[#7F4F24] line-clamp-1 mt-0.5">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="font-bold text-[#C85A32]">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          product.status === 'APPROVED'
                            ? 'bg-[#D8F3DC] text-[#1B4332]'
                            : 'bg-[#FEF9EF] text-[#C85A32]'
                        }`}
                      >
                        {product.status === 'APPROVED' ? 'Aprovado' : 'Pendente'}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/produto/${product.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl text-[#7F4F24] hover:bg-[#EDE5D8] transition-colors"
                    title="Ver produto"
                  >
                    <ExternalLink size={15} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Request Changes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#1B4332] flex items-center gap-2">
              <AlertTriangle size={20} className="text-[#C85A32]" />
              <span>Solicitar Alteração na Loja</span>
            </h3>
            <p className="text-xs text-[#7F4F24]">
              Escreva orientações claras para o artesão ajustar fotos, textos ou endereço antes da aprovação final.
            </p>

            <textarea
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Ex: Por favor adicione fotos mais nítidas das peças e detalhe melhor os materiais utilizados..."
              className="w-full p-3.5 rounded-xl border border-[#EDE5D8] text-xs focus:border-[#C85A32] outline-hidden"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#FAF7F2] text-[#4A3525] font-semibold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleModerate('REQUEST_CHANGES')}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#A4421F] text-white font-bold text-xs shadow-xs transition-colors"
              >
                Enviar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Editor Master Modal */}
      {showPlanModal && store && (
        <PlanEditorModal
          store={store}
          onClose={() => setShowPlanModal(false)}
          onSuccess={(updatedStore) => {
            setStore(updatedStore);
            setShowPlanModal(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
