import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const statements = JSON.parse(
  readFileSync(new URL("../public/.well-known/assetlinks.json", import.meta.url), "utf8"),
);
const appSigningSha256 =
  "D0:BA:E5:29:36:57:94:64:2A:45:D8:74:AD:D3:C9:B6:7E:56:82:2A:08:AD:8A:16:A6:8F:14:04:17:94:C5:71";

// This is the Customer APP-signing certificate verified in Play Console on
// 2026-11-22, not the separate local/AAB upload certificate.
test("mili.ge delegates Android App Links to the MILI Customer package only", () => {
  assert.equal(statements.length, 1);
  assert.deepEqual(statements[0].relation, ["delegate_permission/common.handle_all_urls"]);
  assert.equal(statements[0].target.namespace, "android_app");
  assert.equal(statements[0].target.package_name, "ge.mili.customer");
});

test("asset links use the verified Play app-signing certificate, not an upload key", () => {
  assert.deepEqual(statements[0].target.sha256_cert_fingerprints, [appSigningSha256]);
  assert.match(appSigningSha256, /^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/);
  assert.notEqual(
    appSigningSha256,
    "FE:B2:A5:92:67:A9:0F:78:9D:8E:97:C5:48:BB:2A:70:F9:7F:3E:15:0C:EB:74:8B:73:56:D3:65:EA:F4:94:EB",
  );
});

test("official demo identity and unaudited role associations are not published", () => {
  const content = JSON.stringify(statements);
  for (const identity of ["com.sixamtech", "ge.mili.vendor", "ge.mili.delivery"]) {
    assert.equal(content.includes(identity), false, identity);
  }
});
