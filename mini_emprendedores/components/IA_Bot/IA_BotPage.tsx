"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

// Respuestas predefinidas (basadas en el contenido del taller)
const BOT_RESPONSES: Record<string, string> = {
  "emprender": "Emprender es crear un proyecto o negocio para resolver un problema o satisfacer una necesidad. ¡Cualquier persona puede emprender!",
  "idea": "Una idea de negocio surge al observar tu entorno y pensar en lo que otros necesitan. Puede ser un producto o un servicio.",
  "cliente": "El cliente es la persona que compra tu producto o servicio. Debes conocerlo para ofrecerle lo que realmente necesita.",
  "precio": "El precio es el valor que el cliente paga por tu producto. Debe cubrir tus costos y dejarte una ganancia.",
  "ganancia": "La ganancia es el dinero que te sobra después de restar los costos al precio de venta. ¡Es tu recompensa por emprender!",
  "publicidad": "La publicidad ayuda a que la gente conozca tu negocio. Puedes usar un nombre llamativo, un eslogan y un buen diseño.",
  "presentación": "Para presentar tu negocio, saluda, explica qué vendes, a quién se lo vendes y cuál es el precio. Habla con seguridad.",
  "equipo": "Trabajar en equipo es clave para emprender. Cada persona aporta habilidades diferentes que fortalecen el proyecto.",
  "creatividad": "La creatividad te ayuda a encontrar soluciones nuevas y a diferenciarte de otros negocios. ¡Todos podemos ser creativos!",
  "esfuerzo": "El esfuerzo es el tiempo y trabajo que pones en tu negocio. Recuerda que cada esfuerzo cuenta para lograr tus metas.",
  "default": "¡Buena pregunta! No tengo una respuesta exacta ahora, pero puedes preguntarme sobre emprender, ideas de negocio, clientes, precios, ganancias, publicidad o trabajo en equipo. 😊",
};

export default function IABotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy tu asistente de emprendimiento. ¿En qué puedo ayudarte hoy? 😊",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Obtener el nombre del usuario
  useEffect(() => {
    async function getUserName() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: perfil } = await supabase
          .from("perfiles")
          .select("nombre")
          .eq("id", user.id)
          .single();
        if (perfil) {
          setUserName(perfil.nombre);
        }
      }
    }
    getUserName();
  }, []);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Función para obtener respuesta del bot
  function getBotResponse(inputText: string): string {
    const lowerInput = inputText.toLowerCase();
    
    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    
    // Si el saludo es "hola", responder con saludo personalizado
    if (lowerInput.match(/^(hola|buenas|hey|qué tal|saludos)/)) {
      return userName 
        ? `¡Hola ${userName}! ¿Cómo puedo ayudarte con tu emprendimiento? 🚀`
        : "¡Hola! ¿Cómo puedo ayudarte con tu emprendimiento? 🚀";
    }
    
    return BOT_RESPONSES.default;
  }

  // Enviar mensaje
  async function handleSend() {
    if (!input.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simular tiempo de procesamiento del bot
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  }

  // Manejar tecla Enter
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        {/* Encabezado */}
        <div className="flex items-center justify-between rounded-3xl bg-card p-4 shadow-(--shadow-card)">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-2xl">
              🤖
            </div>
            <div>
              <h1 className="font-display text-lg font-extrabold text-foreground">
                Asistente IA
              </h1>
              <p className="text-xs font-semibold text-muted-foreground">
                Pregunta sobre emprendimiento
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-bold text-muted-foreground">En línea</span>
          </span>
        </div>

        {/* Área de mensajes */}
        <div className="mt-4 flex-1 overflow-y-auto rounded-3xl bg-card/50 p-4 shadow-(--shadow-card) min-h-[400px] max-h-[500px] sm:min-h-[450px]">
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground border border-border"
                  }`}
                >
                  <p className="text-sm font-semibold leading-relaxed">
                    {msg.text}
                  </p>
                  <p className="mt-1 text-[10px] opacity-70">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-card px-4 py-2.5 border border-border">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input y botón */}
        <div className="mt-4 flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
              className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 pr-12 font-display text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg opacity-50">
              💬
            </span>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="rounded-2xl bg-primary px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            Enviar
          </button>
        </div>

        {/* Sugerencias rápidas */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["emprender", "idea", "cliente", "precio", "ganancia", "publicidad", "equipo"].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => {
                  setInput(tag);
                  // Enfocar el input (opcional)
                }}
                className="rounded-full bg-card px-3 py-1.5 text-xs font-extrabold text-muted-foreground border border-border transition-colors hover:border-primary hover:text-primary"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Botón volver */}
        <div className="mt-6 flex justify-center">
          <a
            href="/dashboard"
            className="rounded-2xl bg-primary px-6 py-2.5 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
          >
            Volver al camino
          </a>
        </div>
      </div>
    </main>
  );
}