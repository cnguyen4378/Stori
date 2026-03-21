"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  function linkClass(href: string) {
    const active = pathname === href;
    return `text-sm px-3 py-1.5 rounded ${
      active
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-600 hover:text-gray-900"
    }`;
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Stori
        </Link>
        <div className="flex gap-1">
          <Link href="/explore" className={linkClass("/explore")}>
            Explore
          </Link>
          <Link href="/upload" className={linkClass("/upload")}>
            Upload
          </Link>
        </div>
      </div>
    </nav>
  );
}
