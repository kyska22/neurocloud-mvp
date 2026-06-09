import { notFound } from "next/navigation";
import { AppShellV2 } from "@/components/v2/app-shell";
import { PatientDetailV2 } from "@/components/v2/patient-detail";
import { getClinicRepository } from "@/infrastructure/repositories/repository-factory";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const dynamic = "force-dynamic";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);
  const repository = getClinicRepository();
  const [patient, catalog, dashboard] = await Promise.all([
    repository.getPatientDetail(id),
    repository.getAssessmentCatalog(),
    repository.getDoctorDashboard(),
  ]);
  if (!patient) notFound();

  return (
    <AppShellV2 locale={locale} messages={messages} role="doctor" userName={dashboard.user.fullName}>
      <PatientDetailV2 locale={locale} messages={messages} patient={patient} catalog={catalog} />
    </AppShellV2>
  );
}
