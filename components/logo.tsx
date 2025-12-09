import { Link2 } from "lucide-react";

export function Logo({className}: {className?: string}) {
  return (
    <div className={`flex items-center gap-1 cursor group ${className ?? ""}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#45c534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link2-icon lucide-link-2"><path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/></svg>

      <span className="text-sm lg:text-xl font-semibold">linkin.one</span>
    </div>
  );
}
