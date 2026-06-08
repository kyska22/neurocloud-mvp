"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { getTest } from "@/lib/tests";
import { loadPatients, savePatients } from "@/lib/demo-store";
import { cn } from "@/lib/utils";
import { Disclaimer } from "./disclaimer";
import { Logo } from "./logo";
import { Button, Card, Pill } from "./ui";

export function TestRunner({ testId }: { testId: string }) {
  const router = useRouter();
  const test = getTest(testId);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);

  if (!test) {
    return <div className="grid min-h-screen place-items-center">Test no encontrado.</div>;
  }

  const question = test.questions[step];
  const progress = ((step + 1) / test.questions.length) * 100;
  const canContinue = Boolean(answers[question.id]?.trim());

  function finish() {
    const patients = loadPatients();
    const updated = patients.map((patient) => {
      if (patient.email !== "paciente@demo.com") return patient;
      return {
        ...patient,
        assignments: patient.assignments.map((assignment) =>
          assignment.testId === testId && assignment.status === "pending"
            ? {
                ...assignment,
                status: "completed" as const,
                completedAt: new Date().toISOString(),
                score: 75,
                summary:
                  "Respuestas registradas. El profesional revisará el resultado dentro del contexto completo.",
                answers,
              }
            : assignment,
        ),
      };
    });
    savePatients(updated);
    window.localStorage.setItem(`neuroapoyo-answers-${testId}`, JSON.stringify(answers));
    setFinished(true);
  }

  if (finished) {
    return (
      <main className="noise grid min-h-screen place-items-center p-5">
        <Card className="max-w-lg text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-mint text-forest">
            <CheckCircle2 className="size-8" />
          </span>
          <p className="mt-6 text-sm font-semibold text-coral">Respuestas enviadas</p>
          <h1 className="mt-2 text-3xl font-bold">Gracias por completar el test</h1>
          <p className="mt-4 text-sm leading-6 text-ink/55">
            Tu profesional podrá revisar las respuestas. Recuerda que este resultado es orientativo
            y se interpreta junto con una evaluación completa.
          </p>
          <Button className="mt-7" onClick={() => router.push("/patient")}>
            Volver a mi panel
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="noise min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between">
          <Logo href="/patient" />
          <button
            onClick={() => router.push("/patient")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink/50"
          >
            <ArrowLeft className="size-4" /> Salir
          </button>
        </header>

        <div className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <Pill className="bg-mint text-forest">{test.category}</Pill>
              <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{test.title}</h1>
            </div>
            <p className="flex shrink-0 items-center gap-2 text-xs font-semibold text-ink/40">
              <Clock3 className="size-4" /> {test.estimatedMinutes} min
            </p>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-black/5">
            <div className="h-full rounded-full bg-coral transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-right text-xs text-ink/40">
            Pregunta {step + 1} de {test.questions.length}
          </p>
        </div>

        <Card className="mt-7 p-6 sm:p-8">
          <p className="text-xl font-bold leading-8">{question.prompt}</p>
          {question.type === "single" ? (
            <div className="mt-7 space-y-3">
              {question.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => setAnswers({ ...answers, [question.id]: option })}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border p-4 text-left text-sm font-medium transition",
                    answers[question.id] === option
                      ? "border-forest bg-mint text-forest"
                      : "border-black/10 hover:border-forest/30 hover:bg-cream",
                  )}
                >
                  <span
                    className={cn(
                      "size-5 rounded-full border-2",
                      answers[question.id] === option
                        ? "border-[6px] border-forest bg-white"
                        : "border-black/15",
                    )}
                  />
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={answers[question.id] ?? ""}
              onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}
              placeholder="Escribe tu respuesta aquí..."
              className="mt-7 min-h-36 w-full resize-none rounded-2xl border border-black/10 bg-cream p-4 text-sm"
            />
          )}

          <div className="mt-8 flex justify-between">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((current) => current - 1)}
            >
              <ArrowLeft className="size-4" /> Anterior
            </Button>
            <Button
              disabled={!canContinue}
              onClick={() =>
                step === test.questions.length - 1
                  ? finish()
                  : setStep((current) => current + 1)
              }
            >
              {step === test.questions.length - 1 ? "Enviar respuestas" : "Continuar"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Card>

        <div className="mt-6">
          <Disclaimer compact />
        </div>
      </div>
    </main>
  );
}
