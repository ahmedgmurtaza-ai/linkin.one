"use client";

import Link from "next/link";

export function ProfileFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer
      className={`text-center text-muted-foreground ${
        compact ? "text-[10px] mt-4" : "text-xs mt-8"
      }`}
    >
      <div className="space-y-2">
        <p>
          Powered by{" "}
          <a href="/" className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
            linkin.one
          </a>
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/feedback" className="hover:text-foreground transition-colors">
            Feedback
          </Link>
          <span>•</span>
          <Link href="/changelog" className="hover:text-foreground transition-colors">
            Changelog
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
