'use client';

import React, { useState } from 'react';
import { MessageCircle, Check } from 'lucide-react';
import { logWhatsAppClick, generateWhatsAppUrl } from '@/lib/analytics';
import confetti from 'canvas-confetti';

interface WhatsAppButtonProps {
  phone: string;
  storeName: string;
  storeId: string;
  productName?: string;
  productId?: string;
  cityId?: string;
  variant?: 'primary' | 'secondary' | 'floating' | 'compact';
  customLabel?: string;
  className?: string;
}

export default function WhatsAppButton({
  phone,
  storeName,
  storeId,
  productName,
  productId,
  cityId,
  variant = 'primary',
  customLabel,
  className = '',
}: WhatsAppButtonProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Trigger subtle confetti celebration for buying direct from maker
    try {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#25D366', '#C85A32', '#E9C46A', '#1B4332'],
      });
    } catch {}

    setClicked(true);
    setTimeout(() => setClicked(false), 2500);

    // Build personalized message matching Descubra Artes commercial standard
    let message = '';
    if (productName) {
      message = `Olá! Encontrei o produto "${productName}" no Descubra Artes e gostaria de saber mais informações.`;
    } else {
      message = `Olá! Encontrei seu ateliê "${storeName}" no Descubra Artes e gostaria de saber mais informações sobre suas peças e produtos.`;
    }

    // Log analytics conversion
    logWhatsAppClick(storeId, productId, cityId, productName);

    // Open WhatsApp
    const url = generateWhatsAppUrl(phone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const defaultLabel = productName ? 'Comprar pelo WhatsApp' : 'Falar no WhatsApp';
  const label = customLabel || defaultLabel;

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#EDE5D8] z-40 md:hidden shadow-lg">
        <button
          onClick={handleClick}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-[#25D366] hover:bg-[#1EBE5B] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-md ${className}`}
        >
          {clicked ? (
            <>
              <Check size={20} className="animate-bounce" />
              <span>Abrindo WhatsApp...</span>
            </>
          ) : (
            <>
              <MessageCircle size={20} className="fill-white/20" />
              <span>{label}</span>
            </>
          )}
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        title="Falar no WhatsApp direto com o artesão"
        className={`p-2.5 rounded-full text-white bg-[#25D366] hover:bg-[#1EBE5B] active:scale-95 transition-all shadow-xs hover:shadow-md ${className}`}
      >
        <MessageCircle size={18} />
      </button>
    );
  }

  if (variant === 'secondary') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-[#1B4332] bg-[#D8F3DC] hover:bg-[#b7ebc0] border border-[#2D6A4F]/20 transition-all ${className}`}
      >
        <MessageCircle size={17} className="text-[#1B4332]" />
        <span>{label}</span>
      </button>
    );
  }

  // Primary Default
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#25D366] hover:bg-[#1EBE5B] active:scale-[0.98] transition-all shadow-sm hover:shadow-md cursor-pointer ${className}`}
    >
      {clicked ? (
        <>
          <Check size={20} />
          <span>Abrindo conversa...</span>
        </>
      ) : (
        <>
          <MessageCircle size={20} className="shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
