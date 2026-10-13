# GeoSeñal

Aplicación web para consultar la cobertura de señal móvil sobre un mapa. Reúne lecturas
reales de intensidad de señal (en dBm) guardadas en Supabase y las muestra como un mapa de
calor interactivo, con filtros por calidad y estadísticas.

## Funcionalidades

- **Portada** (`/`): presentación de la aplicación y acceso al mapa.
- **Mapa de cobertura** (`/geoapp`):
  - Carga las últimas 500 lecturas de la tabla `readings` de Supabase.
  - Dibuja un mapa de calor sobre OpenStreetMap: cada lectura cubre un radio de ~100 m y el
    color va del verde (señal buena) al rosa (sin señal).
  - **Filtro de calidad**: todas, buena (≥ -80 dBm), regular (-100 a -80 dBm) o mala (< -100 dBm).
  - **Modo de visualización**: *Promedio* (media ponderada de las lecturas cercanas) o
    *Mejor señal* (prioriza las lecturas más fuertes de cada zona).
  - Panel de estadísticas: total de lecturas, reparto por calidad y señal media.
  - Leyenda de colores plegable.
- **Aviso legal** (`/aviso-legal`).

## Tecnologías

- [Next.js](https://nextjs.org) 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- [Leaflet](https://leafletjs.com) / React Leaflet para el mapa (capa de calor propia en canvas)
- [Supabase](https://supabase.com) como origen de datos

## Estructura

```
src/
├── app/
│   ├── page.tsx            # Portada
│   ├── geoapp/page.tsx     # Mapa de cobertura (carga de datos, filtros, estadísticas)
│   ├── aviso-legal/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── MapView.tsx         # Mapa Leaflet y capa de calor de cobertura
│   ├── cabecera.tsx        # Cabecera / navegación
│   └── pie.tsx             # Pie de página
└── types/leaflet.heat.d.ts
```

## Datos

La app lee la tabla `readings` de Supabase con estas columnas:

| Columna      | Tipo      | Descripción                      |
|--------------|-----------|----------------------------------|
| `id`         | number    | Identificador                    |
| `lat`        | number    | Latitud                          |
| `lng`        | number    | Longitud                         |
| `dbm`        | number    | Intensidad de señal en dBm       |
| `created_at` | timestamp | Fecha de la lectura              |

La URL del proyecto de Supabase y la clave pública (*publishable*) están escritas
directamente en `src/app/geoapp/page.tsx`.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
npm run start   # servir el build
```

## Ramas

- `master`: producción.
- `staging`: todas las modificaciones se hacen aquí y se pasan a `master` mediante pull request.
