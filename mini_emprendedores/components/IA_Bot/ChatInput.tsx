"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type ChatInputProps = {
  disabled: boolean;
  onSend: (text: string) => void;
};

export function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [text, setText] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = text.trim();
    if (clean === "" || disabled) return;
    onSend(clean);
    setText("");
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Escribe tu pregunta aquí..."
        className="h-12 flex-1 rounded-2xl border-2 border-border bg-card px-4 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
      />
      <button
        type="submit"
        disabled={disabled || text.trim() === ""}
        aria-label="Enviar mensaje"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
      >
        <Send size={20} />
      </button>
    </form>
  );
}
