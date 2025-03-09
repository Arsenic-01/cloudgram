import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { file_id } = await req.json();

    if (!file_id) {
      return new Response("File ID required", { status: 400 });
    }

    // Fetch file from Supabase Storage
    const { data, error } = await supabase.storage
      .from("cloudgram")
      .download(file_id);

    if (error || !data) {
      console.error("Supabase Error:", error);
      return new Response(
        JSON.stringify({ error: error?.message || "File not found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Convert file_id to extract filename
    const fileName = file_id.split("/").pop();

    return new Response(data, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Download Error:", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
