"use client";

import { Link2 } from "lucide-react";
import Link from "next/link";

export function BuiltWithLinkin() {
  return (
    <Link
      href="https://linkin.one"
      target="_blank"
      rel="noopener noreferrer"
      className="mx-6 flex items-center justify-center gap-2 rounded-full bg-black/90 backdrop-blur-sm px-4 py-2 shadow-2xl hover:bg-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] group md:fixed md:bottom-10 md:left-10 md:z-50 md:w-auto"
    >
      <Link2 className="h-5 w-5  text-yellow-500 group-hover:rotate-12 transition-transform " />
      <span className="text-sm font-medium text-white/90 group-hover:text-white">
        Build with linkin.<span className="text-yellow-500">one</span>
      </span>
    </Link>
  );
}
