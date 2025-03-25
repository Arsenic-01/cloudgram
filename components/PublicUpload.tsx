"use client";

import { uploadPublicFile } from "@/lib/public.actions";
import { motion } from "framer-motion";
import { Check, Clipboard, Cloud, Loader2, Trash2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function PublicUploadFile() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({});
  const [uploading, setUploading] = useState(false);
  const [fileCode, setFileCode] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles([acceptedFiles[0]]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  const uploadFiles = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const file = files[0];

    setUploadStatus({ [file.name]: "loading" });
    const formData = new FormData();
    formData.append("document", file);

    try {
      const tgResponse = await fetch(
        `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/sendDocument?chat_id=${process.env.NEXT_PUBLIC_CHANNEL_ID}`,
        { method: "POST", body: formData }
      );
      const tgData = await tgResponse.json();
      if (!tgData.ok)
        throw new Error(tgData.description || "Telegram upload failed");

      const fileId = tgData.result.document.file_id;

      console.log(fileId);

      const result = await uploadPublicFile(fileId, file.name);
      if (!result) throw new Error("Appwrite upload failed");

      setFileCode(result);
      setUploadStatus({ [file.name]: "success" });
      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      setUploadStatus({ [file.name]: "error" });
      toast.error(`Failed to upload ${file.name}: ${error}`);
    }

    setUploading(false);
  };

  const copyToClipboard = async () => {
    if (!fileCode) return;

    setCopying(true);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fileCode);
      } else {
        // Fallback for unsupported browsers
        const textarea = document.createElement("textarea");
        textarea.value = fileCode;
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      toast.success("Code copied to clipboard", { duration: 2000 });
    } catch (error) {
      console.log("Error while copying", error);

      toast.error("Failed to copy. Please try manually.");
    }

    setTimeout(() => {
      setCopying(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 text-center">
      <div className="mb-6">
        <div className="inline-block text-xs font-medium px-3 py-1 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-blue-300 border border-neutral-300 text-blue-500 rounded-full mb-2">
          Upload File Anonymously
        </div>
        <h1 className="text-2xl font-bold dark:text-neutral-50 tracking-tight">
          Share your document securely
        </h1>
        <p className="text-muted-foreground dark:text-neutral-500 mt-2">
          Drag and drop 1 file or click to upload
        </p>
      </div>

      <motion.div
        {...getRootProps({ onAnimationStart: undefined })}
        className={`mt-4 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all ${
          isDragActive ? "border-primary bg-primary/10" : "border-muted"
        }`}
      >
        <input {...getInputProps()} />
        <Cloud className="mx-auto h-20 py-6 dark:border-neutral-800 border border-neutral-300 rounded-full w-20 text-blue-400 dark:bg-neutral-900" />
        <p className="mt-2 text-sm">Drop a file here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">
          Max file size: 20 MB
        </p>
      </motion.div>

      {files.length > 0 && (
        <div className="mt-4 p-4 bg-card rounded-lg shadow-sm flex items-center justify-between">
          <p className="text-sm truncate max-w-[200px]">{files[0].name}</p>
          {uploadStatus[files[0].name] === "loading" ? (
            <Loader2 className="animate-spin h-5 w-5 text-yellow-500" />
          ) : uploadStatus[files[0].name] === "success" ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : uploadStatus[files[0].name] === "error" ? (
            <X className="h-5 w-5 text-red-500" />
          ) : null}

          <p className="text-xs text-muted-foreground">
            {(files[0].size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <button
            onClick={() => setFiles([])}
            className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex justify-center mt-4 gap-3">
          <Button
            onClick={uploadFiles}
            disabled={uploading || uploadStatus[files[0].name] === "success"}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}

      {fileCode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 backdrop-blur-sm bg-white/5 dark:bg-black/40 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              File Code
            </p>
            <div className="flex items-center gap-1">
              <motion.button
                onClick={copyToClipboard}
                disabled={copying}
                className="group flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                whileTap={{ scale: 0.97 }}
              >
                {copying ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center"
                  >
                    <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
                    Copied
                  </motion.span>
                ) : (
                  <>
                    <Clipboard className="h-3.5 w-3.5 text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200 transition-colors" />
                    Copy
                  </>
                )}
              </motion.button>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-black flex items-center justify-center">
            <motion.div
              layout
              className="font-mono text-base px-4 py-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 w-full text-center tracking-wide"
            >
              {fileCode}
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
