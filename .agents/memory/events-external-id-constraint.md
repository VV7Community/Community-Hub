---
name: events external_id unique constraint
description: Why the events table needs a unique constraint on external_id and what breaks if it is missing.
---

The `events` table is synced from an external VectorVest events feed using `ON CONFLICT (external_id) DO UPDATE`. That clause requires a matching unique or exclusion constraint on `external_id`. Without it, the startup sync throws `there is no unique or exclusion constraint matching the ON CONFLICT specification` and no events are imported.

**Why:** The sync relies on `external_id` as the stable identity for events coming from the external feed, so it can upsert rather than duplicate rows.

**How to apply:** If the schema changes or the table is recreated, keep the unique constraint on `external_id` (or use a composite key that includes it). Do not rely on application-level uniqueness checks.
