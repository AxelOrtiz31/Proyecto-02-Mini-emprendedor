"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, MoreVertical, Trophy, User } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface TopBarMenuProps {
  cerrando: boolean;
  onCerrarSesion: () => void;
}

// Menú compacto para móvil y tablet: agrupa las acciones que en escritorio van
// sueltas en la barra, para que la cabecera no se desborde en pantallas angostas.
export function TopBarMenu({ cerrando, onCerrarSesion }: TopBarMenuProps) {
  const [open, setOpen] = useState(false);

  function runAndClose(action: () => void) {
    action();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Más opciones"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-56 p-2">
        <Link href="/profile" onClick={() => setOpen(false)} className={itemClass}>
          <User className="h-5 w-5" />
          Perfil
        </Link>

        <Link href="/achievements" onClick={() => setOpen(false)} className={itemClass}>
          <Trophy className="h-5 w-5" />
          Logros
        </Link>

        <div className="my-1 h-px bg-border" />

        <button
          type="button"
          onClick={() => runAndClose(onCerrarSesion)}
          disabled={cerrando}
          className={itemClass}
        >
          <LogOut className="h-5 w-5" />
          {cerrando ? "Cerrando..." : "Cerrar sesión"}
        </button>
      </PopoverContent>
    </Popover>
  );
}

const itemClass =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60";
