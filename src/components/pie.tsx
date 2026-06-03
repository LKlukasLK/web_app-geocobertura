interface PieProps {
  brandName?: string;
  version?: string;
}

export default function Pie({
  brandName = "GeoCobertura",
  version = "v0.3",
}: PieProps) {
  return (
    <footer className="bg-emerald-800 text-white mt-auto">
      <div className="bg-emerald-900 text-[10px] md:text-xs text-center py-1.5 md:py-2 text-emerald-300 px-2">
        Sistema de Monitorización de Cobertura — {brandName} {version}
      </div>
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between text-[10px] md:text-xs text-emerald-200 gap-1 md:gap-0">
        <p>&copy; 2024 {brandName}. Todos los derechos reservados.</p>
        <div className="flex gap-3 md:gap-4">
          <a href="#" className="hover:text-white transition-colors">Aviso legal</a>
          <a href="#" className="hover:text-white transition-colors">Accesibilidad</a>
          <a href="#" className="hover:text-white transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
