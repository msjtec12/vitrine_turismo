import React from 'react';
import { notFound } from 'next/navigation';
import { storeService } from '@/lib/data/store-service';
import ConviteClient from './ConviteClient';

export const metadata = {
  title: 'Convite para Ateliê | Descubra Artes',
  description: 'Ative sua loja e defina sua senha de acesso ao Descubra Artes.',
};

export default async function ConvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invitation = await storeService.getInvitationByToken(token);

  if (!invitation) {
    return notFound();
  }

  return (
    <ConviteClient
      artisan={invitation.artisan}
      store={invitation.store}
      token={token}
    />
  );
}
