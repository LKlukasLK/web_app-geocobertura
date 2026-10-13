interface PieProps {
  brandName?: string;
  version?: string;
}

export default function Pie({
  brandName = "GeoCobertura",
  version = "v0.3",
}: PieProps) {
  return (
    <footer className="bg-emerald-950 text-emerald-200/70 mt-auto border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <p>
          &copy; {new Date().getFullYear()} <span className="text-white font-medium">{brandName}</span>
          <span className="mx-2 text-emerald-200/30">·</span>
          {version}
        </p>
        <div className="flex gap-5">
          <a href="/aviso-legal" className="hover:text-white transition-colors">Aviso legal</a>
          <a href="#" className="hover:text-white transition-colors">Accesibilidad</a>
          <a href="#" className="hover:text-white transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
