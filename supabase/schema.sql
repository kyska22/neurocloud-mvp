-- NeuroApoyo production schema
-- Run in a new Supabase project before `npm run seed`.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('doctor', 'patient');
create type public.patient_status as enum (
  'in_evaluation',
  'evaluated',
  'report_delivered',
  'archived'
);
create type public.assignment_status as enum (
  'pending',
  'in_progress',
  'completed'
);
create type public.question_type as enum (
  'multiple_choice',
  'scale',
  'open_text'
);
create type public.observation_type as enum (
  'clinical',
  'recommendation',
  'report_note'
);
create type public.mood_value as enum (
  'excellent',
  'good',
  'neutral',
  'bad',
  'very_bad'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  full_name text not null check (char_length(trim(full_name)) >= 2),
  email text not null unique,
  preferred_locale text not null default 'pt'
    check (preferred_locale in ('pt', 'es', 'en')),
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  license_number text,
  specialty text,
  clinic_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete restrict,
  status public.patient_status not null default 'in_evaluation',
  birth_date date,
  phone text,
  emergency_contact text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assessments (
  id text primary key,
  title jsonb not null,
  description jsonb not null,
  category text not null,
  estimated_minutes integer not null check (estimated_minutes between 1 and 180),
  interpretation_rules jsonb not null default '{}'::jsonb,
  version integer not null default 1 check (version > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questions (
  id text primary key,
  assessment_id text not null references public.assessments(id) on delete cascade,
  prompt jsonb not null,
  question_type public.question_type not null,
  options jsonb,
  weight numeric(7, 3) not null default 1,
  position integer not null check (position > 0),
  required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (assessment_id, position),
  constraint question_options_match_type check (
    (question_type = 'multiple_choice' and jsonb_typeof(options) = 'object')
    or (question_type in ('scale', 'open_text'))
  )
);

create table public.assessment_assignments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  assessment_id text not null references public.assessments(id) on delete restrict,
  assigned_by uuid not null references public.doctors(id) on delete restrict,
  status public.assignment_status not null default 'pending',
  assigned_at timestamptz not null default now(),
  due_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  raw_score numeric(9, 3),
  normalized_score numeric(7, 2),
  preliminary_summary jsonb,
  interpretation_snapshot jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assessment_assignments(id) on delete cascade,
  question_id text not null references public.questions(id) on delete restrict,
  patient_id uuid not null references public.patients(id) on delete cascade,
  answer_value jsonb not null,
  weighted_score numeric(9, 3),
  analysis_status text not null default 'not_requested'
    check (analysis_status in ('not_requested', 'pending', 'completed', 'failed')),
  analysis_result jsonb,
  answered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, question_id)
);

create table public.observations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  assignment_id uuid references public.assessment_assignments(id) on delete set null,
  type public.observation_type not null default 'clinical',
  content text not null check (char_length(trim(content)) >= 2),
  visible_to_patient boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  title jsonb not null,
  task_date date not null default current_date,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  checkin_date date not null default current_date,
  mood public.mood_value not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (patient_id, checkin_date)
);

create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null unique references public.patients(id) on delete cascade,
  current_count integer not null default 0 check (current_count >= 0),
  longest_count integer not null default 0 check (longest_count >= 0),
  last_completed_date date,
  updated_at timestamptz not null default now()
);

create index patients_doctor_created_idx
  on public.patients (doctor_id, created_at desc);
create index patients_status_idx
  on public.patients (doctor_id, status);
create index questions_assessment_position_idx
  on public.questions (assessment_id, position);
create index assignments_patient_date_idx
  on public.assessment_assignments (patient_id, assigned_at desc);
create index assignments_doctor_status_idx
  on public.assessment_assignments (assigned_by, status);
create index answers_assignment_idx
  on public.answers (assignment_id);
create index observations_patient_date_idx
  on public.observations (patient_id, created_at desc);
