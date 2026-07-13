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
  const [completedIds, setCompletedIds] = useState<string[] | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      try {
        const codes = await fetchCompletedCodes();

        if (!active) return;

        setCompletedIds(codes);
      } catch (error) {
        console.error("Error cargando progreso:", error);

        if (!active) return;

        setCompletedIds([]);
      }
    }

    loadProgress();

    return () => {
      active = false;
    };
  }, []);

  const loaded = completedIds !== null;

  const sections = useMemo(() => {
    if (!loaded) return [];

    return deriveCourse(completedIds);
  }, [completedIds, loaded]);

  const currentSectionId = useMemo(() => {
    if (!sections.length) return null;

    return sections.find((section) => section.status === "current")?.id ?? sections[0].id;
  }, [sections]);

  const activeSectionId = useMemo(() => {
    if (!sections.length) return null;

    const selectedSectionExists =
      selectedSectionId && sections.some((section) => section.id === selectedSectionId);

    if (selectedSectionExists) {
      return selectedSectionId;
    }

    return currentSectionId;
  }, [sections, selectedSectionId, currentSectionId]);

  const activeSection = useMemo(() => {
    if (!sections.length || !activeSectionId) return null;

    return sections.find((section) => section.id === activeSectionId) ?? null;
  }, [sections, activeSectionId]);

  const xp = useMemo(() => {
    if (!completedIds) return 0;

    return xpForCompleted(completedIds);
  }, [completedIds]);

  if (!loaded || !activeSection || !activeSectionId) {
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
                  robotSrc={activeSection.robot}
                  robotSize={activeSection.robotSize}
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