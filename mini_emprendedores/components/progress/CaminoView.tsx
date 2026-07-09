"use client";

import { useEffect, useMemo, useState } from "react";
import { TopBar } from "./TopBar";
import { SectionSidebar } from "./SectionSidebar";
import { SectionChips } from "./SectionChips";
import { UnitBanner } from "./UnitBanner";
import { LessonPath } from "./LessonPath";
import { MascotPanel } from "./MascotPanel";
import { deriveCourse, fetchCompletedCodes, xpForCompleted } from "@/lib/progress";

export function CaminoView() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetchCompletedCodes().then((codes) => {
      if (!active) return;
      setCompletedIds(codes);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const sections = useMemo(() => deriveCourse(completedIds), [completedIds]);

  const currentSectionId = useMemo(
    () => sections.find((s) => s.status === "current")?.id ?? sections[0].id,
    [sections],
  );

  const activeSectionId = selectedSectionId ?? currentSectionId;
  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0];
  const xp = xpForCompleted(completedIds);

  // El robot camina en la unidad donde está la lección actual; si la sección ya
  // se completó, se queda en la última unidad con avance.
  const robotUnitId = useMemo(() => {
    const units = activeSection.units;
    const withCurrent = units.find((u) => u.activities.some((a) => a.status === "current"));
    const withProgress = [...units]
      .reverse()
      .find((u) => u.activities.some((a) => a.status === "completed"));
    return (withCurrent ?? withProgress ?? units[0]).id;
  }, [activeSection]);

  // Mientras no lleguen las lecciones completadas mostramos un loader breve, para que
  // el primer render con contenido ya use la sección correcta y no parpadee a la sección 1.
  if (!loaded) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <TopBar streak={12} ideas={500} xp={xp} />

      <div className="mx-auto max-w-7xl">
        <SectionChips
          sections={sections}
          activeSectionId={activeSectionId}
          onSelect={setSelectedSectionId}
        />
      </div>

      <div className="mx-auto flex max-w-7xl xl:max-w-360 xl:gap-6 2xl:max-w-448 2xl:gap-10">
        <SectionSidebar
          sections={sections}
          activeSectionId={activeSectionId}
          onSelect={setSelectedSectionId}
        />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full space-y-12 xl:max-w-160 xl:space-y-16 2xl:max-w-200">
            {activeSection.units.map((unit) => (
              <section key={unit.id}>
                <UnitBanner sectionNumber={activeSection.number} unit={unit} />
                <LessonPath
                  unit={unit}
                  robotSrc={unit.id === robotUnitId ? activeSection.robot : undefined}
                  robotSize={unit.id === robotUnitId ? activeSection.robotSize : undefined}
                />
              </section>
            ))}
          </div>

          <MascotPanel variant="inline" />
        </main>

        <MascotPanel variant="sidebar" />
      </div>
    </div>
  );
}
