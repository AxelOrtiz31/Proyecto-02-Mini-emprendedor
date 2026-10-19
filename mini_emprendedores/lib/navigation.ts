import type { useRouter } from "next/navigation";

type AppRouter = ReturnType<typeof useRouter>;

// ¿Hay una pantalla anterior de esta misma app a la que volver? La API de
// navegación (Chrome, Edge y otros) solo cuenta pantallas de la app. Si el
// navegador no la tiene se usa el tamaño del historial, que también cuenta una
// pestaña en blanco previa (por eso es el respaldo y no la primera opción).
export function canGoBack(): boolean {
  const { navigation } = window as unknown as { navigation?: { canGoBack: boolean } };

  if (navigation) return navigation.canGoBack;

  return window.history.length > 1;
}

// Sale de una pantalla que se abrió desde otra (lección, perfil, examen...).
// Si hay una pantalla anterior la saca del historial en vez de apilar otra copia
// del destino, así el gesto de "atrás" no vuelve a pasar por lo que el alumno ya
// cerró. Sin historial reemplaza la pantalla actual por el destino.
export function goBackOr(router: AppRouter, fallbackHref: string): void {
  if (canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallbackHref);
}
