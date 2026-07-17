import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneText: Record<string, string> = {
  primary: "text-primary",
  accent: "text-accent",
  info: "text-info",
};

const pillClass =
  "flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1 shadow-sm sm:px-3 sm:py-1.5";

interface StatPillProps {
  icon: LucideIcon;
  value: number;
  label: string;
  tone: "primary" | "accent" | "info";
  onClick?: () => void;
  // Nombre accesible del botón: en móvil el label está oculto y solo se
  // anunciaría el número.
  title?: string;
}

export function StatPill({ icon: Icon, value, label, tone, onClick, title }: StatPillProps) {
  const content = (
    <>
      <Icon
        className={cn("h-4 w-4 fill-current", toneText[tone])}
        strokeWidth={2.4}
      />

      <span className="font-display text-xs font-extrabold text-foreground sm:text-sm">
        {value}
      </span>

      <span className="hidden text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:inline">
        {label}
      </span>
    </>
  );

  if (!onClick) {
    return <div className={pillClass}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(pillClass, "cursor-pointer transition-transform hover:bg-muted active:translate-y-px")}
    >
      {content}
    </button>
  );
}
