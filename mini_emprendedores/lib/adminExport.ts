import { jsPDF } from "jspdf";

// Exportación de reportes del panel: CSV para abrir en Excel/Sheets y PDF
// vectorial (texto + tablas). Se usa jsPDF directamente en vez de html2canvas
// porque la app colorea con oklch(), que html2canvas no sabe interpretar.

// ============================================================
// CSV
// ============================================================

export function toCsv(headers: string[], filas: (string | number)[][]): string {
  const escapar = (valor: string | number): string => {
    const texto = String(valor ?? "");
    if (/[",\n]/.test(texto)) return `"${texto.replace(/"/g, '""')}"`;
    return texto;
  };

  return [headers, ...filas].map((fila) => fila.map(escapar).join(",")).join("\n");
}

export function descargarCsv(nombreArchivo: string, contenido: string): void {
  // El BOM (﻿) hace que Excel abra el CSV como UTF-8 y respete acentos y eñes.
  const blob = new Blob(["﻿" + contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// PDF
// ============================================================

export interface TablaPdf {
  headers: string[];
  filas: (string | number)[][];
}

export interface SeccionPdf {
  titulo?: string;
  lineas?: string[];
  tabla?: TablaPdf;
}

type Color = [number, number, number];

const MARGEN = 40;
const ALTO_FILA = 20;
const COLOR_PRIMARIO: Color = [234, 122, 47];
const COLOR_TEXTO: Color = [51, 51, 51];
const COLOR_GRIS: Color = [120, 120, 120];
const COLOR_BORDE: Color = [220, 220, 220];
const COLOR_ZEBRA: Color = [246, 246, 246];
const BLANCO: Color = [255, 255, 255];

function conTexto(pdf: jsPDF, c: Color): void {
  pdf.setTextColor(c[0], c[1], c[2]);
}

function conRelleno(pdf: jsPDF, c: Color): void {
  pdf.setFillColor(c[0], c[1], c[2]);
}

export function exportarReportePdf(
  titulo: string,
  subtitulo: string,
  secciones: SeccionPdf[],
  nombreArchivo: string,
): void {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const anchoPagina = pdf.internal.pageSize.getWidth();
  const altoPagina = pdf.internal.pageSize.getHeight();
  const anchoUtil = anchoPagina - MARGEN * 2;
  let y = MARGEN;

  const saltoDePagina = (alto: number): void => {
    if (y + alto > altoPagina - MARGEN) {
      pdf.addPage();
      y = MARGEN;
    }
  };

  // Encabezado del documento.
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  conTexto(pdf, COLOR_PRIMARIO);
  pdf.text("EmprendeKids", MARGEN, y);
  y += 22;

  pdf.setFontSize(14);
  conTexto(pdf, COLOR_TEXTO);
  pdf.text(titulo, MARGEN, y);
  y += 16;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  conTexto(pdf, COLOR_GRIS);
  pdf.text(subtitulo, MARGEN, y);
  y += 12;

  pdf.setDrawColor(COLOR_BORDE[0], COLOR_BORDE[1], COLOR_BORDE[2]);
  pdf.line(MARGEN, y, anchoPagina - MARGEN, y);
  y += 20;

  for (const seccion of secciones) {
    if (seccion.titulo) {
      saltoDePagina(24);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      conTexto(pdf, COLOR_TEXTO);
      pdf.text(seccion.titulo, MARGEN, y);
      y += 16;
    }

    if (seccion.lineas) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      conTexto(pdf, COLOR_TEXTO);
      for (const linea of seccion.lineas) {
        const partes = pdf.splitTextToSize(linea, anchoUtil) as string[];
        for (const parte of partes) {
          saltoDePagina(14);
          pdf.text(parte, MARGEN, y);
          y += 14;
        }
      }
      y += 6;
    }

    if (seccion.tabla) {
      y = dibujarTabla(pdf, seccion.tabla, MARGEN, y, anchoUtil, altoPagina);
      y += 14;
    }
  }

  pdf.save(nombreArchivo);
}

function dibujarTabla(
  pdf: jsPDF,
  tabla: TablaPdf,
  x: number,
  yInicial: number,
  ancho: number,
  altoPagina: number,
): number {
  const anchoCol = ancho / tabla.headers.length;
  let y = yInicial;

  const dibujarEncabezado = (): void => {
    conRelleno(pdf, COLOR_PRIMARIO);
    pdf.rect(x, y, ancho, ALTO_FILA, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    conTexto(pdf, BLANCO);
    tabla.headers.forEach((celda, i) => {
      const texto = (pdf.splitTextToSize(String(celda), anchoCol - 8) as string[])[0] ?? "";
      pdf.text(texto, x + i * anchoCol + 4, y + 13);
    });
    y += ALTO_FILA;
  };

  dibujarEncabezado();

  tabla.filas.forEach((fila, indice) => {
    if (y + ALTO_FILA > altoPagina - MARGEN) {
      pdf.addPage();
      y = MARGEN;
      dibujarEncabezado();
    }

    if (indice % 2 === 1) {
      conRelleno(pdf, COLOR_ZEBRA);
      pdf.rect(x, y, ancho, ALTO_FILA, "F");
    }

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    conTexto(pdf, COLOR_TEXTO);
    fila.forEach((valor, i) => {
      const texto = (pdf.splitTextToSize(String(valor ?? ""), anchoCol - 8) as string[])[0] ?? "";
      pdf.text(texto, x + i * anchoCol + 4, y + 13);
    });
    y += ALTO_FILA;
  });

  return y;
}
