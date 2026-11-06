#!/usr/bin/env bash
set -u
: "${DATABASE_URL:?DATABASE_URL must point at an empty, disposable database}"

for role in anon authenticated service_role; do
  psql "$DATABASE_URL" -q -c "DO \$\$ BEGIN CREATE ROLE $role NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END \$\$;"
done

psql "$DATABASE_URL" -q -f test/baseline.sql >/dev/null 2>&1
for file in supabase/migrations/*.sql; do
  psql "$DATABASE_URL" -q -f "$file" >/dev/null 2>&1
done
