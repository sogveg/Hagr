-- Migration 016: Add report_type to damage_reports
alter table damage_reports
  add column if not exists report_type text not null default 'damage'
  check (report_type in ('damage', 'cleaning', 'extra_cleaning'));
