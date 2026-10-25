import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

// Evaluate the actual V4.2 source with a controlled Redux store. This avoids
// depending on Next.js's path aliases while exercising the formatter's logic.
const source = readFileSync(new URL("../src/helper-functions/CardHelpers.js", import.meta.url), "utf8");
const start = source.indexOf("export const formatNumber =");
assert.ok(start >= 0, "Rental's plain-number formatter must be exported");
const end = source.indexOf("\n};", start);
assert.ok(end > start, "formatter declaration must have a closing brace");
const declaration = source.slice(start, end + 3).replace("export const", "const");

const formatter = (decimalPlaces) => runInNewContext(
  declaration + "\nformatNumber",
  { store: { getState: () => ({ configData: { configData: decimalPlaces == null ? {} : { digit_after_decimal_point: decimalPlaces } } }) } },
);

test("Rental V4.2 formatter formats numeric values using configured precision", () => {
  const formatNumber = formatter(2);
  assert.equal(formatNumber(12.345), "12.35");
  assert.equal(formatNumber("12.5"), "12.50");
  assert.equal(formatNumber(0), "0.00");
  assert.equal(formatter(3)(1.2), "1.200");
});

test("Rental V4.2 formatter safely handles missing and invalid values", () => {
  const formatNumber = formatter(null);
  assert.equal(formatNumber(null), "");
  assert.equal(formatNumber(undefined), "");
  assert.equal(formatNumber(""), "");
  assert.equal(formatNumber("invalid"), "");
  assert.equal(formatNumber(1.5), "1.50");
});
