import React from "react";
import {
  Cloud,
  Zap,
  Lock,
  Server,
  Infinity,
  FileUp,
  ArrowDownToLine,
  Trash2,
} from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 my-4 rounded-full bg-transparent backdrop-blur-sm border border-neutral-300 dark:border-neutral-800  text-xs font-medium tracking-wider uppercase">
            Key Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Why Choose CloudGram?
          </h2>
          <p className="max-w-2xl mx-auto text-foreground/80 text-lg">
            Our dual backend approach gives you the flexibility to choose the
            right storage solution for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <Infinity className="h-8 w-8 text-chart-1" strokeWidth={1.5} />
            }
            title="Unlimited Storage"
            description="Store as many files as you need up to 20MB each with our Telegram backend integration."
          />

          <FeatureCard
            icon={<Zap className="h-8 w-8 text-chart-2" strokeWidth={1.5} />}
            title="Blazing Fast S3"
            description="Need speed? Our Appwrite S3 backend delivers lightning-fast uploads and downloads up to 50MB."
          />

          <FeatureCard
            icon={<Lock className="h-8 w-8 text-chart-3" strokeWidth={1.5} />}
            title="Secure Authentication"
            description="Powered by Clerk for seamless, secure authentication that scales with your needs."
          />

          <FeatureCard
            icon={<Server className="h-8 w-8 text-chart-4" strokeWidth={1.5} />}
            title="Scalable Infrastructure"
            description="Built on Vercel, our platform scales automatically to meet your demands."
          />

          <FeatureCard
            icon={<FileUp className="h-8 w-8 text-chart-5" strokeWidth={1.5} />}
            title="Easy File Management"
            description="Intuitive interface for uploading, organizing, and managing your files."
          />

          <FeatureCard
            icon={<Cloud className="h-8 w-8 text-chart-1" strokeWidth={1.5} />}
            title="Dual Backend"
            description="Choose between Telegram or Appwrite storage backends based on your specific needs."
          />
        </div>

        <div className="mt-20">
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <div className="grid lg:grid-cols-6 md:grid-cols-2 gap-12 items-center">
              <div className="md:cols-span-1 lg:col-span-4">
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  How CloudGram Works
                </h3>
                <div className="space-y-6">
                  <StepItem
                    number="01"
                    icon={<FileUp className="h-6 w-6 text-chart-1" />}
                    title="Upload Your Files"
                    description="Select files up to 20MB (Telegram) or 50MB (Appwrite) and upload them to our secure cloud."
                  />

                  <StepItem
                    number="02"
                    icon={<Server className="h-6 w-6 text-chart-2" />}
                    title="Cloud Processing"
                    description="Files are securely processed and stored in either Telegram channels or Appwrite S3 buckets."
                  />

                  <StepItem
                    number="03"
                    icon={<ArrowDownToLine className="h-6 w-6 text-chart-3" />}
                    title="Access Anywhere"
                    description="Download your files from any device, anytime, with our responsive web interface."
                  />

                  <StepItem
                    number="04"
                    icon={<Trash2 className="h-6 w-6 text-chart-4" />}
                    title="Manage & Delete"
                    description="Easily manage your storage and remove files when no longer needed."
                  />
                </div>
              </div>

              <div className="relative h-full lg:col-span-2">
                <div className="aspect-square rounded-2xl glass p-8 flex items-center justify-center">
                  <div className="relative w-full max-w-xs mx-auto">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-chart-1/20 to-chart-2/20 rounded-xl blur-xl -z-10"></div>
                    <div className="glass-card rounded-xl p-6 relative overflow-hidden">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-lg font-medium">My Files</div>
                        <Cloud className="h-5 w-5 text-chart-1" />
                      </div>

                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="py-3 border-b border-border/30 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                              <FileUp className="h-4 w-4 text-foreground/70" />
                            </div>
                            <div className="text-sm">file_{i}.pdf</div>
                          </div>
                          <div className="text-xs text-foreground/60">
                            50 MB
                          </div>
                        </div>
                      ))}

                      <button className="mt-4 w-full py-2 rounded-lg bg-primary/90 text-primary-foreground text-sm">
                        Upload New
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="glass-card rounded-xl p-6 hover-scale border border-neutral-300 dark:border-neutral-800">
    <div className="h-12 w-12 rounded-lg border border-neutral-300 dark:border-neutral-800  dark:bg-neutral-950 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-foreground/70">{description}</p>
  </div>
);

interface StepItemProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StepItem = ({ number, icon, title, description }: StepItemProps) => (
  <div className="flex space-x-4">
    <div className="flex-shrink-0">
      <div className="relative">
        <div className="h-10 w-10 rounded-full border border-neutral-300 dark:border-neutral-800 flex items-center justify-center">
          {icon}
        </div>
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-chart-1 flex items-center justify-center text-xs text-white font-medium">
          {number}
        </span>
      </div>
    </div>
    <div>
      <h4 className="text-lg font-medium mb-1">{title}</h4>
      <p className="text-foreground/70 text-sm">{description}</p>
    </div>
  </div>
);

export default Features;
