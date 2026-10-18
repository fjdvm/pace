export type StatusState = "ok" | "optional" | "error";

export type StatusItem = {
  id: "tutor" | "backup" | "execution" | "encryption";
  title: string;
  detail: string;
  badge: string;
  state: StatusState;
};

export type StatusInput = {
  groqKey: boolean;
  googleKey: boolean;
  encryptionKey: boolean;
  codeExecution: boolean;
};

const GROQ = "Groq · openai/gpt-oss-120b";
const GOOGLE = "Google AI · gemini-1.5-flash";

function tutorItem({ groqKey, googleKey }: StatusInput): StatusItem {
  if (groqKey) return { id: "tutor", title: "AI tutor provider", detail: GROQ, badge: "Connected", state: "ok" };
  if (googleKey) return { id: "tutor", title: "AI tutor provider", detail: GOOGLE, badge: "Connected", state: "ok" };
  return { id: "tutor", title: "AI tutor provider", detail: "No API key configured", badge: "Not connected", state: "error" };
}

function backupItem({ groqKey, googleKey }: StatusInput): StatusItem {
  const backupIsGoogle = groqKey || !googleKey;
  const hasBackup = backupIsGoogle ? googleKey && groqKey : groqKey;
  const name = backupIsGoogle ? "Google AI" : "Groq";
  return {
    id: "backup",
    title: "Backup provider",
    detail: hasBackup ? `${name} key set` : `${name} key not set`,
    badge: hasBackup ? "Connected" : "Optional",
    state: hasBackup ? "ok" : "optional",
  };
}

export function buildSystemStatus(input: StatusInput): StatusItem[] {
  return [
    tutorItem(input),
    backupItem(input),
    {
      id: "execution",
      title: "Code execution",
      detail: "Judge0 · Python, C, JS, C#",
      badge: input.codeExecution ? "Operational" : "Unreachable",
      state: input.codeExecution ? "ok" : "error",
    },
    {
      id: "encryption",
      title: "Key encryption",
      detail: input.encryptionKey ? "AES-256-GCM key configured" : "ENCRYPTION_KEY is not set",
      badge: input.encryptionKey ? "Configured" : "Not set",
      state: input.encryptionKey ? "ok" : "error",
    },
  ];
}

export function isOperational(items: StatusItem[]) {
  return items.every((item) => item.state !== "error");
}
