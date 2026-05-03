# Deploy guide - cdat.sdet.it

> **Audience:** owner / operator (single-builder).
> **Target:** OVH VPS `54.36.174.173` running nginx-proxy + acme-companion + 42+ containers, fronted by **Cloudflare** (orange cloud).
> **Outcome:** `https://cdat.sdet.it` serves the Astro hybrid site (14 static pages + `/mcp` Streamable HTTP MCP endpoint) over CF → host nginx-proxy → Node container.

---

## Architecture

```
Internet
   │  HTTPS
   ▼
Cloudflare (orange cloud, Full-strict, DNS proxied)
   │  HTTPS pass-through
   ▼
VPS host nginx-proxy (terminates LE cert via acme-companion)
   │  HTTP
   ▼
cdat-website Docker container (Node 22 runtime)
   │
   ▼
dist/server/entry.mjs  (Astro hybrid)
   ├── /              prerendered HTML from dist/client/
   ├── /docs/*        prerendered HTML
   ├── /examples/*    prerendered HTML
   ├── /og/*.png      prerendered PNG
   ├── /sitemap-*.xml prerendered XML
   ├── /llms.txt      runtime endpoint
   └── /mcp           runtime MCP endpoint  ← only true server route
```

**No nginx inside the container** - Astro Node adapter serves static files directly. Host nginx-proxy + acme-companion handle TLS at the edge of the VPS.

---

## Files in repo

- `Dockerfile` - multi-stage Node 22 build → Node 22 runtime
- `Dockerfile.placeholder` - minimal nginx static "Coming soon" (optional pre-launch)
- `docker-compose.yml` - service definition (gets installed to `/opt/docker/apps/cdat-website/` on the VPS by GHA runner)
- `.github/workflows/deploy.yml` - push-to-deploy automation (needs SDE-96 self-hosted runner registered first)
- `.github/workflows/e2e.yml` - Playwright matrix test (needs same runner)
- `infra/placeholder/index.html` - coming-soon HTML (terminal-dark theme), used by Dockerfile.placeholder
- `wcag.config.json` - explicit URL list for wcag-toolkit audits (localhost reproducibility)

---

## Step 1 - Cloudflare DNS (DONE 2026-05-03 via API)

`cdat.sdet.it` is a proxied A-record pointing to `54.36.174.173`. Verify:

```bash
dig @1.1.1.1 cdat.sdet.it +short
# Expected: CF anycast IPs (e.g. 188.114.96.x, 188.114.97.x), NOT 54.36.174.173 directly
```

**Owner-only verify (CF dashboard):**

1. SSL/TLS → Overview → mode = **Full (strict)** (default for the zone, should be inherited)
2. SSL/TLS → Edge Certificates → Always Use HTTPS = ON
3. Caching → Configuration → Cache Rules → ensure no rule blocks `/.well-known/acme-challenge/*` (default passes through, good)

---

## Step 2 - First deploy (manual, one-time bootstrap before runner exists)

Until SDE-96 (self-hosted runner) is done, the very first container deploy is manual.

### 2a. Build image locally

```bash
cd ~/dev/darco81/cdat-website
docker build -t cdat-website:latest .
```

### 2b. Local smoke

```bash
docker run --rm --name cdat-smoke -p 4399:4399 cdat-website:latest &
sleep 3
curl -I http://localhost:4399/                  # → 200
curl -s http://localhost:4399/mcp | head -5     # → JSON info
docker stop cdat-smoke
```

### 2c. Ship to VPS

A pre-saved tarball is at `/tmp/cdat-ship/cdat-website-latest.tar.gz` (108MB, gzipped). To ship:

```bash
scp /tmp/cdat-ship/cdat-website-latest.tar.gz root@54.36.174.173:/tmp/
ssh root@54.36.174.173 'gunzip -c /tmp/cdat-website-latest.tar.gz | docker load && rm /tmp/cdat-website-latest.tar.gz'
```

OR build fresh on VPS later (recommended for reproducibility - the runner does this automatically).

### 2d. Install compose to /opt/docker/apps/cdat-website

