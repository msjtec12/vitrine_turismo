import React from 'react';
import { storeService } from '@/lib/data/store-service';
import AdminNovoArtesaoClient from './AdminNovoArtesaoClient';

export const metadata = {
  title: 'Cadastrar Artesão (Assistido) | Admin Descubra Artes',
  description: 'Cadastre um novo artesão e gere o link de convite oficial para definição de senha.',
};

export default async function AdminNovoArtesaoPage() {
  const [cities, categories] = await Promise.all([
    storeService.getCities(),
    storeService.getCategories(),
  ]);

  return <AdminNovoArtesaoClient cities={cities} categories={categories} />;
}
