import React from 'react';
import { storeService } from '@/lib/data/store-service';
import ProdutosManagerClient from './ProdutosManagerClient';

export const metadata = {
  title: 'Gerenciar Produtos | Painel do Artesão',
  description: 'Adicione, edite e gerencie o catálogo de produtos e artesanato da sua loja.',
};

export default async function PainelProdutosPage() {
  const categories = await storeService.getCategories();
  const cities = await storeService.getCities();

  return (
    <ProdutosManagerClient
      categories={categories}
      cities={cities}
    />
  );
}
