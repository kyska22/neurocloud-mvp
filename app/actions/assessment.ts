"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function submitAssessmentAction(
  locale: Locale,
  assignmentId: string,
  formData: FormData,
) {
  const answers: Record<string, string | number> = {};
  formData.forEach((rawValue, key) => {
    if (!key.startsWith("answer:")) return;
    const questionId = key.slice("answer:".length);
    const value = String(rawValue);
    answers[questionId] = /^\d+(\.\d+)?$/.test(value) ? Number(value) : value;
  });

  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { error } = await supabase.rpc("submit_assessment", {
      target_assignment_id: assignmentId,
      submitted_answers: answers,
    });
    if (error) throw error;
  }

  revalidatePath(`/${locale}/patient`);
  redirect(`/${locale}/patient?assessment=completed`);
}
