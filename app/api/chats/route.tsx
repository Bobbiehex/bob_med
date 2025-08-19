// app/api/chats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import  getServerSession  from "next-auth";



export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch staff (doctor/nurse/admin) the user has sent messages to
    const messages = await prisma.message.findMany({
      where: { from: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Extract unique staffIds from messages
    const staffIds = [...new Set(messages.map((msg) => msg.staffId))];

    const staffs = await prisma.user.findMany({
      where: { id: { in: staffIds } },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    return NextResponse.json({ staffs, messages });
  } catch (error) {
    console.error("Chats fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}
