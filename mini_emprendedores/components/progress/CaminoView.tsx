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

  useEffect(() => {
    let active = true;
    fetchCompletedCodes().then((codes) => {
      if (active) setCompletedIds(codes);
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

      <div className="mx-auto flex max-w-7xl xl:max-w-360 xl:gap-6">
        <SectionSidebar
          sections={sections}
          activeSectionId={activeSectionId}
          onSelect={setSelectedSectionId}
        />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full space-y-12 xl:max-w-160 xl:space-y-16">
            {activeSection.units.map((unit, unitIndex) => (
              <section key={unit.id}>
                <UnitBanner sectionNumber={activeSection.number} unit={unit} />
                <LessonPath
                  unit={unit}
                  robotSrc={unitIndex === 0 ? activeSection.robot : undefined}
                  robotSize={unitIndex === 0 ? activeSection.robotSize : undefined}
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
