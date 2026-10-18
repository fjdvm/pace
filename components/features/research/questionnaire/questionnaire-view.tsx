"use client";

import { LandingFooter } from "@/components/features/landing/footer/landing-footer";
import { landingFontClasses } from "@/components/features/landing/landing-fonts";
import { TOTAL_STATEMENTS } from "@/lib/study/form-progress";
import { useQuestionnaireForm } from "./use-questionnaire-form";
import { QuestionnaireHeader } from "./questionnaire-header";
import { PrivacyNote } from "./privacy-note";
import { ProgressCard } from "./progress-card";
import { AboutYouSection } from "./about-you-section";
import { RatingsSection } from "./ratings-section";
import { CommentsSection } from "./comments-section";
import { SubmitBar } from "./submit-bar";
import { SubmittedCard } from "./submitted-card";
import { ClosedCard } from "./closed-card";

export function QuestionnaireView({ closed, nav }: { closed: boolean; nav: React.ReactNode }) {
  const form = useQuestionnaireForm();
  const labels = ["About you", "Ratings", "Comments"];

  return (
    <div className={`${landingFontClasses} pace-landing flex min-h-screen flex-col bg-pace-canvas font-pace-sans text-pace-ink`}>
      {nav}
      <main className="flex flex-1 flex-col px-4 pb-24 pt-32 sm:px-6 sm:pt-[150px]">
        {form.summary ? (
          <SubmittedCard summary={form.summary} />
        ) : closed ? (
          <ClosedCard />
        ) : (
          <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6">
            <QuestionnaireHeader version={form.version} onVersionChange={form.setVersion} />
            <PrivacyNote />
            <ProgressCard
              steps={labels.map((label, i) => ({ label, state: form.steps[i] }))}
              answered={form.answered}
              total={TOTAL_STATEMENTS}
            />
            <AboutYouSection version={form.version} value={form.about} onChange={form.patchAbout} />
            <RatingsSection answers={form.answers} onAnswer={form.answer} />
            <CommentsSection comments={form.comments} onChange={form.setComment} />
            <SubmitBar ready={form.ready} total={TOTAL_STATEMENTS} isSubmitting={form.isSubmitting} onSubmit={form.submit} />
          </div>
        )}
      </main>
      <LandingFooter homeHref="/" />
    </div>
  );
}
