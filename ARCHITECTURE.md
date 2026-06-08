# Arquitectura

## Capas

- `app/`: rutas App Router y composición de páginas.
- `components/`: interfaces y flujos interactivos por rol.
- `lib/types.ts`: contratos del dominio.
- `lib/tests.ts`: catálogo local usado por el modo demo.
- `lib/demo-store.ts`: adaptador de persistencia local.
- `lib/data/`: adaptador de persistencia Supabase.
- `lib/supabase/`: creación de clientes Supabase.
- `supabase/schema.sql`: modelo relacional, índices y RLS.
- `scripts/seed-supabase.mjs`: usuarios Auth y datos reproducibles.

## Decisiones

El modo demo usa `localStorage` para que la revisión sea inmediata. Al definir
`NEXT_PUBLIC_DEMO_MODE=false`, el login usa Supabase Auth. Las operaciones de
persistencia remota están aisladas en `lib/data/supabase-repository.ts`, evitando
que la UI dependa directamente del SDK.

La aplicación no genera diagnósticos. Los índices y resúmenes son orientativos y
deben ser revisados por un profesional dentro de una evaluación completa.
