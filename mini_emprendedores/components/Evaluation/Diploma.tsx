"use client";

import { useRef, useState } from "react";

interface DiplomaProps {
  nombreCompleto: string;
  nombreNegocio: string | null;
  fecha: string;
  onVolver: () => void;
}

// Colores fijos (no las variables oklch del tema): html2canvas no siempre
// interpreta bien oklch, así que el diploma usa su propia paleta segura
// para que la foto/PDF salga con los colores correctos siempre.
const COLOR_BORDE = "#F5A15C";
const COLOR_FONDO = "#FFF8EE";
const COLOR_TEXTO = "#4A3B2A";
const COLOR_TEXTO_SUAVE = "#8A7660";
const COLOR_ACENTO = "#2FA36B";

export function Diploma({ nombreCompleto, nombreNegocio, fecha, onVolver }: DiplomaProps) {
  const diplomaRef = useRef<HTMLDivElement>(null);
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fechaFormateada = new Date(fecha).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function descargarPDF() {
    if (!diplomaRef.current) return;

    setDescargando(true);
    setError(null);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(diplomaRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Red de seguridad #1: el tema de la app define sus colores como
          // variables CSS en oklch() (--color-primary, --color-background,
          // etc.). html2canvas no sabe leer oklch/lab, y como necesita
          // procesar TODO el documento clonado (no solo el diploma) para
          // calcular el render, truena al toparse con cualquier elemento
          // de la página -botones, fondo- que use esas variables. Se
          // sobreescriben aquí con equivalentes seguros en hex.
          const estiloSeguro = clonedDoc.createElement("style");
          estiloSeguro.textContent = `
            :root, .light {
              --color-background: #fdfbf7 !important;
              --color-foreground: #4a3b2a !important;
              --color-card: #ffffff !important;
              --color-card-foreground: #4a3b2a !important;
              --color-primary: #f5a15c !important;
              --color-primary-foreground: #fdfcfa !important;
              --color-secondary: #fbeedd !important;
              --color-secondary-foreground: #4e3d2c !important;
              --color-muted: #eeeae3 !important;
              --color-muted-foreground: #8a7660 !important;
              --color-accent: #e8c468 !important;
              --color-accent-foreground: #5c4a32 !important;
              --color-success: #3fae6a !important;
              --color-success-foreground: #fdfcfa !important;
              --color-info: #4f7fc9 !important;
              --color-info-foreground: #fdfcfa !important;
              --color-border: #e6e0d6 !important;
            }
          `;
          clonedDoc.head.appendChild(estiloSeguro);

          // No depende de adivinar el selector correcto (:root, .light,
          // etc.): puestas en línea sobre <html>, estas variables ganan
          // sin importar cómo esté armado tu globals.css.
          const variablesSeguras: Record<string, string> = {
            "--color-background": "#fdfbf7",
            "--color-foreground": "#4a3b2a",
            "--color-card": "#ffffff",
            "--color-card-foreground": "#4a3b2a",
            "--color-primary": "#f5a15c",
            "--color-primary-foreground": "#fdfcfa",
            "--color-secondary": "#fbeedd",
            "--color-secondary-foreground": "#4e3d2c",
            "--color-muted": "#eeeae3",
            "--color-muted-foreground": "#8a7660",
            "--color-accent": "#e8c468",
            "--color-accent-foreground": "#5c4a32",
            "--color-success": "#3fae6a",
            "--color-success-foreground": "#fdfcfa",
            "--color-info": "#4f7fc9",
            "--color-info-foreground": "#fdfcfa",
            "--color-border": "#e6e0d6",
          };
          Object.entries(variablesSeguras).forEach(([nombre, valor]) => {
            clonedDoc.documentElement.style.setProperty(nombre, valor);
          });

          // Red de seguridad #2: fuerza colores seguros también dentro del
          // diploma mismo, por si algo no vino de una variable CSS.
          const root = clonedDoc.querySelector<HTMLElement>("[data-diploma-root]");
          if (!root) return;

          root.style.color = COLOR_TEXTO;
          root.style.backgroundColor = COLOR_FONDO;

          root.querySelectorAll<HTMLElement>("*").forEach((el) => {
            if (!el.style.color) el.style.color = COLOR_TEXTO;
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Diploma-EmprendeKids-${nombreCompleto.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Error generando el diploma:", err);
      setError("No pudimos generar el PDF. Intenta de nuevo.");
    } finally {
      setDescargando(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-background px-4 py-10">
      <span className="text-6xl" aria-hidden="true">
        🏆
      </span>
      <h1 className="text-center font-display text-2xl font-extrabold text-foreground sm:text-3xl">
        ¡Completaste todo el curso!
      </h1>
      <p className="max-w-md text-center text-sm font-semibold text-muted-foreground">
        Mentorix está muy orgulloso de ti. Aquí está tu diploma — puedes descargarlo y compartirlo.
      </p>

      <div
        ref={diplomaRef}
        data-diploma-root
        className="relative w-full max-w-2xl rounded-3xl p-10 text-center"
        style={{
          backgroundColor: COLOR_FONDO,
          border: `10px solid ${COLOR_BORDE}`,
          color: COLOR_TEXTO,
          height: "auto",
          minHeight: "auto",
        }}
      >
        <div
          className="pointer-events-none absolute inset-3 rounded-2xl"
          style={{ border: `3px dashed ${COLOR_ACENTO}` }}
        />

        <div className="relative flex flex-col items-center gap-3 py-4">
          <span
            className="block"
            style={{ fontSize: 44, lineHeight: 1, height: 52, marginBottom: 4 }}
          >
            🏆
          </span>
          <p
            className="font-display text-xs font-extrabold uppercase tracking-[0.3em]"
            style={{ color: COLOR_TEXTO_SUAVE }}
          >
            Diploma de finalización
          </p>
          <p className="font-display text-3xl font-extrabold sm:text-4xl" style={{ color: COLOR_BORDE }}>
            EmprendeKids IA
          </p>

          <p className="mt-5 text-sm font-semibold" style={{ color: COLOR_TEXTO_SUAVE }}>
            Se otorga el presente diploma a
          </p>
          <p className="font-display text-2xl font-extrabold sm:text-3xl" style={{ color: COLOR_TEXTO }}>
            {nombreCompleto}
          </p>

          <p className="mt-3 max-w-md text-sm font-semibold" style={{ color: COLOR_TEXTO_SUAVE }}>
            por completar satisfactoriamente el programa EmprendeKids IA
            {nombreNegocio ? `, construyendo su propio emprendimiento: "${nombreNegocio}"` : ""}.
          </p>

          <p className="mt-5 text-xs font-extrabold uppercase tracking-wide" style={{ color: COLOR_TEXTO_SUAVE }}>
            {fechaFormateada}
          </p>

          <div className="mt-8 flex w-full items-end justify-between px-6">
            <div className="flex flex-col items-center gap-1">
              <span className="block" style={{ fontSize: 24, lineHeight: 1 }}>🤖</span>
              <p className="font-display text-xs font-extrabold" style={{ color: COLOR_TEXTO }}>
                Mentorix
              </p>
              <p className="text-[10px] font-semibold" style={{ color: COLOR_TEXTO_SUAVE }}>
                Guía del curso
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-8 w-28" style={{ borderBottom: `2px solid ${COLOR_TEXTO}` }} />
              <p className="text-[10px] font-semibold" style={{ color: COLOR_TEXTO_SUAVE }}>
                Firma / Sello
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-sm font-bold text-accent-foreground">{error}</p>}

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={descargarPDF}
          disabled={descargando}
          className="rounded-2xl bg-primary px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {descargando ? "Generando..." : "Descargar diploma (PDF) →"}
        </button>
        <button
          type="button"
          onClick={onVolver}
          className="rounded-2xl border-2 border-border bg-card px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-foreground shadow-(--shadow-card) transition-transform active:translate-y-1"
        >
          Volver al camino
        </button>
      </div>
    </main>
  );
}