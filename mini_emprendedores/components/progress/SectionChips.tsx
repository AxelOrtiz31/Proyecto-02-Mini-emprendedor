"use client";

import { Lock, Trophy } from "lucide-react";
import type { Section } from "@/data/course";
import { cn } from "@/lib/utils";

interface SectionChipsProps {
  sections: Section[];
  activeSectionId: string;
  finalExamUnlocked: boolean;
  onSelect: (id: string) => void;
  onStartFinalExam: () => void;
}

export function SectionChips({
  sections,
  activeSectionId,
  finalExamUnlocked,
  onSelect,
  onStartFinalExam,
}: SectionChipsProps) {
  return (
    <nav aria-label="Secciones del camino" className="overflow-x-auto px-4 py-3 lg:hidden">
      <ul className="flex w-max items-center gap-2">
        {sections.map((section) => (
          <li key={section.id}>
            <SectionChip
              section={section}
              active={section.id === activeSectionId}
              onSelect={onSelect}
            />
          </li>
        ))}
        <li>
          <FinalExamChip
            unlocked={finalExamUnlocked}
            onStart={onStartFinalExam}
          />
        </li>
      </ul>
    </nav>
  );
}

function SectionChip({
  section,
  active,
  onSelect,
}: {
  section: Section;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const locked = section.status === "locked";

  return (
    <button
      type="button"
      onClick={() => onSelect(section.id)}
      className={cn(
        "flex items-center gap-2 whitespace-nowrap rounded-full border-2 py-1.5 pl-1.5 pr-3 font-display text-sm font-extrabold transition-colors",
        active && "border-primary bg-card text-foreground shadow-[var(--shadow-card)]",
        !active && "border-border bg-card hover:bg-secondary",
        !active && locked && "text-muted-foreground",
        !active && !locked && "text-foreground",
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
          active && "bg-primary text-primary-foreground",
          !active && locked && "bg-muted text-muted-foreground",
          !active && !locked && "bg-secondary text-secondary-foreground",
        )}
      >
        {locked ? <Lock className="h-3 w-3" strokeWidth={2.6} /> : section.number}
      </span>
      {section.title}
    </button>
  );
}

function FinalExamChip({
  unlocked,
  onStart,
}: {
  unlocked: boolean;
  onStart: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onStart}
      disabled={!unlocked}
      className={cn(
        "flex items-center gap-2 whitespace-nowrap rounded-full border-2 py-1.5 pl-1.5 pr-3 font-display text-sm font-extrabold transition-colors",
        unlocked && "border-primary bg-card text-foreground",
        !unlocked && "cursor-not-allowed border-border bg-card text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
          unlocked && "bg-primary text-primary-foreground",
          !unlocked && "bg-muted text-muted-foreground",
        )}
      >
        {unlocked ? (
          <Trophy className="h-3 w-3" strokeWidth={2.6} />
        ) : (
          <Lock className="h-3 w-3" strokeWidth={2.6} />
        )}
      </span>
      Evaluación final
    </button>
  );
}
