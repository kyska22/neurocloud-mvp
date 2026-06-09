import type { ClinicRepository } from "@/core/application/ports/clinic-repository";
import type {
  Assessment,
  AssessmentAssignment,
  AssessmentQuestion,
  DoctorDashboardData,
  LocalizedText,
  PatientDashboardData,
  PatientDetail,
  PatientSummary,
  SessionUser,
} from "@/core/domain/models";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Row = Record<string, unknown>;

function localized(value: unknown): LocalizedText {
  const row = (value ?? {}) as Record<string, string>;
  return {
    pt: row.pt ?? "",
    es: row.es ?? row.pt ?? "",
    en: row.en ?? row.pt ?? "",
  };
}

function mapQuestion(row: Row): AssessmentQuestion {
  return {
    id: String(row.id),
    assessmentId: String(row.assessment_id),
    prompt: localized(row.prompt),
    type: row.question_type as AssessmentQuestion["type"],
    options: row.options as AssessmentQuestion["options"],
    weight: Number(row.weight ?? 1),
    position: Number(row.position),
    required: Boolean(row.required),
  };
}

function mapAssessment(row: Row, questions: Row[]): Assessment {
  return {
    id: String(row.id),
    title: localized(row.title),
    description: localized(row.description),
    category: String(row.category),
    estimatedMinutes: Number(row.estimated_minutes),
    interpretationRules: (row.interpretation_rules ?? {}) as Record<string, unknown>,
    questions: questions
      .filter((question) => question.assessment_id === row.id)
      .sort((a, b) => Number(a.position) - Number(b.position))
      .map(mapQuestion),
  };
}

export class SupabaseClinicRepository implements ClinicRepository {
  private async client() {
    const client = await createServerSupabaseClient();
    if (!client) throw new Error("Supabase is not configured.");
    return client;
  }

  async getCurrentUser(): Promise<SessionUser | null> {
    const supabase = await this.client();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, full_name, email")
      .eq("id", authData.user.id)
      .single();
    if (error || !data) return null;

    return {
      id: data.id,
      role: data.role,
      fullName: data.full_name,
      email: data.email,
    };
  }

  async getDoctorDashboard(): Promise<DoctorDashboardData> {
    const supabase = await this.client();
    const user = await this.getCurrentUser();
    if (!user || user.role !== "doctor") throw new Error("Unauthorized");

    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    if (doctorError || !doctor) throw new Error("Doctor profile not found");

    const { data: patientData, error: patientError } = await supabase
      .from("patients")
      .select("id, profile_id, status, birth_date, created_at")
      .eq("doctor_id", doctor.id)
      .order("created_at", { ascending: false });
    if (patientError) throw patientError;

    const patientRows = (patientData ?? []) as Row[];
    const profileIds = patientRows.map((item) => String(item.profile_id));
    const patientIds = patientRows.map((item) => String(item.id));

    const [{ data: profiles }, { data: assignments }] = await Promise.all([
      profileIds.length
        ? supabase.from("profiles").select("id, full_name, email").in("id", profileIds)
        : Promise.resolve({ data: [] as Row[] }),
      patientIds.length
        ? supabase
            .from("assessment_assignments")
            .select("id, patient_id, status")
            .in("patient_id", patientIds)
        : Promise.resolve({ data: [] as Row[] }),
    ]);

    const profileMap = new Map(
      ((profiles ?? []) as Row[]).map((profile) => [String(profile.id), profile]),
    );
    const assignmentRows = (assignments ?? []) as Row[];
    const patients: PatientSummary[] = patientRows.map((patient) => {
      const profile = profileMap.get(String(patient.profile_id));
      const patientAssignments = assignmentRows.filter(
        (assignment) => assignment.patient_id === patient.id,
      );
      return {
        id: String(patient.id),
        profileId: String(patient.profile_id),
        fullName: String(profile?.full_name ?? ""),
        email: String(profile?.email ?? ""),
        birthDate: patient.birth_date ? String(patient.birth_date) : undefined,
        status: patient.status as PatientSummary["status"],
        createdAt: String(patient.created_at),
        assignmentCount: patientAssignments.length,
        completedCount: patientAssignments.filter(
          (assignment) => assignment.status === "completed",
        ).length,
      };
    });

    return {
      user,
      patients,
      activePatients: patients.filter((patient) => patient.status !== "archived").length,
      completedAssessments: assignmentRows.filter(
        (assignment) => assignment.status === "completed",
      ).length,
      pendingAssessments: assignmentRows.filter(
        (assignment) => assignment.status !== "completed",
      ).length,
    };
  }

  async getPatientDashboard(): Promise<PatientDashboardData> {
    const supabase = await this.client();
    const user = await this.getCurrentUser();
    if (!user || user.role !== "patient") throw new Error("Unauthorized");

    const { data: patient, error } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    if (error || !patient) throw new Error("Patient profile not found");

    const detail = await this.getPatientDetail(patient.id);
    if (!detail) throw new Error("Patient not found");

    const { data: streak } = await supabase
      .from("streaks")
      .select("current_count, longest_count")
      .eq("patient_id", patient.id)
      .maybeSingle();

    return {
      user,
      patientId: patient.id,
      assignments: detail.assignments,
      tasks: detail.tasks,
      checkins: detail.checkins,
      recommendations: detail.observations.filter(
        (observation) => observation.visibleToPatient,
      ),
      currentStreak: streak?.current_count ?? 0,
      longestStreak: streak?.longest_count ?? 0,
    };
  }

