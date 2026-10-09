import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mayAccessRoute } from "../src/helper-functions/profileAccess.mjs";
import {
  getProfileMobileTitle,
  PROFILE_MOBILE_PAGE_TITLES,
} from "../src/components/user-information/profileMobilePageTitles.mjs";

const source = (file) =>
  readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

const profileSections = [
  ["addresses", "Addresses"],
  ["my-orders", "Orders & Trips"],
  ["track-order", "Track Orders"],
  ["wallet", "My Wallet"],
  ["monthly-cart-list", "Monthly Cart List"],
  ["coupons", "Available Coupons"],
  ["loyalty-points", "Loyalty Points"],
  ["referral-code", "Referral Code"],
  ["subscription-plan", "Subscription Plan"],
  ["inbox", "Inbox"],
  ["settings", "Settings"],
];

test("guest checkout ID cannot unlock private account pages", () => {
  assert.equal(
    mayAccessRoute({ token: null, guestId: "guest-17", requireToken: true }),
    false,
  );
  assert.equal(
    mayAccessRoute({ token: "customer-auth-token", guestId: null, requireToken: true }),
    true,
  );
  // Other routes retain existing guest-checkout behaviour.
  assert.equal(mayAccessRoute({ token: null, guestId: "guest-17" }), true);
  assert.equal(mayAccessRoute({ token: null, guestId: null }), false);
  assert.match(source("pages/profile/index.js"), /<AuthGuard[^>]*requireToken>/);
  assert.match(source("src/components/route-guard/AuthGuard.js"), /mayAccessRoute\(\{ token, guestId: guest, requireToken \}\)/);
});

test("all V4.2 mobile account sections have their own titles and content routes", () => {
  const menu = source("src/components/header/second-navbar/account-popover/AccountMenuPanel.js");
  const body = source("src/components/user-information/ProfileBody.js");
  for (const [key, title] of profileSections) {
    assert.equal(PROFILE_MOBILE_PAGE_TITLES[key], title, key);
    assert.match(menu, new RegExp(`profilePath\\("${key}"\\)`), `${key} missing account link`);
    assert(body.includes(`"${key}"`), `${key} missing content handler`);
  }
  assert.equal(getProfileMobileTitle("my-orders", true), "Order Details");
  assert.equal(getProfileMobileTitle("my-orders"), "Orders & Trips");
  assert.equal(getProfileMobileTitle("not-registered"), "Profile");
});

test("subpages show a back arrow, preserve module context and skip legacy account intro", () => {
  const view = source("src/components/user-information/UserInformation.js");
  assert.match(view, /getProfileMobileTitle\(activePage, Boolean\(orderId\)\)/);
  assert.match(view, /onClick=\{handleMobileBack\}/);
  assert.match(view, /orderTabModule/);
  assert.match(view, /!isV42Mobile && \(/);
  assert.match(view, /activePage === "inbox" \|\| \(activePage === "my-orders" && Boolean\(orderId\)\)/);
});

test("Addresses + invokes an actual AddAddress form, not a blank section", () => {
  const src = source("src/components/user-information/BodySection.js");
  assert.match(src, /page === "addresses" \? \(/[\s\S]*?<AddAddressComponent/);
  assert.match(src, /addressRefetch=\{refetch\}/);
  assert.match(src, /setAddAddress=\{setAddAddress\}/);
  assert.match(src, /!addAddress && \(/);
});

test("profile settings retains actual delete-account handlers", () => {
  const section = source("src/components/user-information/BodySection.js");
  for (const prop of [
    "deleteUserHandler",
    "accountDeleteStatus",
    "setAccountDeleteStatus",
    "isLoadingDelete",
  ]) {
    assert.match(section, new RegExp(`${prop}=\\{${prop}\\}`));
  }
});

test("direct monthly cart page fetches modules when no /home context exists", () => {
  const body = source("src/components/user-information/ProfileBody.js");
  assert.match(body, /page === "monthly-cart-list"/);
  assert.match(body, /needsProfileModules/);
  assert.match(body, /if \(needsProfileModules\) refetchModules\(\)/);
});

test("profile flags handle serialized numeric 0 and enabled values", () => {
  const menu = source("src/components/header/second-navbar/account-popover/AccountMenuPanel.js");
  for (const flag of ["customer_wallet_status", "loyalty_point_status", "ref_earning_status", "pro_member_status"]) {
    assert.match(menu, new RegExp(`Number\\(configData\\?\\.${flag}\\s*\\?\\?`));
  }
  assert.match(menu, /Number\(configData\?\.monthly_order_reminder \?\? 0\) === 0/);
});

test("profile mobile titles are translated in Georgian and Russian", () => {
  for (const language of ["ka", "ru"]) {
    const locale = source(`src/language/${language}.js`);
    for (const title of [...new Set(Object.values(PROFILE_MOBILE_PAGE_TITLES)), "Order Details", "User", "Back"]) {
      assert(locale.includes(JSON.stringify(title) + ": "), `${language}: missing ${title}`);
    }
  }
});
