"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCompletedLesson } from "@/lib/progress";
import { saveMiNegocio } from "@/lib/negocio";
import { Reto } from "./steps/Reto";
import { ExplicacionNombre } from "./steps/ExplicacionNombre";
import { EligeNombre } from "./steps/EligeNombre";
import { ColoresTeach } from "./steps/ColoresTeach";
import { EligeColoresEstilo } from "./steps/EligeColoresEstilo";
import { LogoConstructor } from "./steps/LogoConstructor";
import { VistaPrevia } from "./steps/VistaPrevia";
import { CheckCorto } from "./CheckCorto";
import type { ColorMarca, EstiloMarca, LogoForma } from "./data";

const MODULE_NUMBER = 4;

type Step =
  | "reto"
  | "explicacion_nombre"
  | "elige_nombre"
  | "check_a1"
  | "colores_teach"
  | "elige_colores_estilo"
  | "logo_constructor"
  | "vista_previa"
  | "check_final";

function initialStepFor(lessonId: string): Step {
  if (lessonId === "s4-u1-a2") return "colores_teach";
  if (lessonId === "s4-u1-a3") return "logo_constructor";
  return "reto";
}

interface Module04PageProps {
  lessonId?: string;
}

export default function Module04Page({
  lessonId = "s4-u1-a1",
}: Module04PageProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(() => initialStepFor(lessonId));

  async function markDone(code: string) {
    try {
      await saveCompletedLesson(code);
    } catch (error) {
      console.error("No se pudo guardar el avance:", error);
    }
  }

  async function guardarNegocio(cambios: Parameters<typeof saveMiNegocio>[0]) {
    try {
      await saveMiNegocio(cambios);
    } catch (error) {
      console.error("No se pudo guardar tu negocio:", error);
    }
  }

  function finishModule() {
    router.push("/modules01_06_complete/modulecomplete?lesson=s4-u1-a3");
  }

  if (step === "reto") {
    return <Reto onNext={() => setStep("explicacion_nombre")} />;
  }

  if (step === "explicacion_nombre") {
    return <ExplicacionNombre onNext={() => setStep("elige_nombre")} />;
  }

  if (step === "elige_nombre") {
    return (
      <EligeNombre
        onSaved={async (nombre: string) => {
          await guardarNegocio({ nombreNegocio: nombre });
          setStep("check_a1");
        }}
      />
    );
  }

  if (step === "check_a1") {
    return (
      <CheckCorto
        lessonId="s4-u1-a1"
        moduleNumber={MODULE_NUMBER}
        onPass={async () => {
          await markDone("s4-u1-a1");
          setStep("colores_teach");
        }}
      />
    );
  }

  if (step === "colores_teach") {
    return <ColoresTeach onNext={() => setStep("elige_colores_estilo")} />;
  }

  if (step === "elige_colores_estilo") {
    return (
      <EligeColoresEstilo
        onSaved={async (
          colores: { primario: ColorMarca; secundario: ColorMarca },
          estilo: EstiloMarca,
        ) => {
          await guardarNegocio({
            colorPrimario: colores.primario.hex,
            colorSecundario: colores.secundario.hex,
            estiloMarca: estilo.id,
          });
          await markDone("s4-u1-a2");
          setStep("logo_constructor");
        }}
      />
    );
  }

  if (step === "logo_constructor") {
    return (
      <LogoConstructor
        onSaved={async (icono: string, forma: LogoForma) => {
          await guardarNegocio({ logoIcono: icono, logoForma: forma.id });
          setStep("vista_previa");
        }}
      />
    );
  }

  if (step === "vista_previa") {
    return <VistaPrevia onNext={() => setStep("check_final")} />;
  }

  return (
    <CheckCorto
      lessonId="s4-u1-a3"
      moduleNumber={MODULE_NUMBER}
      onPass={finishModule}
    />
  );
}
