"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchInsignias, type Insignia } from "@/lib/insignias";

export default function AchievementsPage() {
  const [insignias, setInsignias] = useState<Insignia[] | null>(null);

  useEffect(() => {
    fetchInsignias().then(setInsignias);
  }, []);

  const loading = insignias === null;

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-center">
          <p className="font-display text-2xl font-extrabold text-foreground">
            🏅 Mis logros
          </p>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Cada insignia se gana completando una lección de tu camino.
          </p>
        </div>

        {loading && (
          <div className="mt-10 grid place-items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        )}

        {!loading && insignias.length === 0 && (
          <div className="mt-10 rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center">
            <p className="font-display text-lg font-extrabold text-foreground">
              Aún no tienes insignias
            </p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              Completa tu próxima lección para ganar la primera.
            </p>
          </div>
        )}

        {!loading && insignias.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {insignias.map((insignia) => (
              <div
                key={insignia.codigoLeccion}
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-accent/40 bg-card p-4 text-center shadow-(--shadow-card)"
              >
                <span className="text-3xl">🏅</span>
                <span className="font-display text-sm font-extrabold text-foreground">
                  {insignia.nombre}
                </span>
                {insignia.moduloNumero && (
                  <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Módulo {insignia.moduloNumero}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/dashboard"
            className="rounded-2xl bg-primary px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
          >
            Volver al camino
          </Link>
        </div>
      </div>
    </main>
  );
}
