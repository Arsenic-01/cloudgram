"use client";

import Home from "@/components/Home";
import LandingPage from "@/components/LandingPage";
import { useUser } from "@clerk/nextjs";

const Index = () => {
  const { user } = useUser();

  if (!user)
    return (
      <div className="flex flex-col items-center justify-start pt-20 pb-10">
        <LandingPage />
      </div>
    );

  return <Home />;
};

export default Index;
