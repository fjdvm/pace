import { LabPhoto } from "./lab-photo";

export function LabPhotoBand() {
  return (
    <section
      data-band="lab-photo"
      className="flex w-full flex-col items-center gap-6 bg-lp-canvas px-5 py-14 xl:px-[165px] xl:py-[100px]"
    >
      <LabPhoto />
      <p className="max-w-[440px] text-center font-lp-sans text-base leading-[25px] text-[#5f5f5f]">
        Importing an activity from a PDF or a photo is in development and is not part of the evaluation.
      </p>
    </section>
  );
}
