"use client";

import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

interface CabeceraProps {
  activeRoute?: string;
  brandName?: string;
  brandSubtitle?: string;
  navItems?: NavItem[];
}

export default function Cabecera({
  activeRoute = "/",
  brandName = "GeoCobertura",
  brandSubtitle = "Sistema de Monitorización de Cobertura",
  navItems = [
    { href: "/", label: "Inicio" },
    { href: "/geoapp", label: "Mapa" },
    { href: "#", label: "Datos" },
    { href: "#", label: "Ayuda" },
  ],
}: CabeceraProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1100] bg-emerald-950/95 backdrop-blur text-white border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center gap-3">
        <a href="/" className="flex items-center gap-2.5 min-w-0">
          <img
            src="/descarga.png"
            alt="Logo"
            className="w-8 h-8 md:w-9 md:h-9 rounded-lg object-cover shrink-0 ring-1 ring-white/20"
          />
          <div className="min-w-0 leading-tight">
            <p className="text-base md:text-lg font-semibold tracking-tight truncate">{brandName}</p>
            <p className="hidden sm:block text-[11px] text-emerald-300/80 truncate">{brandSubtitle}</p>
          </div>
        </a>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-auto md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Menú de navegación"
          aria-expanded={menuOpen}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <nav className="hidden md:flex ml-auto items-center gap-1 text-sm">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                activeRoute === item.href
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/65 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-white/10">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1 text-sm">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-lg transition-colors ${
                  activeRoute === item.href
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
