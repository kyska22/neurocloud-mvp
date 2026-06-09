import type { ClinicalFileStorage } from "@/core/application/ports/clinical-file-storage";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export class SupabaseClinicalFileStorage implements ClinicalFileStorage {
  async upload(input: {
    doctorProfileId: string;
    patientId: string;
    fileName: string;
    contentType: string;
    bytes: ArrayBuffer;
  }) {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error("Supabase Storage is not configured.");
    const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${input.doctorProfileId}/${input.patientId}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage
      .from("clinical-files")
      .upload(path, input.bytes, { contentType: input.contentType, upsert: false });
    if (error) throw error;
    return { path };
  }

  async createSignedDownloadUrl(path: string, expiresInSeconds = 300) {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error("Supabase Storage is not configured.");
    const { data, error } = await supabase.storage
      .from("clinical-files")
      .createSignedUrl(path, expiresInSeconds);
    if (error) throw error;
    return data.signedUrl;
  }
}
