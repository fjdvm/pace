import { IllustrationRow } from "./illustration-row";
import { Stepper } from "./stepper";

export function HeartsIllustration() {
  return (
    <>
      <IllustrationRow icon="heart-red-medium" label="Hearts per student">
        <Stepper value="5" />
      </IllustrationRow>
      <IllustrationRow icon="icon-clock-red-medium" label="One heart returns every">
        <Stepper value="30 min" />
      </IllustrationRow>
    </>
  );
}
