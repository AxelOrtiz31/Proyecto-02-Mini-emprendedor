"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchResumenAlumnos,
  setAlumnoActivo,
  reiniciarProgreso,
  nombreCompleto,
  type AlumnoResumen,
} from "@/lib/admin";
import { AdminLoading, AdminError } from "@/components/Admin/AdminStates";
import { StudentFilters, type FiltroEstado } from "@/components/Admin/StudentFilters";
import { StudentsTable } from "@/components/Admin/StudentsTable";
import { StudentEditModal } from "@/components/Admin/StudentEditModal";
import { ConfirmDialog } from "@/components/Admin/ConfirmDialog";

type Accion =
  | { tipo: "activo"; alumno: AlumnoResumen }
  | { tipo: "reset"; alumno: AlumnoResumen };

export default function AdminAlumnosPage() {
  const [alumnos, setAlumnos] = useState<AlumnoResumen[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<FiltroEstado>("todos");
  const [editando, setEditando] = useState<AlumnoResumen | null>(null);
  const [accion, setAccion] = useState<Accion | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [nonce, setNonce] = useState(0);

  function recargar() {
    setError(null);
    setAlumnos(null);
    setNonce((n) => n + 1);
  }

  useEffect(() => {
    let activo = true;

    fetchResumenAlumnos()
      .then((data) => {
        if (activo) setAlumnos(data);
      })
      .catch((e) => {
        if (activo) setError(e instanceof Error ? e.message : "No se pudo cargar la lista");
      });

    return () => {
      activo = false;
    };
  }, [nonce]);

  const filtrados = useMemo(() => {
    if (!alumnos) return [];

    const texto = busqueda.trim().toLowerCase();

    return alumnos.filter((alumno) => {
      const coincideEstado =
        filtro === "todos" || (filtro === "activos" ? alumno.activo : !alumno.activo);
      const coincideTexto =
        texto === "" ||
        nombreCompleto(alumno).toLowerCase().includes(texto) ||
        (alumno.alias ?? "").toLowerCase().includes(texto);

      return coincideEstado && coincideTexto;
    });
  }, [alumnos, busqueda, filtro]);

  async function confirmarAccion() {
    if (!accion) return;

    setProcesando(true);

    try {
      if (accion.tipo === "activo") {
        await setAlumnoActivo(accion.alumno.id, !accion.alumno.activo);
      } else {
        await reiniciarProgreso(accion.alumno.id);
      }

      setAccion(null);
      setProcesando(false);
      recargar();
    } catch (e) {
      setProcesando(false);
      setAccion(null);
      setError(e instanceof Error ? e.message : "No se pudo completar la acción");
    }
  }

  if (error) return <AdminError message={error} onRetry={recargar} />;
  if (!alumnos) return <AdminLoading />;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">Alumnos</h1>
        <p className="text-sm font-semibold text-muted-foreground">
          {alumnos.length} registrados · {filtrados.length} en vista
        </p>
      </header>

      <StudentFilters
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        estado={filtro}
        onEstado={setFiltro}
      />

      <StudentsTable
        alumnos={filtrados}
        onEdit={setEditando}
        onToggleActivo={(alumno) => setAccion({ tipo: "activo", alumno })}
        onReset={(alumno) => setAccion({ tipo: "reset", alumno })}
      />

      {editando && (
        <StudentEditModal
          alumno={editando}
          onClose={() => setEditando(null)}
          onSaved={() => {
            setEditando(null);
            recargar();
          }}
        />
      )}

      <ConfirmDialog
        open={accion !== null}
        loading={procesando}
        title={tituloAccion(accion)}
        message={mensajeAccion(accion)}
        tone={accion?.tipo === "reset" ? "danger" : "primary"}
        confirmLabel={etiquetaAccion(accion)}
        onConfirm={confirmarAccion}
        onCancel={() => setAccion(null)}
      />
    </div>
  );
}

function tituloAccion(accion: Accion | null): string {
  if (accion?.tipo === "reset") return "Reiniciar progreso";
  if (accion?.alumno.activo) return "Desactivar alumno";
  return "Activar alumno";
}

function etiquetaAccion(accion: Accion | null): string {
  if (accion?.tipo === "reset") return "Reiniciar";
  if (accion?.alumno.activo) return "Desactivar";
  return "Activar";
}

function mensajeAccion(accion: Accion | null): string {
  if (!accion) return "";

  const nombre = nombreCompleto(accion.alumno);

  if (accion.tipo === "reset") {
    return `Se borrará todo el avance, XP, estrellas e insignias de ${nombre}. Esta acción no se puede deshacer.`;
  }

  if (accion.alumno.activo) {
    return `${nombre} quedará marcado como inactivo en el panel.`;
  }

  return `${nombre} volverá a quedar activo en el panel.`;
}
