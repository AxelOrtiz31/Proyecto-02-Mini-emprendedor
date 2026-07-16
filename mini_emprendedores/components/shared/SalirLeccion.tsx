"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

// Botón fijo para salir de la lección en cualquier momento y volver al
// camino del módulo. No borra el paso guardado (lessonProgress), así que el
// contenido de la lección se retoma donde quedó la próxima vez.
export function SalirLeccion() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/dashboard")}
      aria-label="Salir de la lección"
      className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full border-2 border-border bg-card text-muted-foreground shadow-(--shadow-card) transition-transform active:translate-y-0.5"
    >
      <X className="h-5 w-5" strokeWidth={3} />
    </button>
  );
}
