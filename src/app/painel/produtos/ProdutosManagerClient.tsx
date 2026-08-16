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
  AlertTriangle,
  Lock,
  ArrowRight,
  X,
} from 'lucide-react';
import { Product, Category, City, Store } from '@/types';
import { storeService } from '@/lib/data/store-service';
import { useAuth } from '@/lib/auth-context';
import { getStoreEffectiveEntitlements, getPlanDisplayName } from '@/lib/plans/entitlements';
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
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      let targetId = activeStoreId;
      if (!targetId && user?.email) {
        const s = await storeService.getStoreByEmail(user.email);
        if (s) targetId = s.id;
      }
      if (targetId) {
        setCurrentStoreId(targetId);
        const [loadedStore, prods] = await Promise.all([
          storeService.getStoreById(targetId),
          storeService.getProductsByStoreId(targetId),
        ]);
        if (loadedStore) setStore(loadedStore);
        setProducts(prods);
      } else {
        setProducts([]);
      }
      setLoading(false);
    }
    loadData();
  }, [activeStoreId, user]);

  const entitlements = getStoreEffectiveEntitlements(store, products.length);

  const handleOpenCreate = () => {
    if (!entitlements.canAddProduct) {
      setShowUpgradeModal(true);
      return;
    }
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
    if (!entitlements.canCreateOffers) {
      alert('As Ofertas Locais são exclusivas do Plano Profissional (R$ 49,90/mês). Faça upgrade para ativar.');
      return;
    }
    const nextPromo = !prod.isPromo;
    const updated = await storeService.updateProduct(prod.id, {
      isPromo: nextPromo,
      promoPrice: nextPromo ? Math.round(prod.price * 0.85) : undefined,
    });
    if (updated) {
      setProducts((prev) => prev.map((p) => (p.id === prod.id ? updated : p)));
    }
  };

  const whatsappUpgradeUrl = `https://wa.me/5516991551200?text=${encodeURIComponent(
    `Olá! Gostaria de fazer o upgrade para o Plano Profissional (R$ 49,90/mês) no Descubra Artes para a loja "${store?.name || 'meu ateliê'}".`
  )}`;

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

      {/* Plan Usage & Limits Banner */}
      {store && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#1B4332]">
                {getPlanDisplayName(store.planType)}
              </span>
              <span className="text-[11px] text-[#7F4F24]">
                • {entitlements.maxProducts !== null ? (
                  <><strong>{products.length}</strong> de <strong>{entitlements.maxProducts}</strong> produtos utilizados</>
                ) : (
                  <><strong>{products.length}</strong> produtos cadastrados (Ilimitado)</>
                )}
              </span>
            </div>

            {entitlements.maxProducts !== null && (
              <a
                href={whatsappUpgradeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1 w-fit"
              >
                <span>Fazer Upgrade para Ilimitado (R$ 49,90/mês)</span>
                <ArrowRight size={13} />
              </a>
            )}
          </div>

          {entitlements.maxProducts !== null && (
            <div className="w-full h-2.5 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#EDE5D8]">
              <div
                className={`h-full rounded-full transition-all ${
                  (entitlements.productLimitPercentage || 0) >= 100
                    ? 'bg-amber-600'
                    : 'bg-[#2D6A4F]'
                }`}
                style={{ width: `${entitlements.productLimitPercentage}%` }}
              />
            </div>
          )}

          {!entitlements.canAddProduct && (
            <div className="p-4 rounded-2xl bg-[#FEF9EF] border border-[#EDE5D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Lock size={16} className="text-[#C85A32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1B4332] block">
                    Limite de {entitlements.maxProducts} produtos atingido no Plano Gratuito
                  </span>
                  <p className="text-[#7F4F24] text-[11px] mt-0.5">
                    Faça upgrade para o Plano Profissional e cadastre quantas peças desejar sem nenhum bloqueio.
                  </p>
                </div>
              </div>

              <a
                href={whatsappUpgradeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs transition-colors shrink-0 text-center"
              >
                Falar com Suporte no WhatsApp
              </a>
            </div>
          )}
        </div>
      )}

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

      {/* Upgrade Limit Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-3xl border border-[#EDE5D8] shadow-2xl p-6 sm:p-8 space-y-5 text-center relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#FEF9EF] text-[#C85A32] flex items-center justify-center mx-auto border border-[#EDE5D8]">
              <Lock size={28} />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xl text-[#1B4332]">
                Limite de Produtos Atingido
              </h3>
              <p className="text-xs text-[#7F4F24] leading-relaxed">
                Seu <strong>Plano Gratuito</strong> permite até <strong>{entitlements.maxProducts} peças cadastradas</strong>. Para adicionar novas peças, fotos extras e destacar seu trabalho, faça upgrade para o <strong>Plano Profissional</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] text-left space-y-2 text-xs">
              <div className="font-bold text-[#1B4332] flex items-center justify-between">
                <span>Plano Profissional</span>
                <span className="text-[#C85A32]">R$ 49,90/mês</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#7F4F24]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#2D6A4F]" />
                  <span>Produtos & peças ilimitadas</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#2D6A4F]" />
                  <span>Publicação de Ofertas Locais & Descontos</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#2D6A4F]" />
                  <span>Selo Oficial de Produtor Verificado</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#2D6A4F]" />
                  <span>Estatísticas completas de visualizações e cliques</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={whatsappUpgradeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Falar com Atendimento no WhatsApp</span>
                <ArrowRight size={15} />
              </a>

              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2 text-xs text-[#7F4F24] hover:text-[#2C2623] font-medium"
              >
                Continuar no plano gratuito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
