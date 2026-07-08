"use client";

import { X } from "lucide-react";
import { ChatPanel } from "@/components/IA_Bot/ChatPanel";

type ChatModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ChatModal({ open, onClose }: ChatModalProps) {
  return (
    <div className={open ? "fixed inset-0 z-50" : "hidden"}>
      <button
        type="button"
        aria-label="Cerrar chat"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/20"
      />
      <section className="absolute bottom-4 right-4 flex h-[70dvh] max-h-140 w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-(--shadow-card)">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="font-display text-base font-extrabold text-foreground">Mentorix</p>
              <p className="text-xs font-semibold text-muted-foreground">
                Tu asistente de emprendimiento
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar chat"
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={20} />
          </button>
        </header>
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
          <ChatPanel />
        </div>
      </section>
    </div>
  );
}
