import React from 'react';
import { storeService } from '@/lib/data/store-service';
import AdminArtesaosListClient from './AdminArtesaosListClient';

export const metadata = {
  title: 'Gestão de Artesãos & Ateliês | Admin Descubra Artes',
  description: 'Controle de artesãos, vitrines digitais, convites e moderação de lojas.',
};

export default async function AdminArtesaosPage() {
  const [artisans, cities] = await Promise.all([
    storeService.getAllArtisans(),
    storeService.getCities(),
  ]);

  return <AdminArtesaosListClient initialArtisans={artisans} cities={cities} />;
}
