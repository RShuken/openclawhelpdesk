# OpenClaw Helpdesk

Client-facing website for tmate remote support setup.

**Live:** https://www.openclawhelpdesk.com

## Development

```bash
# Local preview
python3 -m http.server 8000
# Then open http://localhost:8000
```

## Deployment

Deployed via Cloudflare Pages:
- **Production:** `main` branch → www.openclawhelpdesk.com
- **Preview:** `dev` branch → dev.openclawhelpdesk.com

### To deploy changes:

1. Make changes on `dev` branch
2. Test at preview URL
3. Merge to `main` when ready

```bash
# Quick deploy to dev
git checkout dev
git add .
git commit -m "Update"
git push

# Promote to production
git checkout main
git merge dev
git push
```

## Structure

```
├── index.html    # Main setup guide
├── faq.html      # FAQ page
└── README.md     # This file
```
