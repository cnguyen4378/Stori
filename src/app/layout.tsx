import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Stori — First-Gen Student Stories",
  description:
    "What I wish I knew — real stories from first-gen students. Share and discover audio stories with AI-powered search.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f7f0e7] text-[#3f2f22] min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
