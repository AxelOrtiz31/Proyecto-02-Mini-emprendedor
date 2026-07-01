"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Lightbulb, Star, LogOut, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface TopBarProps {
  streak: number;
  ideas: number;
  xp: number;
}

export function TopBar({ streak, ideas, xp }: TopBarProps) {
  const router = useRouter();
  const [cerrando, setCerrando] = useState(false);

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
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex items-center gap-2">
          <img
            src="/caelus.svg"
            alt="MiniEmpre"
            width={36}
            height={36}
            className="h-9 w-9"
          />

          <span className="font-display text-xl font-extrabold">
            <span className="text-foreground">Mini</span>
            <span className="text-primary">Empre</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <StatPill icon={Flame} value={streak} label="Racha" tone="primary" />
          <StatPill icon={Lightbulb} value={ideas} label="Ideas" tone="accent" />
          <StatPill icon={Star} value={xp} label="XP" tone="info" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-sm font-extrabold text-primary-foreground shadow-sm">
            LM
          </div>

          <button
            type="button"
            onClick={handleCerrarSesion}
            disabled={cerrando}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {cerrando ? "Cerrando..." : "Cerrar sesión"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

const toneText: Record<string, string> = {
  primary: "text-primary",
  accent: "text-accent",
  info: "text-info",
};

function StatPill({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  tone: "primary" | "accent" | "info";
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
      <Icon
        className={cn("h-4 w-4 fill-current", toneText[tone])}
        strokeWidth={2.4}
      />

      <span className="font-display text-sm font-extrabold text-foreground">
        {value}
      </span>

      <span className="hidden text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:inline">
        {label}
      </span>
    </div>
  );
}