import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Heart, Sparkles, Star } from "lucide-react";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="relative py-0 pb-20 overflow-hidden">
      {/* Background decoration - static version */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40 dark:opacity-15">
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-[color:var(--chart-1)]/20 filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[color:var(--chart-2)]/20 filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/5 w-64 h-64 rounded-full bg-[color:var(--chart-3)]/20 filter blur-3xl"></div>
        <div className="absolute bottom-1/5 left-1/5 w-80 h-80 rounded-full bg-[color:var(--chart-4)]/20 filter blur-3xl"></div>
      </div>

      {/* Static decoration elements */}
      <div className="absolute top-40 right-10 opacity-20 dark:opacity-10">
        <Star className="h-8 w-8 text-[color:var(--chart-1)]" />
      </div>
      <div className="absolute bottom-40 left-10 opacity-20 dark:opacity-10">
        <Sparkles className="h-10 w-10 text-[color:var(--chart-2)]" />
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
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-blue-400 dark:bg-blue-500 -z-10 transform -rotate-1"></span>
            </span>{" "}
            Reimagined for Modern Web
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-foreground/80 dark:text-foreground/60 leading-relaxed text-balance">
            Store unlimited files up to 50MB each through Telegram or get
            blazing fast 2GB uploads with our S3 Supabase backend. Secure,
            scalable, and incredibly simple.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <SignUpButton mode="modal">
              <Button
                variant={"default"}
                className="flex items-center py-5 text-lg"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
