import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Seguimiento neuropsicológico más claro",
  description:
    "Organiza pacientes, evaluaciones y seguimiento diario en una plataforma simple para profesionales y pacientes.",
};

export default function Home() {
  return <LandingPage />;
}
