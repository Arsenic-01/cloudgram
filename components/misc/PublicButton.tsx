"use client";

import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const PublicButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="py-3"
      onClick={() => router.push("/public")}
    >
      <div className="flex items-center justify-center px-3">
        Try Public
        <ArrowRight className="size-4 ml-2 -rotate-45" />
      </div>
    </Button>
  );
};

export default PublicButton;
