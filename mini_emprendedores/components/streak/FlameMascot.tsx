import { LottiePlayer } from "@/components/Module_Complete/LottiePlayer";

// Destinos fijos de las chispas, sin azar: así el servidor y el cliente
// dibujan siempre lo mismo.
const SPARKS = [
  { dx: "-120px", dy: "-40px" },
  { dx: "130px", dy: "-60px" },
  { dx: "-140px", dy: "60px" },
  { dx: "120px", dy: "80px" },
  { dx: "-10px", dy: "-130px" },
  { dx: "40px", dy: "150px" },
];

interface FlameMascotProps {
  mascotSrc: string;
}

export function FlameMascot({ mascotSrc }: FlameMascotProps) {
  return (
    <div className="relative">
      {/* El pop de entrada y el flotar continuo van en elementos anidados: en uno
          solo, la segunda animación pisaría a la primera. */}
      <div className="animate-mascot-pop">
        <div className="h-44 w-44 animate-mascot sm:h-60 sm:w-60">
          <LottiePlayer path={mascotSrc} className="h-full w-full" />
        </div>
      </div>

      {SPARKS.map((spark, index) => (
        <span
          key={spark.dx + spark.dy}
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 animate-spark rounded-full bg-card/90"
          style={
            {
              "--dx": spark.dx,
              "--dy": spark.dy,
              animationDelay: `${0.2 + index * 0.15}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
