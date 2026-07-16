"use client";

import { Volume2 } from "lucide-react";
import { speak } from "@/audio/SpeechManager";

interface SpeakButtonProps {
  text: string;
}

export function SpeakButton({
  text,
}: SpeakButtonProps) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
    >
      <Volume2 className="h-5 w-5" />
    </button>
  );
}