"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "./TopBar";
import { SectionSidebar } from "./SectionSidebar";
import { SectionChips } from "./SectionChips";
import { UnitBanner } from "./UnitBanner";
import { CoursePath } from "./CoursePath";
import { MascotPanel } from "./MascotPanel";
import { deriveCourse, fetchCompletedCodes, fetchXpTotal, estrellasForCompleted } from "@/lib/progress";
import { calculateStreak, fetchCompletionTimestamps } from "@/lib/streak";
import { playMusic } from "@/audio/AudioManager";

export function CaminoView() {
  const router = useRouter();

  useEffect(() => {
    playMusic("dashboard");
  }, []);

  const [completedIds, setCompletedIds] = useState<string[] | null>(null);
  // Las fechas de las lecciones completadas alimentan la racha y el calendario
  // del modal, así que se guardan enteras en vez de solo el número de racha.
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollingTo = useRef<string | null>(null);
  const didInitialScroll = useRef(false);

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      try {
        const [codes, completionTimes, xpTotal] = await Promise.all([
          fetchCompletedCodes(),
          fetchCompletionTimestamps(),
          fetchXpTotal(),
        ]);

        if (!active) return;

        setCompletedIds(codes);
        setTimestamps(completionTimes);
        setXp(xpTotal);
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

  const streak = useMemo(() => calculateStreak(timestamps), [timestamps]);

  const sections = useMemo(() => {
    if (!loaded) return [];

    return deriveCourse(completedIds);
  }, [completedIds, loaded]);

  const currentSectionId = useMemo(() => {
    if (!sections.length) return null;

    return (
      sections.find((section) => section.status === "current")?.id ??
      [...sections].reverse().find((section) => section.status === "completed")?.id ??
      sections[0].id
    );
  }, [sections]);

  const robotActivityId = useMemo(() => {
    if (!sections.length) return null;

    const all = sections.flatMap((section) =>
      section.units.flatMap((unit) => unit.activities),
    );

    return all.find((activity) => activity.status === "current")?.id ?? all[all.length - 1]?.id ?? null;
  }, [sections]);

  const estrellas = useMemo(() => {
    if (!completedIds) return 0;

    return estrellasForCompleted(completedIds);
  }, [completedIds]);

  useEffect(() => {
    if (!loaded || !currentSectionId || didInitialScroll.current) return;

    didInitialScroll.current = true;
    setActiveSectionId(currentSectionId);


    if (sections[0]?.id === currentSectionId) return;

    requestAnimationFrame(() => {
      sectionRefs.current[currentSectionId]?.scrollIntoView({ block: "start" });
    });
  }, [loaded, currentSectionId, sections]);


  useEffect(() => {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingTo.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const first = visible[0]?.target.getAttribute("data-section-id");

        if (first) setActiveSectionId(first);
      },
      { rootMargin: "-30% 0px -50% 0px" },
    );

    for (const element of Object.values(sectionRefs.current)) {
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sections]);


  function handleStartFinalExam() {
    router.push("/evaluation");
  }

  function handleSelectSection(id: string) {
    setActiveSectionId(id);
    scrollingTo.current = id;

    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

    window.setTimeout(() => {
      scrollingTo.current = null;
    }, 900);
  }

  if (!loaded || !sections.length) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  const activeSection =
    sections.find((section) => section.id === activeSectionId) ?? sections[0];

  const currentIndex = sections.findIndex((section) => section.id === currentSectionId);
  const currentSection = currentIndex !== -1 ? sections[currentIndex] : null;
  const nextSection = currentIndex !== -1 ? sections[currentIndex + 1] ?? null : null;
  const courseComplete = sections.every((section) => section.status === "completed");

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <TopBar streak={streak} estrellas={estrellas} xp={xp} timestamps={timestamps} />

      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-7xl">
          <SectionChips
            sections={sections}
            activeSectionId={activeSection.id}
            finalExamUnlocked={courseComplete}
            onSelect={handleSelectSection}
            onStartFinalExam={handleStartFinalExam}
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl xl:max-w-360 xl:gap-6 2xl:max-w-448 2xl:gap-10">
        <SectionSidebar
          sections={sections}
          activeSectionId={activeSection.id}
          finalExamUnlocked={courseComplete}
          onSelect={handleSelectSection}
          onStartFinalExam={handleStartFinalExam}
        />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full xl:max-w-160 2xl:max-w-200">
            {/* Banner fijo: siempre visible y cambia según la sección que recorres. */}
            <div className="sticky top-30 z-20 lg:top-18">
              <UnitBanner
                key={activeSection.id}
                sectionNumber={activeSection.number}
                unit={activeSection.units[0]}
              />
            </div>

            <CoursePath
              sections={sections}
              robotActivityId={robotActivityId}
              registerSection={(id, element) => {
                sectionRefs.current[id] = element;
              }}
            />
          </div>

          <MascotPanel
            variant="inline"
            currentSection={currentSection}
            nextSection={nextSection}
            courseComplete={courseComplete}
            streak={streak}
          />
        </main>

        <MascotPanel
          variant="sidebar"
          currentSection={currentSection}
          nextSection={nextSection}
          courseComplete={courseComplete}
          streak={streak}
        />
      </div>
    </div>
  );
}
