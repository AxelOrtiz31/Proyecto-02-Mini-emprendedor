import { LottiePlayer } from "./LottiePlayer";

interface SplashScreenProps {
  title: string;
  glowSrc: string;
  successSrc: string;
}

export function SplashScreen({ title, glowSrc, successSrc }: SplashScreenProps) {
  return (
    <section className="absolute inset-0 z-20 flex animate-fade-out flex-col items-center justify-center">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-36 w-[140vw] animate-swoosh-in bg-linear-to-r from-primary via-accent to-primary opacity-90 sm:h-44"
      />
      <div className="relative z-10 grid h-64 w-64 animate-mascot-pop place-items-center sm:h-72 sm:w-72">
        {/* Capa de abajo: luz brillante, un poco más grande. */}
        <LottiePlayer path={glowSrc} speed={0.7} className="col-start-1 row-start-1 h-full w-full" />
        {/* Capa de arriba: palomita de éxito, encima y más pequeña. */}
        <LottiePlayer
          path={successSrc}
          speed={0.5}
          className="col-start-1 row-start-1 h-44 w-44 sm:h-52 sm:w-52"
        />
      </div>
      <h1 className="relative z-10 mt-4 max-w-sm animate-title-rise px-6 text-center font-display text-4xl font-extrabold text-foreground sm:text-5xl">
        {title}
      </h1>
    </section>
  );
}
