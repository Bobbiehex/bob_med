// app/api/bookings/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

type BookingRequestBody = {
  staffId: string;
  staffName: string;
  date: string; // ISO string
  time: string; // e.g., "10:00"
  reason: string;
};

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    if (!staffId) {
      return NextResponse.json({ error: "Missing staffId" }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: { staffId },
      orderBy: [
        { date: "asc" },
        { time: "asc" },
      ],
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: BookingRequestBody = await req.json();

    const { staffId, staffName, date, time, reason } = body;

    if (!staffId || !staffName || !date || !time || !reason) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingBooking = await prisma.booking.findFirst({
      where: { staffId, date: new Date(date), time },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "This slot is already booked. Please choose another time." },
        { status: 409 }
      );
    }

    const newBooking = await prisma.booking.create({
      data: {
        staffId,
        staffName,
        date: new Date(date),
        time,
        reason,
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
