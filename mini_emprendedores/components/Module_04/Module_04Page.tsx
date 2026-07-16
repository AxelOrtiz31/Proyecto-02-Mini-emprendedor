"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveMiNegocio } from "@/lib/negocio";
import { guardarPasoLeccion, leerPasoLeccion, borrarPasoLeccion, segundosDesde } from "@/lib/lessonProgress";
import { SalirLeccion } from "@/components/shared/SalirLeccion";
import { Reto } from "./steps/Reto";
import { NivelTeach } from "./steps/NivelTeach";
import { EligeNombre } from "./steps/EligeNombre";
import { ColoresTeach } from "./steps/ColoresTeach";
import { EligeColoresEstilo } from "./steps/EligeColoresEstilo";
import { EligeEslogan } from "./steps/EligeEslogan";
import { LogoConstructor } from "./steps/LogoConstructor";
import { VistaPrevia } from "./steps/VistaPrevia";
import { FinBloque } from "./steps/FinBloque";
import { CheckCorto } from "./CheckCorto";
import { NIVELES, COMPETENCIAS_BLOQUE_4, XP_FIN_BLOQUE_4 } from "./data";
import type { ColorMarca, EstiloMarca, LogoForma } from "./data";

const MODULE_NUMBER = 4;
const CODIGO_RETO_FINAL = "s4-u1-a5";
const INDICE_NOMBRE = 0;
const INDICE_COLORES = 1;
const INDICE_ESLOGAN = 2;

type Fase =
  | "reto"
  | "nivel_teach"
  | "aplicar_nombre"
  | "colores_teach"
  | "aplicar_colores"
  | "aplicar_eslogan"
  | "nivel_check"
  | "reto_final_logo"
  | "reto_final_vista"
  | "fin_bloque";

const FASES_VALIDAS: Fase[] = [
  "reto", "nivel_teach", "aplicar_nombre", "colores_teach", "aplicar_colores",
  "aplicar_eslogan", "nivel_check", "reto_final_logo", "reto_final_vista", "fin_bloque",
];

function initialStateFor(lessonId: string): { fase: Fase; index: number } {
  if (lessonId === CODIGO_RETO_FINAL) {
    return { fase: "reto_final_logo", index: NIVELES.length - 1 };
  }

  const i = NIVELES.findIndex((n) => n.codigo === lessonId);
  if (i === -1) return { fase: "reto", index: 0 };
  return { fase: i === 0 ? "reto" : "nivel_teach", index: i };
}

interface Module04PageProps {
  lessonId?: string;
}

export default function Module04Page({
  lessonId = "s4-u1-a1",
}: Module04PageProps) {
  const router = useRouter();
  const inicio = initialStateFor(lessonId);
  const [fase, setFaseState] = useState<Fase>(inicio.fase);
  const [nivelIndex] = useState(inicio.index);
  const [horaInicio] = useState(() => Date.now());

  useEffect(() => {
    const guardada = leerPasoLeccion(lessonId);
    if (guardada && FASES_VALIDAS.includes(guardada as Fase)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFaseState(guardada as Fase);
    }
  }, [lessonId]);

  function irA(nuevaFase: Fase) {
    guardarPasoLeccion(lessonId, nuevaFase);
    setFaseState(nuevaFase);
  }

  async function guardarNegocio(cambios: Parameters<typeof saveMiNegocio>[0]) {
    try {
      await saveMiNegocio(cambios);
    } catch (error) {
      console.error("No se pudo guardar tu negocio:", error);
    }
  }

  function terminarLeccion(code: string, insignia?: string, intentos?: number, xpBonus?: number) {
    borrarPasoLeccion(lessonId);
    const params = new URLSearchParams({
      lesson: code,
      tiempo: String(segundosDesde(horaInicio)),
      intentos: String(intentos ?? 1),
    });
    if (insignia) params.set("insignia", insignia);
    if (xpBonus) params.set("xpBonus", String(xpBonus));
    router.push(`/modules01_06_complete/modulecomplete?${params.toString()}`);
  }

  const nivel = NIVELES[nivelIndex];

  return (
    <>
      <SalirLeccion />

      {fase === "reto" && <Reto onNext={() => irA("nivel_teach")} />}

      {fase === "nivel_teach" && (
        <NivelTeach
          nivel={nivel}
          totalNiveles={NIVELES.length}
          onNext={() => {
            if (nivelIndex === INDICE_NOMBRE) return irA("aplicar_nombre");
            if (nivelIndex === INDICE_COLORES) return irA("colores_teach");
            if (nivelIndex === INDICE_ESLOGAN) return irA("aplicar_eslogan");
            irA("nivel_check");
          }}
        />
      )}

      {fase === "aplicar_nombre" && (
        <EligeNombre
          onSaved={async (nombre: string) => {
            await guardarNegocio({ nombreNegocio: nombre });
            irA("nivel_check");
          }}
        />
      )}

      {fase === "colores_teach" && <ColoresTeach onNext={() => irA("aplicar_colores")} />}

      {fase === "aplicar_colores" && (
        <EligeColoresEstilo
          onSaved={async (
            colores: { primario: ColorMarca; secundario: ColorMarca },
            estilo: EstiloMarca,
          ) => {
            await guardarNegocio({
              colorPrimario: colores.primario.hex,
              colorSecundario: colores.secundario.hex,
              estiloMarca: estilo.id,
            });
            irA("nivel_check");
          }}
        />
      )}

      {fase === "aplicar_eslogan" && (
        <EligeEslogan
          onSaved={async (eslogan: string) => {
            await guardarNegocio({ eslogan });
            irA("nivel_check");
          }}
        />
      )}

      {fase === "nivel_check" && (
        <CheckCorto
          lessonId={nivel.codigo}
          moduleNumber={MODULE_NUMBER}
          onPass={(intentos) => terminarLeccion(nivel.codigo, nivel.insignia, intentos)}
        />
      )}

      {fase === "reto_final_logo" && (
        <LogoConstructor
          onSaved={async (icono: string, forma: LogoForma) => {
            await guardarNegocio({ logoIcono: icono, logoForma: forma.id });
            irA("reto_final_vista");
          }}
        />
      )}

      {fase === "reto_final_vista" && (
        <VistaPrevia
          onSaved={async (percepcion: string) => {
            await guardarNegocio({ marcaPercepcion: percepcion });
            irA("fin_bloque");
          }}
        />
      )}

      {fase === "fin_bloque" && (
        <FinBloque
          insignias={NIVELES.map((n) => n.insignia)}
          xp={XP_FIN_BLOQUE_4}
          competencias={COMPETENCIAS_BLOQUE_4}
          onNext={() => terminarLeccion(CODIGO_RETO_FINAL, undefined, undefined, XP_FIN_BLOQUE_4)}
        />
      )}
    </>
  );
}
