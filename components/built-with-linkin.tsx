"use client";

import { Link2 } from "lucide-react";
import Link from "next/link";

export function BuiltWithLinkin() {
  return (
    <Link
      href="https://linkin.one"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-10 left-10 z-50 flex items-center gap-2 rounded-full bg-black/90 backdrop-blur-sm px-4 py-2 shadow-2xl border border-white/10 hover:bg-black transition-all hover:scale-105 group"
    >
      <Link2 className="h-5 w-5  text-blue-500 group-hover:rotate-12 transition-transform " />
      <span className="text-sm font-medium text-white/90 group-hover:text-white">
        Build with linkin.<span className="text-blue-500">one</span>
      </span>
    </Link>
  );
}
