import { Link2 } from "lucide-react";

export function Logo({className}: {className?: string}) {
  return (
    <div className={`flex items-center gap-1 cursor group ${className ?? ""}`}>
      <Link2 className="h-4 w-4 lg:h-6 md:w-6 text-black transition-transform group-hover:animate-spin " />
      <span className="text-sm lg:text-xl font-semibold">linkin.one</span>
    </div>
  );
}
