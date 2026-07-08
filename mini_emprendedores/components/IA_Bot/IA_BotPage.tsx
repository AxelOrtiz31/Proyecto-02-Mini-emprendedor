import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChatPanel } from "@/components/IA_Bot/ChatPanel";

export default function IABotPage() {
  return (
    <main className="mx-auto flex h-dvh w-full max-w-2xl flex-col bg-background px-5 pb-5 pt-4">
      <header className="flex items-center gap-3 border-b border-border pb-4">
        <Link
          href="/dashboard"
          aria-label="Volver al dashboard"
          className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-foreground transition-transform active:scale-95"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-lg font-extrabold text-foreground">Mentorix</h1>
          <p className="text-xs font-semibold text-muted-foreground">
            Tu asistente de emprendimiento
          </p>
        </div>
      </header>
      <ChatPanel />
    </main>
  );
}
