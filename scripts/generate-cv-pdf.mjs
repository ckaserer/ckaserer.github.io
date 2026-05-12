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
  '.ico':  'image/x-icon',
  '.txt':  'text/plain',
  '.xml':  'application/xml',
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

  // Read CV name for the PDF header
  let displayName = 'Curriculum Vitae';
  try {
    const cvJson = JSON.parse(await readFile(pathResolve(process.cwd(), 'src/data/cv.json'), 'utf8'));
    if (cvJson?.name) displayName = `${cvJson.name} — Curriculum Vitae`;
  } catch { /* fall back to default */ }

  const headerTemplate = `
    <div style="font-size:8px; color:#64748B; width:100%; padding:0 14mm; display:flex; justify-content:space-between; font-family: 'Helvetica', sans-serif;">
      <span>${displayName}</span>
      <span>${new Date().toISOString().slice(0, 10)}</span>
    </div>`;
  const footerTemplate = `
    <div style="font-size:8px; color:#64748B; width:100%; padding:0 14mm; display:flex; justify-content:space-between; font-family: 'Helvetica', sans-serif;">
      <span>ckaserer.dev</span>
      <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
    </div>`;

  try {
    await page.goto(`http://localhost:${PORT}/cv`, { waitUntil: 'networkidle' });
    await page.pdf({
      path: pathResolve(DIST_DIR, 'cv.pdf'),
      format: 'A4',
      printBackground: false,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: { top: '18mm', right: '14mm', bottom: '16mm', left: '14mm' },
    });
    console.log('✅ cv.pdf generated at dist/cv.pdf');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
