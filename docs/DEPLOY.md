# Deploy guide - cdat.sdet.it

> **Audience:** owner / operator (single-builder).
> **Target:** OVH VPS `54.36.174.173` running nginx-proxy + 42+ containers, fronted by **Cloudflare** (orange cloud).
> **Outcome:** `https://cdat.sdet.it` serves the Astro hybrid site (14 static pages + `/mcp` Streamable HTTP MCP endpoint) over CF → host nginx-proxy → Node container.

---

## Architecture (post-MCP)

```
Internet
   │  HTTPS
   ▼
Cloudflare (orange cloud, CF Origin Cert)
   │  HTTPS pass-through
   ▼
VPS host nginx-proxy (terminates Origin Cert, routes by VIRTUAL_HOST)
   │  HTTP
   ▼
cdat-website Docker container
   │  Node 22 runtime
   ▼
dist/server/entry.mjs  (Astro hybrid)
   ├── /              prerendered HTML from dist/client/
   ├── /docs/*        prerendered HTML
   ├── /examples/*    prerendered HTML
   ├── /og/*.png      prerendered PNG
   ├── /sitemap-*.xml prerendered XML
   ├── /llms.txt      runtime endpoint (could prerender; kept dynamic)
   └── /mcp           runtime SSE/JSON MCP endpoint  ← only true server route
```

**No nginx inside the container** - host nginx-proxy is enough, Node serves static files itself via Astro's adapter.

---

## Required files (in repo)

- `Dockerfile` - multi-stage (Node 22 build → Node 22 runtime). Default for production.
- `Dockerfile.placeholder` - minimal nginx + static placeholder. Optional for "Coming soon" before app is ready.
- `infra/placeholder/index.html` - coming-soon HTML (terminal-dark theme).
- `infra/docker-compose.snippet.yml` - service entry to APPEND to VPS `/srv/docker-compose.yml`.
- `wcag.config.json` - explicit URL list for wcag-toolkit audits (localhost reproducibility).

---

## Step 1 - Cloudflare DNS + Origin Cert (SDE-94)

Done via CF API token (Zone DNS Edit on `sdet.it` zone). See SDE-94 issue body for full curl recipe.

Result on VPS:

- `/etc/ssl/cdat-sdet-it/fullchain.pem` (15-year CF Origin Cert)
- `/etc/ssl/cdat-sdet-it/privkey.pem` (private key, mode 0600, owned by user nginx-proxy reads as)

Verify DNS resolves through CF:

```bash
dig cdat.sdet.it +short
# Expected: CF anycast IPs (e.g. 104.21.x.x, 172.67.x.x), NOT 54.36.174.173 directly
```

---

## Step 2 - Build image locally

```bash
cd ~/dev/darco81/cdat-website
docker build -t cdat-website:latest .
```

The image runs `node ./dist/server/entry.mjs` and listens on `:4399`.

Smoke test the image locally before shipping:

```bash
docker run --rm -p 4399:4399 cdat-website:latest &
DOCKER_PID=$!
sleep 3

curl -I http://localhost:4399/                  # → 200
curl -s http://localhost:4399/mcp | head -5     # → JSON info object
curl -s -X POST http://localhost:4399/mcp \
  -H "content-type: application/json" \
  -H "accept: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0"}}}'

kill $DOCKER_PID
```

---

## Step 3 - Ship image to VPS

```bash
docker save cdat-website:latest | gzip | ssh root@54.36.174.173 'gunzip | docker load'
ssh root@54.36.174.173 'docker images | grep cdat-website'
```

(Once SDE-97 auto-deploy lands, GHA self-hosted runner builds + restarts in-place - no `docker save | ssh` needed.)

---

## Step 4 - Append compose snippet + start

On VPS:

```bash
ssh root@54.36.174.173

# Backup compose first
cp /srv/docker-compose.yml /srv/docker-compose.yml.bak.$(date +%F)

# Append the cdat-website service block (do NOT replace - append)
# Use the snippet from infra/docker-compose.snippet.yml in the repo

# Validate + bring up
docker compose -f /srv/docker-compose.yml config > /dev/null && echo "OK"
docker compose -f /srv/docker-compose.yml up -d cdat-website
docker ps | grep cdat-website
```

---

## Step 5 - Smoke through CF

```bash
curl -I https://cdat.sdet.it
# Expected: HTTP/2 200, server: cloudflare, cf-ray: ...

curl -s https://cdat.sdet.it/llms.txt | head -10
curl -s https://cdat.sdet.it/sitemap-index.xml | head -3
curl -s https://cdat.sdet.it/mcp | head -5

# JSON-RPC initialize through CF
curl -s -X POST https://cdat.sdet.it/mcp \
  -H "content-type: application/json" \
  -H "accept: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"prod-smoke","version":"1.0"}}}'
```

---

## Step 6 - Neighbor regression check

```bash
for host in portfolio.sdet.it brain.sdet.it plausible.sdet.it; do
  echo -n "$host: "
  curl -sI -o /dev/null -w "%{http_code}\n" "https://$host"
done
```

---

## Step 7 - Add MCP endpoint to Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "cdat-pattern": {
      "transport": { "type": "streamable-http", "url": "https://cdat.sdet.it/mcp" }
    }
  }
}
```

Restart Claude Desktop. 5 tools (`list_docs`, `read_doc`, `list_examples`, `read_example`, `search`) should appear in the MCP indicator.

---

## Rollback

```bash
ssh root@54.36.174.173
docker compose -f /srv/docker-compose.yml stop cdat-website
docker compose -f /srv/docker-compose.yml rm -f cdat-website
```

---

## Future: SDE-97 auto-deploy

Once `feat/sde-97` lands, the manual `docker save | ssh` flow is replaced by:

```
git push origin main
  → GHA workflow triggers on self-hosted runner
  → checkout + pnpm install + pnpm build + docker build
  → docker compose up -d --force-recreate cdat-website
  → curl smoke check
  → done in ~3-4 min
```

The DNS + CF Origin Cert + compose entry from Steps 1 + 4 only happen once. After that, `git push origin main`.

---

*Updated 2026-05-03 as part of SDE-92 (MCP endpoint). Replaces nginx-in-container architecture from Sprint 1 since /mcp requires Node runtime.*
