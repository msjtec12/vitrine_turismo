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
        {product.store && (
          <>
            <span>/</span>
            <Link href={`/loja/${product.store.slug}`} className="hover:text-[#C85A32] truncate max-w-[150px]">
              {product.store.name}
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

          {/* Main WhatsApp CTA */}
          {product.store && (
            <div className="space-y-2">
              <WhatsAppButton
                phone={product.store.whatsapp}
                storeName={product.store.name}
                storeId={product.store.id}
                productName={product.name}
                productId={product.id}
                cityId={product.cityId}
                className="w-full py-4 text-base shadow-md"
              />
              <p className="text-[11px] text-center text-[#6B625B]">
                Conversa direta e segura sem intermediários ou taxas abusivas.
              </p>
            </div>
          )}

          {/* Artisan Profile Card Preview */}
          {product.store && (
            <div className="p-4 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={product.store.logoUrl}
                  alt={product.store.name}
                  className="w-13 h-13 rounded-2xl object-cover border border-[#EDE5D8] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-sm text-[#1B4332]">
                      {product.store.name}
                    </h3>
                    {product.store.verified && (
                      <CheckCircle2 size={13} className="text-[#2D6A4F]" />
                    )}
                  </div>
                  <p className="text-xs text-[#7F4F24]">
                    Por {product.store.artisanName}
                  </p>
                </div>
              </div>

              <Link
                href={`/loja/${product.store.slug}`}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-xs font-bold text-[#1B4332] transition-colors shrink-0"
              >
                Ver Ateliê
              </Link>
            </div>
          )}

          {/* Description & Technical details */}
          <div className="space-y-4 pt-4 border-t border-[#EDE5D8]">
            <h2 className="font-serif font-bold text-lg text-[#1B4332]">
              Sobre Esta Peça
            </h2>
            <p className="text-xs sm:text-sm text-[#4A3525] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            {product.details && product.details.length > 0 && (
              <ul className="space-y-1.5 pt-2 text-xs text-[#4A3525]">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C85A32] font-bold">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Specs Table */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
              {product.materials && product.materials.length > 0 && (
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EDE5D8]">
                  <span className="text-[10px] uppercase font-bold text-[#7F4F24] block mb-0.5">
                    Materiais
                  </span>
                  <span className="font-medium text-[#2C2623]">{product.materials.join(', ')}</span>
                </div>
              )}

              {product.dimensions && (
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EDE5D8]">
                  <span className="text-[10px] uppercase font-bold text-[#7F4F24] block mb-0.5">
                    Dimensões / Peso
                  </span>
                  <span className="font-medium text-[#2C2623]">{product.dimensions}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products from this Maker / Region */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-[#EDE5D8] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
                Descubra Mais
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#1B4332]">
                Outras Peças Que Você Pode Gostar
              </h2>
            </div>

            <Link
              href="/explorar"
              className="text-xs font-bold text-[#1B4332] hover:text-[#C85A32] flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel: any) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Fixed WhatsApp CTA on Mobile */}
      {product.store && (
        <WhatsAppButton
          phone={product.store.whatsapp}
          storeName={product.store.name}
          storeId={product.store.id}
          productName={product.name}
          productId={product.id}
          cityId={product.cityId}
          variant="floating"
        />
      )}
    </div>
  );
}
