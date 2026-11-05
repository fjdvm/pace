import { landingFontClasses } from "../landing-fonts";
import { SparkBuddy } from "./spark-buddy";

export function SparkBuddyDemo() {
  return (
    <main
      className={`${landingFontClasses} pace-landing flex min-h-screen items-center justify-center bg-pace-canvas`}
    >
      <SparkBuddy className="w-[230px]" />
    </main>
  );
}
