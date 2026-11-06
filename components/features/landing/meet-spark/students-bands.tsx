import { SeparateToolsBand } from "./bands/separate-tools-band";
import { UnguidedAiBand } from "./bands/unguided-ai-band";
import { HeartsBand } from "./bands/hearts-band";
import { MonitoringBand } from "./bands/monitoring-band";

export function StudentsBands() {
  return (
    <>
      <SeparateToolsBand />
      <UnguidedAiBand />
      <HeartsBand />
      <MonitoringBand />
    </>
  );
}
