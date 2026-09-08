import http from 'node:http';
import fs from 'node:fs';
import { responseFor } from './fixtures.mjs';
fs.mkdirSync(new URL('./results/', import.meta.url), { recursive: true });
const log = new URL('./results/api.jsonl', import.meta.url);
fs.writeFileSync(log, '');
let activeCase = null;
let caseRequests = [];
export const beginCase = (name) => { activeCase = name; caseRequests = []; };
export const missingFixtures = () => [...new Set(caseRequests.filter(row => row.status === 501).map(row => row.path))];
export const mockServer = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:4319');
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4318');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (url.pathname === '/fixture.svg') {
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320"><rect width="480" height="320" rx="24" fill="#e4f4eb"/><path d="M175 110h130v120H175z" fill="#039d55"/><path d="M205 110v-20a35 35 0 0170 0v20" fill="none" stroke="#039d55" stroke-width="12"/></svg>');
  }
  let body = responseFor(url.pathname, req.method, url.searchParams);
  if (url.pathname === '/api/v1/config' && activeCase?.endsWith(':/maintainance')) body = { ...body, maintenance_mode: true };
  const status = body === undefined ? 501 : 200;
  // No payloads, tokens or contact information are recorded.
  const row = { case: activeCase, method: req.method, path: url.pathname, status };
  caseRequests.push(row);
  fs.appendFileSync(log, JSON.stringify(row) + '\n');
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body === undefined ? { errors: [{ code: 'qa_fixture_missing', message: `Missing local fixture: ${url.pathname}` }] } : body));
});
