import { CreateClassBand } from "./instructors/create-class-band";
import { ChatLogBand } from "./instructors/chat-log-band";
import { SetHeartsBand } from "./instructors/set-hearts-band";
import { ReviewFlagsBand } from "./instructors/review-flags-band";
import { LabPhotoBand } from "./instructors/lab-photo-band";

export function InstructorsBands() {
  return (
    <>
      <CreateClassBand />
      <ChatLogBand />
      <SetHeartsBand />
      <ReviewFlagsBand />
      <LabPhotoBand />
    </>
  );
}
