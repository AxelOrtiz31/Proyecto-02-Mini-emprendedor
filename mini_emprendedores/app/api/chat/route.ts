import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `Eres "Mentorix", el asistente virtual de EmprendeKids, una aplicación educativa que enseña emprendimiento a niños y niñas.
Tu misión es resolver dudas sobre emprendimiento: ideas de negocio, ahorro, ventas, clientes, publicidad, trabajo en equipo y finanzas básicas.
Reglas:
- Responde siempre en español, con un tono alegre, amable y motivador.
- Usa palabras sencillas que un niño de 8 a 12 años pueda entender.
- Da respuestas cortas y claras (máximo 4 o 5 oraciones) con ejemplos divertidos.
- Si te preguntan algo sin relación con el emprendimiento o con la aplicación, responde amablemente que solo puedes ayudar con temas de emprendimiento.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta configurar GROQ_API_KEY en el archivo .env.local." },
      { status: 500 },
    );
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await request.json();
    if (Array.isArray(body.messages)) {
      messages = body.messages;
    }
  } catch {
    return NextResponse.json({ error: "El formato de la petición no es válido." }, { status: 400 });
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: "No se recibió ningún mensaje." }, { status: 400 });
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.6,
        max_tokens: 400,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (response.status === 401) {
      return NextResponse.json(
        { error: "La clave de Groq no es válida. Revisa el valor de GROQ_API_KEY." },
        { status: 502 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "El asistente no pudo responder. Intenta de nuevo en un momento." },
        { status: 502 },
      );
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el asistente. Revisa tu conexión e intenta de nuevo." },
      { status: 502 },
    );
  }
}
