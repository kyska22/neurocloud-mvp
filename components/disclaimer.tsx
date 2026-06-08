import { ShieldCheck } from "lucide-react";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-forest/10 bg-mint/70 ${
        compact ? "px-4 py-3 text-xs" : "p-5 text-sm"
      } text-forest`}
    >
      <ShieldCheck className="mt-0.5 size-5 shrink-0" />
      <p>
        <strong>Esta plataforma no sustituye evaluación profesional.</strong>{" "}
        Los resultados son orientativos y no constituyen un diagnóstico médico.
      </p>
    </div>
  );
}
