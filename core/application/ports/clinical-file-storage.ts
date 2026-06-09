export interface ClinicalFileStorage {
  upload(input: {
    doctorProfileId: string;
    patientId: string;
    fileName: string;
    contentType: string;
    bytes: ArrayBuffer;
  }): Promise<{ path: string }>;
  createSignedDownloadUrl(path: string, expiresInSeconds?: number): Promise<string>;
}