```bash
ssh root@54.36.174.173

mkdir -p /opt/docker/apps/cdat-website
cat > /opt/docker/apps/cdat-website/docker-compose.yml << 'EOF'
services:
  cdat-website:
    build:
      context: .
      dockerfile: Dockerfile
    image: cdat-website:latest
    container_name: cdat-website
    restart: unless-stopped
    networks:
      - nginx-proxy-network
    environment:
      VIRTUAL_HOST: cdat.sdet.it
      VIRTUAL_PORT: '4399'
      LETSENCRYPT_HOST: cdat.sdet.it
      LETSENCRYPT_EMAIL: d.kowalski@crehler.com
      NODE_ENV: production
      HOST: 0.0.0.0
      PORT: '4399'
    mem_limit: 384m
    mem_reservation: 96m
    cpu_shares: 128

networks:
  nginx-proxy-network:
    external: true
EOF

docker compose -f /opt/docker/apps/cdat-website/docker-compose.yml config > /dev/null && echo "OK"
```

### 2e. Bring up

```bash
docker compose -f /opt/docker/apps/cdat-website/docker-compose.yml up -d
docker ps | grep cdat-website
```

### 2f. Wait for Let's Encrypt cert (60-180s, acme-companion does this)

```bash
docker logs acme-companion --tail 30 | grep -i cdat
# Expect: "creating/renewing certificate for cdat.sdet.it"
# Followed by: "Reload nginx"
```

### 2g. Smoke

```bash
# Internal (on VPS)
curl -I http://127.0.0.1:4399/

# Public via CF
curl -I https://cdat.sdet.it
# Expected: HTTP/2 200, server: cloudflare, cf-ray: ...

# MCP
curl -s -X POST https://cdat.sdet.it/mcp \
  -H "content-type: application/json" \
  -H "accept: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | head -c 200
```

### 2h. Neighbor regression

```bash
for host in portfolio.sdet.it brain.sdet.it plausible.sdet.it; do
  echo -n "$host: "
  curl -sI -o /dev/null -w "%{http_code}\n" "https://$host"
done
# Expected: each → 200 (or 301/302)
```

---

## Step 3 - Self-hosted GHA runner (SDE-96)

Match portfolio-v2 pattern. Per-app runner, label `cdat-website`.

```bash
ssh root@54.36.174.173

mkdir -p /opt/gha-runners/cdat-website
cd /opt/gha-runners/cdat-website

# Get token from GitHub: Settings → Actions → Runners → New self-hosted runner
# (Pick Linux x64, runner version 2.x.x)
curl -o actions-runner-linux-x64.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.328.0/actions-runner-linux-x64-2.328.0.tar.gz
tar xzf actions-runner-linux-x64.tar.gz
rm actions-runner-linux-x64.tar.gz

# Configure
./config.sh \
  --url https://github.com/darco81/cdat-website \
  --token <ONE-TIME-TOKEN-FROM-GITHUB> \
  --labels self-hosted,Linux,X64,cdat-website \
  --name vps-cdat-website-runner-1 \
  --work _work \
  --runasservice \
  --unattended

# Install + start systemd service
sudo ./svc.sh install
sudo ./svc.sh start

# Verify in GitHub UI: Settings → Actions → Runners → status=Idle
```

After the runner is online, `e2e.yml` and `deploy.yml` workflows will execute on it.

---

## Step 4 - Auto-deploy via GHA (SDE-97)

After Step 3, `git push origin main` triggers `.github/workflows/deploy.yml`:

1. Checkout
2. pnpm install + build (sanity)
3. `docker compose build cdat-website` (uses repo Dockerfile)
4. `install` compose to `/opt/docker/apps/cdat-website/docker-compose.yml`
5. `docker compose up -d --force-recreate`
6. Smoke: container :4399 → MCP `/mcp` tools/list → public HTTPS via CF
7. Prune old images >168h

Total: ~3-4 min per deploy.

---

## Rollback

```bash
ssh root@54.36.174.173
docker compose -f /opt/docker/apps/cdat-website/docker-compose.yml stop cdat-website
docker compose -f /opt/docker/apps/cdat-website/docker-compose.yml rm -f cdat-website
# Optional: bring back previous image (Docker keeps untagged copies for 168h)
docker images | grep cdat-website
docker tag <previous-sha> cdat-website:latest
docker compose ... up -d
```

---

## Add MCP to your Claude Desktop

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

Restart Claude Desktop. 5 tools (`list_docs`, `read_doc`, `list_examples`, `read_example`, `search`) should appear.

---

## Resource budget

```bash
ssh root@54.36.174.173 'docker stats --no-stream cdat-website'
# Expected steady state: MEM USAGE < 200MB, CPU < 5%
```

---

*Updated 2026-05-03. CF DNS done via API. First-deploy is owner-manual until SDE-96 runner registered, after which `git push origin main` auto-deploys.*
