import assert from "node:assert/strict";
import { responseFor } from "../.qa/fixtures.mjs";

const paths = [
  "/api/v1/happy-hour/running",
  "/api/v1/module/top-offer",
  "/api/v1/customer/reels/list",
  "/api/v1/bogo/home",
  "/api/v1/customer/order/last",
  "/api/v1/stores/quick-delivery",
  "/api/v1/bundle/home",
  "/api/v1/app-download-section",
  "/api/v1/delivery-charge/coverage-list",
  "/api/v1/cashback/getCashback",
  "/api/v1/customer/cart/discount-eligibility",
  "/api/v1/customer/order/checkout-summary",
  "/api/v1/customer/cart/get-all",
];

for (const path of paths) {
  assert.notEqual(responseFor(path, "GET"), undefined, `Missing QA fixture: ${path}`);
}

const coverage = responseFor("/api/v1/delivery-charge/coverage-list", "GET");
assert.equal(coverage.type, "distance_wise");
assert.deepEqual(coverage.coverage, []);

const happyHour = responseFor("/api/v1/happy-hour/running", "GET");
assert.equal(happyHour.is_running, false);

const grouped = responseFor("/api/v1/customer/cart/get-all", "GET");
assert.ok(Array.isArray(grouped));
assert.ok(grouped[0].store.id);
assert.ok(Array.isArray(grouped[0].carts));

const summary = responseFor("/api/v1/customer/order/checkout-summary", "POST");
assert.equal(summary.tax.total_price, 12.5);
assert.equal(summary.delivery.delivery_charge, 3);
assert.equal(summary.delivery.delivery_charge_before_pro_discount, 3);
assert.equal(summary.pro.total_savings, 0);
assert.equal(summary.surge, null);
assert.equal(summary.delivery_options, null);

const eligibility = responseFor("/api/v1/customer/cart/discount-eligibility", "POST");
assert.equal(eligibility.discount_amount, 0);
assert.equal(eligibility.is_qualified, false);

const bogo = responseFor("/api/v1/bogo/home", "GET");
assert.equal(bogo.is_live, false);
assert.deepEqual(bogo.offers, []);

console.log("Verified", paths.length, "synthetic V4.2 API fixture contracts.");
