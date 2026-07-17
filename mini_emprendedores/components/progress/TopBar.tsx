"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Star, Zap, LogOut, User, Trophy, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { StatPill } from "./StatPill";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChatModal } from "@/components/IA_Bot/ChatModal";
import { StreakModal } from "@/components/streak/StreakModal";
import { toggleMusic, isMusicMuted } from "@/audio/AudioManager";

interface TopBarProps {
  streak: number;
  ideas: number;
  xp: number;
  // Fechas de las lecciones completadas, para el calendario del modal de racha.
  timestamps: string[];
}

export function TopBar({ streak, estrellas, xp, timestamps }: TopBarProps) {
  const router = useRouter();
  const [cerrando, setCerrando] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [streakOpen, setStreakOpen] = useState(false);
  const [muted, setMuted] = useState(isMusicMuted());

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

            <span className="hidden font-display text-xl font-extrabold sm:inline-block">
              <span className="text-foreground">Emprende</span>
              <span className="text-primary">Kids</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <StatPill
              icon={Flame}
              value={streak}
              label="Racha"
              tone="primary"
              onClick={() => setStreakOpen(true)}
              title="Ver tu racha"
            />
            <StatPill icon={Star} value={estrellas} label="Estrellas" tone="accent" />
            <StatPill icon={Zap} value={xp} label="XP" tone="info" />
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
            <button
              type="button"
              onClick={() => {
                toggleMusic();
                setMuted(isMusicMuted());
              }}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title={muted ? "Activar música" : "Silenciar música"}
            >
              {muted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
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
      </header>
      {/* Los modales van fuera del header: su backdrop-blur recortaría cualquier
          position: fixed anidado a la franja de la barra. */}
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
      {streakOpen && (
        <StreakModal
          streak={streak}
          timestamps={timestamps}
          onClose={() => setStreakOpen(false)}
        />
      )}
    </>
  );
}
