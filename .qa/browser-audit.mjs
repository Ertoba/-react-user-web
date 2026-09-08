import fs from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { storageSeed } from './fixtures.mjs';
import { beginCase, missingFixtures } from './mock-server.mjs';
import { auditInteractions } from './interactions.mjs';

const out = new URL('./results/', import.meta.url);
const widths = (process.env.QA_WIDTHS || '320,360,375,390,393,412,430,480,768,1024,1280,1440').split(',').map(Number);
const engines = (process.env.QA_BROWSERS || 'chromium,firefox,webkit').split(',');
const inventory = JSON.parse(fs.readFileSync(new URL('inventory.json', out)));
const routes = process.env.QA_ONLY_INTERACTIONS === '1' ? [] : process.env.QA_ROUTES ? process.env.QA_ROUTES.split(',') : [...inventory.static_routes, ...inventory.dynamic_routes.map(route => route.replace(/\[[^\]]+\]/g, '1'))];
const reports = [];
const interactions = [];
const base = 'http://127.0.0.1:4318';
const slug = value => value.replace(/[^\w-]/g, '_').slice(0,130);
const ledger = new URL('browser.jsonl', out);
fs.writeFileSync(ledger, '');
fs.mkdirSync(new URL('screenshots/', out), { recursive: true });

