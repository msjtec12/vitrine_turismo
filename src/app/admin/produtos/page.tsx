import React from 'react';
import { storeService } from '@/lib/data/store-service';
import AdminProdutosModerationClient from './AdminProdutosModerationClient';

export const metadata = {
  title: 'Moderação de Produtos | Admin Descubra Artes',
  description: 'Aprovação e gestão de peças submetidas por artesãos para o catálogo regional.',
};

export default async function AdminProdutosPage() {
  const products = await storeService.getAllProductsForAdmin();
  return <AdminProdutosModerationClient initialProducts={products} />;
}
