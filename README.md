# Asia Role Radar

Private, CV-first career intelligence for Japan, South Korea and Hong Kong. The workflow analyses reviewed CV text, proposes evidence-grounded career directions, configures focused market scans, assesses jobs, and preserves saved-role notes across CV versions. Original documents are never stored.

## Runtime configuration

Set `OPENAI_API_KEY` as a server-side secret and select the model with `OPENAI_MODEL` (default `gpt-5-mini`). Optional approved providers use `JOB_PROVIDER`, `JOBS_PROVIDER_URL` and `JOBS_PROVIDER_KEY`. Set `CRON_SECRET` for daily refresh requests. Never expose these values to browser code.

## Local setup

Requirements: Node.js 22.13+ and npm.

```bash
npm install
npm run dev
```

Open the printed local URL. Local preview uses an isolated development identity. Production requires the Sites authenticated-user headers and scopes every row by `oai-authenticated-user-id`.

## Environment variables

- `JOBS_PROVIDER_URL`: HTTPS endpoint for a compliant or licensed jobs provider.
- `JOBS_PROVIDER_KEY`: bearer credential for that provider.
- `CRON_SECRET`: long random bearer secret for `/api/cron/daily`.
- `RADAR_OWNER_USER_ID`: authenticated Sites user ID whose plan is refreshed by the scheduler.

Never add LinkedIn passwords, cookies, session tokens or personal-account credentials.

## Database and migrations

D1 is declared as `DB` in `.openai/hosting.json`. Generate migrations after schema changes with `npm run db:generate`, inspect the SQL under `drizzle/`, then apply it through the hosting platform’s D1 migration workflow. Routes also perform idempotent table initialization for first run.

## Daily scheduler

Schedule an authenticated `POST /api/cron/daily` for `08:00 Asia/Hong_Kong` (00:00 UTC) and send `Authorization: Bearer $CRON_SECRET`. Without an approved provider, the endpoint only refreshes the 15-link search plan and marks it **Ready to scan**. It does not scrape LinkedIn unattended.

## Provider contract

The configured provider receives JSON including `{ lane, market, limit: 50, firstPageOnly: false, maxDescriptions: 25, page, offset, excludeExternalIds, excludeUrls }` and returns `{ jobs: [...] }`. Repeated scans request the next page and exclude jobs already saved in the workspace. The scan has a two-minute soft limit and stops on 401, 403, 429, 999, unexpected markup or provider errors while retaining previously saved results. The default provider is the safe search-plan fallback.

## CV imports

PDF, DOCX and TXT extraction happens in the browser. Limits are 5 MB, 20 PDF pages and 40,000 stored characters. Image-only PDFs are rejected with instructions to paste text. The original file is not uploaded or retained.

## Deployment

Run `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build`, then publish with the existing Sites configuration. Configure private access, D1, scheduler secrets and optional provider values in the hosting environment.

## LinkedIn limitations

No login automation, CAPTCHA bypass, proxy rotation, hidden browser automation or automatic application submission is implemented. Manual links always point to the original LinkedIn listing, and user-initiated provider scans are bounded to the first page per query and nine promising full descriptions.
