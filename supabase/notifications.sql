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

create table if not exists public.supply_requests (
  id text primary key,
  request_number text not null unique,
  client_company text not null,
  client_contact text not null,
  email text not null,
  phone text not null,
  items jsonb not null default '[]'::jsonb,
  target_delivery_date date not null,
  general_notes text,
  status text not null default 'pending' check (status in ('pending', 'quoted', 'accepted', 'declined')),
  created_at date not null default current_date,
  quote_line_items jsonb,
  total_quote_amount numeric,
  freight_terms text,
  admin_notes text,
  quoted_at date
);

alter table public.supply_requests enable row level security;

create policy "Buyers can read their own requests"
  on public.supply_requests for select
  to authenticated
  using (
    lower(email) = lower(auth.jwt() ->> 'email')
    or lower(auth.jwt() ->> 'email') = 'lankotventures01@gmail.com'
  );

create policy "Buyers can create their own requests"
  on public.supply_requests for insert
  to authenticated
  with check (lower(email) = lower(auth.jwt() ->> 'email'));

create policy "Admins can update requests"
  on public.supply_requests for update
  to authenticated
  using (lower(auth.jwt() ->> 'email') = 'lankotventures01@gmail.com')
  with check (lower(auth.jwt() ->> 'email') = 'lankotventures01@gmail.com');

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
