/**
 * Generates cv.pdf from the /cv page of the built Astro site.
 * Run after `astro build` — expects the dist/ folder to exist.
 *
 * Usage: node scripts/generate-cv-pdf.mjs
 */

import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { resolve as pathResolve, extname } from 'path';
import { existsSync } from 'fs';

const DIST_DIR = pathResolve(process.cwd(), 'dist');
const PORT = 4174;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain',
  '.xml':  'application/xml',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

/** Minimal static file server for the dist/ output */
function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      // Guard: some browser requests (favicon, data: URLs) may have no url
      if (!req.url) { res.writeHead(400); res.end(); return; }

      let urlPath = req.url.split('?')[0];

      // Map directory-style paths (e.g. /cv, /cv/) → /cv/index.html
      if (urlPath.endsWith('/')) {
        urlPath += 'index.html';
      } else if (!extname(urlPath)) {
        urlPath += '/index.html';
      }

      const filePath = pathResolve(DIST_DIR, '.' + urlPath);
      const ext = extname(filePath);

      try {
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
        res.end(data);
      } catch {
        // Try index.html fallback
        try {
          const fallback = await readFile(pathResolve(DIST_DIR, 'index.html'));
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(fallback);
        } catch {
          res.writeHead(404);
          res.end('Not found');
        }
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
  const page = await browser.newPage();

  try {
    await page.goto(`http://localhost:${PORT}/cv`, { waitUntil: 'networkidle' });
    // Ensure all @font-face files (Carlito) are fully loaded before printing so
    // the PDF embeds the real font instead of falling back to a system font.
    await page.evaluate(() => document.fonts.ready);
    // No running header/footer — the web /cv design has none, and the print CSS
    // owns page size + margins via `@page` (preferCSSPageSize). This avoids the
    // header/date overlapping the body content.
    await page.pdf({
      path: pathResolve(DIST_DIR, 'clemens-kaserer-cv.pdf'),
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log('✅ clemens-kaserer-cv.pdf generated at dist/clemens-kaserer-cv.pdf');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
