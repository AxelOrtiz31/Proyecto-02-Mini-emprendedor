"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fetchEvaluacionesLista, TIPO_LABEL, type EvaluacionItem } from "@/lib/evaluationsAdmin";
import { AdminLoading, AdminError } from "@/components/Admin/AdminStates";

export default function AdminEvaluacionesPage() {
  const [items, setItems] = useState<EvaluacionItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  function recargar() {
    setError(null);
    setItems(null);
    setNonce((n) => n + 1);
  }

  useEffect(() => {
    let activo = true;

    fetchEvaluacionesLista()
      .then((data) => {
        if (activo) setItems(data);
      })
      .catch((e) => {
        if (activo) setError(e instanceof Error ? e.message : "No se pudieron cargar las evaluaciones");
      });

    return () => {
      activo = false;
    };
  }, [nonce]);

  if (error) return <AdminError message={error} onRetry={recargar} />;
  if (!items) return <AdminLoading />;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">Evaluaciones</h1>
        <p className="text-sm font-semibold text-muted-foreground">
          Edita las preguntas y respuestas de cada evaluación
        </p>
      </header>

      {items.length === 0 ? (
        <p className="rounded-2xl bg-card p-8 text-center text-sm font-semibold text-muted-foreground shadow-(--shadow-card)">
          No hay evaluaciones. Corre los seeds en Supabase (seed_test_inicial.sql, seed_examen_final.sql).
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/evaluaciones/${item.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl bg-card p-4 shadow-(--shadow-card) transition-transform hover:-translate-y-0.5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                    {TIPO_LABEL[item.tipo] ?? item.tipo}
                  </span>
                  {item.moduloNumero && (
                    <span className="text-xs font-bold text-muted-foreground">Módulo {item.moduloNumero}</span>
                  )}
                  {!item.activa && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                      Inactiva
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate font-bold text-foreground">{item.nombre}</p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {item.numPreguntas} pregunta{item.numPreguntas === 1 ? "" : "s"}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
