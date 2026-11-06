import Link from "next/link";
import { button3dClass } from "../shared/button-3d";

export function ClosedScreen() {
  return (
    <div className="flex flex-col items-center pt-4">
      <Link href="/" className={button3dClass}>
        Back to home
      </Link>
    </div>
  );
}
