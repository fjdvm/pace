"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { CreateClassDialog } from "@/components/features/instructor/sidebar/create-class-dialog";
import { useJoinClass } from "@/components/features/student/home/use-join-class";
import type { DashboardClasses } from "@/lib/dashboard-classes";
import { ClassList } from "./class-list";

export function DashboardHomeView({ teaching, enrolled }: DashboardClasses) {
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const join = useJoinClass();
  const activeTeaching = teaching.filter((cls) => !cls.archived);
  const activeEnrolled = enrolled.filter((cls) => !cls.archived);
  const empty = activeTeaching.length === 0 && activeEnrolled.length === 0;
  const actions = <div className="flex gap-3">
    <Button variant="outline" onClick={() => setJoining(true)}>Join class</Button>
    <Button onClick={() => setCreating(true)}>Create class</Button>
  </div>;

  return (
    <>
      <StudentTopBar title="Home" actions={actions} />
      <main className="grid gap-8 p-4 md:p-10">
        {empty ? (
          <section className="flex flex-col items-center gap-4 rounded-[20px] border border-pace-line bg-white px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-pace-ink">Welcome to PACE</h2>
            <p className="max-w-md text-pace-ink-2">Create a Class to start teaching, or join a Class with an Instructor&apos;s code.</p>
            {actions}
          </section>
        ) : <>
          <ClassList title="Teaching" classes={activeTeaching} />
          <ClassList title="Enrolled" classes={activeEnrolled} />
        </>}
      </main>
      <CreateClassDialog open={creating} onOpenChange={setCreating} />
      <Dialog open={joining} onOpenChange={setJoining}>
        <DialogContent className="rounded-[20px] bg-white text-pace-ink">
          <DialogHeader>
            <DialogTitle>Join class</DialogTitle>
            <DialogDescription>Enter the 6-character code your Instructor shared.</DialogDescription>
          </DialogHeader>
          <form className="flex gap-3" onSubmit={async (event) => {
            if (await join.submit(event)) setJoining(false);
          }}>
            <Input aria-label="Class join code" placeholder="e.g. KEBQ3D" maxLength={6} value={join.code} onChange={(event) => join.setCode(event.target.value)} disabled={join.isJoining} autoFocus />
            <Button type="submit" disabled={join.isJoining || !join.code.trim()}>{join.isJoining ? "Joining…" : "Join class"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
