import type { Metadata } from "next";
import Cabecera from "@/components/cabecera";
import Pie from "@/components/pie";

// Datos del titular: sustituye los marcadores por los datos reales.
const TITULAR = {
  nombre: "[NOMBRE Y APELLIDOS]",
  nif: "[NIF]",
  domicilio: "[DOMICILIO]",
  email: "[EMAIL DE CONTACTO]",
};

const SITIO = "GeoSeñal";
const ULTIMA_ACTUALIZACION = "13 de octubre de 2026";

export const metadata: Metadata = {
  title: `Aviso legal · ${SITIO}`,
};

export default function AvisoLegal() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f9]">
      <Cabecera activeRoute="/aviso-legal" brandName={SITIO} />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Aviso legal</h1>
          <p className="text-sm text-slate-500 mt-1">Última actualización: {ULTIMA_ACTUALIZACION}</p>

          <div className="mt-6 md:mt-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-8 space-y-8">
            <Seccion titulo="1. Datos identificativos">
              <p>
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
                Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos
                del titular de este sitio web:
              </p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-xl bg-slate-50 border border-slate-200/80 p-4">
                <dt className="text-slate-500">Titular</dt>
                <dd className="text-slate-900 font-medium">{TITULAR.nombre}</dd>
                <dt className="text-slate-500">NIF</dt>
                <dd className="text-slate-900 font-medium">{TITULAR.nif}</dd>
                <dt className="text-slate-500">Domicilio</dt>
                <dd className="text-slate-900 font-medium">{TITULAR.domicilio}</dd>
                <dt className="text-slate-500">Correo</dt>
                <dd className="text-slate-900 font-medium break-all">{TITULAR.email}</dd>
              </dl>
            </Seccion>

            <Seccion titulo="2. Objeto">
              <p>
                {SITIO} es un proyecto personal sin ánimo de lucro que muestra, sobre un mapa
                interactivo, lecturas de intensidad de señal de cobertura móvil recogidas en distintas
                ubicaciones. El acceso es gratuito y no requiere registro.
              </p>
            </Seccion>

            <Seccion titulo="3. Condiciones de uso">
              <p>
                El acceso a este sitio implica la aceptación de este aviso legal. La persona usuaria se
                compromete a hacer un uso adecuado de los contenidos, de acuerdo con la ley, la buena fe
                y el orden público, y a no emplearlos para actividades ilícitas ni para dañar el sitio o
                impedir su funcionamiento normal.
              </p>
            </Seccion>

            <Seccion titulo="4. Información sobre los datos de cobertura">
              <p>
                Las lecturas mostradas son mediciones puntuales tomadas en un momento y lugar concretos.
                La cobertura real varía según el operador, el dispositivo, la hora, la meteorología y
                otros factores, por lo que la información tiene carácter <strong>meramente
                orientativo</strong> y no garantiza la existencia ni la calidad del servicio en ninguna
                zona.
              </p>
              <p>
                Las lecturas son anónimas: solo contienen la posición, la intensidad de señal (dBm) y
                la fecha de la medición, y no se asocian a ninguna persona ni dispositivo.
              </p>
            </Seccion>

            <Seccion titulo="5. Propiedad intelectual e industrial">
              <p>
                Los textos, el diseño, el logotipo y el código de este sitio pertenecen a su titular,
                salvo que se indique lo contrario. Queda prohibida su reproducción, distribución o
                transformación con fines comerciales sin autorización expresa.
              </p>
              <p>
                La cartografía procede de{" "}
                <Enlace href="https://www.openstreetmap.org/copyright">OpenStreetMap</Enlace> y sus
                colaboradores, bajo licencia Open Database License (ODbL). El mapa se muestra con la
                biblioteca <Enlace href="https://leafletjs.com">Leaflet</Enlace>.
              </p>
            </Seccion>

            <Seccion titulo="6. Exclusión de responsabilidad">
              <p>
                El titular no se hace responsable de las decisiones tomadas a partir de la información
                publicada, ni de los daños que pudieran derivarse de interrupciones del servicio,
                errores en los datos, virus o fallos técnicos ajenos a su control. El titular podrá
                modificar, suspender o retirar los contenidos en cualquier momento y sin previo aviso.
              </p>
            </Seccion>

            <Seccion titulo="7. Enlaces externos">
              <p>
                Este sitio puede incluir enlaces a páginas de terceros. El titular no controla ni se
                responsabiliza de su contenido ni de sus políticas de privacidad.
              </p>
            </Seccion>

            <Seccion titulo="8. Datos personales y cookies">
              <p>
                Este sitio no tiene formularios ni cuentas de usuario, no recoge datos personales de
                quienes lo visitan y no instala cookies propias.
              </p>
              <p>
                Para funcionar, el navegador se conecta a servicios de terceros que pueden registrar
                datos técnicos como la dirección IP: el alojamiento web (Vercel), la base de datos
                (Supabase) y los servidores de mapas de OpenStreetMap. Cada uno trata esos datos según
                su propia política de privacidad.
              </p>
              <p>
                Para cualquier consulta puedes escribir a{" "}
                <span className="font-medium text-slate-900 break-all">{TITULAR.email}</span>.
              </p>
            </Seccion>

            <Seccion titulo="9. Legislación aplicable">
              <p>
                Este aviso legal se rige por la legislación española. Cualquier controversia se someterá
                a los juzgados y tribunales que correspondan conforme a la normativa vigente.
              </p>
            </Seccion>
          </div>
        </div>
      </main>

      <Pie brandName={SITIO} />
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base md:text-lg font-semibold text-slate-900">{titulo}</h2>
      <div className="mt-2 space-y-3 text-sm md:text-[15px] leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

function Enlace({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
    >
      {children}
    </a>
  );
}
