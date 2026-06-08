"use client";

import type { Patient } from "./types";
import { MOCK_PATIENTS } from "./mock-data";

const PATIENT_KEY = "neuroapoyo-patients";
const STORE_VERSION_KEY = "neuroapoyo-store-version";
const STORE_VERSION = "3";

export function loadPatients(): Patient[] {
  if (typeof window === "undefined") return MOCK_PATIENTS;
  if (window.localStorage.getItem(STORE_VERSION_KEY) !== STORE_VERSION) {
    window.localStorage.setItem(PATIENT_KEY, JSON.stringify(MOCK_PATIENTS));
    window.localStorage.setItem(STORE_VERSION_KEY, STORE_VERSION);
    return MOCK_PATIENTS;
  }
  const stored = window.localStorage.getItem(PATIENT_KEY);
  if (!stored) {
    window.localStorage.setItem(PATIENT_KEY, JSON.stringify(MOCK_PATIENTS));
    return MOCK_PATIENTS;
  }
  try {
    return JSON.parse(stored) as Patient[];
  } catch {
    return MOCK_PATIENTS;
  }
}

export function savePatients(patients: Patient[]) {
  window.localStorage.setItem(PATIENT_KEY, JSON.stringify(patients));
}

export function resetDemoData() {
  window.localStorage.setItem(PATIENT_KEY, JSON.stringify(MOCK_PATIENTS));
  window.localStorage.setItem(STORE_VERSION_KEY, STORE_VERSION);
}
