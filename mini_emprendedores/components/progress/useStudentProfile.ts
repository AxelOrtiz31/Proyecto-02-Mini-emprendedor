"use client";

import { useEffect, useState } from "react";
import {
  fetchStudentProfile,
  isSameStudentProfile,
  readCachedStudentProfile,
} from "@/lib/studentProfile";

// Perfil del alumno para mostrar en pantalla. Si ya se conoce (por haber pasado
// antes por el camino), aparece al instante y se revisa en segundo plano; el
// componente solo se vuelve a renderizar si algo cambió de verdad.
export function useStudentProfile() {
  const [state, setState] = useState(() => {
    const cached = readCachedStudentProfile();

    return { profile: cached, ready: cached !== null };
  });

  useEffect(() => {
    let active = true;

    fetchStudentProfile().then((fresh) => {
      if (!active) return;

      setState((current) => {
        if (current.ready && isSameStudentProfile(current.profile, fresh)) return current;

        return { profile: fresh, ready: true };
      });
    });

    return () => {
      active = false;
    };
  }, []);

  return { profile: state.profile, loading: !state.ready };
}
