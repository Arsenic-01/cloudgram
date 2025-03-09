"use client";

import FastHome from "@/components/FastHome";
import { SignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import React from "react";

const Index = () => {
  const { user } = useUser();

  if (!user)
    return (
      <div className="flex flex-col items-center justify-start pt-20 pb-10">
        <SignIn />
      </div>
    );

  return <FastHome />;
};

export default Index;
