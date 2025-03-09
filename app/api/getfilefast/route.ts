import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { uploaderId } = await req.json();

    if (!uploaderId) {
      return NextResponse.json(
        { error: "uploader_id is required" },
        { status: 400 }
      );
    }

    // ✅ Fix: Ensure uploaderId is a string and valid
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("uploader_id", uploaderId)
      .eq("storage_type", "fast");

    if (error) {
      console.error("Database Query Error:", error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
