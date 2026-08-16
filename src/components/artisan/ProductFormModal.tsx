'use client';

import React, { useState } from 'react';
import { X, Upload, Sparkles, Flame, Check, Image as ImageIcon } from 'lucide-react';
import { Product, Category, City } from '@/types';
import { storeService } from '@/lib/data/store-service';
import ImageUpload from '@/components/ui/ImageUpload';

interface ProductFormModalProps {
  product?: Product | null;
  categories: Category[];
  cities: City[];
  storeId: string;
  onClose: () => void;
  onSuccess: (product: Product) => void;
}

export default function ProductFormModal({
  product,
  categories,
  cities,
  storeId,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price ? String(product.price) : '');
  const [promoPrice, setPromoPrice] = useState(product?.promoPrice ? String(product.promoPrice) : '');
  const [isPromo, setIsPromo] = useState(product?.isPromo || false);
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || 'cat-ceramica');
  const [cityId, setCityId] = useState(product?.cityId || 'city-sao-roque');
  const [dimensions, setDimensions] = useState(product?.dimensions || '');
  const [materials, setMaterials] = useState(product?.materials?.join(', ') || '');
  const [imageUrl, setImageUrl] = useState(
    product?.coverImage ||
      product?.images?.[0] ||
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80'
  );
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const sampleImages = [
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert('Preencha o nome e o preço do produto.');
      return;
    }

    setIsSaving(true);

    const parsedPrice = parseFloat(price);
    const parsedPromoPrice = promoPrice && isPromo ? parseFloat(promoPrice) : undefined;
    const splitMaterials = materials
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    try {
      if (product) {
        // Edit
        const updated = await storeService.updateProduct(product.id, {
          name,
          description,
          price: parsedPrice,
          promoPrice: parsedPromoPrice,
          isPromo,
          categoryId,
          cityId,
          dimensions,
          materials: splitMaterials,
          coverImage: imageUrl,
          images: [imageUrl],
          isFeatured,
          isAvailable,
        });
        if (updated) onSuccess(updated);
      } else {
        // Create
        const created = await storeService.createProduct({
          storeId,
          cityId,
          categoryId,
          name,
          description,
          price: parsedPrice,
          promoPrice: parsedPromoPrice,
          isPromo,
          dimensions,
          materials: splitMaterials,
          coverImage: imageUrl,
          images: [imageUrl],
          isFeatured,
          isAvailable,
        });
        onSuccess(created);
      }
    } catch (err) {
      alert('Erro ao salvar o produto.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#EDE5D8] overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EDE5D8] flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#1B4332]">
              {product ? 'Editar Produto Artesanal' : 'Cadastrar Novo Produto'}
            </h3>
            <p className="text-xs text-[#7F4F24]">
              Preencha os detalhes para divulgar aos turistas de São Roque e região
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-[#4A3525] hover:bg-[#EDE5D8] rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
              Nome do Produto *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Jogo de 2 Taças Cerâmica Grés Roteiro do Vinho"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] text-sm text-[#2C2623] outline-hidden font-medium"
            />
          </div>

          {/* Category & City row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                Categoria *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                Cidade *
              </label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden font-medium"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} - {city.uf}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8]">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                Preço Regular (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="149.90"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EDE5D8] text-sm font-bold text-[#1B4332] outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
                  Preço Promocional (R$)
                </label>
                <label className="flex items-center gap-1.5 text-xs text-[#C85A32] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPromo}
                    onChange={(e) => setIsPromo(e.target.checked)}
                    className="rounded-sm accent-[#C85A32]"
                  />
                  <span>Ativar Oferta</span>
                </label>
              </div>
              <input
                type="number"
                step="0.01"
                disabled={!isPromo}
                value={promoPrice}
                onChange={(e) => setPromoPrice(e.target.value)}
                placeholder="119.90"
                className={`w-full px-3 py-2 rounded-xl border text-sm font-bold outline-hidden ${
                  isPromo
                    ? 'bg-white border-[#C85A32] text-[#C85A32]'
                    : 'bg-[#EDE5D8]/40 border-[#EDE5D8] text-[#9E9188]'
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
              História e Descrição do Produto
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte como a peça foi produzida, a técnica utilizada e detalhes que tornam este item único..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] text-xs text-[#2C2623] outline-hidden leading-relaxed"
            />
          </div>

          {/* Materials & Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                Materiais Utilizados
              </label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="Ex.: Argila refratária, Cinzas de videira"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE5D8] text-xs text-[#2C2623] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                Dimensões / Peso
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="Ex.: 24cm diâmetro | 850g"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE5D8] text-xs text-[#2C2623] outline-hidden"
              />
            </div>
          </div>

          {/* Image Selection with Local File Upload */}
          <div>
            <ImageUpload
              label="Foto Principal da Peça (Carregar Arquivo)"
              helperText="Carregue uma foto da sua peça ou selecione um exemplo abaixo"
              aspectRatio="square"
              value={imageUrl}
              onChange={setImageUrl}
            />

            <div className="text-[11px] text-[#7F4F24] font-medium mt-3 mb-1.5">
              Ou escolha uma imagem do catálogo de demonstração:
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {sampleImages.map((sImg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageUrl(sImg)}
                  className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    imageUrl === sImg ? 'border-[#C85A32] scale-105 shadow-xs' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={sImg} alt={`Sample ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes for Featured and Available */}
          <div className="flex items-center gap-6 pt-2 border-t border-[#EDE5D8]">
            <label className="flex items-center gap-2 text-xs font-medium text-[#2C2623] cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded-sm accent-[#1B4332]"
              />
              <span>Disponível para venda</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-[#2C2623] cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded-sm accent-[#E9C46A]"
              />
              <span className="flex items-center gap-1">
                <Sparkles size={13} className="text-[#C85A32]" />
                Marcar como Destaque
              </span>
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#EDE5D8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#7F4F24] hover:bg-[#EDE5D8] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#1B4332] hover:bg-[#2D6A4F] text-white shadow-md transition-all cursor-pointer"
            >
              {isSaving ? 'Salvando...' : product ? 'Salvar Alterações' : 'Publicar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
