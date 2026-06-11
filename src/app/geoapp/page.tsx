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
        if (!error && data) setReadings(data as Reading[]);
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
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Cabecera activeRoute="/geoapp" brandName="GeoSeñal" />

      {/* Barra de herramientas */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-2 md:py-3 flex flex-col md:flex-row md:flex-wrap md:items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 md:gap-2 text-sm overflow-x-auto pb-1 md:pb-0">
            <span className="text-slate-500 shrink-0">Calidad:</span>
            {[
              { key: "todas", label: "Todas" },
              { key: "buena", label: "Buena" },
              { key: "regular", label: "Regular" },
              { key: "mala", label: "Mala" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2.5 md:px-3 py-1.5 rounded text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === key
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 md:gap-2 text-sm">
            <span className="text-slate-500 shrink-0">Modo:</span>
            <button
              onClick={() => setVizMode("promedio")}
              className={`px-2.5 md:px-3 py-1.5 rounded text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                vizMode === "promedio"
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Promedio
            </button>
            <button
              onClick={() => setVizMode("mejor-señal")}
              className={`px-2.5 md:px-3 py-1.5 rounded text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                vizMode === "mejor-señal"
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Mejor señal
            </button>
          </div>
          {!loading && (
            <span className="text-xs md:text-sm text-slate-400 md:ml-auto">
              {filtered.length} de {readings.length} lecturas
            </span>
          )}
        </div>
      </div>

      {/* Panel de estadísticas */}
      {!loading && (
        <div className="container mx-auto px-4 md:px-6 pt-3 md:pt-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
            <StatBox label="Total" value={stats.total} color="text-slate-700" />
            <StatBox label="Buena" value={stats.buenas} color="text-green-600" />
            <StatBox label="Regular" value={stats.regulares} color="text-yellow-600" />
            <StatBox label="Mala" value={stats.malas} color="text-red-600" />
            <StatBox label="Media" value={stats.avg} color="text-emerald-600" />
          </div>
        </div>
      )}

      {/* Mapa */}
      <main className="flex-1 p-3 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[50vh] md:h-[60vh] bg-white rounded-xl shadow border border-slate-200 text-slate-500 text-sm md:text-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
              Cargando datos del sistema...
            </div>
          </div>
        ) : (
          <div className="h-[50vh] md:h-[60vh] rounded-xl overflow-hidden shadow border border-slate-200 relative">
            <MapView readings={filtered} mode={vizMode} />

            {/* Leyenda de calor colapsable */}
            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-[1000]">
              <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg border border-slate-200 text-sm transition-all duration-200">
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

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 px-3 md:px-4 py-2 md:py-3 shadow-sm">
      <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wide">{label}</p>
      <p className={`text-lg md:text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}
