import { cn } from "@/lib/utils";
import type { ModuloAvance } from "@/lib/admin";

export function ProgressByModule({ modulos }: { modulos: ModuloAvance[] }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-(--shadow-card)">
      <h2 className="font-display text-lg font-extrabold text-foreground">Avance por módulo</h2>

      <div className="mt-4 space-y-3">
        {modulos.map((modulo) => {
          const porcentaje = modulo.total > 0 ? Math.round((modulo.completadas / modulo.total) * 100) : 0;
          const completo = modulo.total > 0 && modulo.completadas === modulo.total;

          return (
            <div key={modulo.modulo}>
              <div className="flex items-center justify-between gap-2 text-sm font-bold text-foreground">
                <span className="truncate">
                  <span className="text-muted-foreground">M{modulo.modulo}</span> {modulo.titulo}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {modulo.completadas}/{modulo.total}
                </span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", completo ? "bg-success" : "bg-primary")}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
