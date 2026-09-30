import assert from 'node:assert/strict';
import fs from 'node:fs';
import { config, storageSeed } from './fixtures.mjs';
import { beginCase } from './mock-server.mjs';

export async function auditInteractions(browser, engine) {
  const results = [];
  const base = 'http://127.0.0.1:4318';
  for (const name of ['chat-motion', 'chat-reduced-motion', 'recovery-phone', 'recovery-email']) {
    beginCase(`interaction:${engine}:${name}`);
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: name === 'chat-motion' ? 'no-preference' : 'reduce' });
    await context.addInitScript(seed => {
      for (const [key,value] of Object.entries(seed)) localStorage.setItem(key,value);
      window.__notificationRequests = 0;
      if ('Notification' in window) Notification.requestPermission = async () => { window.__notificationRequests++; return 'denied'; };
    }, storageSeed());
    await context.addCookies([{ name: 'languageSetting', value: 'ka', url: base }]);
    let submitted = 0, lastPayload = null;
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (!['127.0.0.1','localhost'].includes(url.hostname)) return route.abort('blockedbyclient');
      if (url.pathname === '/api/v1/config') return route.fulfill({ json: { ...config, ai_chat_status: 1, is_sms_active: name !== 'recovery-email', is_mail_active: true, firebase_otp_verification: 0 } });
      if (url.pathname === '/api/v1/customer/ai-chat/send' || url.pathname === '/api/v1/auth/forgot-password') {
        submitted++; lastPayload = request.postDataJSON();
        await new Promise(resolve => setTimeout(resolve,300));
        return route.fulfill({ json: { message: 'სატესტო პასუხი მზად არის', metadata: {} } });
      }
      return route.continue();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    const row = { browser: engine, name, status: 'passed' };
    try {
      if (name.startsWith('chat-')) {
        await page.goto(`${base}/home?module=grocery`, { waitUntil:'networkidle', timeout:30000 });
        const opener = page.getByRole('button', { name: 'AI ჩატ-ასისტენტი', exact:true });
        await opener.click();
        const dialog = page.getByRole('dialog');
        await dialog.waitFor({ state:'visible' });
        const composer = dialog.locator('textarea').first();
        await composer.fill('სად ვიყიდო ახალი პროდუქტები?');
        await composer.press('Enter');
        await composer.press('Enter');
        await dialog.getByText('სატესტო პასუხი მზად არის', { exact:true }).waitFor();
        assert.equal(submitted,1,'A pending chat request must reject duplicate Enter submissions.');
        const bounds = await dialog.boundingBox();
        assert.ok(bounds.x >= -1 && bounds.x+bounds.width <=391,'Chat must remain within the mobile viewport.');
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state:'hidden' });
        assert.equal(await opener.evaluate(el=>el===document.activeElement),true,'Closing the dialog restores focus.');
        assert.equal(await page.evaluate(()=>window.__notificationRequests),0,'Page loading must not request notification permission.');
      } else {
        await page.goto(`${base}/forgot-password?module=grocery`, { waitUntil:'networkidle', timeout:30000 });
        const selector = name === 'recovery-phone' ? 'input[type="tel"]' : 'input[name="email"]';
        const form = page.locator('form').filter({ has: page.locator(selector) }).first();
        const input = form.locator(selector).first();
        await input.waitFor({ state:'visible' });
        await input.fill(name==='recovery-phone' ? '+995' : 'invalid');
        await form.locator('button[type="submit"]').click();
        await page.waitForTimeout(350);
        assert.equal(submitted,0,'An invalid recovery form must not send an API request.');
        if (name === 'recovery-phone') {
          // The phone widget manages the prefix/caret on keyboard events.
          await input.click();
          await input.press('ControlOrMeta+A');
          await input.press('Backspace');
          await input.pressSequentially('555123456', { delay: 30 });
          assert.equal((await input.inputValue()).replace(/\D/g,''),'995555123456');
        } else {
          await input.fill('qa@example.test');
        }
        await Promise.all([
          page.waitForResponse(response=>new URL(response.url()).pathname==='/api/v1/auth/forgot-password'),
          form.locator('button[type="submit"]').click(),
        ]);
        assert.equal(submitted,1);
        assert.equal(lastPayload.verification_method,name==='recovery-phone'?'phone':'email');
      }
      assert.deepEqual(errors,[]);
    } catch (error) {
      row.status='failed'; row.error=String(error); row.submitted=submitted;
      row.recoveryInput = await page.locator('input[type="tel"],input[name="email"]').first().inputValue().catch(()=>null);
      row.pageText = await page.locator('body').innerText().catch(()=>null);
      await page.screenshot({ path:new URL(`./results/interaction-${engine}-${name}.png`,import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'), fullPage:true }).catch(()=>{});
    }
    results.push(row);
    console.log(`${row.status.toUpperCase()} ${engine} ${name}${row.error ? ': '+row.error : ''}`);
    await context.close();
  }
  fs.writeFileSync(new URL(`./results/interactions-${engine}.json`,import.meta.url),JSON.stringify(results,null,2));
  return results;
}
