import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Flame,
  HeartPulse,
  MessageSquareText,
} from "lucide-react";
import { saveDailyCheckinAction, toggleTaskAction } from "@/app/actions/patient";
import type { MoodValue, PatientDashboardData } from "@/core/domain/models";
import type { Locale } from "@/lib/i18n/config";
import { localize } from "@/lib/i18n/localize";
import type { Messages } from "@/lib/i18n/messages";

export function PatientDashboardV2({
  locale,
  messages,
  data,
}: {
  locale: Locale;
  messages: Messages;
  data: PatientDashboardData;
}) {
  const pending = data.assignments.filter((item) => item.status !== "completed");
  const completed = data.assignments.filter((item) => item.status === "completed");
  const moodLabels: [MoodValue, string][] = [
    ["excellent", messages.patient.moodExcellent],
    ["good", messages.patient.moodGood],
    ["neutral", messages.patient.moodNeutral],
    ["bad", messages.patient.moodBad],
    ["very_bad", messages.patient.moodVeryBad],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {messages.patient.greeting.replace("{name}", data.user.fullName.split(" ")[0])}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{messages.patient.subtitle}</p>
      </header>

      <section id="progress" className="mt-8 grid scroll-mt-24 gap-4 md:grid-cols-3">
        <article className="rounded-3xl bg-gradient-to-br from-blue-700 to-blue-600 p-6 text-white shadow-xl shadow-blue-950/10 md:col-span-2">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-blue-100">{messages.nav.progress}</p>
              <h2 className="mt-2 text-2xl font-bold">
                {messages.patient.streak.replace("{count}", String(data.currentStreak))}
              </h2>
              <p className="mt-2 text-sm text-blue-100">{messages.patient.streakHelp}</p>
            </div>
            <span className="grid size-24 shrink-0 place-items-center rounded-full border-8 border-white/10 bg-white/10">
              <span className="text-center"><Flame className="mx-auto size-6" /><strong className="mt-1 block text-2xl">{data.currentStreak}</strong></span>
            </span>
          </div>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">{messages.patient.pendingTests}</p>
          <p className="mt-3 text-4xl font-bold text-blue-700 dark:text-blue-300">{pending.length}</p>
          <p className="mt-3 text-xs text-slate-400">{messages.patient.completedTests}: {completed.length}</p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"><HeartPulse className="size-5" /></span>
            <h2 className="text-xl font-bold">{messages.patient.moodQuestion}</h2>
          </div>
          <form action={saveDailyCheckinAction.bind(null, locale)} className="mt-6">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {moodLabels.map(([value, label]) => (
                <label key={value} className="cursor-pointer">
                  <input type="radio" name="mood" value={value} className="peer sr-only" required />
                  <span className="flex min-h-16 items-center justify-center rounded-xl bg-slate-50 px-2 text-center text-xs font-semibold text-slate-600 ring-blue-500 transition peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:ring-2 dark:bg-slate-950 dark:text-slate-300 dark:peer-checked:bg-blue-950 dark:peer-checked:text-blue-300">
                    {label}
                  </span>
                </label>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="sr-only">{messages.patient.moodNote}</span>
              <textarea name="note" maxLength={500} placeholder={messages.patient.moodNote} className="min-h-24 w-full rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <button className="mt-4 min-h-11 w-full rounded-full bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">{messages.patient.saveDay}</button>
          </form>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"><CheckCircle2 className="size-5" /></span>
            <h2 className="text-xl font-bold">{messages.patient.dailyChecklist}</h2>
          </div>
          <div className="mt-5 space-y-2">
            {data.tasks.map((task) => (
              <form key={task.id} action={toggleTaskAction.bind(null, locale, task.id, !task.completed)}>
                <button className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-left text-sm transition ${task.completed ? "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200" : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-300"}`}>
                  <span className={`grid size-6 place-items-center rounded-full border ${task.completed ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 dark:border-slate-600"}`}>
                    {task.completed && <CheckCircle2 className="size-4" />}
                  </span>
                  <span className={task.completed ? "line-through opacity-70" : ""}>{localize(task.title, locale)}</span>
                </button>
              </form>
            ))}
          </div>
        </article>
      </section>

      <section id="assessments" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-bold">{messages.patient.pendingTests}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {pending.map((assignment) => (
            <article key={assignment.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"><ClipboardCheck className="size-5" /></span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold">{localize(assignment.assessment.title, locale)}</h3>
                <p className="mt-1 text-xs text-slate-500">{assignment.assessment.estimatedMinutes} {messages.common.minutes}</p>
              </div>
              <Link href={`/${locale}/patient/assessments/${assignment.id}`} aria-label={`${messages.patient.startAssessment}: ${localize(assignment.assessment.title, locale)}`} className="grid size-10 place-items-center rounded-full bg-blue-600 text-white hover:bg-blue-700">
                <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>

        <h2 className="mt-10 text-2xl font-bold">{messages.patient.completedTests}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {completed.map((assignment) => (
            <article key={assignment.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{messages.common.completed}</span>
              <h3 className="mt-3 font-bold">{localize(assignment.assessment.title, locale)}</h3>
              {assignment.normalizedScore !== undefined && <p className="mt-3 text-3xl font-bold text-blue-700 dark:text-blue-300">{assignment.normalizedScore}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article id="recommendations" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3"><MessageSquareText className="size-5 text-blue-600" /><h2 className="text-xl font-bold">{messages.patient.doctorRecommendations}</h2></div>
          <div className="mt-5 space-y-3">
            {data.recommendations.length ? data.recommendations.map((item) => (
              <div key={item.id} className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">
                <p>{item.content}</p>
                <p className="mt-2 text-xs text-blue-500">{item.doctorName}</p>
              </div>
            )) : <p className="text-sm text-slate-500">{messages.patient.noRecommendations}</p>}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold">{messages.patient.moodChart}</h2>
          <MoodChart
            locale={locale}
            checkins={data.checkins}
            label={messages.patient.moodChart}
          />
        </article>
      </section>
    </div>
  );
}

function MoodChart({
  locale,
  checkins,
  label,
}: {
  locale: Locale;
  checkins: PatientDashboardData["checkins"];
  label: string;
}) {
  const values: Record<MoodValue, number> = { very_bad: 1, bad: 2, neutral: 3, good: 4, excellent: 5 };
  const points = [...checkins].slice(0, 7).reverse();
  return (
    <div className="mt-5">
      <div className="flex h-36 items-end gap-2" role="img" aria-label={label}>
        {points.map((item) => (
          <div key={item.id} className="flex flex-1 flex-col items-center justify-end gap-2">
            <div className="w-full max-w-8 rounded-t-lg bg-blue-500" style={{ height: `${values[item.mood] * 18}px` }} />
            <span className="text-[10px] text-slate-400">{new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(new Date(`${item.date}T12:00:00`))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
