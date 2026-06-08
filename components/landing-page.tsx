import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  HeartHandshake,
  Layers3,
  LockKeyhole,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Logo } from "./logo";
import { Disclaimer } from "./disclaimer";

const benefits = [
  {
    icon: Layers3,
    title: "Todo el proceso en un solo lugar",
    text: "Pacientes, tests, respuestas, estados y seguimiento diario organizados sin hojas dispersas.",
  },
  {
    icon: Clock3,
    title: "Menos carga operativa",
    text: "Asigna evaluaciones y revisa avances con una interfaz directa, diseñada para ahorrar tiempo.",
  },
  {
    icon: HeartHandshake,
    title: "Acompañamiento entre sesiones",
    text: "El paciente registra hábitos y bienestar mientras mantiene visibles las orientaciones recibidas.",
  },
  {
    icon: ShieldCheck,
    title: "Acceso según cada rol",
    text: "Profesionales y pacientes acceden únicamente a la información correspondiente a su perfil.",
  },
];

const audiences = [
  {
    icon: Brain,
    title: "Neuropsicología",
    text: "Seguimiento estructurado de procesos de evaluación y acompañamiento.",
  },
  {
    icon: MessageSquareText,
    title: "Psicología clínica",
    text: "Apoyo para observar hábitos, bienestar y continuidad entre consultas.",
  },
  {
    icon: Users,
    title: "Clínicas y equipos",
    text: "Una base escalable para ordenar flujos y estandarizar la experiencia.",
  },
];

