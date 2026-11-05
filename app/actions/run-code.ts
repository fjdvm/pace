"use server";

import { requireStudentPost } from "@/lib/workspace/student-access";
import { executeTests } from "@/lib/workspace/execute-tests";
import { createClient } from "@/lib/supabase/server";

const RUN_LIMIT = 5;
const LIMIT_WINDOW_MS = 60000;
const runHistory = new Map<string, number[]>();

function checkRateLimit(userId: string): {
  allowed: boolean;
  remainingSecs?: number;
} {
  const now = Date.now();
  const history = runHistory.get(userId) || [];

  const recentRuns = history.filter(
    (timestamp) => now - timestamp < LIMIT_WINDOW_MS,
  );

  if (recentRuns.length >= RUN_LIMIT) {
    const oldestRecentRun = recentRuns[0];
    const remainingMs = LIMIT_WINDOW_MS - (now - oldestRecentRun);
    return {
      allowed: false,
      remainingSecs: Math.max(1, Math.ceil(remainingMs / 1000)),
    };
  }

  recentRuns.push(now);
  runHistory.set(userId, recentRuns);
  return { allowed: true };
}

export async function runCode(
  assignmentId: string,
  code: string,
  itemId?: string,
) {
  try {
    if (!assignmentId) {
      throw new Error("Assignment ID is required");
    }
    if (code === undefined || code === null) {
      throw new Error("Code content is required");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized: You must be logged in");
    }

    const rateLimit = checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      throw new Error(
        `Rate limit exceeded. You can only run code 5 times per minute. Please wait ${rateLimit.remainingSecs} seconds.`,
      );
    }

    const post = await requireStudentPost(assignmentId, user.id);
    const item = itemId
      ? post.items.find((i) => i.id === itemId)
      : post.items[0];
    if (!item) throw new Error("Item not found in this Post");
    const results = await executeTests(
      item.language,
      code,
      item.testCases.filter((t) => t.visible),
    );

    return {
      success: true,
      results,
    };
  } catch (err) {
    console.error("Code run error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
