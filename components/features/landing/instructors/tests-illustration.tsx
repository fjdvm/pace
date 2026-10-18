import { Pill } from "../shared/pill";
import { IllustrationRow } from "./illustration-row";

export function TestsIllustration() {
  return (
    <>
      <IllustrationRow icon="icon-check-green" label="Test 1 · visible">
        <Pill className="bg-pace-mint text-pace-green-deep">Passed</Pill>
      </IllustrationRow>
      <IllustrationRow icon="icon-check-green" label="Test 2 · visible">
        <Pill className="bg-pace-mint text-pace-green-deep">Passed</Pill>
      </IllustrationRow>
      <IllustrationRow icon="icon-lock" label="2 hidden tests">
        <Pill className="animate-pace-bob bg-pace-sunken text-pace-ink-2">Runs on submit</Pill>
      </IllustrationRow>
    </>
  );
}
