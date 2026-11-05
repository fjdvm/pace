import { type NextRequest } from "next/server";
import { streamText } from "ai";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getModelWithFallback } from "@/lib/ai-provider";
import { requireStudentPost } from "@/lib/workspace/student-access";
import { recordTutorRequest } from "@/lib/workspace/tutor-request";
import { buildSystemPrompt } from "@/lib/workspace/tutor-prompt";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { assignmentId, itemId, currentCode, lastRunResults, messages } = body;
    const last = Array.isArray(messages)
      ? messages.filter((m: { role: string }) => m?.role === "user").at(-1)
      : undefined;
    const message = last?.parts?.filter((p: { type: string }) => p.type === "text")
      .map((p: { text: string }) => p.text).join("") ?? last?.content ?? body.message;
    if (typeof assignmentId !== "string" || typeof itemId !== "string" ||
        typeof message !== "string" || !message.trim() ||
        (currentCode !== undefined && typeof currentCode !== "string")) {
      return Response.json({ error: "Missing or invalid parameters" }, { status: 400 });
    }
    const post = await requireStudentPost(assignmentId, user.id);
    const item = post.items.find((i) => i.id === itemId && i.kind === "coding");
    if (!item) return Response.json({ error: "Coding Item not found in this Post" }, { status: 404 });
    const model = await getModelWithFallback(assignmentId);
    const hearts = await recordTutorRequest(user.id, post, item.id, message.trim());
    const history = await prisma.chatMessage.findMany({
      where: { studentId: user.id, assignmentId, itemId },
      orderBy: { createdAt: "asc" },
    });
    const tier = Math.min(5, Math.max(1, hearts.totalSpent));
    const result = streamText({
      model,
      system: buildSystemPrompt(item, currentCode, lastRunResults, hearts.totalSpent, tier),
      messages: history.map((msg) => ({ role: msg.role as "user" | "assistant", content: msg.content })),
      onFinish: async ({ text }) => {
        await prisma.chatMessage.create({
          data: { studentId: user.id, assignmentId, itemId, role: "assistant", content: text },
        });
      },
    });
    return result.toUIMessageStreamResponse({
      headers: {
        "X-Accel-Buffering": "no",
        "Cache-Control": "no-cache, no-transform",
        "X-Hearts-State": JSON.stringify(hearts),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tutor unavailable";
    const denied = /enrolled Student|turned in|hearts remaining/.test(message);
    const missing = message === "Post not found";
    return Response.json({ error: message }, { status: denied ? 403 : missing ? 404 : 500 });
  }
}
