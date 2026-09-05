import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { formatProductName, formatStoreName, formatCategoryName } from "../src/utils/georgianText.js";

test("Product and store names preserve authored case; categories opt into CAPS", () => {
  for (const value of ["თბილისის მაღაზია", "Coffee Arabica", "Магазин", undefined]) {
    assert.equal(formatProductName(value), value);
    assert.equal(formatStoreName(value), value);
  }
  assert.equal(formatCategoryName("ყავა"), "ყავა".toLocaleUpperCase("ka-GE"));
});
test("Every local face matches its recorded integrity hash", () => {
  const base = new URL("../public/fonts/crystal/", import.meta.url);
  const manifest = JSON.parse(readFileSync(new URL("font-manifest.json", base), "utf8"));
  assert.equal(manifest.faces.length, 12);
  for (const face of manifest.faces) {
    assert.equal(createHash("sha256").update(readFileSync(new URL(face.file, base))).digest("hex"), face.sha256);
  }
});
test("Cyrillic-only faces and no remote font stylesheet are declared", () => {
  const css = readFileSync(new URL("../src/styles/globals.css", import.meta.url), "utf8");
  const document = readFileSync(new URL("../pages/_document.js", import.meta.url), "utf8");
  assert.equal((css.match(/unicode-range: U\+0400-052F/g) || []).length, 4);
  assert(!/fonts\.googleapis|fonts\.gstatic|family=Rubik/.test(document));
  assert(css.includes("font-synthesis: none"));
});
