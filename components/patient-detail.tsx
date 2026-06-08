"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardPlus,
  Eye,
  Mail,
  UserRound,
  X,
} from "lucide-react";
import type { Patient, PatientStatus, TestAssignment } from "@/lib/types";
import { loadPatients, savePatients } from "@/lib/demo-store";
import { TESTS } from "@/lib/tests";
import { formatDate, initials } from "@/lib/utils";
import { AppShell } from "./app-shell";
import { Button, Card, Pill } from "./ui";
import { StatusBadge } from "./status-badge";
import { Disclaimer } from "./disclaimer";

const statuses: { value: PatientStatus; label: string }[] = [
  { value: "en_evaluacion", label: "En evaluación" },
  { value: "evaluado", label: "Evaluado" },
  { value: "laudo_entregado", label: "Informe entregado" },
  { value: "archivado", label: "Archivado" },
];

export function PatientDetail({ patientId }: { patientId: string }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedResult, setSelectedResult] = useState<TestAssignment | null>(null);
  const patient = patients.find((item) => item.id === patientId);

  useEffect(() => {
    setPatients(loadPatients());
    setHydrated(true);
  }, []);

  function updatePatient(update: (current: Patient) => Patient) {
    const next = patients.map((item) => (item.id === patientId ? update(item) : item));
    setPatients(next);
    savePatients(next);
  }

  function assignTest(testId: string) {
    if (!patient || patient.assignments.some((item) => item.testId === testId && item.status === "pending")) {
      return;
    }
    updatePatient((current) => ({
      ...current,
      assignments: [
        {
          id: `as-${Date.now()}`,
          patientId,
          testId,
          status: "pending",
          assignedAt: new Date().toISOString(),
        },
        ...current.assignments,
      ],
    }));
    const test = TESTS.find((item) => item.id === testId);
    setNotice(`${test?.title ?? "Test"} asignado correctamente.`);
    window.setTimeout(() => setNotice(""), 3000);
  }

  if (!hydrated) {
    return (
      <AppShell role="doctor" name="Dra. Elena Torres">
        <div className="grid min-h-screen place-items-center text-sm text-ink/45">
          Cargando ficha...
        </div>
      </AppShell>
    );
  }

  if (!patient) {
    return (
      <AppShell role="doctor" name="Dra. Elena Torres">
        <div className="grid min-h-screen place-items-center p-8">
          <div className="text-center">
            <p className="text-2xl font-bold">Paciente no encontrado</p>
            <Link href="/doctor" className="mt-4 inline-block font-semibold text-forest">
              Volver al panel
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="doctor" name="Dra. Elena Torres">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        <Link href="/doctor" className="inline-flex items-center gap-2 text-sm font-semibold text-ink/55">
          <ArrowLeft className="size-4" /> Volver a pacientes
        </Link>

        <header className="mt-7 flex flex-col gap-5 rounded-3xl bg-forest p-7 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <span className="grid size-16 place-items-center rounded-2xl bg-white/10 text-xl font-bold">
              {initials(patient.name)}
            </span>
            <div>
              <div className="mb-2">
                <StatusBadge status={patient.status} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
              <p className="mt-1 text-sm text-white/60">Paciente desde {formatDate(patient.createdAt)}</p>
            </div>
          </div>
          <select
            value={patient.status}
            onChange={(event) =>
              updatePatient((current) => ({
                ...current,
                status: event.target.value as PatientStatus,
              }))
            }
            className="rounded-full border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-ink"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </header>

        {notice && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            <CheckCircle2 className="size-5" />
            {notice}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-6">
            <Card>
              <h2 className="font-bold">Información</h2>
              <div className="mt-5 space-y-4 text-sm">
                <Info icon={Mail} label="Correo" value={patient.email} />
                <Info icon={UserRound} label="Edad" value={`${patient.age} años`} />
                <Info icon={Calendar} label="Última actividad" value={formatDate(patient.lastActivity)} />
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-mint text-forest">
                  <ClipboardPlus className="size-5" />
                </span>
                <div>
                  <h2 className="font-bold">Asignar test</h2>
                  <p className="text-xs text-ink/45">Disponible al instante</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {TESTS.map((test) => {
                  const pending = patient.assignments.some(
                    (item) => item.testId === test.id && item.status === "pending",
                  );
                  return (
                    <button
                      key={test.id}
                      onClick={() => assignTest(test.id)}
                      disabled={pending}
                      className="flex w-full items-center justify-between rounded-2xl border border-black/5 p-3 text-left transition hover:bg-cream disabled:opacity-45"
                    >
                      <span>
                        <span className="block text-sm font-semibold">{test.shortTitle}</span>
                        <span className="text-xs text-ink/40">{test.estimatedMinutes} min</span>
                      </span>
                      <span className="text-xs font-bold text-forest">{pending ? "Asignado" : "+ Asignar"}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Tests y resultados</h2>
                <p className="mt-1 text-sm text-ink/45">Historial de evaluaciones asignadas.</p>
              </div>
              <Pill className="bg-cream text-ink/50">{patient.assignments.length} registros</Pill>
            </div>
            <div className="mt-6 space-y-4">
              {patient.assignments.length ? (
                patient.assignments.map((assignment) => {
                  const test = TESTS.find((item) => item.id === assignment.testId);
                  return (
                    <div key={assignment.id} className="rounded-2xl border border-black/5 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <Pill
                            className={
                              assignment.status === "completed"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }
                          >
                            {assignment.status === "completed" ? "Completado" : "Pendiente"}
                          </Pill>
                          <h3 className="mt-3 font-bold">{test?.title}</h3>
                          <p className="mt-1 text-xs text-ink/40">
                            Asignado el {formatDate(assignment.assignedAt)}
                          </p>
                        </div>
                        {assignment.score !== undefined && (
                          <div className="text-right">
                            <p className="text-3xl font-bold text-forest">{assignment.score}</p>
                            <p className="text-xs text-ink/40">índice orientativo</p>
                          </div>
                        )}
                      </div>
                      {assignment.summary && (
                        <div className="mt-4 flex gap-3 rounded-2xl bg-mint/60 p-4 text-sm leading-6 text-forest">
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                          <p>{assignment.summary}</p>
                        </div>
                      )}
                      {assignment.status === "completed" && (
                        <Button
                          variant="secondary"
                          className="mt-4"
                          onClick={() => setSelectedResult(assignment)}
                        >
                          <Eye className="size-4" /> Ver resultados
                        </Button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl bg-cream p-8 text-center text-sm text-ink/45">
                  Todavía no hay tests asignados.
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Disclaimer />
        </div>
      </div>

      {selectedResult && (
        <ResultModal assignment={selectedResult} onClose={() => setSelectedResult(null)} />
      )}
    </AppShell>
  );
}

function ResultModal({
  assignment,
  onClose,
}: {
  assignment: TestAssignment;
  onClose: () => void;
}) {
  const test = TESTS.find((item) => item.id === assignment.testId);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Resultados de ${test?.title ?? "test"}`}
    >
      <div className="mx-auto my-6 w-full max-w-3xl">
        <Card className="p-0">
          <div className="flex items-start justify-between border-b border-black/5 p-6 sm:p-7">
            <div className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-mint text-forest">
                <BarChart3 className="size-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-coral">
                  Resultado orientativo
                </p>
                <h2 className="mt-1 text-2xl font-bold">{test?.title}</h2>
                <p className="mt-1 text-sm text-ink/45">
                  Completado el{" "}
                  {assignment.completedAt ? formatDate(assignment.completedAt) : "sin fecha"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar resultados"
              className="rounded-full p-2 text-ink/45 hover:bg-cream"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-6 p-6 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-[0.35fr_1fr]">
              <div className="rounded-2xl bg-forest p-5 text-white">
                <p className="text-xs text-white/60">Índice orientativo</p>
                <p className="mt-2 text-4xl font-bold">{assignment.score ?? "—"}</p>
                <p className="mt-1 text-xs text-white/50">No equivale a un diagnóstico</p>
              </div>
              <div className="rounded-2xl bg-mint/65 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-forest/60">
                  Resumen
                </p>
                <p className="mt-2 text-sm leading-6 text-forest">
                  {assignment.summary ?? "Sin resumen profesional todavía."}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Respuestas registradas</h3>
                <Pill className="bg-cream text-ink/50">
                  {Object.keys(assignment.answers ?? {}).length} respuestas
                </Pill>
              </div>
              <div className="mt-4 space-y-3">
                {test?.questions.map((question, index) => (
                  <div key={question.id} className="rounded-2xl border border-black/5 p-4">
                    <p className="text-xs font-bold text-ink/35">Pregunta {index + 1}</p>
                    <p className="mt-1 text-sm font-semibold leading-6">{question.prompt}</p>
                    <div className="mt-3 rounded-xl bg-cream px-4 py-3 text-sm text-ink/65">
                      {assignment.answers?.[question.id] ?? "Sin respuesta registrada"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Disclaimer compact />
            <div className="flex justify-end">
              <Button onClick={onClose}>Cerrar</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 text-forest" />
      <div>
        <p className="text-xs text-ink/40">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
