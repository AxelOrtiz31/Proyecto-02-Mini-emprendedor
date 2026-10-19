"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Star, Zap, LogOut, User, Trophy, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { StatPill } from "./StatPill";
import { StudentAvatar } from "./StudentAvatar";
import { TopBarMenu } from "./TopBarMenu";
import { AppLogo } from "@/components/shared/AppLogo";
import { supabase } from "@/lib/supabase";
import { fetchStudentAvatarUrl } from "@/lib/onboarding";
import Link from "next/link";
import { ChatModal } from "@/components/IA_Bot/ChatModal";
import { StreakModal } from "@/components/streak/StreakModal";
import { toggleMusic, isMusicMuted } from "@/audio/AudioManager";

interface TopBarProps {
  streak: number;
  estrellas: number;
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentAvatarUrl().then(setAvatarUrl);
  }, []);

  async function handleCerrarSesion() {
    setCerrando(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error.message);
      setCerrando(false);
      return;
    }

    // replace: tras cerrar sesión, "atrás" no debe volver al camino.
    router.replace("/login");
    router.refresh();
  }

  function handleToggleMusic() {
    toggleMusic();
    setMuted(isMusicMuted());
  }

  return (
    <>
      {/* La altura (--topbar-h, en globals.css) es fija porque los elementos
          "sticky" de CaminoView y las barras laterales se miden a partir de ella. */}
      <header className="sticky top-0 z-40 h-(--topbar-h) border-b border-border bg-card/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-1 px-2 sm:gap-4 sm:px-4 md:px-8 xl:max-w-360">
          {/* En celular la barra va justa: el logo se encoge (sin bajar de 36 px) en vez de desbordarla. */}
          <AppLogo className="h-8 min-w-9 shrink sm:h-14" />

          <div className="flex items-center gap-1 sm:gap-3">
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

          {/* Perfil y Logros: sueltos solo en escritorio; en móvil van en el menú. */}
          <div className="hidden items-center gap-2 lg:flex">
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
          </div>

          {/* Chat y música: siempre visibles, también en móvil. */}
          <div className="flex items-center gap-1 sm:gap-2">
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
              onClick={handleToggleMusic}
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

          {/* Menú compacto: en móvil agrupa Perfil, Logros y Cerrar sesión para
              que la barra no se desborde. En escritorio se oculta. */}
          <div className="lg:hidden">
            <TopBarMenu cerrando={cerrando} onCerrarSesion={handleCerrarSesion} />
          </div>

          <div className="hidden items-center gap-2 sm:gap-3 lg:flex">
            <StudentAvatar imageUrl={avatarUrl} />

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
