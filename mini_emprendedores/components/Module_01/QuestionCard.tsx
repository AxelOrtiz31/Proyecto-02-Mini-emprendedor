"use client";

import type { EvaluationQuestion } from "@/lib/evaluations";
import { OptionButton } from "./OptionButton";
import { SpeakButton } from "@/controllers/SpeakButtonController";

interface QuestionCardProps {
  question: EvaluationQuestion;
  selected: number[];
  showResult: boolean;
  answerIsCorrect: boolean;
  onToggle: (optionId: number) => void;
}

export function QuestionCard({
  question,
  selected,
  showResult,
  answerIsCorrect,
  onToggle,
}: QuestionCardProps) {
  return (
    <div key={question.id} className="mx-auto w-full animate-fade-in-up">
      <div className="flex items-center justify-center gap-2">
        <SpeakButton
          text={`
            ${question.text}

            ${question.options
              .map(
                (option, index) =>
                  `${String.fromCharCode(65 + index)}. ${option.label}`
              )
              .join(". ")}
          `}
        />

        <h1 className="text-center font-display text-2xl font-extrabold leading-tight text-foreground sm:text-2xl lg:text-4xl">
          {question.text}
        </h1>
      </div>
      

      {question.multiple && (
        <p className="mt-3 text-center text-sm font-bold text-muted-foreground">
          Selecciona todas las que apliquen
        </p>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:gap-4">
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            selected={selected.includes(option.id)}
            showResult={showResult}
            onToggle={onToggle}
          />
        ))}
      </div>

      {showResult && (
        <div
          className={
            answerIsCorrect
              ? "mt-5 rounded-2xl border-2 border-success/40 bg-success/10 px-4 py-3 text-sm font-extrabold text-success"
              : "mt-5 rounded-2xl border-2 border-primary/30 bg-primary/10 px-4 py-3 text-sm font-extrabold text-primary"
          }
        >
          {answerIsCorrect
            ? "¡Correcto! Puedes continuar."
            : "Aún no es la respuesta correcta. Intenta elegir otra opción."}
        </div>
      )}
    </div>
  );
}