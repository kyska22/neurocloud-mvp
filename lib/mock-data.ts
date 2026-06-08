import type { DailyEntry, Patient } from "./types";

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "p-ana",
    name: "Ana Martínez",
    email: "paciente@demo.com",
    age: 34,
    status: "en_evaluacion",
    createdAt: "2026-06-05T14:30:00.000Z",
    lastActivity: "2026-06-07T11:20:00.000Z",
    assignments: [
      {
        id: "as-1",
        testId: "attention",
        patientId: "p-ana",
        status: "pending",
        assignedAt: "2026-06-06T12:00:00.000Z",
      },
      {
        id: "as-2",
        testId: "habits",
        patientId: "p-ana",
        status: "pending",
        assignedAt: "2026-06-06T12:00:00.000Z",
      },
      {
        id: "as-3",
        testId: "memory",
        patientId: "p-ana",
        status: "completed",
        assignedAt: "2026-06-02T12:00:00.000Z",
        completedAt: "2026-06-04T18:20:00.000Z",
        score: 78,
        summary: "Buen desempeño general. Conviene revisar estrategias de evocación.",
        answers: {
          m1: "A veces",
          m2: "Mesa",
          m3: "Uso recordatorios en el teléfono y una lista visible.",
        },
      },
    ],
    orientations: [
      {
        id: "or-1",
        title: "Prioriza una tarea por vez",
        message:
          "Durante esta semana, elige una tarea principal cada mañana y divídela en bloques de 15 minutos.",
        doctorName: "Dra. Elena Torres",
        createdAt: "2026-06-06T14:00:00.000Z",
        category: "focus",
      },
      {
        id: "or-2",
        title: "Mantén un horario de descanso",
        message:
          "Intenta acostarte y levantarte en horarios similares. Registra cómo cambia tu energía durante el día.",
        doctorName: "Dra. Elena Torres",
        createdAt: "2026-06-04T10:30:00.000Z",
        category: "rest",
      },
    ],
  },
  {
    id: "p-carlos",
    name: "Carlos Rivera",
    email: "carlos@example.com",
    age: 42,
    status: "evaluado",
    createdAt: "2026-05-28T10:00:00.000Z",
    lastActivity: "2026-06-06T15:00:00.000Z",
    assignments: [
      {
        id: "as-4",
        testId: "disc",
        patientId: "p-carlos",
        status: "completed",
        assignedAt: "2026-05-29T12:00:00.000Z",
        completedAt: "2026-06-01T09:30:00.000Z",
        score: 82,
        summary: "Preferencia por entornos estructurados y análisis previo.",
        answers: {
          d1: "Organizar los detalles",
          d2: "Analizar opciones",
          d3: "Predecible",
        },
      },
    ],
    orientations: [],
  },
  {
    id: "p-lucia",
    name: "Lucía Gómez",
    email: "lucia@example.com",
    age: 27,
    status: "laudo_entregado",
    createdAt: "2026-05-19T08:45:00.000Z",
    lastActivity: "2026-06-02T16:40:00.000Z",
    assignments: [],
    orientations: [],
  },
  {
    id: "p-mateo",
    name: "Mateo Silva",
    email: "mateo@example.com",
    age: 51,
    status: "archivado",
    createdAt: "2026-05-02T09:15:00.000Z",
    lastActivity: "2026-05-20T12:10:00.000Z",
    assignments: [],
    orientations: [],
  },
];

export const DAILY_ACTIVITIES = [
  "Dormir entre 7 y 9 horas",
  "Beber agua al despertar",
  "Realizar 15 minutos de movimiento",
  "Hacer una pausa sin pantallas",
  "Planificar las 3 tareas principales",
];

export const MOCK_DAILY_ENTRIES: DailyEntry[] = [
  { date: "2026-06-04", mood: "Bien", note: "", completed: DAILY_ACTIVITIES.slice(0, 3) },
  { date: "2026-06-05", mood: "Con energía", note: "", completed: DAILY_ACTIVITIES },
  { date: "2026-06-06", mood: "Tranquila", note: "", completed: DAILY_ACTIVITIES.slice(0, 4) },
];
