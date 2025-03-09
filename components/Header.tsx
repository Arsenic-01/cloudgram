"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Cloud, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";

interface HeaderProps {
  className?: string;
}

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b glass-effect transition-smooth backdrop-blur-sm",
        className
      )}
    >
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex gap-2 items-center justify-center text-xl font-bold tracking-tight transition-smooth hover:opacity-80"
          >
            <Cloud className="size-8 fill-blue-300 text-blue-400" />
            <span className="hidden sm:inline">Cloudgram</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-foreground/80 font-medium transition-smooth hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/fast"
            className="text-foreground/80 font-medium transition-smooth hover:text-primary"
          >
            Fast Upload
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ModeToggle />

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default" size="sm">
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-12 w-10",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden rounded-full"
            onClick={toggleMobileMenu}
            aria-label="toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-sm md:hidden transition-smooth overflow-hidden",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col space-y-4 p-6 animate-fade-in">
          <Link
            href="/"
            className="text-lg font-medium py-2 border-b border-border/50 transition-smooth hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/fast"
            className="text-lg font-medium py-2 border-b border-border/50 transition-smooth hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Fast Upload
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
