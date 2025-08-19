// pages/api/ai.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // cheaper & faster for chat
      messages: [
        {
          role: "system",
          content: "You are an AI clinic assistant. You can book appointments and recommend nearby hospitals in Lagos, Nigeria.",
        },
        ...messages,
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed" });
  }
}
