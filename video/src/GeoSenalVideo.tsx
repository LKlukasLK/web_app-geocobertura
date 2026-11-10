import { loadFont } from "@remotion/fonts";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Geist es una fuente variable: un archivo por juego de caracteres cubre todos los pesos.
const fontFamily = "Geist";
loadFont({ family: fontFamily, url: staticFile("geist-latin.woff2"), weight: "100 900" });
loadFont({ family: fontFamily, url: staticFile("geist-latin-ext.woff2"), weight: "100 900" });

const C = {
  bg: "#022c22",
  bgSoft: "#064e3b",
  accent: "#34d399",
  light: "#f6f7f9",
  ink: "#0f172a",
  muted: "rgba(255,255,255,0.7)",
};

// Misma escala de color que la leyenda de la app, de peor a mejor señal.
const SIGNAL = ["#ff2ba6", "#ff1414", "#ff8a00", "#ffd21f", "#d7f21f", "#32d74b"];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const T = 15; // duración de cada transición, en frames

export const GeoSenalVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: C.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Intro" durationInFrames={90}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence name="Pregunta" durationInFrames={105}>
          <Pregunta />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence name="Movil" durationInFrames={150}>
          <Movil />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence name="Mapa" durationInFrames={165}>
          <Mapa />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence name="Web" durationInFrames={150}>
          <Web />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence name="Cierre" durationInFrames={105}>
          <Cierre />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// ---------- Piezas comunes ----------

