import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('shared AI launcher has a stable selector and restores keyboard focus', () => {
  const source = fs.readFileSync(new URL('../src/components/ai-chatbot/AiChatBotLauncher.tsx', import.meta.url), 'utf8');
  assert.match(source, /data-testid="mili-ai-launcher"/);
  assert.match(source, /ref=\{openerRef\}/);
  assert.match(source, /openerRef\.current\?\.focus\(\)/);
  assert.match(source, /onClose=\{closeChat\}/);
});

test('current AI dialog handles Escape and chat quick start has stable selector', () => {
  const dialog = fs.readFileSync(new URL('../src/components/ai-chatbot/ChatBotPopover.tsx', import.meta.url), 'utf8');
  const list = fs.readFileSync(new URL('../src/components/ai-chatbot/ChatListView.tsx', import.meta.url), 'utf8');
  const interactions = fs.readFileSync(new URL('../.qa/interactions.mjs', import.meta.url), 'utf8');
  assert.match(dialog, /event\.key === "Escape"/);
  assert.match(list, /data-testid="mili-ai-new-chat"/);
  assert.match(interactions, /getByTestId\('mili-ai-launcher'\)/);
  assert.match(interactions, /getByTestId\('mili-ai-new-chat'\)/);
  assert.doesNotMatch(interactions, /AI ჩატ-ასისტენტი/);
});
