"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { canGoBack } from "@/lib/navigation";

// Enlace de "Volver": si hay una pantalla anterior la saca del historial en vez
// de abrir otra copia del destino. Sin historial (enlace directo) navega al
// href como cualquier enlace.
export function BackLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    const opensElsewhere =
      event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    if (event.defaultPrevented || opensElsewhere || !canGoBack()) return;

    event.preventDefault();
    router.back();
  }

  return <Link {...props} onClick={handleClick} />;
}
