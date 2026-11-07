ALTER TABLE public.assignments
  ADD COLUMN ai_tutor_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN tiered_hints_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN monitoring_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN similarity_check_enabled boolean NOT NULL DEFAULT true;