  async getPatientDetail(patientId: string): Promise<PatientDetail | null> {
    const supabase = await this.client();
    const { data: patient, error } = await supabase
      .from("patients")
      .select("id, profile_id, status, birth_date, phone, emergency_contact, created_at")
      .eq("id", patientId)
      .maybeSingle();
    if (error || !patient) return null;

    const [
      { data: profile },
      { data: assignmentRows },
      { data: observationRows },
      { data: taskRows },
      { data: checkinRows },
      catalog,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", patient.profile_id)
        .single(),
      supabase
        .from("assessment_assignments")
        .select("*")
        .eq("patient_id", patientId)
        .order("assigned_at", { ascending: false }),
      supabase
        .from("observations")
        .select("id, content, type, visible_to_patient, created_at, doctor_id")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false }),
      supabase
        .from("daily_tasks")
        .select("id, title, task_date, completed")
        .eq("patient_id", patientId)
        .order("task_date", { ascending: false }),
      supabase
        .from("daily_checkins")
        .select("id, checkin_date, mood, note")
        .eq("patient_id", patientId)
        .order("checkin_date", { ascending: false })
        .limit(30),
      this.getAssessmentCatalog(),
    ]);

    const catalogMap = new Map(catalog.map((assessment) => [assessment.id, assessment]));
    const assignments: AssessmentAssignment[] = [];

    for (const assignment of (assignmentRows ?? []) as Row[]) {
      const assessment = catalogMap.get(String(assignment.assessment_id));
      if (!assessment) continue;

      const mappedAssignment: AssessmentAssignment = {
        id: String(assignment.id),
        assessment,
        status: assignment.status as AssessmentAssignment["status"],
        assignedAt: String(assignment.assigned_at),
      };

      if (assignment.completed_at) {
        mappedAssignment.completedAt = String(assignment.completed_at);
      }
      if (assignment.normalized_score !== null) {
        mappedAssignment.normalizedScore = Number(assignment.normalized_score);
      }
      if (typeof assignment.preliminary_summary === "object") {
        mappedAssignment.preliminarySummary = String(
          (assignment.preliminary_summary as Record<string, unknown>).notice ?? "",
        );
      }

      assignments.push(mappedAssignment);
    }

    return {
      id: patient.id,
      profileId: patient.profile_id,
      fullName: profile?.full_name ?? "",
      email: profile?.email ?? "",
      birthDate: patient.birth_date ?? undefined,
      phone: patient.phone ?? undefined,
      emergencyContact: patient.emergency_contact ?? undefined,
      status: patient.status,
      createdAt: patient.created_at,
      assignmentCount: assignments.length,
      completedCount: assignments.filter((item) => item.status === "completed").length,
      assignments,
      observations: ((observationRows ?? []) as Row[]).map((item) => ({
        id: String(item.id),
        content: String(item.content),
        type: item.type as "clinical" | "recommendation" | "report_note",
        visibleToPatient: Boolean(item.visible_to_patient),
        createdAt: String(item.created_at),
        doctorName: "",
      })),
      tasks: ((taskRows ?? []) as Row[]).map((item) => ({
        id: String(item.id),
        title: localized(item.title),
        taskDate: String(item.task_date),
        completed: Boolean(item.completed),
      })),
      checkins: ((checkinRows ?? []) as Row[]).map((item) => ({
        id: String(item.id),
        date: String(item.checkin_date),
        mood: item.mood as PatientDetail["checkins"][number]["mood"],
        note: String(item.note ?? ""),
      })),
    };
  }

  async getAssessmentCatalog(): Promise<Assessment[]> {
    const supabase = await this.client();
    const [{ data: assessments, error }, { data: questions }] = await Promise.all([
      supabase.from("assessments").select("*").eq("active", true).order("created_at"),
      supabase.from("questions").select("*").order("position"),
    ]);
    if (error) throw error;
    return ((assessments ?? []) as Row[]).map((assessment) =>
      mapAssessment(assessment, (questions ?? []) as Row[]),
    );
  }

  async getAssignment(assignmentId: string): Promise<AssessmentAssignment | null> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("assessment_assignments")
      .select("*")
      .eq("id", assignmentId)
      .maybeSingle();
    if (error || !data) return null;
    const catalog = await this.getAssessmentCatalog();
    const assessment = catalog.find((item) => item.id === data.assessment_id);
    if (!assessment) return null;
    return {
      id: data.id,
      assessment,
      status: data.status,
      assignedAt: data.assigned_at,
      completedAt: data.completed_at ?? undefined,
      normalizedScore: data.normalized_score ?? undefined,
    };
  }
}
