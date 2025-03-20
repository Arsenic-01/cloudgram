"use client";

import FileCard from "@/components/FileCard";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import UploadFastFile from "@/components/UploadFastFile";
import { deleteFastFile, getFastFiles } from "@/lib/files.actions";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { File, Loader2, RefreshCw, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function FastHome() {
  // type FileType = {
  //   id: string;
  //   timestamp: string;
  //   storage_type: string;
  //   file_id: string;
  //   file_name: string;
  //   uploader_id: string;
  // };

  const { user } = useUser();
  const userId = user?.id;
  const queryClient = useQueryClient();

  // Fetch files using React Query
  const {
    data: files = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fastFiles", userId],
    queryFn: () => getFastFiles(userId!),
    enabled: !!userId, // Prevents execution if userId is undefined
  });

  // Delete file mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, fileId }: { id: string; fileId: string }) => {
      const res = await deleteFastFile(id, fileId);
      if (!res.ok) throw new Error("Failed to delete file");
    },
    onSuccess: () => {
      toast.success("File deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["fastFiles", userId] }); // Refresh files
    },
    onError: () => {
      toast.error("Failed to delete file. Please try again.");
    },
  });

  return (
    <div className="pt-4 lg:pt-8 pb-20">
      <Toaster position="bottom-right" richColors closeButton />

      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <UploadFastFile refetchFiles={refetch} />

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
                <p className="text-muted-foreground mb-6">
                  Failed to load your files. Please try again later.
                </p>
                <Button variant="outline" onClick={() => refetch()}>
                  Try Again
                </Button>
              </motion.div>
            ) : files?.length > 0 ? (
              <motion.div
                key="files"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-3"
              >
                {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.1 },
                    }}
                  >
                    <FileCard
                      timestamp={file.timestamp}
                      onDelete={() =>
                        deleteMutation.mutate({
                          id: file.id,
                          fileId: file.file_id,
                        })
                      }
                      filename={file.file_name}
                      fileId={file.file_id}
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
