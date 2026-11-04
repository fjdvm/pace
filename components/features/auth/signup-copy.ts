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
    headline: "Code, test, and get unstuck in one place.",
    description: "Join your class with the code from your instructor. It takes about a minute.",
    title: "Create your account",
    subtitle: "First, tell us how you’ll use PACE.",
    submit: "Create account",
    loading: "Creating account...",
    legalAction: "creating an account",
  },
  instructor: {
    headline: "Set the assignments. Decide how much help students get.",
    description: "Create classes, add visible and hidden tests, and choose how many hearts each student gets.",
    title: "Create your account",
    subtitle: "Create your first Class after signing in.",
    submit: "Create account",
    loading: "Creating account...",
    legalAction: "creating an account",
  },
};
