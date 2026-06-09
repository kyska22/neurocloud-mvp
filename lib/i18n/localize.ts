import type { LocalizedText } from "@/core/domain/models";
import type { Locale } from "./config";

export function localize(text: LocalizedText, locale: Locale) {
  return text[locale] || text.pt || text.en;
}
