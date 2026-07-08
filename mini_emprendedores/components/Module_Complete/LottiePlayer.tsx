"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import { cn } from "@/lib/utils";

interface LottiePlayerProps {
  path: string;
  loop?: boolean;
  className?: string;
  speed?: number;
}

// Reproductor de animaciones Lottie usado solo en el Módulo de Completado.
// Carga lottie-web de forma diferida y limpia la animación al desmontar.
export function LottiePlayer({ path, loop = true, className }: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !containerRef.current) return;
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop,
        autoplay: true,
        path,
      });
    });

    return () => {
      cancelled = true;
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [path, loop]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} aria-hidden="true" />
  );
}
