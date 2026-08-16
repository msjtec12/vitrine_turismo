'use client';

import React, { useState } from 'react';
import { Settings, Check, Bell, Shield, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function PainelConfiguracoesPage() {
  const { user } = useAuth();
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs">
        <h1 className="font-serif font-bold text-2xl text-[#1B4332] flex items-center gap-2">
          <Settings size={22} className="text-[#C85A32]" />
          <span>Configurações da Conta</span>
        </h1>
        <p className="text-xs text-[#7F4F24] mt-1">
          Preferências de notificações e dados do artesão
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-6">
        {isSaved && (
          <div className="p-3 bg-[#D8F3DC] text-[#1B4332] text-xs font-bold rounded-xl flex items-center gap-2">
            <Check size={16} />
            <span>Configurações atualizadas!</span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-[#1B4332]">
            Notificações
          </h3>

          <label className="flex items-center gap-3 text-xs text-[#2C2623] cursor-pointer">
            <input
              type="checkbox"
              checked={notifyWhatsApp}
              onChange={(e) => setNotifyWhatsApp(e.target.checked)}
              className="w-4 h-4 rounded-sm accent-[#1B4332]"
            />
            <span>Receber alerta de novas visualizações semanais no WhatsApp</span>
          </label>

          <label className="flex items-center gap-3 text-xs text-[#2C2623] cursor-pointer">
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="w-4 h-4 rounded-sm accent-[#1B4332]"
            />
            <span>Receber novidades sobre feiras e turismo em São Roque</span>
          </label>
        </div>

        <div className="pt-4 border-t border-[#EDE5D8]">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold shadow-md hover:bg-[#2D6A4F] transition-all cursor-pointer"
          >
            Salvar Preferências
          </button>
        </div>
      </form>
    </div>
  );
}
