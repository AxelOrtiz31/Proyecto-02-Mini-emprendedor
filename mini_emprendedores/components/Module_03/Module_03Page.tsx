"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCompletedLesson } from "@/lib/progress";
import { saveMiNegocio } from "@/lib/negocio";
import { Reto } from "./steps/Reto";
import { NivelTeach } from "./steps/NivelTeach";
import { DetectiveJuego } from "./steps/DetectiveJuego";
import { RetoFinal } from "./steps/RetoFinal";
import { FinBloque } from "./steps/FinBloque";
import { CheckCorto } from "./CheckCorto";
import { NIVELES, COMPETENCIAS_BLOQUE_3, XP_FIN_BLOQUE_3 } from "./data";
import type { ClientePersona } from "./data";

const MODULE_NUMBER = 3;
const CODIGO_RETO_FINAL = "s3-u1-a5";
const INDICE_NIVEL_PRACTICA = 2; // Nivel 11: incluye el juego de emparejar

type Fase = "reto" | "nivel_teach" | "detective" | "nivel_check" | "reto_final" | "fin_bloque";

function initialStateFor(lessonId: string): { fase: Fase; index: number } {
  if (lessonId === CODIGO_RETO_FINAL) {
    return { fase: "reto_final", index: NIVELES.length - 1 };
  }

  const i = NIVELES.findIndex((n) => n.codigo === lessonId);
  if (i === -1) return { fase: "reto", index: 0 };
  return { fase: "nivel_teach", index: i };
}

interface Module03PageProps {
  lessonId?: string;
}

export default function Module03Page({
  lessonId = "s3-u1-a1",
}: Module03PageProps) {
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
  const esNivelPractica = nivelIndex === INDICE_NIVEL_PRACTICA;

  if (fase === "nivel_teach") {
    return (
      <NivelTeach
        nivel={nivel}
        totalNiveles={NIVELES.length}
        onNext={() => setFase(esNivelPractica ? "detective" : "nivel_check")}
      />
    );
  }

  if (fase === "detective") {
    return <DetectiveJuego onDone={() => setFase("nivel_check")} />;
  }

  if (fase === "nivel_check") {
    return (
      <CheckCorto
        lessonId={nivel.codigo}
        moduleNumber={MODULE_NUMBER}
        onPass={async () => {
          await markDone(nivel.codigo);

          if (esUltimoNivel) {
            setFase("reto_final");
            return;
          }

          setNivelIndex(nivelIndex + 1);
          setFase("nivel_teach");
        }}
      />
    );
  }

  if (fase === "reto_final") {
    return (
      <RetoFinal
        onSaved={async ({ persona, necesita, lugares }: {
          persona: ClientePersona;
          necesita: string;
          lugares: string;
        }) => {
          try {
            await saveMiNegocio({
              clienteId: persona.id,
              clienteNombre: persona.nombre,
              clienteEmoji: persona.emoji,
              clienteNecesita: necesita,
              clienteDondeEncontrar: lugares,
            });
          } catch (error) {
            console.error("No se pudo guardar tu cliente:", error);
          }
          setFase("fin_bloque");
        }}
      />
    );
  }

  return (
    <FinBloque
      insignias={NIVELES.map((n) => n.insignia)}
      xp={XP_FIN_BLOQUE_3}
      competencias={COMPETENCIAS_BLOQUE_3}
      onNext={finishModule}
    />
  );
}
