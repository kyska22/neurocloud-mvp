import type { PatientStatus } from "@/lib/types";
import { Pill } from "./ui";

const statusMap: Record<PatientStatus, { label: string; className: string }> = {
  en_evaluacion: { label: "En evaluación", className: "bg-amber-50 text-amber-700" },
  evaluado: { label: "Evaluado", className: "bg-blue-50 text-blue-700" },
  laudo_entregado: { label: "Informe entregado", className: "bg-emerald-50 text-emerald-700" },
  archivado: { label: "Archivado", className: "bg-slate-100 text-slate-600" },
};

export function StatusBadge({ status }: { status: PatientStatus }) {
  const current = statusMap[status];
  return <Pill className={current.className}>{current.label}</Pill>;
}
