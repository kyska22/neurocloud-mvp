import type { ClinicRepository } from "@/core/application/ports/clinic-repository";
import { assessmentCatalog } from "@/core/domain/assessment-catalog";
import type {
  AssessmentAssignment,
  DoctorDashboardData,
  PatientDashboardData,
  PatientDetail,
  SessionUser,
} from "@/core/domain/models";
import { cookies } from "next/headers";

const doctorUser: SessionUser = {
  id: "demo-doctor-1",
  role: "doctor",
  fullName: "Dra. Marina Costa",
  email: "doctor@demo.com",
};

const patientUser: SessionUser = {
  id: "demo-patient-1",
  role: "patient",
  fullName: "Ana Martins",
  email: "patient1@demo.com",
};

const assignments: AssessmentAssignment[] = [
  {
    id: "demo-assignment-attention",
    assessment: assessmentCatalog[0],
    status: "pending",
    assignedAt: "2026-06-06T12:00:00.000Z",
  },
  {
    id: "demo-assignment-memory",
    assessment: assessmentCatalog[1],
    status: "completed",
    assignedAt: "2026-06-01T12:00:00.000Z",
    completedAt: "2026-06-04T15:00:00.000Z",
    normalizedScore: 76,
    preliminarySummary: "Preliminary result available for professional review.",
    answers: {
      "memory-items": 3,
      "memory-support": "I use calendar reminders and a written list.",
    },
  },
];

const patientDetail: PatientDetail = {
  id: "demo-patient-record-1",
  profileId: patientUser.id,
  fullName: patientUser.fullName,
  email: patientUser.email,
  birthDate: "1992-03-18",
  status: "in_evaluation",
  createdAt: "2026-06-05T14:30:00.000Z",
  assignmentCount: 2,
  completedCount: 1,
  phone: "+55 11 99999-0000",
  assignments,
  observations: [
    {
      id: "obs-1",
      content: "Keep one priority task per day and use short focus blocks.",
      type: "recommendation",
      visibleToPatient: true,
      createdAt: "2026-06-06T10:00:00.000Z",
      doctorName: doctorUser.fullName,
    },
    {
      id: "obs-2",
      content: "Patient reports improved consistency with written reminders.",
      type: "clinical",
      visibleToPatient: false,
      createdAt: "2026-06-05T10:00:00.000Z",
      doctorName: doctorUser.fullName,
    },
  ],
  tasks: [
    { id: "task-1", title: { pt: "Beber água", es: "Beber agua", en: "Drink water" }, taskDate: "2026-06-08", completed: true },
    { id: "task-2", title: { pt: "Ler por 10 minutos", es: "Leer durante 10 minutos", en: "Read for 10 minutes" }, taskDate: "2026-06-08", completed: false },
    { id: "task-3", title: { pt: "Exercício de respiração", es: "Ejercicio de respiración", en: "Breathing exercise" }, taskDate: "2026-06-08", completed: false },
    { id: "task-4", title: { pt: "Organizar uma tarefa", es: "Organizar una tarea", en: "Organization task" }, taskDate: "2026-06-08", completed: false },
  ],
  checkins: [
    { id: "check-1", date: "2026-06-04", mood: "good", note: "" },
    { id: "check-2", date: "2026-06-05", mood: "excellent", note: "" },
    { id: "check-3", date: "2026-06-06", mood: "neutral", note: "" },
    { id: "check-4", date: "2026-06-07", mood: "good", note: "" },
  ],
};

export class MockClinicRepository implements ClinicRepository {
  async getCurrentUser() {
    const cookieStore = await cookies();
    const role = cookieStore.get("demo_role")?.value;
    return role === "patient" ? patientUser : role === "doctor" ? doctorUser : null;
  }

  async getDoctorDashboard(): Promise<DoctorDashboardData> {
    const patients = [
      patientDetail,
      {
        ...patientDetail,
        id: "demo-patient-record-2",
        profileId: "demo-patient-2",
        fullName: "Carlos Oliveira",
        email: "patient2@demo.com",
        status: "evaluated" as const,
        createdAt: "2026-05-25T10:00:00.000Z",
      },
      {
        ...patientDetail,
        id: "demo-patient-record-3",
        profileId: "demo-patient-3",
        fullName: "Lucía Gómez",
        email: "patient3@demo.com",
        status: "report_delivered" as const,
        createdAt: "2026-05-12T10:00:00.000Z",
      },
    ].map(({ assignments: _a, observations: _o, tasks: _t, checkins: _c, ...patient }) => patient);

    return {
      user: doctorUser,
      patients,
      activePatients: patients.filter((item) => item.status !== "archived").length,
      completedAssessments: 5,
      pendingAssessments: 3,
    };
  }

  async getPatientDashboard(): Promise<PatientDashboardData> {
    return {
      user: patientUser,
      patientId: patientDetail.id,
      assignments,
      tasks: patientDetail.tasks,
      checkins: patientDetail.checkins,
      recommendations: patientDetail.observations.filter((item) => item.visibleToPatient),
      currentStreak: 4,
      longestStreak: 7,
    };
  }

  async getPatientDetail(patientId: string) {
    return patientId.startsWith("demo-patient-record") ? { ...patientDetail, id: patientId } : null;
  }

  async getAssessmentCatalog() {
    return assessmentCatalog;
  }

  async getAssignment(assignmentId: string) {
    return assignments.find((item) => item.id === assignmentId) ?? null;
  }
}
