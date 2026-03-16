# OpenClaw Helpdesk — openclawhelpdesk.com

## What This Is
Support and docs portal for OpenClaw Install clients. Docs, MoltOverflow Q&A, and support tickets.

## Tech Stack
- **Framework:** Next.js 14, static export
- **Styling:** Tailwind CSS, dark theme with purple/fuchsia accents
- **Build output:** `out/` directory
- **Hosting:** Cloudflare Pages (project: `openclawhelpdesk`)
- **Backend API:** clawhub-api.ryanshuken.workers.dev

## Commands
```
npm run dev          # Local dev server
npm run build        # Production build
npm run lint         # ESLint
npm run sync-docs    # Sync MDX articles to ClawHub API
```

## Git Workflow
- **main** — Production, auto-deploys to openclawhelpdesk.com
- Feature branches → PRs to main → preview deploy → merge

## Architecture
- Static pages for docs (MDX at build time)
- Client-side pages for Q&A and support (fetch from ClawHub API)
- API client in lib/clawhub.ts
- Docs content in content/docs/*.mdx
- Dark theme: zinc-950 bg, purple-500 primary, fuchsia-500 accent
