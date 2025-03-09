import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const dm_sans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudGram - Secure Cloud File Storage & Sharing",
  description:
    "CloudGram is a secure and efficient cloud storage platform designed for seamless file uploads, sharing, and collaboration. Experience fast and private file transfers with ease.",
  keywords: [
    "Cloud storage",
    "File sharing",
    "Secure file storage",
    "CloudGram",
    "Online file transfer",
    "Encrypted storage",
  ],
  openGraph: {
    title: "CloudGram - Secure Cloud File Storage & Sharing",
    description:
      "Store and share files securely with CloudGram. Enjoy fast uploads, privacy-focused storage, and seamless collaboration.",
    url: "https://cloudgram-01.vercel.app/",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${dm_sans.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
