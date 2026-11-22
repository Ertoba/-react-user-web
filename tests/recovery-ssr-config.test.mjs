import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("forgot-password hard reload uses the same server config contract as home", () => {
  const recovery = fs.readFileSync(new URL("../pages/forgot-password/index.js", import.meta.url), "utf8");
  const home = fs.readFileSync(new URL("../pages/home/index.js", import.meta.url), "utf8");
  assert.match(recovery, /getCommonServerSideProps\(context, "home_page"\)/);
  assert.match(home, /getCommonServerSideProps\(context, "home_page"\)/);
  assert.match(recovery, /const configData = serverConfigData \?\? reduxConfigData/);
  assert.match(recovery, /dispatch\(setConfigData\(serverConfigData\)\)/);
});
