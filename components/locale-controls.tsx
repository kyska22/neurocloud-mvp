"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";

export function LanguageSelector({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function changeLocale(nextLocale: Locale) {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.replace(segments.join("/") || `/${nextLocale}`);
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <Languages className="pointer-events-none absolute left-3 size-4 text-slate-500 dark:text-slate-400" />
      <select
        value={locale}
        onChange={(event) => changeLocale(event.target.value as Locale)}
        className="min-h-10 appearance-none rounded-full border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs font-semibold text-slate-700 shadow-sm outline-none transition hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ThemeToggle({
  lightLabel,
  darkLabel,
}: {
  lightLabel: string;
  darkLabel: string;
}) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("neuroapoyo-theme");
    const next =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("neuroapoyo-theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? lightLabel : darkLabel}
      title={dark ? lightLabel : darkLabel}
      className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export function LocaleHtml({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
