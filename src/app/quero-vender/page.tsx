import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Award,
  Zap,
  Star,
  Users,
} from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import { mockPlans } from '@/lib/data/mock-data';

export const metadata = {
  title: 'Para Produtores | Coloque seus produtos no Descubra Artes',
  description:
    'Mostre seus produtos para turistas e consumidores que procuram experiências, artesanato e produtos locais em São Roque e destinos regionais.',
};

export default async function QueroVenderPage() {
  const campaign = await storeService.getFoundingMembersCampaign();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#1B4332] to-[#2D6A4F] text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          {/* Founding Badge */}
          {campaign.isActive && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9C46A] text-[#1B4332] font-extrabold text-xs tracking-wider uppercase shadow-md">
              <Star size={14} className="fill-[#1B4332]" />
              <span>Programa Produtores Fundadores</span>
            </div>
          )}

          <h1 className="font-serif font-extrabold text-4xl sm:text-6xl text-white max-w-3xl mx-auto tracking-tight leading-tight">
            Coloque seus produtos no Descubra Artes
          </h1>

          <p className="text-base sm:text-xl text-[#F4EFE6] max-w-2xl mx-auto leading-relaxed font-light">
            Mostre seus produtos para turistas e consumidores que procuram experiências, artesanato e produtos locais.
          </p>

          {/* Campaign Counter Box */}
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#E9C46A]">
              <span>⭐ PROGRAMA PRODUTORES FUNDADORES</span>
              <span>{campaign.count} / {campaign.target}</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#E9C46A] to-[#F4A261] rounded-full transition-all duration-700"
                style={{ width: `${campaign.percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/80">
              <span>Os primeiros produtores cadastrados terão condições especiais durante o lançamento.</span>
              <span className="font-bold text-[#E9C46A]">{campaign.remaining} vagas</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quero-vender/cadastro"
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-[#C85A32] hover:bg-[#A4421F] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Quero cadastrar minha loja</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/painel"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20 cursor-pointer"
            >
              Já tenho conta (Acessar Painel)
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            Vitrine Comercial Direta
          </span>
          <h2 className="font-serif font-bold text-3xl text-[#1B4332] mt-1">
            Benefícios de estar no Descubra Artes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-[#2D6A4F]" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1B4332]">
              100% Contato Direto
            </h3>
            <p className="text-xs sm:text-sm text-[#6B625B] leading-relaxed">
              O turista descobre sua peça e clica no botão oficial de WhatsApp. A negociação e o pagamento são feitos direto com você, sem intermediários.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FDE8E1] text-[#C85A32] flex items-center justify-center mb-4">
              <MapPin size={24} className="text-[#C85A32]" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1B4332]">
              Ponto no Mapa Turístico
            </h3>
            <p className="text-xs sm:text-sm text-[#6B625B] leading-relaxed">
              Seu ateliê ganha destaque no mapa de São Roque (Roteiro do Vinho, Centro e arredores) com endereço, horário de funcionamento e rota.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF9EF] text-[#7F4F24] flex items-center justify-center mb-4">
              <ShieldCheck size={24} className="text-[#D4A373]" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1B4332]">
              Valorização da História
            </h3>
            <p className="text-xs sm:text-sm text-[#6B625B] leading-relaxed">
              Não vendemos apenas peças; contamos a história das suas mãos, suas técnicas tradicionais e a essência cultural de quem produz em São Roque.
            </p>
          </div>
        </div>
      </section>

      {/* How it works (4 steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] p-8 sm:p-14 rounded-3xl border border-[#EDE5D8] space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
              Simples e Rápido
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332] mt-1">
              Como funciona o cadastro?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Crie sua Conta',
                desc: 'Preencha seus dados básicos de artesão e crie sua senha.',
              },
              {
                step: '02',
                title: 'Monte seu Ateliê',
                desc: 'Adicione nome da loja, história, endereço em São Roque e WhatsApp.',
              },
              {
                step: '03',
                title: 'Cadastre Peças',
                desc: 'Insira fotos, descrições e valores das suas criações.',
              },
              {
                step: '04',
                title: 'Aprovação & Vendas',
                desc: 'Nossa curadoria revisa e publica sua vitrine para milhares de turistas.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#EDE5D8] space-y-2">
                <span className="font-serif font-extrabold text-2xl text-[#C85A32]">
                  {item.step}
                </span>
                <h4 className="font-serif font-bold text-base text-[#1B4332]">
                  {item.title}
                </h4>
                <p className="text-xs text-[#6B625B] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/quero-vender/cadastro"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#C85A32] hover:bg-[#A4421F] text-white font-bold text-sm shadow-md transition-all"
            >
              <span>Começar Cadastro em 4 Etapas</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing / Plans Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            Planos Acessíveis
          </span>
          <h2 className="font-serif font-bold text-3xl text-[#1B4332] mt-1">
            Escolha como divulgar seu ateliê
          </h2>
          <p className="text-xs sm:text-sm text-[#7F4F24] mt-2">
            Comece no plano gratuito e evolua para maior visibilidade quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {mockPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'border-[#C85A32] shadow-artisan-hover ring-2 ring-[#C85A32]/20 relative'
                  : 'border-[#EDE5D8] shadow-xs hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C85A32] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                  Mais Escolhido
                </div>
              )}

              <div>
                <h3 className="font-serif font-bold text-2xl text-[#1B4332]">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#7F4F24] mt-1 min-h-[36px]">
                  {plan.description}
                </p>

                <div className="my-6 pb-6 border-b border-[#EDE5D8]">
                  <span className="font-serif font-extrabold text-4xl text-[#1B4332]">
                    {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2).replace('.', ',')}`}
                  </span>
                  {plan.period && (
                    <span className="text-xs text-[#7F4F24] font-medium ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 text-xs text-[#4A3525]">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/quero-vender/cadastro"
                className={`w-full py-3.5 rounded-xl font-bold text-xs text-center transition-colors block ${
                  plan.popular
                    ? 'bg-[#C85A32] hover:bg-[#A4421F] text-white shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#1B4332]'
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
