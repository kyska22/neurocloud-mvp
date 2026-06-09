import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Clock3,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { createPatientAction } from "@/app/actions/doctor";
import type { Assessment, DoctorDashboardData, PatientStatus } from "@/core/domain/models";
import type { Locale } from "@/lib/i18n/config";
import { localize } from "@/lib/i18n/localize";
import type { Messages } from "@/lib/i18n/messages";

export function DoctorDashboardV2({
  locale,
  messages,
  data,
  assessments,
  query,
}: {
  locale: Locale;
  messages: Messages;
  data: DoctorDashboardData;
  assessments: Assessment[];
  query: { search?: string; status?: string; created?: string };
}) {
  const search = query.search?.toLowerCase() ?? "";
  const status = query.status ?? "all";
  const patients = data.patients.filter(
    (patient) =>
      (status === "all" || patient.status === status) &&
      `${patient.fullName} ${patient.email}`.toLowerCase().includes(search),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {messages.doctor.greeting.replace("{name}", data.user.fullName.split(" ")[0])}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {messages.doctor.subtitle}
          </p>
        </div>
        <a href="#new-patient" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">
          <Plus className="size-4" /> {messages.doctor.newPatient}
        </a>
      </header>

      {query.created && (
        <p role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {messages.doctor.patientCreated}
        </p>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Metric icon={Users} label={messages.doctor.activePatients} value={data.activePatients} />
        <Metric icon={ClipboardCheck} label={messages.doctor.completedAssessments} value={data.completedAssessments} />
        <Metric icon={Clock3} label={messages.doctor.pendingAssessments} value={data.pendingAssessments} />
      </section>

      <section id="patients" className="mt-10 scroll-mt-24">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{messages.doctor.recentPatients}</h2>
            <p className="mt-1 text-sm text-slate-500">{messages.doctor.newestFirst}</p>
          </div>
          <form className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <span className="sr-only">{messages.doctor.search}</span>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input name="search" defaultValue={query.search} placeholder={messages.doctor.search} className="min-h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <select name="status" defaultValue={status} aria-label={messages.doctor.status} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="all">{messages.doctor.allStatuses}</option>
              <option value="in_evaluation">{messages.doctor.statusInEvaluation}</option>
              <option value="evaluated">{messages.doctor.statusEvaluated}</option>
              <option value="report_delivered">{messages.doctor.statusReportDelivered}</option>
              <option value="archived">{messages.doctor.statusArchived}</option>
            </select>
            <button className="min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white dark:bg-blue-600">{messages.doctor.search}</button>
          </form>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="hidden grid-cols-[1.4fr_0.8fr_0.5fr_0.8fr_0.35fr] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800 md:grid">
            <span>{messages.doctor.name}</span>
            <span>{messages.doctor.status}</span>
            <span>{messages.doctor.tests}</span>
            <span>{messages.doctor.created}</span>
            <span />
          </div>
          {patients.length ? patients.map((patient) => (
            <article key={patient.id} className="grid gap-3 border-b border-slate-100 px-5 py-5 last:border-0 dark:border-slate-800 md:grid-cols-[1.4fr_0.8fr_0.5fr_0.8fr_0.35fr] md:items-center md:px-6">
              <div>
                <p className="font-semibold">{patient.fullName}</p>
                <p className="mt-1 text-xs text-slate-500">{patient.email}</p>
              </div>
              <StatusBadge status={patient.status} messages={messages} />
              <p className="text-sm font-semibold">{patient.assignmentCount}</p>
              <p className="text-sm text-slate-500">{new Intl.DateTimeFormat(locale).format(new Date(patient.createdAt))}</p>
              <Link href={`/${locale}/doctor/patients/${patient.id}`} aria-label={`${messages.common.view}: ${patient.fullName}`} className="grid size-9 place-items-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300">
                <ArrowRight className="size-4" />
              </Link>
            </article>
          )) : (
            <p className="p-10 text-center text-sm text-slate-500">{messages.doctor.emptyPatients}</p>
          )}
        </div>
      </section>

      <section id="new-patient" className="mt-10 scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold">{messages.doctor.newPatient}</h2>
        <form action={createPatientAction.bind(null, locale)} className="mt-5 grid gap-4 md:grid-cols-2">
          <Field name="fullName" label={messages.doctor.name} required />
          <Field name="email" label={messages.doctor.email} type="email" required />
          <Field name="birthDate" label={messages.doctor.birthDate} type="date" />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{messages.common.language}</span>
            <select name="preferredLocale" className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm dark:border-slate-700 dark:bg-slate-950">
              <option value="pt">Português</option>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </label>
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700 md:col-span-2 md:justify-self-end">
            <Plus className="size-4" /> {messages.doctor.newPatient}
          </button>
        </form>
      </section>

      <section id="assessments" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-bold">{messages.nav.assessments}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assessments.map((assessment) => (
            <article key={assessment.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{assessment.category}</span>
              <h3 className="mt-4 font-bold">{localize(assessment.title, locale)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{localize(assessment.description, locale)}</p>
              <p className="mt-4 text-xs font-semibold text-slate-400">{assessment.estimatedMinutes} {messages.common.minutes}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>
        <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"><Icon className="size-5" /></span>
      </div>
    </article>
  );
}

function StatusBadge({ status, messages }: { status: PatientStatus; messages: Messages }) {
  const labels = {
    in_evaluation: messages.doctor.statusInEvaluation,
    evaluated: messages.doctor.statusEvaluated,
    report_delivered: messages.doctor.statusReportDelivered,
    archived: messages.doctor.statusArchived,
  };
  return <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{labels[status]}</span>;
}

function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input name={name} type={type} required={required} className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-950" />
    </label>
  );
}
