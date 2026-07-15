"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Lightbulb, Star, LogOut } from "lucide-react";
import { StatPill } from "./StatPill";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { User, Trophy, MessageCircle } from "lucide-react";
import { ChatModal } from "@/components/IA_Bot/ChatModal";

import { speechTexts } from "@/audio/SpeechTexts";
import { SpeakButton } from "@/components/SpeakButtonController";

interface TopBarProps {
  streak: number;
  ideas: number;
  xp: number;
}

export function TopBar({ streak, ideas, xp }: TopBarProps) {
  const router = useRouter();
  const [cerrando, setCerrando] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  async function handleCerrarSesion() {
    setCerrando(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error.message);
      setCerrando(false);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 md:px-8 xl:max-w-360">
        <div className="flex items-center gap-2">
          <img
            src="/caelus.svg"
            alt="EmprendeKids"
            width={36}
            height={36}
            className="h-9 w-9"
          />

          <span className="hidden font-display text-xl font-extrabold sm:inline-block">
            <span className="text-foreground">Emprende</span>
            <span className="text-primary">Kids</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <StatPill icon={Flame} value={streak} label="Racha" tone="primary" />
          <StatPill icon={Lightbulb} value={ideas} label="Ideas" tone="accent" />
          <StatPill icon={Star} value={xp} label="XP" tone="info" />
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {/* Botones de navegación */}
          <Link
            href="/profile"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Perfil"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/achievements"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Logros"
          >
            <Trophy className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Chatbot"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
          <SpeakButton text={speechTexts.dashboard} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-sm font-extrabold text-primary-foreground shadow-sm">
            LM
          </div>

          <button
            type="button"
            onClick={handleCerrarSesion}
            disabled={cerrando}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-bold text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {cerrando ? "Cerrando..." : "Cerrar sesión"}
            </span>
          </button>
        </div>
      </div>
    </header>
    <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
