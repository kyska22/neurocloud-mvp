import { ArrowLeft, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { submitAssessmentAction } from "@/app/actions/assessment";
import type { AssessmentAssignment } from "@/core/domain/models";
import type { Locale } from "@/lib/i18n/config";
import { localize } from "@/lib/i18n/localize";
import type { Messages } from "@/lib/i18n/messages";
import { ClinicalDisclaimer } from "./disclaimer";

export function AssessmentEngine({
  locale,
  messages,
  assignment,
}: {
  locale: Locale;
  messages: Messages;
  assignment: AssessmentAssignment;
}) {
  const assessment = assignment.assessment;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-slate-100 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href={`/${locale}/patient`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700">
          <ArrowLeft className="size-4" /> {messages.nav.dashboard}
        </Link>
        <header className="mt-6 rounded-3xl bg-blue-700 p-7 text-white">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/10"><ClipboardCheck className="size-6" /></span>
            <div>
              <h1 className="text-3xl font-bold">{localize(assessment.title, locale)}</h1>
              <p className="mt-2 text-sm leading-6 text-blue-100">{localize(assessment.description, locale)}</p>
              <p className="mt-3 text-xs font-semibold text-blue-200">{assessment.estimatedMinutes} {messages.common.minutes}</p>
            </div>
          </div>
        </header>

        <form action={submitAssessmentAction.bind(null, locale, assignment.id)} className="mt-6 space-y-5">
          {assessment.questions.map((question, index) => (
            <fieldset key={question.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <legend className="sr-only">{messages.assessment.question.replace("{current}", String(index + 1)).replace("{total}", String(assessment.questions.length))}</legend>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                {messages.assessment.question.replace("{current}", String(index + 1)).replace("{total}", String(assessment.questions.length))}
              </p>
              <h2 className="mt-2 text-lg font-bold">{localize(question.prompt, locale)}</h2>

              {question.type === "multiple_choice" && (
                <div className="mt-5 space-y-2">
                  {(question.options?.[locale] ?? question.options?.pt ?? []).map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm ring-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-800 has-[:checked]:ring-2 dark:bg-slate-950 dark:has-[:checked]:bg-blue-950 dark:has-[:checked]:text-blue-200">
                      <input type="radio" name={`answer:${question.id}`} value={option} required={question.required} className="size-4 accent-blue-600" />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {question.type === "scale" && (
                <div className="mt-5">
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} className="cursor-pointer">
                        <input type="radio" name={`answer:${question.id}`} value={value} required={question.required} className="peer sr-only" />
                        <span className="grid min-h-12 place-items-center rounded-xl bg-slate-50 font-bold text-slate-600 ring-blue-500 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:ring-2 dark:bg-slate-950 dark:text-slate-300">{value}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-400">
                    <span>{messages.assessment.scaleLow}</span>
                    <span>{messages.assessment.scaleHigh}</span>
                  </div>
                </div>
              )}

              {question.type === "open_text" && (
                <textarea name={`answer:${question.id}`} required={question.required} placeholder={messages.assessment.openPlaceholder} className="mt-5 min-h-32 w-full rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-950" />
              )}
            </fieldset>
          ))}

          <ClinicalDisclaimer title={messages.common.disclaimer} detail={messages.common.orientative} compact />
          <button className="min-h-12 w-full rounded-full bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700">
            {messages.patient.submitAssessment}
          </button>
        </form>
      </div>
    </main>
  );
}
