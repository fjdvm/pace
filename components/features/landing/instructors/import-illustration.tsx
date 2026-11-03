import { Pill } from "../shared/pill";
import { IllustrationRow } from "./illustration-row";

export function ImportIllustration() {
  return (
    <>
      <IllustrationRow icon="icon-upload" label="Lab_Activity_3.pdf">
        <Pill className="animate-pace-bob bg-pace-lavender-tint text-pace-purple">Reading</Pill>
      </IllustrationRow>
      <IllustrationRow icon="icon-sparkles-purple" label="4 items found">
        <Pill className="bg-pace-mint text-pace-green-deep">Draft</Pill>
      </IllustrationRow>
      <IllustrationRow icon="icon-flag" label="1 item needs a look">
        <Pill className="bg-pace-sun text-pace-ink">Check</Pill>
      </IllustrationRow>
    </>
  );
}