create index tasks_patient_date_idx
  on public.daily_tasks (patient_id, task_date desc);
create index checkins_patient_date_idx
  on public.daily_checkins (patient_id, checkin_date desc);

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

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger doctors_updated_at before update on public.doctors
for each row execute function public.set_updated_at();
create trigger patients_updated_at before update on public.patients
for each row execute function public.set_updated_at();
create trigger assessments_updated_at before update on public.assessments
for each row execute function public.set_updated_at();
create trigger assignments_updated_at before update on public.assessment_assignments
for each row execute function public.set_updated_at();
create trigger answers_updated_at before update on public.answers
for each row execute function public.set_updated_at();
create trigger observations_updated_at before update on public.observations
for each row execute function public.set_updated_at();
create trigger tasks_updated_at before update on public.daily_tasks
for each row execute function public.set_updated_at();
create trigger checkins_updated_at before update on public.daily_checkins
for each row execute function public.set_updated_at();

create or replace function public.current_doctor_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.doctors where profile_id = auth.uid() limit 1;
$$;

create or replace function public.current_patient_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.patients where profile_id = auth.uid() limit 1;
$$;

create or replace function public.doctor_owns_patient(target_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.patients
    where id = target_patient_id and doctor_id = public.current_doctor_id()
  );
$$;

