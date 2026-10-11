import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("cutlery is offered and submitted only for food orders", () => {
  const sidebar = read("../src/components/store-details/StoreCartSidebar.js");
  const checkout = read("../src/components/checkout/item-checkout/index.js");

  assert.match(sidebar, /\{getCurrentModuleType\(\) === ModuleTypes\.FOOD && \(/);
  assert.doesNotMatch(sidebar, /getCurrentModuleType\(\) !== ModuleTypes\.GROCERY && \(/);
  assert.match(sidebar, /addCutlery: getCurrentModuleType\(\) === ModuleTypes\.FOOD && addCutlery/);
  assert.match(checkout, /formData\.append\("cutlery", currentModuleType === ModuleTypes\.FOOD/);
  assert.match(checkout, /const resolvedCutlery = currentModuleType === ModuleTypes\.FOOD/);
});

test("reel streaming bypasses Nginx Laravel /api route", async () => {
  const config = require("../next.config.js");
  const rewrites = await config.rewrites();
  assert.ok(rewrites.some((rule) =>
    rule.source === "/reels-stream" && rule.destination === "/api/reels/stream"
  ));

  const modal = read("../src/components/home/trending-bites/ReelsModal.tsx");
  assert.match(modal, /return `\/reels-stream\?\$\{params\.toString\(\)\}`;/);
  assert.doesNotMatch(modal, /return `\/api\/reels\/stream\?/);
  assert.match(modal, /video\.addEventListener\("error", onError\)/);
  assert.match(modal, /videoError && \(/);
  assert.match(modal, /setRetrySerial\(\(n\) => n \+ 1\)/);
  assert.doesNotMatch(modal, /preloadReel\(item\.id\)/);
});

test("reel metadata fetch returns JSON rather than downloading MP4 chunks", () => {
  const details = read("../src/api-manage/hooks/react-query/reels/useGetReelsDetails.js");
  assert.doesNotMatch(details, /stream=1/);
  assert.doesNotMatch(details, /Range: "bytes=/);
});
