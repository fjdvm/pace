import { CtaPhoto } from "./cta-photo";
import { CtaCopy } from "./cta-copy";
import { CtaSpark } from "./cta-spark";

export function CtaSection() {
  return (
    <section
      id="get-started"
      className="relative flex h-[600px] items-center justify-center overflow-clip bg-[#3a3a3a]"
    >
      <CtaPhoto />
      <CtaCopy />
      <CtaSpark />
    </section>
  );
}
