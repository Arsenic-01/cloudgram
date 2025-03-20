import React from "react";
import {
  Download,
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  FileArchive,
  FileBox,
  Trash,
  FileInput,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";

interface FileCardProps {
  fileId?: string;
  filename: string;
  onDelete: () => void;
  onDownload?: () => void;
  className?: string;
}

const FileCard: React.FC<FileCardProps> = ({
  fileId,
  filename,
  onDownload,
  onDelete,
  className,
}) => {
  // Detect file type based on extension
  const getFileIcon = () => {
    const extension = filename.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
      case "rtf":
        return <FileText className="h-5 w-5" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <FileImage className="h-5 w-5" />;
      case "mp3":
      case "wav":
      case "ogg":
        return <FileAudio className="h-5 w-5" />;
      case "mp4":
      case "mov":
      case "avi":
      case "webm":
        return <FileVideo className="h-5 w-5" />;
      case "zip":
      case "rar":
      case "7z":
      case "tar":
      case "gz":
        return <FileArchive className="h-5 w-5" />;
      default:
        return <FileBox className="h-5 w-5" />;
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-md transition-all duration-300 bg-white dark:bg-card border-neutral-300 dark:border-neutral-800",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="p-2 flex items-center justify-between gap-2 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-transparent border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-primary transition-transform duration-200 group-hover:scale-105">
              {getFileIcon()}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm truncate max-w-[170px] md:max-w-[300px] xl:max-w-2xl group-hover:text-primary transition-colors">
                {filename}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center">
            {onDownload && (
              <Button
                onClick={onDownload}
                variant={"outline"}
                aria-label={`Download ${filename}`}
              >
                <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
              </Button>
            )}
            {!onDownload && (
              <>
                <Button
                  variant={"outline"}
                  aria-label={`View ${filename}`}
                  asChild
                >
                  <Link
                    target="_blank"
                    href={`https://cloud.appwrite.io/v1/storage/buckets/67dbc57500332a2ceea0/files/${fileId}/view?project=6720b2e90009d3a26528`}
                  >
                    <FileInput className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </Link>
                </Button>
                <Button
                  variant={"outline"}
                  aria-label={`Download ${filename}`}
                  asChild
                >
                  <Link
                    target="_blank"
                    href={`https://cloud.appwrite.io/v1/storage/buckets/67dbc57500332a2ceea0/files/${fileId}/download?project=6720b2e90009d3a26528`}
                  >
                    <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </Link>
                </Button>
              </>
            )}
            <Button
              onClick={onDelete}
              variant={"outline"}
              aria-label={`Delete ${filename}`}
            >
              <Trash className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileCard;
