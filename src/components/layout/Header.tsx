'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Package,
} from 'lucide-react';
import { useFavorites } from '@/lib/favorites-context';
import { useAuth } from '@/lib/auth-context';
import Logo from '@/components/ui/Logo';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { favoritesCount } = useFavorites();
  const { user, role, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EAE3D6] transition-all">
      {/* Top Tourism Announcement Bar */}
      <div className="bg-[#0B2545] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#E9A825] text-[#0B2545] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
              Destino em Foco
            </span>
            <span className="hidden sm:inline text-white/90">
              Conheça os ateliês de <strong>São Roque - SP</strong> no Roteiro do Vinho e Centro Histórico!
            </span>
            <span className="sm:hidden text-white/90">
              Explore <strong>São Roque - SP</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90 hover:text-white cursor-pointer"
                >
                  <User size={13} className="text-[#E9A825]" />
                  <span>Olá, {user?.fullName?.split(' ')[0]}</span>
                  <ChevronDown size={11} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-[#2C2623] rounded-2xl shadow-xl border border-[#EAE3D6] py-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-3.5 py-1.5 border-b border-[#EAE3D6]">
                      <p className="text-[11px] font-bold text-[#0B2545] truncate">{user?.fullName}</p>
                      <p className="text-[10px] text-[#7F4F24] truncate">{user?.email}</p>
                    </div>

                    {role === 'ADMIN' ? (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="px-3.5 py-2 text-xs text-[#0B2545] hover:bg-[#FDFBF7] font-semibold flex items-center gap-2"
                      >
                        <ShieldCheck size={14} className="text-[#E9A825]" />
                        <span>Painel Admin</span>
                      </Link>
                    ) : (
                      <Link
                        href="/painel"
                        onClick={() => setUserMenuOpen(false)}
                        className="px-3.5 py-2 text-xs text-[#0B2545] hover:bg-[#FDFBF7] font-semibold flex items-center gap-2"
                      >
                        <StoreIcon size={14} className="text-[#0B2545]" />
                        <span>Painel do Produtor</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2 border-t border-[#EAE3D6] cursor-pointer"
                    >
                      <LogOut size={13} />
                      <span>Sair da conta</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-[11px] font-medium text-white/90 hover:text-white transition-colors"
                >
                  Entrar
                </Link>
                <span className="text-white/40">|</span>
                <Link
                  href="/quero-vender"
                  className="text-[11px] font-bold text-[#E9A825] hover:text-white transition-colors flex items-center gap-1"
                >
                  <Sparkles size={11} />
                  <span>Quero Vender</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Logo variant="full" theme="dark" size="md" href="/" />

            {/* City Selector Pill */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCityMenuOpen(!cityMenuOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#EAE3D6] hover:border-[#0B2545]/30 text-xs font-semibold text-[#0B2545] shadow-2xs transition-colors cursor-pointer"
              >
                <MapPin size={13} className="text-[#E9A825]" />
                <span>São Roque - SP</span>
                <ChevronDown size={12} className="text-[#7F4F24]" />
              </button>

              {cityMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EAE3D6] py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-[#7F4F24] uppercase tracking-wider">
                    Cidades Disponíveis
                  </div>
                  <Link
                    href="/cidade/sao-roque"
                    onClick={() => setCityMenuOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#0B2545] hover:bg-[#FDFBF7] flex items-center justify-between gap-2"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin size={13} className="text-[#E9A825]" />
                      <span>São Roque - SP</span>
                    </span>
                    <span className="text-[10px] bg-[#E8F1F5] text-[#0B2545] px-2 py-0.5 rounded-full font-bold">Ativo</span>
                  </Link>
                  <Link
                    href="/cidade/embu-das-artes"
                    onClick={() => setCityMenuOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#4A3525] hover:bg-[#FDFBF7] flex items-center gap-2"
                  >
                    <MapPin size={13} className="text-[#7F4F24]" />
                    <span>Embu das Artes - SP</span>
                  </Link>
                  <Link
                    href="/cidade/holambra"
                    onClick={() => setCityMenuOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#4A3525] hover:bg-[#FDFBF7] flex items-center gap-2"
                  >
                    <MapPin size={13} className="text-[#7F4F24]" />
                    <span>Holambra - SP</span>
                  </Link>
                  <Link
                    href="/cidade/campos-do-jordao"
                    onClick={() => setCityMenuOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#4A3525] hover:bg-[#FDFBF7] flex items-center gap-2"
                  >
                    <MapPin size={13} className="text-[#7F4F24]" />
                    <span>Campos do Jordão - SP</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors hover:text-[#0B2545] ${
                pathname === '/' ? 'text-[#0B2545] font-bold border-b-2 border-[#E9A825] pb-0.5' : 'text-[#4A3525]'
              }`}
            >
              Início
            </Link>
            <Link
              href="/explorar"
              className={`text-sm font-semibold transition-colors hover:text-[#0B2545] ${
                pathname === '/explorar' && !pathname.includes('tipo=lojas') ? 'text-[#0B2545] font-bold border-b-2 border-[#E9A825] pb-0.5' : 'text-[#4A3525]'
              }`}
            >
              Produtos
            </Link>
            <Link
              href="/explorar?tipo=lojas"
              className={`text-sm font-semibold transition-colors hover:text-[#0B2545] ${
                pathname.includes('tipo=lojas') ? 'text-[#0B2545] font-bold border-b-2 border-[#E9A825] pb-0.5' : 'text-[#4A3525]'
              }`}
            >
              Produtores
            </Link>
            <Link
              href="/cidade/sao-roque"
              className={`text-sm font-semibold transition-colors hover:text-[#0B2545] ${
                isActive('/cidade') ? 'text-[#0B2545] font-bold border-b-2 border-[#E9A825] pb-0.5' : 'text-[#4A3525]'
              }`}
            >
              Cidades
            </Link>
            <Link
              href="/promocoes"
              className={`text-sm font-semibold transition-colors hover:text-[#0B2545] flex items-center gap-1.5 ${
                isActive('/promocoes') ? 'text-[#0B2545] font-bold border-b-2 border-[#E9A825] pb-0.5' : 'text-[#4A3525]'
              }`}
            >
              <Flame size={14} className="text-[#E76F51]" />
              <span>Ofertas</span>
            </Link>
            <Link
              href="/quero-vender"
              className={`text-sm font-bold transition-colors hover:text-[#0B2545] ${
                isActive('/quero-vender') ? 'text-[#0B2545] border-b-2 border-[#E9A825] pb-0.5' : 'text-[#0B2545]'
              }`}
            >
              Para Produtores
            </Link>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-3">
            {/* Wishlist Link */}
            <Link
              href="/favoritos"
              className="relative p-2.5 rounded-full bg-white border border-[#EAE3D6] hover:border-[#0B2545]/30 text-[#0B2545] hover:text-[#E76F51] transition-all shadow-2xs"
              aria-label="Ver itens favoritos"
            >
              <Heart size={18} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E76F51] text-white text-[11px] font-bold flex items-center justify-center animate-scale shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Role specific CTAs */}
            {isLoggedIn ? (
              role === 'ADMIN' ? (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-[#133C55] text-white shadow-xs transition-all"
                >
                  <ShieldCheck size={15} className="text-[#E9A825]" />
                  <span>Painel Admin</span>
                </Link>
              ) : (
                <Link
                  href="/painel"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-[#133C55] text-white shadow-xs transition-all"
                >
                  <StoreIcon size={15} className="text-[#E9A825]" />
                  <span>Painel do Produtor</span>
                </Link>
              )
            ) : (
              <Link
                href="/quero-vender/cadastro"
                className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#E9A825] hover:bg-[#D48C18] text-[#0B2545] shadow-xs transition-all hover:scale-102"
              >
                <Sparkles size={14} />
                <span>Cadastrar Ateliê</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white border border-[#EAE3D6] text-[#0B2545] hover:bg-[#FDFBF7] transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
              <Package size={16} className="text-[#1B4332]" />
              <span>Produtos</span>
            </Link>
            <Link
              href="/explorar?tipo=lojas"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#4A3525] hover:bg-[#EDE5D8] flex items-center gap-2.5"
            >
              <StoreIcon size={16} className="text-[#7F4F24]" />
              <span>Produtores</span>
            </Link>
            <Link
              href="/cidade/sao-roque"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#4A3525] hover:bg-[#EDE5D8] flex items-center gap-2.5"
            >
              <MapPin size={16} className="text-[#C85A32]" />
              <span>Cidades</span>
            </Link>
            <Link
              href="/promocoes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#C85A32] hover:bg-[#EDE5D8] flex items-center gap-2.5 font-bold"
            >
              <Flame size={16} />
              <span>Ofertas</span>
            </Link>
            <Link
              href="/favoritos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#4A3525] hover:bg-[#EDE5D8] flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Heart size={16} className="text-[#C85A32]" />
                <span>Favoritos</span>
              </div>
              {favoritesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#C85A32] text-white text-xs font-bold">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <Link
              href="/quero-vender"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-bold text-[#1B4332] hover:bg-[#EDE5D8] flex items-center gap-2.5"
            >
              <Sparkles size={16} className="text-[#E9C46A]" />
              <span>Para Produtores</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#EDE5D8] flex flex-col gap-2">
            {isLoggedIn ? (
              <Link
                href={role === 'ADMIN' ? '/admin' : '/painel'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-[#1B4332] text-white"
              >
                {role === 'ADMIN' ? 'Acessar Painel Admin' : 'Acessar Painel do Artesão'}
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl text-center text-xs font-bold bg-[#FAF7F2] border border-[#EDE5D8] text-[#1B4332]"
                >
                  Entrar
                </Link>
                <Link
                  href="/quero-vender/cadastro"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl text-center text-xs font-bold bg-[#C85A32] text-white"
                >
                  Cadastrar Ateliê
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
