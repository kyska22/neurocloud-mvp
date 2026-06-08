import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  inverse = false,
}: {
  href?: string;
  inverse?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 font-bold tracking-tight",
        inverse ? "text-white" : "text-ink",
      )}
    >
      <span
        className={cn(
          "grid size-10 place-items-center rounded-2xl text-lg",
          inverse ? "bg-white/12 text-white ring-1 ring-white/15" : "bg-forest text-white",
        )}
      >
        N
      </span>
      <span className="text-lg">NeuroApoyo</span>
    </Link>
  );
}
