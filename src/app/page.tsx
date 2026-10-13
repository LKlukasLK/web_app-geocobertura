import Image from "next/image";
import Cabecera from "@/components/cabecera";
import Pie from "@/components/pie";

const features = [
  {
    title: "Mapa de cobertura",
    text: "Cada lectura se dibuja sobre el mapa con un color según la intensidad de la señal.",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  },
  {
    title: "Filtros por calidad",
    text: "Muestra solo las zonas con señal buena, regular o mala para encontrar los puntos débiles.",
    icon: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z",
  },
  {
    title: "Estadísticas al momento",
    text: "Total de lecturas, reparto por calidad y señal media en dBm de un vistazo.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

const signalScale = ["#ff2ba6", "#ff1414", "#ff8a00", "#ffd21f", "#d7f21f", "#32d74b"];

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Cabecera activeRoute="/" brandName="GeoSeñal" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-emerald-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(34,211,238,0.18),transparent_55%)]" />
        <div className="container mx-auto px-6 py-16 md:py-24 relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Monitorización de cobertura móvil
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Mira dónde hay señal <span className="text-emerald-400">antes de llegar</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/70 max-w-xl leading-relaxed">
              GeoSeñal reúne lecturas reales de cobertura y las convierte en un mapa interactivo
              para detectar zonas con buena y mala señal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/geoapp"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-colors"
              >
                Abrir el mapa
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#que-es"
                className="inline-flex items-center py-3 px-6 rounded-xl border border-white/15 text-white/85 hover:bg-white/5 transition-colors"
              >
                Saber más
              </a>
            </div>
            <div className="mt-10 max-w-sm">
              <div className="flex h-1.5 rounded-full overflow-hidden">
                {signalScale.map((c) => (
                  <span key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-white/50">
                <span>-110 dBm</span>
                <span>-70 dBm</span>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[260px] md:max-w-[300px]">
            <div className="absolute -inset-6 bg-emerald-500/25 rounded-[3rem] blur-3xl" />
            <div className="relative rounded-[2.25rem] border border-white/15 bg-black/40 p-2.5 shadow-2xl">
              <Image
                src="/cap-app.jpeg"
                alt="Captura de GeoSeñal"
                width={300}
                height={650}
                className="rounded-[1.75rem] w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Qué es */}
      <section id="que-es" className="flex-1 bg-[#f6f7f9] py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              ¿Qué es <span className="text-emerald-600">GeoSeñal</span>?
            </h2>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Una aplicación para consultar la cobertura de servicios en distintas zonas. Explora
              el mapa, filtra las lecturas y obtén la información que necesitas para decidir.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={f.icon} />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pie brandName="GeoSeñal" />
    </main>
  );
}
