"use client";

import { Download, FileText } from "lucide-react";
import {
  nombreCompleto,
  formatearFecha,
  type AlumnoResumen,
  type KpisGlobales,
} from "@/lib/admin";
import { toCsv, descargarCsv, exportarReportePdf, type SeccionPdf } from "@/lib/adminExport";

interface ReportsPanelProps {
  resumen: AlumnoResumen[];
  kpis: KpisGlobales;
}

const HEADERS = [
  "Alumno",
  "Alias",
  "Avance %",
  "Lecciones",
  "XP",
  "Estrellas",
  "Insignias",
  "Módulo",
  "Estado",
];

function filasAlumnos(resumen: AlumnoResumen[]): (string | number)[][] {
  return resumen.map((alumno) => [
    nombreCompleto(alumno),
    alumno.alias ?? "",
    alumno.porcentajeAvance,
    alumno.leccionesCompletadas,
    alumno.xpTotal,
    alumno.estrellas,
    alumno.insignias,
    alumno.moduloNumero ? `M${alumno.moduloNumero}` : "—",
    alumno.activo ? "Activo" : "Inactivo",
  ]);
}

export function ReportsPanel({ resumen, kpis }: ReportsPanelProps) {
  const filas = filasAlumnos(resumen);
  const hoy = formatearFecha(new Date().toISOString());
  const marca = new Date().toISOString().slice(0, 10);

  function exportarCsv() {
    descargarCsv(`reporte-grupo-${marca}.csv`, toCsv(HEADERS, filas));
  }

  function exportarPdf() {
    const secciones: SeccionPdf[] = [
      {
        titulo: "Resumen del grupo",
        lineas: [
          `Alumnos: ${kpis.totalAlumnos}     Activos: ${kpis.alumnosActivos}     Con actividad: ${kpis.alumnosConActividad}`,
          `Avance promedio: ${kpis.promedioAvance}%     XP del grupo: ${kpis.xpTotalGrupo}     Cursos completos: ${kpis.cursosCompletados}`,
        ],
      },
      {
        titulo: "Avance por módulo",
        tabla: {
          headers: ["Módulo", "Completado por"],
          filas: kpis.embudoModulos.map((modulo) => [
            `M${modulo.modulo} ${modulo.titulo}`,
            `${modulo.completados}/${kpis.totalAlumnos}`,
          ]),
        },
      },
      { titulo: "Alumnos", tabla: { headers: HEADERS, filas } },
    ];

    exportarReportePdf("Reporte del taller", `Generado el ${hoy}`, secciones, `reporte-grupo-${marca}.pdf`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={exportarCsv}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:bg-muted"
        >
          <FileText className="h-4 w-4" />
          Exportar CSV
        </button>
        <button
          type="button"
          onClick={exportarPdf}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-0.5"
        >
          <Download className="h-4 w-4" />
          Exportar PDF
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-card shadow-(--shadow-card)">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            <tr>
              {HEADERS.map((header) => (
                <th key={header} className="px-4 py-3 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {resumen.map((alumno) => (
              <tr key={alumno.id} className="hover:bg-muted/40">
                <td className="px-4 py-2.5 font-bold text-foreground">{nombreCompleto(alumno)}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{alumno.alias ?? "—"}</td>
                <td className="px-4 py-2.5 tabular-nums text-foreground">{alumno.porcentajeAvance}%</td>
                <td className="px-4 py-2.5 tabular-nums text-foreground">{alumno.leccionesCompletadas}</td>
                <td className="px-4 py-2.5 tabular-nums text-foreground">{alumno.xpTotal}</td>
                <td className="px-4 py-2.5 tabular-nums text-foreground">{alumno.estrellas}</td>
                <td className="px-4 py-2.5 tabular-nums text-foreground">{alumno.insignias}</td>
                <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                  {alumno.moduloNumero ? `M${alumno.moduloNumero}` : "—"}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {alumno.activo ? "Activo" : "Inactivo"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
