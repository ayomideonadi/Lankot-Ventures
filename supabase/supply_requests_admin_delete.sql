-- Allow admins to permanently remove procurement requests.
-- Run this in the Supabase SQL editor if requests reappear after Remove Request.

grant select, insert, update, delete on table public.supply_requests to authenticated;

drop policy if exists "Admins can delete requests" on public.supply_requests;
create policy "Admins can delete requests"
  on public.supply_requests for delete
  to authenticated
  using (lower(auth.jwt() ->> 'email') = 'lankotventures01@gmail.com');
