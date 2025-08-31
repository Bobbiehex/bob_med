// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    patientsToday: 24,
    patientsChange: 2,
    appointments: { total: 18, pending: 6, confirmed: 12 },
    avgWaitTime: { time: 8, change: -3 },
    efficiencyScore: { score: 94, change: 5 },
    rooms: { consultation: { available: 7, total: 10 }, treatment: { available: 4, total: 6 } },
    staff: { doctors: { active: 5, total: 6 }, nurses: { active: 8, total: 10 } },
    equipment: { xray: "All Online", lab: "1 Maintenance" }
  });
}
