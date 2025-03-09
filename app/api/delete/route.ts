import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { fileId } = await req.json();

    const { error } = await supabase
      .from("files")
      .delete({ count: "exact" })
      .eq("file_id", fileId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
