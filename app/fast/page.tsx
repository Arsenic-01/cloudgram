"use client";
import FileCard from "@/components/FileCard";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import UploadFastFile from "@/components/UploadFastFile";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { File, Loader2, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  type FileType = {
    file_id: string;
    file_name: string;
    uploader_id: string;
  };

  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useUser();
  const userId = user.user?.id;

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/getfilefast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploaderId: userId! }),
      });

      const data = await res.json();

      setFiles(data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      setError("Failed to load your files. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]); // ✅ Now fetchFiles is a stable dependency

  const getFileUrl = async (fileId: string, fileName: string) => {
    try {
      const res = await fetch("/api/getfastfileURL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_id: fileId }),
      });

      if (!res.ok) {
        throw new Error(`Error downloading file: ${res.statusText}`);
      }

      // Convert response to blob (binary data)
      const blob = await res.blob();

      // Create a temporary URL for downloading
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // Use the actual file name
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const res = await fetch("/api/deletefast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("File deleted successfully!");
        fetchFiles();
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  return (
    <div className="py-8 sm:py-10">
      <Toaster position="bottom-right" richColors closeButton />

      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <UploadFastFile />

        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Your Files</h2>
            {files.length > 0 && (
              <Button variant="outline" onClick={fetchFiles}>
                <span>Refresh</span> <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading your files...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border border-destructive/20 rounded-lg bg-destructive/5 p-12 text-center"
              >
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  Error loading files
                </h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <button
                  onClick={fetchFiles}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : files.length > 0 ? (
              <motion.div
                key="files"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-3"
              >
                {files.map((file, index) => (
                  <motion.div
                    key={file.file_id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.1 },
                    }}
                  >
                    <FileCard
                      onDelete={() => deleteFile(file.file_id)}
                      filename={file.file_name}
                      onDownload={() =>
                        getFileUrl(file.file_id, file.file_name)
                      } // Pass file name
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border border-border rounded-lg bg-card p-12 text-center"
              >
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <File className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No files yet</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your first file to get started
                </p>
                <Button variant="outline" onClick={fetchFiles}>
                  <span>Refresh</span> <RefreshCw className="h-3 w-3" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
