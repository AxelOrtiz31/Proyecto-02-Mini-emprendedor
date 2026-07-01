"use client";

import { useMemo, useState } from "react";
import { TopBar } from "./TopBar";
import { SectionSidebar } from "./SectionSidebar";
import { UnitBanner } from "./UnitBanner";
import { LessonPath } from "./LessonPath";
import { MascotPanel } from "./MascotPanel";
import { course } from "@/data/course";

export function CaminoView() {
  const [activeSectionId, setActiveSectionId] = useState(
    course.find((s) => s.status === "current")?.id ?? course[0].id,
  );

  const activeSection = useMemo(
    () => course.find((s) => s.id === activeSectionId) ?? course[0],
    [activeSectionId],
  );

  return (
    <div className="min-h-screen bg-background">
      <TopBar streak={12} ideas={500} xp={1240} />

      <div className="mx-auto flex max-w-7xl">
        <SectionSidebar
          sections={course}
          activeSectionId={activeSectionId}
          onSelect={setActiveSectionId}
        />

        <main className="min-w-0 flex-1 px-4 py-8 md:px-8">
          {activeSection.units.length === 0 ? (
            <LockedSection
              title={activeSection.title}
              number={activeSection.number}
            />
          ) : (
            <div className="space-y-12">
              {activeSection.units.map((unit, idx) => (
                <section key={unit.id}>
                  <UnitBanner sectionNumber={activeSection.number} unit={unit} />
                  <LessonPath unit={unit} />
                  {idx < activeSection.units.length - 1 && (
                    <div className="mx-auto my-2 h-px w-24 bg-border" />
                  )}
                </section>
              ))}
            </div>
          )}
        </main>

        <MascotPanel />
      </div>
    </div>
  );
}

function LockedSection({ title, number }: { title: string; number: number }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-3xl border-2 border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted font-display text-2xl font-extrabold text-muted-foreground">
        {number}
      </div>
      <h2 className="font-display text-xl font-extrabold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Esta sección se desbloquea cuando completes la anterior. ¡Sigue avanzando!
      </p>
    </div>
  );
}
