import React from 'react';
import { storeService } from '@/lib/data/store-service';
import CadastroOnboardingClient from './CadastroOnboardingClient';

export const metadata = {
  title: 'Cadastro de Artesão | Coloque sua arte no mapa — Descubra Artes',
  description: 'Crie sua vitrine digital e mostre seus produtos para pessoas que querem conhecer e comprar o que é produzido localmente.',
};

export default async function CadastroOnboardingPage() {
  const [cities, categories, campaign] = await Promise.all([
    storeService.getCities(),
    storeService.getCategories(),
    storeService.getFoundingMembersCampaign(),
  ]);

  return (
    <CadastroOnboardingClient
      cities={cities}
      categories={categories}
      foundingCount={campaign.count}
    />
  );
}
