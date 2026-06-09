import { notFound } from "next/navigation";
import { LandingV2 } from "@/components/v2/landing";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);
  return <LandingV2 locale={locale} messages={messages} />;
}
