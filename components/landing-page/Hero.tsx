import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="relative pt-0 pb-20 overflow-x-clip">
      {/* Background decoration - static version */}
      <div className="absolute top-0 left-0 w-full h-full  -z-10 opacity-40 dark:opacity-15">
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-[color:var(--chart-1)]/20 filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[color:var(--chart-2)]/20 filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/5 w-64 h-64 rounded-full bg-[color:var(--chart-3)]/20 filter blur-3xl"></div>
        <div className="absolute bottom-1/5 left-1/5 w-80 h-80 rounded-full bg-[color:var(--chart-4)]/20 filter blur-3xl"></div>
      </div>

      <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-transparent backdrop-blur-sm border border-neutral-300 dark:border-neutral-800  text-xs font-medium tracking-wider uppercase">
            <Heart className="h-3 w-3 fill-red-600 text-red-500 mr-2" />
            Unlimited Storage Solution
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance max-w-4xl">
            <span className="relative">
              Cloud Storage
              <span className="absolute bottom-0 sm:-bottom-1 left-0 right-0 h-2 sm:h-3 bg-blue-400 dark:bg-blue-500 -z-10 transform -rotate-1"></span>
            </span>{" "}
            Reimagined for Modern Web
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-foreground/80 dark:text-foreground/60 leading-relaxed text-balance">
            Store unlimited 20MB files via Telegram or enjoy lightning-fast 50MB
            uploads with our Appwrite S3 backend—secure, scalable, and
            effortless.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <SignUpButton mode="modal">
              <Button className="py-3 w-full">
                <div className="flex items-center justify-center px-3">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
