import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  Layers3,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { LanguageSelector, ThemeToggle } from "@/components/locale-controls";
import { Brand } from "./brand";
import { ClinicalDisclaimer } from "./disclaimer";

export function LandingV2({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const l = messages.landing;
  const features = [
    [Layers3, l.feature1Title, l.feature1Text],
    [HeartPulse, l.feature2Title, l.feature2Text],
    [BarChart3, l.feature3Title, l.feature3Text],
    [ShieldCheck, l.feature4Title, l.feature4Text],
  ];
  const steps = [
    [l.step1Title, l.step1Text],
    [l.step2Title, l.step2Text],
    [l.step3Title, l.step3Text],
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Brand locale={locale} />
          <nav className="hidden gap-7 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <a href="#features">{messages.nav.features}</a>
            <a href="#how">{messages.nav.how}</a>
            <a href="#pricing">{messages.nav.pricing}</a>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSelector locale={locale} label={messages.common.language} />
            </div>
            <ThemeToggle lightLabel={messages.common.light} darkLabel={messages.common.dark} />
            <Link
              href={`/${locale}/login`}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-blue-600 px-4 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:px-5 sm:text-sm"
            >
              {messages.common.demo} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-b from-blue-50 to-white px-5 pb-24 pt-36 dark:from-slate-900 dark:to-slate-950 sm:px-8">
        <div className="absolute right-0 top-0 size-[520px] rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-bold text-blue-700 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-300">
              <Sparkles className="size-4" /> {l.badge}
            </span>
            <h1 className="mt-7 max-w-2xl text-5xl font-bold leading-[1.03] tracking-[-0.05em] sm:text-6xl">
              {l.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {l.heroText}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}/login`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 text-sm font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700">
                {l.primaryCta} <ArrowRight className="size-4" />
              </Link>
              <a href="#contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-7 text-sm font-bold text-slate-800 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                {l.secondaryCta}
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-5 text-xs text-slate-500 dark:text-slate-400">
              {[l.trust1, l.trust2, l.trust3].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-600" /> {item}
                </span>
              ))}
            </div>
          </div>
          <ProductMockup label={l.doctorScreen} accessLabel={l.feature4Title} />
        </div>
      </section>

      <section id="features" className="scroll-mt-10 px-5 py-24 dark:bg-slate-950 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow={l.featureEyebrow} title={l.featureTitle} text={l.featureText} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {features.map(([Icon, title, text]) => {
              const FeatureIcon = Icon as typeof Layers3;
              return (
                <article key={title as string} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                    <FeatureIcon className="size-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{title as string}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{text as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-10 bg-slate-950 px-5 py-24 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading inverse eyebrow={l.howEyebrow} title={l.howTitle} text={l.featureText} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map(([title, text], index) => (
              <article key={title} className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <span className="text-5xl font-bold text-blue-400/25">0{index + 1}</span>
                <h3 className="mt-8 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 dark:bg-slate-950 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow={l.audienceEyebrow} title={l.audienceTitle} text={l.screensTitle} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [Brain, l.audience1],
              [ClipboardCheck, l.audience2],
              [Users, l.audience3],
            ].map(([Icon, title]) => {
              const AudienceIcon = Icon as typeof Brain;
              return (
                <article key={title as string} className="rounded-3xl border border-slate-200 bg-slate-50 p-7 dark:border-slate-800 dark:bg-slate-900">
                  <AudienceIcon className="size-7 text-blue-600 dark:text-blue-400" />
                  <h3 className="mt-5 text-lg font-bold">{title as string}</h3>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-10 px-5 pb-24 dark:bg-slate-950 sm:px-8">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-blue-200 bg-white shadow-2xl shadow-blue-950/10 dark:border-blue-900 dark:bg-slate-900 lg:grid-cols-2">
          <div className="bg-blue-50 p-8 dark:bg-blue-950/40 sm:p-10">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-slate-900 dark:text-blue-300">{l.pricingBadge}</span>
            <h2 className="mt-5 text-3xl font-bold">{l.pricingTitle}</h2>
            <div className="mt-8 flex items-end gap-2">
              <strong className="text-5xl text-blue-700 dark:text-blue-300">{l.price}</strong>
              <span className="pb-2 text-sm text-slate-500">{l.pricePeriod}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{l.pricingText}</p>
          </div>
          <div className="p-8 sm:p-10">
            <div className="space-y-4">
              {[l.pricingFeature1, l.pricingFeature2, l.pricingFeature3, l.pricingFeature4].map((item) => (
                <p key={item} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="grid size-5 place-items-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Check className="size-3" /></span>
                  {item}
                </p>
              ))}
            </div>
            <Link href={`/${locale}/login`} className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700">
              {l.primaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="px-5 pb-24 dark:bg-slate-950 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-blue-700 px-7 py-14 text-center text-white sm:px-12">
          <Mail className="mx-auto size-7" />
          <h2 className="mt-5 text-3xl font-bold">{l.contactTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-blue-100">{l.contactText}</p>
          <a href="mailto:hola@neuroapoyo.app" className="mt-7 inline-flex min-h-12 items-center rounded-full bg-white px-7 text-sm font-bold text-blue-700">
            {messages.common.contact}
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-5 py-10 dark:border-slate-800 dark:bg-slate-950 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Brand locale={locale} />
            <p className="text-xs text-slate-500">{l.copyright}</p>
          </div>
          <div className="mt-7">
            <ClinicalDisclaimer
              title={messages.common.disclaimer}
              detail={messages.common.orientative}
              compact
            />
          </div>
        </div>
      </footer>
    </main>
  );
}

function ProductMockup({ label, accessLabel }: { label: string; accessLabel: string }) {
  return (
    <div className="relative rounded-[2rem] border border-white/80 bg-white p-3 shadow-2xl shadow-blue-950/15 dark:border-slate-700 dark:bg-slate-900">
      <div className="rounded-[1.5rem] bg-slate-50 p-5 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">{label}</p>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">Beta</span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {["12", "8", "3"].map((number) => (
            <div key={number} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
              <p className="text-2xl font-bold text-blue-600">{number}</p>
              <div className="mt-3 h-2 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900">
          {[70, 55, 80].map((width, index) => (
            <div key={width} className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0 dark:border-slate-800">
              <span className="grid size-8 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{index + 1}</span>
              <div className="flex-1"><div className="h-2 rounded bg-slate-200 dark:bg-slate-700" style={{ width: `${width}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <LockKeyhole className="size-4 text-blue-600" /> {accessLabel}
        </div>
      </div>
    </div>
  );
}

function Heading({ eyebrow, title, text, inverse = false }: { eyebrow: string; title: string; text: string; inverse?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className={`text-xs font-bold uppercase tracking-[0.2em] ${inverse ? "text-blue-300" : "text-blue-600"}`}>{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className={`mt-4 text-sm leading-7 ${inverse ? "text-slate-400" : "text-slate-600 dark:text-slate-300"}`}>{text}</p>
    </div>
  );
}
