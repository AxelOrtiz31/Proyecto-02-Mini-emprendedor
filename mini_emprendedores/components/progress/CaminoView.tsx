"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TopBar } from "./TopBar";
import { SectionSidebar } from "./SectionSidebar";
import { SectionChips } from "./SectionChips";
import { UnitBanner } from "./UnitBanner";
import { CoursePath } from "./CoursePath";
import { MascotPanel } from "./MascotPanel";
import { deriveCourse, fetchCompletedCodes, xpForCompleted } from "@/lib/progress";

export function CaminoView() {
  const [completedIds, setCompletedIds] = useState<string[] | null>(null);
  // Sección resaltada en el sidebar y mostrada en el banner fijo.
  // Se actualiza al hacer scroll (scroll-spy) o al hacer clic en el sidebar/chips.
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  // Evita que el scroll-spy pelee con el scroll suave al hacer clic.
  const scrollingTo = useRef<string | null>(null);
  const didInitialScroll = useRef(false);

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

  // Sección donde está el progreso actual del alumno.
  const currentSectionId = useMemo(() => {
    if (!sections.length) return null;

    return (
      sections.find((section) => section.status === "current")?.id ??
      [...sections].reverse().find((section) => section.status === "completed")?.id ??
      sections[0].id
    );
  }, [sections]);

  // Actividad donde debe pararse el robot: la actividad "current" global.
  // Si el curso está terminado, se queda en la última actividad.
  const robotActivityId = useMemo(() => {
    if (!sections.length) return null;

    const all = sections.flatMap((section) =>
      section.units.flatMap((unit) => unit.activities),
    );

    return all.find((activity) => activity.status === "current")?.id ?? all[all.length - 1]?.id ?? null;
  }, [sections]);

  const xp = useMemo(() => {
    if (!completedIds) return 0;

    return xpForCompleted(completedIds);
  }, [completedIds]);

  // Al cargar, lleva al alumno directo a la sección donde va su progreso.
  useEffect(() => {
    if (!loaded || !currentSectionId || didInitialScroll.current) return;

    didInitialScroll.current = true;
    setActiveSectionId(currentSectionId);

    // Solo hace falta desplazarse si el progreso no está en la primera sección.
    if (sections[0]?.id === currentSectionId) return;

    requestAnimationFrame(() => {
      sectionRefs.current[currentSectionId]?.scrollIntoView({ block: "start" });
    });
  }, [loaded, currentSectionId, sections]);

  // Scroll-spy: mientras se recorre el camino, resalta la sección visible
  // en el sidebar y actualiza el banner fijo.
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

  // Clic en el sidebar o en los chips: desplaza suavemente hasta esa sección
  // sin salir del camino.
  function handleSelectSection(id: string) {
    setActiveSectionId(id);
    scrollingTo.current = id;

    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

    // Libera el scroll-spy cuando termina el desplazamiento suave.
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

  // Datos reales de progreso para el panel derecho (saludo y próxima sección).
  const currentIndex = sections.findIndex((section) => section.id === currentSectionId);
  const currentSection = currentIndex !== -1 ? sections[currentIndex] : null;
  const nextSection = currentIndex !== -1 ? sections[currentIndex + 1] ?? null : null;
  const courseComplete = sections.every((section) => section.status === "completed");

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <TopBar streak={12} ideas={500} xp={xp} />

      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-7xl">
          <SectionChips
            sections={sections}
            activeSectionId={activeSection.id}
            onSelect={handleSelectSection}
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl xl:max-w-360 xl:gap-6 2xl:max-w-448 2xl:gap-10">
        <SectionSidebar
          sections={sections}
          activeSectionId={activeSection.id}
          onSelect={handleSelectSection}
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
          />
        </main>

        <MascotPanel
          variant="sidebar"
          currentSection={currentSection}
          nextSection={nextSection}
          courseComplete={courseComplete}
        />
      </div>
    </div>
  );
}
