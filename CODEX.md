# FlowPilot contributor guide

Read AGENTS.md and README.md before changing the project. AGENTS.md is the canonical coding policy.
Configuration: src/lib/config.ts. Content: src/lib/content.ts. Validation: src/lib/contact.ts.
The form posts to our same-origin route; only that server route may contact n8n.
External services remain unconnected until real configuration is supplied.
