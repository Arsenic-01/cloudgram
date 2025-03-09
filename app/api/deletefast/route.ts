import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { fileId } = await req.json();

    // 🗑️ Step 1: Remove from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("cloudgram")
      .remove([fileId]);

    if (storageError) {
      throw new Error(`Storage Deletion Error: ${storageError.message}`);
    }

    // 🗑️ Step 2: Delete File Record from Database
    const { error: dbError } = await supabase
      .from("files")
      .delete()
      .eq("file_id", fileId);

    if (dbError) {
      throw new Error(`Database Deletion Error: ${dbError.message}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
