export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <span className="text-2xl">🤖</span>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-4 shadow-(--shadow-card)">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
      </div>
    </div>
  );
}
