import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staffs = await prisma.user.findMany({
      where: { role: { in: ["DOCTOR", "NURSE", "ADMIN"] } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(staffs);
  } catch (error) {
    console.error("GET /api/staffs error:", error);
    return NextResponse.json({ error: "Failed to fetch staffs" }, { status: 500 });
  }
}
