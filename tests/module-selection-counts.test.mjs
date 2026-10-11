import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

// Evaluate only the two pure summary functions from the module tile component.
const source = readFileSync(
  new URL("../src/components/landing-page/hero-section/module-selection/ModuleSelectionRaw.js", import.meta.url),
  "utf8",
);
const start = source.indexOf("const getDisplayCount =");
const end = source.indexOf("const Card =", start);
assert.ok(start >= 0 && end > start, "module tile summary functions must exist");
const getModuleSummary = runInNewContext(
  source.slice(start, end) + "\ngetModuleSummary",
  { isBeerModule: () => false },
);
const t = (key) => key;

test("ecommerce with missing item count uses its real store count", () => {
  assert.equal(getModuleSummary({ module_type: "ecommerce", stores_count: 4 }, t), "4 Stores");
  assert.equal(getModuleSummary({ module_type: "ecommerce" }, t), "");
});

test("known item counts still represent products (including zero)", () => {
  assert.equal(getModuleSummary({ module_type: "ecommerce", items_count: 0, stores_count: 4 }, t), "0 Product");
  assert.equal(getModuleSummary({ module_type: "ecommerce", items_count: 17, stores_count: 4 }, t), "17 Product");
});

test("other module store counts are exact, not rounded down", () => {
  assert.equal(getModuleSummary({ module_type: "grocery", stores_count: 4 }, t), "4 მარკეტი");
});
