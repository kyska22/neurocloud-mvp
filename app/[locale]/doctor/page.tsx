import { notFound } from "next/navigation";
import { AppShellV2 } from "@/components/v2/app-shell";
import { DoctorDashboardV2 } from "@/components/v2/doctor-dashboard";
import { getClinicRepository } from "@/infrastructure/repositories/repository-factory";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const dynamic = "force-dynamic";

export default async function DoctorDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; status?: string; created?: string }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);
  const repository = getClinicRepository();
  const [data, assessments] = await Promise.all([
    repository.getDoctorDashboard(),
    repository.getAssessmentCatalog(),
  ]);

  return (
    <AppShellV2
      locale={locale}
      messages={messages}
      role="doctor"
      userName={data.user.fullName}
    >
      <DoctorDashboardV2
        locale={locale}
        messages={messages}
        data={data}
        assessments={assessments}
        query={query}
      />
    </AppShellV2>
  );
}