revoke all on function public.current_doctor_id() from public;
revoke all on function public.current_patient_id() from public;
revoke all on function public.doctor_owns_patient(uuid) from public;
grant execute on function public.current_doctor_id() to authenticated;
grant execute on function public.current_patient_id() to authenticated;
grant execute on function public.doctor_owns_patient(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.doctors enable row level security;
alter table public.patients enable row level security;
alter table public.assessments enable row level security;
alter table public.questions enable row level security;
alter table public.assessment_assignments enable row level security;
alter table public.answers enable row level security;
alter table public.observations enable row level security;
alter table public.daily_tasks enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.streaks enable row level security;

create policy "profiles_select_self_or_owned_patient"
on public.profiles for select to authenticated
using (
  id = auth.uid()
  or exists (
    select 1 from public.patients
    where patients.profile_id = profiles.id
      and patients.doctor_id = public.current_doctor_id()
  )
);

create policy "profiles_update_self"
on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

create policy "doctors_select_self"
on public.doctors for select to authenticated
using (profile_id = auth.uid());

create policy "patients_select_owner_or_self"
on public.patients for select to authenticated
using (
  doctor_id = public.current_doctor_id()
  or profile_id = auth.uid()
);

create policy "patients_insert_owner"
on public.patients for insert to authenticated
with check (doctor_id = public.current_doctor_id());

create policy "patients_update_owner"
on public.patients for update to authenticated
using (doctor_id = public.current_doctor_id())
with check (doctor_id = public.current_doctor_id());

create policy "assessments_select_authenticated"
on public.assessments for select to authenticated
using (active);

create policy "questions_select_for_doctor_or_assigned_patient"
on public.questions for select to authenticated
using (
  public.current_doctor_id() is not null
  or exists (
    select 1 from public.assessment_assignments
    where assessment_assignments.assessment_id = questions.assessment_id
      and assessment_assignments.patient_id = public.current_patient_id()
  )
);

create policy "assignments_select_owner_or_self"
on public.assessment_assignments for select to authenticated
using (
  public.doctor_owns_patient(patient_id)
  or patient_id = public.current_patient_id()
);

create policy "assignments_insert_owner"
on public.assessment_assignments for insert to authenticated
with check (
  assigned_by = public.current_doctor_id()
  and public.doctor_owns_patient(patient_id)
);

create policy "assignments_update_owner"
on public.assessment_assignments for update to authenticated
using (public.doctor_owns_patient(patient_id))
with check (public.doctor_owns_patient(patient_id));

create policy "answers_select_owner_or_self"
on public.answers for select to authenticated
using (
  public.doctor_owns_patient(patient_id)
  or patient_id = public.current_patient_id()
);

create policy "observations_select_owner_or_visible_patient"
on public.observations for select to authenticated
using (
  public.doctor_owns_patient(patient_id)
  or (patient_id = public.current_patient_id() and visible_to_patient)
);

create policy "observations_manage_owner"
on public.observations for all to authenticated
using (
  doctor_id = public.current_doctor_id()
  and public.doctor_owns_patient(patient_id)
)
with check (
  doctor_id = public.current_doctor_id()
  and public.doctor_owns_patient(patient_id)
);

create policy "tasks_select_owner_or_self"
on public.daily_tasks for select to authenticated
using (
  public.doctor_owns_patient(patient_id)
  or patient_id = public.current_patient_id()
);

create policy "tasks_insert_owner_or_self"
on public.daily_tasks for insert to authenticated
with check (
  public.doctor_owns_patient(patient_id)
  or (patient_id = public.current_patient_id() and created_by = auth.uid())
);

create policy "tasks_manage_owner"
on public.daily_tasks for update to authenticated
using (public.doctor_owns_patient(patient_id))
with check (public.doctor_owns_patient(patient_id));

create policy "checkins_select_owner_or_self"
on public.daily_checkins for select to authenticated
using (
  public.doctor_owns_patient(patient_id)
  or patient_id = public.current_patient_id()
);

create policy "checkins_insert_self"
on public.daily_checkins for insert to authenticated
with check (patient_id = public.current_patient_id());

create policy "checkins_update_self"
on public.daily_checkins for update to authenticated
using (patient_id = public.current_patient_id())
with check (patient_id = public.current_patient_id());

create policy "streaks_select_owner_or_self"
on public.streaks for select to authenticated
using (
  public.doctor_owns_patient(patient_id)
  or patient_id = public.current_patient_id()
);

create or replace function public.submit_assessment(
  target_assignment_id uuid,
  submitted_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_patient uuid;
  target_assessment text;
  total_score numeric := 0;
  maximum_score numeric := 0;
  normalized numeric := 0;
  answer_item record;
  question_item record;
  answer_score numeric;
  rules jsonb;
begin
  if jsonb_typeof(submitted_answers) <> 'object' then
    raise exception 'Answers must be a JSON object';
  end if;

  select patient_id, assessment_id
    into target_patient, target_assessment
  from public.assessment_assignments
  where id = target_assignment_id
    and patient_id = public.current_patient_id()
    and status <> 'completed';

  if target_patient is null then
    raise exception 'Assignment unavailable';
  end if;

  for question_item in
    select * from public.questions
    where assessment_id = target_assessment
    order by position
  loop
    if question_item.required and not (submitted_answers ? question_item.id) then
      raise exception 'Required answer missing: %', question_item.id;
    end if;

    if submitted_answers ? question_item.id then
      answer_score := 0;
      if question_item.question_type = 'scale' then
        answer_score := coalesce((submitted_answers ->> question_item.id)::numeric, 0)
          * question_item.weight;
        maximum_score := maximum_score + (5 * question_item.weight);
      elsif question_item.question_type = 'multiple_choice' then
        answer_score := coalesce(
          (question_item.metadata -> 'scores' ->> (submitted_answers ->> question_item.id))::numeric,
          0
        ) * question_item.weight;
        maximum_score := maximum_score + (5 * question_item.weight);
      end if;

      total_score := total_score + answer_score;
      insert into public.answers (
        assignment_id, question_id, patient_id, answer_value, weighted_score
      ) values (
        target_assignment_id,
        question_item.id,
        target_patient,
        submitted_answers -> question_item.id,
        answer_score
      )
      on conflict (assignment_id, question_id) do update set
        answer_value = excluded.answer_value,
        weighted_score = excluded.weighted_score,
        answered_at = now(),
        updated_at = now();
    end if;
  end loop;

  if maximum_score > 0 then
    normalized := round((total_score / maximum_score) * 100, 2);
  end if;

  select interpretation_rules into rules
  from public.assessments where id = target_assessment;

  update public.assessment_assignments set
    status = 'completed',
    started_at = coalesce(started_at, now()),
    completed_at = now(),
    raw_score = total_score,
    normalized_score = normalized,
    interpretation_snapshot = rules,
    preliminary_summary = jsonb_build_object(
      'score', normalized,
      'notice', 'Preliminary result for professional review. Not a diagnosis.'
    )
  where id = target_assignment_id;

  return jsonb_build_object('rawScore', total_score, 'normalizedScore', normalized);
end;
$$;

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
  update public.daily_tasks set
    completed = is_completed,
    completed_at = case when is_completed then now() else null end
  where id = target_task_id and patient_id = public.current_patient_id();
  if not found then raise exception 'Task unavailable'; end if;
end;
$$;

create or replace function public.recalculate_streak(target_patient_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_streak integer := 0;
  cursor_date date := current_date;
  previous_longest integer := 0;
begin
  if target_patient_id <> public.current_patient_id()
     and not public.doctor_owns_patient(target_patient_id) then
    raise exception 'Patient unavailable';
  end if;

  if not exists (
    select 1 from public.daily_tasks
    where patient_id = target_patient_id
      and task_date = cursor_date
      and completed
  ) then
    cursor_date := cursor_date - 1;
  end if;

  while exists (
    select 1 from public.daily_tasks
    where patient_id = target_patient_id
      and task_date = cursor_date
      and completed
  ) loop
    current_streak := current_streak + 1;
    cursor_date := cursor_date - 1;
  end loop;

  select longest_count into previous_longest
  from public.streaks where patient_id = target_patient_id;

  insert into public.streaks (
    patient_id, current_count, longest_count, last_completed_date
  ) values (
    target_patient_id,
    current_streak,
    greatest(current_streak, coalesce(previous_longest, 0)),
    case when current_streak > 0 then cursor_date + current_streak else null end
  )
  on conflict (patient_id) do update set
    current_count = excluded.current_count,
    longest_count = greatest(public.streaks.longest_count, excluded.current_count),
    last_completed_date = excluded.last_completed_date,
    updated_at = now();
end;
$$;

revoke all on function public.submit_assessment(uuid, jsonb) from public;
revoke all on function public.set_daily_task_completed(uuid, boolean) from public;
revoke all on function public.recalculate_streak(uuid) from public;
grant execute on function public.submit_assessment(uuid, jsonb) to authenticated;
grant execute on function public.set_daily_task_completed(uuid, boolean) to authenticated;
grant execute on function public.recalculate_streak(uuid) to authenticated;

revoke update on public.profiles from authenticated;
grant update (full_name, preferred_locale, avatar_path) on public.profiles to authenticated;
revoke update on public.patients from authenticated;
grant update (status, birth_date, phone, emergency_contact, archived_at)
  on public.patients to authenticated;
revoke update on public.assessment_assignments from authenticated;
grant update (status, due_at, started_at, completed_at, preliminary_summary)
  on public.assessment_assignments to authenticated;
revoke update on public.daily_tasks from authenticated;
grant update (completed, completed_at) on public.daily_tasks to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'clinical-files',
  'clinical-files',
  false,
  10485760,
  array['application/pdf', 'image/png', 'image/jpeg']
)
on conflict (id) do update set public = false;

create policy "clinical_files_doctor_manage"
on storage.objects for all to authenticated
using (
  bucket_id = 'clinical-files'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'clinical-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "clinical_files_patient_read"
on storage.objects for select to authenticated
using (
  bucket_id = 'clinical-files'
  and exists (
    select 1 from public.patients
    join public.doctors on doctors.id = patients.doctor_id
    where patients.profile_id = auth.uid()
      and doctors.profile_id::text = (storage.foldername(name))[1]
      and patients.id::text = (storage.foldername(name))[2]
  )
);
