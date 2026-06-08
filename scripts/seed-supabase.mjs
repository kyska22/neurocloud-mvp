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

const demoUsers = [
  {
    email: "doctor@demo.com",
    password: "Demo123!",
    role: "doctor",
    fullName: "Dra. Elena Torres",
  },
  {
    email: "paciente@demo.com",
    password: "Demo123!",
    role: "patient",
    fullName: "Ana Martínez",
    birthDate: "1992-03-18",
  },
];

async function findOrCreateUser(user) {
  const { data: list, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) throw listError;

  let authUser = list.users.find((item) => item.email === user.email);
  if (!authUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.fullName, role: user.role },
    });
    if (error) throw error;
    authUser = data.user;
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: authUser.id,
    role: user.role,
    full_name: user.fullName,
    email: user.email,
    birth_date: user.birthDate ?? null,
  });
  if (profileError) throw profileError;
  return authUser;
}

async function seed() {
  const doctor = await findOrCreateUser(demoUsers[0]);
  const patientUser = await findOrCreateUser(demoUsers[1]);

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .upsert(
      {
        profile_id: patientUser.id,
        doctor_id: doctor.id,
        status: "en_evaluacion",
      },
      { onConflict: "profile_id" },
    )
    .select()
    .single();
  if (patientError) throw patientError;

  const { data: existingAssignments, error: assignmentsError } = await supabase
    .from("assigned_tests")
    .select("test_id")
    .eq("patient_id", patient.id);
  if (assignmentsError) throw assignmentsError;

  const existingTestIds = new Set(
    (existingAssignments ?? []).map((assignment) => assignment.test_id),
  );
  const assignmentRows = ["attention", "habits", "memory"]
    .filter((testId) => !existingTestIds.has(testId))
    .map((testId) => ({
      patient_id: patient.id,
      test_id: testId,
      assigned_by: doctor.id,
      status: testId === "memory" ? "completed" : "pending",
      completed_at: testId === "memory" ? new Date().toISOString() : null,
      score: testId === "memory" ? 78 : null,
      result_summary:
        testId === "memory"
          ? "Buen desempeño general. Conviene revisar estrategias de evocación."
          : null,
    }));

  if (assignmentRows.length) {
    const { error } = await supabase.from("assigned_tests").insert(assignmentRows);
    if (error) throw error;
  }

  const taskRows = [
    "Dormir entre 7 y 9 horas",
    "Beber agua al despertar",
    "Realizar 15 minutos de movimiento",
    "Hacer una pausa sin pantallas",
    "Planificar las 3 tareas principales",
  ].map((title) => ({
    patient_id: patient.id,
    created_by: doctor.id,
    title,
    task_date: new Date().toISOString().slice(0, 10),
  }));

  const { data: existingTasks, error: tasksError } = await supabase
    .from("daily_tasks")
    .select("id")
    .eq("patient_id", patient.id)
    .eq("task_date", taskRows[0].task_date)
    .limit(1);
  if (tasksError) throw tasksError;

  if (!existingTasks?.length) {
    const { error } = await supabase.from("daily_tasks").insert(taskRows);
    if (error) throw error;
  }

  console.log("Demo users and data created.");
  console.log("Doctor: doctor@demo.com / Demo123!");
  console.log("Patient: paciente@demo.com / Demo123!");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
