/**
 * Generates public/og-image.png from /og built page (1200x630).
 * Run after `astro build` — expects dist/ to exist.
 *
 * Usage: node scripts/generate-og-image.mjs
 */

import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile, copyFile, mkdir } from 'fs/promises';
import { resolve as pathResolve, extname, dirname } from 'path';
import { existsSync } from 'fs';

const DIST_DIR = pathResolve(process.cwd(), 'dist');
const PUBLIC_DIR = pathResolve(process.cwd(), 'public');
const PORT = 4175;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      if (!req.url) { res.writeHead(400); res.end(); return; }
      let urlPath = req.url.split('?')[0];
      if (urlPath.endsWith('/')) urlPath += 'index.html';
      else if (!extname(urlPath)) urlPath += '/index.html';

      const filePath = pathResolve(DIST_DIR, '.' + urlPath);
      const ext = extname(filePath);
      try {
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
        res.end(data);
      } catch {
        res.writeHead(404); res.end('Not found');
      }
    });
    server.listen(PORT, () => {
      console.log(`Static server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    console.error('dist/ not found — run `npm run build` first');
    process.exit(1);
  }

  const server = await startServer();
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    await page.goto(`http://localhost:${PORT}/og`, { waitUntil: 'networkidle' });
    // Allow web fonts a beat to settle
    await page.waitForTimeout(300);

    if (!existsSync(PUBLIC_DIR)) await mkdir(PUBLIC_DIR, { recursive: true });
    const publicTarget = pathResolve(PUBLIC_DIR, 'og-image.png');
    const distTarget = pathResolve(DIST_DIR, 'og-image.png');

    await page.screenshot({
      path: publicTarget,
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });
    // Also drop a copy directly into dist/ so the current build serves it.
    await copyFile(publicTarget, distTarget);

    console.log('✅ og-image.png generated at public/og-image.png and dist/og-image.png');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('OG image generation failed:', err);
  process.exit(1);
});
