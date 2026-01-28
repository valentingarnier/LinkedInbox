-- Message templates table for storing clustered opener patterns
create table "public"."message_templates" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references auth.users(id) on delete cascade,
  "cluster_id" text not null,
  "label" text not null,
  "description" text,
  "pattern_example" text,
  "conversation_count" integer not null default 0,
  "response_rate" real,
  "interest_rate" real,
  "ghost_rate" real,
  "avg_engagement" real,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  unique ("user_id", "cluster_id")
);

-- Index for fast lookups
create index "message_templates_user_id_idx" on "public"."message_templates" ("user_id");

-- RLS policies
alter table "public"."message_templates" enable row level security;

create policy "Users can view own templates"
  on "public"."message_templates" for select
  using (auth.uid() = user_id);

create policy "Users can insert own templates"
  on "public"."message_templates" for insert
  with check (auth.uid() = user_id);

create policy "Users can update own templates"
  on "public"."message_templates" for update
  using (auth.uid() = user_id);

create policy "Users can delete own templates"
  on "public"."message_templates" for delete
  using (auth.uid() = user_id);

-- Add template_cluster_id to conversations table to link conversations to templates
alter table "public"."conversations" add column "template_cluster_id" text null;
