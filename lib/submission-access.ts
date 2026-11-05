import { createClient } from "@/lib/supabase/server";
import { isAssignmentInstructor } from "@/lib/assignment-instructor";

export async function requireGradingInstructor(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !(await isAssignmentInstructor(postId, user.id)))
    throw new Error(
      "Only the Class's Instructor can grade and return a Submission",
    );
  return user;
}
