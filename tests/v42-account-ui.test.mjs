import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

/**
 * Focused, dependency-free regression guards for V4.2 account navigation.
 * These validate source wiring and JSX syntax. They do NOT replace browser
 * smoke tests or verify pixel-perfect UI parity.
 */
const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const jsxNodes = (path, tag) => {
  const file = source(path);
  const parsed = ts.createSourceFile(path, file, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  assert.equal(
    parsed.parseDiagnostics.length,
    0,
    `${path}: JSX must parse without syntax errors`,
  );
  const found = [];
  const visit = (node) => {
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      node.tagName.getText(parsed) === tag
    ) {
      found.push(
        new Set(
          node.attributes.properties
            .filter(ts.isJsxAttribute)
            .map((attribute) => attribute.name.text),
        ),
      );
    }
    ts.forEachChild(node, visit);
  };
  visit(parsed);
  return found;
};

const mustProvide = (path, tag, required) => {
  const elements = jsxNodes(path, tag);
  assert(elements.length, `${path}: expected <${tag}>`);
  assert(
    elements.some((props) => required.every((name) => props.has(name))),
    `${path}: <${tag}> must forward ${required.join(", ")}`,
  );
};

test("Desktop V4.2 popover contains account panel and retains its handlers", () => {
  const path = "src/components/header/second-navbar/account-popover/index.js";
  mustProvide(path, "AccountMenuPanel", [
    "token",
    "onClose",
    "onSignInClick",
    "cartListRefetch",
  ]);
  const text = source(path);
  assert.match(text, /transformOrigin=\{\{ vertical: "top", horizontal \}\}/);
  assert.match(text, /anchorOrigin=\{\{ vertical: "bottom", horizontal \}\}/);
  assert.match(text, /getLanguage\(\) === "rtl"/);
});

test("Both desktop navbars forward credentials and guest modal entry", () => {
  const required = ["token", "onSignInClick", "cartListRefetch"];
  for (const path of [
    "src/components/header/new-navbar/NewNavBar.js",
    "src/components/header/second-navbar/SecondNavbar.js",
  ]) {
    mustProvide(path, "AccountPopover", required);
    assert.match(source(path), /<AuthModal\s/);
  }
});

test("Mobile users retain separate authenticated page and guest drawer", () => {
  const bottom = source("src/components/header/BottomNav.js");
  assert.match(bottom, /if \(getToken\(\)\)\s*\{\s*router\.push\("\/profile"\)/);
  mustProvide("src/components/header/BottomNav.js", "ProfileDrawer", [
    "open",
    "onClose",
    "onSignInClick",
  ]);
  assert.match(
    source("src/components/user-information/UserInformation.js"),
    /<MobileProfileOverview\s/,
  );
});

test("MILI authentication choices and guest access are preserved", () => {
  const auth = source("src/components/auth/AuthLanding.jsx");
  for (const label of ["Login with Password", "Login with OTP", "Continue as Guest"]) {
    assert(auth.includes(label), `AuthLanding missing ${label}`);
  }
  const modal = source("src/components/auth/AuthModal.jsx");
  assert.match(modal, /<CustomModal\s/);
  assert.match(modal, /initialView/);
});

test("Account menu keeps logout confirmation and guest-only entry", () => {
  const menu = source(
    "src/components/header/second-navbar/account-popover/AccountMenuPanel.js",
  );
  for (const required of [
    "CustomDialogConfirm",
    "setLogoutUser",
    "clearAllCartData",
    "onSignInClick",
    "hideLoginButton",
  ]) {
    assert(menu.includes(required), `AccountMenuPanel missing ${required}`);
  }
});
