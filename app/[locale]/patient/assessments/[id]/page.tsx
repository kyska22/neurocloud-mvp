import { notFound } from "next/navigation";
import { AssessmentEngine } from "@/components/v2/assessment-engine";
import { getClinicRepository } from "@/infrastructure/repositories/repository-factory";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const dynamic = "force-dynamic";

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const [messages, assignment] = await Promise.all([
    getMessages(locale),
    getClinicRepository().getAssignment(id),
  ]);
  if (!assignment) notFound();
  return <AssessmentEngine locale={locale} messages={messages} assignment={assignment} />;
}
