// app/api/feedback/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const FEEDBACK_FILE = path.join(process.cwd(), "data", "rl_feedback.json");

export async function POST(req: Request) {
  try {
    const { timestamp, reward } = await req.json(); // reward: +1 or -1
    const file = await fs.readFile(FEEDBACK_FILE, "utf-8");
    let history = JSON.parse(file);

    history = history.map((item: any) =>
      item.timestamp === timestamp ? { ...item, reward } : item
    );

    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(history, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback error:", err);
    return new NextResponse("Error saving feedback", { status: 500 });
  }
}
