import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NeuroApoyo | Seguimiento neuropsicológico",
    template: "%s | NeuroApoyo",
  },
  description:
    "Plataforma de apoyo para organizar evaluaciones, pacientes y seguimiento diario.",
  keywords: [
    "neuropsicología",
    "evaluación neuropsicológica",
    "seguimiento de pacientes",
    "software para psicólogos",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
