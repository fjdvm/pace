"use client";

import { useState } from "react";
import { useSignIn } from "@/components/features/auth/sign-in/sign-in-context";
import type { StudyRole } from "@/lib/study/items/types";
import type { Sitting } from "@/lib/study/sitting-form";
import type { QuestionnaireProgress } from "@/lib/study/respondent-store";
import { Button3D } from "../shared/button-3d";
import { ConsentBox } from "./consent-box";
import { RolePicker } from "./role-picker";
import { SittingCards } from "./sitting-cards";

type Props = {
  signedIn: boolean;
  progress: QuestionnaireProgress;
  onBegin: (role: StudyRole, sitting: Sitting) => void;
};

const firstOpen = (submitted: Sitting[]): Sitting => (submitted.includes(1) ? 2 : 1);

export function StartScreen({ signedIn, progress, onBegin }: Props) {
  const { open } = useSignIn();
  const [role, setRole] = useState<StudyRole>("student");
  const [picked, setPicked] = useState<Sitting | null>(null);
  const [consent, setConsent] = useState(false);

  const submitted = progress[role].submitted;
  const sitting = picked && !submitted.includes(picked) ? picked : firstOpen(submitted);
  const done = submitted.includes(sitting);
  const resuming = !!progress[role].drafts[sitting];
  const label = `${resuming ? "Continue" : "Begin"} Sitting ${sitting}`;

  return (
    <>
      <RolePicker value={role} onChange={setRole} />
      <SittingCards value={sitting} submitted={submitted} onChange={setPicked} />
      <ConsentBox checked={consent} onChange={setConsent} />
      <div className="flex flex-col items-center gap-3 pt-4">
        <p className="text-sm text-lp-muted">Your progress saves as you go.</p>
        <Button3D disabled={!consent || done} onClick={() => (signedIn ? onBegin(role, sitting) : open())}>
          {label}
        </Button3D>
      </div>
    </>
  );
}
