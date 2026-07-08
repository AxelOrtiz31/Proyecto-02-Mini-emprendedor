"use client";

import { useEffect, useRef, useState } from "react";
import { ChatBubble } from "@/components/IA_Bot/ChatBubble";
import { ChatInput } from "@/components/IA_Bot/ChatInput";
import { TypingIndicator } from "@/components/IA_Bot/TypingIndicator";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "¡Hola! Soy Mentorix. Pregúntame lo que quieras sobre emprendimiento: ideas de negocio, ahorro, ventas ¡y mucho más!",
};

const CONNECTION_ERROR = "Ocurrió un error de conexión. Intenta de nuevo.";

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const history = [...messages, { role: "user", content: text } as Message];
    setMessages(history);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await response.json();
      const reply = response.ok ? data.reply : data.error;
      setMessages([...history, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...history, { role: "assistant", content: CONNECTION_ERROR }]);
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4">
        {messages.map((message, index) => (
          <ChatBubble key={index} role={message.role} content={message.content} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      <ChatInput disabled={loading} onSend={sendMessage} />
    </div>
  );
}
