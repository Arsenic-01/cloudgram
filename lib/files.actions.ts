"use client";

import { Client, Databases, Query, Storage } from "appwrite";
import { NextResponse } from "next/server";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);
const storage = new Storage(client);

export async function getFastFiles(userId: string) {
  try {
    const res = databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB!,
      process.env.NEXT_PUBLIC_APPWRITE_FILE_COLLECTION_ID!,
      [Query.equal("user_id", userId)]
    );

    console.log(res); // Resource URL

    return (await res).documents.map((file) => {
      return {
        id: file.$id,
        file_id: file.file_id,
        file_name: file.file_name,
        timestamp: file.timestamp,
        uploader_id: file.user_id,
        storage_type: file.storage_type,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteFastFile(docId: string, fileId: string) {
  try {
    console.log("DOCID", docId, fileId);
    await storage.deleteFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET!,
      fileId
    );
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DB!,
      process.env.NEXT_PUBLIC_APPWRITE_FILE_COLLECTION_ID!,
      docId
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
