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

    if (pathname.startsWith("/evaluacion")) {
      playMusic("evaluacion");
      return;
    }

    if (pathname.startsWith("/evaluation")) {
      playMusic("evaluacion");
      return;
    }

    if (pathname.startsWith("/profile")) {
      playMusic("profile");
      return;
    }

    if (pathname.startsWith("/achievements")) {
      playMusic("achievements");
      return;
    }

    if (pathname.startsWith("/modulecomplete")) {
      playMusic("module_complete");
      return;
    }

  }, [pathname]);

  return null;
}