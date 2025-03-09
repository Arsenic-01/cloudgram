import React from "react";
import { Github, Linkedin, ExternalLink, Cloud } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 dark:bg-secondary/10 py-12 border-t border-t-neutral-400 dark:border-t-neutral-800">
      <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 text-foreground mb-4">
              <Cloud className="h-6 w-6" strokeWidth={1.5} />
              <span className="font-medium text-xl tracking-tight">
                CloudGram
              </span>
            </div>
            <p className="text-foreground/70 max-w-md mb-6">
              A modern cloud storage solution that leverages Telegram and
              Supabase to provide flexible, secure file storage for all your
              needs.
            </p>

            <div className="flex space-x-4">
              <SocialLink
                href="https://github.com/Arsenic-01/cloudgram"
                icon={<Github className="h-5 w-5" />}
                label="GitHub"
              />
              <SocialLink
                href="https://vedantbhor.vercel.app/"
                icon={<ExternalLink className="h-5 w-5" />}
                label="Portfolio"
              />
              <SocialLink
                href="https://www.linkedin.com/in/vedant-bhor-39287828b/"
                icon={<Linkedin className="h-5 w-5" />}
                label="LinkedIn"
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Product</h4>
            <nav className="flex flex-col space-y-2">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Company</h4>
            <nav className="flex flex-col space-y-2">
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="https://github.com/Arsenic-01/cloudgram">
                GitHub
              </FooterLink>
              <FooterLink href="https://vedantbhor.vercel.app/">
                Portfolio
              </FooterLink>
              <FooterLink href="mailto:vedantbhorofficial@gmail.com?subject=Hello%20I%27m%20____%20from%20____%20company&body=I%20want%20to%20start%20a%20new%20project%20about%20____%20and%20time%20duration%20is%20___%20days.">
                Contact
              </FooterLink>
            </nav>
          </div>
        </div>

        <div className="border-t border-t-neutral-400 dark:border-t-neutral-900 pt-8 ">
          <p className="text-foreground/60 text-center text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} CloudGram. Created by Vedant Bhor as a
            hobby project.
          </p>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-secondary smooth-transition"
    aria-label={label}
  >
    {icon}
  </a>
);

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  small?: boolean;
}

const FooterLink = ({ href, children, small = false }: FooterLinkProps) => (
  <a
    href={href}
    className={`text-foreground/70 hover:text-foreground smooth-transition ${
      small ? "text-sm" : ""
    }`}
  >
    {children}
  </a>
);

export default Footer;
