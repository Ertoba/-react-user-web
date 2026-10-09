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

## 2026-10-09 — Search sorting and pharmacy list-view candidate (historical)

- Reported URL: `mili.ge/search?search=category&id=670&name=მედიკამენტები&data_type=category&module=afliaqi`.
- Reported symptoms: default/price sorting selections did not affect product order; clicking List View blanked the page.
- Root causes identified in code:
  - `src/components/home/search/index.js` tracked `sortBy` and `newSort` locally but did not include `sort_by` in API `pageParams`, so selecting sort did not reach `useGetSearchPageData`.
  - The search hook is disabled by default and only fetched through a scroll intersection sentinel, so sorting while sentinel is out of view could also fail to fetch; a guarded refetch is required when selection changes.
  - `src/components/cards/ProductCard.js` used `item?.generic_name[0]` in its pharmacy-only list view. Optional chaining on `item` does not guard `generic_name`, so missing data causes a render-time TypeError.
  - Mobile `NewSortBy` received `sortBy` prop instead of `newSort`.
- Candidate branch: `fix/search-sort-list-view-20261009` from main `7d6b3dd`.
- Fixes:
  - Backend price sort values `high -> price_high_low`, `low -> price_low_high`; `default` resets sort.
  - Store sort values `fast_delivery` and `nearby` are sent via `sort_by`; default omits it.
  - Guarded refetch on sorting changes; retain infinite pagination and existing filtering.
  - Defensive generic-name formatting for null, string, number and array values in legacy horizontal pharmacy card.
  - Targeted regression checks in `tests/search-results.test.mjs`.
- Status at candidate stage: pending CI/QA; historical draft note. See merged status below.

## 2026-10-09 — Search sorting / list view merged to main

- GitHub PR #4: https://github.com/Ertoba/-react-user-web/pull/4
- **MERGED** at 2026-10-09T02:51:48Z. Merge SHA `2e53e2747ad9b9a4d86d19efb48afc0adab27e80`. Main branch ref verified at exactly this SHA immediately after merge.
- Implemented server-backed search sort mapping and guarded refetch, default reset, mobile sort selection prop fix, and safe optional pharmacy generic name rendering for list view.
- Added `tests/search-results.test.mjs`; the Production QA Audit `checks` job (ESLint, TypeScript, Node tests) passed on PR head `da9c08c82154c41a42a8f19632efde184282de1f`, workflow run `37876369743`.
- Full browser QA was **still running at time of merge**; unrelated existing fixture/hydration failures are tracked in issue #3. Do not claim that these fixes were visually smoke-tested on deployed `mili.ge`.
- **No production deploy** has occurred. Existing production bundle may still display prior bugs until controlled build/smoke and deployment.

## 2026-10-09 — V4.2 offers/free-delivery/nearby loading audit (candidate)

- Audited main `ce6cbafc610011817cd4a538ba9a5ed5c1679ab8` against the user-provided original V4.2 React ZIP.
- **Verified regression:** `pages/home/[...slug].tsx` passes `routeSection` to `ModuleWiseLayout`, but the MILI layout dropped that prop and never forwarded it to `HomePageComponents`. The sidebar then falls back to `overviewContent`, so visiting `/home/offers`, `/home/free-delivery`, and `/home/nearby` fails to select their corresponding section. Original V4.2 layout forwards both `routeSection` and `routeCategory`.
- Fix branch `fix/v42-section-route-propagation-20261009` restores these two prop forwards with no changes to other MILI logic.
- `tests/v42-home-sections.test.mjs` adds guards for the nested route data flow, all four module section definitions, dedicated offers API URLs, and combined-search `quick_action=free_delivery|nearby` API parameter flow.
- Offers hooks request `/api/v1/offers/items` and `/api/v1/offers/stores` and render product/store sections; free-delivery and nearby use `/api/v1/get-combined-data` with fixed `quick_action` values.
- Nearby depends on `currentLatLng` client storage: Axios sends lat/lng, falling back to zeros. Server-side availability of offers endpoints, accuracy of backend free-delivery/nearby filtering, and the live mili.ge pages **could not be verified** with accessible runtime; do not claim backend is certified.
- Production not touched. Run Node/TS checks and browser smoke; report deployment separately.

## 2026-10-09 — Offers / Free Delivery / Nearby route fix merged and backend audit

- React PR: https://github.com/Ertoba/-react-user-web/pull/5 — **merged to main**, squash SHA `7febb08762fd281c56ec7d402ed3c1048ee0ac79` confirmed on main. The change forwards `routeSection` and `routeCategory` through `ModuleWiseLayout`, allowing nested `/home/offers`, `/home/free-delivery`, `/home/nearby` to select the intended components. Static CI checks passed; full browser QA still in progress at merge, baseline caveats remain.
- Backend `Ertoba/portal-backend` main SHA audited: `e8fc69b905b38d9c4c63aabeac00da30897c0676`.
- **Critical backend Offers route collision**: `routes/api/v1/api.php` registers `offers/items` and `offers/stores` first to the real Customer ItemController actions, then registers duplicate URL/method aliases to `MiliV4CompatibilityController`, whose handlers return empty item/store arrays. This can shadow the real offers and cause empty results. Minimal corrective **DRAFT backend PR #5**: https://github.com/Ertoba/portal-backend/pull/5 removes only the two redundant empty aliases and adds OffersRouteResolutionTest. Not merged or deployed pending isolated PHP/Laravel test and route-cache check.
- Free Delivery filtering uses store.free_delivery=1; combined item search applies free_delivery to the parent store. Nearby uses server-side distance sorting for items/stores with latitude/longitude headers derived from client currentLatLng. Missing position supplies 0/0; results should not be called location-certified without valid coordinates.
- No server/production deployment has occurred. Current production code/route cache and true live API responses not inspected.
