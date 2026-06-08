-- NeuroApoyo MVP - Supabase schema
-- Execute in a new Supabase project using SQL Editor.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('doctor', 'patient');
create type public.patient_status as enum (
  'en_evaluacion',
  'evaluado',
  'laudo_entregado',
  'archivado'
);
create type public.assigned_test_status as enum (
  'pending',
  'in_progress',
  'completed'
);
create type public.question_type as enum (
  'single_choice',
  'multiple_choice',
  'text',
  'scale'
);

-- 1. One profile per Supabase Auth user.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  full_name text not null check (char_length(trim(full_name)) >= 2),
  email text not null,
  birth_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Clinical relationship between one doctor and one patient Auth account.
create table public.patients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  doctor_id uuid not null references public.profiles(id) on delete restrict,
  status public.patient_status not null default 'en_evaluacion',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint patient_is_not_doctor check (profile_id <> doctor_id)
);

-- 3. Test catalog.
create table public.tests (
  id text primary key,
  title text not null,
  short_title text not null,
  description text not null default '',
  category text not null,
  estimated_minutes integer not null check (estimated_minutes between 1 and 180),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Normalized questions for each test.
create table public.questions (
  id text primary key,
  test_id text not null references public.tests(id) on delete cascade,
  prompt text not null,
  question_type public.question_type not null,
  options jsonb,
  position integer not null check (position > 0),
  required boolean not null default true,
  created_at timestamptz not null default now(),
  unique (test_id, position),
  constraint valid_question_options check (
    (question_type in ('single_choice', 'multiple_choice') and jsonb_typeof(options) = 'array')
    or (question_type in ('text', 'scale'))
  )
);

-- 5. Tests assigned by a doctor to one of their patients.
create table public.assigned_tests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  test_id text not null references public.tests(id) on delete restrict,
  assigned_by uuid not null references public.profiles(id) on delete restrict,
  status public.assigned_test_status not null default 'pending',
  assigned_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  score numeric(7, 2),
  result_summary text,
  updated_at timestamptz not null default now()
);

-- 6. One answer per question and assigned test.
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  assigned_test_id uuid not null references public.assigned_tests(id) on delete cascade,
  question_id text not null references public.questions(id) on delete restrict,
  patient_id uuid not null references public.patients(id) on delete cascade,
  answer_value jsonb not null,
  answered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assigned_test_id, question_id)
);

-- 7. Daily emotional and wellbeing record.
create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  checkin_date date not null default current_date,
  mood text not null check (char_length(trim(mood)) > 0),
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (patient_id, checkin_date)
);

-- 8. Daily tasks assigned by a doctor or created by the patient.
create table public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(trim(title)) between 2 and 200),
  task_date date not null default current_date,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index patients_doctor_created_idx
  on public.patients (doctor_id, created_at desc);
create index patients_profile_idx
  on public.patients (profile_id);
create index questions_test_position_idx
  on public.questions (test_id, position);
create index assigned_tests_patient_date_idx
  on public.assigned_tests (patient_id, assigned_at desc);
create index assigned_tests_doctor_idx
  on public.assigned_tests (assigned_by);
create index answers_assignment_idx
  on public.answers (assigned_test_id);
create index daily_checkins_patient_date_idx
  on public.daily_checkins (patient_id, checkin_date desc);
create index daily_tasks_patient_date_idx
  on public.daily_tasks (patient_id, task_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger patients_set_updated_at
before update on public.patients
for each row execute function public.set_updated_at();

create trigger tests_set_updated_at
before update on public.tests
for each row execute function public.set_updated_at();

create trigger assigned_tests_set_updated_at
before update on public.assigned_tests
for each row execute function public.set_updated_at();

create trigger answers_set_updated_at
before update on public.answers
for each row execute function public.set_updated_at();

create trigger daily_checkins_set_updated_at
before update on public.daily_checkins
for each row execute function public.set_updated_at();

create trigger daily_tasks_set_updated_at
before update on public.daily_tasks
for each row execute function public.set_updated_at();

-- Security-definer helpers avoid recursive RLS checks.
create or replace function public.is_doctor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'doctor'
  );
$$;

create or replace function public.current_patient_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.patients
  where profile_id = auth.uid()
  limit 1;
$$;

create or replace function public.doctor_owns_patient(target_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.patients
    where id = target_patient_id and doctor_id = auth.uid()
  );
$$;

