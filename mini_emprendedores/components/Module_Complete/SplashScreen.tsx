interface SplashScreenProps {
  title: string;
  mascotSrc: string;
}

export function SplashScreen({ title, mascotSrc }: SplashScreenProps) {
  return (
    <section className="absolute inset-0 z-20 flex animate-fade-out flex-col items-center justify-center">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-36 w-[140vw] animate-swoosh-in bg-linear-to-r from-primary via-accent to-primary opacity-90 sm:h-44"
      />
      <img
        src={mascotSrc}
        alt=""
        width={144}
        height={144}
        className="relative z-10 h-32 w-32 animate-mascot-pop sm:h-36 sm:w-36"
      />
      <h1 className="relative z-10 mt-4 max-w-sm animate-title-rise px-6 text-center font-display text-4xl font-extrabold text-foreground sm:text-5xl">
        {title}
      </h1>
    </section>
  );
}
