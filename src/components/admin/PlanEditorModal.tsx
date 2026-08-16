'use client';

import React, { useState } from 'react';
import {
  X,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Save,
  Star,
  Settings,
  History,
  Calendar,
  Layers,
} from 'lucide-react';
import { Store, PlanType, AccountStatus, PlanStatus, ManualOverrides } from '@/types';
import { storeService } from '@/lib/data/store-service';
import { getStoreEffectiveEntitlements, getPlanDisplayName, getAccountStatusBadge, getPlanStatusBadge } from '@/lib/plans/entitlements';

interface PlanEditorModalProps {
  store: Store;
  onClose: () => void;
  onSuccess: (updatedStore: Store) => void;
}

export default function PlanEditorModal({
  store,
  onClose,
  onSuccess,
}: PlanEditorModalProps) {
  const [planType, setPlanType] = useState<PlanType>(store.planType || 'FREE');
  const [accountStatus, setAccountStatus] = useState<AccountStatus>(store.accountStatus || 'ACTIVE');
  const [planStatus, setPlanStatus] = useState<PlanStatus>(store.planStatus || 'ACTIVE');
  
  const [noExpiration, setNoExpiration] = useState<boolean>(!store.planExpiresAt);
  const [planStartedAt, setPlanStartedAt] = useState<string>(
    store.planStartedAt ? store.planStartedAt.split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [planExpiresAt, setPlanExpiresAt] = useState<string>(
    store.planExpiresAt ? store.planExpiresAt.split('T')[0] : ''
  );

  const [verified, setVerified] = useState<boolean>(store.verified || false);
  const [isFeatured, setIsFeatured] = useState<boolean>(store.isFeatured || false);

  // Manual overrides state
  const [showOverrides, setShowOverrides] = useState<boolean>(false);
  const [customMaxProducts, setCustomMaxProducts] = useState<string>(
    store.manualOverrides?.maxProducts !== undefined ? String(store.manualOverrides.maxProducts ?? '') : ''
  );
  const [overrideOffers, setOverrideOffers] = useState<boolean>(
    store.manualOverrides?.canCreateOffers || false
  );
  const [overrideStats, setOverrideStats] = useState<boolean>(
    store.manualOverrides?.canAdvancedStats || false
  );

  const [adminNotes, setAdminNotes] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'edit' | 'history'>('edit');
  const [saving, setSaving] = useState<boolean>(false);

  const entitlements = getStoreEffectiveEntitlements(store);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const overrides: ManualOverrides = {};
      if (customMaxProducts.trim() !== '') {
        const parsed = parseInt(customMaxProducts, 10);
        overrides.maxProducts = isNaN(parsed) ? null : parsed;
      }
      if (overrideOffers) overrides.canCreateOffers = true;
      if (overrideStats) overrides.canAdvancedStats = true;

      const updated = await storeService.updateStorePlanAndPermissions(store.id, {
        planType,
        accountStatus,
        planStatus,
        planStartedAt: new Date(planStartedAt).toISOString(),
        planExpiresAt: noExpiration || !planExpiresAt ? null : new Date(planExpiresAt).toISOString(),
        verified,
        isFeatured,
        manualOverrides: Object.keys(overrides).length > 0 ? overrides : undefined,
        adminNotes: adminNotes.trim() || undefined,
        performedBy: 'Administrador Master',
      });

      if (updated) {
        onSuccess(updated);
      }
    } catch (err: any) {
      alert('Erro ao salvar permissões: ' + (err?.message || 'Tente novamente.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#EDE5D8] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1B4332] text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E9C46A] text-[#1B4332] flex items-center justify-center font-bold shrink-0">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-white">
                  {store.name}
                </h2>
                <span className="text-[10px] bg-white/20 text-[#E9C46A] px-2 py-0.5 rounded-md font-bold uppercase">
                  Master
                </span>
              </div>
              <p className="text-xs text-white/80">
                Por {store.artisanName} • {store.city?.name || 'São Roque'} • {store.productsCount || 0} produtos cadastrados
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#EDE5D8] px-6 bg-[#FAF7F2]">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'border-[#C85A32] text-[#C85A32]'
                : 'border-transparent text-[#7F4F24] hover:text-[#2C2623]'
            }`}
          >
            <Settings size={14} />
            <span>Configurar Plano & Permissões</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-[#C85A32] text-[#C85A32]'
                : 'border-transparent text-[#7F4F24] hover:text-[#2C2623]'
            }`}
          >
            <History size={14} />
            <span>Histórico de Alterações ({store.planHistory?.length || 0})</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'edit' ? (
            <form id="plan-form" onSubmit={handleSave} className="space-y-6">
              {/* 1. SELEÇÃO DO PLANO */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
                  1. Plano da Conta
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPlanType('FREE')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      planType === 'FREE'
                        ? 'border-[#C85A32] bg-[#FAF7F2] ring-2 ring-[#C85A32]/20'
                        : 'border-[#EDE5D8] hover:border-[#7F4F24]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1B4332]">Plano Gratuito</span>
                      {planType === 'FREE' && <CheckCircle2 size={16} className="text-[#C85A32]" />}
                    </div>
                    <p className="text-[11px] text-[#7F4F24] mt-1">
                      Limite de até 10 produtos e 10 fotos por peça. Sem ofertas ou destaques automáticos.
                    </p>
                  </div>

                  <div
                    onClick={() => setPlanType('PROFESSIONAL')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      planType === 'PROFESSIONAL' || planType === 'PRO'
                        ? 'border-[#2D6A4F] bg-[#D8F3DC]/30 ring-2 ring-[#2D6A4F]/20'
                        : 'border-[#EDE5D8] hover:border-[#7F4F24]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1B4332]">Plano Profissional (R$ 49,90)</span>
                      {(planType === 'PROFESSIONAL' || planType === 'PRO') && (
                        <CheckCircle2 size={16} className="text-[#2D6A4F]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#7F4F24] mt-1">
                      Produtos ilimitados, ofertas, fotos extras e estatísticas completas.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. STATUS DA CONTA & DO PLANO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                    Status da Conta
                  </label>
                  <select
                    value={accountStatus}
                    onChange={(e) => setAccountStatus(e.target.value as AccountStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE5D8] bg-white text-xs font-medium text-[#2C2623] focus:outline-none focus:border-[#C85A32]"
                  >
                    <option value="ACTIVE">🟢 Ativa (Uso Normal)</option>
                    <option value="SUSPENDED">🟡 Suspensa (Recursos Bloqueados)</option>
                    <option value="PENDING">⚪ Pendente (Aguardando Aprovação)</option>
                    <option value="BLOCKED">🔴 Bloqueada (Acesso Negado)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                    Status do Plano
                  </label>
                  <select
                    value={planStatus}
                    onChange={(e) => setPlanStatus(e.target.value as PlanStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE5D8] bg-white text-xs font-medium text-[#2C2623] focus:outline-none focus:border-[#C85A32]"
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="MANUAL">Manual (Concessão Master)</option>
                    <option value="EXPIRED">Expirado (Fallback Free)</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* 3. VIGÊNCIA / VALIDADE MANUAL */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7F4F24] flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#C85A32]" />
                    <span>Período de Validade do Plano</span>
                  </span>

                  <label className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noExpiration}
                      onChange={(e) => {
                        setNoExpiration(e.target.checked);
                        if (e.target.checked) setPlanExpiresAt('');
                      }}
                      className="rounded text-[#C85A32] focus:ring-[#C85A32]"
                    />
                    <span>Sem data de expiração (Vitalício / Contínuo)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#7F4F24] mb-1">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={planStartedAt}
                      onChange={(e) => setPlanStartedAt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#EDE5D8] bg-white text-xs text-[#2C2623]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#7F4F24] mb-1">
                      Data de Término
                    </label>
                    <input
                      type="date"
                      disabled={noExpiration}
                      value={planExpiresAt}
                      onChange={(e) => setPlanExpiresAt(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border bg-white text-xs text-[#2C2623] ${
                        noExpiration ? 'opacity-40 border-gray-200 cursor-not-allowed' : 'border-[#EDE5D8]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* 4. SELO VERIFICADO E DESTAQUE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#EDE5D8] hover:bg-[#FAF7F2] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2D6A4F] focus:ring-[#2D6A4F]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1B4332] block flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-[#2D6A4F]" />
                      <span>Selo de Produtor Verificado ✓</span>
                    </span>
                    <span className="text-[10px] text-[#7F4F24]">Concede badge de confiança no perfil e peças</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#EDE5D8] hover:bg-[#FAF7F2] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C85A32] focus:ring-[#C85A32]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1B4332] block flex items-center gap-1">
                      <Star size={13} className="text-[#E9C46A] fill-[#E9C46A]" />
                      <span>Vitrine em Destaque ⭐</span>
                    </span>
                    <span className="text-[10px] text-[#7F4F24]">Exibição no topo da Home e de São Roque</span>
                  </div>
                </label>
              </div>

              {/* 5. OVERRIDES MANUAIS / EXCEÇÕES */}
              <div className="border border-[#EDE5D8] rounded-2xl p-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowOverrides(!showOverrides)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#7F4F24]"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers size={14} className="text-[#C85A32]" />
                    <span>Exceções & Overrides Administrativos (Opcional)</span>
                  </span>
                  <span>{showOverrides ? '▲ Ocultar' : '▼ Expandir'}</span>
                </button>

                {showOverrides && (
                  <div className="pt-3 border-t border-[#EDE5D8] space-y-3 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[11px] font-medium text-[#7F4F24] mb-1">
                        Limite Customizado de Produtos (deixe vazio para usar a regra padrão do plano)
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 10"
                        value={customMaxProducts}
                        onChange={(e) => setCustomMaxProducts(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#EDE5D8] text-xs text-[#2C2623]"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-[#4A3525] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={overrideOffers}
                          onChange={(e) => setOverrideOffers(e.target.checked)}
                          className="rounded text-[#C85A32]"
                        />
                        <span>Liberar criação de Ofertas/Promoções</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-[#4A3525] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={overrideStats}
                          onChange={(e) => setOverrideStats(e.target.checked)}
                          className="rounded text-[#C85A32]"
                        />
                        <span>Liberar Estatísticas Avançadas</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. OBSERVAÇÃO ADMINISTRATIVA */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                  Observação Administrativa / Motivo da Concessão
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Concedido cortesia de 12 meses durante o lançamento do Descubra Artes em São Roque."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE5D8] text-xs text-[#2C2623] focus:outline-none focus:border-[#C85A32]"
                />
              </div>
            </form>
          ) : (
            /* HISTÓRICO DE AUDITORIA */
            <div className="space-y-3">
              {store.planHistory && store.planHistory.length > 0 ? (
                store.planHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1B4332]">{entry.action}</span>
                      <span className="text-[11px] text-[#9E9188]">
                        {new Date(entry.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-[#6B625B] italic">&ldquo;{entry.notes}&rdquo;</p>
                    )}
                    <span className="text-[10px] text-[#7F4F24] block">
                      Por: {entry.performedBy}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-[#7F4F24] text-xs">
                  Nenhuma alteração administrativa registrada anteriormente.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-[#FAF7F2] border-t border-[#EDE5D8] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#EDE5D8] text-xs font-bold text-[#7F4F24] hover:bg-white transition-colors"
          >
            Cancelar
          </button>

          {activeTab === 'edit' && (
            <button
              type="submit"
              form="plan-form"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
