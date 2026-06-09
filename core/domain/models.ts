import type { Locale } from "@/lib/i18n/config";

export type Role = "doctor" | "patient";
export type PatientStatus =
  | "in_evaluation"
  | "evaluated"
  | "report_delivered"
  | "archived";
export type AssignmentStatus = "pending" | "in_progress" | "completed";
export type QuestionType = "multiple_choice" | "scale" | "open_text";
export type MoodValue = "excellent" | "good" | "neutral" | "bad" | "very_bad";

export type LocalizedText = Record<Locale, string>;

export type SessionUser = {
  id: string;
  role: Role;
  fullName: string;
  email: string;
};

export type AssessmentQuestion = {
  id: string;
  assessmentId: string;
  prompt: LocalizedText;
  type: QuestionType;
  options?: Record<Locale, string[]>;
  weight: number;
  position: number;
  required: boolean;
};

export type Assessment = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: string;
  estimatedMinutes: number;
  interpretationRules: Record<string, unknown>;
  questions: AssessmentQuestion[];
};

export type AssessmentAssignment = {
  id: string;
  assessment: Assessment;
  status: AssignmentStatus;
  assignedAt: string;
  completedAt?: string;
  normalizedScore?: number;
  preliminarySummary?: string;
  answers?: Record<string, string | number | string[]>;
};

export type Observation = {
  id: string;
  content: string;
  type: "clinical" | "recommendation" | "report_note";
  visibleToPatient: boolean;
  createdAt: string;
  doctorName: string;
};

export type DailyTask = {
  id: string;
  title: LocalizedText;
  taskDate: string;
  completed: boolean;
};

export type DailyCheckin = {
  id: string;
  date: string;
  mood: MoodValue;
  note: string;
};

export type PatientSummary = {
  id: string;
  profileId: string;
  fullName: string;
  email: string;
  birthDate?: string;
  status: PatientStatus;
  createdAt: string;
  assignmentCount: number;
  completedCount: number;
};

export type PatientDetail = PatientSummary & {
  phone?: string;
  emergencyContact?: string;
  assignments: AssessmentAssignment[];
  observations: Observation[];
  tasks: DailyTask[];
  checkins: DailyCheckin[];
};

export type DoctorDashboardData = {
  user: SessionUser;
  patients: PatientSummary[];
  activePatients: number;
  completedAssessments: number;
  pendingAssessments: number;
};

export type PatientDashboardData = {
  user: SessionUser;
  patientId: string;
  assignments: AssessmentAssignment[];
  tasks: DailyTask[];
  checkins: DailyCheckin[];
  recommendations: Observation[];
  currentStreak: number;
  longestStreak: number;
};
