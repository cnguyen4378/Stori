"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  function linkClass(href: string) {
    const active = pathname === href;
    return `text-sm px-4 py-2 rounded-full transition duration-200 ${
      active
        ? "bg-[#e8f0e4] text-[#42583b] font-semibold"
        : "text-[#6b5748] hover:text-[#3f2f22] hover:bg-[#efe3d4]"
    }`;
  }

  return (
    <nav className="bg-[#fbf6f0] border-b border-[#e5d6c5] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-[#3f2f22] tracking-tight">
          Stori
        </Link>
        <div className="flex gap-1">
          <Link href="/explore" className={linkClass("/explore")}>
            Explore
          </Link>
          <Link href="/upload" className={linkClass("/upload")}>
            Share
          </Link>
        </div>
      </div>
    </nav>
  );
}
