"use client";

import { Fragment, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Reading {
  id: number;
  lat: number;
  lng: number;
  dbm: number;
  created_at: string;
}

function getColor(dbm: number): string {
  if (dbm >= -70) return "#32d74b";
  if (dbm >= -80) return "#d7f21f";
  if (dbm >= -90) return "#ffd21f";
  if (dbm >= -100) return "#ff8a00";
  if (dbm >= -110) return "#ff1414";
  return "#ff2ba6";
}

function dotIcon(dbm: number): L.DivIcon {
  const color = getColor(dbm);
  return L.divIcon({
    className: "",
    html: `<div style="
      width:8px;height:8px;
      border-radius:50%;
      background:${color};
      border:1.5px solid white;
      box-shadow:0 1px 3px rgba(0,0,0,.5);
    "></div>`,
    iconSize: [8, 8],
    iconAnchor: [4, 4],
  });
}

function interpolateColor(dbm: number): string {
  const stops = [
    { dbm: -115, color: [255, 43, 166] },
    { dbm: -108, color: [255, 20, 20] },
    { dbm: -98, color: [255, 138, 0] },
    { dbm: -88, color: [255, 210, 31] },
    { dbm: -78, color: [215, 242, 31] },
    { dbm: -65, color: [50, 215, 75] },
  ];

  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (dbm >= a.dbm && dbm <= b.dbm) {
      const t = (dbm - a.dbm) / (b.dbm - a.dbm);
      const rgb = a.color.map((v, index) => Math.round(v + (b.color[index] - v) * t));
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  }

  return dbm > -65 ? "rgb(50, 215, 75)" : "rgb(255, 43, 166)";
}

// Margen extra que se dibuja alrededor de la vista para que al arrastrar no se vean bordes vacíos.
const CANVAS_PADDING = 0.5;

function CoverageCanvas({ readings, mode }: { readings: Reading[]; mode: string }) {
  const map = useMap();

  useEffect(() => {
    if (!readings.length) return;

    // "leaflet-zoom-hide" hace que Leaflet oculte la capa durante la animación de zoom.
    const canvas = L.DomUtil.create("canvas", "leaflet-coverage-layer leaflet-zoom-hide") as HTMLCanvasElement;
    const pane = map.getPane("overlayPane");
    pane?.appendChild(canvas);

    canvas.style.position = "absolute";
    canvas.style.pointerEvents = "none";
    canvas.style.mixBlendMode = "multiply";
    canvas.style.opacity = "0.78";

    const ctx = canvas.getContext("2d");
    // Las celdas se pintan sin desenfoque en un canvas auxiliar y luego se copian
    // al visible con un único desenfoque, en lugar de desenfocar cada celda.
    const cells = document.createElement("canvas");
    const cellsCtx = cells.getContext("2d");
    if (!ctx || !cellsCtx) return;

    const draw = () => {
      const size = map.getSize();
      const padX = Math.round(size.x * CANVAS_PADDING);
      const padY = Math.round(size.y * CANVAS_PADDING);
      const width = size.x + padX * 2;
      const height = size.y + padY * 2;
      const topLeft = map.containerPointToLayerPoint([-padX, -padY]);

      canvas.width = cells.width = width;
      canvas.height = cells.height = height;
      L.DomUtil.setPosition(canvas, topLeft);

      const coverageRadiusMeters = 100;
      const points = readings.map((reading) => {
        const position = map.latLngToContainerPoint([reading.lat, reading.lng]);
        const latRadians = (reading.lat * Math.PI) / 180;
        const lngOffset = coverageRadiusMeters / (111320 * Math.max(Math.cos(latRadians), 0.01));
        const edge = map.latLngToContainerPoint([reading.lat, reading.lng + lngOffset]);

        return {
          x: position.x + padX,
          y: position.y + padY,
          radius: Math.max(2, Math.abs(edge.x - position.x)),
          dbm: reading.dbm,
        };
      });

      const averageRadius =
        points.reduce((sum, point) => sum + point.radius, 0) / points.length;
      const cellSize = Math.max(2, Math.min(12, Math.round(averageRadius / 7)));

      // Rejilla de celdas: la celda (i, j) está centrada en ((i - 1) * cellSize, (j - 1) * cellSize).
      const cols = Math.ceil(width / cellSize) + 2;
      const rows = Math.ceil(height / cellSize) + 2;
      const weights = new Float64Array(cols * rows);
      const weightedSums = new Float64Array(cols * rows);
      const nearbyByCell: { dbm: number; weight: number }[][] = [];
      const bestSignal = mode === "mejor-señal";

      // Cada lectura solo recorre las celdas que caen dentro de su radio.
      for (const point of points) {
        const iMin = Math.max(0, Math.ceil((point.x - point.radius) / cellSize) + 1);
        const iMax = Math.min(cols - 1, Math.floor((point.x + point.radius) / cellSize) + 1);
        const jMin = Math.max(0, Math.ceil((point.y - point.radius) / cellSize) + 1);
        const jMax = Math.min(rows - 1, Math.floor((point.y + point.radius) / cellSize) + 1);

        for (let j = jMin; j <= jMax; j++) {
          const dy = point.y - (j - 1) * cellSize;
          for (let i = iMin; i <= iMax; i++) {
            const dx = point.x - (i - 1) * cellSize;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > point.radius) continue;

            const pointWeight = Math.pow(1 - distance / point.radius, 2);
            const cell = j * cols + i;
            weights[cell] += pointWeight;
            if (bestSignal) {
              (nearbyByCell[cell] ??= []).push({ dbm: point.dbm, weight: pointWeight });
            } else {
              weightedSums[cell] += point.dbm * pointWeight;
            }
          }
        }
      }

      cellsCtx.clearRect(0, 0, width, height);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const cell = j * cols + i;
          const weight = weights[cell];
          if (weight <= 0) continue;

          let dbm: number;
          if (bestSignal) {
            const nearby = nearbyByCell[cell];
            nearby.sort((a, b) => b.dbm - a.dbm);
            const idx = Math.min(Math.floor(nearby.length * 0.25), nearby.length - 1);
            dbm = nearby[idx].dbm;
          } else {
            dbm = weightedSums[cell] / weight;
          }

          const x = (i - 1) * cellSize;
          const y = (j - 1) * cellSize;
          cellsCtx.globalAlpha = Math.min(0.9, Math.max(0.28, weight / 2.8));
          cellsCtx.fillStyle = interpolateColor(dbm);
          cellsCtx.fillRect(x - cellSize, y - cellSize, cellSize * 2.2, cellSize * 2.2);
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.filter = `blur(${Math.max(1, Math.min(8, averageRadius / 10))}px)`;
      ctx.drawImage(cells, 0, 0);
      ctx.filter = "none";
    };

    // La capa ya se desplaza con el mapa al arrastrar; solo hace falta redibujar al terminar.
    draw();
    map.on("moveend zoomend resize", draw);

    return () => {
      map.off("moveend zoomend resize", draw);
      canvas.remove();
    };
  }, [map, readings, mode]);

  return null;
}

