import { prisma } from "@/lib/prisma";
import { buildSystemStatus, isOperational } from "@/lib/system-status";

async function probeCodeExecution() {
  try {
    const response = await fetch("https://ce.judge0.com/about", {
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getSystemStatus() {
  const [settings, codeExecution] = await Promise.all([
    prisma.systemSetting.findMany({
      where: { key: { in: ["GROQ_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY"] } },
      select: { key: true, value: true },
    }),
    probeCodeExecution(),
  ]);
  const stored = (key: string) => settings.some((s) => s.key === key && !!s.value);

  const items = buildSystemStatus({
    groqKey: !!process.env.GROQ_API_KEY || stored("GROQ_API_KEY"),
    googleKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY || stored("GOOGLE_GENERATIVE_AI_API_KEY"),
    encryptionKey: !!process.env.ENCRYPTION_KEY,
    codeExecution,
  });
  return { items, operational: isOperational(items) };
}
