import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("file_id");

  if (!fileId) {
    return NextResponse.json({ error: "File ID required" }, { status: 400 });
  }

  // Fetch file details from Telegram API
  const res = await fetch(
    `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/getFile?file_id=${fileId}`
  );
  const data = await res.json();

  if (!res.ok || !data.result?.file_path) {
    return NextResponse.json(
      { error: data.description || "Unknown error" },
      { status: 500 }
    );
  }

  const fileUrl = `https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${data.result.file_path}`;

  return NextResponse.json({ fileUrl });
}
