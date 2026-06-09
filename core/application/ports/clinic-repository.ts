import type {
  Assessment,
  AssessmentAssignment,
  DoctorDashboardData,
  PatientDashboardData,
  PatientDetail,
  SessionUser,
} from "@/core/domain/models";

export interface ClinicRepository {
  getCurrentUser(): Promise<SessionUser | null>;
  getDoctorDashboard(): Promise<DoctorDashboardData>;
  getPatientDashboard(): Promise<PatientDashboardData>;
  getPatientDetail(patientId: string): Promise<PatientDetail | null>;
  getAssessmentCatalog(): Promise<Assessment[]>;
  getAssignment(assignmentId: string): Promise<AssessmentAssignment | null>;
}
