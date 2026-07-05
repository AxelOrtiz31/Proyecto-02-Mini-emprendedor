"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import { cn } from "@/lib/utils";

interface PathRobotProps {
  path: string;
  className?: string;
}

export function PathRobot({ path, className }: PathRobotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !containerRef.current) return;
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path,
      });
    });

    return () => {
      cancelled = true;
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [path]);

  function handleReplay() {
    animationRef.current?.goToAndPlay(0, true);
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleReplay}
      className={cn("pointer-events-auto", className)}
      aria-hidden="true"
    />
  );
}
