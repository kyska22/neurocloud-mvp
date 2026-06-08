export type Role = "doctor" | "patient";
export type PatientStatus =
  | "en_evaluacion"
  | "evaluado"
  | "laudo_entregado"
  | "archivado";

export type TestDefinition = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  estimatedMinutes: number;
  category: string;
  color: string;
  questions: TestQuestion[];
};

export type TestQuestion = {
  id: string;
  prompt: string;
  type: "single" | "text";
  options?: string[];
};

export type TestAssignment = {
  id: string;
  testId: string;
  patientId: string;
  status: "pending" | "completed";
  assignedAt: string;
  completedAt?: string;
  score?: number;
  summary?: string;
  answers?: Record<string, string>;
};

export type DoctorOrientation = {
  id: string;
  title: string;
  message: string;
  doctorName: string;
  createdAt: string;
  category: "routine" | "rest" | "focus" | "general";
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  age: number;
  status: PatientStatus;
  createdAt: string;
  lastActivity: string;
  assignments: TestAssignment[];
  orientations: DoctorOrientation[];
};

export type DailyEntry = {
  date: string;
  mood: string;
  note: string;
  completed: string[];
};
