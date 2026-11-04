export type HomeView = "Teaching" | "Enrolled";

export const HOME_VIEW_COOKIE = "pace-home-view";

function parse(value: string | null | undefined): HomeView | null {
  if (value === "enrolled") return "Enrolled";
  if (value === "teaching") return "Teaching";
  return null;
}

export function resolveHomeView(param: string | null, saved: string | null | undefined, hasTeaching: boolean, hasEnrolled: boolean): HomeView {
  if (!hasTeaching || !hasEnrolled) return hasEnrolled ? "Enrolled" : "Teaching";
  return parse(param) ?? parse(saved) ?? "Enrolled";
}

export function saveHomeView(view: HomeView) {
  document.cookie = `${HOME_VIEW_COOKIE}=${view.toLowerCase()}; path=/; SameSite=Lax`;
}

export function clearHomeView() {
  document.cookie = `${HOME_VIEW_COOKIE}=; path=/; max-age=0`;
}
