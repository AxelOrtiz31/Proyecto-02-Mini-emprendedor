"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveMiNegocio } from "@/lib/negocio";
import { guardarPasoLeccion, leerPasoLeccion, borrarPasoLeccion, segundosDesde } from "@/lib/lessonProgress";
import { SalirLeccion } from "@/components/shared/SalirLeccion";
import { Reto } from "./steps/Reto";
import { NivelTeach } from "./steps/NivelTeach";
import { IdeaNegocio } from "./steps/IdeaNegocio";
import { FinBloque } from "./steps/FinBloque";
import { CheckCorto } from "./CheckCorto";
import { NIVELES, COMPETENCIAS_BLOQUE_2, XP_FIN_BLOQUE_2 } from "./data";

const MODULE_NUMBER = 2;

type Fase = "reto" | "nivel_teach" | "nivel_idea" | "nivel_check" | "fin_bloque";
const FASES_VALIDAS: Fase[] = ["reto", "nivel_teach", "nivel_idea", "nivel_check", "fin_bloque"];

function initialIndexFor(lessonId: string): number {
  const i = NIVELES.findIndex((n) => n.codigo === lessonId);
  return i === -1 ? 0 : i;
}

function faseDefecto(indexPorDefecto: number): Fase {
  return indexPorDefecto === 0 ? "reto" : "nivel_teach";
}

interface Module02PageProps {
  lessonId?: string;
}

export default function Module02Page({
  lessonId = "s2-u1-a1",
}: Module02PageProps) {
  const router = useRouter();
  const nivelIndex = initialIndexFor(lessonId);
  const [fase, setFaseState] = useState<Fase>(() => faseDefecto(nivelIndex));
  const [inicio] = useState(() => Date.now());
  const [intentosFinales, setIntentosFinales] = useState(1);

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
      tiempo: String(segundosDesde(inicio)),
      intentos: String(intentos ?? intentosFinales),
    });
    if (insignia) params.set("insignia", insignia);
    if (xpBonus) params.set("xpBonus", String(xpBonus));
    router.push(`/modules01_06_complete/modulecomplete?${params.toString()}`);
  }

  const nivel = NIVELES[nivelIndex];
  const esUltimoNivel = nivelIndex === NIVELES.length - 1;

  return (
    <>
      <SalirLeccion />

      {fase === "reto" && <Reto onNext={() => irA("nivel_teach")} />}

      {fase === "nivel_teach" && (
        <NivelTeach
          nivel={nivel}
          totalNiveles={NIVELES.length}
          onNext={() => irA(esUltimoNivel ? "nivel_idea" : "nivel_check")}
        />
      )}

      {fase === "nivel_idea" && (
        <IdeaNegocio
          onSaved={async (idea) => {
            try {
              await saveMiNegocio({
                ideaNombre: idea.nombre,
                ideaTipo: idea.tipo,
                ideaAyuda: idea.ayuda,
              });
            } catch (error) {
              console.error("No se pudo guardar tu idea:", error);
            }
            irA("nivel_check");
          }}
        />
      )}

      {fase === "nivel_check" && (
        <CheckCorto
          lessonId={nivel.codigo}
          moduleNumber={MODULE_NUMBER}
          onPass={(intentos) => {
            if (esUltimoNivel) {
              setIntentosFinales(intentos);
              irA("fin_bloque");
              return;
            }

            terminarLeccion(nivel.codigo, nivel.insignia, intentos);
          }}
        />
      )}

      {fase === "fin_bloque" && (
        <FinBloque
          insignias={NIVELES.map((n) => n.insignia)}
          xp={XP_FIN_BLOQUE_2}
          competencias={COMPETENCIAS_BLOQUE_2}
          onNext={() => terminarLeccion(nivel.codigo, nivel.insignia, intentosFinales, XP_FIN_BLOQUE_2)}
        />
      )}
    </>
  );
}
