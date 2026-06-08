"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ClipboardCheck,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Role } from "@/lib/types";
import { cn, initials } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "./ui";

const navByRole = {
  doctor: [
    { label: "Resumen", href: "/doctor", icon: LayoutDashboard },
    { label: "Pacientes", href: "/doctor#pacientes", icon: Users },
    { label: "Biblioteca de tests", href: "/doctor#tests", icon: ClipboardCheck },
  ],
  patient: [
    { label: "Mi día", href: "/patient", icon: LayoutDashboard },
    { label: "Mis tests", href: "/patient#tests", icon: ClipboardCheck },
    { label: "Orientaciones", href: "/patient#orientaciones", icon: HeartPulse },
    { label: "Mi progreso", href: "/patient#progreso", icon: Activity },
  ],
};

export function AppShell({
  role,
  name,
  children,
}: {
  role: Role;
  name: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const nav = navByRole[role];

  function logout() {
    window.localStorage.removeItem("neuroapoyo-session");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-cream">
      <button
        aria-label="Abrir menú"
        className="fixed left-4 top-4 z-50 rounded-xl bg-white p-2 shadow md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-black/5 bg-white px-5 py-6 transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Logo href={role === "doctor" ? "/doctor" : "/patient"} />
        <div className="mt-10 rounded-2xl bg-cream p-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-coral/15 text-sm font-bold text-coral">
              {initials(name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="text-xs capitalize text-ink/50">
                {role === "doctor" ? "Profesional" : "Paciente"}
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-7 space-y-1">
          {nav.map((item) => {
            const active =
              item.href === `/${role}` ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink/60 transition hover:bg-cream hover:text-ink",
                  active && "bg-mint text-forest",
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-ink/55">
            <Settings className="size-5" /> Configuración
          </button>
          <Button variant="ghost" className="w-full justify-start px-4" onClick={logout}>
            <LogOut className="size-5" /> Cerrar sesión
          </Button>
        </div>
      </aside>

      <main className="min-h-screen md:pl-72">{children}</main>
    </div>
  );
}
