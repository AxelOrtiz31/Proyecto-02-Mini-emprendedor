"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCompletedLesson } from "@/lib/progress";
import { saveMiNegocio } from "@/lib/negocio";
import { Reto } from "./steps/Reto";  
import { Historia } from "./steps/Historia";
import { Explicacion } from "./steps/Explicacion";
import { DetectiveJuego } from "./steps/DetectiveJuego";
import { EligeCliente } from "./steps/EligeCliente";
import { CheckCorto } from "./CheckCorto";
import type { ClientePersona } from "./data";

const MODULE_NUMBER = 3;

type Step =
  | "reto"
  | "historia"
  | "explicacion"
  | "check_a1"
  | "detective_juego"
  | "elige_cliente"
  | "check_final";

function initialStepFor(lessonId: string): Step {
  if (lessonId === "s3-u1-a2") return "detective_juego";
  if (lessonId === "s3-u1-a3") return "elige_cliente";
  return "reto";
}

interface Module03PageProps {
  lessonId?: string;
}

export default function Module03Page({
  lessonId = "s3-u1-a1",
}: Module03PageProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(() => initialStepFor(lessonId));

  async function markDone(code: string) {
    try {
      await saveCompletedLesson(code);
    } catch (error) {
      console.error("No se pudo guardar el avance:", error);
    }
  }

  function finishModule() {
    router.push("/modules01_06_complete/modulecomplete?lesson=s3-u1-a3");
  }

  if (step === "reto") {
    return <Reto onNext={() => setStep("historia")} />;
  }

  if (step === "historia") {
    return <Historia onNext={() => setStep("explicacion")} />;
  }

  if (step === "explicacion") {
    return <Explicacion onNext={() => setStep("check_a1")} />;
  }

  if (step === "check_a1") {
    return (
      <CheckCorto
        lessonId="s3-u1-a1"
        moduleNumber={MODULE_NUMBER}
        onPass={async () => {
          await markDone("s3-u1-a1");
          setStep("detective_juego");
        }}
      />
    );
  }

  if (step === "detective_juego") {
    return (
      <DetectiveJuego
        onDone={async () => {
          await markDone("s3-u1-a2");
          setStep("elige_cliente");
        }}
      />
    );
  }

  if (step === "elige_cliente") {
    return (
      <EligeCliente
        onSaved={async (persona: ClientePersona) => {
          try {
            await saveMiNegocio({
              clienteId: persona.id,
              clienteNombre: persona.nombre,
              clienteEmoji: persona.emoji,
            });
          } catch (error) {
            console.error("No se pudo guardar tu negocio:", error);
          }
          setStep("check_final");
        }}
      />
    );
  }

  return (
    <CheckCorto
      lessonId="s3-u1-a3"
      moduleNumber={MODULE_NUMBER}
      onPass={finishModule}
    />
  );
}
