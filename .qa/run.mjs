import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mockServer } from './mock-server.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
const env = { ...process.env, MILI_QA: '1', NEXT_PUBLIC_BASE_URL: 'http://127.0.0.1:4319', NEXT_CLIENT_HOST_URL: 'http://127.0.0.1:4318', NEXT_PUBLIC_SITE_VERSION: 'local-qa', NEXT_PUBLIC_GOOGLE_MAP_KEY: '', NEXT_TELEMETRY_DISABLED: '1' };
const next = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url));
const log = fs.openSync(new URL('./results/server.txt', import.meta.url), 'w');
const children = [];
function run(args, output=log) {
  const child = spawn(process.execPath, [next,...args], { cwd:root, env, stdio:['ignore',output,output], windowsHide:true });
  children.push(child);
  return child;
}
function completed(child) { return new Promise((resolve,reject) => { child.on('error',reject); child.on('exit',code=>resolve(code)); }); }
await new Promise(resolve=>mockServer.listen(4319,'127.0.0.1',resolve));
try {
  if (process.env.QA_MODE !== 'dev' && process.env.QA_SKIP_BUILD !== '1') {
    console.log('Building isolated QA application against local fixtures.');
    const code = await completed(run(['build']));
    fs.writeFileSync(new URL('./results/build.exit',import.meta.url),String(code));
    if (code!==0) throw new Error(`QA build failed: ${code}; see .qa/results/server.txt`);
  }
  const server = run([process.env.QA_MODE==='dev' ? 'dev' : 'start','-p','4318','-H','127.0.0.1']);
  let ready=false;
  for(let attempt=0;attempt<180;attempt++) {
    if(server.exitCode!==null) throw new Error('Next server exited before readiness.');
    try { const response=await fetch('http://127.0.0.1:4318/404',{signal:AbortSignal.timeout(1500)}); if(response.status===404 || response.ok) { ready=true; break; } } catch {}
    await new Promise(resolve=>setTimeout(resolve,1000));
  }
  if(!ready) throw new Error('Next server readiness timed out.');
  const { audit } = await import('./browser-audit.mjs');
  process.exitCode = await audit();
} catch(error) {
  console.error(error);
  process.exitCode=1;
} finally {
  for (const child of children) if(child.exitCode===null) {
    if(process.platform==='win32') { try { execFileSync('taskkill',['/pid',String(child.pid),'/t','/f'],{stdio:'ignore',windowsHide:true}); } catch {} }
    else child.kill('SIGTERM');
  }
  mockServer.closeAllConnections();
  await new Promise(resolve=>mockServer.close(resolve));
  fs.closeSync(log);
}