revoke all on function public.is_doctor() from public;
revoke all on function public.current_patient_id() from public;
revoke all on function public.doctor_owns_patient(uuid) from public;
grant execute on function public.is_doctor() to authenticated;
grant execute on function public.current_patient_id() to authenticated;
grant execute on function public.doctor_owns_patient(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.tests enable row level security;
alter table public.questions enable row level security;
alter table public.assigned_tests enable row level security;
alter table public.answers enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.daily_tasks enable row level security;

-- PROFILES
create policy "Users read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Doctors read profiles of own patients"
on public.profiles for select
to authenticated
using (
  public.is_doctor()
  and exists (
    select 1
    from public.patients
    where patients.doctor_id = auth.uid()
      and patients.profile_id = profiles.id
  )
);

create policy "Users update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- PATIENTS
create policy "Doctors create their patients"
on public.patients for insert
to authenticated
with check (
  public.is_doctor()
  and doctor_id = auth.uid()
);

create policy "Doctors read only their patients"
on public.patients for select
to authenticated
using (
  public.is_doctor()
  and doctor_id = auth.uid()
);

create policy "Doctors update only their patients"
on public.patients for update
to authenticated
using (
  public.is_doctor()
  and doctor_id = auth.uid()
)
with check (
  public.is_doctor()
  and doctor_id = auth.uid()
);

create policy "Doctors delete only their patients"
on public.patients for delete
to authenticated
using (
  public.is_doctor()
  and doctor_id = auth.uid()
);

create policy "Patients read own patient record"
on public.patients for select
to authenticated
using (profile_id = auth.uid());

-- TESTS
create policy "Doctors read test catalog"
on public.tests for select
to authenticated
using (public.is_doctor());

create policy "Patients read only assigned tests"
on public.tests for select
to authenticated
using (
  active
  and exists (
    select 1
    from public.assigned_tests
    where assigned_tests.test_id = tests.id
      and assigned_tests.patient_id = public.current_patient_id()
  )
);

-- QUESTIONS
create policy "Doctors read all questions"
on public.questions for select
to authenticated
using (public.is_doctor());

create policy "Patients read questions from own assigned tests"
on public.questions for select
to authenticated
using (
  exists (
    select 1
    from public.assigned_tests
    where assigned_tests.test_id = questions.test_id
      and assigned_tests.patient_id = public.current_patient_id()
  )
);

-- ASSIGNED TESTS
create policy "Doctors create tests for own patients"
on public.assigned_tests for insert
to authenticated
with check (
  assigned_by = auth.uid()
  and public.doctor_owns_patient(patient_id)
);

create policy "Doctors read tests of own patients"
on public.assigned_tests for select
to authenticated
using (public.doctor_owns_patient(patient_id));

create policy "Doctors update tests of own patients"
on public.assigned_tests for update
to authenticated
using (public.doctor_owns_patient(patient_id))
with check (public.doctor_owns_patient(patient_id));

create policy "Doctors delete tests of own patients"
on public.assigned_tests for delete
to authenticated
using (public.doctor_owns_patient(patient_id));

create policy "Patients read only own assigned tests"
on public.assigned_tests for select
to authenticated
using (patient_id = public.current_patient_id());

-- ANSWERS
create policy "Doctors read answers from own patients"
on public.answers for select
to authenticated
using (public.doctor_owns_patient(patient_id));

create policy "Patients read own answers"
on public.answers for select
to authenticated
using (patient_id = public.current_patient_id());

create policy "Patients insert own answers"
on public.answers for insert
to authenticated
with check (
  patient_id = public.current_patient_id()
  and exists (
    select 1
    from public.assigned_tests
    join public.questions
      on questions.test_id = assigned_tests.test_id
    where assigned_tests.id = answers.assigned_test_id
      and assigned_tests.patient_id = answers.patient_id
      and questions.id = answers.question_id
      and assigned_tests.status <> 'completed'
  )
);

create policy "Patients update own answers"
on public.answers for update
to authenticated
using (patient_id = public.current_patient_id())
with check (
  patient_id = public.current_patient_id()
  and exists (
    select 1
    from public.assigned_tests
    join public.questions
      on questions.test_id = assigned_tests.test_id
    where assigned_tests.id = answers.assigned_test_id
      and assigned_tests.patient_id = answers.patient_id
      and questions.id = answers.question_id
      and assigned_tests.status <> 'completed'
  )
);

-- DAILY CHECK-INS
create policy "Doctors read checkins from own patients"
on public.daily_checkins for select
to authenticated
using (public.doctor_owns_patient(patient_id));

create policy "Patients read own checkins"
on public.daily_checkins for select
to authenticated
using (patient_id = public.current_patient_id());

create policy "Patients create own checkins"
on public.daily_checkins for insert
to authenticated
with check (patient_id = public.current_patient_id());

create policy "Patients update own checkins"
on public.daily_checkins for update
to authenticated
using (patient_id = public.current_patient_id())
with check (patient_id = public.current_patient_id());

create policy "Patients delete own checkins"
on public.daily_checkins for delete
to authenticated
using (patient_id = public.current_patient_id());

-- DAILY TASKS
create policy "Doctors create tasks for own patients"
on public.daily_tasks for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.doctor_owns_patient(patient_id)
);