export async function audit() {
  for (const engine of engines) {
    const type = { chromium, firefox, webkit, chrome: chromium, msedge: chromium }[engine];
    const browser = await type.launch({ headless: true, ...(['chrome','msedge'].includes(engine) ? { channel: engine } : {}) });
    try {
      for (const width of widths) {
        for (const route of routes) {
          beginCase(`${engine}:${width}:${route}`);
          const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 960 }, locale: 'ka-GE', reducedMotion: 'reduce' });
          await context.addInitScript(seed => { for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, value); }, storageSeed());
          await context.addCookies([{ name: 'languageSetting', value: 'ka', url: base }]);
          const blockedExternal = new Set();
          await context.route('**/*', async request => {
            const url = new URL(request.request().url());
            if (['127.0.0.1', 'localhost'].includes(url.hostname) || ['data:', 'blob:'].includes(url.protocol)) return request.continue();
            blockedExternal.add(url.origin + url.pathname);
            return request.abort('blockedbyclient');
          });
          const page = await context.newPage();
          const errors = [], warnings = [], fixturesMissing = new Set();
          page.on('pageerror', e => errors.push(String(e).slice(0,6000)));
          page.on('console', m => { if (['warning','error'].includes(m.type())) warnings.push(m.text().slice(0,800)); });
          page.on('response', r => { if (r.status() === 501 && new URL(r.url()).port === '4319') fixturesMissing.add(new URL(r.url()).pathname); });
          const row = { browser: engine, width, route, startedAt: new Date().toISOString() };
          try {
            const target = new URL(route, base);
            if (!target.searchParams.has('module')) target.searchParams.set('module', 'grocery');
            if (target.pathname === '/checkout' && !target.searchParams.has('page')) target.searchParams.set('page', 'cart');
            if (target.pathname === '/profile' && !target.searchParams.has('page')) target.searchParams.set('page', 'profile-settings');
            if (target.pathname === '/search') target.searchParams.set('search', 'პროდუქტი');
            const response = await page.goto(target.href, { waitUntil: 'domcontentloaded', timeout: process.env.QA_MODE==='dev' ? 180000 : 30000 });
            row.httpStatus = response?.status();
            await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
            await page.evaluate(() => document.fonts.ready);
            // Activate lazy content before measuring, then restore the viewport.
            await page.evaluate(async () => {
              const height = Math.min(document.documentElement.scrollHeight, 20000);
              for (let y = 0; y < height; y += 700) { window.scrollTo(0,y); await new Promise(resolve => setTimeout(resolve,30)); }
              window.scrollTo(0,0);
            });
            await page.waitForTimeout(250);
            Object.assign(row, await page.evaluate(() => {
              const root = document.documentElement;
              const label = el => (el.innerText || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().slice(0,100);
              const visible = el => { const r=el.getBoundingClientRect(),c=getComputedStyle(el); return r.width>0 && r.height>0 && c.visibility!=='hidden' && c.display!=='none' && c.opacity!=='0'; };
              const clipped = [], unnamed = [], smallTargets = [];
              for (const el of document.querySelectorAll('p,h1,h2,h3,h4,h5,h6,label,button')) {
                if (!visible(el)) continue;
                const cs = getComputedStyle(el);
                if (['hidden','clip'].includes(cs.overflow) && cs.textOverflow !== 'ellipsis' && cs.webkitLineClamp === 'none' && (el.scrollWidth-el.clientWidth>3 || el.scrollHeight-el.clientHeight>3)) clipped.push({ tag: el.tagName, text: label(el) });
              }
              for (const el of document.querySelectorAll('button,a[href],input,textarea,select,[role="button"]')) {
                if (!visible(el)) continue;
                const r=el.getBoundingClientRect();
                if (r.width<24 || r.height<24) smallTargets.push({ tag:el.tagName, text:label(el), width:Math.round(r.width), height:Math.round(r.height) });
                if (!label(el) && !el.getAttribute('aria-labelledby') && !el.getAttribute('title') && !el.querySelector('img[alt],svg title') && !(el.labels?.length)) unnamed.push({ tag:el.tagName, type:el.getAttribute('type') });
              }
              const faces = [...document.fonts].filter(face => face.family.includes('Noto Sans Georgian') && face.status==='loaded').map(face => ({ family:face.family, weight:face.weight, style:face.style }));
              return {
                finalPath: location.pathname, title: document.title, textLength: document.body.innerText.trim().length,
                errorBoundary: /application error:|client-side exception has occurred/i.test(document.body.innerText),
                invalidNumber: /\bNaN\b/.test(document.body.innerText),
                overflowX: Math.max(root.scrollWidth,document.body.scrollWidth)-innerWidth,
                fontFamily: getComputedStyle(document.body).fontFamily, loadedNotoFaces: faces,
                brokenImages: [...document.images].filter(el => visible(el) && el.getAttribute('src') && el.complete && el.naturalWidth===0).map(el => el.getAttribute('src').split('?')[0]).slice(0,20),
                review: { clipped: clipped.slice(0,20), unnamed: unnamed.slice(0,20), smallTargets: smallTargets.slice(0,20) },
              };
            }));
            if ([390,1440].includes(width) || process.env.QA_SCREENSHOTS === '1') {
              row.screenshot = path.posix.join('screenshots', `${engine}-${width}-${slug(route)}.png`);
              await page.screenshot({ path: new URL(row.screenshot, out).pathname.replace(/^\/([A-Za-z]:)/,'$1'), fullPage: true, animations: 'disabled' });
            }
          } catch (e) { row.navigationError = String(e).slice(0,1000); }
          row.errors = [...new Set(errors)];
          row.warnings = [...new Set(warnings)];
          row.fixturesMissing = [...new Set([...fixturesMissing, ...missingFixtures()])];
          row.externalServicesUnavailable = [...blockedExternal];
          const sourcePath = new URL(route,base).pathname;
          const expectedPath = sourcePath === '/app-redirect' ? '/' : sourcePath;
          row.failures = [
            row.navigationError && 'navigation',
            (row.errors.length || row.errorBoundary || warnings.some(message => /(?:Type|Reference|Range|Syntax)Error:|Minified React|client-side exception|Cannot update a component/.test(message))) && 'runtime',
            row.overflowX>3 && 'horizontal-overflow',
            row.invalidNumber && 'invalid-number',
            row.brokenImages?.length && 'broken-image',
            row.httpStatus>=400 && !['/404','/500'].includes(expectedPath) && 'http-error',
            row.textLength===0 && 'empty-page',
            row.loadedNotoFaces?.length===0 && 'font-not-loaded',
          ].filter(Boolean);
          row.status = row.failures.length ? 'failed' : row.fixturesMissing.length || row.finalPath !== expectedPath ? 'blocked' : 'passed';
          // These retained routes import deliberate return-null rental stubs.
          // Record the navigation without certifying an unavailable feature.
          if (sourcePath.startsWith('/rental/')) {
            row.status = 'excluded';
            row.exclusionReason = 'Retained rental route with disabled return-null components; taxi/rental work is outside this release.';
          }
          reports.push(row);
          fs.appendFileSync(ledger, JSON.stringify(row)+'\n');
          console.log(`${row.status.toUpperCase()} ${engine} ${width} ${route}: ${row.failures.join(',')} fixtures=${row.fixturesMissing.length}`);
          await context.close();
        }
      }
      interactions.push(...await auditInteractions(browser,engine));
    } finally { await browser.close(); }
  }
  const summary = { expected: engines.length*widths.length*routes.length, completed: reports.length, routes: routes.length, widths, browsers: engines, passed: reports.filter(r=>r.status==='passed').length, failed: reports.filter(r=>r.status==='failed').length, blocked: reports.filter(r=>r.status==='blocked').length, excluded: reports.filter(r=>r.status==='excluded').length, reviewNotes: 'Geometry heuristics are review candidates, not proof of clipping or accessibility compliance. Excluded rental routes are disabled stubs, not tested functionality. WebKit is not a physical Safari/iOS test. External providers are blocked; no production orders or payments are sent.' };
  summary.interactions = { total: interactions.length, passed: interactions.filter(row=>row.status==='passed').length, failed: interactions.filter(row=>row.status==='failed').length };
  fs.writeFileSync(new URL('summary.json', out), JSON.stringify(summary,null,2));
  console.log(JSON.stringify(summary,null,2));
  return summary.failed || summary.blocked || summary.interactions.failed || summary.completed !== summary.expected ? 1 : 0;
}
