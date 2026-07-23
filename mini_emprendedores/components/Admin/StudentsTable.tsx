"use client";

import { nombreCompleto, type AlumnoResumen } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { StudentRowActions } from "./StudentRowActions";

interface StudentsTableProps {
  alumnos: AlumnoResumen[];
  onEdit: (alumno: AlumnoResumen) => void;
  onToggleActivo: (alumno: AlumnoResumen) => void;
  onReset: (alumno: AlumnoResumen) => void;
}

function Avance({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold tabular-nums text-muted-foreground">{pct}%</span>
    </div>
  );
}

function EstadoBadge({ activo }: { activo: boolean }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-bold",
        activo ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
      )}
    >
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}

export function StudentsTable({ alumnos, onEdit, onToggleActivo, onReset }: StudentsTableProps) {
  if (alumnos.length === 0) {
    return (
      <p className="rounded-2xl bg-card p-8 text-center text-sm font-semibold text-muted-foreground shadow-(--shadow-card)">
        No hay alumnos que coincidan con la búsqueda.
      </p>
    );
  }

  return (
    <>
      {/* Tabla para escritorio */}
      <div className="hidden overflow-hidden rounded-2xl bg-card shadow-(--shadow-card) md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Alumno</th>
              <th className="px-4 py-3">Avance</th>
              <th className="px-4 py-3">Lecciones</th>
              <th className="px-4 py-3">XP</th>
              <th className="px-4 py-3">Módulo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {alumnos.map((alumno) => (
              <tr key={alumno.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <p className="font-bold text-foreground">{nombreCompleto(alumno)}</p>
                  {alumno.alias && (
                    <p className="text-xs font-semibold text-muted-foreground">{alumno.alias}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Avance pct={alumno.porcentajeAvance} />
                </td>
                <td className="px-4 py-3 font-bold tabular-nums text-foreground">
                  {alumno.leccionesCompletadas}
                </td>
                <td className="px-4 py-3 font-bold tabular-nums text-foreground">{alumno.xpTotal}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {alumno.moduloNumero ? `M${alumno.moduloNumero}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <EstadoBadge activo={alumno.activo} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <StudentRowActions
                      alumno={alumno}
                      onEdit={onEdit}
                      onToggleActivo={onToggleActivo}
                      onReset={onReset}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas para móvil */}
      <div className="space-y-3 md:hidden">
        {alumnos.map((alumno) => (
          <div key={alumno.id} className="rounded-2xl bg-card p-4 shadow-(--shadow-card)">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-foreground">{nombreCompleto(alumno)}</p>
                {alumno.alias && (
                  <p className="text-xs font-semibold text-muted-foreground">{alumno.alias}</p>
                )}
              </div>
              <EstadoBadge activo={alumno.activo} />
            </div>
            <div className="mt-3">
              <Avance pct={alumno.porcentajeAvance} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-muted-foreground">
              <span>{alumno.leccionesCompletadas} lecciones</span>
              <span>{alumno.xpTotal} XP</span>
              <span>{alumno.moduloNumero ? `Módulo ${alumno.moduloNumero}` : "Sin iniciar"}</span>
            </div>
            <div className="mt-3 border-t border-border pt-2">
              <StudentRowActions
                alumno={alumno}
                onEdit={onEdit}
                onToggleActivo={onToggleActivo}
                onReset={onReset}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
