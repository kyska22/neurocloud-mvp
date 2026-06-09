import type { PatientDetail } from "@/core/domain/models";
import type { Locale } from "@/lib/i18n/config";
import { localize } from "@/lib/i18n/localize";

export type PreliminaryReport = {
  generatedAt: string;
  patientName: string;
  status: PatientDetail["status"];
  completedAssessments: {
    title: string;
    score?: number;
    summary?: string;
  }[];
  observations: string[];
  checkinCount: number;
  taskAdherence: number;
};

export class PreliminaryReportService {
  generate(patient: PatientDetail, locale: Locale): PreliminaryReport {
    return {
      generatedAt: new Date().toISOString(),
      patientName: patient.fullName,
      status: patient.status,
      completedAssessments: patient.assignments
        .filter((assignment) => assignment.status === "completed")
        .map((assignment) => ({
          title: localize(assignment.assessment.title, locale),
          score: assignment.normalizedScore,
          summary: assignment.preliminarySummary,
        })),
      observations: patient.observations
        .filter((observation) => observation.type !== "recommendation")
        .map((observation) => observation.content),
      checkinCount: patient.checkins.length,
      taskAdherence: patient.tasks.length
        ? Math.round(
            (patient.tasks.filter((task) => task.completed).length / patient.tasks.length) * 100,
          )
        : 0,
    };
  }
}
