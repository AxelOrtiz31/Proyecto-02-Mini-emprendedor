import Link from "next/link";
import { AlertTriangle, TrendingDown } from "lucide-react";
import type { AlertasEstancados } from "@/lib/admin";

interface StalledAlertsProps {
  alertas: AlertasEstancados;
}

export function StalledAlerts({ alertas }: StalledAlertsProps) {
  const { inactivos, enDificultad } = alertas;

  if (inactivos.length === 0 && enDificultad.length === 0) {
    return (
      <div className="rounded-2xl bg-card p-5 shadow-(--shadow-card)">
        <h2 className="font-display text-lg font-extrabold text-foreground">Alertas</h2>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          🎉 Nadie necesita atención especial ahora mismo — todo el grupo avanza bien.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AlertCard
        icon={<AlertTriangle className="h-5 w-5" />}
        tone="accent"
        titulo="Sin actividad reciente"
        subtitulo="Llevan una semana o más sin completar ninguna lección"
        vacio="Todos han entrado esta semana."
      >
        {inactivos.map((alumno) => (
          <Link
            key={alumno.id}
            href={`/admin/alumnos/${alumno.id}`}
            className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-muted"
          >
            <span className="truncate font-bold text-foreground">{alumno.nombre}</span>
            <span className="shrink-0 text-xs font-bold text-muted-foreground">
              {alumno.diasInactivo === null ? "Nunca ha comenzado" : `${alumno.diasInactivo} días`}
            </span>
          </Link>
        ))}
      </AlertCard>

      <AlertCard
        icon={<TrendingDown className="h-5 w-5" />}
        tone="info"
        titulo="Les está costando trabajo"
        subtitulo="Necesitan varios intentos en promedio para aprobar sus lecciones"
        vacio="Nadie muestra dificultad notable por ahora."
      >
        {enDificultad.map((alumno) => (
          <Link
            key={alumno.id}
            href={`/admin/alumnos/${alumno.id}`}
            className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-muted"
          >
            <span className="truncate font-bold text-foreground">{alumno.nombre}</span>
            <span className="shrink-0 text-xs font-bold text-muted-foreground">
              {alumno.intentosPromedio} intentos/lección
            </span>
          </Link>
        ))}
      </AlertCard>
    </div>
  );
}

interface AlertCardProps {
  icon: React.ReactNode;
  tone: "accent" | "info";
  titulo: string;
  subtitulo: string;
  vacio: string;
  children: React.ReactNode[];
}

function AlertCard({ icon, tone, titulo, subtitulo, vacio, children }: AlertCardProps) {
  const toneClass = tone === "accent" ? "bg-accent/25 text-accent-foreground" : "bg-info/10 text-info";

  return (
    <div className="rounded-2xl bg-card p-5 shadow-(--shadow-card)">
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneClass}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-base font-extrabold text-foreground">{titulo}</h2>
          <p className="truncate text-xs font-semibold text-muted-foreground">{subtitulo}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        {children.length === 0 ? (
          <p className="px-3 py-2 text-sm font-semibold text-muted-foreground">{vacio}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
