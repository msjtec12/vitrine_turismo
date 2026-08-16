import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, MapPin, MessageCircle, ExternalLink, Shield } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-[#1B4332] text-white border-t border-[#2D6A4F] pt-16 pb-24 md:pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Callout Banner */}
        <div className="bg-[#2D6A4F]/60 rounded-3xl p-6 md:p-10 border border-white/10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C85A32] text-white text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              Você é artesão ou produtor local?
            </span>
            <h3 className="font-serif font-bold text-2xl md:text-3xl text-white">
              Coloque sua arte no mapa de São Roque e do Brasil
            </h3>
            <p className="text-white/80 text-sm mt-2">
              Divulgue seu ateliê para turistas qualificados, receba contatos diretos no WhatsApp e valorize o trabalho manual autêntico.
            </p>
          </div>

          <Link
            href="/quero-vender"
            className="px-8 py-4 rounded-2xl bg-[#C85A32] hover:bg-[#A4421F] text-white font-bold text-base transition-all shadow-lg hover:scale-102 shrink-0 text-center"
          >
            Anunciar Meu Ateliê
          </Link>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10 text-sm">
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="full" theme="light" size="lg" href="/" />
            <p className="font-serif italic text-base text-[#D4A373]">
              &ldquo;Descubra quem faz. Conheça o lugar. Leve uma história.&rdquo;
            </p>
            <p className="text-white/70 text-xs leading-relaxed max-w-sm">
              Plataforma dedicada a conectar viajantes e apreciadores da cultura brasileira diretamente aos mestres artesãos, ateliês e produtores regionais. Sem intermediários, com contato direto via WhatsApp.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-white/80">
              <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg">
                <span>🍇 Foco Inicial: <strong>São Roque - SP</strong></span>
              </span>
            </div>
          </div>

          {/* Col 2: Destinos & Cidades */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#E9C46A]">
              Destinos
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/cidade/sao-roque" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>São Roque - SP</span>
                  <span className="text-[10px] bg-[#C85A32] text-white px-1.5 rounded-sm">MVP</span>
                </Link>
              </li>
              <li>
                <Link href="/cidade/embu-das-artes" className="hover:text-white transition-colors">
                  Embu das Artes - SP
                </Link>
              </li>
              <li>
                <Link href="/cidade/holambra" className="hover:text-white transition-colors">
                  Holambra - SP
                </Link>
              </li>
              <li>
                <Link href="/cidade/paraty" className="hover:text-white transition-colors">
                  Paraty - RJ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categorias */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#E9C46A]">
              Categorias
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/explorar?categoria=ceramica" className="hover:text-white transition-colors">
                  Cerâmica & Barro
                </Link>
              </li>
              <li>
                <Link href="/explorar?categoria=madeira" className="hover:text-white transition-colors">
                  Madeira & Marcenaria
                </Link>
              </li>
              <li>
                <Link href="/explorar?categoria=tecelagem" className="hover:text-white transition-colors">
                  Tear & Crochê
                </Link>
              </li>
              <li>
                <Link href="/explorar?categoria=sabores" className="hover:text-white transition-colors">
                  Sabores & Licores
                </Link>
              </li>
              <li>
                <Link href="/explorar?categoria=joias" className="hover:text-white transition-colors">
                  Joias & Biojoias
                </Link>
              </li>
              <li>
                <Link href="/explorar?categoria=aromas" className="hover:text-white transition-colors">
                  Aromas & Velas
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Plataforma & Acesso */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#E9C46A]">
              Plataforma
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/explorar" className="hover:text-white transition-colors">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link href="/promocoes" className="hover:text-white transition-colors">
                  Ofertas da Região
                </Link>
              </li>
              <li>
                <Link href="/mapa" className="hover:text-white transition-colors">
                  Mapa Interativo
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="hover:text-white transition-colors">
                  Meus Favoritos
                </Link>
              </li>
              <li>
                <Link href="/painel" className="hover:text-white transition-colors font-semibold text-[#D4A373]">
                  Painel do Artesão
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors text-white/50">
                  Painel Administrativo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Descubra Cidades Integration */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span>Integrado ao ecossistema <strong>Descubra Cidades</strong></span>
            <span>•</span>
            <span>Feito com <Heart size={12} className="inline text-[#C85A32] fill-[#C85A32]" /> para valorizar quem produz</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Descubra Artes. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
