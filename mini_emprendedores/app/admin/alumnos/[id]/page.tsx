"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Download } from "lucide-react";
import {
  fetchAlumnoDetalle,
  formatearFecha,
  formatearFechaHora,
  formatearTiempo,
  nombreCompleto,
  HABILIDAD_LABEL,
  type AlumnoDetalle,
} from "@/lib/admin";
import { exportarReportePdf, type SeccionPdf } from "@/lib/adminExport";
import { AdminLoading, AdminError } from "@/components/Admin/AdminStates";
import { StudentDetail } from "@/components/Admin/StudentDetail";

export default function AdminAlumnoDetallePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [detalle, setDetalle] = useState<AlumnoDetalle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  function recargar() {
    setError(null);
    setDetalle(null);
    setNonce((n) => n + 1);
  }

  useEffect(() => {
    let activo = true;

    fetchAlumnoDetalle(id)
      .then((data) => {
        if (!activo) return;
        if (!data) {
          setError("No se encontró el alumno");
          return;
        }
        setDetalle(data);
      })
      .catch((e) => {
        if (activo) setError(e instanceof Error ? e.message : "No se pudo cargar el alumno");
      });

    return () => {
      activo = false;
    };
  }, [id, nonce]);

  function exportar() {
    if (!detalle) return;

    const nombre = nombreCompleto(detalle.perfil);
    exportarReportePdf(
      `Reporte de ${nombre}`,
      `Generado el ${formatearFecha(new Date().toISOString())}`,
      construirSecciones(detalle),
      `reporte-${nombre.replace(/\s+/g, "-").toLowerCase()}.pdf`,
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Volver />
        <AdminError message={error} onRetry={recargar} />
      </div>
    );
  }

  if (!detalle) {
    return (
      <div className="space-y-4">
        <Volver />
        <AdminLoading />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Volver />
        <button
          type="button"
          onClick={exportar}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-0.5"
        >
          <Download className="h-4 w-4" />
          Exportar PDF
        </button>
      </div>

      <StudentDetail detalle={detalle} />
    </div>
  );
}

function Volver() {
  return (
    <Link
      href="/admin/alumnos"
      className="inline-flex items-center gap-1 text-sm font-extrabold text-primary transition-opacity hover:opacity-70"
    >
      <ChevronLeft className="h-4 w-4" />
      Alumnos
    </Link>
  );
}

function construirSecciones(detalle: AlumnoDetalle): SeccionPdf[] {
  const { perfil, modulos, sesiones, insignias, negocio } = detalle;
  const habilidad = perfil.habilidadDominante
    ? HABILIDAD_LABEL[perfil.habilidadDominante] ?? perfil.habilidadDominante
    : "—";

  const secciones: SeccionPdf[] = [
    {
      titulo: "Datos del alumno",
      lineas: [
        `Nombre: ${nombreCompleto(perfil)}`,
        `Alias: ${perfil.alias ?? "—"}`,
        `Edad: ${perfil.edad ?? "—"}     Grado: ${perfil.gradoEscolar ?? "—"}`,
        `Habilidad dominante: ${habilidad}`,
        `Estado: ${perfil.activo ? "Activo" : "Inactivo"}`,
        `Último acceso: ${formatearFechaHora(perfil.ultimaSesion)}`,
      ],
    },
    {
      titulo: "Avance general",
      lineas: [
        `Avance: ${perfil.porcentajeAvance}%     Lecciones: ${perfil.leccionesCompletadas}`,
        `XP: ${perfil.xpTotal}     Estrellas: ${perfil.estrellas}     Insignias: ${perfil.insignias}`,
        `Módulos completos: ${perfil.modulosCompletados} de ${modulos.length}     Tiempo: ${formatearTiempo(perfil.tiempoTotalSegundos)}`,
      ],
    },
    {
      titulo: "Avance por módulo",
      tabla: {
        headers: ["Módulo", "Lecciones", "Avance"],
        filas: modulos.map((modulo) => [
          `M${modulo.modulo} ${modulo.titulo}`,
          `${modulo.completadas}/${modulo.total}`,
          `${modulo.total > 0 ? Math.round((modulo.completadas / modulo.total) * 100) : 0}%`,
        ]),
      },
    },
  ];

  if (sesiones.length > 0) {
    secciones.push({
      titulo: "Evaluaciones",
      tabla: {
        headers: ["Evaluación", "Puntaje", "Estado", "Fecha"],
        filas: sesiones.map((sesion) => [
          sesion.evaluacion ?? "Evaluación",
          `${sesion.puntajeTotal ?? "—"}${sesion.puntajeMaximo ? "/" + sesion.puntajeMaximo : ""}`,
          sesion.estado,
          formatearFecha(sesion.completadaEn),
        ]),
      },
    });
  }

  if (insignias.length > 0) {
    secciones.push({
      titulo: "Insignias",
      lineas: insignias.map(
        (insignia) =>
          `• ${insignia.nombre}${insignia.moduloNumero ? ` (Módulo ${insignia.moduloNumero})` : ""}`,
      ),
    });
  }

  if (negocio?.nombreNegocio) {
    secciones.push({
      titulo: "Mi negocio",
      lineas: [
        `Nombre: ${negocio.nombreNegocio}`,
        negocio.eslogan ? `Eslogan: ${negocio.eslogan}` : "",
        negocio.ideaTipo ? `Tipo: ${negocio.ideaTipo}` : "",
      ].filter(Boolean) as string[],
    });
  }

  return secciones;
}
