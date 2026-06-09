import { ShieldCheck } from "lucide-react";

export function ClinicalDisclaimer({
  title,
  detail,
  compact = false,
}: {
  title: string;
  detail: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-blue-200/70 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100 ${
        compact ? "px-4 py-3 text-xs" : "p-5 text-sm"
      }`}
    >
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
      <p>
        <strong>{title}</strong> {detail}
      </p>
    </div>
  );
}
