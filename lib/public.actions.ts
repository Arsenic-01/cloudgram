"use client";

import { Client, Databases, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

async function generateUniqueCode(): Promise<string> {
  let code: string;
  let exists = true;

  do {
    code = Math.floor(10000 + Math.random() * 90000).toString(); // Ensure it's a string

    // Check if code already exists in the database
    const res = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB!,
      process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_COLLECTION_ID!,
      [Query.equal("code", code), Query.limit(1)]
    );

    exists = res.documents.length > 0;
  } while (exists); // Repeat until a unique code is found

  return code;
}

// Upload public file and return access code
export async function uploadPublicFile(fileId: string, fileName: string) {
  try {
    const code = await generateUniqueCode(); // Generate a 5-digit code
    console.log("Code:", code);

    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DB!,
      process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_COLLECTION_ID!,
      ID.unique(),
      {
        file_id: fileId,
        file_name: fileName,
        code: code,
      }
    );

    return code;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Fetch public file using the access code
export async function getPublicFile(code: string) {
  try {
    const res = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB!,
      process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_COLLECTION_ID!,
      [Query.equal("code", code), Query.limit(1)]
    );

    if (res.documents.length === 0) return null;

    const file = res.documents[0];

    return {
      id: file.$id,
      file_id: file.file_id,
      file_name: file.file_name,
      timestamp: file.$createdAt,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
