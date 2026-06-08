import type { DailyEntry } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

function requireClient() {
  const client = createClient();
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

export async function updatePatientStatus(patientId: string, status: string) {
  const { error } = await requireClient()
    .from("patients")
    .update({ status })
    .eq("id", patientId);
  if (error) throw error;
}

export async function assignTest(patientId: string, testId: string, doctorId: string) {
  const { error } = await requireClient().from("assigned_tests").insert({
    patient_id: patientId,
    test_id: testId,
    assigned_by: doctorId,
  });
  if (error) throw error;
}

export async function submitTest(
  assignmentId: string,
  answers: Record<string, string>,
) {
  const { error } = await requireClient().rpc("submit_test_answers", {
    target_assignment_id: assignmentId,
    response_answers: answers,
  });
  if (error) throw error;
}

export async function saveDailyEntry(patientId: string, entry: DailyEntry) {
  const { error } = await requireClient()
    .from("daily_checkins")
    .upsert(
      {
        patient_id: patientId,
        checkin_date: entry.date,
        mood: entry.mood,
        note: entry.note,
      },
      { onConflict: "patient_id,checkin_date" },
    );
  if (error) throw error;
}

export async function saveDailyTasks(
  patientId: string,
  profileId: string,
  taskDate: string,
  tasks: { title: string; completed: boolean }[],
) {
  const supabase = requireClient();
  const { error: deleteError } = await supabase
    .from("daily_tasks")
    .delete()
    .eq("patient_id", patientId)
    .eq("task_date", taskDate)
    .eq("created_by", profileId);
  if (deleteError) throw deleteError;

  const { error } = await supabase.from("daily_tasks").insert(
    tasks.map((task) => ({
      patient_id: patientId,
      created_by: profileId,
      task_date: taskDate,
      title: task.title,
      completed: task.completed,
      completed_at: task.completed ? new Date().toISOString() : null,
    })),
  );
  if (error) throw error;
}

export async function setDailyTaskCompleted(taskId: string, completed: boolean) {
  const { error } = await requireClient().rpc("set_daily_task_completed", {
    target_task_id: taskId,
    is_completed: completed,
  });
  if (error) throw error;
}
