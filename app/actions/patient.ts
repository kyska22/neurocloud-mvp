"use server";

import { revalidatePath } from "next/cache";
import type { Locale } from "@/lib/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function patientContext() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data: patient } = await supabase
    .from("patients")
    .select("id")
    .eq("profile_id", auth.user.id)
    .single();
  return patient ? { supabase, patientId: patient.id } : null;
}

export async function saveDailyCheckinAction(locale: Locale, formData: FormData) {
  const context = await patientContext();
  if (context) {
    const { error } = await context.supabase.from("daily_checkins").upsert(
      {
        patient_id: context.patientId,
        checkin_date: new Date().toISOString().slice(0, 10),
        mood: String(formData.get("mood")),
        note: String(formData.get("note") ?? "").trim(),
      },
      { onConflict: "patient_id,checkin_date" },
    );
    if (error) throw error;
  }
  revalidatePath(`/${locale}/patient`);
}

export async function toggleTaskAction(
  locale: Locale,
  taskId: string,
  completed: boolean,
) {
  const context = await patientContext();
  if (context) {
    const { error } = await context.supabase.rpc("set_daily_task_completed", {
      target_task_id: taskId,
      is_completed: completed,
    });
    if (error) throw error;
    await context.supabase.rpc("recalculate_streak", {
      target_patient_id: context.patientId,
    });
  }
  revalidatePath(`/${locale}/patient`);
}
