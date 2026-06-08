import type { TestDefinition } from "./types";

export const TESTS: TestDefinition[] = [
  {
    id: "attention",
    title: "Test de atención simple",
    shortTitle: "Atención",
    description: "Explora concentración y atención sostenida mediante situaciones cotidianas.",
    estimatedMinutes: 4,
    category: "Cognición",
    color: "bg-[#dcebe4]",
    questions: [
      {
        id: "a1",
        prompt: "Cuando lees una página, ¿con qué frecuencia necesitas volver al inicio?",
        type: "single",
        options: ["Nunca", "A veces", "Con frecuencia", "Casi siempre"],
      },
      {
        id: "a2",
        prompt: "¿Te resulta fácil mantener la atención durante una conversación de 10 minutos?",
        type: "single",
        options: ["Muy fácil", "Fácil", "Difícil", "Muy difícil"],
      },
      {
        id: "a3",
        prompt: "Selecciona el número que continúa la secuencia: 2, 4, 6, 8...",
        type: "single",
        options: ["9", "10", "11", "12"],
      },
    ],
  },
  {
    id: "memory",
    title: "Test de memoria simple",
    shortTitle: "Memoria",
    description: "Recoge indicadores básicos de memoria reciente y evocación.",
    estimatedMinutes: 5,
    category: "Cognición",
    color: "bg-[#e9e1f0]",
    questions: [
      {
        id: "m1",
        prompt: "¿Con qué frecuencia olvidas dónde dejaste objetos de uso diario?",
        type: "single",
        options: ["Nunca", "A veces", "Con frecuencia", "Casi siempre"],
      },
      {
        id: "m2",
        prompt: "Memoriza estas palabras: río, llave, nube. ¿Cuál no estaba en la lista?",
        type: "single",
        options: ["Río", "Llave", "Mesa", "Nube"],
      },
      {
        id: "m3",
        prompt: "Describe una estrategia que usas para recordar tareas.",
        type: "text",
      },
    ],
  },
  {
    id: "disc",
    title: "Perfil conductual simplificado",
    shortTitle: "Perfil",
    description: "Identifica preferencias de comunicación y comportamiento inspiradas en DISC.",
    estimatedMinutes: 6,
    category: "Conducta",
    color: "bg-[#f5e6d5]",
    questions: [
      {
        id: "d1",
        prompt: "En un grupo nuevo, normalmente prefiero...",
        type: "single",
        options: ["Tomar la iniciativa", "Conectar con todos", "Observar primero", "Organizar los detalles"],
      },
      {
        id: "d2",
        prompt: "Ante un cambio inesperado, tiendo a...",
        type: "single",
        options: ["Actuar rápido", "Buscar apoyo", "Mantener la calma", "Analizar opciones"],
      },
      {
        id: "d3",
        prompt: "Valoro más un entorno que sea...",
        type: "single",
        options: ["Competitivo", "Dinámico", "Estable", "Predecible"],
      },
    ],
  },
  {
    id: "habits",
    title: "Hábitos y procrastinación",
    shortTitle: "Hábitos",
    description: "Revisa rutinas, organización y factores que dificultan iniciar tareas.",
    estimatedMinutes: 5,
    category: "Bienestar",
    color: "bg-[#f3dfda]",
    questions: [
      {
        id: "h1",
        prompt: "¿Con qué frecuencia pospones tareas importantes hasta el último momento?",
        type: "single",
        options: ["Nunca", "A veces", "Con frecuencia", "Casi siempre"],
      },
      {
        id: "h2",
        prompt: "¿Cómo organizas normalmente las tareas de tu día?",
        type: "single",
        options: ["Lista escrita", "Calendario digital", "Lo recuerdo mentalmente", "No las organizo"],
      },
      {
        id: "h3",
        prompt: "¿Qué suele dificultarte comenzar una tarea?",
        type: "text",
      },
    ],
  },
];

export function getTest(id: string) {
  return TESTS.find((test) => test.id === id);
}
