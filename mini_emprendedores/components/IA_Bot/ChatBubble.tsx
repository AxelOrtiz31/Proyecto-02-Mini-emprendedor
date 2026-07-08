type ChatBubbleProps = {
  role: "user" | "assistant";
  content: string;
};

export function ChatBubble({ role, content }: ChatBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-(--shadow-card)">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <span className="text-2xl">🤖</span>
      <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 text-sm font-semibold text-card-foreground shadow-(--shadow-card)">
        {content}
      </div>
    </div>
  );
}
