"use client";

import { useMemo, useState } from "react";
import { TopBar } from "./TopBar";
import { SectionSidebar } from "./SectionSidebar";
import { SectionChips } from "./SectionChips";
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
    <div className="min-h-screen overflow-x-clip bg-background">
      <TopBar streak={12} ideas={500} xp={1240} />

      <div className="mx-auto max-w-7xl">
        <SectionChips
          sections={course}
          activeSectionId={activeSectionId}
          onSelect={setActiveSectionId}
        />
      </div>

      <div className="mx-auto flex max-w-7xl">
        <SectionSidebar
          sections={course}
          activeSectionId={activeSectionId}
          onSelect={setActiveSectionId}
        />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="space-y-12">
            {activeSection.units.map((unit) => (
              <section key={unit.id}>
                <UnitBanner sectionNumber={activeSection.number} unit={unit} />
                <LessonPath unit={unit} />
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
