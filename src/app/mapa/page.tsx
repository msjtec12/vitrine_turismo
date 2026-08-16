import React from 'react';
import { storeService } from '@/lib/data/store-service';
import MapaClient from './MapaClient';

export const metadata = {
  title: 'Mapa de Ateliês & Artesãos | Descubra Artes',
  description: 'Localize ateliês, lojas e oficinas de artesãos em São Roque e destinos turísticos.',
};

export default async function MapaPage() {
  const stores = await storeService.getStores();
  const cities = await storeService.getCities();
  const categories = await storeService.getCategories();

  return <MapaClient stores={stores} cities={cities} categories={categories} />;
}
