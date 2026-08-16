import React from 'react';
import { storeService } from '@/lib/data/store-service';
import ProdutosManagerClient from './ProdutosManagerClient';

export default async function PainelProdutosPage() {
  const products = await storeService.getStoreProducts('store-ceramica-da-terra');
  const categories = await storeService.getCategories();
  const cities = await storeService.getCities();

  return (
    <ProdutosManagerClient
      initialProducts={products}
      categories={categories}
      cities={cities}
      storeId="store-ceramica-da-terra"
    />
  );
}
