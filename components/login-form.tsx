"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole } from "lucide-react";
import type { Role } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Disclaimer } from "./disclaimer";
import { Logo } from "./logo";
import { Button, Card } from "./ui";

const DEMO_USERS = {
  doctor: { email: "doctor@demo.com", password: "Demo123!", name: "Dra. Elena Torres" },
  patient: { email: "paciente@demo.com", password: "Demo123!", name: "Ana Martínez" },
};

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("doctor");
  const [email, setEmail] = useState(DEMO_USERS.doctor.email);
  const [password, setPassword] = useState(DEMO_USERS.doctor.password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function selectRole(nextRole: Role) {
    setRole(nextRole);
    setEmail(DEMO_USERS[nextRole].email);
    setPassword(DEMO_USERS[nextRole].password);
    setError("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

    if (supabase && !demoMode) {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError || !data.user) {
        setError(authError?.message ?? "No se pudo iniciar sesión.");
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", data.user.id)
        .single();
      const destination = profile?.role === "patient" ? "/patient" : "/doctor";
      router.push(destination);
      return;
    }

    const selected = DEMO_USERS[role];
    if (email !== selected.email || password !== selected.password) {
      setError("Usa las credenciales demo mostradas para el rol seleccionado.");
      setLoading(false);
      return;
    }

    window.localStorage.setItem(
      "neuroapoyo-session",
      JSON.stringify({ role, email, name: selected.name }),
    );
    router.push(role === "doctor" ? "/doctor" : "/patient");
  }

  return (
    <main className="noise grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden min-h-screen flex-col justify-between bg-forest p-12 text-white lg:flex">
        <Logo href="/" inverse />
        <div className="max-w-xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-mint/70">
            Cuidado basado en seguimiento
          </p>
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight">
            Más claridad para acompañar cada proceso.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
            Organiza evaluaciones, acompaña hábitos y reúne información útil en un espacio
            sencillo y humano.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {["Seguimiento centralizado", "Experiencia accesible"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-white/85">
                <CheckCircle2 className="size-5 text-mint" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/45">MVP demostrativo · Datos ficticios</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo href="/" />
          </div>
          <div className="mb-8">
            <p className="text-sm font-semibold text-coral">Bienvenido de nuevo</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Accede a tu espacio
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink/55">
              Selecciona un perfil de prueba para recorrer la plataforma.
            </p>
          </div>

          <Card className="p-3">
            <div className="grid grid-cols-2 gap-2">
              {(["doctor", "patient"] as Role[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => selectRole(item)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    role === item ? "bg-forest text-white" : "text-ink/55 hover:bg-cream"
                  }`}
                >
                  {item === "doctor" ? "Soy profesional" : "Soy paciente"}
                </button>
              ))}
            </div>
          </Card>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Correo electrónico</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm shadow-sm"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Contraseña</span>
              <span className="relative block">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 pr-12 text-sm shadow-sm"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </span>
            </label>

            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Accediendo..." : "Entrar a la plataforma"}
              {!loading && <ArrowRight className="size-4" />}
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-ink/45">
            <LockKeyhole className="size-4" />
            Credenciales demo cargadas automáticamente
          </div>
          <div className="mt-8">
            <Disclaimer compact />
          </div>
        </div>
      </section>
    </main>
  );
}
