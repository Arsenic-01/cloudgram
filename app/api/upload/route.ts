import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { fileId, fileName, uploaderId } = await req.json();

    const { error } = await supabase.from("files").insert([
      {
        file_id: fileId,
        file_name: fileName,
        uploader_id: uploaderId,
        storage_type: "telegram",
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json(
        { error: error.message || "Database insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload API Error:", error);
    if (error instanceof Error)
      return NextResponse.json(
        { error: error.message || "Unexpected server error" },
        { status: 500 }
      );
    else
      return NextResponse.json(
        { error: "Unexpected server error" },
        { status: 500 }
      );
  }
}
