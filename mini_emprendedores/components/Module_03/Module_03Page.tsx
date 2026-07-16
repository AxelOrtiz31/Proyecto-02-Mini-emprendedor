"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveMiNegocio } from "@/lib/negocio";
import { guardarPasoLeccion, leerPasoLeccion, borrarPasoLeccion, segundosDesde } from "@/lib/lessonProgress";
import { SalirLeccion } from "@/components/shared/SalirLeccion";
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
const FASES_VALIDAS: Fase[] = ["reto", "nivel_teach", "detective", "nivel_check", "reto_final", "fin_bloque"];

function initialStateFor(lessonId: string): { fase: Fase; index: number } {
  if (lessonId === CODIGO_RETO_FINAL) {
    return { fase: "reto_final", index: NIVELES.length - 1 };
  }

  const i = NIVELES.findIndex((n) => n.codigo === lessonId);
  if (i === -1) return { fase: "reto", index: 0 };
  return { fase: i === 0 ? "reto" : "nivel_teach", index: i };
}

interface Module03PageProps {
  lessonId?: string;
}

export default function Module03Page({
  lessonId = "s3-u1-a1",
}: Module03PageProps) {
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
  const esNivelPractica = nivelIndex === INDICE_NIVEL_PRACTICA;

  return (
    <>
      <SalirLeccion />

      {fase === "reto" && <Reto onNext={() => irA("nivel_teach")} />}

      {fase === "nivel_teach" && (
        <NivelTeach
          nivel={nivel}
          totalNiveles={NIVELES.length}
          onNext={() => irA(esNivelPractica ? "detective" : "nivel_check")}
        />
      )}

      {fase === "detective" && <DetectiveJuego onDone={() => irA("nivel_check")} />}

      {fase === "nivel_check" && (
        <CheckCorto
          lessonId={nivel.codigo}
          moduleNumber={MODULE_NUMBER}
          onPass={(intentos) => terminarLeccion(nivel.codigo, nivel.insignia, intentos)}
        />
      )}

      {fase === "reto_final" && (
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
            irA("fin_bloque");
          }}
        />
      )}

      {fase === "fin_bloque" && (
        <FinBloque
          insignias={NIVELES.map((n) => n.insignia)}
          xp={XP_FIN_BLOQUE_3}
          competencias={COMPETENCIAS_BLOQUE_3}
          onNext={() => terminarLeccion(CODIGO_RETO_FINAL, undefined, undefined, XP_FIN_BLOQUE_3)}
        />
      )}
    </>
  );
}
