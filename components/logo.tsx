import { Link2 } from "lucide-react";

export function Logo({className}: {className?: string}) {
  return (
    <div className={`flex items-center gap-1 cursor group ${className ?? ""}`}>
      <Link2 className="h-6 w-6 text-black transition-transform group-hover:animate-spin " />
      <span className="text-xl font-semibold">linkin.one</span>
    </div>
  );
}
