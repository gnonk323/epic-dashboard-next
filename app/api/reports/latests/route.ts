import { NextResponse } from "next/server";
import Report from "@/models/Report";
import { connectMongoose } from "@/lib/mongoose";

export async function GET() {
  await connectMongoose();

  try {
    const latest = await Report
      .findOne()
      .sort({ timestamp: -1 });

    if (!latest) {
      return NextResponse.json(
        { error: "No reports found." },
        { status: 404 }
      );
    }

    return NextResponse.json(latest);
  } catch (err) {
    console.error("Failed to fetch latest report:", err);
    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}
