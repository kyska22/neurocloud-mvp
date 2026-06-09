"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PatientStatus } from "@/core/domain/models";
import type { Locale } from "@/lib/i18n/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function doctorContext() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data: doctor } = await supabase
    .from("doctors")
    .select("id")
    .eq("profile_id", auth.user.id)
    .single();
  return doctor ? { supabase, userId: auth.user.id, doctorId: doctor.id } : null;
}

export async function createPatientAction(locale: Locale, formData: FormData) {
  const context = await doctorContext();
  if (!context) {
    redirect(`/${locale}/doctor?created=demo`);
  }

  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to create patients.");

  const email = value(formData, "email").toLowerCase();
  const fullName = value(formData, "fullName");
  const birthDate = value(formData, "birthDate") || null;
  const preferredLocale = value(formData, "preferredLocale") || "pt";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const { data: created, error: authError } =
    await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName, role: "patient" },
      redirectTo: `${siteUrl}/${preferredLocale}/login`,
    });
  if (authError || !created.user) throw authError ?? new Error("Patient user creation failed.");

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    role: "patient",
    full_name: fullName,
    email,
    preferred_locale: preferredLocale,
  });
  if (profileError) throw profileError;

  const { error: patientError } = await admin.from("patients").insert({
    profile_id: created.user.id,
    doctor_id: context.doctorId,
    birth_date: birthDate,
  });
  if (patientError) throw patientError;

  revalidatePath(`/${locale}/doctor`);
  redirect(`/${locale}/doctor?created=1`);
}

export async function updatePatientAction(
  locale: Locale,
  patientId: string,
  formData: FormData,
) {
  const context = await doctorContext();
  if (!context) {
    redirect(`/${locale}/doctor/patients/${patientId}?updated=demo`);
  }
  const { error } = await context.supabase
    .from("patients")
    .update({
      birth_date: value(formData, "birthDate") || null,
      phone: value(formData, "phone") || null,
      emergency_contact: value(formData, "emergencyContact") || null,
    })
    .eq("id", patientId);
  if (error) throw error;
  revalidatePath(`/${locale}/doctor/patients/${patientId}`);
}

export async function updatePatientStatusAction(
  locale: Locale,
  patientId: string,
  status: PatientStatus,
) {
  const context = await doctorContext();
  if (context) {
    const { error } = await context.supabase
      .from("patients")
      .update({
        status,
        archived_at: status === "archived" ? new Date().toISOString() : null,
      })
      .eq("id", patientId);
    if (error) throw error;
  }
  revalidatePath(`/${locale}/doctor`);
  revalidatePath(`/${locale}/doctor/patients/${patientId}`);
}

export async function addObservationAction(
  locale: Locale,
  patientId: string,
  formData: FormData,
) {
  const context = await doctorContext();
  if (context) {
    const { error } = await context.supabase.from("observations").insert({
      patient_id: patientId,
      doctor_id: context.doctorId,
      type: value(formData, "type") || "clinical",
      content: value(formData, "content"),
      visible_to_patient: formData.get("visibleToPatient") === "on",
    });
    if (error) throw error;
  }
  revalidatePath(`/${locale}/doctor/patients/${patientId}`);
}

export async function assignAssessmentAction(
  locale: Locale,
  patientId: string,
  assessmentId: string,
) {
  const context = await doctorContext();
  if (context) {
    const { error } = await context.supabase.from("assessment_assignments").insert({
      patient_id: patientId,
      assessment_id: assessmentId,
      assigned_by: context.doctorId,
    });
    if (error) throw error;
  }
  revalidatePath(`/${locale}/doctor/patients/${patientId}`);
}
