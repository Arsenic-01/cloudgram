"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Check, Cloud, Loader2, Trash2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export default function UploadFastFile() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({});
  const [uploading, setUploading] = useState(false);

  const user = useUser();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.filter(
        (file) => !files.some((f) => f.name === file.name)
      );
      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
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
    maxFiles: 10,
  });

  const uploadToSupabase = async (file: File) => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
      toast.error(`Failed to upload ${file.name}: File size exceeds 50MB`);
      return;
    } // Skip files larger than 50MB
    setUploadStatus((prev) => ({ ...prev, [file.name]: "loading" }));

    const formData = new FormData();
    formData.append("document", file);
    formData.append("fileName", file.name);
    formData.append("uploaderId", user.user?.id || "");

    try {
      const res = await fetch("/api/fastUpload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadStatus((prev) => ({ ...prev, [file.name]: "success" }));
      toast.success(`${file.name} uploaded successfully!`);

      // ✅ Remove file from list after successful upload
      setTimeout(() => {
        setFiles((prev) => prev.filter((f) => f.name !== file.name));
        setUploadStatus((prev) => {
          const { [file.name]: _, ...rest } = prev;
          return rest;
        });
      }, 1000);
    } catch (error) {
      let message = "Unknown error occurred.";
      if (error instanceof Error) message = error.message;

      setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
      toast.error(`❌ ${file.name}: ${message}`);
    }
  };

  const startUpload = async () => {
    setUploading(true);
    await Promise.all(files.map(uploadToSupabase));
    setUploading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 text-center">
      <div className="mb-6">
        <div className="inline-block text-xs font-medium px-3 py-1 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-800 dark:text-blue-300 border border-neutral-300 text-blue-500 rounded-full mb-2">
          Upload File
        </div>
        <h1 className="text-2xl font-bold dark:text-neutral-50 tracking-tight">
          Blazing Fast File Upload ⚡
        </h1>
        <p className="text-muted-foreground dark:text-neutral-500 mt-2">
          Upload your files directly to S3 with a single click.
        </p>
      </div>

      <motion.div
        {...getRootProps({ onAnimationStart: undefined })}
        className={`mt-4 border-2 border-neutral-300 dark:border-neutral-800 border-dashed rounded-lg p-6 cursor-pointer transition-all ${
          isDragActive ? "border-primary bg-primary/10" : "border-muted"
        }`}
        whileHover={{ scale: 1.02 }}
      >
        <input {...getInputProps()} />
        <Cloud className="mx-auto h-20 py-6 bg-white dark:bg-neutral-900 dark:border-neutral-800 border border-neutral-300 rounded-full w-20 dark:text-blue-300 text-blue-400" />
        <p className="mt-2 text-sm">Drop your files here or click to browse</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Max file size: 50 MB | Max files: 10
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
                    setFiles((prev) => prev.filter((f) => f.name !== file.name))
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

      {files.length > 0 && (
        <div className="flex justify-center mt-4 gap-3">
          <button
            onClick={startUpload}
            disabled={uploading || files.length === 0}
            className={`px-4 py-2 rounded-lg shadow-md ${
              files.length === 0 || uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            {uploading ? "Uploading..." : "Upload"}
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
