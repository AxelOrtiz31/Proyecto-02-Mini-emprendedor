"use client";

import type { EvaluationQuestion } from "@/lib/evaluations";
import { OptionButton } from "./OptionButton";

interface QuestionCardProps {
  question: EvaluationQuestion;
  selected: number[];
  onToggle: (optionId: number) => void;
}

export function QuestionCard({ question, selected, onToggle }: QuestionCardProps) {
  return (
    <div key={question.id} className="mx-auto w-full max-w-md animate-fade-in-up">
      <h1 className="text-center font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
        {question.text}
      </h1>
      {question.multiple && (
        <p className="mt-2 text-center text-sm font-bold text-muted-foreground">
          Selecciona todas las que apliquen
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            selected={selected.includes(option.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
