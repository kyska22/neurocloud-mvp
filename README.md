# NeuroApoyo MVP

Multilingual SaaS foundation for neuropsychology and cognitive assessment clinics.
Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

> This platform does not replace professional clinical evaluation.

The product organizes clinical workflows and preliminary, non-diagnostic
information. It must not be used to produce or communicate a medical diagnosis.

## Included

- Portuguese (default), Spanish, and English interfaces.
- Persisted language selector and dark mode.
- Doctor dashboard: patients, filters, status, observations, assessments, results,
  and preliminary reports.
- Patient dashboard: assigned assessments, daily tasks, mood history, streaks,
  and doctor recommendations.
- Dynamic assessment engine with choice, 1-5 scale, and open-text questions.
- Six seeded assessment templates with weighted scoring and interpretation rules.
- Supabase Auth, PostgreSQL RLS, private Storage bucket, and server-side session
  refresh.
- Clean Architecture ports, Supabase and demo repositories, AI analysis placeholder,
  and future parent-support placeholder.
- Responsive, keyboard-friendly UI designed for Vercel deployment.

## Project Structure

```text
app/
  [locale]/                 Localized App Router pages
  actions/                  Auth and clinical Server Actions
components/
  v2/                       Product UI and interactive flows
core/
  application/ports/        Repository and storage contracts
  application/services/     Reports, AI placeholder, parent-support placeholder
  domain/                   Models and assessment catalog
infrastructure/
  repositories/             Demo and Supabase adapters
  storage/                  Supabase Storage adapter
lib/
  i18n/                     Locale loading and formatting
  supabase/                 Server and admin clients
messages/                   pt.json, es.json, en.json
scripts/
  seed-supabase.mjs         Reproducible demo data
supabase/
  schema.sql                Tables, functions, indexes, RLS, and Storage policies
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for boundaries and security decisions.

## Local Setup

Requirements: Node.js 20+ and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Middleware redirects to `/pt` by default.

With `NEXT_PUBLIC_DEMO_MODE=true`, dashboards use the in-memory demo repository.
Authentication accepts the demo users without contacting Supabase.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Copy the project URL, anon key, and service-role key into `.env.local`.
4. Set `NEXT_PUBLIC_DEMO_MODE=false`.
5. Run `npm run seed`.
6. Add local and production URLs to **Authentication > URL Configuration**.

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The service-role key is used only by server actions and the seed script. Never
expose it in browser code or prefix it with `NEXT_PUBLIC_`.

## Demo Users

Password for every seeded account: `123456`.

| Role | Email |
| --- | --- |
| Doctor | `doctor@demo.com` |
| Doctor | `doctor2@demo.com` |
| Patient | `patient1@demo.com` |
| Patient | `patient2@demo.com` |
| Patient | `patient3@demo.com` |

Patients created from the real doctor dashboard receive a Supabase email
invitation; they are not assigned the demo password.

## Database and RLS

`supabase/schema.sql` creates:

`profiles`, `doctors`, `patients`, `assessments`, `questions`,
`assessment_assignments`, `answers`, `observations`, `daily_tasks`,
`daily_checkins`, and `streaks`.

Policies enforce these core rules:

- A doctor can access only rows belonging to their patients.
- A patient can read only their profile, assignments, answers, recommendations,
  tasks, check-ins, and streak.
- Sensitive writes run through authenticated Server Actions or restricted SQL
  functions.
- Clinical files are stored in the private `clinical-files` bucket.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
npm run seed
```

## Vercel Deployment

1. Push `neuroapoyo-mvp` to GitHub, GitLab, or Bitbucket.
2. Import it in Vercel. If it shares a repository, set **Root Directory** to
   `neuroapoyo-mvp`.
3. Add all environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain.
5. Add that domain to Supabase Auth redirect URLs.
6. Deploy. Vercel uses `npm run build`.
7. Run the SQL and seed once against the production Supabase project.

Do not run the seed against a database that already contains real clinical data.

## Production Checklist

- Replace demo mode with Supabase mode.
- Configure a custom SMTP provider for invitations.
- Enable MFA for professionals.
- Review consent, audit logs, retention, backup, breach response, and applicable
  healthcare/privacy regulations before handling real patient data.
- Clinically validate assessment wording, weights, and interpretation rules.
- Add automated end-to-end tests and production observability.
