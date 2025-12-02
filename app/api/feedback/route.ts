import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, email, message, timestamp } = body;

    if (!message || !type) {
      return NextResponse.json(
        { error: "Message and type are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Store feedback in database
    const { error } = await supabase.from("feedback").insert({
      type,
      email: email || null,
      message,
      created_at: timestamp || new Date().toISOString(),
    });

    if (error) {
      console.error("Error storing feedback:", error);
      return NextResponse.json(
        { error: "Failed to store feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
