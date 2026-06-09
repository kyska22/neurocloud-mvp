import { notFound } from "next/navigation";
import { AppShellV2 } from "@/components/v2/app-shell";
import { PatientDashboardV2 } from "@/components/v2/patient-dashboard";
import { getClinicRepository } from "@/infrastructure/repositories/repository-factory";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const dynamic = "force-dynamic";

export default async function PatientDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);
  const data = await getClinicRepository().getPatientDashboard();

  return (
    <AppShellV2 locale={locale} messages={messages} role="patient" userName={data.user.fullName}>
      <PatientDashboardV2 locale={locale} messages={messages} data={data} />
    </AppShellV2>
  );
}
