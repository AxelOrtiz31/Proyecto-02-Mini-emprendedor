"use client";

import { useEffect, useState } from "react";

type Point = { x: number; y: number };

interface PathFootprintsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  walkedUntil: number;
}

const FOOT_STEP = 22;
const NODE_MARGIN = 46;
const SIDE_OFFSET = 6;

export function PathFootprints({ containerRef, walkedUntil }: PathFootprintsProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function measure() {
      if (!container) return;
      const box = container.getBoundingClientRect();
      const nodes = container.querySelectorAll("[data-lesson-node]");
      setPoints(
        Array.from(nodes, (node) => {
          const rect = node.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2 - box.left,
            y: rect.top + rect.height / 2 - box.top,
          };
        }),
      );
      setSize({ width: box.width, height: box.height });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  if (points.length < 2 || size.width === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      aria-hidden="true"
    >
      {points.slice(0, -1).map((from, index) => (
        <SegmentPrints
          key={index}
          from={from}
          to={points[index + 1]}
          walked={index < walkedUntil}
        />
      ))}
    </svg>
  );
}

function SegmentPrints({ from, to, walked }: { from: Point; to: Point; walked: boolean }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  const usable = distance - NODE_MARGIN * 2;
  if (usable < FOOT_STEP / 2) return null;

  const count = Math.max(1, Math.round(usable / FOOT_STEP));
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const dirX = dx / distance;
  const dirY = dy / distance;

  return (
    <g
      fill={walked ? "var(--color-primary)" : "var(--color-muted-foreground)"}
      opacity={walked ? 0.55 : 0.35}
    >
      {Array.from({ length: count }, (_, step) => {
        const along = NODE_MARGIN + (usable / count) * (step + 0.5);
        const side = step % 2 === 0 ? SIDE_OFFSET : -SIDE_OFFSET;
        const x = from.x + dirX * along + -dirY * side;
        const y = from.y + dirY * along + dirX * side;
        return (
          <rect
            key={step}
            x={-3}
            y={-5.5}
            width={6}
            height={11}
            rx={3}
            transform={`translate(${x} ${y}) rotate(${angle - 90})`}
          />
        );
      })}
    </g>
  );
}
