import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
}

// Logo completo de EmprendeKids (ya incluye el nombre). Quien lo usa fija la
// altura con `className` (por ejemplo "h-14"); el ancho se ajusta solo.
export function AppLogo({ className }: AppLogoProps) {
  return (
    <img
      src="/emprendekids-logo.png"
      alt="EmprendeKids"
      width={107}
      height={56}
      className={cn("w-auto object-contain", className)}
    />
  );
}
