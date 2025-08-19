import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const staffs = await prisma.user.findMany({
    where: {
      role: {
        in: ["DOCTOR", "NURSE", "ADMIN"]
      }
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(staffs);
}
