import { cn } from "@/lib/utils";

interface ProgressSegmentsProps {
  total: number;
  current: number; // índice del paso actual (0-based)
}

export function ProgressSegments({ total, current }: ProgressSegmentsProps) {
  const segments = Array.from({ length: total });

  return (
    <div className="mx-auto mt-4 flex w-full max-w-md gap-2">
      {segments.map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-3 flex-1 rounded-full transition-colors",
            index <= current ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}
