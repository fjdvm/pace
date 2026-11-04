"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateClassDialog } from "@/components/features/instructor/sidebar/create-class-dialog";
import { JoinClassDialog } from "../join-class-dialog";

export function WelcomeState() {
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);
  return (
    <section className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <h2 className="text-2xl font-bold text-pace-ink">Welcome to PACE</h2>
      <p className="max-w-md text-pace-ink-2">Join a Class with an Instructor&apos;s code, or create a Class to start teaching.</p>
      <div className="flex gap-3">
        <Button onClick={() => setJoining(true)}>Join class</Button>
        <Button variant="outline" onClick={() => setCreating(true)}>Create class</Button>
      </div>
      <JoinClassDialog open={joining} onOpenChange={setJoining} />
      <CreateClassDialog open={creating} onOpenChange={setCreating} />
    </section>
  );
}
