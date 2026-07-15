"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCompletedLesson } from "@/lib/progress";
import { Reto } from "./steps/Reto";
import { Historia } from "./steps/Historia";
import { NivelTeach } from "./steps/NivelTeach";
import { FinBloque } from "./steps/FinBloque";
import { CheckCorto } from "./CheckCorto";
import { NIVELES, COMPETENCIAS_BLOQUE_1, XP_FIN_BLOQUE_1 } from "./data";

const MODULE_NUMBER = 1;

type Fase = "reto" | "historia" | "nivel_teach" | "nivel_check" | "fin_bloque";

function initialIndexFor(lessonId: string): number {
  const i = NIVELES.findIndex((n) => n.codigo === lessonId);
  return i === -1 ? 0 : i;
}

interface Module01PageProps {
  lessonId?: string;
}

export default function Module01Page({
  lessonId = "s1-u1-a1",
}: Module01PageProps) {
  const router = useRouter();
  const startIndex = initialIndexFor(lessonId);
  const [fase, setFase] = useState<Fase>(startIndex === 0 ? "reto" : "nivel_teach");
  const [nivelIndex, setNivelIndex] = useState(startIndex);

  async function markDone(code: string) {
    try {
      await saveCompletedLesson(code);
    } catch (error) {
      console.error("No se pudo guardar el avance:", error);
    }
  }

  function finishModule() {
    const ultimo = NIVELES[NIVELES.length - 1].codigo;
    router.push(`/modules01_06_complete/modulecomplete?lesson=${ultimo}`);
  }

  if (fase === "reto") {
    return <Reto onNext={() => setFase("historia")} />;
  }

  if (fase === "historia") {
    return <Historia onNext={() => setFase("nivel_teach")} />;
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
          if (esUltimoNivel) {
            setFase("fin_bloque");
            return;
          }

          await markDone(nivel.codigo);
          setNivelIndex(nivelIndex + 1);
          setFase("nivel_teach");
        }}
      />
    );
  }

  return (
    <FinBloque
      insignias={NIVELES.map((n) => n.insignia)}
      xp={XP_FIN_BLOQUE_1}
      competencias={COMPETENCIAS_BLOQUE_1}
      onNext={finishModule}
    />
  );
}
