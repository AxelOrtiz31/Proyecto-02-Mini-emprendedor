"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCompletedLesson } from "@/lib/progress";
import { saveMiNegocio } from "@/lib/negocio";
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

function initialStateFor(lessonId: string): { fase: Fase; index: number } {
  if (lessonId === CODIGO_RETO_FINAL) {
    return { fase: "reto_final_logo", index: NIVELES.length - 1 };
  }

  const i = NIVELES.findIndex((n) => n.codigo === lessonId);
  if (i === -1) return { fase: "reto", index: 0 };
  return { fase: "nivel_teach", index: i };
}

interface Module04PageProps {
  lessonId?: string;
}

export default function Module04Page({
  lessonId = "s4-u1-a1",
}: Module04PageProps) {
  const router = useRouter();
  const inicio = initialStateFor(lessonId);
  const [fase, setFase] = useState<Fase>(inicio.fase);
  const [nivelIndex, setNivelIndex] = useState(inicio.index);

  async function markDone(code: string) {
    try {
      await saveCompletedLesson(code);
    } catch (error) {
      console.error("No se pudo guardar el avance:", error);
    }
  }

  async function guardarNegocio(cambios: Parameters<typeof saveMiNegocio>[0]) {
    try {
      await saveMiNegocio(cambios);
    } catch (error) {
      console.error("No se pudo guardar tu negocio:", error);
    }
  }

  function finishModule() {
    router.push(`/modules01_06_complete/modulecomplete?lesson=${CODIGO_RETO_FINAL}`);
  }

  if (fase === "reto") {
    return <Reto onNext={() => setFase("nivel_teach")} />;
  }

  const nivel = NIVELES[nivelIndex];
  const esUltimoNivel = nivelIndex === NIVELES.length - 1;

  if (fase === "nivel_teach") {
    return (
      <NivelTeach
        nivel={nivel}
        totalNiveles={NIVELES.length}
        onNext={() => {
          if (nivelIndex === INDICE_NOMBRE) return setFase("aplicar_nombre");
          if (nivelIndex === INDICE_COLORES) return setFase("colores_teach");
          if (nivelIndex === INDICE_ESLOGAN) return setFase("aplicar_eslogan");
          setFase("nivel_check");
        }}
      />
    );
  }

  if (fase === "aplicar_nombre") {
    return (
      <EligeNombre
        onSaved={async (nombre: string) => {
          await guardarNegocio({ nombreNegocio: nombre });
          setFase("nivel_check");
        }}
      />
    );
  }

  if (fase === "colores_teach") {
    return <ColoresTeach onNext={() => setFase("aplicar_colores")} />;
  }

  if (fase === "aplicar_colores") {
    return (
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
          setFase("nivel_check");
        }}
      />
    );
  }

  if (fase === "aplicar_eslogan") {
    return (
      <EligeEslogan
        onSaved={async (eslogan: string) => {
          await guardarNegocio({ eslogan });
          setFase("nivel_check");
        }}
      />
    );
  }

  if (fase === "nivel_check") {
    return (
      <CheckCorto
        lessonId={nivel.codigo}
        moduleNumber={MODULE_NUMBER}
        onPass={async () => {
          await markDone(nivel.codigo);

          if (esUltimoNivel) {
            setFase("reto_final_logo");
            return;
          }

          setNivelIndex(nivelIndex + 1);
          setFase("nivel_teach");
        }}
      />
    );
  }

  if (fase === "reto_final_logo") {
    return (
      <LogoConstructor
        onSaved={async (icono: string, forma: LogoForma) => {
          await guardarNegocio({ logoIcono: icono, logoForma: forma.id });
          setFase("reto_final_vista");
        }}
      />
    );
  }

  if (fase === "reto_final_vista") {
    return (
      <VistaPrevia
        onSaved={async (percepcion: string) => {
          await guardarNegocio({ marcaPercepcion: percepcion });
          setFase("fin_bloque");
        }}
      />
    );
  }

  return (
    <FinBloque
      insignias={NIVELES.map((n) => n.insignia)}
      xp={XP_FIN_BLOQUE_4}
      competencias={COMPETENCIAS_BLOQUE_4}
      onNext={finishModule}
    />
  );
}
