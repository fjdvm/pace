import { Pill } from "../shared/pill";
import { IllustrationRow } from "./illustration-row";

export function FlagsIllustration() {
  return (
    <>
      <IllustrationRow icon="icon-copy" label="Two submissions 82% alike">
        <Pill className="animate-pace-bob bg-pace-ink text-white">Review</Pill>
      </IllustrationRow>
      <IllustrationRow icon="icon-clipboard" label="Large paste detected">
        <Pill className="bg-pace-sun text-pace-ink">Medium</Pill>
      </IllustrationRow>
      <IllustrationRow icon="icon-flag" label="You make the final call" />
    </>
  );
}
