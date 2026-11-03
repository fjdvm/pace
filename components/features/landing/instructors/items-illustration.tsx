import { Pill } from "../shared/pill";
import { IllustrationRow } from "./illustration-row";

export function ItemsIllustration() {
  return (
    <>
      <IllustrationRow icon="icon-code-dark" label="Item 1 · Coding">
        <Pill className="bg-pace-mint text-pace-green-deep">25 pts</Pill>
      </IllustrationRow>
      <IllustrationRow icon="icon-check-green" label="Item 2 · Quiz">
        <Pill className="bg-pace-mint text-pace-green-deep">10 pts</Pill>
      </IllustrationRow>
      <IllustrationRow icon="icon-lock" label="Hidden tests">
        <Pill className="animate-pace-bob bg-pace-sunken text-pace-ink-2">Runs on submit</Pill>
      </IllustrationRow>
    </>
  );
}
