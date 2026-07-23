"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { actualizarAlumno, cambiarRolAlumno, type AlumnoResumen } from "@/lib/admin";

const ROLES = [
  { valor: "alumno", label: "Alumno" },
  { valor: "tutor", label: "Tutor" },
  { valor: "maestro", label: "Maestro" },
  { valor: "admin", label: "Admin" },
];

const INPUT =
  "w-full rounded-xl border-2 border-border bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary";

interface StudentEditModalProps {
  alumno: AlumnoResumen;
  onClose: () => void;
  onSaved: () => void;
}

export function StudentEditModal({ alumno, onClose, onSaved }: StudentEditModalProps) {
  const [form, setForm] = useState({
    nombre: alumno.nombre,
    apellido: alumno.apellido,
    edad: alumno.edad?.toString() ?? "",
    gradoEscolar: alumno.gradoEscolar ?? "",
    alias: alumno.alias ?? "",
    rol: alumno.rol,
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(campo: keyof typeof form, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleGuardar() {
    setGuardando(true);
    setError(null);

    try {
      await actualizarAlumno(alumno.id, {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        edad: form.edad ? parseInt(form.edad, 10) : null,
        gradoEscolar: form.gradoEscolar.trim() || null,
        alias: form.alias.trim() || null,
      });

      if (form.rol !== alumno.rol) {
        await cambiarRolAlumno(alumno.id, form.rol);
      }

      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
      setGuardando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-card p-6 shadow-(--shadow-card)"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-foreground">Editar alumno</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <Campo label="Nombre">
            <input className={INPUT} value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
          </Campo>
          <Campo label="Apellido">
            <input className={INPUT} value={form.apellido} onChange={(e) => set("apellido", e.target.value)} />
          </Campo>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Edad">
              <input
                type="number"
                min={5}
                max={18}
                className={INPUT}
                value={form.edad}
                onChange={(e) => set("edad", e.target.value)}
              />
            </Campo>
            <Campo label="Grado">
              <input
                className={INPUT}
                value={form.gradoEscolar}
                onChange={(e) => set("gradoEscolar", e.target.value)}
              />
            </Campo>
          </div>
          <Campo label="Alias">
            <input className={INPUT} value={form.alias} onChange={(e) => set("alias", e.target.value)} />
          </Campo>
          <Campo label="Rol">
            <select className={INPUT} value={form.rol} onChange={(e) => set("rol", e.target.value)}>
              {ROLES.map((rol) => (
                <option key={rol.valor} value={rol.valor}>
                  {rol.label}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        {error && <p className="mt-3 text-sm font-bold text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:bg-muted disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGuardar}
            disabled={guardando}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground transition hover:brightness-95 disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
