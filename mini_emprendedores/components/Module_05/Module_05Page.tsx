"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveMiNegocio } from "@/lib/negocio";
import { guardarPasoLeccion, leerPasoLeccion, borrarPasoLeccion } from "@/lib/lessonProgress";
import { SalirLeccion } from "@/components/shared/SalirLeccion";
import { Reto } from "./steps/Reto";
import { NivelTeach } from "./steps/NivelTeach";
import { DisenoEmpaque } from "./steps/DisenoEmpaque";
import { FinBloque } from "./steps/FinBloque";
import { CheckCorto } from "./CheckCorto";
import { NIVELES, COMPETENCIAS_BLOQUE_5, XP_FIN_BLOQUE_5 } from "./data";

const MODULE_NUMBER = 5;
const CODIGO_RETO_FINAL = "s5-u1-a5";

type Fase = "reto" | "nivel_teach" | "nivel_check" | "diseno_empaque" | "fin_bloque";
const FASES_VALIDAS: Fase[] = ["reto", "nivel_teach", "nivel_check", "diseno_empaque", "fin_bloque"];

function initialStateFor(lessonId: string): { fase: Fase; index: number } {
  if (lessonId === CODIGO_RETO_FINAL) {
    return { fase: "diseno_empaque", index: NIVELES.length - 1 };
  }

  const i = NIVELES.findIndex((n) => n.codigo === lessonId);
  if (i === -1) return { fase: "reto", index: 0 };
  return { fase: i === 0 ? "reto" : "nivel_teach", index: i };
}

interface Module05PageProps {
  lessonId?: string;
}

export default function Module05Page({
  lessonId = "s5-u1-a1",
}: Module05PageProps) {
  const router = useRouter();
  const inicio = initialStateFor(lessonId);
  const [fase, setFaseState] = useState<Fase>(inicio.fase);
  const [nivelIndex] = useState(inicio.index);

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

  function terminarLeccion(code: string, insignia?: string) {
    borrarPasoLeccion(lessonId);
    const params = new URLSearchParams({ lesson: code });
    if (insignia) params.set("insignia", insignia);
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
          onPass={async () => terminarLeccion(nivel.codigo, nivel.insignia)}
        />
      )}

      {fase === "diseno_empaque" && (
        <DisenoEmpaque
          onSaved={async ({ color, material, elementos, ambiental }) => {
            try {
              await saveMiNegocio({
                empaqueColor: color,
                empaqueMaterial: material,
                empaqueElementos: elementos,
                empaqueAmbiental: ambiental,
              });
            } catch (error) {
              console.error("No se pudo guardar tu empaque:", error);
            }
            irA("fin_bloque");
          }}
        />
      )}

      {fase === "fin_bloque" && (
        <FinBloque
          insignias={NIVELES.map((n) => n.insignia)}
          xp={XP_FIN_BLOQUE_5}
          competencias={COMPETENCIAS_BLOQUE_5}
          onNext={() => terminarLeccion(CODIGO_RETO_FINAL)}
        />
      )}
    </>
  );
}
