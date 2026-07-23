"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminSidebar, ADMIN_NAV, esRutaActiva } from "./AdminSidebar";
import { LogoutButton } from "./LogoutButton";
import { MusicToggle } from "./MusicToggle";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background lg:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        {/* Encabezado y navegación para móvil (la barra lateral se oculta). */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/admin" className="flex items-center gap-2">
              <img src="/caelus.svg" alt="EmprendeKids" width={32} height={32} className="h-8 w-8" />
              <span className="font-display text-base font-extrabold">
                <span className="text-foreground">Panel</span>{" "}
                <span className="text-primary">Maestra</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <MusicToggle />
              <LogoutButton />
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
            {ADMIN_NAV.map((item) => {
              const activo = esRutaActiva(pathname, item.href, item.exact);
              const Icono = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors",
                    activo
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icono className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