create policy "Doctors read tasks from own patients"
on public.daily_tasks for select
to authenticated
using (public.doctor_owns_patient(patient_id));

create policy "Doctors update tasks from own patients"
on public.daily_tasks for update
to authenticated
using (public.doctor_owns_patient(patient_id))
with check (public.doctor_owns_patient(patient_id));

create policy "Doctors delete tasks from own patients"
on public.daily_tasks for delete
to authenticated
using (public.doctor_owns_patient(patient_id));

create policy "Patients read only own tasks"
on public.daily_tasks for select
to authenticated
using (patient_id = public.current_patient_id());

create policy "Patients create own tasks"
on public.daily_tasks for insert
to authenticated
with check (
  patient_id = public.current_patient_id()
  and created_by = auth.uid()
);

-- Submit all answers atomically. Patients cannot set scores or result summaries.
create or replace function public.submit_test_answers(
  target_assignment_id uuid,
  response_answers jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_patient_id uuid;
  target_test_id text;
begin
  if jsonb_typeof(response_answers) <> 'object' then
    raise exception 'Answers must be a JSON object';
  end if;

  select patient_id, test_id
  into target_patient_id, target_test_id
  from public.assigned_tests
  where id = target_assignment_id
    and patient_id = public.current_patient_id()
    and status <> 'completed';

  if target_patient_id is null then
    raise exception 'Assigned test is not available for this patient';
  end if;

  if exists (
    select 1
    from jsonb_object_keys(response_answers) as submitted(question_id)
    where not exists (
      select 1
      from public.questions
      where questions.id = submitted.question_id
        and questions.test_id = target_test_id
    )
  ) then
    raise exception 'An answer does not belong to the assigned test';
  end if;

  if exists (
    select 1
    from public.questions
    where questions.test_id = target_test_id
      and questions.required
      and not (response_answers ? questions.id)
  ) then
    raise exception 'Required questions are missing';
  end if;

  insert into public.answers (
    assigned_test_id,
    question_id,
    patient_id,
    answer_value
  )
  select
    target_assignment_id,
    submitted.key,
    target_patient_id,
    submitted.value
  from jsonb_each(response_answers) as submitted
  on conflict (assigned_test_id, question_id)
  do update set
    answer_value = excluded.answer_value,
    answered_at = now(),
    updated_at = now();

  update public.assigned_tests
  set
    status = 'completed',
    started_at = coalesce(started_at, now()),
    completed_at = now()
  where id = target_assignment_id;
end;
$$;

revoke all on function public.submit_test_answers(uuid, jsonb) from public;
grant execute on function public.submit_test_answers(uuid, jsonb) to authenticated;

-- Patients may complete their tasks without editing doctor-authored content.
create or replace function public.set_daily_task_completed(
  target_task_id uuid,
  is_completed boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.daily_tasks
  set
    completed = is_completed,
    completed_at = case when is_completed then now() else null end
  where id = target_task_id
    and patient_id = public.current_patient_id();

  if not found then
    raise exception 'Task is not available for this patient';
  end if;
end;
$$;

revoke all on function public.set_daily_task_completed(uuid, boolean) from public;
grant execute on function public.set_daily_task_completed(uuid, boolean) to authenticated;

-- Limit sensitive fields even when an UPDATE policy allows the row.
revoke update on public.profiles from authenticated;
grant update (full_name, birth_date) on public.profiles to authenticated;

revoke update on public.patients from authenticated;
grant update (status, notes) on public.patients to authenticated;

revoke update on public.assigned_tests from authenticated;
grant update (status, started_at, completed_at, score, result_summary)
  on public.assigned_tests to authenticated;

revoke update on public.answers from authenticated;
grant update (answer_value, answered_at) on public.answers to authenticated;

revoke update on public.daily_checkins from authenticated;
grant update (mood, note) on public.daily_checkins to authenticated;

revoke update on public.daily_tasks from authenticated;
grant update (title, task_date, completed, completed_at)
  on public.daily_tasks to authenticated;

-- Initial test catalog. This content is orientative and is not a diagnosis.
insert into public.tests (
  id, title, short_title, description, category, estimated_minutes
) values
  (
    'attention',
    'Test de atención simple',
    'Atención',
    'Explora concentración y atención sostenida mediante situaciones cotidianas.',
    'Cognición',
    4
  ),
  (
    'memory',
    'Test de memoria simple',
    'Memoria',
    'Recoge indicadores básicos de memoria reciente y evocación.',
    'Cognición',
    5
  ),
  (
    'disc',
    'Perfil conductual simplificado',
    'Perfil',
    'Identifica preferencias de comunicación y comportamiento inspiradas en DISC.',
    'Conducta',
    6
  ),
  (
    'habits',
    'Hábitos y procrastinación',
    'Hábitos',
    'Revisa rutinas, organización y factores que dificultan iniciar tareas.',
    'Bienestar',
    5
  )
on conflict (id) do update set
  title = excluded.title,
  short_title = excluded.short_title,
  description = excluded.description,
  category = excluded.category,
  estimated_minutes = excluded.estimated_minutes;

insert into public.questions (
  id, test_id, prompt, question_type, options, position
) values
  (
    'attention-1',
    'attention',
    'Cuando lees una página, ¿con qué frecuencia necesitas volver al inicio?',
    'single_choice',
    '["Nunca", "A veces", "Con frecuencia", "Casi siempre"]'::jsonb,
    1
  ),
  (
    'attention-2',
    'attention',
    '¿Te resulta fácil mantener la atención durante una conversación de 10 minutos?',
    'single_choice',
    '["Muy fácil", "Fácil", "Difícil", "Muy difícil"]'::jsonb,
    2
  ),
  (
    'attention-3',
    'attention',
    'Selecciona el número que continúa la secuencia: 2, 4, 6, 8...',
    'single_choice',
    '["9", "10", "11", "12"]'::jsonb,
    3
  ),
  (
    'memory-1',
    'memory',
    '¿Con qué frecuencia olvidas dónde dejaste objetos de uso diario?',
    'single_choice',
    '["Nunca", "A veces", "Con frecuencia", "Casi siempre"]'::jsonb,
    1
  ),
  (
    'memory-2',
    'memory',
    'Memoriza estas palabras: río, llave, nube. ¿Cuál no estaba en la lista?',
    'single_choice',
    '["Río", "Llave", "Mesa", "Nube"]'::jsonb,
    2
  ),
  (
    'memory-3',
    'memory',
    'Describe una estrategia que usas para recordar tareas.',
    'text',
    null,
    3
  ),
  (
    'disc-1',
    'disc',
    'En un grupo nuevo, normalmente prefiero...',
    'single_choice',
    '["Tomar la iniciativa", "Conectar con todos", "Observar primero", "Organizar los detalles"]'::jsonb,
    1
  ),
  (
    'disc-2',
    'disc',
    'Ante un cambio inesperado, tiendo a...',
    'single_choice',
    '["Actuar rápido", "Buscar apoyo", "Mantener la calma", "Analizar opciones"]'::jsonb,
    2
  ),
  (
    'disc-3',
    'disc',
    'Valoro más un entorno que sea...',
    'single_choice',
    '["Competitivo", "Dinámico", "Estable", "Predecible"]'::jsonb,
    3
  ),
  (
    'habits-1',
    'habits',
    '¿Con qué frecuencia pospones tareas importantes hasta el último momento?',
    'single_choice',
    '["Nunca", "A veces", "Con frecuencia", "Casi siempre"]'::jsonb,
    1
  ),
  (
    'habits-2',
    'habits',
    '¿Cómo organizas normalmente las tareas de tu día?',
    'single_choice',
    '["Lista escrita", "Calendario digital", "Lo recuerdo mentalmente", "No las organizo"]'::jsonb,
    2
  ),
  (
    'habits-3',
    'habits',
    '¿Qué suele dificultarte comenzar una tarea?',
    'text',
    null,
    3
  )
on conflict (id) do update set
  test_id = excluded.test_id,
  prompt = excluded.prompt,
  question_type = excluded.question_type,
  options = excluded.options,
  position = excluded.position;
