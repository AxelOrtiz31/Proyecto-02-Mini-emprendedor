"use client";

import { Lock, Sparkles } from "lucide-react";
import type { Section } from "@/data/course";
import { cn } from "@/lib/utils";

interface SectionSidebarProps {
  sections: Section[];
  activeSectionId: string;
  onSelect: (id: string) => void;
}

export function SectionSidebar({
  sections,
  activeSectionId,
  onSelect,
}: SectionSidebarProps) {
  return (
    <aside className="hidden w-60 shrink-0 lg:block xl:w-64">
      <div className="sticky top-20 p-5">
        <div className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Tu camino
        </div>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <SectionButton
                section={section}
                active={section.id === activeSectionId}
                onSelect={onSelect}
              />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function SectionButton({
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
        "flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-3 text-left transition-colors",
        active
          ? "border-primary bg-card shadow-(--shadow-card)"
          : "border-transparent hover:bg-card",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-base font-extrabold",
          active && "bg-primary text-primary-foreground",
          !active && locked && "bg-muted text-muted-foreground",
          !active && !locked && "bg-secondary text-secondary-foreground",
        )}
      >
        {locked ? <Lock className="h-4 w-4" strokeWidth={2.6} /> : section.number}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Sección {section.number}
        </span>
        <span
          className={cn(
            "block truncate font-display text-sm font-extrabold",
            locked ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {section.title}
        </span>
      </span>

      {active && <Sparkles className="h-4 w-4 shrink-0 text-primary" />}
    </button>
  );
}
