"use client";

import { Client, Databases, ID, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);
const storage = new Storage(client);

const uploadToAppwrite = async (file: File, userId: string) => {
  if (!file || !userId) return { ok: false };
  if (file.size > 50 * 1024 * 1024) return { ok: false };

  try {
    const res = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET!,
      ID.unique(),
      file
    );

    const fileId = res.$id;

    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DB!,
      process.env.NEXT_PUBLIC_APPWRITE_FILE_COLLECTION_ID!,
      ID.unique(),
      {
        file_id: fileId,
        file_name: file.name,
        user_id: userId,
        timestamp: new Date().toISOString(),
        storage_type: "fast",
      }
    );

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false }; // Return an explicit object
  }
};

export default uploadToAppwrite;
