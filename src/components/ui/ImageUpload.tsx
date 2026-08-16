'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Foto / Imagem',
  helperText = 'Clique para selecionar do seu dispositivo ou arraste um arquivo (PNG, JPG, WEBP)',
  aspectRatio = 'square',
  className = '',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: 'aspect-square max-w-[180px]',
    video: 'aspect-video w-full',
    banner: 'aspect-[3/1] w-full',
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setShowUrlInput(false);
      setUrlDraft('');
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-[#7F4F24] hover:text-[#C85A32] flex items-center gap-1 font-semibold"
          >
            <LinkIcon size={12} />
            <span>{showUrlInput ? 'Carregar por arquivo' : 'Inserir por Link/URL'}</span>
          </button>
        </div>
      )}

      {showUrlInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://exemplo.com/minha-imagem.jpg"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#EDE5D8] text-xs bg-white focus:border-[#C85A32] outline-hidden"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#2D6A4F] transition-colors"
          >
            Aplicar
          </button>
        </div>
      ) : value ? (
        <div className="relative group rounded-2xl overflow-hidden border-2 border-[#EDE5D8] bg-[#FAF7F2] inline-block max-w-full">
          <img
            src={value}
            alt="Preview"
            className={`object-cover rounded-2xl ${aspectClasses[aspectRatio]}`}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-white/90 text-[#1B4332] text-xs font-bold hover:bg-white transition-colors"
              title="Trocar foto"
            >
              Trocar Foto
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 rounded-xl bg-red-600/90 text-white text-xs font-bold hover:bg-red-600 transition-colors"
              title="Remover foto"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-[#C85A32] bg-[#FDE8E1]/50 scale-101'
              : 'border-[#EDE5D8] bg-[#FAF7F2] hover:bg-[#F4EFE6] hover:border-[#C85A32]/50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white text-[#C85A32] flex items-center justify-center shadow-xs border border-[#EDE5D8]">
            <Upload size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1B4332] block">
              Carregar foto do dispositivo
            </span>
            <span className="text-[10px] text-[#7F4F24] block mt-0.5 max-w-xs leading-tight">
              {helperText}
            </span>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
