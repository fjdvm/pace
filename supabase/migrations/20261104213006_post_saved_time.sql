ALTER TABLE assignments ADD COLUMN updated_at timestamptz(3) NOT NULL DEFAULT now();
