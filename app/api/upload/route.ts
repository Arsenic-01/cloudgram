import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { fileId, fileName, uploaderId } = await req.json();

    const { error } = await supabase
      .from("files")
      .insert([
        {
          file_id: fileId,
          file_name: fileName,
          uploader_id: uploaderId,
          storage_type: "telegram",
        },
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
