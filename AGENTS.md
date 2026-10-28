# Engineering conventions

- Use strict TypeScript, App Router, server components by default, and small focused modules.
- Keep shared values in src/lib; do not duplicate service identifiers or validation rules.
- Never expose webhook URLs, tokens, or credentials in client code. Keep .env files untracked.
- Validate at the server boundary. Do not log personal contact data or secrets.
- Use semantic HTML, visible focus, accessible labels, and reduced-motion support.
- No fake testimonials, customer logos, results, or connected integration claims.
- Run npm run check and npm run build before handoff. Run coverage before Sonar analysis.
- Prefer minimal dependencies. Explain significant architectural choices in README.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
