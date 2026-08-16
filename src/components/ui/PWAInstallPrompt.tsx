'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, Sparkles } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if dismissed before
    const isDismissed = localStorage.getItem('descubra_artes_pwa_dismissed');
    if (isDismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('descubra_artes_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 bg-[#1B4332] text-white p-4 rounded-2xl shadow-2xl border border-white/20 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#C85A32] flex items-center justify-center font-bold text-xl shrink-0">
            🧵
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-white">
              Instalar Descubra Artes
            </h4>
            <p className="text-xs text-white/80 mt-0.5">
              Tenha o guia de artesãos e ateliês sempre à mão no seu celular, inclusive offline!
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-white/60 hover:text-white p-1"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 py-2 px-3 bg-[#E9C46A] hover:bg-[#D4A373] text-[#1B4332] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download size={14} />
          <span>Instalar Aplicativo</span>
        </button>
        <button
          onClick={handleDismiss}
          className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs rounded-xl transition-colors"
        >
          Depois
        </button>
      </div>
    </div>
  );
}
