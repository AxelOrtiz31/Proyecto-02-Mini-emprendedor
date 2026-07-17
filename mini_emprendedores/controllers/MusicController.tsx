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

    if (pathname.startsWith("/modules01_06_complete/module01")) {
      playMusic("levels");
      return;
    }

    if (pathname.startsWith("/modules01_06_complete/module02")) {
      playMusic("levels");
      return;
    }

    if (pathname.startsWith("/modules01_06_complete/module03")) {
      playMusic("levels");
      return;
    }

    if (pathname.startsWith("/modules01_06_complete/module04")) {
      playMusic("levels");
      return;
    }

    if (pathname.startsWith("/modules01_06_complete/module05")) {
      playMusic("levels");
      return;
    }

    if (pathname.startsWith("/modules01_06_complete/module06")) {
      playMusic("levels");
      return;
    }

    if (pathname.startsWith("/modules01_06_complete/module07")) {
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

    if (pathname.startsWith("/modules01_06_complete/modulecomplete")) {
      playMusic("module_complete");
      return;
    }

  }, [pathname]);

  return null;
}