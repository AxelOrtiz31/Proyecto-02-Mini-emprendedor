import { cn } from "@/lib/utils";

interface SkillDistributionProps {
  distribucion: { habilidad: string; label: string; total: number }[];
}

const COLORES: Record<string, string> = {
  liderazgo: "bg-primary",
  creatividad: "bg-accent",
  trabajo_equipo: "bg-success",
  resolucion_problemas: "bg-info",
};

export function SkillDistribution({ distribucion }: SkillDistributionProps) {
  const maximo = Math.max(1, ...distribucion.map((item) => item.total));

  return (
    <div className="rounded-2xl bg-card p-5 shadow-(--shadow-card)">
      <h2 className="font-display text-lg font-extrabold text-foreground">Habilidad dominante</h2>
      <p className="text-xs font-semibold text-muted-foreground">
        Resultado del test inicial del grupo
      </p>

      <div className="mt-4 space-y-3">
        {distribucion.map((item) => (
          <div key={item.habilidad}>
            <div className="flex items-center justify-between text-sm font-bold text-foreground">
              <span>{item.label}</span>
              <span className="tabular-nums text-muted-foreground">{item.total}</span>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", COLORES[item.habilidad] ?? "bg-primary")}
                style={{ width: `${(item.total / maximo) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
