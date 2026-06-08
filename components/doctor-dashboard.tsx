"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Clock3,
  Plus,
  Search,
  TrendingUp,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";
import type { Patient, PatientStatus } from "@/lib/types";
import { loadPatients, savePatients } from "@/lib/demo-store";
import { formatDate, initials } from "@/lib/utils";
import { TESTS } from "@/lib/tests";
import { AppShell } from "./app-shell";
import { Button, Card, Pill } from "./ui";
import { StatusBadge } from "./status-badge";
import { Disclaimer } from "./disclaimer";

const statusOptions: { value: PatientStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "en_evaluacion", label: "En evaluación" },
  { value: "evaluado", label: "Evaluados" },
  { value: "laudo_entregado", label: "Informe entregado" },
  { value: "archivado", label: "Archivados" },
];

export function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filter, setFilter] = useState<PatientStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => setPatients(loadPatients()), []);

  const filtered = useMemo(
    () =>
      patients
        .filter((patient) => filter === "all" || patient.status === filter)
        .filter((patient) =>
          `${patient.name} ${patient.email}`.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [filter, patients, search],
  );

  const completed = patients.reduce(
    (total, patient) =>
      total + patient.assignments.filter((assignment) => assignment.status === "completed").length,
    0,
  );
  const activeThisMonth = patients.filter(
    (patient) =>
      patient.status !== "archivado" &&
      new Date(patient.createdAt).getMonth() === new Date().getMonth(),
  ).length;

  function addPatient(data: { name: string; email: string; age: number }) {
    const next: Patient = {
      id: `p-${Date.now()}`,
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      status: "en_evaluacion",
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      assignments: [],
      orientations: [],
    };
    const updated = [next, ...patients];
    setPatients(updated);
    savePatients(updated);
    setModalOpen(false);
  }

  return (
    <AppShell role="doctor" name="Dra. Elena Torres">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-coral">Domingo, 7 de junio</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Buenos días, Elena</h1>
            <p className="mt-2 text-sm text-ink/50">Este es el panorama de tus evaluaciones.</p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="size-4" /> Nuevo paciente
          </Button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Users}
            label="Pacientes activos"
            value={patients.filter((p) => p.status !== "archivado").length}
            detail={`${activeThisMonth} incorporados este mes`}
          />
          <MetricCard
            icon={ClipboardCheck}
            label="Tests completados"
            value={completed}
            detail="Resultados disponibles"
          />
          <MetricCard
            icon={Clock3}
            label="Tests pendientes"
            value={patients.reduce(
              (total, p) => total + p.assignments.filter((a) => a.status === "pending").length,
              0,
            )}
            detail="Requieren seguimiento"
          />
          <MetricCard
            icon={TrendingUp}
            label="Adherencia semanal"
            value="84%"
            detail="+6% vs. semana anterior"
          />
        </section>

        <section id="pacientes" className="mt-10 scroll-mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
              <p className="mt-1 text-sm text-ink/50">Ordenados del más reciente al más antiguo.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar paciente"
                  className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-sm sm:w-64"
                />
              </label>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {statusOptions.map((option) => {
              const count =
                option.value === "all"
                  ? patients.length
                  : patients.filter((patient) => patient.status === option.value).length;
              return (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filter === option.value
                      ? "bg-forest text-white"
                      : "border border-black/10 bg-white text-ink/55 hover:border-forest/30"
                  }`}
                >
                  {option.label} <span className="ml-1 opacity-65">{count}</span>
                </button>
              );
            })}
          </div>

          <Card className="mt-5 overflow-hidden p-0">
            <div className="hidden grid-cols-[1.5fr_0.8fr_0.55fr_0.8fr_0.5fr] gap-4 border-b border-black/5 px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink/35 md:grid">
              <span>Paciente</span>
              <span>Estado</span>
              <span>Tests</span>
              <span>Ingreso</span>
              <span />
            </div>
            {filtered.length ? (
              filtered.map((patient) => (
                <div
                  key={patient.id}
                  className="grid gap-4 border-b border-black/5 px-5 py-5 last:border-0 md:grid-cols-[1.5fr_0.8fr_0.55fr_0.8fr_0.5fr] md:items-center md:px-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-full bg-cream text-sm font-bold text-forest">
                      {initials(patient.name)}
                    </span>
                    <div>
                      <p className="font-semibold">{patient.name}</p>
                      <p className="text-xs text-ink/45">
                        {patient.age} años · {patient.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={patient.status} />
                  </div>
                  <p className="text-sm font-semibold text-ink/55">
                    {patient.assignments.length}
                  </p>
                  <p className="text-sm text-ink/55">{formatDate(patient.createdAt)}</p>
                  <Link
                    href={`/doctor/patients/${patient.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-forest"
                  >
                    Ver ficha <ArrowRight className="size-4" />
                  </Link>
                </div>
              ))
            ) : (
              <p className="p-10 text-center text-sm text-ink/45">No hay pacientes para mostrar.</p>
            )}
          </Card>
        </section>

        <section id="tests" className="mt-12 scroll-mt-8">
          <h2 className="text-2xl font-bold tracking-tight">Biblioteca de tests</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {TESTS.map((test) => (
              <Card key={test.id} className="flex flex-col p-5">
                <div className={`grid size-11 place-items-center rounded-2xl ${test.color}`}>
                  <ClipboardCheck className="size-5 text-forest" />
                </div>
                <Pill className="mt-5 w-fit bg-cream text-ink/55">{test.category}</Pill>
                <h3 className="mt-3 font-bold">{test.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-ink/50">{test.description}</p>
                <p className="mt-4 text-xs font-semibold text-ink/40">
                  {test.questions.length} preguntas · {test.estimatedMinutes} min
                </p>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </div>

      {modalOpen && (
        <NewPatientModal
          existingEmails={patients.map((patient) => patient.email)}
          onClose={() => setModalOpen(false)}
          onSubmit={addPatient}
        />
      )}
    </AppShell>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink/50">{label}</p>
          <p className="mt-3 text-3xl font-bold">{value}</p>
        </div>
        <span className="grid size-11 place-items-center rounded-2xl bg-mint text-forest">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-4 text-xs font-medium text-ink/40">{detail}</p>
    </Card>
  );
}

function NewPatientModal({
  existingEmails,
  onClose,
  onSubmit,
}: {
  existingEmails: string[];
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; age: number }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/35 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg p-7">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-coral">Nuevo registro</p>
            <h2 className="mt-1 text-2xl font-bold">Crear paciente</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-full p-2 hover:bg-cream">
            <X className="size-5" />
          </button>
        </div>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const normalizedEmail = email.trim().toLowerCase();
            if (existingEmails.some((item) => item.toLowerCase() === normalizedEmail)) {
              setError("Ya existe un paciente con este correo electrónico.");
              return;
            }
            if (Number(age) < 5 || Number(age) > 120) {
              setError("La edad debe estar entre 5 y 120 años.");
              return;
            }
            onSubmit({ name, email, age: Number(age) });
          }}
        >
          <Field label="Nombre completo" value={name} onChange={setName} />
          <Field label="Correo electrónico" type="email" value={email} onChange={setEmail} />
          <Field label="Edad" type="number" value={age} onChange={setAge} />
          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <UserRoundCheck className="size-4" /> Crear paciente
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-black/10 px-4 py-3"
        min={type === "number" ? 5 : undefined}
        max={type === "number" ? 120 : undefined}
        required
      />
    </label>
  );
}