export function LandingPage() {
  return (
    <main className="overflow-hidden bg-cream">
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-medium text-ink/60 md:flex">
            <a href="#beneficios" className="transition hover:text-forest">Beneficios</a>
            <a href="#como-funciona" className="transition hover:text-forest">Cómo funciona</a>
            <a href="#precios" className="transition hover:text-forest">Precio beta</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-ink/60 transition hover:bg-white sm:inline-flex"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-[#17493b]"
            >
              Ver demo <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="landing-grid relative min-h-[760px] pt-32 sm:pt-36">
        <div className="landing-orb absolute -right-32 top-8 size-[520px] rounded-full bg-mint/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-white/75 px-4 py-2 text-xs font-bold text-forest shadow-sm backdrop-blur">
              <Sparkles className="size-4 text-coral" />
              Plataforma beta para profesionales
            </div>
            <h1 className="mt-7 text-5xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.7rem]">
              Más claridad para acompañar <span className="text-forest">cada proceso.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ink/60">
              Organiza evaluaciones, reúne respuestas y acompaña hábitos en una experiencia
              sencilla para profesionales y pacientes.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="cta-primary">
                Explorar demo gratuita <ArrowRight className="size-4" />
              </Link>
              <a href="#contacto" className="cta-secondary">Hablar con nosotros</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-ink/45">
              {["Sin tarjeta", "Datos demo incluidos", "Acceso inmediato"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-forest" /> {item}
                </span>
              ))}
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section className="border-y border-black/5 bg-white/65">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-8 text-center sm:px-8 md:grid-cols-4 lg:px-10">
          {[
            ["2", "perfiles conectados"],
            ["4", "tests iniciales"],
            ["24/7", "seguimiento disponible"],
            ["100%", "orientativo"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-2xl font-bold text-forest">{value}</p>
              <p className="mt-1 text-xs text-ink/45">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="beneficios" className="scroll-mt-10 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Una experiencia más ordenada"
            title="Menos administración. Más tiempo para acompañar."
            text="NeuroApoyo reúne las tareas esenciales del proceso en una interfaz clara y accesible."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <article key={benefit.title} className="commercial-card group">
                <div className="flex items-start gap-5">
                  <span className={`grid size-13 shrink-0 place-items-center rounded-2xl ${index === 1 ? "bg-coral/15 text-coral" : "bg-mint text-forest"}`}>
                    <benefit.icon className="size-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-ink/50">{benefit.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-10 bg-forest px-5 py-24 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            inverse
            eyebrow="Cómo funciona"
            title="Del registro al seguimiento, sin fricción."
            text="Un flujo simple para que la tecnología acompañe el trabajo profesional, sin ocupar su lugar."
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {[
              ["01", "Crea el perfil", "Registra al paciente y centraliza su proceso de seguimiento."],
              ["02", "Asigna y acompaña", "Selecciona tests, comparte orientaciones y observa la adherencia."],
              ["03", "Revisa con contexto", "Consulta respuestas y resultados orientativos antes de cada encuentro."],
            ].map(([number, title, text]) => (
              <article key={number} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7">
                <p className="text-5xl font-bold text-white/10">{number}</p>
                <h3 className="mt-10 text-xl font-bold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Para quién es"
            title="Diseñado para quienes acompañan procesos humanos."
            text="Una base flexible para profesionales independientes y equipos que necesitan orden y continuidad."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {audiences.map((audience) => (
              <article key={audience.title} className="commercial-card">
                <span className="grid size-12 place-items-center rounded-2xl bg-cream text-forest">
                  <audience.icon className="size-6" />
                </span>
                <h3 className="mt-6 text-lg font-bold">{audience.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink/50">{audience.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      <section id="contacto" className="scroll-mt-10 px-5 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-ink px-7 py-14 text-center text-white sm:px-12 sm:py-16">
          <span className="mx-auto grid size-13 place-items-center rounded-2xl bg-white/10 text-mint">
            <Mail className="size-6" />
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Construyamos una mejor experiencia de seguimiento.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/55">
            Cuéntanos cómo trabajas hoy. Las primeras conversaciones ayudan a definir la beta.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="mailto:hola@neuroapoyo.app?subject=Interés%20en%20NeuroApoyo%20Beta"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-coral px-7 text-sm font-bold text-white transition hover:bg-[#df6c54]"
            >
              Contactar al equipo <Mail className="size-4" />
            </a>
            <Link href="/login" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-7 text-sm font-bold text-white transition hover:bg-white/10">
              Acceder a la demo
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-white/60 px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <Logo />
            <div className="flex flex-wrap gap-5 text-xs font-medium text-ink/45">
              <a href="#beneficios">Beneficios</a>
              <a href="#como-funciona">Cómo funciona</a>
              <a href="#precios">Precio beta</a>
              <Link href="/login">Acceso demo</Link>
            </div>
          </div>
          <div className="mt-8"><Disclaimer compact /></div>
          <p className="mt-6 text-xs text-ink/35">© 2026 NeuroApoyo. MVP demostrativo con datos ficticios.</p>
        </div>
      </footer>
    </main>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
      <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-mint/80 to-white/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_35px_100px_rgba(23,35,31,0.18)]">
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <div className="flex gap-2">
            <span className="size-2.5 rounded-full bg-coral" />
            <span className="size-2.5 rounded-full bg-amber-300" />
            <span className="size-2.5 rounded-full bg-emerald-300" />
          </div>
          <span className="rounded-full bg-cream px-3 py-1 text-[10px] font-bold text-ink/40">Panel profesional</span>
        </div>
        <div className="grid min-h-[430px] grid-cols-[85px_1fr] sm:grid-cols-[145px_1fr]">
          <div className="border-r border-black/5 bg-[#fbfaf7] p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-forest text-[10px] font-bold text-white">N</span>
              <span className="hidden text-xs font-bold sm:inline">NeuroApoyo</span>
            </div>
            <div className="mt-8 space-y-2">
              {[BarChart3, Users, ClipboardCheck].map((Icon, index) => (
                <div key={index} className={`rounded-xl p-2 ${index === 0 ? "bg-mint text-forest" : "text-ink/30"}`}>
                  <Icon className="size-4" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-cream/65 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-coral">Resumen</p>
                <p className="mt-1 text-lg font-bold">Buenos días, Elena</p>
              </div>
              <span className="rounded-full bg-forest px-3 py-2 text-[9px] font-bold text-white">+ Paciente</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[["12", "Activos"], ["8", "Completados"], ["3", "Pendientes"]].map(([value, label]) => (
                <div key={label} className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-lg font-bold text-forest">{value}</p>
                  <p className="mt-1 text-[8px] text-ink/35">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold">Pacientes recientes</p>
              <div className="mt-4 space-y-3">
                {[
                  ["AM", "Ana Martínez", "En evaluación"],
                  ["CR", "Carlos Rivera", "Evaluado"],
                  ["LG", "Lucía Gómez", "Informe listo"],
                ].map(([initials, name, status]) => (
                  <div key={name} className="flex items-center gap-3 border-b border-black/5 pb-3 last:border-0">
                    <span className="grid size-8 place-items-center rounded-full bg-cream text-[9px] font-bold text-forest">{initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-bold">{name}</p>
                      <p className="text-[8px] text-ink/30">Actividad reciente</p>
                    </div>
                    <span className="rounded-full bg-mint px-2 py-1 text-[7px] font-bold text-forest">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-7 -left-4 hidden w-52 rounded-2xl border border-white bg-white p-4 shadow-soft sm:block">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-mint text-forest"><LockKeyhole className="size-4" /></span>
          <div><p className="text-[10px] font-bold">Acceso por roles</p><p className="mt-1 text-[8px] text-ink/40">Doctor y paciente</p></div>
        </div>
      </div>
    </div>
  );
}

function Pricing() {
  const features = ["Pacientes ilimitados en demo", "Asignación de tests", "Resultados y respuestas", "Checklist y racha diaria", "Orientaciones al paciente", "Soporte de implementación"];
  return (
    <section id="precios" className="scroll-mt-10 px-5 pb-24 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2.5rem] border border-forest/10 bg-white shadow-[0_30px_90px_rgba(23,35,31,0.1)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-mint/70 p-8 sm:p-10">
          <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-bold text-forest shadow-sm">Precio beta</span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Empieza sin complejidad.</h2>
          <p className="mt-4 text-sm leading-7 text-ink/55">Accede a todas las funciones del MVP mientras construimos la siguiente versión.</p>
          <div className="mt-8 flex items-end gap-2"><span className="text-5xl font-bold text-forest">US$ 19</span><span className="pb-2 text-sm text-ink/45">/mes</span></div>
          <p className="mt-2 text-xs text-ink/40">Precio estimado durante la etapa beta.</p>
        </div>
        <div className="p-8 sm:p-10">
          <p className="text-sm font-bold">Incluye en la beta</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {features.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink/60">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-forest"><Check className="size-3" /></span>{item}
              </div>
            ))}
          </div>
          <Link href="/login" className="mt-9 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-forest px-6 text-sm font-bold text-white hover:bg-[#17493b]">
            Probar la demo <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, text, inverse = false }: { eyebrow: string; title: string; text: string; inverse?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className={`text-xs font-bold uppercase tracking-[0.2em] ${inverse ? "text-mint" : "text-coral"}`}>{eyebrow}</p>
      <h2 className={`mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl ${inverse ? "text-white" : "text-ink"}`}>{title}</h2>
      <p className={`mt-4 text-sm leading-7 ${inverse ? "text-white/55" : "text-ink/50"}`}>{text}</p>
    </div>
  );
}
