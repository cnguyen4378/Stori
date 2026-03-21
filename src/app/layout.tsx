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
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
