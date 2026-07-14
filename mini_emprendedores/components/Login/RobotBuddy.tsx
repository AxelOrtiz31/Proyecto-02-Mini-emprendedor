"use client";

// Robot del login, estilo kawaii (referencia del usuario): cabeza grande y
// redonda, visor azul marino con ojitos felices en cian, orejas laterales con
// aletas, panza cian y bracitos tipo aleta, todo con contorno grueso navy.
// Tres estados:
// - "idle":  flota y saluda con la aleta derecha.
// - "point": apunta hacia el formulario (foco en el correo).
// - "peek":  estira la aleta izquierda y se tapa un ojo (contraseña).

export type RobotMood = "idle" | "point" | "peek";

interface RobotBuddyProps {
  mood: RobotMood;
  className?: string;
}

// Paleta del robot (identidad propia, como en la referencia).
const NAVY = "#232878";
const VISOR = "#151A5C";
const CYAN = "#29C4F6";
const CYAN_DARK = "#0AA4E0";
const WHITE = "#FFFFFF";

export function RobotBuddy({ mood, className }: RobotBuddyProps) {
  return (
    <div className={className} data-mood={mood} aria-hidden="true">
      <style>{`
        .rb-float { animation: rb-float 3.2s ease-in-out infinite; }
        @keyframes rb-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        .rb-armL, .rb-armR {
          transform-box: fill-box;
          transform-origin: 50% 4%;
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .rb-head {
          transform-box: fill-box;
          transform-origin: 50% 92%;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .rb-eyeL, .rb-eyeR {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.35s ease;
        }
        [data-mood="idle"] .rb-armR { animation: rb-wave 1.8s ease-in-out infinite; }
        @keyframes rb-wave {
          0%, 100% { transform: rotate(-145deg); }
          50% { transform: rotate(-175deg); }
        }
        [data-mood="point"] .rb-armR { transform: rotate(-100deg); }
        [data-mood="point"] .rb-head { transform: rotate(4deg); }
        [data-mood="point"] .rb-eyeL,
        [data-mood="point"] .rb-eyeR { transform: translateX(6px); }
        [data-mood="peek"] .rb-armL { transform: rotate(-159deg) scale(1.5); }
        [data-mood="peek"] .rb-eyeL { transform: scaleY(0.15); }
        [data-mood="peek"] .rb-head { transform: rotate(-4deg); }
        @media (prefers-reduced-motion: reduce) {
          .rb-float, [data-mood="idle"] .rb-armR { animation: none; }
        }
      `}</style>

      <div className="rb-float">
        <svg viewBox="0 0 220 232" className="h-full w-full" role="presentation">
          {/* Sombra en el piso */}
          <ellipse cx="110" cy="224" rx="46" ry="7" fill={NAVY} opacity="0.12" />

          {/* Cuerpo pequeño (queda detrás de la cabeza) */}
          <rect
            x="61"
            y="146"
            width="98"
            height="70"
            rx="32"
            fill={WHITE}
            stroke={NAVY}
            strokeWidth="6"
          />
          {/* Panza cian */}
          <path
            d="M82 172 Q110 160 138 172 Q142 196 110 206 Q78 196 82 172 Z"
            fill={CYAN}
            stroke={NAVY}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d="M88 192 Q110 202 132 192 Q126 202 110 205 Q94 202 88 192 Z"
            fill={CYAN_DARK}
            opacity="0.85"
          />

          {/* Cabeza grande con orejas, aletas y visor */}
          <g className="rb-head">
            {/* Asa superior */}
            <rect x="84" y="6" width="52" height="24" rx="12" fill={WHITE} stroke={NAVY} strokeWidth="6" />
            {/* Aletas cian de las orejas */}
            <path d="M30 78 L40 46 L50 76 Z" fill={CYAN} stroke={NAVY} strokeWidth="5" strokeLinejoin="round" />
            <path d="M170 76 L180 46 L190 78 Z" fill={CYAN} stroke={NAVY} strokeWidth="5" strokeLinejoin="round" />
            {/* Orejas laterales */}
            <ellipse cx="34" cy="100" rx="15" ry="27" fill={WHITE} stroke={NAVY} strokeWidth="6" />
            <ellipse cx="186" cy="100" rx="15" ry="27" fill={WHITE} stroke={NAVY} strokeWidth="6" />
            {/* Cabeza */}
            <ellipse cx="110" cy="98" rx="76" ry="72" fill={WHITE} stroke={NAVY} strokeWidth="6" />
            {/* Visor */}
            <path
              d="M110 34 Q168 34 168 96 Q168 126 148 136 Q129 128 110 136 Q91 128 72 136 Q52 126 52 96 Q52 34 110 34 Z"
              fill={VISOR}
              stroke={NAVY}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Brillo del visor */}
            <path d="M70 58 Q84 40 110 40 Q136 40 150 58 Q128 48 110 48 Q92 48 70 58 Z" fill={WHITE} opacity="0.12" />
            {/* Ojitos felices ^ ^ */}
            <path
              className="rb-eyeL"
              d="M72 98 Q86 82 100 98"
              fill="none"
              stroke={CYAN}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              className="rb-eyeR"
              d="M120 98 Q134 82 148 98"
              fill="none"
              stroke={CYAN}
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>

          {/* Aleta izquierda (se estira y tapa el ojo en "peek") */}
          <g className="rb-armL">
            <ellipse
              cx="61"
              cy="180"
              rx="12"
              ry="25"
              fill={WHITE}
              stroke={NAVY}
              strokeWidth="6"
            />
          </g>

          {/* Aleta derecha (saluda y apunta) */}
          <g className="rb-armR">
            <ellipse
              cx="159"
              cy="180"
              rx="12"
              ry="25"
              fill={WHITE}
              stroke={NAVY}
              strokeWidth="6"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
