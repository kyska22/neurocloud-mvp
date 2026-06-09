import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const users = [
  { email: "doctor@demo.com", role: "doctor", name: "Dra. Marina Costa", locale: "pt" },
  { email: "doctor2@demo.com", role: "doctor", name: "Dr. Rafael Lima", locale: "pt" },
  { email: "patient1@demo.com", role: "patient", name: "Ana Martins", locale: "pt" },
  { email: "patient2@demo.com", role: "patient", name: "Carlos Oliveira", locale: "pt" },
  { email: "patient3@demo.com", role: "patient", name: "Lucía Gómez", locale: "es" },
];

const assessments = [
  ["attention-screening", "Triagem de atenção", "Cribado de atención", "Attention Screening", "attention", 5],
  ["memory-screening", "Triagem de memória", "Cribado de memoria", "Memory Screening", "memory", 6],
  ["executive-function-habits", "Hábitos de função executiva", "Hábitos de función ejecutiva", "Executive Function Habits", "executive_function", 7],
  ["disc-profile", "Perfil DISC simplificado", "Perfil DISC simplificado", "Simplified DISC Profile", "behavior", 7],
  ["procrastination-habits", "Hábitos de procrastinação", "Hábitos de procrastinación", "Procrastination Habits", "habits", 6],
  ["daily-wellbeing", "Questionário de bem-estar diário", "Cuestionario de bienestar diario", "Daily Wellbeing Questionnaire", "wellbeing", 4],
].map(([id, pt, es, en, category, minutes]) => ({
  id,
  title: { pt, es, en },
  description: {
    pt: `Instrumento preliminar: ${pt}.`,
    es: `Instrumento preliminar: ${es}.`,
    en: `Preliminary instrument: ${en}.`,
  },
  category,
  estimated_minutes: minutes,
  interpretation_rules: {
    low: [0, 39],
    moderate: [40, 69],
    high: [70, 100],
    disclaimer: "Not a diagnosis. Professional review required.",
  },
}));

const questions = [
  {
    id: "attention-frequency",
    assessment_id: "attention-screening",
    prompt: { pt: "Com que frequência você perde o foco?", es: "¿Con qué frecuencia pierdes el foco?", en: "How often do you lose focus?" },
    question_type: "scale",
    weight: 1,
    position: 1,
  },
  {
    id: "attention-strategy",
    assessment_id: "attention-screening",
    prompt: { pt: "O que ajuda você a recuperar a atenção?", es: "¿Qué te ayuda a recuperar la atención?", en: "What helps you regain attention?" },
    question_type: "open_text",
    weight: 0,
    position: 2,
  },
  {
    id: "memory-frequency",
    assessment_id: "memory-screening",
    prompt: { pt: "Com que frequência você esquece objetos?", es: "¿Con qué frecuencia olvidas objetos?", en: "How often do you forget objects?" },
    question_type: "scale",
    weight: 1,
    position: 1,
  },
  {
    id: "executive-planning",
    assessment_id: "executive-function-habits",
    prompt: { pt: "Eu planejo tarefas antes de começar.", es: "Planifico tareas antes de empezar.", en: "I plan tasks before starting." },
    question_type: "scale",
    weight: 1,
    position: 1,
  },
  {
    id: "disc-group",
    assessment_id: "disc-profile",
    prompt: { pt: "Em um grupo novo, você prefere:", es: "En un grupo nuevo, prefieres:", en: "In a new group, you prefer to:" },
    question_type: "multiple_choice",
    options: {
      pt: ["Liderar", "Conectar", "Observar", "Organizar"],
      es: ["Liderar", "Conectar", "Observar", "Organizar"],
      en: ["Lead", "Connect", "Observe", "Organize"],
    },
    metadata: { scores: { Liderar: 5, Conectar: 4, Observar: 3, Organizar: 4, Lead: 5, Connect: 4, Observe: 3, Organize: 4 } },
    weight: 1,
    position: 1,
  },
  {
    id: "procrastination-delay",
    assessment_id: "procrastination-habits",
    prompt: { pt: "Adio tarefas até o último momento.", es: "Pospongo tareas hasta el último momento.", en: "I delay tasks until the last moment." },
    question_type: "scale",
    weight: 1,
    position: 1,
  },
  {
    id: "wellbeing-energy",
    assessment_id: "daily-wellbeing",
    prompt: { pt: "Como está sua energia hoje?", es: "¿Cómo está tu energía hoy?", en: "How is your energy today?" },
    question_type: "scale",
    weight: 1,
    position: 1,
  },
];

async function ensureUser(definition) {
  const { data: listed, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) throw listError;

  let authUser = listed.users.find((item) => item.email === definition.email);
  if (!authUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: definition.email,
      password: "123456",
      email_confirm: true,
      user_metadata: { full_name: definition.name, role: definition.role },
    });
    if (error) throw error;
    authUser = data.user;
  }

  const { error } = await supabase.from("profiles").upsert({
    id: authUser.id,
    role: definition.role,
    full_name: definition.name,
    email: definition.email,
    preferred_locale: definition.locale,
  });
  if (error) throw error;
  return authUser;
}

