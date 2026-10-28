# FlowPilot Automation

A responsive, dark studio website built with Next.js App Router, strict TypeScript, Tailwind CSS 4 and small reusable React components. The hero is deliberately quiet; a separate connected-workflow section explains how the three services fit together. All showcased projects are clearly labelled concepts.

## Local development

Use Node.js 22+ and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Visit http://localhost:3000. Empty configuration is supported: missing links are hidden and form submission is explicitly disabled. The form layout remains visible for preview. System fonts avoid downloads, layout shifts and external font requests; bespoke CSS/SVG illustrations avoid image downloads. Most content uses server components; interactive JavaScript is restricted to navigation and the contact form. The homepage uses server rendering to read runtime configuration without passing secrets to the browser.

## Configuration

| Variable            | Purpose                                                                    |
| ------------------- | -------------------------------------------------------------------------- |
| `SITE_URL`          | Actual HTTPS production domain; enables canonical URLs and sitemap entries |
| `N8N_WEBHOOK_URL`   | Server-only HTTPS **production** webhook endpoint                          |
| `N8N_WEBHOOK_TOKEN` | Optional server-only Bearer token; configure matching n8n authentication   |
| `CONTACT_EMAIL`     | Real public email; shown only if valid                                     |
| `WHATSAPP_NUMBER`   | International digits only (7–15 digits), no plus sign or spaces            |
| `LINKEDIN_URL`      | Actual HTTPS LinkedIn profile/company URL                                  |

Never prefix secrets with `NEXT_PUBLIC_`. Restart development after changing environment variables. `.env*` is ignored except the empty `.env.example`. Public contact values are deliberately rendered as links; webhook credentials stay on the server. Never commit real secrets or put them in Sonar properties.

## Contact contract

Browser → same-origin `POST /api/contact` → configured n8n HTTPS webhook. JSON input: `name`, `email`, `service` (`websites`, `automation`, `integrations`, `unsure`), `description`, `submissionId` (UUID v4), and hidden `website` honeypot. The server validates types, size and fields, checks Origin, rejects honeypot entries, imposes a 10-second upstream timeout, and refuses redirects. It forwards the visible fields plus `submissionId`, `submittedAt` (ISO UTC) and `source: flowpilot-website`; it omits the honeypot. No personal data or credentials are logged by application code.

The route returns JSON `{message, errors?}` with 200 on upstream acceptance; 400 invalid input, 403 origin mismatch, 413 oversized payload, 415 unsupported content type, 503 missing configuration and 502 unconfirmed upstream delivery. A 2xx means n8n accepted the request, not that an email was delivered. Missing configuration never simulates success. No automatic retries occur. The button locks during submission and after success. The submission ID survives retries while the form remains mounted; configure durable deduplication in n8n before sending emails or creating CRM records. Without a database this site cannot guarantee exactly-once delivery. Add hosting/WAF rate limits before public launch if needed; in-memory counters are intentionally avoided in serverless environments.

## Checks

```sh
npm run check
npm run test:coverage
npm run build
```

Focused tests cover the validation boundary and mocked webhook success/failure paths. `sonar-project.properties` supplies sources, tests and LCOV configuration. Run coverage first, then your installed SonarScanner using `SONAR_HOST_URL` and `SONAR_TOKEN` supplied securely by CI. For SonarCloud, supply the real organisation/project settings. A Sonar server is not connected and no analysis result is claimed. See AGENTS.md for canonical coding conventions; CODEX.md points contributors to the same policies.

## Deployment (Vercel)

Import this repository into Vercel, select Next.js, and use the default build (`npm run build`). Configure real environment variables in project settings, then deploy. No static export: `/api/contact` needs a server runtime. Other Node-compatible Next.js hosting works using `npm run build` followed by `npm start`. No database or authentication is required.

Before enabling enquiries: activate and authenticate the n8n production workflow, add durable submission-ID deduplication, test an actual submission end to end, and replace the privacy launch information with legal business identity, actual processors, storage locations, retention periods and a real privacy contact. Supply email, social links, WhatsApp and domain where desired. No live integration, analytics, client result, or testimonial is assumed.

## Formatting and build compatibility

Use `npm run format` after editing and `npm run format:check` in CI. Production builds use Next.js’s supported Webpack mode because Turbopack’s CSS worker failed in the development environment. This does not change the hosting or runtime contract.

The initial audit reported five high-severity entries in the development-only ESLint dependency chain (`braces` → `micromatch` → `fast-glob`). No compatible fix was offered; the suggested downgrade would cross Next.js major versions. Do not run `npm audit fix --force` blindly. Recheck the advisory when updating lint tooling; production dependencies are audited separately.

## Colour themes

Light is the default. The navigation includes a keyboard-accessible light/dark switch on desktop and mobile; the privacy page includes the same control. The preference is stored locally under `flowpilot-theme` and restored before first paint. If browser storage is blocked, switching still works for the current page. No theme library or external requests are used. Project previews retain their own illustrative colour palettes in both themes.
