import Image from "next/image";
import Cabecera from "@/components/cabecera";
import Pie from "@/components/pie";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Cabecera activeRoute="/" brandName="GeoSeñal" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-400 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,white,transparent_70%)]" />
        <div className="container mx-auto px-6 py-20 md:py-28 text-center relative">
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 drop-shadow-lg">
            Bienvenido a <span className="text-yellow-300">GeoSeñal</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Explora mapas interactivos y descubre datos geográficos detallados sobre cobertura de servicios.
          </p>
          <a
            href="/geoapp"
            className="inline-block bg-white text-emerald-700 font-bold text-lg py-3 px-8 rounded-full shadow-xl hover:bg-yellow-300 hover:text-emerald-800 transition-all hover:scale-105 active:scale-95"
          >
            Ver mapas
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* About */}
      <section className="flex-1 bg-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6">
                ¿Qué es <span className="text-emerald-600">GeoSeñal</span>?
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                GeoSeñal es una aplicación diseñada para proporcionar información
                geográfica detallada sobre la cobertura de servicios en diferentes
                regiones. Nuestra plataforma permite a los usuarios explorar mapas
                interactivos, consultar datos de cobertura y obtener insights valiosos
                para la toma de decisiones.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur-xl opacity-60" />
                <Image
                  src="/cap-app.jpeg"
                  alt="Captura de GeoSeñal"
                  width={320}
                  height={180}
                  className="relative rounded-2xl shadow-2xl"
                />
              </div>
              <p className="text-center text-sm text-slate-400 mt-3 font-medium">La app</p>
            </div>
          </div>
        </div>
      </section>

      <Pie brandName="GeoSeñal" />
    </main>
  );
}
