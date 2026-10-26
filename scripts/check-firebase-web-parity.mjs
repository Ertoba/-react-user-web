import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../src/firebase.js", import.meta.url), "utf8");
const sw = readFileSync(new URL("../public/firebase-messaging-sw.js", import.meta.url), "utf8");
const keys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];

for (const key of keys) {
  const value = text => text.match(new RegExp(`\\b${key}\\s*:\\s*["']([^"']+)["']`))?.[1];
  const appValue = value(app);
  const workerValue = value(sw);
  assert.ok(appValue, `Firebase app config missing ${key}`);
  assert.equal(workerValue, appValue, `Firebase worker ${key} differs from app`);
}
console.log("Web Firebase app and service worker configs match.");
