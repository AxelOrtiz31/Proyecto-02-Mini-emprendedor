// Por ahora solo existe la racha personal. La pestaña de amigos se deja a la
// vista, desactivada, hasta que haya datos de amigos que mostrar.
export function StreakTabs() {
  return (
    <nav className="grid grid-cols-2 text-sm font-extrabold tracking-widest">
      <span className="border-b-[3px] border-primary pb-3 text-center text-primary">
        PERSONAL
      </span>

      <button
        type="button"
        disabled
        title="Muy pronto"
        className="cursor-not-allowed border-b-[3px] border-border pb-3 text-center text-muted-foreground/50"
      >
        AMIGOS
      </button>
    </nav>
  );
}
