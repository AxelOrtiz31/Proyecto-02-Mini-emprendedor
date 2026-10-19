"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppLogo } from "@/components/shared/AppLogo";
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
              <AppLogo className="h-10" />
              {/* En celular no cabe junto al logo y los botones; el título de cada página ya dice dónde estás. */}
              <span className="hidden font-display text-base font-extrabold sm:inline">
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
