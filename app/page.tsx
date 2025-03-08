"use client";

import Home from "@/components/Home";
import { SignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import React from "react";

const Index = () => {
  const { user } = useUser();

  if (!user)
    return (
      <div className="overflow-y-scroll flex flex-col items-center justify-start pt-20 pb-10">
        <SignIn />
      </div>
    );

  return <Home />;
};

export default Index;
