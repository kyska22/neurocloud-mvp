import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardPlus,
  FileText,
  Mail,
  MessageSquarePlus,
  Phone,
  UserRound,
} from "lucide-react";
import {
  addObservationAction,
  assignAssessmentAction,
  updatePatientAction,
  updatePatientStatusAction,
} from "@/app/actions/doctor";
import type { Assessment, PatientDetail, PatientStatus } from "@/core/domain/models";
import type { Locale } from "@/lib/i18n/config";
import { localize } from "@/lib/i18n/localize";
import type { Messages } from "@/lib/i18n/messages";

export function PatientDetailV2({
  locale,
  messages,
  patient,
  catalog,
}: {
  locale: Locale;
  messages: Messages;
  patient: PatientDetail;
  catalog: Assessment[];
}) {
  const statusOptions: [PatientStatus, string][] = [
    ["in_evaluation", messages.doctor.statusInEvaluation],
    ["evaluated", messages.doctor.statusEvaluated],
    ["report_delivered", messages.doctor.statusReportDelivered],
    ["archived", messages.doctor.statusArchived],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/${locale}/doctor`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700 dark:hover:text-blue-300">
        <ArrowLeft className="size-4" /> {messages.nav.patients}
      </Link>

      <header className="mt-6 rounded-3xl bg-gradient-to-br from-blue-700 to-blue-600 p-7 text-white shadow-xl shadow-blue-950/10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-blue-100">{messages.common.patient}</p>
            <h1 className="mt-2 text-3xl font-bold">{patient.fullName}</h1>
            <p className="mt-2 text-sm text-blue-100">{patient.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(([status, label]) => (
              <form key={status} action={updatePatientStatusAction.bind(null, locale, patient.id, status)}>
                <button className={`min-h-10 rounded-full px-4 text-xs font-bold transition ${patient.status === status ? "bg-white text-blue-700" : "bg-white/10 text-white hover:bg-white/20"}`}>
                  {label}
                </button>
              </form>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-bold">{messages.doctor.editPatient}</h2>
            <form action={updatePatientAction.bind(null, locale, patient.id)} className="mt-5 space-y-4">
              <ReadOnlyInfo icon={Mail} label={messages.doctor.email} value={patient.email} />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">{messages.doctor.birthDate}</span>
                <input name="birthDate" type="date" defaultValue={patient.birthDate} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">{messages.doctor.name}</span>
                <input name="phone" defaultValue={patient.phone} placeholder={messages.doctor.email} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
              </label>
              <input name="emergencyContact" defaultValue={patient.emergencyContact} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
              <button className="min-h-11 w-full rounded-full bg-blue-600 px-5 text-sm font-bold text-white">{messages.common.save}</button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <ClipboardPlus className="size-5 text-blue-600" />
              <h2 className="font-bold">{messages.doctor.assignAssessment}</h2>
            </div>
            <div className="mt-5 space-y-3">
              {catalog.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                  <div>
                    <p className="text-sm font-semibold">{localize(assessment.title, locale)}</p>
                    <p className="mt-1 text-xs text-slate-500">{assessment.estimatedMinutes} {messages.common.minutes}</p>
                  </div>
                  <form action={assignAssessmentAction.bind(null, locale, patient.id, assessment.id)}>
                    <button aria-label={`${messages.doctor.assignAssessment}: ${localize(assessment.title, locale)}`} className="grid size-9 place-items-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300">
                      <ClipboardPlus className="size-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{messages.doctor.results}</h2>
                <p className="mt-1 text-sm text-slate-500">{messages.doctor.reportNotice}</p>
              </div>
              <Link href={`/${locale}/doctor/patients/${patient.id}/report`} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-blue-600 px-4 text-xs font-bold text-white">
                <FileText className="size-4" /> {messages.doctor.generateReport}
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {patient.assignments.map((assignment) => (
                <article key={assignment.id} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${assignment.status === "completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}`}>
                        {assignment.status === "completed" ? messages.common.completed : messages.common.pending}
                      </span>
                      <h3 className="mt-3 font-bold">{localize(assignment.assessment.title, locale)}</h3>
                    </div>
                    {assignment.normalizedScore !== undefined && (
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{assignment.normalizedScore}</p>
                        <p className="text-xs text-slate-400">{messages.report.summary}</p>
                      </div>
                    )}
                  </div>
                  {assignment.preliminarySummary && (
                    <p className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">
                      {assignment.preliminarySummary}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <MessageSquarePlus className="size-5 text-blue-600" />
              <h2 className="text-xl font-bold">{messages.doctor.observations}</h2>
            </div>
            <form action={addObservationAction.bind(null, locale, patient.id)} className="mt-5">
              <textarea name="content" required placeholder={messages.doctor.observationPlaceholder} className="min-h-28 w-full rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-950" />
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <select name="type" className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
                  <option value="clinical">{messages.doctor.observations}</option>
                  <option value="recommendation">{messages.patient.doctorRecommendations}</option>
                  <option value="report_note">{messages.doctor.preliminaryReport}</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <input type="checkbox" name="visibleToPatient" className="size-4 rounded" />
                  {messages.patient.doctorRecommendations}
                </label>
                <button className="ml-auto min-h-10 rounded-full bg-blue-600 px-5 text-xs font-bold text-white">{messages.doctor.addObservation}</button>
              </div>
            </form>
            <div className="mt-6 space-y-3">
              {patient.observations.map((observation) => (
                <article key={observation.id} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-sm leading-6">{observation.content}</p>
                  <p className="mt-2 text-xs text-slate-400">{new Intl.DateTimeFormat(locale).format(new Date(observation.createdAt))}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <BarChart3 className="size-5 text-blue-600" />
              <h2 className="text-xl font-bold">{messages.doctor.dailyMonitoring}</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm font-semibold">{messages.doctor.moodHistory}</p>
                <p className="mt-3 text-3xl font-bold text-blue-700 dark:text-blue-300">{patient.checkins.length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm font-semibold">{messages.doctor.taskAdherence}</p>
                <p className="mt-3 text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {patient.tasks.length ? Math.round((patient.tasks.filter((task) => task.completed).length / patient.tasks.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyInfo({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
      <Icon className="size-4 text-blue-600" />
      <div><p className="text-xs text-slate-400">{label}</p><p className="text-sm font-medium">{value}</p></div>
    </div>
  );
}
