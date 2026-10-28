import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { formatRentalSearchDate } from "../src/components/home/module-wise-components/rental/components/rentalfilter/rentalSearchDate.mjs";

test("rental search date formatter blanks absent and invalid values", () => {
  for (const value of [undefined, null, "", "not-a-date", new Date(NaN)]) {
    assert.equal(formatRentalSearchDate(value), "");
  }
});

test("rental search date formatter preserves the API date contract", () => {
  const value = new Date(2026, 9, 28, 13, 5);
  assert.equal(formatRentalSearchDate(value), "2026-10-28 01:05 PM");
});

test("TaxiSearchPanel owns one valid initial Dayjs value for state and picker", () => {
  const source = readFileSync(
    new URL(
      "../src/components/home/module-wise-components/rental/components/global/search/TaxiSearchPanel.js",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(
    source,
    /const \[selectedDate, setSelectedDate\] = useState\(\(\) => \{/,
  );
  assert.match(source, /const initialDate = dayjs\(rentalSearch\?\.selectedDate\);/);
  assert.match(source, /return initialDate\.isValid\(\) \? initialDate : dayjs\(\);/);
  assert.match(source, /<DateTimePicker\s+value=\{selectedDate\}/);
  assert.doesNotMatch(source, /value=\{dayjs\(rentalSearch\?\.selectedDate\)\}/);
});
