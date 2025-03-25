"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Check, Cloud, Loader2, Trash2, X, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import uploadToAppwrite from "./FastUploadHelper";
import { Button } from "./ui/button";

export default function UploadFastFile({
  refetchFiles,
}: {
  refetchFiles: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({});
  const [uploading, setUploading] = useState(false);

  const user = useUser();
  const userId = user.user?.id;
  // Handle file drop
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
    maxFiles: 10,
  });

  // Upload a single file
  const uploadFile = async (file: File) => {
    setUploadStatus((prev) => ({ ...prev, [file.name]: "loading" }));

    try {
      const result = await uploadToAppwrite(file, userId!);
      if (result.ok) {
        setUploadStatus((prev) => ({ ...prev, [file.name]: "success" }));
        toast.success(`${file.name} uploaded successfully!`);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
      console.error("Upload failed:", error);
      toast.error(`Failed to upload ${file.name}`);
    }
  };

  // Upload all files
  const startUpload = async () => {
    if (!userId) {
      toast.error("❌ You must be logged in to upload files.");
      return;
    }

    setUploading(true);

    await Promise.all(
      files.map(async (file) => {
        if (uploadStatus[file.name] !== "success") {
          await uploadFile(file);
        }
      })
    );

    setUploading(false);
    refetchFiles(); // Refetch files from the server
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 text-center">
      <div className="mb-6">
        <div className="inline-block text-xs font-medium px-3 py-1 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-blue-300 border border-neutral-300 text-blue-500 rounded-full mb-2">
          Upload File
        </div>
        <h1 className="text-2xl font-bold dark:text-neutral-50 tracking-tight">
          Blazing Fast File Upload ⚡
        </h1>
        <p className="text-muted-foreground dark:text-neutral-500 mt-2">
          Upload your files directly to S3 with a single click.
        </p>
      </div>

      {/* Dropzone */}
      <motion.div
        {...getRootProps({ onAnimationStart: undefined })}
        className={`mt-4 border-2 border-neutral-300 dark:border-neutral-800 border-dashed rounded-lg p-6 cursor-pointer transition-all ${
          isDragActive
            ? "border-primary bg-neutral-50 dark:bg-neutral-900"
            : "border-muted"
        }`}
        whileHover={{ scale: 1.02 }}
      >
        <input {...getInputProps()} />
        <Cloud className="mx-auto h-20 py-6 dark:border-neutral-800 border border-neutral-300 rounded-full w-20 text-blue-400 dark:bg-neutral-900" />
        <p className="mt-2 text-sm">Drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">
          Max file size: 50 MB | Max files: 10
        </p>
      </motion.div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="p-4 bg-card rounded-lg border flex items-center justify-between"
            >
              <p className="font-medium text-sm truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <div className="flex items-center gap-2">
                {uploadStatus[file.name] === "loading" && (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                )}
                {uploadStatus[file.name] === "success" && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {uploadStatus[file.name] === "error" && (
                  <>
                    <X className="h-4 w-4 text-red-500" />
                    <button
                      onClick={() => uploadFile(file)}
                      className="p-1 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <RotateCcw className="h-4 w-4 text-blue-500" />
                    </button>
                  </>
                )}
                <button
                  onClick={() =>
                    setFiles((prev) => prev.filter((f) => f.name !== file.name))
                  }
                  className="p-2 rounded-full bg-muted/50 hover:bg-muted"
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
          <Button
            onClick={startUpload}
            disabled={
              uploading ||
              files.every((file) => uploadStatus[file.name] === "success")
            }
          >
            {uploading
              ? "Uploading..."
              : files.every((file) => uploadStatus[file.name] === "success")
              ? "All Uploaded"
              : "Upload Files"}
          </Button>

          <Button
            onClick={() => {
              setFiles([]);
              setUploadStatus({});
            }}
            variant={"outline"}
          >
            Discard All
          </Button>
        </div>
      )}
    </div>
  );
}
