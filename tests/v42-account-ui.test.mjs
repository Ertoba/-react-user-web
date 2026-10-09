import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import vm from "node:vm";

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

/**
 * Execute the actual popover function with stubbed React/MUI rendering so we
 * cover prop forwarding for both authenticated and guest sessions without
 * requiring the legacy API fixtures that block full-browser QA.
 */
const renderAccountPopover = ({ direction, token }) => {
  const path = "src/components/header/second-navbar/account-popover/index.js";
  const js = ts.transpileModule(source(path), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: path,
    reportDiagnostics: true,
  });
  assert.equal(js.diagnostics?.length ?? 0, 0);
  const reactJsx = (type, props) => ({ type, props });
  const requiredModules = {
    react: { __esModule: true, default: {} },
    "react/jsx-runtime": { jsx: reactJsx, jsxs: reactJsx },
    "@mui/material": { Fade: "Fade", Popover: "Popover" },
    "./AccountMenuPanel": { __esModule: true, default: "AccountMenuPanel" },
    "helper-functions/getLanguage": { getLanguage: () => direction },
  };
  const module = { exports: {} };
  vm.runInNewContext(js.outputText, {
    module,
    exports: module.exports,
    require: (name) => {
      assert(Object.hasOwn(requiredModules, name), `Unexpected dependency ${name}`);
      return requiredModules[name];
    },
  }, { filename: path });

  const onSignInClick = () => "open modal";
  const onClose = () => "close dropdown";
  const cartListRefetch = () => "refetch grouped cart";
  const render = module.exports.default({
    open: true,
    anchorEl: "profile",
    token,
    onClose,
    onSignInClick,
    cartListRefetch,
  });
  return { render, onSignInClick, onClose, cartListRefetch };
};

test("V4.2 account popover handles guest Login/Signup and RTL geometry", () => {
  const { render, onSignInClick, onClose } = renderAccountPopover({
    direction: "rtl",
    token: undefined,
  });
  assert.equal(render.type, "Popover");
  assert.equal(render.props.anchorOrigin.horizontal, "left");
  assert.equal(render.props.transformOrigin.horizontal, "left");
  assert.equal(render.props.onClose, onClose);
  const panel = render.props.children;
  assert.equal(panel.type, "AccountMenuPanel");
  assert.equal(panel.props.token, undefined);
  assert.equal(panel.props.onSignInClick, onSignInClick);
});

test("V4.2 account popover preserves auth token and cart refetch in LTR", () => {
  const { render, cartListRefetch } = renderAccountPopover({
    direction: "ltr",
    token: "test-session-token",
  });
  assert.equal(render.props.anchorOrigin.horizontal, "right");
  const panel = render.props.children;
  assert.equal(panel.props.token, "test-session-token");
  assert.equal(panel.props.cartListRefetch, cartListRefetch);
});
