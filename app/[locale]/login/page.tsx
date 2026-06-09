import { notFound } from "next/navigation";
import { LanguageSelector, ThemeToggle } from "@/components/locale-controls";
import { Brand } from "@/components/v2/brand";
import { ClinicalDisclaimer } from "@/components/v2/disclaimer";
import { DemoLoginForm } from "@/components/v2/demo-login-form";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);

  return (
    <main className="grid min-h-screen bg-slate-50 dark:bg-slate-950 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-blue-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 top-20 size-96 rounded-full bg-blue-400/20 blur-3xl" />
        <Brand locale={locale} inverse />
        <div className="relative max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
            {messages.landing.badge}
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">
            {messages.auth.sideTitle}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-blue-100">
            {messages.auth.sideText}
          </p>
        </div>
        <p className="text-xs text-blue-200">{messages.landing.copyright}</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:justify-end">
            <div className="lg:hidden"><Brand locale={locale} /></div>
            <div className="flex items-center gap-2">
              <LanguageSelector locale={locale} label={messages.common.language} />
              <ThemeToggle lightLabel={messages.common.light} darkLabel={messages.common.dark} />
            </div>
          </div>
          <p className="text-sm font-bold text-blue-600">{messages.common.login}</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight">{messages.auth.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {messages.auth.subtitle}
          </p>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900">
            <DemoLoginForm locale={locale} messages={messages} hasError={query.error === "invalid"} />
          </div>
          <div className="mt-6">
            <ClinicalDisclaimer
              title={messages.common.disclaimer}
              detail={messages.common.orientative}
              compact
            />
          </div>
        </div>
      </section>
    </main>
  );
}
