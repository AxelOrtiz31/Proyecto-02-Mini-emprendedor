import { Rocket } from "lucide-react";

interface StudentAvatarProps {
  imageUrl: string | null;
}

// Avatar que el alumno eligió al empezar. Mientras carga, o si todavía no eligió
// uno, se muestra un cohete sobre el color de la marca.
export function StudentAvatar({ imageUrl }: StudentAvatarProps) {
  if (!imageUrl) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <Rocket className="h-5 w-5" strokeWidth={2.4} />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Tu avatar"
      width={40}
      height={40}
      className="h-10 w-10 rounded-full border-2 border-primary bg-secondary object-cover shadow-sm"
    />
  );
}
