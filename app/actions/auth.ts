"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const demoUsers: Record<string, { password: string; role: "doctor" | "patient"; name: string }> = {
  "doctor@demo.com": { password: "123456", role: "doctor", name: "Dra. Marina Costa" },
  "doctor2@demo.com": { password: "123456", role: "doctor", name: "Dr. Rafael Lima" },
  "patient1@demo.com": { password: "123456", role: "patient", name: "Ana Martins" },
  "patient2@demo.com": { password: "123456", role: "patient", name: "Carlos Oliveira" },
  "patient3@demo.com": { password: "123456", role: "patient", name: "Lucía Gómez" },
};

export async function signInAction(locale: Locale, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const supabase = await createServerSupabaseClient();
  const useDemo = !supabase || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  if (useDemo) {
    const demo = demoUsers[email];
    if (!demo || demo.password !== password) {
      redirect(`/${locale}/login?error=invalid`);
    }
    const cookieStore = await cookies();
    cookieStore.set("demo_role", demo.role, { path: "/", httpOnly: true, sameSite: "lax" });
    cookieStore.set("demo_email", email, { path: "/", httpOnly: true, sameSite: "lax" });
    cookieStore.set("demo_name", demo.name, { path: "/", httpOnly: true, sameSite: "lax" });
    redirect(`/${locale}/${demo.role}`);
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) redirect(`/${locale}/login?error=invalid`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  redirect(`/${locale}/${profile?.role === "patient" ? "patient" : "doctor"}`);
}

export async function signOutAction(locale: Locale) {
  const supabase = await createServerSupabaseClient();
  if (supabase) await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete("demo_role");
  cookieStore.delete("demo_email");
  cookieStore.delete("demo_name");
  redirect(`/${locale}/login`);
}
