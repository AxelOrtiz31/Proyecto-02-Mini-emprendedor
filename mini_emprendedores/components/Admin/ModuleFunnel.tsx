interface ModuleFunnelProps {
  embudo: { modulo: number; titulo: string; completados: number }[];
  total: number;
}

export function ModuleFunnel({ embudo, total }: ModuleFunnelProps) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-(--shadow-card)">
      <h2 className="font-display text-lg font-extrabold text-foreground">Avance por módulo</h2>
      <p className="text-xs font-semibold text-muted-foreground">
        Alumnos que completaron todas las lecciones de cada módulo
      </p>

      <div className="mt-4 space-y-3">
        {embudo.map((modulo) => {
          const porcentaje = total > 0 ? Math.round((modulo.completados / total) * 100) : 0;

          return (
            <div key={modulo.modulo}>
              <div className="flex items-center justify-between gap-2 text-sm font-bold text-foreground">
                <span className="truncate">
                  <span className="text-muted-foreground">M{modulo.modulo}</span> {modulo.titulo}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {modulo.completados}/{total}
                </span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
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
