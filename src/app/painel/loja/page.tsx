import React from 'react';
import LojaEditorClient from './LojaEditorClient';

export const metadata = {
  title: 'Editar Minha Loja | Painel do Artesão',
  description: 'Personalize o perfil, história, fotos e contatos do seu ateliê.',
};

export default function PainelLojaPage() {
  return <LojaEditorClient />;
}
