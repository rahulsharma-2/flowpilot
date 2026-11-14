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

| Variable                          | Purpose                                                                    |
| --------------------------------- | -------------------------------------------------------------------------- |
| `SITE_URL`                        | Actual HTTPS production domain; enables canonical URLs and sitemap entries |
| `WHATSAPP_CLOUD_ACCESS_TOKEN`     | Server-only Meta WhatsApp Cloud API access token                           |
| `WHATSAPP_CLOUD_PHONE_NUMBER_ID`  | Numeric Meta sender phone-number ID, not the visible phone number          |
| `WHATSAPP_NOTIFICATION_RECIPIENT` | Alert recipient in international digits, without `+` or spaces             |
| `WHATSAPP_TEMPLATE_NAME`          | Approved Meta template name, for example `new_flowpilot_enquiry`           |
| `WHATSAPP_TEMPLATE_LANGUAGE`      | Approved template language; defaults to `en_US`                            |
| `WHATSAPP_GRAPH_API_VERSION`      | Meta Graph API version; defaults to `v27.0`                                |
| `CONTACT_EMAIL`                   | Real public email; shown only if valid                                     |
| `WHATSAPP_NUMBER`                 | Public click-to-chat number in international digits                        |
| `LINKEDIN_URL`                    | Actual HTTPS LinkedIn profile/company URL                                  |

Never prefix secrets with `NEXT_PUBLIC_`. Restart development after changing environment variables. `.env*` is ignored except the empty `.env.example`. Public contact values are deliberately rendered as links; WhatsApp Cloud credentials stay on the server. Never commit real secrets or put them in Sonar properties.

## Contact contract

Browser → same-origin `POST /api/contact` → Meta WhatsApp Cloud API. JSON input: `name`, `email`, `service` (`websites`, `automation`, `integrations`, `unsure`), `description`, `submissionId` (UUID v4), and hidden `website` honeypot. The server validates types, size and fields, checks Origin, rejects honeypot entries, imposes a 10-second upstream timeout, and refuses redirects. It maps the visible fields to four approved template parameters; descriptions are whitespace-normalised and capped at 600 characters so the notification remains deliverable. The honeypot and submission ID are never sent to Meta. No personal data or credentials are logged by application code.

The route returns JSON `{message, errors?}` with 200 when Meta accepts the message request; 400 invalid input, 403 origin mismatch, 413 oversized payload, 415 unsupported content type, 503 missing/invalid configuration and 502 unconfirmed API acceptance. API acceptance does not guarantee final device delivery; delivery-status webhooks are not part of this first version. Missing configuration never simulates success. No automatic retries occur. The button locks during submission and after success. The submission ID survives client retries while the form remains mounted, but without durable storage the site cannot guarantee exactly-once delivery. Add hosting/WAF rate limits before a broader launch; in-memory counters are intentionally avoided in serverless environments.

The approved template must contain four body variables in this order: lead name, email, service and project description. A suitable template body is:

```text
New FlowPilot enquiry

Name: {{1}}
Email: {{2}}
Service: {{3}}
Project: {{4}}
```

## Checks

```sh
npm run check
npm run test:coverage
npm run build
```

Focused tests cover the validation boundary and mocked WhatsApp API success/failure paths. `sonar-project.properties` supplies sources, tests and LCOV configuration. Run coverage first, then your installed SonarScanner using `SONAR_HOST_URL` and `SONAR_TOKEN` supplied securely by CI. For SonarCloud, supply the real organisation/project settings. A Sonar server is not connected and no analysis result is claimed. See AGENTS.md for canonical coding conventions; CODEX.md points contributors to the same policies.

## Deployment (Vercel)

Import this repository into Vercel, select Next.js, and use the default build (`npm run build`). Configure real environment variables in project settings, then deploy. No static export: `/api/contact` needs a server runtime. Other Node-compatible Next.js hosting works using `npm run build` followed by `npm start`. No database or authentication is required.

Before enabling enquiries: verify the recipient, approve the exact four-variable WhatsApp utility template, configure a long-lived server-side access token and phone-number ID, test an actual submission end to end, and replace the privacy launch information with the legal business identity, actual processors, retention periods and a real privacy contact. Supply email, social links, WhatsApp and domain where desired. No analytics, client result, or testimonial is assumed.

## Formatting and build compatibility

Use `npm run format` after editing and `npm run format:check` in CI. Production builds use Next.js’s supported Webpack mode because Turbopack’s CSS worker failed in the development environment. This does not change the hosting or runtime contract.

The initial audit reported five high-severity entries in the development-only ESLint dependency chain (`braces` → `micromatch` → `fast-glob`). No compatible fix was offered; the suggested downgrade would cross Next.js major versions. Do not run `npm audit fix --force` blindly. Recheck the advisory when updating lint tooling; production dependencies are audited separately.

## Colour themes

Light is the default. The navigation includes a keyboard-accessible light/dark switch on desktop and mobile; the privacy page includes the same control. The preference is stored locally under `flowpilot-theme` and restored before first paint. If browser storage is blocked, switching still works for the current page. No theme library or external requests are used. Project previews retain their own illustrative colour palettes in both themes.
