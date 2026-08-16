'use client';

import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/lib/auth-context';
import ProductFormModal from '@/components/artisan/ProductFormModal';

interface ProdutosManagerClientProps {
  initialProducts?: Product[];
  categories: Category[];
  cities: City[];
  storeId?: string;
}

export default function ProdutosManagerClient({
  initialProducts = [],
  categories,
  cities,
  storeId = '',
}: ProdutosManagerClientProps) {
  const { activeStoreId, user } = useAuth();
  const [currentStoreId, setCurrentStoreId] = useState(storeId || activeStoreId);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProds() {
      setLoading(true);
      let targetId = activeStoreId;
      if (!targetId && user?.email) {
        const s = await storeService.getStoreByEmail(user.email);
        if (s) targetId = s.id;
      }
      if (targetId) {
        setCurrentStoreId(targetId);
        const prods = await storeService.getProductsByStoreId(targetId);
        setProducts(prods);
      } else {
        setProducts([]);
      }
      setLoading(false);
    }
    loadProds();
  }, [activeStoreId, user]);

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

  const handleTogglePromo = async (prod: Product) => {
    const nextPromo = !prod.isPromo;
    const updated = await storeService.updateProduct(prod.id, {
      isPromo: nextPromo,
      promoPrice: nextPromo ? Math.round(prod.price * 0.85) : undefined,
    });
    if (updated) {
      setProducts((prev) => prev.map((p) => (p.id === prod.id ? updated : p)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332] flex items-center gap-2">
            <Package size={24} className="text-[#C85A32]" />
            <span>Catálogo de Peças & Produtos</span>
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Gerencie suas peças artesanais expostas na vitrine turística ({products.length} peças cadastradas)
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Cadastrar Nova Peça</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-[#EDE5D8]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="bg-white p-12 sm:p-16 rounded-3xl border border-[#EDE5D8] text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#7F4F24] flex items-center justify-center mx-auto shadow-2xs">
            <Package size={32} />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-serif font-bold text-lg text-[#1B4332]">
              Nenhum produto cadastrado ainda
            </h3>
            <p className="text-xs text-[#7F4F24]">
              Cadastre suas peças com fotos, preços e técnicas para atrair turistas de São Roque.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Cadastrar Primeira Peça</span>
          </button>
        </div>
      ) : (
        /* Grid of Products */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-[#EDE5D8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-gray-100">
                  <img
                    src={product.coverImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.isPromo && (
                    <span className="absolute top-3 left-3 bg-[#C85A32] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Flame size={10} />
                      <span>Em Oferta</span>
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#1B4332] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                    {product.stockQuantity || 1} em estoque
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F4F24]">
                      {product.category?.name || 'Artesanato'}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#1B4332] truncate">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-2">
                    {product.isPromo && product.promoPrice ? (
                      <>
                        <span className="text-lg font-extrabold text-[#C85A32]">
                          R$ {product.promoPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-extrabold text-[#1B4332]">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>

                  {/* Micro stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EDE5D8] text-[11px] text-[#7F4F24]">
                    <div className="flex items-center gap-1.5">
                      <Eye size={13} className="text-gray-400" />
                      <span>{product.viewsCount || 0} visitas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle size={13} className="text-[#2D6A4F]" />
                      <span>{product.whatsappClicksCount || 0} contatos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-[#FAF7F2] border-t border-[#EDE5D8] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTogglePromo(product)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    product.isPromo
                      ? 'bg-[#C85A32] text-white'
                      : 'bg-white border border-[#EDE5D8] text-[#7F4F24] hover:bg-[#EDE5D8]'
                  }`}
                >
                  {product.isPromo ? '🔥 Oferta Ativa' : 'Promover'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="p-2 rounded-lg bg-white border border-[#EDE5D8] text-[#1B4332] hover:bg-[#EDE5D8] transition-colors cursor-pointer"
                    title="Editar produto"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg bg-white border border-[#EDE5D8] text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                    title="Excluir produto"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ProductFormModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
          product={editingProduct}
          categories={categories}
          cities={cities}
          storeId={currentStoreId || activeStoreId || 'temp-store'}
        />
      )}
    </div>
  );
}
