'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  Flame,
  CheckCircle2,
  Eye,
  MessageCircle,
} from 'lucide-react';
import { Product, Category, City } from '@/types';
import { storeService } from '@/lib/data/store-service';
import ProductFormModal from '@/components/artisan/ProductFormModal';

interface ProdutosManagerClientProps {
  initialProducts: Product[];
  categories: Category[];
  cities: City[];
  storeId: string;
}

export default function ProdutosManagerClient({
  initialProducts,
  categories,
  cities,
  storeId,
}: ProdutosManagerClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este produto?')) return;
    const success = await storeService.deleteProduct(id);
    if (success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleModalSuccess = (savedProd: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProd.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProd.id ? savedProd : p));
      }
      return [savedProd, ...prev];
    });
    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1B4332] flex items-center gap-2">
            <Package size={22} className="text-[#C85A32]" />
            <span>Gerenciador de Produtos ({products.length})</span>
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Cadastre novas peças, ajuste preços, crie promoções e acompanhe o interesse dos visitantes
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#EDE5D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#7F4F24] uppercase font-bold tracking-wider border-b border-[#EDE5D8]">
              <tr>
                <th className="px-5 py-3.5">Peça / Imagem</th>
                <th className="px-4 py-3.5">Valor & Oferta</th>
                <th className="px-4 py-3.5">Destaques</th>
                <th className="px-4 py-3.5">Desempenho</th>
                <th className="px-5 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE5D8]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  {/* Photo & Title */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.coverImage}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#EDE5D8] shrink-0"
                      />
                      <div className="max-w-xs">
                        <div className="font-serif font-bold text-sm text-[#1B4332] line-clamp-1">
                          {product.name}
                        </div>
                        <span className="text-[11px] text-[#7F4F24]">
                          {product.dimensions || 'Peça artesanal'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4">
                    {product.isPromo && product.promoPrice ? (
                      <div>
                        <div className="font-bold text-[#C85A32] text-sm">
                          {formatCurrency(product.promoPrice)}
                        </div>
                        <span className="text-[11px] text-[#9E9188] line-through">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    ) : (
                      <div className="font-bold text-[#1B4332] text-sm">
                        {formatCurrency(product.price)}
                      </div>
                    )}
                  </td>

                  {/* Badges */}
                  <td className="px-4 py-4 space-y-1">
                    {product.isPromo && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDE8E1] text-[#C85A32]">
                        <Flame size={11} />
                        <span>Oferta -{product.promoDiscountPercent || 20}%</span>
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF9EF] text-[#D4A373]">
                        <Sparkles size={11} />
                        <span>Destaque</span>
                      </span>
                    )}
                  </td>

                  {/* Performance stats */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-[#4A3525]">
                        <Eye size={13} className="text-[#7F4F24]" />
                        <span>{product.viewsCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#25D366] font-bold">
                        <MessageCircle size={13} />
                        <span>{product.whatsappClicksCount}</span>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right space-x-1.5">
                    <Link
                      href={`/produto/${product.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg bg-[#FAF7F2] text-[#4A3525] hover:text-[#1B4332] inline-block"
                      title="Ver página do produto"
                    >
                      <ExternalLink size={14} />
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-2 rounded-lg bg-[#FAF7F2] text-[#4A3525] hover:text-[#1B4332] hover:bg-[#EDE5D8] cursor-pointer"
                      title="Editar produto"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 rounded-lg bg-[#FDE8E1] text-[#C85A32] hover:bg-[#F9D2C4] cursor-pointer"
                      title="Excluir produto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          cities={cities}
          storeId={storeId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
