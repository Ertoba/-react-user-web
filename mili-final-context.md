# MILI React — final context (V4.2 UI audit)

## 2026-10-09 — Draft PR #2 status

- Production website: `mili.ge`; this PR has **not** been merged into `main` or deployed.
- Comparison base: `main` at commit `5f7bbc52324826bac39866afd447c8816de7106b`.
- V4.2 reference: user-supplied `React-user-website private licemze.zip` / `6amMart React`.
- Candidate branch: `audit/v42-ui-selective-20261008`.
- Effective intended UI patch: Desktop AccountPopover displays the richer existing `AccountMenuPanel`; legacy SecondNavbar now forwards `token` and `onSignInClick` for auth modal integration. The current NewNavBar already forwards both props.
- Authenticated mobile profile currently goes through `BottomNav` to `/profile` and renders `MobileProfileOverview` (already present in MILI). Guest navigation opens `ProfileDrawer`. Therefore, a previous change to show an authenticated card inside `ProfileDrawer` had no normal user-visible effect and was reverted, alongside an inactive profile menu label fallback.
- Original V4.2 ZIP does **not** contain `MobileProfileOverview.js`; it is a MILI customization and must not be overwritten blindly.
- Existing OTP fixes, AI, Georgian/Russian, product/store/cart/service flows have not been replaced.
- Static code checks job (lint, TS, typography tests) passed for PR #2.
- Full browsers QA failed on the **same baseline**: production-audit workflow on original `main` SHA `5f7bbc5` (run `37801366466`) and PR #2 (run `37817051427`) had the identical Chromium/Firefox/WebKit summary per browser: 36 passed, 328 failed, 164 blocked, 96 excluded, and 0/4 interactions passed. This strongly suggests existing fixture/runtime/test environment defects; it does not prove UI patch correctness.
- Next: isolate baseline QA failures separately and run targeted signed-in/guest popup smoke and visual checks for this PR before merge.
- Do not merge or deploy until verified. No changes to `main` or production have been made by this audit.
