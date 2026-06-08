# NeuroApoyo MVP

MVP SaaS de apoyo a evaluaciones neuropsicológicas con dos perfiles: profesional
y paciente. Construido con Next.js 15, TypeScript, Tailwind CSS y Supabase.

> Esta plataforma no sustituye evaluación profesional. Los resultados son
> orientativos y no constituyen un diagnóstico médico.

## Funcionalidades

**Profesional**

- Inicio de sesión y dashboard con métricas.
- Alta, búsqueda y filtrado de pacientes.
- Pacientes ordenados del más nuevo al más antiguo.
- Estados: `en_evaluacion`, `evaluado`, `laudo_entregado` y `archivado`.
- Asignación de tests y consulta de resultados.

**Paciente**

- Inicio de sesión y dashboard personal.
- Tests asignados y cuestionarios paso a paso.
- Orientaciones generales sin diagnóstico.
- Checklist diario, registro emocional y racha de actividad.

## Usuarios de prueba

| Perfil | Correo | Contraseña |
| --- | --- | --- |
| Profesional | `doctor@demo.com` | `Demo123!` |
| Paciente | `paciente@demo.com` | `Demo123!` |

Con `NEXT_PUBLIC_DEMO_MODE=true`, las credenciales funcionan sin Supabase y los
cambios se guardan en el navegador.

## Estructura

```text
neuroapoyo-mvp/
├── app/
│   ├── doctor/patients/[id]/
│   ├── patient/tests/[id]/
│   ├── login/
│   └── globals.css
├── components/
├── lib/
│   ├── data/
│   └── supabase/
├── scripts/seed-supabase.mjs
├── supabase/schema.sql
├── ARCHITECTURE.md
└── .env.example
```

## Instalación local

Requisitos: Node.js 20 o superior.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`.

## Configurar Supabase

1. Crea un proyecto gratuito en Supabase.
2. Abre **SQL Editor** y ejecuta `supabase/schema.sql`.
3. Copia `.env.example` como `.env.local`.
4. Añade la URL, la clave pública y la service role key.
5. Ejecuta `npm run seed` para crear los dos usuarios Auth y los datos demo.
6. Cambia `NEXT_PUBLIC_DEMO_MODE=false` para usar Supabase Auth.

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_DEMO_MODE=false
```

La service role key se usa solo en el script local de seed. Nunca debe exponerse
en código cliente ni llevar el prefijo `NEXT_PUBLIC_`.

## Deploy en Vercel

1. Sube la carpeta `neuroapoyo-mvp` a un repositorio Git.
2. En Vercel selecciona **Add New > Project** e importa el repositorio.
3. Si el repositorio contiene otros proyectos, configura **Root Directory** como
   `neuroapoyo-mvp`.
4. Añade las variables de entorno de Supabase en **Settings > Environment Variables**.
5. Despliega. Vercel detectará Next.js automáticamente y ejecutará `npm run build`.

Para una demo sin backend, define únicamente:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

## Próximos pasos recomendados

- Invitación de pacientes por correo en vez de contraseña temporal.
- Auditoría de accesos y consentimiento informado.
- Versionado y validación clínica de instrumentos.
- Exportación de informes y registro de notas profesionales.
- Pruebas E2E, monitoreo y políticas de retención de datos.

## Privacidad

Los datos incluidos son ficticios. Antes de usar información real deben revisarse
consentimiento, cifrado, retención, respaldo, auditoría y las obligaciones legales
aplicables al país donde opere el servicio.
