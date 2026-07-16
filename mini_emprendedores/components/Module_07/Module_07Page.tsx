"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveMiNegocio } from "@/lib/negocio";
import { guardarPasoLeccion, leerPasoLeccion, borrarPasoLeccion, segundosDesde } from "@/lib/lessonProgress";
import { SalirLeccion } from "@/components/shared/SalirLeccion";
import { Reto } from "./steps/Reto";
import { NivelTeach } from "./steps/NivelTeach";
import { ResumenNegocio } from "./steps/ResumenNegocio";
import { MiPitch } from "./steps/MiPitch";
import { FinCurso } from "./steps/FinCurso";
import { CheckCorto } from "./CheckCorto";
import { NIVELES, COMPETENCIAS_CURSO_COMPLETO, XP_GRAN_FINAL } from "./data";

const MODULE_NUMBER = 7;
const CODIGO_RETO_FINAL = "s7-u1-a5";

type Fase = "reto" | "nivel_teach" | "nivel_check" | "resumen" | "pitch" | "fin_curso";
const FASES_VALIDAS: Fase[] = ["reto", "nivel_teach", "nivel_check", "resumen", "pitch", "fin_curso"];

function initialStateFor(lessonId: string): { fase: Fase; index: number } {
  if (lessonId === CODIGO_RETO_FINAL) {
    return { fase: "resumen", index: NIVELES.length - 1 };
  }

  const i = NIVELES.findIndex((n) => n.codigo === lessonId);
  if (i === -1) return { fase: "reto", index: 0 };
  return { fase: i === 0 ? "reto" : "nivel_teach", index: i };
}

interface Module07PageProps {
  lessonId?: string;
}

export default function Module07Page({
  lessonId = "s7-u1-a1",
}: Module07PageProps) {
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
          onNext={() => irA("nivel_check")}
        />
      )}

      {fase === "nivel_check" && (
        <CheckCorto
          lessonId={nivel.codigo}
          moduleNumber={MODULE_NUMBER}
          onPass={(intentos) => terminarLeccion(nivel.codigo, nivel.insignia, intentos)}
        />
      )}

      {fase === "resumen" && <ResumenNegocio onNext={() => irA("pitch")} />}

      {fase === "pitch" && (
        <MiPitch
          onSaved={async ({ diseno, razon }) => {
            try {
              await saveMiNegocio({ pitchDiseno: diseno, pitchRazon: razon });
            } catch (error) {
              console.error("No se pudo guardar tu pitch:", error);
            }
            irA("fin_curso");
          }}
        />
      )}

      {fase === "fin_curso" && (
        <FinCurso
          insignias={NIVELES.map((n) => n.insignia)}
          competencias={COMPETENCIAS_CURSO_COMPLETO}
          onNext={() => terminarLeccion(CODIGO_RETO_FINAL, undefined, undefined, XP_GRAN_FINAL)}
        />
      )}
    </>
  );
}
