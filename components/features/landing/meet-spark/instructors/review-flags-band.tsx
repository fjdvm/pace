import { BandShell } from "../bands/band-shell";

export function ReviewFlagsBand() {
  return (
    <BandShell
      id="review-flags"
      tone="white"
      title={["Review activity flags", "and AI summaries"]}
      body="Each submission arrives with its test results already run, an activity flag with a timeline, and a short AI-written summary that suggests one next step."
      link="Problem 3 in the study →"
    />
  );
}
