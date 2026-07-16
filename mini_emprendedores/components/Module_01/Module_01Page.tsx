"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { guardarPasoLeccion, leerPasoLeccion, borrarPasoLeccion, segundosDesde } from "@/lib/lessonProgress";
import { SalirLeccion } from "@/components/shared/SalirLeccion";
import { Reto } from "./steps/Reto";
import { Historia } from "./steps/Historia";
import { NivelTeach } from "./steps/NivelTeach";
import { FinBloque } from "./steps/FinBloque";
import { CheckCorto } from "./CheckCorto";
import { NIVELES, COMPETENCIAS_BLOQUE_1, XP_FIN_BLOQUE_1 } from "./data";

const MODULE_NUMBER = 1;

type Fase = "reto" | "historia" | "nivel_teach" | "nivel_check" | "fin_bloque";
const FASES_VALIDAS: Fase[] = ["reto", "historia", "nivel_teach", "nivel_check", "fin_bloque"];

function initialIndexFor(lessonId: string): number {
  const i = NIVELES.findIndex((n) => n.codigo === lessonId);
  return i === -1 ? 0 : i;
}

// Punto de entrada por defecto, seguro para renderizar igual en servidor y
// cliente (no toca localStorage). La reanudación real ocurre después, en un
// efecto que solo corre en el navegador.
function faseDefecto(indexPorDefecto: number): Fase {
  return indexPorDefecto === 0 ? "reto" : "nivel_teach";
}

interface Module01PageProps {
  lessonId?: string;
}

export default function Module01Page({
  lessonId = "s1-u1-a1",
}: Module01PageProps) {
  const router = useRouter();
  const nivelIndex = initialIndexFor(lessonId);
  const [fase, setFaseState] = useState<Fase>(() => faseDefecto(nivelIndex));
  const [inicio] = useState(() => Date.now());
  const [intentosFinales, setIntentosFinales] = useState(1);

  useEffect(() => {
    const guardada = leerPasoLeccion(lessonId);
    if (guardada && FASES_VALIDAS.includes(guardada as Fase)) {
      // Reanuda el paso donde el alumno se quedó (solo ocurre una vez, al
      // montar la lección; no es un ciclo de renders en cascada).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFaseState(guardada as Fase);
    }
  }, [lessonId]);

  function irA(nuevaFase: Fase) {
    guardarPasoLeccion(lessonId, nuevaFase);
    setFaseState(nuevaFase);
  }

  // Cada lección termina volviendo al camino a través de la pantalla
  // compartida de recompensas (XP, estrellas e insignia si aplica). Esa
  // pantalla es la que guarda el avance real (progreso_lecciones) al
  // reclamar la XP, así que aquí no hace falta guardarlo dos veces.
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

      {fase === "reto" && <Reto onNext={() => irA("historia")} />}

      {fase === "historia" && <Historia onNext={() => irA("nivel_teach")} />}

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
          xp={XP_FIN_BLOQUE_1}
          competencias={COMPETENCIAS_BLOQUE_1}
          onNext={() => terminarLeccion(nivel.codigo, nivel.insignia, intentosFinales, XP_FIN_BLOQUE_1)}
        />
      )}
    </>
  );
}
