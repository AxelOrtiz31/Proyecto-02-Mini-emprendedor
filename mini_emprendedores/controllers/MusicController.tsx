"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { playMusic } from "@/audio/AudioManager";

export default function MusicController() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      playMusic("home");
      return;
    }

    if (pathname.startsWith("/login")) {
      playMusic("home");
      return;
    }

    if (pathname.startsWith("/dashboard")) {
      playMusic("dashboard");
      return;
    }

    if (pathname.startsWith("/modules01_06_complete")) {
      playMusic("levels");
      return;
    }

    if (pathname.startsWith("/final_exam")) {
      playMusic("final_exam");
      return;
    }

  }, [pathname]);

  return null;
}