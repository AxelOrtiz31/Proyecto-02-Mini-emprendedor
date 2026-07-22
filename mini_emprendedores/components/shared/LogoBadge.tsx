const CLIP_PATHS: Record<string, string> = {
  circulo: "circle(50% at 50% 50%)",
  cuadrado: "inset(0% round 18%)",
  escudo: "polygon(50% 0%, 100% 15%, 100% 55%, 50% 100%, 0% 55%, 0% 15%)",
};

interface LogoBadgeProps {
  icono: string;
  color: string;
  formaId: string;
  size?: number;
  className?: string;
}

// Dibuja el logo del negocio (ícono + forma + color) de forma consistente
// en todas las pantallas donde aparece. La nube se arma con círculos reales
// en vez de aproximarla con border-radius, que nunca se veía como una nube.
export function LogoBadge({ icono, color, formaId, size = 112, className = "" }: LogoBadgeProps) {
  if (formaId === "nube") {
    return (
      <div
        className={`relative shrink-0 ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="false"
      >
        <span
          className="absolute rounded-full"
          style={{ backgroundColor: color, width: size * 0.55, height: size * 0.55, left: size * 0.06, top: size * 0.32 }}
        />
        <span
          className="absolute rounded-full"
          style={{ backgroundColor: color, width: size * 0.62, height: size * 0.62, left: size * 0.32, top: size * 0.05 }}
        />
        <span
          className="absolute rounded-full"
          style={{ backgroundColor: color, width: size * 0.5, height: size * 0.5, left: size * 0.58, top: size * 0.3 }}
        />
        <span
          className="absolute rounded-full"
          style={{ backgroundColor: color, width: size * 0.9, height: size * 0.4, left: size * 0.05, top: size * 0.48 }}
        />
        <span
          className="absolute inset-0 grid place-items-center"
          style={{ fontSize: size * 0.36 }}
        >
          {icono}
        </span>
      </div>
    );
  }

  const clipPath = CLIP_PATHS[formaId] ?? CLIP_PATHS.circulo;

  return (
    <div
      className={`grid shrink-0 place-items-center border-4 border-border shadow-(--shadow-node) ${className}`}
      style={{ width: size, height: size, backgroundColor: color, clipPath }}
    >
      <span style={{ fontSize: size * 0.4 }}>{icono}</span>
    </div>
  );
}
