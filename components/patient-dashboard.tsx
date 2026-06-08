"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Flame,
  Heart,
  MessageSquareText,
  Moon,
  Sparkles,
  Sun,
  Target,
} from "lucide-react";
import type { DailyEntry, DoctorOrientation, Patient, TestAssignment } from "@/lib/types";
import { DAILY_ACTIVITIES, MOCK_DAILY_ENTRIES } from "@/lib/mock-data";
import { loadPatients } from "@/lib/demo-store";
import { TESTS } from "@/lib/tests";
import { cn, formatDate } from "@/lib/utils";
import { AppShell } from "./app-shell";
import { Button, Card, Pill } from "./ui";
import { Disclaimer } from "./disclaimer";

const moods = [
  { label: "Difícil", symbol: "--" },
  { label: "Cansada", symbol: "-" },
  { label: "Neutral", symbol: "o" },
  { label: "Bien", symbol: "+" },
  { label: "Con energía", symbol: "++" },
];

const orientationIcons = {
  routine: CalendarDays,
  rest: Moon,
  focus: Target,
  general: MessageSquareText,
};

function toLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateStreak(entries: DailyEntry[], today: string) {
  const completedDates = new Set(
    entries.filter((entry) => entry.completed.length > 0).map((entry) => entry.date),
  );
  const cursor = new Date(`${today}T12:00:00`);

  if (!completedDates.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (completedDates.has(toLocalDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function recentDays(entries: DailyEntry[], today: string) {
  const completedDates = new Set(
    entries.filter((entry) => entry.completed.length > 0).map((entry) => entry.date),
  );
  const formatter = new Intl.DateTimeFormat("es-ES", { weekday: "narrow" });

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${today}T12:00:00`);
    date.setDate(date.getDate() - (6 - index));
    const value = toLocalDate(date);
    return {
      value,
      label: formatter.format(date).toUpperCase(),
      completed: completedDates.has(value),
      isToday: value === today,
    };
  });
}

export function PatientDashboard() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [entries, setEntries] = useState<DailyEntry[]>(MOCK_DAILY_ENTRIES);
  const [completed, setCompleted] = useState<string[]>([]);
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const today = toLocalDate(new Date());

  useEffect(() => {
    setPatient(loadPatients().find((item) => item.email === "paciente@demo.com") ?? null);

    const stored = window.localStorage.getItem("neuroapoyo-daily");
    const parsed = stored ? (JSON.parse(stored) as DailyEntry[]) : MOCK_DAILY_ENTRIES;
    setEntries(parsed);

    const current = parsed.find((entry) => entry.date === today);
    if (current) {
      setCompleted(current.completed);
      setMood(current.mood);
      setNote(current.note);
      setSaved(true);
    }
  }, [today]);

  const pending = useMemo(
    () => patient?.assignments.filter((assignment) => assignment.status === "pending") ?? [],
    [patient],
  );
  const completedTests = useMemo(
    () => patient?.assignments.filter((assignment) => assignment.status === "completed") ?? [],
    [patient],
  );
  const streak = calculateStreak(entries, today);
  const week = recentDays(entries, today);
  const checklistProgress = Math.round((completed.length / DAILY_ACTIVITIES.length) * 100);
  const formattedToday = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${today}T12:00:00`));

  function toggleActivity(activity: string) {
    setSaved(false);
    setCompleted((current) =>
      current.includes(activity)
        ? current.filter((item) => item !== activity)
        : [...current, activity],
    );
  }

  function saveDay() {
    const next = [
      ...entries.filter((entry) => entry.date !== today),
      { date: today, mood, note: note.trim(), completed },
    ];
    window.localStorage.setItem("neuroapoyo-daily", JSON.stringify(next));
    setEntries(next);
    setSaved(true);
  }

  return (
    <AppShell role="patient" name={patient?.name ?? "Ana Martínez"}>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        <header>
          <p className="text-sm font-semibold capitalize text-coral">{formattedToday}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Hola, {patient?.name.split(" ")[0] ?? "Ana"}
          </h1>
          <p className="mt-2 text-sm text-ink/50">
            Un paso pequeño también cuenta. Este es tu espacio de hoy.
          </p>
        </header>

        <section id="progreso" className="mt-8 grid scroll-mt-8 gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="overflow-hidden bg-forest p-0 text-white">
            <div className="grid gap-6 p-7 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <Pill className="bg-white/10 text-mint">Tu progreso</Pill>
                <h2 className="mt-4 text-2xl font-bold">
                  {streak > 0 ? `Llevas una racha de ${streak} días` : "Hoy puede comenzar tu racha"}
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
                  Guarda al menos una actividad diaria para mantener la continuidad.
                </p>
                <div className="mt-6 flex gap-2">
                  {week.map((day) => (
                    <span
                      key={day.value}
                      title={day.value}
                      className={cn(
                        "grid size-9 place-items-center rounded-full text-xs font-bold",
                        day.completed && "bg-mint text-forest",
                        !day.completed && "border border-white/20 text-white/50",
                        day.isToday && !day.completed && "border-coral text-coral",
                      )}
                    >
                      {day.completed ? <Check className="size-4" /> : day.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid size-28 place-items-center rounded-full border-8 border-white/10 bg-coral text-center">
                <div>
                  <Flame className="mx-auto size-7" />
                  <p className="mt-1 text-2xl font-bold">{streak}</p>
                  <p className="text-[10px] uppercase tracking-wider">días</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <SummaryCard
              label="Tests pendientes"
              value={pending.length}
              icon={Clock3}
              className="bg-coral/15 text-coral"
            />
            <SummaryCard
              label="Tests completados"
              value={completedTests.length}
              icon={CheckCircle2}
              className="bg-mint text-forest"
            />
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-[#f3dfda] text-coral">
                <Heart className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold">¿Cómo me siento hoy?</h2>
                <p className="text-xs text-ink/45">Registra cómo estás, sin juzgar la respuesta.</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-5 gap-2">
              {moods.map((item) => (
                <button
                  key={item.label}
                  aria-pressed={mood === item.label}
                  onClick={() => {
                    setMood(item.label);
                    setSaved(false);
                  }}
                  className={cn(
                    "rounded-2xl px-1 py-3 text-center transition",
                    mood === item.label
                      ? "bg-mint text-forest"
                      : "bg-cream text-ink/50 hover:bg-sand/50",
                  )}
                >
                  <span className="block text-xl">{item.symbol}</span>
                  <span className="mt-1 block text-[10px] font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
            <textarea
              value={note}
              maxLength={500}
              onChange={(event) => {
                setNote(event.target.value);
                setSaved(false);
              }}
              placeholder="Puedes escribir algo sobre tu día..."
              className="mt-5 min-h-24 w-full resize-none rounded-2xl border border-black/5 bg-cream p-4 text-sm"
            />
            <p className="mt-2 text-right text-xs text-ink/35">{note.length}/500</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Checklist diario</h2>
                <p className="mt-1 text-xs text-ink/45">
                  {completed.length} de {DAILY_ACTIVITIES.length} completadas
                </p>
              </div>
              <p className="text-2xl font-bold text-forest">{checklistProgress}%</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full bg-coral transition-all"
                style={{ width: `${checklistProgress}%` }}
              />
            </div>
            <div className="mt-5 space-y-2">
              {DAILY_ACTIVITIES.map((activity) => {
                const checked = completed.includes(activity);
                return (
                  <button
                    key={activity}
                    aria-pressed={checked}
                    onClick={() => toggleActivity(activity)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl p-3 text-left text-sm transition",
                      checked ? "bg-mint text-forest" : "bg-cream text-ink/65",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full border",
                        checked ? "border-forest bg-forest text-white" : "border-black/15 bg-white",
                      )}
                    >
                      {checked && <Check className="size-4" />}
                    </span>
                    <span className={checked ? "line-through opacity-70" : ""}>{activity}</span>
                  </button>
                );
              })}
            </div>
            <Button className="mt-5 w-full" onClick={saveDay} disabled={!mood}>
              {saved ? <CheckCircle2 className="size-4" /> : <Sparkles className="size-4" />}
              {saved ? "Día guardado" : "Guardar mi día"}
            </Button>
          </Card>
        </section>

        <section id="tests" className="mt-12 scroll-mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Tests pendientes</h2>
              <p className="mt-1 text-sm text-ink/50">
                Realízalos a tu ritmo y en un lugar tranquilo.
              </p>
            </div>
            <Pill className="w-fit bg-amber-50 text-amber-700">{pending.length} pendientes</Pill>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {pending.length ? (
              pending.map((assignment) => (
                <TestCard key={assignment.id} assignment={assignment} pending />
              ))
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="No tienes tests pendientes"
                text="Cuando tu profesional asigne uno nuevo, aparecerá aquí."
              />
            )}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Tests completados</h2>
              <p className="mt-1 text-sm text-ink/50">Historial de actividades finalizadas.</p>
            </div>
            <Pill className="bg-emerald-50 text-emerald-700">
              {completedTests.length} completados
            </Pill>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {completedTests.length ? (
              completedTests.map((assignment) => (
                <TestCard key={assignment.id} assignment={assignment} />
              ))
            ) : (
              <EmptyState
                icon={BookOpen}
                title="Aún no hay tests completados"
                text="Tu historial se actualizará cuando termines el primero."
              />
            )}
          </div>
        </section>

        <section id="orientaciones" className="mt-12 scroll-mt-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-mint text-forest">
              <MessageSquareText className="size-5" />
            </span>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Orientaciones del médico</h2>
              <p className="mt-1 text-sm text-ink/50">
                Recomendaciones compartidas por tu profesional.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {patient?.orientations.length ? (
              patient.orientations.map((orientation) => (
                <OrientationCard key={orientation.id} orientation={orientation} />
              ))
            ) : (
              <EmptyState
                icon={MessageSquareText}
                title="Sin orientaciones nuevas"
                text="Los mensajes de tu profesional aparecerán en esta sección."
              />
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold">Recordatorios generales</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Tip icon={Moon} title="Cuida tu descanso" text="Mantén horarios estables y reduce pantallas antes de dormir." />
            <Tip icon={Sun} title="Divide las tareas" text="Empieza con bloques de 10 minutos y una meta concreta." />
            <Tip icon={Heart} title="Registra sin juzgar" text="Observar cómo te sientes ayuda a identificar patrones." />
          </div>
        </section>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </div>
    </AppShell>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: number;
  icon: typeof Clock3;
  className: string;
}) {
  return (
    <Card className="flex items-center justify-between p-5">
      <div>
        <p className="text-sm text-ink/50">{label}</p>
        <p className="mt-1 text-3xl font-bold">{value}</p>
      </div>
      <span className={cn("grid size-11 place-items-center rounded-2xl", className)}>
        <Icon className="size-5" />
      </span>
    </Card>
  );
}

function TestCard({
  assignment,
  pending = false,
}: {
  assignment: TestAssignment;
  pending?: boolean;
}) {
  const test = TESTS.find((item) => item.id === assignment.testId);
  if (!test) return null;

  return (
    <Card className="flex items-center gap-5 p-5">
      <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${test.color}`}>
        {pending ? (
          <BookOpen className="size-6 text-forest" />
        ) : (
          <CheckCircle2 className="size-6 text-forest" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <Pill className={pending ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}>
          {pending ? "Pendiente" : "Completado"}
        </Pill>
        <h3 className="mt-2 font-bold">{test.title}</h3>
        <p className="mt-1 text-xs text-ink/40">
          {pending
            ? `${test.estimatedMinutes} min aprox.`
            : assignment.completedAt
              ? `Completado el ${formatDate(assignment.completedAt)}`
              : "Completado"}
        </p>
      </div>
      {pending && (
        <Link
          href={`/patient/tests/${test.id}`}
          aria-label={`Responder ${test.title}`}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-white transition hover:bg-[#17493b]"
        >
          <ArrowRight className="size-4" />
        </Link>
      )}
    </Card>
  );
}

function OrientationCard({ orientation }: { orientation: DoctorOrientation }) {
  const Icon = orientationIcons[orientation.category];
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint text-forest">
          <Icon className="size-5" />
        </span>
        <div>
          <h3 className="font-bold">{orientation.title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/55">{orientation.message}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/40">
            <span className="font-semibold text-forest">{orientation.doctorName}</span>
            <span>{formatDate(orientation.createdAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BookOpen;
  title: string;
  text: string;
}) {
  return (
    <Card className="col-span-full flex items-center gap-4 border-dashed bg-white/55 shadow-none">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-cream text-ink/40">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-ink/45">{text}</p>
      </div>
    </Card>
  );
}

function Tip({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Moon;
  title: string;
  text: string;
}) {
  return (
    <Card className="p-5">
      <Icon className="size-5 text-coral" />
      <h3 className="mt-4 font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink/50">{text}</p>
    </Card>
  );
}
