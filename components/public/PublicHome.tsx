"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import PublicUploadFile from "../PublicUpload";
import { getPublicFile } from "@/lib/public.actions";

export default function PublicHome() {
  const [code, setCode] = useState("");

  // Function to fetch file using OTP code
  const fetchFile = async () => {
    if (code.length !== 5) {
      toast.error("Please enter a valid 5-digit code.");
      return;
    }

    const fileResponse = await getPublicFile(code);
    if (!fileResponse) {
      toast.error("No file found with this code. Please check again!");
      return;
    }

    const fileId = fileResponse.file_id;

    try {
      const res = await fetch("/api/getfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });

      const data = await res.json();

      if (res.ok && data.fileUrl) {
        toast.success("File opened successfully!");
        // Small delay before opening to ensure URL is available
        setTimeout(() => {
          window.open(data.fileUrl, "_blank");
        }, 100);
      } else {
        throw new Error("No file found with this code. Please check again!");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <div className="pt-4 lg:pt-8 pb-20">
      <Toaster position="bottom-right" richColors closeButton />

      {/* Upload File Section */}
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <PublicUploadFile />
      </div>

      {/* Retrieve File Section */}
      <div className="mt-16 container max-w-2xl mx-auto px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Retrieve Your File
          </h2>
          <p className="text-muted-foreground dark:text-neutral-500">
            Enter the 5-digit code you received to access your file.
          </p>
        </div>

        <Card className="w-full max-w-md mx-auto px-5">
          <CardContent className="p-6 flex flex-col items-center gap-10">
            {/* OTP Input */}
            <InputOTP
              maxLength={5}
              value={code}
              onChange={setCode}
              className="w-full"
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="size-10 md:size-12 text-xl md:text-2xl"
                />
                <InputOTPSlot
                  index={1}
                  className="size-10 md:size-12 text-xl md:text-2xl"
                />
                <InputOTPSlot
                  index={2}
                  className="size-10 md:size-12 text-xl md:text-2xl"
                />
                <InputOTPSlot
                  index={3}
                  className="size-10 md:size-12 text-xl md:text-2xl"
                />
                <InputOTPSlot
                  index={4}
                  className="size-10 md:size-12 text-xl md:text-2xl"
                />
              </InputOTPGroup>
            </InputOTP>

            <Button onClick={fetchFile} disabled={code.length !== 5}>
              Download File
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
