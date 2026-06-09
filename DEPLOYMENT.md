# Deployment Guide

## 1. Provision Supabase

Create a Supabase project and run `supabase/schema.sql` in SQL Editor. Confirm that
all tables, RLS policies, database functions, and the private `clinical-files`
bucket were created.

## 2. Configure Auth

In **Authentication > URL Configuration**:

- Set the Site URL to the Vercel production domain.
- Add `http://localhost:3000/**` for local development.
- Add `https://your-domain.example/**` for production invitations.

Configure SMTP before inviting real users.

## 3. Seed the Demo

Set the environment variables locally, then run:

```bash
npm run seed
```

Run this once on an empty demo database.

## 4. Configure Vercel

Import the repository and set the project root to `neuroapoyo-mvp` when needed.
Add:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

Use the same values for Preview only if the preview environment is allowed to
access that Supabase project. A separate Supabase project is safer for previews.

## 5. Validate

Before promoting the deployment:

```bash
npm run lint
npm run build
```

Test doctor and patient isolation, invitation redirects, all three languages,
dark mode, assessment submission, tasks, check-ins, and mobile layouts.
