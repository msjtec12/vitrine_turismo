import React from 'react';
import { notFound } from 'next/navigation';
import { storeService } from '@/lib/data/store-service';
import AdminArtesaoDetailClient from './AdminArtesaoDetailClient';

export const metadata = {
  title: 'Ficha do Artesão | Admin Descubra Artes',
  description: 'Detalhes completos do artesão, histórico de produtos e moderação.',
};

export default async function AdminArtesaoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artisan = await storeService.getArtisanById(id);

  if (!artisan) {
    return notFound();
  }

  const store = artisan.stores?.[0];
  const products = store ? await storeService.getProductsByStoreId(store.id) : [];
  const completeness = store ? storeService.calculateStoreCompleteness(store, products) : undefined;

  return (
    <AdminArtesaoDetailClient
      artisan={artisan}
      store={store}
      products={products}
      completeness={completeness}
    />
  );
}
