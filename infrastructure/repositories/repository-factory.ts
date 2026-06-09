import type { ClinicRepository } from "@/core/application/ports/clinic-repository";
import { MockClinicRepository } from "./mock-clinic-repository";
import { SupabaseClinicRepository } from "./supabase-clinic-repository";

export function getClinicRepository(): ClinicRepository {
  const configured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    process.env.NEXT_PUBLIC_DEMO_MODE !== "true";

  return configured ? new SupabaseClinicRepository() : new MockClinicRepository();
}
