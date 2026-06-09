# Architecture

## Layers

```text
UI (app, components)
        |
Server Actions / Application Services
        |
Ports (repository and storage interfaces)
        |
Adapters (Supabase or demo repository)
        |
Supabase Auth, PostgreSQL, Storage
```

`core/domain` contains framework-independent models and the assessment catalog.
`core/application/ports` defines persistence contracts. `infrastructure` implements
those contracts, so pages and services do not depend directly on database details.

## Rendering

- App Router pages are Server Components by default.
- Client Components are limited to interactive controls and forms.
- Mutations use Server Actions, followed by path revalidation.
- Middleware persists locale and refreshes Supabase Auth cookies.

## Internationalization

Locale-prefixed routes use `/pt`, `/es`, and `/en`. Portuguese is the fallback.
All product copy comes from matching JSON files in `messages`. Domain content is
stored as localized JSON objects so new languages can be added without schema
changes.

## Data Access

`repository-factory.ts` selects the Supabase adapter when credentials are present
and demo mode is disabled. Otherwise it returns deterministic mock data for product
demonstrations.

PostgreSQL RLS remains the final authorization boundary. UI visibility and Server
Actions improve user experience but are not treated as security controls.

## Assessments

Assessments and questions are data-driven. Question types are:

- `multiple_choice`
- `scale`
- `open_text`

Submission is transactional through a PostgreSQL function. Objective answers can
produce normalized preliminary scores. Open text is stored unchanged for
professional review.

`AIAnalysisService` is deliberately an interface plus a disabled implementation.
No answer is sent to an AI provider. A future adapter must include consent,
redaction, provider retention review, auditability, and human review.

## Reports

`PreliminaryReportService` combines completed assessment summaries and clinician
observations. Reports are explicitly non-diagnostic and must be reviewed by the
professional. `ClinicalFileStorage` provides a private Storage abstraction for a
future generated-file workflow.

## Future Parent Support

`ParentSupportService` reserves an application boundary for future educational
resources, emotional regulation activities, and guidance for parents of children
with autism or ADHD. No feature or clinical claim is implemented in this MVP.

## Security Notes

- Service-role access is server-only.
- Patient creation uses Supabase invitations.
- The `clinical-files` bucket is private.
- Doctors are scoped by `doctor_id`; patients are scoped through `profile_id`.
- Database policies protect direct client access.
- Demo credentials and content are fictitious and must not be reused in production.
