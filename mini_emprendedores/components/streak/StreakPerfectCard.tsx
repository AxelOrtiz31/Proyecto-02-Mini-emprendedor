import { Flame } from "lucide-react";

export function StreakPerfectCard() {
  return (
    <section className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-4">
      <Flame className="h-7 w-7 shrink-0 fill-current text-primary" strokeWidth={2.4} />

      <p className="text-sm font-semibold leading-snug text-muted-foreground">
        Mantén tu <span className="font-extrabold text-primary">Racha Perfecta</span>{" "}
        completando un reto cada día.
      </p>
    </section>
  );
}
