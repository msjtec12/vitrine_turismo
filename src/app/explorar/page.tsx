import React from 'react';
import { storeService } from '@/lib/data/store-service';
import ExplorarClient from './ExplorarClient';

export const metadata = {
  title: 'Explorar Produtos & Ateliês Artesanais',
  description:
    'Navegue por cerâmica, marcenaria, tecelagem, licores e artesanato autoral em São Roque e destinos de todo o Brasil.',
};

export default async function ExplorarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialQuery = typeof params.q === 'string' ? params.q : '';
  const initialCity = typeof params.cidade === 'string' ? params.cidade : '';
  const initialCategory = typeof params.categoria === 'string' ? params.categoria : '';
  const initialPromo = params.promocoes === 'true';
  const initialFeatured = params.destaques === 'true';

  const cities = await storeService.getCities();
  const categories = await storeService.getCategories();
  const allProducts = await storeService.getProducts();
  const allStores = await storeService.getStores();

  return (
    <ExplorarClient
      cities={cities}
      categories={categories}
      initialProducts={allProducts}
      initialStores={allStores}
      initialQuery={initialQuery}
      initialCity={initialCity}
      initialCategory={initialCategory}
      initialPromo={initialPromo}
      initialFeatured={initialFeatured}
    />
  );
}
