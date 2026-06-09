import { notFound } from "next/navigation";
import { PreliminaryReportService } from "@/core/application/services/preliminary-report-service";
import { PreliminaryReportView } from "@/components/v2/preliminary-report";
import { getClinicRepository } from "@/infrastructure/repositories/repository-factory";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const [messages, patient] = await Promise.all([
    getMessages(locale),
    getClinicRepository().getPatientDetail(id),
  ]);
  if (!patient) notFound();
  const report = new PreliminaryReportService().generate(patient, locale);
  return <PreliminaryReportView locale={locale} messages={messages} report={report} patientId={id} />;
}
