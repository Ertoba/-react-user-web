import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  getActivePaymentGatewayOptions,
  isDigitalPaymentEnabled,
} from "../src/helper-functions/checkoutPaymentGateways.mjs";

const enabledConfig = (methods) => ({
  digital_payment: true,
  digital_payment_info: { digital_payment: true },
  active_payment_method_list: methods,
});

test("online checkout presents backend-enabled Keepz/BOG methods", () => {
  const input = [{ gateway: "keepz", gateway_title: "Keepz" }, { gateway: "bog_pay" }];
  assert.equal(isDigitalPaymentEnabled(enabledConfig(input)), true);
  assert.deepEqual(getActivePaymentGatewayOptions(enabledConfig(input)), input);
});

test("no online methods are invented for empty, disabled or malformed responses", () => {
  assert.deepEqual(getActivePaymentGatewayOptions(enabledConfig([])), []);
  assert.deepEqual(getActivePaymentGatewayOptions(enabledConfig(undefined)), []);
  assert.deepEqual(getActivePaymentGatewayOptions(enabledConfig([{ gateway: "" }, {}, null])), []);
  assert.deepEqual(getActivePaymentGatewayOptions({ ...enabledConfig([{ gateway: "keepz" }]), digital_payment: false }), []);
  assert.deepEqual(getActivePaymentGatewayOptions({ ...enabledConfig([{ gateway: "keepz" }]), digital_payment_info: { digital_payment: false } }), []);
});

const loadLocale = (language) => {
  const source = readFileSync(new URL(`../src/language/${language}.js`, import.meta.url), "utf8");
  const map = new Map();
  for (const line of source.split("\n")) {
    const match = line.match(/^\s*("(?:[^"\\]|\\.)*")\s*:\s*("(?:[^"\\]|\\.)*"),?\s*$/);
    if (match) {
      const key = JSON.parse(match[1]);
      // Legacy locale files contain pre-existing duplicate keys. The last
      // value wins at runtime; require the selected checkout keys below.
      map.set(key, JSON.parse(match[2]));
    }
  }
  return map;
};

const checkoutKeys = [
  "Deliveryman Tips",
  "Your provided tips will 100% goes to deliveryman.",
  "Save It For Later",
  "Who Will Pay?",
  "Choose which person will pay for the charges",
  "Select your instruction",
  "Delivery Instruction",
  "Add at least one option to pay your order.",
  "Select a payment method to proceed.",
  "Pay Via Online",
  "Payment Methods",
  "Online payment is temporarily unavailable. Please select another payment method.",
  "Cash After Service",
  "Parcel Delivery",
  "Delivery charge is unavailable for this address",
  "Please select an area/zip code to continue",
  "Instant Delivery",
  "Choose Order Type",
  "Pro Discount",
  "Free delivery as a Pro member",
  "{{percent}}% off as a Pro member (up to {{cap}}) on orders above {{amount}}",
];

test("checkout and parcel labels have both Georgian and Russian translations", () => {
  for (const language of ["ka", "ru"]) {
    const translations = loadLocale(language);
    for (const key of checkoutKeys) {
      const translated = translations.get(key);
      assert.ok(translated?.length > 0, `missing ${language}: ${key}`);
      if (/[A-Za-z]{3}/.test(key) && !/^(Pro|Parcel)$/.test(key)) {
        assert.notEqual(translated, key, `untranslated ${language}: ${key}`);
      }
      const placeholders = (text) => [...text.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)].map((m) => m[1]).sort();
      assert.deepEqual(placeholders(translated), placeholders(key), `lost interpolation placeholder in ${language}: ${key}`);
    }
  }
});

test("both checkout payment pickers show a localized disabled-provider state", () => {
  for (const path of [
    "../src/components/checkout/item-checkout/OtherModulePayment.js",
    "../src/components/checkout/item-checkout/ParcelPaymentMethod.js",
  ]) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.match(source, /getActivePaymentGatewayOptions\(configData\)/);
    assert.match(source, /activeDigitalGateways\.length === 0/);
    assert.match(source, /Online payment is temporarily unavailable/);
  }
});

test("parcel payment modal keeps pending gateway selection isolated until Update", () => {
  const source = readFileSync(new URL("../src/components/checkout/DeliveryInfo.js", import.meta.url), "utf8");
  assert.match(source, /const \[draftPaymentMethod, setDraftPaymentMethod\]/);
  assert.match(source, /const closePaymentPicker = \(\) => \{[\s\S]*?setDraftPaymentMethod\(selectedPaymentMethod \|\| paymentMethod\)/);
  assert.match(source, /const confirmPaymentPicker = \(selected\) => \{[\s\S]*?setPaymentMethod\(selected\);[\s\S]*?setSelectedPaymentMethod\(selected\)/);
  assert.equal((source.match(/setPaymentMethod=\{setDraftPaymentMethod\}/g) ?? []).length, 2);
  assert.equal((source.match(/setSelectedPaymentMethod=\{confirmPaymentPicker\}/g) ?? []).length, 2);
  assert.equal((source.match(/setOpen=\{closePaymentPicker\}/g) ?? []).length, 2);
});
