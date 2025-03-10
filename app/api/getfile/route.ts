import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Fetch file details from Telegram API
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/getFile?file_id=${fileId}`
    );

    const data = await res.json();

    if (!data.result?.file_path) {
      const errorMessage = data.description || "Unknown error occurred";

      if (data.error_code === 400 || errorMessage.includes("file is too big")) {
        return NextResponse.json(
          { error: "File is too large to retrieve" },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file details" },
        { status: 500 }
      );
    }

    const fileUrl = `https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${data.result.file_path}`;

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error("Error retrieving file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
