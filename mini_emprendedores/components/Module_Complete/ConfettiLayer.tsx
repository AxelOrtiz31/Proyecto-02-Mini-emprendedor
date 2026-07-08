const CONFETTI_COLORS = [
  "var(--color-primary)",
  "var(--color-success)",
  "var(--color-info)",
  "var(--color-accent)",
];

/* Valores deterministas (sin Math.random) para que servidor y cliente rendericen igual. */
const CONFETTI_PIECES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  size: 8 + (i % 3) * 3,
  color: CONFETTI_COLORS[i % 4],
  delay: `${((i % 7) * 0.4).toFixed(1)}s`,
  duration: `${(2.6 + (i % 5) * 0.4).toFixed(1)}s`,
}));

export function ConfettiLayer() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {CONFETTI_PIECES.map((piece) => (
        <span
          key={piece.id}
          className="absolute -top-4 animate-confetti-fall rounded-[2px]"
          style={{
            left: piece.left,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
          }}
        />
      ))}
    </div>
  );
}
