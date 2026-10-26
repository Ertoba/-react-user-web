import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

// MainLayout is shared by /home and all other storefront routes. Rendering a
// second floating AI launcher directly in Home creates overlapping triggers,
// duplicated chat panes and brittle mobile hit targets.
test("Home mounts only the MainLayout AI assistant and preserves banner offset", () => {
  const home = fs.readFileSync(new URL("../pages/home/index.js", import.meta.url), "utf8");
  const layout = fs.readFileSync(
    new URL("../src/components/layout/MainLayout.js", import.meta.url),
    "utf8"
  );

  assert.match(home, /<MainLayout\b/);
  assert.doesNotMatch(home, /<AiChatBotLauncher\b/);
  assert.doesNotMatch(home, /import AiChatBotLauncher\b/);

  const match = layout.match(/<AiChatBotLauncher\b[^>]*\/>/g) ?? [];
  assert.equal(match.length, 1, "MainLayout must render exactly one chat launcher");
  assert.match(match[0], /happyHourBannerActive=\{happyHourActive\}/);
  assert.match(layout, /onActiveChange=\{handleHappyHourActiveChange\}/);
});
