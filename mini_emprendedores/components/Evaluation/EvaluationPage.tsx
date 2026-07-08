"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EvaluationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [modulosCompletados, setModulosCompletados] = useState<number[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setSession(session);

      // Obtener todas las lecciones completadas del usuario
      const { data: progreso, error } = await supabase
        .from("progreso_lecciones")
        .select("codigo_leccion")
        .eq("alumno_id", session.user.id)
        .eq("estado", "completada");

      if (error) {
        console.error("Error al obtener progreso:", error);
        setLoading(false);
        return;
      }

      // Extraer módulos únicos de los códigos de lección
      const modulos = new Set<number>();
      progreso?.forEach((p) => {
        if (p.codigo_leccion) {
          const match = p.codigo_leccion.match(/^s(\d+)/);
          if (match) {
            modulos.add(parseInt(match[1], 10));
          }
        }
      });

      setModulosCompletados(Array.from(modulos));
      setLoading(false);
    }

    checkAccess();
  }, [router]);

  const todosLosModulosCompletados = modulosCompletados.length >= 6;

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      {todosLosModulosCompletados ? (
        <>
          <div className="font-display text-3xl font-extrabold text-foreground">
            🎉 ¡Evaluación Final!
          </div>
          <p className="max-w-sm text-sm font-semibold text-muted-foreground">
            Has completado todos los módulos. ¡Felicidades! Ahora puedes realizar la evaluación final para poner a prueba todo lo aprendido.
          </p>
          <button
            onClick={() => router.push("/evaluacion/final")}
            className="rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
          >
            Comenzar evaluación
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-2 text-sm font-extrabold text-muted-foreground underline underline-offset-2"
          >
            Volver al dashboard
          </button>
        </>
      ) : (
        <>
          <div className="font-display text-2xl font-extrabold text-foreground">
            🔒 Evaluación no disponible
          </div>
          <p className="max-w-sm text-sm font-semibold text-muted-foreground">
            Para acceder a la evaluación final, necesitas completar los 6 módulos del curso.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <span
                key={num}
                className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
                  modulosCompletados.includes(num)
                    ? "bg-success/20 text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                Módulo {num} {modulosCompletados.includes(num) ? "✅" : "⏳"}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-muted-foreground">
            Completados: {modulosCompletados.length} de 6
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 rounded-2xl bg-primary px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
          >
            Volver al camino
          </button>
        </>
      )}
    </main>
  );
}