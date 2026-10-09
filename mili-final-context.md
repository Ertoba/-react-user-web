# MILI React — final context (V4.2 UI audit)

## 2026-10-09 — Draft PR #2 status (historical, before merge)

- Production website: `mili.ge`; **at the time of this draft snapshot**, PR #2 had not been merged into `main` or deployed.
- Comparison base: `main` at commit `5f7bbc52324826bac39866afd447c8816de7106b`.
- V4.2 reference: user-supplied `React-user-website private licemze.zip` / `6amMart React`.
- Candidate branch: `audit/v42-ui-selective-20261008`.
- Effective intended UI patch: Desktop AccountPopover displays the richer existing `AccountMenuPanel`; legacy SecondNavbar now forwards `token` and `onSignInClick` for auth modal integration. The current NewNavBar already forwards both props.
- Authenticated mobile profile currently goes through `BottomNav` to `/profile` and renders `MobileProfileOverview` (already present in MILI). Guest navigation opens `ProfileDrawer`. Therefore, a previous change to show an authenticated card inside `ProfileDrawer` had no normal user-visible effect and was reverted, alongside an inactive profile menu label fallback.
- Original V4.2 ZIP does **not** contain `MobileProfileOverview.js`; it is a MILI customization and must not be overwritten blindly.
- Existing OTP fixes, AI, Georgian/Russian, product/store/cart/service flows have not been replaced.
- Static code checks job (lint, TS, typography tests) passed for PR #2.
- Full browsers QA failed on the **same baseline**: production-audit workflow on original `main` SHA `5f7bbc5` (run `37801366466`) and PR #2 (run `37817051427`) had the identical Chromium/Firefox/WebKit summary per browser: 36 passed, 328 failed, 164 blocked, 96 excluded, and 0/4 interactions passed. This strongly suggests existing fixture/runtime/test environment defects; it does not prove UI patch correctness.
- Next action at this stage: isolate baseline QA failures separately and run targeted signed-in/guest popup smoke and visual checks. Subsequent merge status appears below.
- At this draft stage, no changes to `main` or production had yet been made. See final integration status below.

## 2026-10-09 — ZIP blob parity verification and focused regression tests

- Independently computed Git blob SHA1 for files inside the original V4.2 ZIP and matched the GitHub `main` tree at `5f7bbc5`.
- **Byte-identical:** `NewNavBar.js`, `MobileNavBar.js`, `AuthLanding.jsx`, `AuthModal.jsx`, `BottomNav.js`, `ProfileDrawer.js`, `HomeCategoryBrowser.tsx`, `ModuleHomeSidebarLayout.tsx`, `ManageSearch.js`, `NavCategory.js`, `MobileSearchOverlay.js`, `MobileSearchPageBar.js`, and `pages/home/index.js`.
- **Differ intentionally/review needed:** `UserInformation.js`, `MainLayout.js`, `SignInForm.js`, `OtpLogin.jsx`, `AccountMenuPanel.js`, `AccountLanguageButton.js`, `pages/profile/index.js`, `pages/_app.js`. Preserve MILI behavior and re-test rather than overwriting.
- The original V4.2 dropdown wrapper contained the full `AccountMenuPanel` and RTL anchor alignment; this branch restores that design wiring to the active MILI navbar.
- `tests/v42-account-ui.test.mjs` validates JSX wiring in both desktop navbars, modal/OTP entry points, authenticated vs guest mobile routes, and a stubbed runtime of the actual dropdown wrapper in RTL/LTR guest/auth modes.
- Old full-browser test failures remain an unresolved independent blocker for claiming full end-to-end readiness. The scoped regression test covers component wiring but cannot establish a true authenticated browser session by itself.

## 2026-10-09 — PR #2 merged into main (verified)

- PR: https://github.com/Ertoba/-react-user-web/pull/2
- **MERGED** on 2026-10-09 at 02:41 UTC, squash commit `f8585360af837b4ee13dd00489bbffb2a9ac81a4`; main ref confirmed pointing to that SHA immediately after merge.
- Actual source changes limited to `src/components/header/second-navbar/account-popover/index.js` and `src/components/header/second-navbar/SecondNavbar.js`. Added `tests/v42-account-ui.test.mjs` and this context file.
- The final candidate `checks` job (TypeScript, lint, typography tests, and new targeted V4.2 account tests) completed successfully in run `37875313296`.
- Full Chromium/Firefox/WebKit QA had not completed at the point of merge and previously failed on the unmodified main baseline. Its existing blockers are tracked separately in https://github.com/Ertoba/-react-user-web/issues/3.
- **MILI production deployment was NOT performed by this change**. A main merge is not proof that `mili.ge` uses the new bundle. Production rollout requires controlled build, a candidate smoke check, and deployment verification.
- Do not call the full V4.2 UI pixel-perfect or production browser-certified until authenticated/guest visual smoke and baseline browser QA issues are resolved.
