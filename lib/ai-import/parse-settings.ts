import { IMPORT_LANGUAGES, type ImportSettings } from "./types";

export function parseImportSettings(form: FormData): ImportSettings {
  const language = String(form.get("language") ?? "Python");
  const kinds = String(form.get("kinds") ?? "auto");
  return {
    language: IMPORT_LANGUAGES.includes(language) ? language : "Python",
    kinds: ["coding", "multiple_choice", "short_answer"].includes(kinds)
      ? (kinds as ImportSettings["kinds"])
      : "auto",
    writeTests: form.get("writeTests") === "true",
    detectKeys: form.get("detectKeys") === "true",
  };
}
