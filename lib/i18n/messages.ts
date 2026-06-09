import type { Locale } from "./config";

export type Messages = typeof import("@/messages/pt.json");

export async function getMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case "es":
      return (await import("@/messages/es.json")).default;
    case "en":
      return (await import("@/messages/en.json")).default;
    default:
      return (await import("@/messages/pt.json")).default;
  }
}
