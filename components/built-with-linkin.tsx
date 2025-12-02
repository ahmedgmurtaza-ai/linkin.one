"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Link2 } from "lucide-react";

interface BuiltWithLinkinProps {
  username?: string;
}

export function BuiltWithLinkin({ username }: BuiltWithLinkinProps) {
  return (
    <div className="flex justify-center">
      <Link
        href="https://linkin.one"
        target="_blank"
        rel="noopener noreferrer"
        // className="mb-6 inline-flex items-center justify-center gap-2 rounded-full  px-6 py-3 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
      >
<Button  size="lg" variant={"default"} className="mb-6 inline-flex items-center justify-center gap-2 rounded-full  px-6 py-3 shadow-lg hover:shadow-xl transition-all hover:scale-105 group ">

      <span className="flex items-center gap-2 ">
          {username ? (
            <>
              join <span className="font-semibold">{username}</span> on <Link2 className="text-yellow-200 transition-transform group-hover:rotate-45"/> linkin.one
            </>
          ) : (
            "create your profile on linkin.one"
          )}
        </span>
  
</Button>
      </Link>
    </div>
  );
}

