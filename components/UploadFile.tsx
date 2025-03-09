"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Cloud, Check, X, Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function UploadFile() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({});

  const user = useUser();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setUploadQueue((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      // Images
      "image/*": [],

      // PDFs
      "application/pdf": [],

      // Word Documents
      "application/msword": [], // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [], // .docx

      // Excel Spreadsheets
      "application/vnd.ms-excel": [], // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // .xlsx

      // PowerPoint Presentations
      "application/vnd.ms-powerpoint": [], // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [], // .pptx

      // Text and Code Files
      "text/plain": [], // .txt
      "text/csv": [], // .csv
      "application/json": [], // .json
      "application/xml": [], // .xml

      // Compressed Files
      "application/zip": [], // .zip
      "application/x-rar-compressed": [], // .rar
      "application/x-7z-compressed": [], // .7z

      // Audio Files
      "audio/*": [],

      // Video Files
      "video/*": [],
    },
  });

  const uploadToTelegram = useCallback(
    async (file: File) => {
      if (!file) return;

      setUploading(true);
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
        if (!tgData.ok) throw new Error("Failed to upload to Telegram");

        const fileId = tgData.result.document.file_id;

        // Store metadata in Supabase
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileId,
            fileName: file.name,
            type: "file",
            uploaderId: user.user?.id,
          }),
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        setUploadStatus((prev) => ({ ...prev, [file.name]: "success" }));
        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        console.error(error);
        setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
        toast.error(`Failed to upload ${file.name}.`);
      } finally {
        setUploading(false);
        setUploadQueue((prev) => prev.filter((f) => f !== file));
      }
    },
    [user.user?.id]
  );

  useEffect(() => {
    if (!uploading && uploadQueue.length > 0) {
      uploadToTelegram(uploadQueue[0]);
    }
  }, [uploadQueue, uploading, uploadToTelegram]);

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
          Drag and drop your file or browse to upload
        </p>
      </div>

      <motion.div
        {...getRootProps({ onAnimationStart: undefined })}
        className={`mt-4 border-2 border-neutral-300 dark:border-neutral-800  border-dashed rounded-lg p-6 cursor-pointer transition-all ${
          isDragActive ? "border-primary bg-primary/10" : "border-muted"
        }`}
        whileHover={{ scale: 1.02 }}
      >
        <input {...getInputProps()} />
        <Cloud className="mx-auto h-20 py-6 bg-white dark:bg-neutral-900 dark:border-neutral-800 border border-neutral-300 rounded-full w-20 dark:text-blue-300 text-blue-400" />
        <p className="mt-2 text-sm">Drop your files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">
          Max file size: 50 MB | Unlimited uploads
        </p>
      </motion.div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="p-4 bg-card rounded-lg shadow-sm border flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <p className="font-medium text-sm truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex items-center gap-2">
                {uploadStatus[file.name] === "loading" && (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                )}
                {uploadStatus[file.name] === "success" && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {uploadStatus[file.name] === "error" && (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <button
                  onClick={() =>
                    setFiles((prev) => prev.filter((f) => f !== file))
                  }
                  className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