function FitToReadings({ readings }: { readings: Reading[] }) {
  const map = useMap();
  useEffect(() => {
    if (!readings.length) return;

    const bounds = L.latLngBounds(readings.map((r) => [r.lat, r.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.18), { maxZoom: 13, animate: false });
  }, [map, readings]);

  return null;
}

export default function MapView({ readings, mode }: { readings: Reading[]; mode?: string }) {
  const center: [number, number] =
    readings.length > 0
      ? [readings[0].lat, readings[0].lng]
      : [40.0, -3.0];

  const unique = useMemo(() => {
    const map = new Map<string, { lat: number; lng: number; sum: number; count: number }>();
    for (const r of readings) {
      const key = `${r.lat.toFixed(5)},${r.lng.toFixed(5)}`;
      const g = map.get(key) ?? { lat: r.lat, lng: r.lng, sum: 0, count: 0 };
      g.sum += r.dbm;
      g.count++;
      map.set(key, g);
    }
    return Array.from(map.values());
  }, [readings]);

  return (
    <MapContainer
      center={center}
      zoom={6}
      className="h-full w-full"
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CoverageCanvas readings={readings} mode={mode ?? "promedio"} />
      <FitToReadings readings={readings} />
      {unique.map((g) => {
        const avgDbm = g.sum / g.count;
        return (
          <Fragment key={`${g.lat},${g.lng}`}>
            {/* <Marker position={[g.lat, g.lng]} icon={dotIcon(avgDbm)}>
              <Popup>
                <div style={{ minWidth: 160, fontFamily: 'sans-serif' }}>
                  <div style={{ background: getColor(avgDbm), color: 'white', padding: '6px 10px', margin: '-8px -8px 6px -8px', borderRadius: '6px 6px 0 0', fontWeight: 700, fontSize: 13 }}>
                    {Math.round(avgDbm)} dBm
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <tbody>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '3px 8px', color: '#64748b' }}>Lecturas</td>
                        <td style={{ padding: '3px 8px', fontWeight: 600, textAlign: 'right' }}>{g.count}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Popup>
            </Marker> */}
          </Fragment>
        );
      })}
    </MapContainer>
  );
}
