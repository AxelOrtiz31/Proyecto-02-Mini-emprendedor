"use client";

import { playSfx } from "@/audio/AudioManager";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  sound?: "click" | "urururu" | "opciones" | "nodos" | "respuestas";
};

export default function SoundButtonController({
  sound = "click",
  onClick,
  ...props
}: Props) {
  return (
    <button
      {...props}
      onClick={(e) => {
        playSfx(sound);
        onClick?.(e);
      }}
    />
  );
}