"use client";

import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { signInAction } from "@/app/actions/auth";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

export function DemoLoginForm({
  locale,
  messages,
  hasError,
}: {
  locale: Locale;
  messages: Messages;
  hasError: boolean;
}) {
  const [email, setEmail] = useState("doctor@demo.com");
  const [password, setPassword] = useState("123456");
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-2 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => {
            setEmail("doctor@demo.com");
            setPassword("123456");
          }}
          className="rounded-xl bg-white px-3 py-3 text-xs font-bold text-slate-800 shadow-sm dark:bg-slate-900 dark:text-white"
        >
          {messages.auth.doctorDemo}
        </button>
        <button
          type="button"
          onClick={() => {
            setEmail("patient1@demo.com");
            setPassword("123456");
          }}
          className="rounded-xl px-3 py-3 text-xs font-bold text-slate-600 dark:text-slate-300"
        >
          {messages.auth.patientDemo}
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-500">{messages.auth.demoHelp}</p>

      <form action={signInAction.bind(null, locale)} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">{messages.auth.email}</span>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-950"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">{messages.auth.password}</span>
          <span className="relative block">
            <input
              name="password"
              type={visible ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-950"
              required
            />
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500"
              aria-label={visible ? messages.common.close : messages.auth.password}
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
        </label>
        {hasError && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {messages.auth.invalid}
          </p>
        )}
        <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700">
          <LogIn className="size-4" /> {messages.auth.submit}
        </button>
      </form>
    </div>
  );
}
