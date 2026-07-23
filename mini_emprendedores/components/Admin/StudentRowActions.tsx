"use client";

import Link from "next/link";
import { Eye, Pencil, Power, RotateCcw } from "lucide-react";
import type { AlumnoResumen } from "@/lib/admin";

interface StudentRowActionsProps {
  alumno: AlumnoResumen;
  onEdit: (alumno: AlumnoResumen) => void;
  onToggleActivo: (alumno: AlumnoResumen) => void;
  onReset: (alumno: AlumnoResumen) => void;
}

const BOTON = "rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function StudentRowActions({ alumno, onEdit, onToggleActivo, onReset }: StudentRowActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <Link href={`/admin/alumnos/${alumno.id}`} title="Ver detalle" className={BOTON}>
        <Eye className="h-4 w-4" />
      </Link>
      <button type="button" onClick={() => onEdit(alumno)} title="Editar" className={BOTON}>
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onToggleActivo(alumno)}
        title={alumno.activo ? "Desactivar" : "Activar"}
        className={BOTON}
      >
        <Power className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onReset(alumno)}
        title="Reiniciar progreso"
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-red-600"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}
