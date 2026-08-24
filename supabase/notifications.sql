create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_email text not null,
  type text not null check (type in ('order_created', 'order_status')),
  title text not null,
  message text not null,
  order_id text,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_recipient_created_idx
  on public.notifications (lower(recipient_email), created_at desc);

alter table public.notifications enable row level security;

create policy "Users can read their notifications"
  on public.notifications for select
  using (lower(recipient_email) = lower(auth.jwt() ->> 'email'));

create policy "Authenticated users can create notifications"
  on public.notifications for insert
  to authenticated
  with check (true);

create policy "Users can mark their notifications read"
  on public.notifications for update
  using (lower(recipient_email) = lower(auth.jwt() ->> 'email'))
  with check (lower(recipient_email) = lower(auth.jwt() ->> 'email'));

-- Enable Realtime for live in-app updates.
alter publication supabase_realtime add table public.notifications;