async function seed() {
  const authUsers = new Map();
  for (const definition of users) {
    authUsers.set(definition.email, await ensureUser(definition));
  }

  const { error: assessmentError } = await supabase.from("assessments").upsert(assessments);
  if (assessmentError) throw assessmentError;
  const { error: questionError } = await supabase.from("questions").upsert(questions);
  if (questionError) throw questionError;

  const doctorRows = [
    {
      profile_id: authUsers.get("doctor@demo.com").id,
      license_number: "CRP-DEMO-001",
      specialty: "Neuropsychology",
      clinic_name: "NeuroApoyo Clinic",
    },
    {
      profile_id: authUsers.get("doctor2@demo.com").id,
      license_number: "CRP-DEMO-002",
      specialty: "Cognitive Assessment",
      clinic_name: "NeuroApoyo Clinic",
    },
  ];
  const { data: doctors, error: doctorsError } = await supabase
    .from("doctors")
    .upsert(doctorRows, { onConflict: "profile_id" })
    .select();
  if (doctorsError) throw doctorsError;

  const doctorByProfile = new Map(doctors.map((item) => [item.profile_id, item]));
  const firstDoctor = doctorByProfile.get(authUsers.get("doctor@demo.com").id);
  const secondDoctor = doctorByProfile.get(authUsers.get("doctor2@demo.com").id);

  const patientRows = [
    {
      profile_id: authUsers.get("patient1@demo.com").id,
      doctor_id: firstDoctor.id,
      birth_date: "1992-03-18",
      status: "in_evaluation",
    },
    {
      profile_id: authUsers.get("patient2@demo.com").id,
      doctor_id: firstDoctor.id,
      birth_date: "1985-07-09",
      status: "evaluated",
    },
    {
      profile_id: authUsers.get("patient3@demo.com").id,
      doctor_id: secondDoctor.id,
      birth_date: "1998-11-22",
      status: "report_delivered",
    },
  ];
  const { data: patients, error: patientsError } = await supabase
    .from("patients")
    .upsert(patientRows, { onConflict: "profile_id" })
    .select();
  if (patientsError) throw patientsError;

  const patient1 = patients.find(
    (item) => item.profile_id === authUsers.get("patient1@demo.com").id,
  );

  const { data: existingAssignments } = await supabase
    .from("assessment_assignments")
    .select("assessment_id")
    .eq("patient_id", patient1.id);
  const assignedIds = new Set((existingAssignments ?? []).map((item) => item.assessment_id));
  const assignmentRows = ["attention-screening", "memory-screening", "daily-wellbeing"]
    .filter((assessmentId) => !assignedIds.has(assessmentId))
    .map((assessmentId) => ({
      patient_id: patient1.id,
      assessment_id: assessmentId,
      assigned_by: firstDoctor.id,
      status: assessmentId === "memory-screening" ? "completed" : "pending",
      completed_at: assessmentId === "memory-screening" ? new Date().toISOString() : null,
      normalized_score: assessmentId === "memory-screening" ? 76 : null,
      preliminary_summary:
        assessmentId === "memory-screening"
          ? { notice: "Preliminary result for professional review. Not a diagnosis." }
          : null,
    }));
  if (assignmentRows.length) {
    const { error } = await supabase.from("assessment_assignments").insert(assignmentRows);
    if (error) throw error;
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data: existingTasks } = await supabase
    .from("daily_tasks")
    .select("id")
    .eq("patient_id", patient1.id)
    .eq("task_date", today)
    .limit(1);
  if (!existingTasks?.length) {
    const taskTitles = [
      { pt: "Beber água", es: "Beber agua", en: "Drink water" },
      { pt: "Ler por 10 minutos", es: "Leer durante 10 minutos", en: "Read for 10 minutes" },
      { pt: "Exercício de respiração", es: "Ejercicio de respiración", en: "Breathing exercise" },
      { pt: "Organizar uma tarefa", es: "Organizar una tarea", en: "Organization task" },
    ];
    const { error } = await supabase.from("daily_tasks").insert(
      taskTitles.map((title) => ({
        patient_id: patient1.id,
        created_by: authUsers.get("doctor@demo.com").id,
        title,
        task_date: today,
      })),
    );
    if (error) throw error;
  }

  const { data: existingObservation } = await supabase
    .from("observations")
    .select("id")
    .eq("patient_id", patient1.id)
    .limit(1);
  if (!existingObservation?.length) {
    const { error } = await supabase.from("observations").insert({
      patient_id: patient1.id,
      doctor_id: firstDoctor.id,
      type: "recommendation",
      content: "Priorize uma tarefa por vez e use blocos curtos de foco.",
      visible_to_patient: true,
    });
    if (error) throw error;
  }

  await supabase.from("streaks").upsert({
    patient_id: patient1.id,
    current_count: 4,
    longest_count: 7,
    last_completed_date: today,
  }, { onConflict: "patient_id" });

  console.log("Seed complete.");
  console.log("Doctors: doctor@demo.com, doctor2@demo.com");
  console.log("Patients: patient1@demo.com, patient2@demo.com, patient3@demo.com");
  console.log("Password for all demo users: 123456");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
