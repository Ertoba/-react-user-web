import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("only the internal no-SSR helper is explicitly excluded; Service routes remain gated", () => {
  const qa = fs.readFileSync(new URL("../.qa/browser-audit.mjs", import.meta.url), "utf8");
  assert.match(qa, /sourcePath === '\/custom-no-ssr'/);
  assert.match(qa, /row\.status = 'excluded'/);
  assert.match(qa, /row\.exclusionReason/);
  assert.doesNotMatch(qa, /sourcePath\.startsWith\('\/service\/'\)/);
  assert.doesNotMatch(qa, /sourcePath === '\/service\/provider/);
  assert.doesNotMatch(qa, /sourcePath === '\/service\/service-details/);
  assert.match(qa, /return summary\.failed \|\| summary\.blocked/);
});
