import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getGenericNameText } from "../src/helper-functions/getGenericNameText.js";
import { getSearchSortParam } from "../src/components/home/search/getSearchSortParam.js";

const readSource = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("pharmacy list view renders without generic_name and accepts string or array", () => {
  assert.equal(getGenericNameText(undefined), "");
  assert.equal(getGenericNameText(null), "");
  assert.equal(getGenericNameText([]), "");
  assert.equal(getGenericNameText([null]), "");
  assert.equal(getGenericNameText([{ name: "unexpected" }]), "");
  assert.equal(getGenericNameText("პარაცეტამოლი"), "პარაცეტამოლი");
  assert.equal(getGenericNameText(["პარაცეტამოლი"]), "პარაცეტამოლი");
  assert.equal(getGenericNameText(["პარაცეტამოლი", "ბრენდი"]), "პარაცეტამოლი");
  assert.equal(getGenericNameText(123), "123");

  // The component must use the safe accessor, not generic_name[0].
  const card = readSource("src/components/cards/ProductCard.js");
  assert.match(card, /getGenericNameText\(item\?\.generic_name\)/);
  assert.doesNotMatch(card, /generic_name\s*\[\s*0\s*\]/);
});

test("item price sort values match the backend contract and default resets", () => {
  assert.equal(getSearchSortParam(0, "high", ""), "price_high_low");
  assert.equal(getSearchSortParam(0, "low", ""), "price_low_high");
  assert.equal(getSearchSortParam(0, "", ""), undefined);
  assert.equal(getSearchSortParam(0, "default", ""), undefined);
});

test("store sort is independent of the item price sort", () => {
  assert.equal(getSearchSortParam(1, "high", "nearby"), "nearby");
  assert.equal(getSearchSortParam(1, "low", "fast_delivery"), "fast_delivery");
  assert.equal(getSearchSortParam(1, "high", "default"), undefined);
  assert.equal(getSearchSortParam(1, "", ""), undefined);
  assert.equal(getSearchSortParam(2, "high", "nearby"), undefined);
});

test("search page forwards sort_by into the server-backed query", () => {
  const page = readSource("src/components/home/search/index.js");
  const hook = readSource("src/api-manage/hooks/react-query/search/useGetSearchPageData.js");
  assert.match(page, /sort_by:\s*getSearchSortParam\(currentTab, sortBy, newSort\)/);
  assert.match(hook, /sort_by,\s*min_price:/);
  assert.match(page, /previousSortRef\.current\s*=\s*\{ sortBy, newSort \}/);
  assert.match(page, /serachRefetch\(\)/);
  assert.match(readSource("src/sort/HighToLow.js"), /name: t\("Default"\), value: "default"/);
  assert.match(readSource("src/components/home/search/MobileSideDrawer.js"), /<NewSortBy[^>]*newSort=\{newSort\}/);
});
