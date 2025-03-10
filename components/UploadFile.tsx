"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Cloud, Check, X, Loader2, Trash2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function UploadFile() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({});
  const [uploading, setUploading] = useState(false);

  const user = useUser();

  // Dropzone Handler
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length + files.length > 10) {
        toast.warning("You can upload a maximum of 10 files.");
        return;
      }
      setFiles((prev) => [...prev, ...acceptedFiles]);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: 10,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/vnd.ms-powerpoint": [],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [],
      "text/plain": [],
      "text/csv": [],
      "application/json": [],
      "application/xml": [],
      "application/zip": [],
      "application/x-rar-compressed": [],
      "application/x-7z-compressed": [],
      "audio/*": [],
      "video/*": [],
      "text/javascript": [], // JavaScript (.js)
      "text/typescript": [], // TypeScript (.ts)
      "text/x-c": [], // C (.c)
      "text/x-c++": [], // C++ (.cpp, .cxx)
      "text/x-java-source": [], // Java (.java)
      "text/x-python": [], // Python (.py)
      "text/x-ruby": [], // Ruby (.rb)
      "text/x-php": [], // PHP (.php)
      "text/x-shellscript": [], // Shell scripts (.sh)
      "text/x-sql": [], // SQL (.sql)
      "text/x-go": [], // Go (.go)
      "text/x-lua": [], // Lua (.lua)
      "text/x-markdown": [], // Markdown (.md)
      "text/x-html": [], // HTML (.html, .htm)
      "text/x-css": [], // CSS (.css)
      "text/jsx": [], // JSX (.jsx)
      "text/tsx": [], // TSX (.tsx)
    },
  });

  // Upload Files
  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);

    const uploadPromises = files.map(async (file) => {
      if (uploadStatus[file.name] === "success") return; // Skip already uploaded files
      if (file.size > 20 * 1024 * 1024) {
        setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
        toast.error(`Failed to upload ${file.name}: File size exceeds 20MB`);
        return;
      } // Skip files larger than 20MB
      setUploadStatus((prev) => ({ ...prev, [file.name]: "loading" }));

      const formData = new FormData();
      formData.append("document", file);

      try {
        // Upload file to Telegram
        const tgResponse = await fetch(
          `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/sendDocument?chat_id=${process.env.NEXT_PUBLIC_CHANNEL_ID}`,
          { method: "POST", body: formData }
        );

        const tgData = await tgResponse.json();
        if (!tgData.ok)
          throw new Error(tgData.description || "Telegram upload failed");

        const fileId = tgData.result.document.file_id;

        // Store metadata in Supabase
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileId,
            fileName: file.name,
            uploaderId: user.user?.id,
          }),
        });

        const data = await res.json();
        if (!data.success)
          throw new Error(data.error || "Database insert failed");

        setUploadStatus((prev) => ({ ...prev, [file.name]: "success" }));
        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
        toast.error(`Failed to upload ${file.name}: ${error}`);
      }
    });

    await Promise.allSettled(uploadPromises);
    setUploading(false);
  };

  // Remove file from list
  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
    setUploadStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
  };

  // Check if all non-error files are uploaded
  const allFilesUploaded = files.every(
    (file) => uploadStatus[file.name] === "success"
  );

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 text-center">
      <div className="mb-6">
        <div className="inline-block text-xs font-medium px-3 py-1 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-800 dark:text-blue-300 border border-neutral-300 text-blue-500 rounded-full mb-2">
          Upload File
        </div>
        <h1 className="text-2xl font-bold dark:text-neutral-50 tracking-tight">
          Share your documents securely
        </h1>
        <p className="text-muted-foreground dark:text-neutral-500 mt-2">
          Drag and drop up to 10 files to upload
        </p>
      </div>

      {/* Dropzone */}
      <motion.div
        {...getRootProps({ onAnimationStart: undefined })}
        className={`mt-4 border-2 border-neutral-300 dark:border-neutral-800 border-dashed rounded-lg p-6 cursor-pointer transition-all ${
          isDragActive ? "border-primary bg-primary/10" : "border-muted"
        }`}
        whileHover={{ scale: 1.02 }}
      >
        <input {...getInputProps()} />
        <Cloud className="mx-auto h-20 py-6 dark:border-neutral-800 border border-neutral-300 rounded-full w-20 text-blue-400" />
        <p className="mt-2 text-sm">Drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">
          Max file size: 20 MB | Max files: 10
        </p>
      </motion.div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={file.name + index}
              className="p-4 bg-card rounded-lg shadow-sm border flex items-center justify-between"
            >
              <p className="font-medium text-sm truncate max-w-[200px]">
                {file.name}
              </p>
              <div className="flex items-center gap-2">
                {uploadStatus[file.name] === "loading" ? (
                  <Loader2 className="animate-spin h-5 w-5 text-yellow-500" />
                ) : uploadStatus[file.name] === "success" ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : uploadStatus[file.name] === "error" ? (
                  <>
                    <X className="h-5 w-5 text-red-500" />
                    <button
                      onClick={uploadFiles}
                      className="p-1 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <RotateCcw className="h-4 w-4 text-blue-500" />
                    </button>
                  </>
                ) : null}
                <button
                  onClick={() => removeFile(file.name)}
                  className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload & Discard Buttons */}
      {files.length > 0 && (
        <div className="flex justify-center mt-4 gap-3">
          <button
            onClick={uploadFiles}
            disabled={uploading || allFilesUploaded}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              uploading || allFilesUploaded
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            {uploading
              ? "Uploading..."
              : allFilesUploaded
              ? "All Uploaded"
              : "Upload Files"}
          </button>

          <button
            onClick={() => setFiles([])}
            disabled={files.length === 0}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md"
          >
            Discard All
          </button>
        </div>
      )}
    </div>
  );
}
