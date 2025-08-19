// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");
    const userId = searchParams.get("userId");

    if (!staffId || !userId) {
      return NextResponse.json({ error: "Missing staffId or userId" }, { status: 400 });
    }

    const messages = await prisma.staffMessage.findMany({
      where: { staffId, userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { staffId, userId, from, text } = await req.json();

    if (!staffId || !userId || !from || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMessage = await prisma.staffMessage.create({
      data: { staffId, userId, from, text },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
