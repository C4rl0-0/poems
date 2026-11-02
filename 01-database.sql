-- Run this entire file in Supabase SQL Editor first.
begin;
create table if not exists public.liham_owners (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.liham_poems (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 120),
  body text not null check (char_length(trim(body)) between 1 and 30000),
  language text not null check (language in ('Tagalog','English')),
  topic text not null default 'Poetry' check (char_length(topic)<=40),
  created_at timestamptz not null default now()
);
create table if not exists public.liham_settings (
  id integer primary key check (id=1),
  copy jsonb not null default '{}'::jsonb check (jsonb_typeof(copy)='object' and octet_length(copy::text)<=200000)
);
alter table public.liham_owners enable row level security;
alter table public.liham_poems enable row level security;
alter table public.liham_settings enable row level security;
revoke all on public.liham_owners,public.liham_poems,public.liham_settings from anon,authenticated;
grant select on public.liham_owners to authenticated;
grant select on public.liham_poems,public.liham_settings to anon,authenticated;
grant insert,update,delete on public.liham_poems to authenticated;
grant insert,update on public.liham_settings to authenticated;
drop policy if exists own_membership on public.liham_owners;
create policy own_membership on public.liham_owners for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists public_read on public.liham_poems;
create policy public_read on public.liham_poems for select to anon,authenticated using (true);
drop policy if exists owner_write on public.liham_poems;
create policy owner_write on public.liham_poems for all to authenticated
using (exists(select 1 from public.liham_owners where user_id=(select auth.uid())))
with check (exists(select 1 from public.liham_owners where user_id=(select auth.uid())));
drop policy if exists public_read on public.liham_settings;
create policy public_read on public.liham_settings for select to anon,authenticated using (true);
drop policy if exists owner_write on public.liham_settings;
create policy owner_write on public.liham_settings for all to authenticated
using (exists(select 1 from public.liham_owners where user_id=(select auth.uid())))
with check (exists(select 1 from public.liham_owners where user_id=(select auth.uid())));
insert into public.liham_settings(id,copy) values (1,'{}') on conflict(id) do nothing;
create or replace function public.liham_import(new_poems jsonb,new_copy jsonb default null)
returns void language plpgsql security invoker set search_path='' as $$
begin
  if not exists(select 1 from public.liham_owners where user_id=(select auth.uid())) then
    raise exception 'Owner access required';
  end if;
  if jsonb_typeof(new_poems) is distinct from 'array' or jsonb_array_length(new_poems)>1000 then
    raise exception 'Invalid poem backup';
  end if;
  insert into public.liham_poems(id,title,body,language,topic)
  select id,title,body,language,coalesce(topic,'Poetry')
  from jsonb_to_recordset(new_poems) as p(id uuid,title text,body text,language text,topic text)
  on conflict(id) do update set title=excluded.title,body=excluded.body,language=excluded.language,topic=excluded.topic;
  if new_copy is not null then
    insert into public.liham_settings(id,copy) values(1,new_copy)
    on conflict(id) do update set copy=excluded.copy;
  end if;
end;
$$;
revoke all on function public.liham_import(jsonb,jsonb) from public,anon;
grant execute on function public.liham_import(jsonb,jsonb) to authenticated;
commit;
