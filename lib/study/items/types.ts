import type { StudyRole } from "../dataset";

export type { StudyRole };
export type Setup = "current" | "pace";

export type Item = { code: string; text: string };
export type ItemGroup = { label: string; items: Item[] };

export type ProfileQuestion = { id: string; label: string; options: string[] };

export type RoleItems = {
  profile: ProfileQuestion[];
  problems: ItemGroup[];
  acceptability: ItemGroup[];
  features: Item[];
};
