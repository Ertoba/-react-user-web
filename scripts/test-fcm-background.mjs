import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const code = readFileSync(new URL("../public/firebase-messaging-sw.js", import.meta.url), "utf8");
const shown = [];
let onBackgroundMessage;

vm.runInNewContext(code, {
  importScripts: () => {},
  firebase: {
    initializeApp: () => {},
    messaging: () => ({
      onBackgroundMessage: callback => { onBackgroundMessage = callback; },
    }),
  },
  self: {
    registration: {
      showNotification: (title, options) => shown.push({ title, body: options.body }),
    },
  },
});

assert.equal(typeof onBackgroundMessage, "function");
onBackgroundMessage({ notification: { title: "FCM automatic", body: "Already displayed" } });
assert.equal(shown.length, 0, "Notification payloads must not be displayed twice");

onBackgroundMessage({ data: { title: "MILI delivery", body: "Order accepted" } });
assert.equal(shown.length, 1, "Data-only payloads must display one notification");
assert.equal(shown[0].title, "MILI delivery");
assert.equal(shown[0].body, "Order accepted");

onBackgroundMessage({ data: {} });
onBackgroundMessage({});
assert.equal(shown.length, 1, "Incomplete data messages must not throw or show blank notices");

console.log("Web FCM background handling passed (no duplicates, data-only fallback).");
