import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  CheckCircle2,
  Sparkles,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  ArrowRight,
  Package,
  Clock,
  Store as StoreIcon,
} from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import ProductGallery from '@/components/ui/ProductGallery';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ProductCard from '@/components/ui/ProductCard';
import { VerifiedBadge, FeaturedBadge, PromotionBadge } from '@/components/ui/Badges';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await storeService.getProductBySlug(slug);

  if (!product) {
    return { title: 'Produto não encontrado | Descubra Artes' };
  }

  return {
    title: `${product.name} | Descubra Artes`,
    description: `${product.description} Feito à mão por ${product.store?.artisanName || 'Artesão Local'} em ${product.city?.name || 'São Roque'}.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.coverImage }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await storeService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // 1. Resolve Store rigorously
  let store: any = product.store;
  if (!store && product.storeId) {
    store = await storeService.getStoreById(product.storeId);
    if (!store) {
      store = await storeService.getStoreBySlug(product.storeId);
    }
  }

  // 2. Safe Store Fallback to guarantee WhatsApp contact & store profile navigation are ALWAYS available
  if (!store) {
    store = {
      id: product.storeId || 'store-default',
      userId: 'artisan',
      cityId: product.cityId || 'city-sao-roque',
      categoryId: product.categoryId || 'cat-ceramica',
      name: 'Ateliê do Produtor',
      slug: 'artesaos-sao-roque',
      artisanName: 'Produtor Regional',
      bio: 'Ateliê artesanal participante do Descubra Artes.',
      story: 'Produção regional autêntica feita com técnicas manuais.',
      logoUrl: product.coverImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      coverUrl: product.coverImage,
      whatsapp: '16991551200',
      address: 'São Roque, SP',
      latitude: -23.5325,
      longitude: -47.1356,
      openingHours: 'Segunda a Sábado, das 9h às 18h',
      verified: true,
      status: 'APPROVED',
      planType: 'FREE',
      isFeatured: false,
      rating: 5.0,
      reviewsCount: 0,
      whatsappClicksCount: 0,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const relatedProducts = await storeService.getRelatedProducts(product.id, 4);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-24 md:pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#7F4F24] flex-wrap">
        <Link href="/" className="hover:text-[#C85A32]">Início</Link>
        <span>/</span>
        <Link href="/explorar" className="hover:text-[#C85A32]">Explorar</Link>
        {product.city && (
          <>
            <span>/</span>
            <Link href={`/cidade/${product.city.slug}`} className="hover:text-[#C85A32]">
              {product.city.name}
            </Link>
          </>
        )}
        {store && (
          <>
            <span>/</span>
            <Link href={`/loja/${store.slug}`} className="hover:text-[#C85A32] truncate max-w-[150px]">
              {store.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-[#2C2623] font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Details & WhatsApp Action (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Badges & City */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.isPromo && (
              <PromotionBadge discountPercent={product.promoDiscountPercent} />
            )}
            {product.isFeatured && !product.isPromo && (
              <FeaturedBadge text="Produto em Destaque" />
            )}
            {product.city && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#7F4F24] border border-[#EDE5D8]">
                <MapPin size={12} className="text-[#C85A32]" />
                <span>{product.city.name} - {product.city.uf}</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332] leading-tight">
            {product.name}
          </h1>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-1">
            <span className="text-[11px] font-bold text-[#7F4F24] uppercase tracking-wider block">
              Valor da Peça
            </span>
            <div className="flex items-baseline gap-3">
              {product.isPromo && product.promoPrice ? (
                <>
                  <span className="text-3xl font-extrabold text-[#C85A32]">
                    {formatCurrency(product.promoPrice)}
                  </span>
                  <span className="text-sm text-[#9E9188] line-through font-medium">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xs font-bold text-[#C85A32] bg-[#FDE8E1] px-2 py-0.5 rounded-md">
                    Economize {formatCurrency(product.price - product.promoPrice)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-[#1B4332]">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7F4F24] pt-1">
              * Pagamento e envio combinados diretamente com o produtor via WhatsApp.
            </p>
          </div>

          {/* Main WhatsApp CTA - Always Visible */}
          <div className="space-y-2">
            <WhatsAppButton
              phone={store.whatsapp || '16991551200'}
              storeName={store.name}
              storeId={store.id}
              productName={product.name}
              productId={product.id}
              cityId={product.cityId}
              className="w-full py-4 text-base shadow-md font-bold"
            />
            <p className="text-[11px] text-center text-[#6B625B]">
              Conversa direta e segura sem intermediários ou taxas adicionais.
            </p>
          </div>

          {/* Artisan Profile Card Preview & Direct Store Link */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EDE5D8] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={store.logoUrl || product.coverImage}
                  alt={store.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#EDE5D8] shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#7F4F24] tracking-wider block">
                    Produzido por
                  </span>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-lg text-[#1B4332] truncate">
                      {store.name}
                    </h3>
                    {store.verified && (
                      <span title="Produtor Verificado">
                        <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#7F4F24] font-medium truncate">
                    Artesão(ã): {store.artisanName}
                  </p>
                  {store.address && (
                    <p className="text-[11px] text-[#6B625B] flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={12} className="text-[#C85A32] shrink-0" />
                      <span>{store.neighborhood || store.address}</span>
                    </p>
                  )}
                </div>
              </div>

              <Link
                href={`/loja/${store.slug}`}
                className="px-5 py-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center justify-center gap-2"
              >
                <StoreIcon size={14} />
                <span>Ver Loja Completa</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {store.bio && (
              <p className="text-xs text-[#6B625B] line-clamp-2 pt-2 border-t border-[#EDE5D8]/80 leading-relaxed">
                {store.bio}
              </p>
            )}

            {store.instagram && (
              <div className="pt-2 border-t border-[#EDE5D8]/80 flex items-center justify-between text-xs">
                <span className="text-[#7F4F24]">Instagram do Produtor:</span>
                <a
                  href={`https://instagram.com/${store.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C85A32] font-bold hover:underline"
                >
                  @{store.instagram.replace('@', '')}
                </a>
              </div>
            )}
          </div>

          {/* Floating WhatsApp CTA for Mobile */}
          <WhatsAppButton
            phone={store.whatsapp || '16991551200'}
            storeName={store.name}
            storeId={store.id}
            productName={product.name}
            productId={product.id}
            cityId={product.cityId}
            variant="floating"
          />

          {/* Description & Technical details */}
          <div className="space-y-4 pt-4 border-t border-[#EDE5D8]">
            <h3 className="font-serif font-bold text-lg text-[#1B4332]">Sobre Esta Peça</h3>
            <p className="text-xs sm:text-sm text-[#4A3525] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5D8] text-xs">
                <span className="text-[10px] text-[#7F4F24] block uppercase font-bold">Materiais</span>
                <span className="font-medium text-[#2C2623]">{product.materials?.join(', ') || 'Artesanal'}</span>
              </div>
              {product.dimensions && (
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5D8] text-xs">
                  <span className="text-[10px] text-[#7F4F24] block uppercase font-bold">Dimensões / Peso</span>
                  <span className="font-medium text-[#2C2623]">{product.dimensions}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products from same category/city */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-[#EDE5D8]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                Mais Artesanato Regional
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#1B4332] mt-1">
                Outras criações que você pode gostar
              </h2>
            </div>
            <Link
              href="/explorar"
              className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
