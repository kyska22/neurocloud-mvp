import Link from "next/link";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import type { PreliminaryReport } from "@/core/application/services/preliminary-report-service";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

export function PreliminaryReportView({
  locale,
  messages,
  report,
  patientId,
}: {
  locale: Locale;
  messages: Messages;
  report: PreliminaryReport;
  patientId: string;
}) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-slate-100 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link href={`/${locale}/doctor/patients/${patientId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700">
          <ArrowLeft className="size-4" /> {messages.common.close}
        </Link>
        <article className="mt-6 rounded-3xl bg-white p-7 shadow-xl dark:bg-slate-900 sm:p-10">
          <header className="flex flex-col gap-5 border-b border-slate-200 pb-7 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><FileText className="size-6" /></span>
              <div><p className="text-sm font-bold text-blue-600">{messages.report.title}</p><h1 className="mt-1 text-3xl font-bold">{report.patientName}</h1></div>
            </div>
            <div className="text-sm text-slate-500">
              <p>{messages.report.generatedAt}</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(report.generatedAt))}</p>
            </div>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-bold">{messages.report.assessmentResults}</h2>
            <div className="mt-4 space-y-3">
              {report.completedAssessments.map((assessment) => (
                <div key={assessment.title} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold">{assessment.title}</h3>
                    {assessment.score !== undefined && <strong className="text-2xl text-blue-700 dark:text-blue-300">{assessment.score}</strong>}
                  </div>
                  {assessment.summary && <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{assessment.summary}</p>}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
              <h2 className="font-bold">{messages.report.dailyContext}</h2>
              <p className="mt-4 text-3xl font-bold text-blue-700 dark:text-blue-300">{report.checkinCount}</p>
              <p className="mt-1 text-sm text-slate-500">{messages.doctor.moodHistory}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
              <h2 className="font-bold">{messages.doctor.taskAdherence}</h2>
              <p className="mt-4 text-3xl font-bold text-blue-700 dark:text-blue-300">{report.taskAdherence}%</p>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold">{messages.report.observations}</h2>
            <div className="mt-4 space-y-3">
              {report.observations.map((observation) => (
                <p key={observation} className="rounded-xl bg-slate-50 p-4 text-sm leading-6 dark:bg-slate-950">{observation}</p>
              ))}
            </div>
          </section>

          <footer className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600" />
            <p><strong>{messages.common.disclaimer}</strong> {messages.report.footer}</p>
          </footer>
        </article>
      </div>
    </main>
  );
}
