import Link from "next/link";
import {
  Activity,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Users,
} from "lucide-react";
import type { Role } from "@/core/domain/models";
import { signOutAction } from "@/app/actions/auth";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { LanguageSelector, ThemeToggle } from "@/components/locale-controls";
import { Brand } from "./brand";
import { ClinicalDisclaimer } from "./disclaimer";

export function AppShellV2({
  locale,
  messages,
  role,
  userName,
  children,
}: {
  locale: Locale;
  messages: Messages;
  role: Role;
  userName: string;
  children: React.ReactNode;
}) {
  const base = `/${locale}/${role}`;
  const nav =
    role === "doctor"
      ? [
          [messages.nav.dashboard, base, LayoutDashboard],
          [messages.nav.patients, `${base}#patients`, Users],
          [messages.nav.assessments, `${base}#assessments`, ClipboardCheck],
        ]
      : [
          [messages.nav.dashboard, base, LayoutDashboard],
          [messages.nav.assessments, `${base}#assessments`, ClipboardCheck],
          [messages.nav.recommendations, `${base}#recommendations`, MessageSquareText],
          [messages.nav.progress, `${base}#progress`, Activity],
        ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col">
        <Brand locale={locale} />
        <nav className="mt-10 space-y-1" aria-label={messages.nav.dashboard}>
          {nav.map(([label, href, Icon]) => {
            const NavIcon = Icon as typeof LayoutDashboard;
            return (
              <Link
                key={label as string}
                href={href as string}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
              >
                <NavIcon className="size-5" />
                {label as string}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto">
          <div className="mb-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
            <p className="truncate text-sm font-semibold">{userName}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {role === "doctor" ? messages.common.professional : messages.common.patient}
            </p>
          </div>
          <form action={signOutAction.bind(null, locale)}>
            <button className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <LogOut className="size-5" />
              {messages.common.logout}
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex min-h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="lg:hidden"><Brand locale={locale} /></div>
            <p className="hidden text-sm font-semibold text-slate-600 dark:text-slate-300 lg:block">
              {userName}
            </p>
            <div className="flex items-center gap-2">
              <LanguageSelector locale={locale} label={messages.common.language} />
              <ThemeToggle
                lightLabel={messages.common.light}
                darkLabel={messages.common.dark}
              />
            </div>
          </div>
        </header>

        <main>{children}</main>
        <footer className="px-4 pb-8 sm:px-6 lg:px-8">
          <ClinicalDisclaimer
            title={messages.common.disclaimer}
            detail={messages.common.orientative}
            compact
          />
        </footer>
      </div>
    </div>
  );
}
