import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pool } from "@neondatabase/serverless";

// ❌ remove this
// export const runtime = "edge";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return new NextResponse("Missing GEMINI_API_KEY", { status: 500 });
    }

    const { user_id, messages } = await req.json();
    const userId = user_id ?? "guest";

    const { rows: memory } = await pool.query(
      `SELECT role, message 
       FROM ai_memory 
       WHERE user_id = $1 
       ORDER BY created_at ASC 
       LIMIT 20`,
      [userId]
    );

    const history = memory
      .map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.message}`)
      .join("\n");

    const newInput = messages
      .map((m: any) => `You: ${m.text}`)
      .join("\n");

    const systemPrompt = `
You are a friendly AI hospital assistant.
Your role is to help patients book appointments, answer questions about doctors,
and provide guidance like a medical receptionist.
Do NOT give medical diagnoses.
Be friendly and concise.
Respond in a natural, easy-to-read style using paragraphs and numbered/bulleted lists when needed.
`;

    const prompt = `${systemPrompt}\n\n${history}\n${newInput}`;

    // ✅ Node runtime will allow this to work
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text();

    aiResponse = aiResponse.replace(/\*\*/g, "").trim();

    for (const msg of messages) {
      await pool.query(
        `INSERT INTO ai_memory (user_id, role, message) VALUES ($1, 'user', $2)`,
        [userId, msg.text]
      );
    }

    await pool.query(
      `INSERT INTO ai_memory (user_id, role, message) VALUES ($1, 'assistant', $2)`,
      [userId, aiResponse]
    );

    return new NextResponse(aiResponse);
  } catch (error: any) {
    console.error("AI Error details:", error);
    return new NextResponse(`AI error: ${error.message}`, { status: 500 });
  }
}
