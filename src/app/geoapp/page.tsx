"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";
import Cabecera from "@/components/cabecera";
import Pie from "@/components/pie";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const supabase = createClient(
  "https://kragaxizobcqusrcgxlm.supabase.co",
  "sb_publishable_pJ22ABVE8AmSh-qypQYigw_IN4zn9Cj"
);

export interface Reading {
  id: number;
  lat: number;
  lng: number;
  dbm: number;
  created_at: string;
}

export default function Geoapp() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("todas");
  const [legendOpen, setLegendOpen] = useState(true);
  const [vizMode, setVizMode] = useState<string>("promedio");

  useEffect(() => {
    supabase
      .from("readings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error cargando lecturas de Supabase:", error);
          setLoadError(error.message);
        } else if (data) {
          setReadings(data as Reading[]);
        }
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    const total = readings.length;
    const buenas = readings.filter((r) => r.dbm >= -80).length;
    const regulares = readings.filter((r) => r.dbm >= -100 && r.dbm < -80).length;
    const malas = readings.filter((r) => r.dbm < -100).length;
    const avg = total ? Math.round(readings.reduce((s, r) => s + r.dbm, 0) / total) : 0;
    return { total, buenas, regulares, malas, avg };
  }, [readings]);

  const filtered = useMemo(() => {
    let f = readings;
    if (filter === "buena") f = f.filter((r) => r.dbm >= -80);
    else if (filter === "regular") f = f.filter((r) => r.dbm >= -100 && r.dbm < -80);
    else if (filter === "mala") f = f.filter((r) => r.dbm < -100);
    return f;
  }, [readings, filter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f9]">
      <Cabecera activeRoute="/geoapp" brandName="GeoSeñal" />

      <div className="container mx-auto px-4 md:px-6 pt-5 md:pt-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-1">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Mapa de cobertura</h1>
            <p className="text-sm text-slate-500 mt-1">Últimas lecturas de señal registradas</p>
          </div>
          {!loading && (
            <span className="text-xs md:text-sm text-slate-500">
              Mostrando <span className="font-semibold text-slate-700">{filtered.length}</span> de {readings.length} lecturas
            </span>
          )}
        </div>
      </div>

      {loadError && (
        <div className="container mx-auto px-4 md:px-6 pt-4">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span>No se pudieron cargar las lecturas: {loadError}</span>
          </div>
        </div>
      )}

      {/* Panel de estadísticas */}
      <div className="container mx-auto px-4 md:px-6 pt-4 md:pt-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 md:gap-4">
          <StatBox label="Total" value={stats.total} accent="bg-slate-400" loading={loading} />
          <StatBox label="Buena" value={stats.buenas} accent="bg-green-500" loading={loading} />
          <StatBox label="Regular" value={stats.regulares} accent="bg-yellow-400" loading={loading} />
          <StatBox label="Mala" value={stats.malas} accent="bg-red-500" loading={loading} />
          <StatBox label="Señal media" value={stats.avg} unit="dBm" accent="bg-emerald-500" loading={loading} className="col-span-2 md:col-span-1" />
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="container mx-auto px-4 md:px-6 pt-4 md:pt-5">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6">
          <Segmented
            label="Calidad"
            value={filter}
            onChange={setFilter}
            options={[
              { key: "todas", label: "Todas" },
              { key: "buena", label: "Buena" },
              { key: "regular", label: "Regular" },
              { key: "mala", label: "Mala" },
            ]}
          />
          <Segmented
            label="Modo"
            value={vizMode}
            onChange={setVizMode}
            options={[
              { key: "promedio", label: "Promedio" },
              { key: "mejor-señal", label: "Mejor señal" },
            ]}
          />
        </div>
      </div>

      {/* Mapa */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-4 md:py-5">
        {loading ? (
          <div className="flex items-center justify-center h-[55vh] md:h-[65vh] bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-500 text-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-[3px] border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
              Cargando datos del sistema...
            </div>
          </div>
        ) : (
          <div className="h-[55vh] md:h-[65vh] rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
            <MapView readings={filtered} mode={vizMode} />

            {/* Leyenda de calor colapsable */}
            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-[1000]">
              <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg border border-slate-200 text-sm transition-all duration-200">
                {legendOpen ? (
                  <div className="p-3 md:p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="font-semibold text-slate-700 text-[10px] md:text-xs uppercase tracking-wide">Cobertura de señal</p>
                      <button
                        onClick={() => setLegendOpen(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Cerrar leyenda"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-1">
                      {[
                        { color: "#32d74b", label: "≥ -70 dBm — Óptima" },
                        { color: "#d7f21f", label: "-70 a -80 dBm — Buena" },
                        { color: "#ffd21f", label: "-80 a -90 dBm — Regular" },
                        { color: "#ff8a00", label: "-90 a -100 dBm — Baja" },
                        { color: "#ff1414", label: "-100 a -110 dBm — Débil" },
                        { color: "#ff2ba6", label: "< -110 dBm — Muy débil" },
                      ].map(({ color, label }) => (
                        <div key={color} className="flex items-center gap-1.5 md:gap-2">
                          <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded shrink-0" style={{ background: color }} />
                          <span className="text-[10px] md:text-xs text-slate-600 leading-tight">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setLegendOpen(true)}
                    className="flex items-center gap-1.5 p-2 md:p-3 text-slate-500 hover:text-slate-700 transition-colors"
                    aria-label="Abrir leyenda"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="text-[10px] md:text-xs font-medium">Leyenda</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Pie brandName="GeoSeñal" />
    </div>
  );
}

function StatBox({
  label,
  value,
  unit,
  accent,
  loading,
  className = "",
}: {
  label: string;
  value: number;
  unit?: string;
  accent: string;
  loading: boolean;
  className?: string;
}) {
  return (
    <div className={`${className} bg-white rounded-xl border border-slate-200/80 px-4 py-3 md:py-4 shadow-sm`}>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${accent}`} />
        <p className="text-[11px] md:text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      </div>
      {loading ? (
        <div className="mt-2 h-7 md:h-8 w-16 rounded-md bg-slate-100 animate-pulse" />
      ) : (
        <p className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
          {value}
          {unit && <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>}
        </p>
      )}
    </div>
  );
}

function Segmented({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (key: string) => void;
  options: { key: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2 text-sm min-w-0">
      <span className="text-slate-500 shrink-0">{label}</span>
      <div className="inline-flex p-1 rounded-xl bg-slate-200/60 overflow-x-auto">
        {options.map(({ key, label: optLabel }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
              value === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {optLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
