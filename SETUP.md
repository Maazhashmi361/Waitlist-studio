# Waitlist Studio: Cloudflare setup (phone friendly)

## 1. GitHub
Create a new repo. In it, use Add file > Create new file, and type the full path as the file name so GitHub makes the folders. Paste each file's content:
- index.html
- schema.sql
- functions/api/generate.js
- functions/api/signup.js
- functions/api/signups.js

## 2. Cloudflare Pages
Workers & Pages > Create > Pages > Connect to Git > pick the repo.
Framework: None. Build command: leave empty. Output directory: /  (or leave empty). Deploy.

## 3. Database (D1)
Storage & Databases > D1 > Create database, name it waitlist-db.
Open its Console tab, paste everything from schema.sql, run it.

## 4. Connect everything
Pages project > Settings. Look for Bindings (Production):
- Add D1 database, variable name DB, choose waitlist-db
- Add Workers AI, variable name AI
Then Variables and secrets > add a secret named ADMIN_KEY with a long random value only you know.
Go to Deployments and redeploy so the bindings apply.

## 5. Test
Open your .pages.dev link, generate a page, download it, open the download, sign up with a test email.
See signups: yourlink/api/signups?key=YOUR_ADMIN_KEY&slug=PAGE_ID
(PAGE_ID is shown next to "Your page" in the tool.)
Dashboard names can look slightly different in Cloudflare; match by meaning.
