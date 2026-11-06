"use client";

import { useEffect, useState } from "react";
import { emptyState } from "@/lib/study/form-progress";
import type { StudyRole } from "@/lib/study/items/types";
import type { QuestionnaireProgress } from "@/lib/study/respondent-store";
import { buildSittingForm, type Sitting } from "@/lib/study/sitting-form";
import { SittingFormView } from "./form/sitting-form-view";
import { QuestionnaireShell } from "./shared/questionnaire-shell";
import { StartScreen } from "./start/start-screen";
import { ClosedScreen } from "./thank-you/closed-screen";
import { ThankYouScreen } from "./thank-you/thank-you-screen";

type Stage = { kind: "start" } | { kind: "form"; role: StudyRole; sitting: Sitting } | { kind: "thanks" };

type Props = { closed: boolean; signedIn: boolean; progress: QuestionnaireProgress; nav: React.ReactNode };

const START_INTRO =
  "Rate the tools you use now, then rate PACE after you try it. The same statements are used for both, so the two can be compared.";

export function QuestionnaireView({ closed, signedIn, progress, nav }: Props) {
  const [stage, setStage] = useState<Stage>({ kind: "start" });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stage.kind]);

  if (closed) {
    return (
      <QuestionnaireShell
        nav={nav}
        title="The questionnaire is closed"
        intro="We are no longer collecting responses. Thank you to everyone who took part in evaluating PACE."
      >
        <ClosedScreen />
      </QuestionnaireShell>
    );
  }

  if (stage.kind === "form") {
    const form = buildSittingForm(stage.role, stage.sitting);
    return (
      <QuestionnaireShell nav={nav} title={form.title} intro={form.intro}>
        <SittingFormView
          key={`${stage.role}-${stage.sitting}`}
          form={form}
          initial={progress[stage.role].drafts[stage.sitting] ?? emptyState()}
          onSubmitted={() => setStage({ kind: "thanks" })}
        />
      </QuestionnaireShell>
    );
  }

  if (stage.kind === "thanks") {
    return (
      <QuestionnaireShell nav={nav} title="Thank you" intro="Your answers were saved.">
        <ThankYouScreen />
      </QuestionnaireShell>
    );
  }

  return (
    <QuestionnaireShell nav={nav} title="Evaluation questionnaire" intro={START_INTRO}>
      <StartScreen
        signedIn={signedIn}
        progress={progress}
        onBegin={(role, sitting) => setStage({ kind: "form", role, sitting })}
      />
    </QuestionnaireShell>
  );
}
