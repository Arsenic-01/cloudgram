"use client";
import FileCard from "@/components/FileCard";
import { Toaster } from "@/components/ui/sonner";
import UploadFile from "@/components/UploadFile";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { File, Loader2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Home() {
  type FileType = {
    id: string;
    timestamp: string;
    storage_type: string;
    file_id: string;
    file_name: string;
    uploader_id: string;
  };

  const user = useUser();
  const userId = user.user?.id;

  // QueryClient for refetching after deletion
  const queryClient = useQueryClient();

  // Fetch files function
  const fetchFiles = async () => {
    const res = await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploaderId: userId }),
    });

    if (!res.ok) {
      throw new Error("Failed to load files");
    }

    return res.json();
  };

  // UseQuery for fetching files
  const {
    data: files = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["files", userId], // Cache based on userId
    queryFn: fetchFiles,
    enabled: !!userId, // Only fetch when userId exists
    staleTime: 1000 * 60 * 5, // Cache files for 5 minutes
    retry: 2, // Retry fetching twice on failure
  });

  // Function to get file URL
  const getFileUrl = async (fileId: string) => {
    try {
      const res = await fetch("/api/getfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });

      const data = await res.json();

      if (res.ok && data.fileUrl) {
        setTimeout(() => {
          window.open(data.fileUrl, "_blank");
        }, 100);
        toast.success("File opened successfully!");
      } else {
        throw new Error(
          data.error || "Unknown error occurred while fetching file URL"
        );
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  // Function to delete a file
  const deleteFile = async (fileId: string) => {
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("File deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["files", userId] });
      } else {
        throw new Error("Failed to delete file");
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
      toast.error("Failed to delete file. Please try again.");
    }
  };

  return (
    <div className="pt-4 lg:pt-8 pb-20">
      <Toaster position="bottom-right" richColors closeButton />

      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <UploadFile refetchFiles={refetch} />

        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Your Files</h2>
            {files.length > 0 && (
              <Button variant="outline" onClick={() => refetch()}>
                <span>Refresh</span> <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
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
            ) : isError ? (
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
                <p className="text-muted-foreground mb-6">
                  {error?.message || "Something went wrong"}
                </p>
                <Button variant="outline" onClick={() => refetch()}>
                  <span>Try Again</span>
                </Button>
              </motion.div>
            ) : files.length > 0 ? (
              <motion.div
                key="files"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-3"
              >
                {files.map((file: FileType, index: number) => (
                  <motion.div
                    key={file.file_id + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.1 },
                    }}
                  >
                    <FileCard
                      timestamp={file.timestamp}
                      onDelete={() => deleteFile(file.file_id)}
                      filename={file.file_name}
                      onDownload={() => getFileUrl(file.file_id)}
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
                <Button variant="outline" onClick={() => refetch()}>
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
