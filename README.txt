MGA LIHAM | BY CARLO
Vercel + Supabase edition

Your complete Supabase URL and publishable key are in config.js.
The publishable key includes its final 4. A read-only connection check reached
the database API. The liham_poems table was not found. Run 01-database.sql next.
No Node server, npm installation, or Vercel environment variables are required.

1. CREATE THE DATABASE
Extract this ZIP. Open 01-database.sql in a text editor. Copy the entire file.
Open your Supabase project > SQL Editor > New query. Paste and click Run.
The script creates empty poem storage, website text storage, and access rules.
No sample poems are inserted. Re-running this setup preserves existing poems.

2. CREATE YOUR OWNER LOGIN
Supabase > Authentication > Users > Add user > Create new user.
Enter your own email and choose your website password. Keep the password private.
Use the dashboard's email-confirmation option if shown, or verify your email.
Open the created user and copy the UID.
Open 02-owner.sql. Replace PASTE-YOUR-USER-UID-HERE with your copied UID.
Keep the single quotes around the UID. Paste the edited file into a new SQL query
and click Run. Only accounts listed in liham_owners receive editing permission.
The website has no public signup form. Disable public signup in Supabase Auth
configuration if you want to prevent registration through other clients.
Never grant public write access or disable Row Level Security.

3. UPLOAD TO GITHUB
Open your existing poems repository. Replace the old website files with these
extracted files. Place index.html, config.js, database.js, and vercel.json at the
repository root. Include .vercelignore if your upload interface shows hidden files.
Remove obsolete server.cjs and seed.cjs. Do not upload the ZIP as website source.
The SQL setup files contain no passwords and are for manual dashboard setup.

4. CONFIGURE VERCEL
Import your GitHub repository, or open your already connected Vercel project.
Use Framework Preset: Other. Root Directory: the repository root.
Leave Build Command empty and disable any old build-command override.
Leave Install Command empty. Output Directory: .
The included vercel.json also specifies the static output directory.
No environment variables are needed because this version uses config.js.
Deploy. For an existing project, push your changes and check the new deployment.
Use the stable production domain from your Vercel project's Domains section.

5. SIGN IN
Open the production website. Click Owner login. Enter the email and password
from step 2. Write a poem and Edit website text appear after owner verification.
Visitors use the same URL and read without signing in. They cannot publish,
change text, or delete poems. Database access rules enforce these restrictions.
The login link is visible to visitors, but editing controls require owner access.
There is no separate /admin route.

6. WRITE AND EDIT
Click Write a poem. Enter the title, choose Tagalog or English, enter a theme,
and add the poem with your preferred line breaks. Click Save poem.
The published poem appears in a styled card automatically.
Open a poem to edit or delete it. All saved poems are public. Drafts are not
included in this version. Use Edit website text for the public wording fields.
Export downloads a JSON backup. Import merges poems by ID and restores website
text from a compatible backup. Import does not erase poems absent from the backup.
Saved-heart favorites belong to each visitor's browser, not the shared database.

7. CHECK AS A VISITOR
Open the production domain in an incognito window or on another device.
Confirm your published poem appears and editing controls are absent.
Edit a poem as owner, refresh the visitor window, and confirm the updated text.
Sign out when finished. Owner sessions are stored in the current browser tab.

PREVIEW
Open index.html in a browser to preview the design. Online poems and owner login
need the database and owner steps above. A deployed HTTPS site is preferred for
clipboard and other browser features. The separate ChatGPT-hosted design preview
is unchanged and does not automatically receive this external deployment package.

TROUBLESHOOTING
Table missing / schema cache error: Run 01-database.sql in the correct project.
Invalid API key: Check the full publishable key in config.js.
Invalid login credentials: Check your owner email, password, and confirmation.
Not the website owner: Run 02-owner.sql using the matching user's UID.
Session expired: Sign in again.
Permission denied: Verify owner registration and the database setup policies.
Vercel build error: Use Other and remove old framework/build overrides.
Old page still showing: Check the new deployment succeeded and use its production domain.
This package does not send password-reset emails. Manage your owner account
through Supabase. If using invitation or recovery links, configure their Site URL
and complete the relevant account flow before attempting password sign-in.

Verification: JavaScript syntax and mocked API workflow checks were run.
Live owner login and database policies require your Supabase setup and were not
tested with your private account. No owner password is included in this ZIP.
