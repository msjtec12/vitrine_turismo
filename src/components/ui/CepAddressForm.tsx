'use client';

import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, AlertCircle, HelpCircle, Edit3 } from 'lucide-react';
import { fetchAddressByCep, formatCep } from '@/lib/cep';

interface CepAddressFormProps {
  cep: string;
  onCepChange: (cep: string) => void;
  street: string;
  onStreetChange: (street: string) => void;
  number?: string;
  onNumberChange?: (number: string) => void;
  neighborhood: string;
  onNeighborhoodChange: (neighborhood: string) => void;
  complement?: string;
  onComplementChange?: (complement: string) => void;
  city?: string;
  state?: string;
}

export default function CepAddressForm({
  cep,
  onCepChange,
  street,
  onStreetChange,
  number = '',
  onNumberChange,
  neighborhood,
  onNeighborhoodChange,
  complement = '',
  onComplementChange,
  city = 'São Roque',
  state = 'SP',
}: CepAddressFormProps) {
  const [loading, setLoading] = useState(false);
  const [cepNotice, setCepNotice] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);
  const [manualMode, setManualMode] = useState(false);

  const handleCepBlurOrSearch = async (cepValue: string) => {
    const clean = cepValue.replace(/\D/g, '');
    if (clean.length !== 8) {
      if (clean.length > 0) {
        setCepNotice({ type: 'warning', text: 'CEP incompleto. Digite os 8 dígitos.' });
      }
      return;
    }

    setLoading(true);
    setCepNotice(null);

    const result = await fetchAddressByCep(clean);
    setLoading(false);

    if (result.error) {
      setCepNotice({ type: 'warning', text: result.error });
      setManualMode(true);
      return;
    }

    if (result.isSingleCityCep) {
      setCepNotice({
        type: 'warning',
        text: `CEP geral para a cidade de ${result.city} - ${result.state}. Por favor, preencha o logradouro e bairro manualmente.`,
      });
      setManualMode(true);
    } else {
      setCepNotice({
        type: 'success',
        text: `Endereço localizado: ${result.street}, ${result.neighborhood} — ${result.city}/${result.state}`,
      });
      if (result.street) onStreetChange(result.street);
      if (result.neighborhood) onNeighborhoodChange(result.neighborhood);
    }
  };

  const handleCepInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    onCepChange(formatted);
    if (formatted.replace(/\D/g, '').length === 8) {
      handleCepBlurOrSearch(formatted);
    }
  };

  return (
    <div className="space-y-4">
      {/* CEP Input Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider">
              CEP de São Roque *
            </label>
            <button
              type="button"
              onClick={() => setManualMode(!manualMode)}
              className="text-[11px] text-[#7F4F24] hover:text-[#C85A32] font-semibold flex items-center gap-1"
            >
              <Edit3 size={11} />
              <span>{manualMode ? 'Usar busca por CEP' : 'Digitar manual'}</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={cep}
              onChange={handleCepInputChange}
              onBlur={() => handleCepBlurOrSearch(cep)}
              placeholder="18130-000"
              maxLength={9}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm bg-white"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#C85A32] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() => handleCepBlurOrSearch(cep)}
            disabled={loading || !cep}
            className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#1B4332] font-bold text-xs border border-[#EDE5D8] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Search size={14} className="text-[#C85A32]" />
            <span>Buscar Endereço pelo CEP</span>
          </button>
        </div>
      </div>

      {/* Notice Message */}
      {cepNotice && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            cepNotice.type === 'success'
              ? 'bg-[#D8F3DC]/60 border-[#2D6A4F]/30 text-[#1B4332]'
              : cepNotice.type === 'warning'
              ? 'bg-[#FEF9EF] border-[#EDE5D8] text-[#7F4F24]'
              : 'bg-[#FDE8E1] border-[#C85A32]/30 text-[#C85A32]'
          }`}
        >
          {cepNotice.type === 'success' ? (
            <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0" />
          ) : (
            <HelpCircle size={15} className="text-[#C85A32] shrink-0" />
          )}
          <span className="leading-snug">{cepNotice.text}</span>
        </div>
      )}

      {/* Street, Number, Neighborhood, Complement */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-3">
          <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1">
            Logradouro / Rua / Estrada / Roteiro *
          </label>
          <input
            type="text"
            required
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            placeholder="Ex: Estrada do Vinho, km 5"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm bg-white"
          />
        </div>

        {onNumberChange && (
          <div>
            <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1">
              Número / Km
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => onNumberChange(e.target.value)}
              placeholder="Ex: 500 ou S/N"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm bg-white"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1">
            Bairro / Região *
          </label>
          <input
            type="text"
            required
            value={neighborhood}
            onChange={(e) => onNeighborhoodChange(e.target.value)}
            placeholder="Ex: Roteiro do Vinho ou Centro"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm bg-white"
          />
        </div>

        {onComplementChange && (
          <div>
            <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1">
              Complemento / Ponto de Referência
            </label>
            <input
              type="text"
              value={complement}
              onChange={(e) => onComplementChange(e.target.value)}
              placeholder="Ex: Próximo à Vinícola Góes"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
