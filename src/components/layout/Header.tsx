'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  Heart,
  Store as StoreIcon,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  User,
  LogOut,
  Flame,
  Compass,
} from 'lucide-react';
import { useFavorites } from '@/lib/favorites-context';
import { useAuth } from '@/lib/auth-context';
import Logo from '@/components/ui/Logo';

export default function Header() {
  const pathname = usePathname();
  const { favoritesCount } = useFavorites();
  const { user, role, loginAs, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EDE5D8] transition-all">
      {/* Top Tourism Announcement Bar */}
      <div className="bg-[#1B4332] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#C85A32] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Destino em Foco
            </span>
            <span className="hidden sm:inline text-white/90">
              Conheça os ateliês de <strong>São Roque - SP</strong> no Roteiro do Vinho e Centro Histórico!
            </span>
            <span className="sm:hidden text-white/90">
              Explore <strong>São Roque - SP</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="text-[11px] font-medium bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Perfil Demo: <strong>{role === 'ARTISAN' ? 'Artesão' : role === 'ADMIN' ? 'Admin' : 'Turista'}</strong></span>
                <ChevronDown size={12} />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white text-[#2C2623] rounded-xl shadow-xl border border-[#EDE5D8] py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#7F4F24] uppercase tracking-wider border-b border-[#EDE5D8]">
                    Simular Perfil
                  </div>
                  <button
                    onClick={() => { loginAs('CUSTOMER'); setRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#FAF7F2] ${role === 'CUSTOMER' ? 'font-bold text-[#C85A32]' : 'text-[#4A3525]'}`}
                  >
                    <Compass size={14} className="text-[#C85A32]" />
                    <span>Turista / Visitante</span>
                  </button>
                  <button
                    onClick={() => { loginAs('ARTISAN'); setRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#FAF7F2] ${role === 'ARTISAN' ? 'font-bold text-[#1B4332]' : 'text-[#4A3525]'}`}
                  >
                    <StoreIcon size={14} className="text-[#1B4332]" />
                    <span>Artesão (Cerâmica da Terra)</span>
                  </button>
                  <button
                    onClick={() => { loginAs('ADMIN'); setRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#FAF7F2] ${role === 'ADMIN' ? 'font-bold text-[#2D6A4F]' : 'text-[#4A3525]'}`}
                  >
                    <ShieldCheck size={14} className="text-[#7F4F24]" />
                    <span>Administrador Regional</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Logo variant="full" theme="dark" size="md" href="/" />

            {/* City Selector Pill */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCityMenuOpen(!cityMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDE5D8]/70 hover:bg-[#EDE5D8] text-xs font-semibold text-[#4A3525] transition-colors cursor-pointer"
              >
                <MapPin size={13} className="text-[#C85A32]" />
                <span>São Roque - SP</span>
                <ChevronDown size={12} className="text-[#7F4F24]" />
              </button>

              {cityMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EDE5D8] py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-[#7F4F24] uppercase tracking-wider">
                    Cidades Disponíveis
                  </div>
                  <Link
                    href="/cidade/sao-roque"
                    onClick={() => setCityMenuOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#1B4332] hover:bg-[#FAF7F2] flex items-center justify-between gap-2"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin size={13} className="text-[#C85A32]" />
                      <span>São Roque - SP</span>
                    </span>
                    <span className="text-[10px] bg-[#D8F3DC] text-[#1B4332] px-1.5 py-0.5 rounded-sm font-bold">Ativo</span>
                  </Link>
                  <Link
                    href="/cidade/embu-das-artes"
                    onClick={() => setCityMenuOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#4A3525] hover:bg-[#FAF7F2] flex items-center gap-2"
                  >
                    <MapPin size={13} className="text-[#7F4F24]" />
                    <span>Embu das Artes - SP</span>
                  </Link>
                  <Link
                    href="/cidade/holambra"
                    onClick={() => setCityMenuOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#4A3525] hover:bg-[#FAF7F2] flex items-center gap-2"
                  >
                    <MapPin size={13} className="text-[#7F4F24]" />
                    <span>Holambra - SP</span>
                  </Link>
                  <Link
                    href="/cidade/paraty"
                    onClick={() => setCityMenuOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#4A3525] hover:bg-[#FAF7F2] flex items-center gap-2"
                  >
                    <MapPin size={13} className="text-[#7F4F24]" />
                    <span>Paraty - RJ</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/explorar"
              className={`text-sm font-medium transition-colors hover:text-[#C85A32] ${
                isActive('/explorar') ? 'text-[#C85A32] font-semibold' : 'text-[#4A3525]'
              }`}
            >
              Explorar
            </Link>
            <Link
              href="/cidade/sao-roque"
              className={`text-sm font-medium transition-colors hover:text-[#C85A32] ${
                isActive('/cidade') ? 'text-[#C85A32] font-semibold' : 'text-[#4A3525]'
              }`}
            >
              Cidades
            </Link>
            <Link
              href="/promocoes"
              className={`text-sm font-medium transition-colors hover:text-[#C85A32] flex items-center gap-1 ${
                isActive('/promocoes') ? 'text-[#C85A32] font-semibold' : 'text-[#4A3525]'
              }`}
            >
              <Flame size={14} className="text-[#C85A32]" />
              <span>Ofertas</span>
            </Link>
            <Link
              href="/mapa"
              className={`text-sm font-medium transition-colors hover:text-[#C85A32] ${
                isActive('/mapa') ? 'text-[#C85A32] font-semibold' : 'text-[#4A3525]'
              }`}
            >
              Mapa
            </Link>
            <Link
              href="/quero-vender"
              className="text-sm font-medium text-[#1B4332] hover:text-[#C85A32] transition-colors"
            >
              Quero Vender
            </Link>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-3">
            {/* Wishlist Link */}
            <Link
              href="/favoritos"
              className="relative p-2.5 rounded-full hover:bg-[#EDE5D8]/60 text-[#4A3525] hover:text-[#C85A32] transition-colors"
              aria-label="Ver itens favoritos"
            >
              <Heart size={20} />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#C85A32] text-white text-[11px] font-bold flex items-center justify-center animate-scale">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Role specific CTAs */}
            {role === 'ARTISAN' ? (
              <Link
                href="/painel"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1B4332] hover:bg-[#2D6A4F] text-white shadow-xs transition-all"
              >
                <StoreIcon size={15} />
                <span>Painel do Artesão</span>
              </Link>
            ) : role === 'ADMIN' ? (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#7F4F24] hover:bg-[#582F0E] text-white shadow-xs transition-all"
              >
                <ShieldCheck size={15} />
                <span>Painel Admin</span>
              </Link>
            ) : (
              <Link
                href="/quero-vender"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#C85A32] hover:bg-[#A4421F] text-white shadow-xs transition-all"
              >
                <Sparkles size={14} />
                <span>Cadastrar Loja</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#4A3525] hover:bg-[#EDE5D8]/60 transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EDE5D8] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#4A3525] hover:bg-[#EDE5D8] flex items-center gap-2.5"
            >
              <Compass size={16} className="text-[#C85A32]" />
              <span>Início</span>
            </Link>
            <Link
              href="/explorar"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#4A3525] hover:bg-[#EDE5D8] flex items-center gap-2.5"
            >
              <StoreIcon size={16} className="text-[#1B4332]" />
              <span>Explorar Catálogo</span>
            </Link>
            <Link
              href="/cidade/sao-roque"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#4A3525] hover:bg-[#EDE5D8] flex items-center gap-2.5"
            >
              <MapPin size={16} className="text-[#C85A32]" />
              <span>São Roque - SP</span>
            </Link>
            <Link
              href="/promocoes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#C85A32] hover:bg-[#EDE5D8] flex items-center gap-2.5"
            >
              <Flame size={16} />
              <span>Ofertas & Promoções</span>
            </Link>
            <Link
              href="/mapa"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#4A3525] hover:bg-[#EDE5D8] flex items-center gap-2.5"
            >
              <MapPin size={16} className="text-[#2D6A4F]" />
              <span>Mapa de Ateliês</span>
            </Link>
            <Link
              href="/favoritos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#4A3525] hover:bg-[#EDE5D8] flex items-center gap-2.5"
            >
              <Heart size={16} className="text-[#C85A32]" />
              <span>Meus Favoritos ({favoritesCount})</span>
            </Link>
            <Link
              href="/quero-vender"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#1B4332] hover:bg-[#EDE5D8] flex items-center gap-2.5"
            >
              <Sparkles size={16} className="text-[#D4A373]" />
              <span>Quero Vender no Descubra Artes</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#EDE5D8] flex flex-col gap-2">
            <Link
              href="/painel"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-[#1B4332] text-white"
            >
              Painel do Artesão
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-[#7F4F24] text-white"
            >
              Painel Administrador
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
