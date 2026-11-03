import type { AuthRole } from "./role-selector";

interface SignupCopy {
  headline: string;
  description: string;
  title: string;
  subtitle: string;
  submit: string;
  loading: string;
  legalAction: string;
}

export const SIGNUP_COPY: Record<AuthRole, SignupCopy> = {
  student: {
    headline: "Code, test, and submit in one place.",
    description: "Join your class with the code from your instructor. While you work, PACE records typing, pasting, and tab switches so your instructor can see how your code was made.",
    title: "Create your account",
    subtitle: "First, tell us how you’ll use PACE.",
    submit: "Create account",
    loading: "Creating account...",
    legalAction: "creating an account",
  },
  instructor: {
    headline: "Build the activities. Decide how much help students get.",
    description: "Create classes and activities, add visible and hidden tests, choose how many hearts each student gets, and see how each submission was written.",
    title: "Request instructor access",
    subtitle: "An administrator checks every instructor account first.",
    submit: "Request access",
    loading: "Requesting access...",
    legalAction: "requesting access",
  },
};
