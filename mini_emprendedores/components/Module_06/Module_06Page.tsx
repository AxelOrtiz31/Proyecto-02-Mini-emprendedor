"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCompletedLesson } from "@/lib/progress";
import { saveMiNegocio } from "@/lib/negocio";
import { Reto } from "./steps/Reto";
import { NivelTeach } from "./steps/NivelTeach";
import { Calculadora } from "./steps/Calculadora";
import { FinBloque } from "./steps/FinBloque";
import { CheckCorto } from "./CheckCorto";
import { NIVELES, COMPETENCIAS_BLOQUE_6, XP_FIN_BLOQUE_6 } from "./data";

const MODULE_NUMBER = 6;
const CODIGO_RETO_FINAL = "s6-u1-a5";

type Fase = "reto" | "nivel_teach" | "nivel_check" | "calculadora" | "fin_bloque";

function initialStateFor(lessonId: string): { fase: Fase; index: number } {
  if (lessonId === CODIGO_RETO_FINAL) {
    return { fase: "calculadora", index: NIVELES.length - 1 };
  }

  const i = NIVELES.findIndex((n) => n.codigo === lessonId);
  if (i === -1) return { fase: "reto", index: 0 };
  return { fase: "nivel_teach", index: i };
}

interface Module06PageProps {
  lessonId?: string;
}

export default function Module06Page({
  lessonId = "s6-u1-a1",
}: Module06PageProps) {
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
            setFase("calculadora");
            return;
          }

          setNivelIndex(nivelIndex + 1);
          setFase("nivel_teach");
        }}
      />
    );
  }

  if (fase === "calculadora") {
    return (
      <Calculadora
        onSaved={async ({ costo, precio, estrategia }) => {
          try {
            await saveMiNegocio({
              ideaCosto: costo,
              ideaPrecio: precio,
              ideaGanancia: precio - costo,
              ideaEstrategia: estrategia,
            });
          } catch (error) {
            console.error("No se pudo guardar tu cálculo:", error);
          }
          setFase("fin_bloque");
        }}
      />
    );
  }

  return (
    <FinBloque
      insignias={NIVELES.map((n) => n.insignia)}
      xp={XP_FIN_BLOQUE_6}
      competencias={COMPETENCIAS_BLOQUE_6}
      onNext={finishModule}
    />
  );
}
