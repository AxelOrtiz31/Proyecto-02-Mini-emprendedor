import { Lightbulb, Medal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function MascotPanel() {
  return (
    <aside className="hidden w-80 shrink-0 xl:block">
      <div className="sticky top-20 space-y-4 p-5">
        <div className="rounded-3xl border-2 border-accent/40 bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <img
              src="/caelus.svg"
              alt="Lupe"
              width={64}
              height={64}
              loading="lazy"
              className="h-16 w-16 animate-mascot"
            />
            <div>
              <div className="font-display text-base font-extrabold">¡Hola, Lupe!</div>
              <div className="text-xs text-muted-foreground">Vamos por la unidad 2 🚀</div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-secondary p-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5 text-accent-foreground" />
              Tip del día
            </div>
            <p className="mt-1 text-sm font-semibold text-foreground">
              Los mejores emprendedores empiezan resolviendo un problema pequeño que ellos mismos tienen.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Medal className="h-4 w-4 text-primary" />
            Logros recientes
          </div>
          <ul className="mt-3 space-y-2">
            <Achievement title="Primera idea" subtitle="Completaste la unidad 1" tone="success" />
            <Achievement title="Racha de 12 días" subtitle="¡Sigue así!" tone="primary" />
            <Achievement title="Cazador de ideas" subtitle="3 estrellas en bonus" tone="accent" />
          </ul>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-info to-[oklch(0.5_0.14_240)] p-5 text-info-foreground">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-90">
            <Sparkles className="h-4 w-4" /> Próxima unidad
          </div>
          <div className="mt-1 font-display text-lg font-extrabold">Conoce a tu cliente</div>
          <div className="text-sm opacity-90">Desbloquéala terminando la unidad 2.</div>
        </div>
      </div>
    </aside>
  );
}

const toneMap: Record<string, string> = {
  success: "bg-success/15 text-success",
  primary: "bg-primary/15 text-primary",
  accent: "bg-accent/40 text-accent-foreground",
};

function Achievement({
  title,
  subtitle,
  tone,
}: {
  title: string;
  subtitle: string;
  tone: "success" | "primary" | "accent";
}) {
  return (
    <li className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          toneMap[tone],
        )}
      >
        <Medal className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="truncate font-display text-sm font-extrabold text-foreground">
          {title}
        </div>
        <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </li>
  );
}
