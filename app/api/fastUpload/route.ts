import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("document") as File; // Ensure it's a File
    let fileName = formData.get("fileName") as string;
    const uploaderId = formData.get("uploaderId") as string;

    if (!file || !fileName || !uploaderId) {
      return NextResponse.json(
        { error: "Missing file, fileName, or uploaderId" },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 50MB" },
        { status: 400 }
      );
    }

    // ✅ Sanitize filename: Remove spaces, emojis, and special characters
    fileName = fileName
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^\w.\-]/g, ""); // Remove emojis & special characters

    // Convert file to ArrayBuffer (Supabase requires proper formatting)
    const fileBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([fileBuffer], { type: file.type });

    // ✅ Ensure valid file path
    const storagePath = `${uploaderId}/${fileName}`;

    const { data: uploadData, error } = await supabase.storage
      .from("cloudgram")
      .upload(storagePath, fileBlob);

    if (error) {
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          { error: "File already exists" },
          { status: 409 }
        );
      }
      console.error("Supabase Upload Error:", error);
      throw error;
    }

    const fileId = uploadData.path;

    // Store file metadata in Supabase DB
    const { error: dbError } = await supabase.from("files").insert([
      {
        file_id: fileId,
        file_name: fileName,
        uploader_id: uploaderId,
        storage_type: "fast",
      },
    ]);

    if (dbError) {
      console.error("Database Insert Error:", dbError);
      throw dbError;
    }

    return NextResponse.json({ success: true, fileId });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