const Fondo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 85% 0%, rgba(16,185,129,0.35), transparent 60%), radial-gradient(ellipse at 0% 100%, rgba(34,211,238,0.16), transparent 55%), ${C.bg}`,
      color: "white",
    }}
  >
    {children}
  </AbsoluteFill>
);

const Aparece: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...style,
        opacity: interpolate(frame, [delay, delay + 18], [0, 1], clamp),
        translate: `0 ${interpolate(frame, [delay, delay + 24], [40, 0], { ...clamp, easing: ease })}px`,
      }}
    >
      {children}
    </div>
  );
};

const EscalaSenal: React.FC<{ delay?: number; width: number }> = ({ delay = 0, width }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 30], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ width }}>
      <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", width: `${progress * 100}%` }}>
        {SIGNAL.map((c) => (
          <div key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 12,
          fontSize: 28,
          color: "rgba(255,255,255,0.55)",
          opacity: progress,
        }}
      >
        <span>-110 dBm</span>
        <span>-70 dBm</span>
      </div>
    </div>
  );
};

const Paso: React.FC<{ n: number; titulo: string; texto: string; dark?: boolean }> = ({ n, titulo, texto, dark }) => (
  <>
    <Aparece>
      <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4, color: dark ? "#047857" : C.accent }}>
        PASO {n}
      </div>
    </Aparece>
    <Aparece delay={6}>
      <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, marginTop: 18 }}>{titulo}</div>
    </Aparece>
    <Aparece delay={14}>
      <div style={{ fontSize: 44, lineHeight: 1.35, marginTop: 28, color: dark ? "#475569" : C.muted }}>{texto}</div>
    </Aparece>
  </>
);

// ---------- Escenas ----------

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14 } });
  return (
    <Fondo>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Img
          src={staticFile("descarga.png")}
          style={{ width: 200, height: 200, borderRadius: 44, scale: String(pop), boxShadow: "0 30px 80px rgba(0,0,0,0.4)" }}
        />
        <Aparece delay={12}>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -4, marginTop: 40 }}>GeoSeñal</div>
        </Aparece>
        <Aparece delay={22}>
          <div style={{ fontSize: 52, color: C.muted, marginTop: 4 }}>La cobertura móvil, en un mapa</div>
        </Aparece>
      </AbsoluteFill>
    </Fondo>
  );
};

const Pregunta: React.FC = () => {
  const frame = useCurrentFrame();
  // Las barras de cobertura se van apagando una a una.
  const lit = Math.round(interpolate(frame, [25, 85], [4, 1], clamp));
  const color = SIGNAL[Math.max(0, lit + 1)];
  return (
    <Fondo>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 160px", gap: 120 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 22, height: 320 }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: 64,
                height: 70 * i + 40,
                borderRadius: 14,
                background: i <= lit ? color : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <Aparece>
            <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
              ¿Habrá señal
              <br />
              <span style={{ color: C.accent }}>cuando llegues?</span>
            </div>
          </Aparece>
          <Aparece delay={20}>
            <div style={{ fontSize: 48, color: C.muted, marginTop: 36 }}>
              Ahora puedes saberlo antes de ir.
            </div>
          </Aparece>
        </div>
      </AbsoluteFill>
    </Fondo>
  );
};

const Movil: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 8, fps, config: { damping: 18 } });
  return (
    <Fondo>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 160px", gap: 100 }}>
        <div style={{ flex: 1 }}>
          <Paso n={1} titulo="Recoge lecturas con el móvil" texto="Cada medición guarda la posición y la intensidad de la señal en dBm." />
        </div>
        <div
          style={{
            height: 940,
            aspectRatio: "945 / 2048",
            borderRadius: 64,
            padding: 14,
            background: "#0b1512",
            border: "2px solid rgba(255,255,255,0.15)",
            boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 0 120px rgba(16,185,129,0.25)",
            translate: `0 ${interpolate(enter, [0, 1], [1100, 0])}px`,
            rotate: `${interpolate(enter, [0, 1], [8, 0])}deg`,
          }}
        >
          <Img
            src={staticFile("cap-app.jpeg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 52 }}
          />
        </div>
      </AbsoluteFill>
    </Fondo>
  );
};

// Lecturas ilustrativas a lo largo de tres "calles" del mapa dibujado.
const CALLES: { from: [number, number]; to: [number, number] }[] = [
  { from: [-40, 760], to: [1960, 360] },
  { from: [620, -40], to: [1180, 1120] },
  { from: [1380, -40], to: [1560, 1120] },
];
const PUNTOS = CALLES.flatMap((c, ci) =>
  Array.from({ length: 22 }, (_, i) => {
    const t = i / 21;
    // Ondas suaves para que la señal cambie a lo largo de la calle.
    const q = (Math.sin(i * 0.55 + ci * 2.1) + 1) / 2;
    return {
      x: c.from[0] + (c.to[0] - c.from[0]) * t,
      y: c.from[1] + (c.to[1] - c.from[1]) * t,
      color: SIGNAL[Math.min(5, Math.floor(q * 6))],
      order: ci * 6 + i,
    };
  }),
);

const Mapa: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 165], [1.08, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#eef1ec" }}>
      <AbsoluteFill style={{ scale: String(zoom) }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {/* Manzanas y zonas verdes */}
          <rect x={80} y={80} width={420} height={300} rx={20} fill="#e2e6df" />
          <rect x={760} y={120} width={500} height={260} rx={20} fill="#e2e6df" />
          <rect x={200} y={860} width={520} height={200} rx={20} fill="#cfe8c9" />
          <rect x={1620} y={520} width={260} height={420} rx={20} fill="#cfe8c9" />
          <rect x={860} y={760} width={400} height={240} rx={20} fill="#e2e6df" />
          {/* Calles secundarias */}
          {[[0, 470, 1920, 300], [0, 980, 1920, 640], [300, 0, 420, 1080], [1700, 0, 1820, 1080]].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={22} strokeLinecap="round" />
          ))}
          {/* Calles principales */}
          {CALLES.map((c, i) => (
            <line key={i} x1={c.from[0]} y1={c.from[1]} x2={c.to[0]} y2={c.to[1]} stroke={i === 0 ? "#f6f3b5" : "white"} strokeWidth={46} strokeLinecap="round" />
          ))}
        </svg>
        <AbsoluteFill style={{ filter: "blur(14px)", mixBlendMode: "multiply", opacity: 0.85 }}>
          {PUNTOS.map((p, i) => {
            const start = 10 + p.order * 2.2;
            const s = interpolate(frame, [start, start + 14], [0, 1], { ...clamp, easing: ease });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: p.x - 55,
                  top: p.y - 55,
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  background: p.color,
                  scale: String(s),
                }}
              />
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 100,
          width: 820,
          padding: "56px 64px",
          borderRadius: 36,
          background: "rgba(255,255,255,0.94)",
          boxShadow: "0 30px 80px rgba(15,23,42,0.18)",
          color: C.ink,
        }}
      >
        <Paso n={2} titulo="Mira la cobertura en el mapa" texto="Verde: buena señal. Rosa: casi nada." dark />
      </div>
    </AbsoluteFill>
  );
};

const Web: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 6, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ backgroundColor: C.light, color: C.ink, alignItems: "center", paddingTop: 150 }}>
      <Aparece>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4, color: "#047857", textAlign: "center" }}>PASO 3</div>
      </Aparece>
      <Aparece delay={6}>
        <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -2, marginTop: 14, textAlign: "center" }}>
          Filtra y consulta las estadísticas
        </div>
      </Aparece>
      <div
        style={{
          marginTop: 70,
          width: 1600,
          height: 52 + 420,
          borderRadius: 28,
          overflow: "hidden",
          background: "white",
          boxShadow: "0 40px 120px rgba(15,23,42,0.22)",
          border: "1px solid #e2e8f0",
          translate: `0 ${interpolate(enter, [0, 1], [700, 0])}px`,
        }}
      >
        <div style={{ height: 52, background: "#e2e8f0", display: "flex", alignItems: "center", gap: 12, paddingLeft: 24 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
          ))}
        </div>
        <Img
          src={staticFile("web-geoapp.png")}
          style={{
            width: 1600,
            display: "block",
            scale: String(interpolate(frame, [20, 150], [1, 1.08], clamp)),
            transformOrigin: "50% 20%",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14 } });
  return (
    <Fondo>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <Img src={staticFile("descarga.png")} style={{ width: 150, height: 150, borderRadius: 34, scale: String(pop) }} />
        <Aparece delay={8}>
          <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -3, marginTop: 36, lineHeight: 1.05 }}>
            Mira dónde hay señal
            <br />
            <span style={{ color: C.accent }}>antes de llegar</span>
          </div>
        </Aparece>
        <Aparece delay={20} style={{ marginTop: 60 }}>
          <EscalaSenal delay={20} width={640} />
        </Aparece>
        <Aparece delay={30}>
          <div style={{ fontSize: 48, fontWeight: 500, marginTop: 50, color: C.muted }}>GeoSeñal</div>
        </Aparece>
      </AbsoluteFill>
    </Fondo>
  );
};
