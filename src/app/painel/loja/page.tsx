import React from 'react';
import { storeService } from '@/lib/data/store-service';
import LojaEditorClient from './LojaEditorClient';

export default async function PainelLojaPage() {
  const store = await storeService.getStoreById('store-ceramica-da-terra');

  return <LojaEditorClient initialStore={store} />;
}
