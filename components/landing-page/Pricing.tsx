import React from "react";
import { Check, Cloud, Database } from "lucide-react";

const Pricing = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center my-5 px-3 py-1 rounded-full bg-transparent backdrop-blur-sm border border-neutral-300 dark:border-neutral-800  text-xs font-medium tracking-wider uppercase">
            What we provide
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Choose Your Storage Backend
          </h2>
          <p className="max-w-2xl mx-auto text-foreground/80 text-lg">
            We offer two powerful storage solutions to meet your specific needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            icon={
              <Cloud className="h-10 w-10 text-chart-1" strokeWidth={1.5} />
            }
            title="Telegram Storage"
            price="Free"
            description="Perfect for storing many small files with unlimited capacity."
            features={[
              "Unlimited storage capacity",
              "50MB maximum file size",
              "Secure Telegram backend",
              "Basic file management",
              "Slower upload/download speeds",
              "No bandwidth limits",
            ]}
            popular={false}
          />

          <PricingCard
            icon={
              <Database className="h-10 w-10 text-chart-2" strokeWidth={1.5} />
            }
            title="Supabase S3"
            price="Free"
            description="Blazing fast storage for larger files with premium features."
            features={[
              "2GB maximum file size",
              "Lightning-fast transfers",
              "Secure S3 bucket storage",
              "Advanced file management",
              "Premium bandwidth",
              "Direct download links",
            ]}
            popular={true}
          />
        </div>

        <div className="mt-20 text-center">
          <div className="glass-card rounded-xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
            <p className="text-foreground/80 mb-6">
              Contact us for tailored storage solutions for your organization or
              special needs.
            </p>
            <a
              href="https://github.com/Arsenic-01/cloudgram"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-border hover:bg-secondary smooth-transition"
            >
              Visit GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

interface PricingCardProps {
  icon: React.ReactNode;
  title: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
}

const PricingCard = ({
  icon,
  title,
  price,
  description,
  features,
  popular,
}: PricingCardProps) => (
  <div
    className={`glass-card rounded-xl p-8 relative ${
      popular ? "border-chart-2 shadow-lg" : ""
    }`}
  >
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-chart-2 text-white text-xs font-bold rounded-full">
        RECOMMENDED
      </div>
    )}

    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 dark:bg-primary/5 mx-auto mb-6">
      {icon}
    </div>

    <h3 className="text-2xl font-bold text-center mb-2">{title}</h3>
    <div className="text-center mb-4">
      <span className="text-4xl font-bold">{price}</span>
    </div>

    <p className="text-center text-foreground/70 mb-6">{description}</p>

    <div className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start space-x-3">
          <Check className="h-5 w-5 text-chart-1 flex-shrink-0 mt-0.5" />
          <span className="text-foreground/80">{feature}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Pricing;
