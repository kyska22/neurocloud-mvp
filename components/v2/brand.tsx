import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export function Brand({
  locale,
  inverse = false,
}: {
  locale: Locale;
  inverse?: boolean;
}) {
  return (
    <Link
      href={`/${locale}`}
      className={`inline-flex items-center gap-3 font-bold tracking-tight ${
        inverse ? "text-white" : "text-slate-950 dark:text-white"
      }`}
    >
      <span className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        <BrainCircuit className="size-5" />
      </span>
      <span className="text-lg">NeuroApoyo</span>
    </Link>
  );
}
