"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ClipboardList, Award, FileBarChart, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";
import { MusicToggle } from "./MusicToggle";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact: boolean;
}

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/admin/alumnos", label: "Alumnos", icon: Users, exact: false },
  { href: "/admin/evaluaciones", label: "Evaluaciones", icon: ClipboardList, exact: false },
  { href: "/admin/insignias", label: "Insignias", icon: Award, exact: false },
  { href: "/admin/reportes", label: "Reportes", icon: FileBarChart, exact: false },
];

export function esRutaActiva(pathname: string, href: string, exact: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
      <Link href="/admin" className="mb-8 flex items-center gap-2 px-2">
        <img src="/caelus.svg" alt="EmprendeKids" width={36} height={36} className="h-9 w-9" />
        <span className="font-display text-lg font-extrabold leading-tight">
          <span className="text-foreground">Emprende</span>
          <span className="text-primary">Kids</span>
          <span className="block text-xs font-bold text-muted-foreground">Panel de la maestra</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {ADMIN_NAV.map((item) => {
          const activo = esRutaActiva(pathname, item.href, item.exact);
          const Icono = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 font-bold transition-colors",
                activo
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icono className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex gap-2">
        <MusicToggle />
        <LogoutButton className="flex-1 justify-center" />
      </div>
    </aside>
  );
}
