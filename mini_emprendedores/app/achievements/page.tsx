import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EmprendeKids · Logros",
  description: "Tus logros e insignias de EmprendeKids.",
};

// Página en blanco: aquí se trabajarán los logros más adelante.
export default function Achievements() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div className="max-w-sm">
        <p className="font-display text-xl font-extrabold text-foreground">
          Logros
        </p>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          Muy pronto podrás ver aquí tus insignias y recompensas.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-2xl bg-primary px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
        >
          Volver al camino
        </Link>
      </div>
    </main>
  );
}
