-- First create your user in Authentication > Users > Add user > Create new user.
-- Enter your email and a password. Confirm the email through the dashboard
-- option when available, or complete email verification.
-- Copy the user's UID. Replace PASTE-YOUR-USER-UID-HERE below with that UID.
-- Run this file in SQL Editor. Never put your password in SQL.
insert into public.liham_owners(user_id)
values ('PASTE-YOUR-USER-UID-HERE'::uuid)
on conflict(user_id) do nothing;
