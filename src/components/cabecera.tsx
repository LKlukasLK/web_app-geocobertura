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
    <header className="bg-emerald-700 text-white shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-2 md:py-3 flex items-center gap-2 md:gap-4">
        <img
          src="/descarga.png"
          alt="Logo"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0">
          <h1 className="text-base md:text-xl font-bold tracking-tight truncate">{brandName}</h1>
          <p className="text-[10px] md:text-xs text-emerald-200 truncate">{brandSubtitle}</p>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-auto md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Menú de navegación"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <nav className="hidden md:flex ml-auto items-center gap-6 text-sm">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={
                activeRoute === item.href
                  ? "text-white font-semibold border-b-2 border-yellow-300 pb-0.5"
                  : "text-white/70 hover:text-white transition-colors"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-emerald-600 bg-emerald-800">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1 text-sm">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={
                  activeRoute === item.href
                    ? "text-white font-semibold py-2 px-3 rounded bg-emerald-600"
                    : "text-white/70 hover:text-white py-2 px-3 rounded hover:bg-emerald-600 transition-colors"
                }
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
