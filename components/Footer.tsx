import React from "react";
import { Github, Linkedin, ExternalLink, Cloud, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-12 mt-16 border-t border-t-neutral-300 dark:border-t-neutral-800">
      <div className="container px-6 lg:max-w-5xl 2xl:max-w-6xl mx-auto">
        <div className="grid grid-cols-4 sm:justify-items-center gap-8 mb-12">
          <div className="md:col-span-2 col-span-4">
            <div className="mb-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-foreground w-fit"
              >
                <Cloud
                  className="h-6 w-6 text-blue-400 fill-blue-300"
                  strokeWidth={1.5}
                />
                <span className="font-medium text-xl tracking-tight">
                  CloudGram
                </span>
              </Link>
            </div>
            <p className="text-foreground/70 max-w-md mb-6">
              A modern cloud storage solution that leverages Telegram and
              Appwrite to provide flexible, secure file storage for all your
              needs.
            </p>
            <div className="col-span-2 md:col-span-1">
              <div className="flex space-x-4">
                <SocialLink
                  href="https://github.com/Arsenic-01/"
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
                <SocialLink
                  href="https://x.com/arsenic_dev"
                  icon={<Twitter className="h-5 w-5" />}
                  label="Twitter"
                />
              </div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-medium text-lg mb-4">Product</h4>
            <nav className="flex flex-col space-y-2">
              <FooterLink href="/public">Public</FooterLink>
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">About</h4>
            <nav className="flex flex-col space-y-2">
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

        <div className="border-t border-t-neutral-200 dark:border-t-neutral-900 pt-8 ">
          <div className="text-foreground/60 text-center text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} CloudGram. Created by{" "}
            <Link
              href={"https://vedantbhor.vercel.app/"}
              className="hover:underline hover:underline-offset-4 font-semibold"
            >
              Vedant Bhor
            </Link>{" "}
            as a hobby project.
          </div>
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
