import type { Assessment } from "./models";

export const assessmentCatalog: Assessment[] = [
  {
    id: "attention-screening",
    title: { pt: "Triagem de atenção", es: "Cribado de atención", en: "Attention Screening" },
    description: {
      pt: "Explora indicadores cotidianos de atenção sustentada e seletiva.",
      es: "Explora indicadores cotidianos de atención sostenida y selectiva.",
      en: "Explores everyday indicators of sustained and selective attention."
    },
    category: "attention",
    estimatedMinutes: 5,
    interpretationRules: { low: [0, 39], moderate: [40, 69], high: [70, 100] },
    questions: [
      {
        id: "attention-frequency",
        assessmentId: "attention-screening",
        prompt: {
          pt: "Com que frequência você perde o foco durante uma tarefa?",
          es: "¿Con qué frecuencia pierdes el foco durante una tarea?",
          en: "How often do you lose focus during a task?"
        },
        type: "scale",
        weight: 1,
        position: 1,
        required: true
      },
      {
        id: "attention-strategy",
        assessmentId: "attention-screening",
        prompt: {
          pt: "O que costuma ajudar você a recuperar a atenção?",
          es: "¿Qué suele ayudarte a recuperar la atención?",
          en: "What usually helps you regain attention?"
        },
        type: "open_text",
        weight: 0,
        position: 2,
        required: true
      }
    ]
  },
  {
    id: "memory-screening",
    title: { pt: "Triagem de memória", es: "Cribado de memoria", en: "Memory Screening" },
    description: {
      pt: "Registra percepções sobre memória recente e estratégias de evocação.",
      es: "Registra percepciones sobre memoria reciente y estrategias de evocación.",
      en: "Records perceptions of recent memory and recall strategies."
    },
    category: "memory",
    estimatedMinutes: 6,
    interpretationRules: { low: [0, 39], moderate: [40, 69], high: [70, 100] },
    questions: [
      {
        id: "memory-items",
        assessmentId: "memory-screening",
        prompt: {
          pt: "Com que frequência você esquece onde deixou objetos?",
          es: "¿Con qué frecuencia olvidas dónde dejaste objetos?",
          en: "How often do you forget where you left objects?"
        },
        type: "scale",
        weight: 1,
        position: 1,
        required: true
      },
      {
        id: "memory-support",
        assessmentId: "memory-screening",
        prompt: {
          pt: "Qual estratégia você usa para lembrar compromissos?",
          es: "¿Qué estrategia utilizas para recordar compromisos?",
          en: "What strategy do you use to remember appointments?"
        },
        type: "open_text",
        weight: 0,
        position: 2,
        required: true
      }
    ]
  },
  {
    id: "executive-function-habits",
    title: { pt: "Hábitos de função executiva", es: "Hábitos de función ejecutiva", en: "Executive Function Habits" },
    description: {
      pt: "Observa planejamento, organização e início de tarefas.",
      es: "Observa planificación, organización e inicio de tareas.",
      en: "Observes planning, organization, and task initiation."
    },
    category: "executive_function",
    estimatedMinutes: 7,
    interpretationRules: { low: [0, 39], moderate: [40, 69], high: [70, 100] },
    questions: [
      {
        id: "executive-planning",
        assessmentId: "executive-function-habits",
        prompt: {
          pt: "Eu planejo minhas tarefas antes de começar.",
          es: "Planifico mis tareas antes de empezar.",
          en: "I plan my tasks before starting."
        },
        type: "scale",
        weight: 1,
        position: 1,
        required: true
      }
    ]
  },
  {
    id: "disc-profile",
    title: { pt: "Perfil DISC simplificado", es: "Perfil DISC simplificado", en: "Simplified DISC Profile" },
    description: {
      pt: "Explora preferências de comunicação e comportamento.",
      es: "Explora preferencias de comunicación y comportamiento.",
      en: "Explores communication and behavior preferences."
    },
    category: "behavior",
    estimatedMinutes: 7,
    interpretationRules: { dimensions: ["D", "I", "S", "C"] },
    questions: [
      {
        id: "disc-group",
        assessmentId: "disc-profile",
        prompt: {
          pt: "Em um grupo novo, você prefere:",
          es: "En un grupo nuevo, prefieres:",
          en: "In a new group, you prefer to:"
        },
        type: "multiple_choice",
        options: {
          pt: ["Liderar", "Conectar pessoas", "Observar", "Organizar detalhes"],
          es: ["Liderar", "Conectar personas", "Observar", "Organizar detalles"],
          en: ["Lead", "Connect people", "Observe", "Organize details"]
        },
        weight: 1,
        position: 1,
        required: true
      }
    ]
  },
  {
    id: "procrastination-habits",
    title: { pt: "Hábitos de procrastinação", es: "Hábitos de procrastinación", en: "Procrastination Habits" },
    description: {
      pt: "Mapeia fatores relacionados ao adiamento de tarefas.",
      es: "Mapea factores relacionados con aplazar tareas.",
      en: "Maps factors related to delaying tasks."
    },
    category: "habits",
    estimatedMinutes: 6,
    interpretationRules: { low: [0, 39], moderate: [40, 69], high: [70, 100] },
    questions: [
      {
        id: "procrastination-delay",
        assessmentId: "procrastination-habits",
        prompt: {
          pt: "Eu adio tarefas importantes até o último momento.",
          es: "Pospongo tareas importantes hasta el último momento.",
          en: "I delay important tasks until the last moment."
        },
        type: "scale",
        weight: 1,
        position: 1,
        required: true
      }
    ]
  },
  {
    id: "daily-wellbeing",
    title: { pt: "Questionário de bem-estar diário", es: "Cuestionario de bienestar diario", en: "Daily Wellbeing Questionnaire" },
    description: {
      pt: "Registra energia, rotina e percepção geral do dia.",
      es: "Registra energía, rutina y percepción general del día.",
      en: "Records energy, routine, and overall perception of the day."
    },
    category: "wellbeing",
    estimatedMinutes: 4,
    interpretationRules: { low: [0, 39], moderate: [40, 69], high: [70, 100] },
    questions: [
      {
        id: "wellbeing-energy",
        assessmentId: "daily-wellbeing",
        prompt: {
          pt: "Como está sua energia hoje?",
          es: "¿Cómo está tu energía hoy?",
          en: "How is your energy today?"
        },
        type: "scale",
        weight: 1,
        position: 1,
        required: true
      },
      {
        id: "wellbeing-note",
        assessmentId: "daily-wellbeing",
        prompt: {
          pt: "Há algo importante sobre o seu dia?",
          es: "¿Hay algo importante sobre tu día?",
          en: "Is there anything important about your day?"
        },
        type: "open_text",
        weight: 0,
        position: 2,
        required: false
      }
    ]
  }
];
