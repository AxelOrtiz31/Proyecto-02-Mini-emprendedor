"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

interface PathRobotProps {
  path: string;
  className?: string;
}

export function PathRobot({ path, className }: PathRobotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: AnimationItem | undefined;
    let cancelled = false;

    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !containerRef.current) return;
      animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path,
      });
    });

    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, [path]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
