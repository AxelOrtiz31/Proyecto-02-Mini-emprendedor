"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCompletedLesson } from "@/lib/progress";
import { saveMiNegocio } from "@/lib/negocio";
import { Reto } from "./steps/Reto";
import { NivelTeach } from "./steps/NivelTeach";
import { ResumenNegocio } from "./steps/ResumenNegocio";
import { MiPitch } from "./steps/MiPitch";
import { FinCurso } from "./steps/FinCurso";
import { CheckCorto } from "./CheckCorto";
import { NIVELES, COMPETENCIAS_CURSO_COMPLETO } from "./data";

const MODULE_NUMBER = 7;
const CODIGO_RETO_FINAL = "s7-u1-a5";

type Fase = "reto" | "nivel_teach" | "nivel_check" | "resumen" | "pitch" | "fin_curso";

function initialStateFor(lessonId: string): { fase: Fase; index: number } {
  if (lessonId === CODIGO_RETO_FINAL) {
    return { fase: "resumen", index: NIVELES.length - 1 };
  }

  const i = NIVELES.findIndex((n) => n.codigo === lessonId);
  if (i === -1) return { fase: "reto", index: 0 };
  return { fase: "nivel_teach", index: i };
}

interface Module07PageProps {
  lessonId?: string;
}

export default function Module07Page({
  lessonId = "s7-u1-a1",
}: Module07PageProps) {
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
        onNext={() => setFase("nivel_check")}
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
            setFase("resumen");
            return;
          }

          setNivelIndex(nivelIndex + 1);
          setFase("nivel_teach");
        }}
      />
    );
  }

  if (fase === "resumen") {
    return (
      <ResumenNegocio onNext={() => setFase("pitch")} />
    );
  }

  if (fase === "pitch") {
    return (
      <MiPitch
        onSaved={async ({ diseno, razon }) => {
          try {
            await saveMiNegocio({ pitchDiseno: diseno, pitchRazon: razon });
          } catch (error) {
            console.error("No se pudo guardar tu pitch:", error);
          }
          setFase("fin_curso");
        }}
      />
    );
  }

  return (
    <FinCurso
      insignias={NIVELES.map((n) => n.insignia)}
      competencias={COMPETENCIAS_CURSO_COMPLETO}
      onNext={finishModule}
    />
  );
}
