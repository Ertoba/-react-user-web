# MILI — authoritative final context (V4.2)

> **CURRENT SOURCE OF TRUTH:** use the 2026-10-27 snapshot below for the current workstation, repository, validation, and production-readiness state. Every later section is retained as dated history and is not a current production assertion when it conflicts with this snapshot.

## 2026-10-27 — Authoritative recovery and production-management snapshot

### Current verdict

- The deleted local development environment has been reconstructed inside the single workspace `C:\Users\miro\Desktop\მილი`.
- All five canonical repositories have full Git history and clean `main` branches. Vendor and Delivery recovery fixes were pushed and their remote SHAs were verified.
- Public production availability is currently healthy, but the full V4.2 production release remains **NO-GO / NOT CERTIFIED**. This recovery did not deploy, restart, migrate, seed, modify Firebase, run a real Keepz transaction, or change production data.
- The laptop no longer has an authorized production SSH private key. Port 22 is reachable, but authenticated internal production state cannot be re-verified until the owner restores a key under the protected local `ops/secrets/` directory. Do not treat the 2026-10-25 internal server SHAs as current facts.

### Canonical workspace and rebuild paths

- Sole active workspace: `C:\Users\miro\Desktop\მილი`.
- Source repositories: `C:\Users\miro\Desktop\მილი\repos`.
- Sole rebuild/cache root: `C:\Users\miro\Desktop\მილი\build-workspace`.
- Final artifacts: `C:\Users\miro\Desktop\მილი\artifacts`.
- Toolchain: `C:\Users\miro\Desktop\მილი\tools`.
- Operations/runbooks: `C:\Users\miro\Desktop\მილი\ops`.
- Context/audits: `C:\Users\miro\Desktop\მილი\context`.
- Reports: `C:\Users\miro\Desktop\მილი\reports`.
- Windows Flutter/Dart tools must use the ephemeral `M:` SUBST alias created by `ops/Enter-MiliEnvironment.ps1`. It points to the same `მილი` directory and works around a Dart LSP Unicode-path transport failure; it creates no files outside the workspace.
- Do not create a MILI clone, build directory, dependency cache, QA report, or temporary worktree elsewhere on the Desktop.

Recovered historical files were moved into the workspace:

- `context/history/mili-final-context-legacy-20261015.md`;
- `context/audits/MILI_V42_FULL_AUDIT-20261025.txt`;
- `context/audits/MILI-OFFICIAL-V42-ORDER-FLOW-AUDIT-CONTEXT-20261026.txt`.

### Current repository state

| Component | Current validated/pushed `main` | State |
|---|---|---|
| Backend/Admin | `afa23e6b4e421abd8781c0ae95c8dd2f0d0dcae0` | clean, equals `origin/main`; workstation bootstrap/runbook versioned |
| Customer Flutter | `b0489615d2be85483a867e9cf3b29166b8ecafa0` | clean, equals `origin/main` |
| Vendor Flutter | `99ca2df8968b7d1329a376da5b6bf14052b40d8a` | clean, pushed; GitHub Production QA success |
| Delivery Flutter | `80a4674c8af79d0e354622cff7bfa4b714b4b26d` | clean, pushed; GitHub Production QA success |
| React Web | application/build baseline `8f2cfcdde98acf94e0a0944abb532a6011a6c02a` | clean before this documentation update; this context-only commit advances `main` without changing the application tree |

Vendor commit `99ca2df` restores official V4.2 BOGO/Happy Hour/Service notification contracts, safe notification ID parsing, local-notification terminated-launch recovery, Bundle/notification regressions, the Flutter 3.47.5 lock, and accurate Georgian handover wording. Delivery commit `80a4674` synchronizes the Flutter 3.47.5 SDK-pinned lockfile.

Backend commits `12c31b1` and `afa23e6` version the secret-free generic Windows workspace bootstrap, multi-repository status checker, and workstation production-management runbook. Machine-specific SSH keys, known-hosts, server overrides, and provider configuration remain local under `ops/` and are never committed.

### Restored local toolchain

- Flutter `3.47.5`, Dart `3.13.4`, revision `6a19cca564` at `tools/flutter-3.47.5`.
- Java `17.0.18`.
- Node `22.20.0`, npm `10.9.3`, Yarn `1.22.22`.
- Portable PHP `8.3.36` NTS with the Laravel test extensions at `tools/php-8.3.36-nts`.
- Local Composer `2.10.3` at `tools/composer`.
- `ops/Enter-MiliEnvironment.ps1` pins Pub, Gradle, Yarn, npm, Composer, Playwright, TEMP, and build caches under `build-workspace/`.
- Management entry points: `ops/scripts/Get-MiliRepoStatus.ps1`, `Test-MiliProductionPublic.ps1`, `Invoke-MiliProductionPreflight.ps1`, and `Compare-OfficialV42.ps1`.

### Official V4.2 and private-license boundary

- The owner-authorized official packages remain protected comparison inputs. No archive was copied into a repository or deployed.
- Activation, license, purchase-code, installer, updater-gate, and related sources are prohibited from every MILI `main`, application build, backend deployment, report body, and log.
- The final comparison denied 56 Backend activation-related paths before classification. Only explicitly selected activation-free files were materialized under `official-review/sanitized/`; that directory is never a deployment source.
- Official update practice was followed: compare the V4.1→V4.2 changed-file trees, preserve customizations, merge semantics instead of replacing customized files, and validate the resulting application.
- Final report: `reports/official-v42/MILI-OFFICIAL-V42-PARITY-VERDICT-20261027.md`; machine evidence: `official-v42-parity-20261027-140527.csv` and `official-v42-summary-20261027-140527.json`.

Final changed-file parity:

| Component | Official delta | Identical | Customized/different | Missing path | Classification |
|---|---:|---:|---:|---:|---|
| Backend/Admin | 3,578 | 3,381 | 142 | 55 | missing paths are coherent AI/Reels/Tax/RideShare architecture refactors; do not copy individually |
| Customer | 578 | 539 | 31 | 8 | docs/scripts plus a packaging-root Dart file already byte-identical at its correct app path; no runtime gap |
| Vendor | 265 | 101 | 156 | 8 | docs/editor/generated iOS plus inlined/unused helpers; proven notification gap fixed in `99ca2df` |
| Delivery | 123 | 14 | 105 | 4 | generated iOS ephemeral files plus documentation; no runtime gap |
| React | 407 | 318 | 89 | 0 | no missing V4.2 changed-file path |

The Backend 55-path delta is not permission to add isolated files. MILI already has functional AI, Reels, and Tax implementations under a different/custom module architecture; mixing the official modular controllers/services/resources into it would duplicate route and service contracts. Any future migration must be one coherent non-activation module migration with staging acceptance.

### Official order-flow verdict

Direct official source verification closed the prior audit gap:

- The normalized official and MILI modular Vendor order controller, DeliveryMan order controller, `OrderNotifier`, and order-notification message classes have the same order-flow semantics.
- Vendor flow intentionally allows `confirmed → processing → handover` without requiring `delivery_man_id` first.
- `handover` means **ready for handover / ready for delivery**, not necessarily already physically handed to a courier.
- A courier can claim an unassigned processing/handover order; assignment and the `accepted` timestamp are recorded while the current processing/handover status may remain.
- `picked_up` and `delivered` are later courier lifecycle events. Vendor continues after handover only for self-delivery/take-away cases.
- Do not add a `delivery_man_id` guard to Vendor handover and do not reorder these statuses based only on UI intuition.
- Vendor Georgian labels now say `გადასაცემად მზადაა` and `გადაწიე, როცა შეკვეთა გადასაცემად მზადაა`.

### Validation evidence

| Component | Local validation | Result |
|---|---|---|
| Backend | PHP 8.3.36 syntax sweep | PASS — 2,483/2,483 source files |
| Backend | Routes/Keepz/OTP/gateway PHPUnit selection | PASS — 33/33 tests, 587 assertions; 1 PHPUnit deprecation |
| Backend | complete 82-test suite | NOT GREEN — 36 missing-schema errors and 4 fixture/example failures because the full SQLite suite does not provision required tables/fixtures; targeted security suite remains green |
| Customer | Flutter 3.47.5 active analyzer | PASS with warning/info debt, no compile errors |
| Customer | full Flutter tests | PASS — 729/729 |
| Vendor | Flutter 3.47.5 active analyzer | PASS with warning/info debt, no compile errors |
| Vendor | full Flutter tests | PASS — 51/51 |
| Vendor | Android ARM64 debug APK | PASS; `artifacts/debug/mili-vendor-v42-notification-20261027-debug.apk`, SHA-256 `3B983110B02B06D709593456541CDCB6D2824B9B4D2E89AD075645CAB4DEBD5D` |
| Delivery | Flutter 3.47.5 active analyzer | PASS with warning/info debt, no compile errors |
| Delivery | full Flutter tests | PASS — 51/51 |
| React | Node source tests | PASS — 57/57 |
| React | Next type generation + TypeScript | PASS |
| React | Next lint | PASS exit 0 with existing Hook/image warnings |
| React | Next 15.5.9 production build | PASS; no Rental `formatNumber` missing-export warning |

The first Vendor Android build also reported future migration warnings for Kotlin `2.2.20`, Java 8 compatibility in dependencies, and plugins still applying KGP. These are not current build failures but must be handled before a future Flutter version makes Built-in Kotlin mandatory.

GitHub evidence:

- Vendor Production QA success on `99ca2df`: https://github.com/Ertoba/vendor-app/actions/runs/40443661201
- Delivery Production QA success on `80a4674`: https://github.com/Ertoba/delivery-app/actions/runs/40443947897
- Customer Production QA success on `b048961`.
- Backend read-only preflight and current distance/Keepz/OTP workflows are successful on their recorded `main` commits.
- React focused runtime smoke success on `219b35b`: https://github.com/Ertoba/-react-user-web/actions/runs/40318086580
- React broad Production QA failure on the same application line: https://github.com/Ertoba/-react-user-web/actions/runs/40318086588 — Service routes and synthetic fixture coverage remain blockers; local source/build success is not full browser certification.

### Current public production observation

At `2026-10-27T19:42:56+04:00`, the workspace public probe recorded HTTP 200 for:

- `https://mili.ge/`;
- `https://mili.ge/api/v1/config`;
- `https://mili.ge/login/admin`;
- `https://admin.mili.ge/` → Admin login;
- `https://vendor.mili.ge/` → Vendor login;
- `https://store.mili.ge/` → main site.

Evidence: `reports/production/public-probe-20261027-194256.json`. SSH port 22 is reachable.

This proves only public availability. It does **not** verify authenticated sessions, active server Git SHAs, dirty worktrees, Laravel migrations, queues, Reverb, PM2/Supervisor mappings, storage permissions, database configuration, Google Routes credentials, Keepz settlement, Firebase/APNs/FCM, or rollback packages.

The last internal read-only audit on 2026-10-25 observed Backend release `5d75e93`, React release `d1f816f`, queue/Reverb running, and PM2 `mili-react-279`. Those values are now historical and must be replaced only by a fresh authenticated inventory. No recovery action deployed GitHub `main` to production.

### Keepz authoritative integration rules

Keepz decisions must follow https://www.developers.keepz.me/:

- Test and production base URLs remain separate.
- Requests/responses use the documented hybrid AES-256-CBC + RSA OAEP-SHA256 envelope; private keys and decrypted payment data must never be logged.
- Callbacks are asynchronous status notifications. Return HTTP 200 only after safe receipt; reconcile missed callbacks with Get Order Status.
- Treat `integratorOrderId` as the provider binding/idempotency identity.
- Do not blindly retry validation/auth errors. Cancellation is allowed only for `INITIAL`/`PROCESSING`; refund is allowed only for documented success/refund states and completes asynchronously, so poll/reconcile status.
- Real order, refund, settlement, saved-card, subscription, or split-distribution tests require explicit owner authorization and Keepz test credentials. No such transaction occurred during recovery.

### Remaining production blockers

1. Restore an owner-authorized SSH private key inside `ops/secrets/` and run the read-only production preflight/inventory.
2. Verify active Backend/React releases, service processes, permissions, migrations, dirty state, disk, and rollback snapshots before any deploy.
3. Configure and staging-test the restricted server-side Google Routes key, billing, quotas, cache/fail-closed behavior, and representative delivery quotes.
4. Complete Keepz test callback/status/retry/cancel/refund/split/reconciliation acceptance without using live customer transactions.
5. Resolve Firebase project/bundle/APNs/VAPID consistency and run real-device foreground/background/killed notification tests.
6. Resolve the publicly tracked Customer keystore ownership/rotation decision before any store release.
7. Complete React Service route/fixture/authenticated browser E2E and the full browser matrix.
8. Repair the Backend full-suite SQLite migration/fixture harness; do not hide its current 36 errors/4 failures.
9. Build signed Android/iOS release artifacts from immutable SHAs with checksums and device acceptance.

Until these gates pass with rollback evidence, production deployment remains **NO-GO**.

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

## 2026-10-09 — Backend Offers route correction merged (final)

- Backend PR https://github.com/Ertoba/portal-backend/pull/5 **MERGED** with GitHub main commit `d246e9c1c28e32c00b32d7a3ece799557a41652b` (confirmed via GitHub).
- Two duplicate empty compatibility aliases for `GET /api/v1/offers/items` and `GET /api/v1/offers/stores` were removed. The pre-existing real V4.2 controller handlers and all other compatibility aliases remain.
- New backend `OffersRouteResolutionTest` confirms both URL/method combinations resolve to `App\Http\Controllers\Api\V1\Customer\Item\ItemController@offerItems/@offerStores`.
- Scoped CI `Offers Route Regression` run `37877873380` **passed** PHP lint, locked Composer installation, isolated app bootstrap, and both Laravel controller-route assertions. Workflow is PR-scoped and does not deploy.
- React PR #5 routing fix already merged at `7febb08762fd281c56ec7d402ed3c1048ee0ac79`; current React main has further docs commit `40b11bab231586aee13775146de4c3d92842d601` before this note.
- Neither updated React nor updated Laravel GitHub main has been deployed by these operations to production; live `mili.ge` rendering, backend route cache, offers data count, free-delivery & nearby location accuracy must be verified on staging/production before marking the feature operational.

## 2026-10-09 — Checkout digital gateway visibility and Georgian/Russian i18n repair

- User-provided screenshots: `mili.ge/checkout?page=parcel&module=amanati` and `mili.ge/checkout?page=buy_now&module=teqnika`. Both display online-payment heading without gateway options; many parcel/checkout texts fall back to English.
- **Backend root cause**: `app/Services/Payment/SettingService.php` restricted the fallback gateway catalog to stock methods when optional add-on publish flag was false, silently excluding locally supported `keepz`, `bog_pay`, and `flitt`. The backend config exposes that list as `active_payment_method_list`; React renders exactly this array.
- Backend fix: `Ertoba/portal-backend` PR #6 https://github.com/Ertoba/portal-backend/pull/6 **MERGED to main** at `301e0b84e548f2a4dd3fe5c6ce0afc977739b547`. Adds the three locally implemented payment methods to the fallback allowlist, while refusing to advertise DB-inactive, credential-disabled or live-site/test-mode gateways. No credentials created or changed. Isolated CI run `37882602139` passed.
- React candidate PR #6 https://github.com/Ertoba/-react-user-web/pull/6 adds `checkoutPaymentGateways.mjs` to normalize server-provided method list only when digital payment is allowed; both normal and parcel checkout show a translated availability message when enabled globally but no active provider was returned. No fallback/fake card gateway selection is created.
- Added 92 Georgian and 93 Russian (plus ~25 English) locale keys covering courier tips, parcel payer/instructions, Payment Method, zero-provider message, addresses/zip, Pro delivery-benefit text, and new V4.2 section search labels. Node regression test verifies payment catalog and selected bilingual checkout keys.
- Still pending: React PR static/browser CI and main merge. Neither repo deployed to production as part of this work. Real `/api/v1/config` output and Keepz live/test transaction could not be verified: ensure `addon_settings` gateway `is_active=1`, `mode=live`, `live_values.status=1`, and global `digital_payment` / zone digital permissions before expecting bank card methods to appear.
- Do not claim successful real card charging without a staging transaction. No changes to OTP, cart calculation, AI, or other APIs.

## 2026-10-09 — Checkout payment and i18n repair MERGED to both main branches

- Laravel backend PR #6 https://github.com/Ertoba/portal-backend/pull/6: merged SHA `301e0b84e548f2a4dd3fe5c6ce0afc977739b547`. Gateway catalog includes the local Keepz, BOG Pay, and Flitt adapters when the optional payment add-on publish flag is false, with active-credential/live-mode guards. PHP syntax and gateway visibility regression test CI passed on `37882602139`.
- React PR #6 https://github.com/Ertoba/-react-user-web/pull/6: merged SHA `5fdca58916453222e403f4080b1dfcb5f5f79200`. Normal and parcel payment dialogs use the backend-provided active gateway list (no fake providers) and explain the unavailable state if enabled globally but no active options. Parcel picker selection is isolated as draft and committed only on Update; Cancel discards draft.
- Checkout i18n: 92 new Georgian and 93 Russian keys plus missing English additions; courier tips, payer selection, delivery instructions, address and postal-code controls, Pro benefit labels, and payment availability. This is a **targeted checkout/parcel repair**, not full site translation parity; broader missing keys remain.
- React PR #6 static CI `37883182411`: **PASSED** ESLint, TypeScript, and Node regression tests at `09ea90a4d00537b4b0df6483e4ed0aff434c532f`. Chromium/Firefox/WebKit browser QA still running at merge; do not claim full browser QA passed.
- **Production deployment not performed.** `mili.ge` may still show the prior bundle until controlled production update. Backend online choices still require configured provider `is_active=1`, live gateway mode and live status, digital payment global + zone enabled. No live card transaction has been placed or verified.

## 2026-10-09 — V4.2 mobile profile 12-screen parity audit & scoped repairs

- Reference screenshots: original 6amMart V4.2 mobile account landing and subpages for Addresses, Orders & Trips, Track Orders, Monthly Cart List, Coupons, Referral, Loyalty Points, Subscription Plan, and footer; user added two more profile screenshots in the follow-up.
- Confirmed **byte-identical to source ZIP**: `ProfileOrdersPage.js`, `ProfileOrdersList.js`, `MonthlyCartListPage.js`, `CouponsTabbedPage.js`, `ModuleTabbedLayout.js`, `SubscriptionPlanPage.js`, `BottomNav.js`, `ProfileDrawer.js`. Existing MILI `MobileProfileOverview.js` is a custom, intentionally retained account page; do NOT overwrite it with the demo.
- **Actual regressions**:
  - `BodySection.js` dropped V4.2's `AddAddressComponent` route, so selecting Add Address on `/profile?page=addresses` showed no form. Restored the component and its refetch/edit callbacks.
  - Profile guest account access used only a `guest_id` in global `AuthGuard`, allowing requests from protected account subpages to fail with `Unauthenticated`. `/profile` now requires a customer token; other public guest routes remain usable.
  - Original V4.2 mobile subpages have sticky page-specific back/title bar and no legacy desktop profile-stat cards. MILI was still rendering old account details. Added mobile subpage header, preserved order-tab back-link and module context, and skipped desktop widget on small widths.
  - Profile inbox and order details wrap their own push notification handler; avoid double subscription wrapper.
  - `MonthlyCartListPage` could remain blank on deep links if Redux module list was uninitialized. `ProfileBody` now requests module list when needed.
  - Account menu `hidden` flags now handle both numeric `0` and serialized string `"0"` from API for Wallet/Loyalty/Referral/Pro/Monthly Cart.
  - `BodySection` now forwards delete-account state/actions through to `Settings`.
- Added `profileMobilePageTitles.mjs`, `profileAccess.mjs`, `tests/v42-profile-pages.test.mjs`, and six missing `ka` and six missing `ru` strings.
- Unchanged: MILI brand, OTP, AI, user/store/checkout logic, payment config and API calls. Demo screenshots are **not** evidence of authenticated MILI production; do not copy 6amMart logo/USD/demo subscription pricing/US contact information.
- Candidate branch `fix/v42-profile-mobile-parity-20261009` awaits checks; no production deploy. Verify actual authenticated vs guest profile, address addition, multi-module tabs, referral/loyalty and Pro live API on staging before production.

### Additional Settings parity finding

- Original V4.2 ZIP `src/components/settings/index.js` includes theme/language rows and a confirmed Delete Account modal, whereas MILI main had the older two large settings cards (Theme/Language only); migrated the V4.2 row-based layout while retaining MILI's existing `DeleteAccount` component and backend delete hook.
- The deletion action is gated by the existing callback and an explicit confirmation modal; no automatic or new data deletion mechanism has been introduced.
- Localized Theme, Delete Account and permanent-deletion warning strings in Georgian/Russian. Added a regression guard for settings controls.

### Reactive mobile navigation localization

- V4.2 `BottomNav.js` constructed translated text via `t("...")` once at module import. If user changed language after initial load, labels could stay in the original language. Preserved its original four tab definitions and routes while using literal translation keys and the `useTranslation` hook at render time.
- Added a targeted regression test to verify mobile Offers, Orders, Favourite and Profile labels remain language-reactive.

### Module tabs translated within account

- `ModuleTabbedLayout.js` (Orders & Trips/Coupons) and `MonthlyCartListPage.js` previously rendered `mod.module_name` untranslated; they now render `t(mod.module_name)` while selection continues to use the original module IDs/types.
- Added missing common module label translations to Georgian/Russian for Grocery, Pharmacy, Shop, Rental, Market(s), Service, Taxi and Medicine; existing Georgian module display strings remain untouched if not keyed in the locale.

## 2026-10-10 — V4.2 profile mobile parity PR #7 merged to React main

- React PR #7 https://github.com/Ertoba/-react-user-web/pull/7 merged as `0d25eaa4d1c05ae5a7a815f50b947b01070d9fad`. Source branch `fix/v42-profile-mobile-parity-20261009`, candidate head `3ed0f7087796a056e57a7bb9aa9eb1f297aed134`.
- Changes: working Add Address entry in `/profile?page=addresses`; token-only profile guard (anonymous/guest checkout routes remain as before); translated V4.2 mobile profile subpage heading/back; preserve module selection and order detail back navigation; prevent duplicate push wrappers in Inbox and Order Details; module loading for Monthly Cart direct entry; proper numeric/string status gating on profile menu; user Settings rows with theme, language, and existing two-step Delete Account confirmation. Existing 6amMart/MILI Orders, Coupons, Pro, Loyalty, Referral, Wallet and Inbox components are retained.
- QA GitHub Actions `37912745161`: checks job PASS (ESLint, TypeScript, Node regressions). Browser jobs Chromium, Firefox and WebKit FAIL with the same baseline-wide local API fixture block/error pattern; chromium 36 passed, 328 failed, 164 blocked, 96 excluded; failures include local fixture requests and chat/recovery timeouts. Do not claim browser QA or end-to-end authenticated profile flow passed.
- **Not deployed to mili.ge** by this merge. Production operator must fetch latest `main`, rebuild Next.js, then restart only PM2 `mili-react` with controlled rollback. Live user authentication, address save, settings delete-account confirmation, monthly cart and Pro/Inbox API must be tested with dedicated authorized test account. Do not execute account deletion as part of routine smoke testing.


## 2026-10-11 — Store details SSR V4.2 envelope hotfix

- Production symptom at `/store/musi?module=teqnika&openCart=1`: store title `undefined - undefined`, product request `store_id=undefined`, empty store-cart drawer while All Cart shows an item.
- Verified backend `/api/v1/stores/details/musi` returned HTTP 200, V4.2 envelope `{identical_code,message,content,errors}` with store `id=20` (პორტალი), `module_id=5` using header `moduleId: teqnika`.
- Root problem addressed in `pages/store/[id]/index.js`: SSR previously passed the entire envelope as `configData` and `storeDetails`. Updated both reads to `getApiContent(await response.json())` and guard missing `storeDetails.id`, matching existing API response helper behavior and retaining legacy direct-payload support.
- React main code fix commit `2ffc6795146beec89cfc49668f75ae60fbda5975`. API envelope validated; production Next.js build/restart and cart retest **not yet verified at time of this entry**. On VPS `/var/www/store_react` local identical code patch already present; sync main, run build and restart `mili-react`, then verify store title, items request and cart. Other suspected `module_id` cart-filter issue is unconfirmed and unmodified.


## 2026-10-11 — Checkout instruction localization and module count correction

- User screenshots on `mili.ge/checkout?page=cart&module=...` confirmed: card/online payment not listed, backend-provided delivery instruction choices remained English (Leave at the door, Avoid ringing bell, Leave with security, Hand it to me), generic `Something went wrong` toast. Module tile for `teqnika` showed `0 Product` despite four known stores.
- Fixed module tile `src/components/landing-page/hero-section/module-selection/ModuleSelectionRaw.js`: V4.2 may omit ecommerce `items_count`; fall back to available `stores_count` **labelled Stores**, not products, or hide the summary if neither is known. Display exact known counts (remove artificial `count-1+` undercount). Test `tests/module-selection-counts.test.mjs`.
- Fixed delivery instruction **display labels only**: in `DeliveryInfo.js` and `DeliveryInstruction.jsx`, use `t(instruction)` while preserving raw English instruction identifiers in checkout state/API submission. Added exact four server strings plus generic `Something went wrong` translations to `src/language/ka.js` and `ru.js`. Extended `tests/checkout-online-localization.test.mjs`.
- **Card/online payment NOT yet fixed**: `OtherModulePayment.js` intentionally requires zone `digital_payment`, config `digital_payment` and `digital_payment_info.digital_payment`, and nonempty `active_payment_method_list` gateway names. Must examine live **nonsecret status flags and gateway names**; never fake-enable unsupported gateway or expose API keys.
- **Generic checkout error NOT yet diagnosed**: need failing browser Network request/response status and sanitized error payload or backend logs. Translating generic text only affects message language, not its cause.
- Files committed on React `main` (head at this entry `384aeb73a335bb52177dd26d2395f751661a7e07`); **production build, PM2 restart, and live QA not yet verified**. VPS root volume reported 91% used/6.6GB free; build should be controlled after reconciling any local edits.

## 2026-10-11 — Keepz production checkout recovery and backend main sync

- Production backend: `/var/www/mili` serves `https://mili.ge/api/v1/config` via Nginx/PHP 8.2-FPM. Root cause of missing Keepz method: production `app/Services/Payment/SettingService.php` used a fallback allowlist excluding `keepz` while `addon_settings` had `keepz` active and `get_payment_publish_status[0].is_published` was null. Added only `keepz` to production allowlist, backed up original to `/root/mili-SettingService-20261011-051834.bak`, reloaded PHP-FPM; public API then returned `active_payment_method_list: [{gateway: keepz, ...}]` and `digital_payment: true`.
- Root cause of redirect-to-home: `PaymentLinkService` uses `App\\Traits\\Payment\\PaymentTrait`, not the similar `app/Traits/Payment.php`. Production `app/Traits/Payment/PaymentTrait.php` lacked `'keepz' => 'payment/keepz/pay'`, returning false from gateway mapping. Added only missing mapping; production backup: `/root/mili-PaymentTrait-20261011-053750.bak`; PHP lint passed, FPM reloaded. `route:list --path=payment/keepz` showed pay/success/fail/callback; unauthenticated GET to pay without `payment_id` correctly yielded HTTP 400. User confirmed checkout redirect issue fixed.
- Synced **backend GitHub `Ertoba/portal-backend` `main`** with missing `PaymentTrait.php` mapping via commit `7eba3417482b776bcc0c5542d68e2411c1698e33`. Backend `main` already had `keepz` in `SettingService::BUILT_IN_PAYMENT_GATEWAYS` plus credential/mode-status validation, so **did not overwrite** this newer file with the older production hotfix. On next backend deployment, verify live Keepz config passes the additional `live_values.status` filter before replacing production `SettingService.php`; never blind-sync old/new files. No full end-to-end settlement/callback/paid-status verification performed. Do not create live transactions just for checking.

## 2026-10-12 — Ecommerce cart cutlery scoping and Reels stream route

- User mobile screenshots of `mili.ge/store/musi?module=teqnika` showed an ecommerce/tech cart offering **Add Cutlery** with the food-only explanatory text. Root cause: `src/components/store-details/StoreCartSidebar.js` rendered cutlery for every module *except grocery* (so ecommerce was included), and pushed `addCutlery: true` into Redux by default. Fixed sidebar to render cutlery **only for ModuleTypes.FOOD**, persist `addCutlery` only for food, and clamp `cutlery: 0` for non-food order payloads in `src/components/checkout/item-checkout/index.js`. Do not alter food cutlery opt-in/default without separate product decision.
- User Reels screenshot showed permanent buffering spinner. Root cause identified from production Nginx routing previously supplied in chat: `mili.ge` forwards every `/api/*` path to Laravel/PHP, whereas ReelsModal requested `/api/reels/stream` implemented only as Next.js `pages/api/reels/stream.js`. Changed Next `next.config.js` to rewrite public `/reels-stream` -> internal `/api/reels/stream`; `src/components/home/trending-bites/ReelsModal.tsx` requests `/reels-stream` so Nginx's generic `location /` forwards to Next at port 3000. Added video error/stalled timeout + retry UI so failure cannot spin forever; eliminated duplicate full-file download competing with native playback, and stopped unbounded 200-range preloads when Content-Range is absent. `src/api-manage/hooks/react-query/reels/useGetReelsDetails.js` now fetches JSON metadata without `stream=1` or a Range header.
- Regression tests in `tests/checkout-reels-routing.test.mjs` cover food-only cutlery, Next rewrite, video error handling, and metadata requests. Changes committed directly to React GitHub `Ertoba/-react-user-web` `main` on 2026-10-12 (cutlery commits `09274af`, `8375027`; Next rewrite `b5ee81c`; Reels modal `4f87239`, `53222d4`; details hook `9aee412`; regression test `52b5b4c`). **Production not yet redeployed or browser-verified**, and GitHub CI not yet confirmed. Deploy carefully after checking server worktree/disk space; `next.config.js` rewrites require a Next rebuild and PM2 restart. After deploy verify `GET https://mili.ge/reels-stream?reel_id=<existing_id>` produces correct media response (authenticated as needed) without calling live payment/order APIs. Root cause and path depend on previously inspected Nginx config; do not modify Laravel /api routing for this fix.

## 2026-10-12 — Backend AI nearby-store failures after V4.2 upgrade (partial production repair; original method restored on GitHub)

- On `mili.ge` ecommerce AI chat, the exact prompt "იპოვე მაღაზიები ჩემთან ახლოს" returned `I'm sorry, I couldn't process that right now. Please try again.`. Production Laravel log (`AiChatService: agent prompt failed`) first showed `Non-static method App\\CentralLogics\\Helpers::getPriorityList() cannot be called statically`, then after fixing it showed `Call to undefined method App\\Models\\Store::topItemsByIds()`.
- Production `/var/www/mili/app/CentralLogics/Helpers.php` `getPriorityList` was changed from non-static to `public static function` with verified PHP syntax; backup `/root/mili-Helpers-20261012-065846.bak`. PHP-FPM `php8.2-fpm` was reloaded and active; the newer missing-method error confirms first error resolved.
- The GitHub backend `upgrade-v42-20261002` branch and `main` lacked `Store::topItemsByIds`, although `app/CentralLogics/StoreLogic.php` calls it at three sites. The **pre-V4.2 backup branch** `backup/pre-v42-20261002`, however, contains the original functioning `topItemsByIds(array $storeIds, int $limit = 5)` implementation in `app/Models/Store.php`. The original was copied verbatim (not reinvented) into backend `Ertoba/portal-backend` `main`, commit `4dd73330a3f4267acdbe5c61193452303804fae6`. GitHub backend `main` also received the exact static `getPriorityList` declaration correction, commit `19cd44038b849167e5b5c8d93a8713ce384f7330`.
- User supplied the official `6ammart main private license V4.2.zip` in ChatGPT Library; found it and `MILI_V42_OFFICIAL_BASELINE_PACKAGE.zip`, but the archive contents could not be inspected because the container runtime returned a system error. Do **not** claim direct verification of the ZIP internals. The V4.2 branch checked was the GitHub import; the restored helper source was explicitly the earlier pre-V4.2 GitHub backup.
- **Pending:** production `Store.php` has NOT yet been patched with `topItemsByIds` and customer-facing AI nearby-store query has NOT been re-tested after this second fix. Apply the exact method surgically (with backup and `php -l`), reload PHP-FPM as needed, test the AI chat and inspect new logs. Do not wholesale `git pull` the backend production worktree: it contains carefully reconciled payment customizations including Keepz. Confirm after end-to-end success.

## 2026-10-12 — MILI green monogram rebrand and Flutter 4.2 splash rollback (in progress)

- User supplied a **final square green textless MILI monogram** (ChatGPT upload `1255.png`) as the exact brand reference. The scope is ALL visible brand surfaces: React/Next web header/auth/footer/favicons/PWA, Laravel admin login/header/sidebar/favicon and runtime logo settings, plus Customer, Vendor and Delivery Flutter app logo/auth assets and Android/iOS app icons. Preserve logo geometry, aspect ratio, transparency and platform-specific safe areas. Do not put text inside icon art; original V4.2 splash UI/navigation should be preserved/restored. Flutter APK/AAB rebuild postponed by the user.
- Repositories confirmed: `Ertoba/-react-user-web`, `Ertoba/portal-backend`, `Ertoba/mart-app`, `Ertoba/vendor-app`, `Ertoba/delivery-app`. Production web path `/var/www/store_react`; admin/backend path `/var/www/mili`. No production rebrand deployment performed.
- Official uploaded V4.2 archives located in ChatGPT Library: `6ammart main private license V4.2.zip`, `vendor app private license V4.2.zip`, and `delivery man private license V 4.2.zip`. Their compressed internal files are **not yet verified** because local Python/container file operations returned runtime system errors. Do not claim ZIP-internal source comparison; cross-check against GitHub-known V4.2 snapshots instead.
- Flutter source inspection: Customer `main` `lib/features/splash/screens/splash_screen.dart` already displays centered `Images.logo` at width 200 (previous custom full-screen dark-green splash existed at `backup/pre-customer-v42-main-20261004`). Vendor `main` already matches `backup/vendor-v42-validated-20261004` default centered `Images.logo` + `suffix_name` splash; old custom splash existed at `backup/vendor-main-pre-v42-20261004`.
- Delivery `main` still used custom `backgroundColor: Color(0xFF074B3B)` with full-screen `Images.splashScreen`. **Changed only delivery Flutter splash presentation**, restoring centered/padded `Images.logo` (width 200) and `suffix_name`, matching the original standard pattern also present in delivery's legacy nested `Delivery Man App/lib/features/splash/screens/splash_screen.dart` and V4.2 Vendor. Retained active Delivery app's notification and Pusher routing, version check, maintenance/auth flows. Committed to `Ertoba/delivery-app` **main**, SHA `6e71ebc3479a9319b4f21c3720c11086e1d1ab36`. Verified new imports `Dimensions.paddingSizeLarge` and `robotoMedium` are defined. No Flutter build/test run.
- **Remaining**: source the user's exact uploaded PNG bytes for accurate transparent/logo/launcher variants; current local artifact/container runtime and Adobe upload connector failed, so binary asset processing was not performed. Do not replace the final user-provided mark with a manually approximated logo or deploy broken image URLs. Audit native Android/iOS launch screens and restore custom native splash backgrounds with actual V4.2 reference. Audit runtime Laravel branding settings (not only static assets) and React dynamic logo references. Upload all verified binary assets across repos and run appropriate QA; only then main/deploy for web/backend. No production rollout and no app rebuild should be claimed complete.

- Follow-up on delivery Flutter splash: the imported V4.2 source at `Ertoba/delivery-app` branch `upgrade-v42-20261002`, file `lib/features/splash/screens/splash_screen.dart`, explicitly uses `Text(AppConstants.appName, ...)` beneath `Images.logo`, not `suffix_name`. Updated the active delivery `main` splash caption to `AppConstants.appName` in commit `579be596fdd18a499b9f7d9cbf56e00162ffdf53`, preserving all runtime behavior. Verified `robotoMedium` and `Dimensions.paddingSizeLarge` exist in target repo. **Flutter splash Dart presentation is reverted; Android/iOS native splash assets remain not restored.**
- React logo refs are already centralized in `src/components/logo/brandAssets.js` (normal `/static/mili-customer-mark-transparent-20260801.png`, auth `/static/mili-auth-wordmark-transparent-20260808.png`, favicon `/static/mili-customer-favicon-brand-20260731.png`) and `pages/_document.js` has hardcoded favicon and touch-icon refs. These should be updated only after exact user PNG is available in repository; otherwise old/broken branding renders. No placeholder or approximation has been substituted.

## 2026-10-13 — MILI brand monogram rollout READY ON GITHUB MAIN (supersedes 2026-10-12 asset-access blocker)

- User's uploaded `1255.png` exact green MILI monogram (no text) was **processed directly in the local container** without Adobe, and converted to an optimized SVG (path shape traced from user-supplied image, solid #009956) and transparent PNG/white-background icon variants. The shareable standalone ZIP is `MILI_branding_v42_assets.zip` in this chat, containing SVG/PNG/app icon/browser icon preview. Do not replace with random image or stock search query.
- **Official V4.2 ZIP archives were successfully inspected with Python ZipFile** in this turn, superseding previous note saying inaccessible. Sources: `6ammart main private license V4.2.zip` (`User app/`), `vendor app private license V4.2.zip` (`Vendor app/`), `delivery man private license V 4.2.zip` (`Delivery Man App/`). Verified official Flutter `lib/features/splash/screens/splash_screen.dart` layout and exact native Android `launch_background.xml`, `colors.xml` and iOS `LaunchScreen.storyboard`. Customer main's five splash files are byte-for-byte identical to official ZIP; Vendor's visual Flutter splash is V4.2 equivalent (retains important routing extensions), native Android/iOS now byte-for-byte official; Delivery's Flutter splash presentation now matches V4.2 but preserves custom Pusher/notification routing, and native Android/iOS now byte-for-byte official. Only visual changes were made; no APK/AAB compiled.
- Five repos now include exact source SVG:
  `Ertoba/-react-user-web` `public/static/mili-mark-20261013.svg`;
  `Ertoba/portal-backend` `public/assets/admin/img/mili-mark-20261013.svg`;
  `Ertoba/mart-app`, `Ertoba/vendor-app`, `Ertoba/delivery-app` each `branding/mili-mark.svg`.
- React main HEAD (at documentation time): `788cfa5d464be6389d75d1841ab9beff0f25c6b1`; common `src/components/logo/brandAssets.js` now directs header, auth, footer to new SVG; `pages/_document.js` favicon and green theme updated; `public/site.webmanifest` with new 192/512 PWA icons, plus `public/apple-touch-icon.png`. Site image generation via `branding/build_site_assets.py` and GitHub Actions `.github/workflows/mili-brand-web.yml` succeeded and committed binaries automatically. **React production has not yet deployed these branding changes**; continue previous `yarn build` and `pm2 restart mili-react` only after safe VPS checks.
- Laravel backend main HEAD (at documentation time): `7f3d8e6a0be0436f6d80f92b855e85136f7d5c43`. Changed admin layouts `resources/views/layouts/admin/app.blade.php`, `partials/_header_v2.blade.php`, `partials/_sidebar.blade.php`, `resources/views/auth/login.blade.php`, `reset-password.blade.php`; updated `public/assets/landing/img/{logo,footer-logo,favicon,banner/logo}.svg` and installation logos. `branding/build_site_assets.py` + `mili-brand-web.yml` GitHub action succeeded, replacing favicon.ico, admin favicon.png and static logo PNGs.
- Laravel business API `business_settings.logo` and `business_settings.icon` are still dynamic DB values. Added **opt-in** Artisan command `app/Console/Commands/ApplyMiliBranding.php` on backend main; `php artisan mili:apply-branding` is dry run only; `php artisan mili:apply-branding --apply` copies approved PNGs to `storage/app/public/business`, backs up previous DB values+storage disk to `storage/app/mili-brand-settings-*.json`, updates only logo/icon settings and invalidates business cache. Not yet run on VPS. DO NOT deploy backend by full `git pull` without reconciling local Keepz/payment overrides. Deploy only targeted branding files surgically and verify PHP syntax/Keepz after.
- Flutter `branding/build_assets.py` and `.github/workflows/mili-brand-assets.yml` generated binary PNG assets on GitHub for all three apps: customer main `337a828ade69c221dd5723e89ae28618c9250a41`, vendor main `4aca32b5860a142bb9ce3f783442227e245a7ce4`, delivery main `e79d9b08fec5beeb0f1246c64930e14e6d433a01`. GitHub Actions generation succeeded in all three; generated image sizes validated, app `assets/image/logo.png`, auth/header assets where present, Android adaptive/legacy mipmap icons, iOS AppIcon (all catalog dimensions), native LaunchImage, Flutter web icon where present. Other Flutter business logic untouched. **Flutter rebuild deferred by user**, source only.
- Remaining: production deploy of React and admin using VPS root user terminal (no SSH tool accessible). Before deploying inspect `git status`, `df -h`, yarn/PM2; avoid backend whole-repo pull and touching Keepz. Apply dynamic business settings command *after* verifying images present. Browser/live admin/login/mobile header/PWA and app rebuild/simulator visual QA not yet done; do not claim complete 100% before these are checked. React CI full production audit includes preexisting flaky browser tests, check result separately. Record any production deploy here.

### Production rollout preparation (2026-10-13, continuation)

- Production branding scripts now committed:
  - React `branding/deploy-production.sh` at commit `b7a0287822ae78874e172ff420b6cd33c9ea61fc`: check clean tracked main, `/usr/bin/yarn`, >=4 GB disk; `git fetch`, fast-forward only, previous cutlery/Reels node regression, `yarn build`, `pm2 restart mili-react --update-env`, status and logo HTTP HEAD. Untracked .bak file left intact; no server invocation yet.
  - Backend `branding/deploy-production.sh` at commit `2c9a65c078cb513fcf670982a60248701c79b8c9`: surgical pull of branding files from `origin/main` with `/root/mili-brand-deploy-*` backups, **no full merge**; PHP lint, Blade view clear, PHP-FPM reload and dry-run `php artisan mili:apply-branding`. The actual DB logo/icon settings update is a later separate explicit `php artisan mili:apply-branding --apply` command after verifying images and Keepz. No VPS invocation yet.
- On uploaded official V4.2 ZIP image/splash source comparison, Git blob-sha checks:
  customer native/Flutter files all exact; vendor Android native/iOS exact and Flutter render matches original; delivery Android native/iOS exact and Flutter render matches original with preserved newer routing. Newly generated PNGs intentionally differ because user supplied a new logo.
- Browser source assets and images CI succeeded in all five repos. Latest GitHub main at time of preparation after React deploy script: `b7a0287822ae78874e172ff420b6cd33c9ea61fc`; backend main `2c9a65c078cb513fcf670982a60248701c79b8c9`. Production not yet deployed; do not claim live rebrand, and keep Flutter app rebuild deferred.

## 2026-10-13 — Branding CI audit failures and hosted-runner disk fix

- User received multiple GitHub email alerts from `Production QA Audit` runs triggered by a rapid sequence of MILI rebranding commits. These emails are GitHub Actions reports, not direct evidence of an outage on `mili.ge`.
- `Ertoba/delivery-app` runs `38324734363` (`1b44c68`) and `38269358436` (`579be596`) failed on GitHub-hosted runners while Gradle Jetifier processed Flutter Android debug dependencies: **`java.nio.file.FileSystemException ... No space left on device`**. The Flutter test step had passed; CI's `android-build.exit` was nonzero. This is a runner storage problem, not measured VPS disk use. Existing passing QA was `37337824190` on Oct 5. Updated delivery `.github/workflows/production-audit.yml` on `main`, commit `eb51e5473104262a55abd91efb2f7ee0d52a9c5b`, to clear optional .NET/PowerShell/CodeQL toolchains from ephemeral runner before installing Flutter and add concurrency cancellation for stale QA runs, preserving static analysis, Flutter tests, Android debug build and quality gate. New run `38329654185` started; **outcome pending** when recorded, do not call fix validated before result.
- `Ertoba/-react-user-web` latest QA `38325958595` on `ab8b8295` had successful `checks` job (install, lint, TypeScript, tests) but all browser matrix jobs failed due to repeated local-fixture runtime exceptions, HTTP errors on service routes and 4 interaction timeouts. Chromium summary: 624 cases, 36 passed, 328 failed, 164 blocked, 96 deliberately excluded; 4/4 interactions failed. Similar browser QA had already failed on prior run `38184631621` before the rebranding. **Do not falsely mark browser QA green or disable test gates merely to silence emails**; investigate isolated mock fixture runtime/API responses separately. Existing workflow's concurrency already cancels superseded React QA runs.
- Branding image generation workflows on GitHub for MILI web, admin, Customer, Vendor, Delivery reported success in their respective runs; this establishes committed/generated source resources, **not** a successful deployed production site, and neither iOS nor Android app rebuild was undertaken on the user's device.


## 2026-10-21 — Full V4.2 + Rental V2.2 source integration safety checkpoint

- Owner request: bring all official 6amMart V4.2 functionality into Backend/Admin, React Customer Web, Customer Flutter, Vendor Flutter and Delivery Flutter; integrate the supplied Rental add-on as well. Exclude ALL vendor activation, purchase-code and license-activation files/logic. Preserve MILI branding, Georgian/Russian locales, existing payments/FCM, integrations and custom fixes.
- Source packages supplied: `6ammart main private license V4.2.zip`, `React-user-website private licemze.zip`, `vendor app private license V4.2.zip`, `delivery man private license V 4.2.zip`, plus `6ammart-car-rental-module-addon.zip` (full Rental module and Rental User/Vendor/React sources, with V2.1-to-V2.2 delta packages).
- GitHub main snapshots reviewed: Backend `cba4c0d3ef6e6974ba8efbbbcabb90330daf10b6` (changed since the earlier `22380042` audit by one Rental reporting-index migration); React `d1f816f7138a9f44ad345b4c867beb8cd2fd0cd6`; Customer `817d4378d8e490c1a24b160611d0095ce2cca572`; Vendor `c603832ec1e509952487be286e94f969ff830779`; Delivery `1477eb3974781531b52bd6ff90b7250bf8442f60`.
- Confirmed **incomplete**: Vendor `lib/features/service_module` (145 official source files) and module DI/route/dashboard wiring are absent. React is missing 7 official service routes AND essential checkout/custom-service components/hooks, so importing route files without their dependencies would break builds.
- Rental Backend add-on cannot be overwritten indiscriminately: official V2.2 `Modules/Rental/Services/Trip/TripService.php`, `module.json`, route provider and reporting-index migration match main at SHA level, while `VehicleService.php`, `RentalCartService.php` and several official API controllers are absent at source paths. Existing report controllers and admin routes diverge and need semantic review. The V2.2 reporting-index migration `2026_09_01_100003_add_rental_report_indexes.php` was already merged on `cba4c0d3`; do not add it twice.
- The official Backend full-install archive includes .env, private key and dependencies; NONE of those machine/runtime/private/license material should be copied to GitHub. Stage only reviewed application source code. No direct ZIP tree overwrite.
- Firebase static check: Android customer/vendor/delivery `google-services.json` configs reference the same `mili-a2a33` Firebase project. The mobile notification channel is `mili_order_notifications`. Customer Web Firebase initialization still carries `stackmart-500c7`; preserve Android branch and verify Web separately. Live FCM token/SENDER_ID_MISMATCH remains untested.
- Recent main GitHub Actions: React FAIL (typography and 3 browser jobs), Customer FAIL (quality gate), Vendor FAIL (Flutter analyze), Delivery PASS. An independent hourly condition watcher is configured to report **new** regressions/status recoveries; historical failures must not be mistaken for newly introduced ones.
- **Release gate:** full V4.2 parity, API integration, builds, E2E and notification/payment tests are NOT certified. No server deploy, database migration, PM2 restart, production rebuild, or Play submission authorized by this checkpoint. Do not mark the complete V4.2 migration finished.
- When staging changes, preserve unrelated changes on main and use reviewed isolated diffs; record real commit SHAs / PRs and unresolved validation failures here. Do not merge unverified service/rental dependencies simply to make folder counts equal.


## 2026-10-21 — Verified V4.2 QA repair (React PR #8)

- `Ertoba/-react-user-web` PR #8 (https://github.com/Ertoba/-react-user-web/pull/8) was squash-merged to `main` at `acb933da40a005aee28bbdedecc921c387061a52`. Only Georgian and Russian locale files changed: `src/language/ka.js` and `src/language/ru.js`. A malformed CR/comma line split after the "Something went wrong" key caused the checkout localization regression test to ignore the translated value. Both strings and runtime meaning were preserved; comma placement was corrected.
- PR head `a0081c563bd1799165926980efdba663970e6ba9` passed the React `checks` job (ESLint, TypeScript, Node/typography); Playwright browser QA was still running at the merge point and has pre-existing independent baseline fixture failures. No assertion of full E2E certification.
- Vendor PR #2 (https://github.com/Ertoba/vendor-app/pull/2) stages V4.2 ETA/BOGO/Bundle order parsing and replaces the unrelated counter template with actual model regression tests. Vendor analyzer and Flutter tests had passed on its PR branch; Android ARM64 smoke build still in progress at checkpoint. Not merged at this checkpoint.
- Customer PR #13 (https://github.com/Ertoba/mart-app/pull/13) stages updates to outdated locale-startup test expectations based on MILI's Georgian default; full QA in progress at checkpoint. No Customer runtime behavior changed and no merge yet.
- All production deployments, database migrations, server builds and app store submissions remain deferred. Activation/purchase-code/license files were not transferred or modified. These are small verified QA repairs, NOT full V4.2+Rental feature migration completion.

## 2026-10-25 — Direct fixes and QA checkpoint

- Direct `main` commits, user-authorized and compared with uploaded official V4.2 archives: React formatter `781f4ca`, React tests `68b0293`; Vendor BOGO home `da45068`, ETA `8c77cdf`, BOGO/Bundle models `f1ce81c`, V4.2 model tests replacing obsolete counter smoke `fd501bb`; Customer Georgian locale-startup test correction `b4aa377`.
- Backend Keepz: `c720d0e` identity helper, `9623469` callback/status lookup guard, `3112607` recovery guard, `a73069b` tests, `1463149` CI. Keepz Status Integrity Action `40210941687` PASS (syntax/unit only; NOT live payment certified). Official response requires `integratorOrderId`.
- Vendor analyzer after model parity had zero compile errors; prior QA failed only obsolete DI-less counter test, now replaced. New Vendor and Customer QA pending; React source checks PASS but browsers pending. No server operations or builds/deployments executed.
- OPEN: P0 client-supplied delivery distance, P0 production Laravel shared-storage permissions, iOS/Web Firebase mismatch, vendor iOS bundle mismatch, Keepz financial/refund E2E, Android/iOS notifications, full browser E2E. Verdict **NO-GO**.


## 2026-10-25 — Post-audit stages 2–7 checkpoint (assistant verified)

- Production permissions: owner manually corrected `/var/www/mili/bootstrap/cache` ownership to `www-data:www-data` (775). Shared sessions/views and active release cache directories are writable by `www-data`. Public health checks `mili.ge/login/admin`, `admin.mili.ge`, `store.mili.ge` each returned HTTP 200. Session files with incorrect owners: 0; latest 100 scheduler log lines showed no matched error strings. This does **not** certify authenticated admin/vendor, queues or transaction E2E.
- Backend main `bdc28b63f1fc69f11e0c381807d45be7a11e3a90`: `TrustedCustomerDeliveryDistance` computes driving distance on server via Google Routes for Customer checkout summary, place-order and prescription place-order; ignores client-provided distance for these APIs; caches a matched origin/destination for 5 minutes and fails closed on missing configuration/provider errors. New `GOOGLE_ROUTES_API_KEY` server-only key is required. PHP syntax and 5 PHPUnit regression tests PASS in Action `40214681235`. **Production has not deployed this commit**; a key, Google Routes quota/billing and staging live-route tests are mandatory before deploy. Other customer/POS/Builder/order-edit callers must be audited for full perimeter coverage.
- Backend main `6a072fcda2fe8c735777a6981d0252311072140b`: live OTP generation changed from PHP `rand()` to cryptographic `random_int()`, preserving explicit demo/test fixed code mode. OTP PHPUnit Action `40215263399` PASS. Before production certify `APP_MODE=live`, SMTP/SMS OTP and brute-force/rate-limit tests.
- Backend Keepz previous main `14631496`: authenticated provider status identity code and regressions; Keepz Status Integrity Action `40210941687` PASS. Callback/recovery/live reconciliation and BOG/Flitt payment E2E still NOT CERTIFIED.
- Mobile current `main` CI: Customer `b4aa3775` Action `40211275664` PASS, Vendor `fd501bb5` Action `40211149213` PASS, Delivery `1477eb39` Action `39430693172` PASS. No new Android/iOS binary released or real-device cross-platform tests completed.
- React latest formatter fix and language patch are on main but comprehensive browser QA `40210102661` FAILED (many runtime errors and service HTTP failures). React main `13cde5561036af400252288c34aa8294ee003a9a` added a focused browser smoke and verbose runtime diagnostics **without disabling original full QA**. Focused Action `40215091457` launched; outcome pending at checkpoint. Do not label React complete.
- Firebase split remains: Android `mili-a2a33`; Customer iOS plist `portal-9524e`; other iOS/web configs unresolved or mismatched. Must register exact iOS bundle identifiers in canonical Firebase or use explicit cross-project FCM IAM. Do not invent/commit service-account credentials or `GoogleService-Info.plist`.
- Final E2E and Production Release remain NO-GO. Deployment must have backup/rollback, staging acceptance, build provenance, live payment/notification checks, and explicit owner-executed server commands. Source changes on GitHub are not automatically evidence of production installation.


## 2026-10-25 — React hydration investigation and footer correction

- Isolated Chromium 390px root smoke `40215091457` confirmed React #418 hydration mismatch. Full production browser QA previously failed hundreds of routes with `runtime`; this is not a single Service-route failure.
- A development-mode smoke `40215726836` showed concrete SSR/client differences in the footer: server rendered desktop `Stack` links while mobile client initially rendered two-column `Box` links, including different mobile uppercase text. It also identified a responsive `hero-explore-button` attribute mismatch (`radiuschange`), but the footer DOM/text mismatch was the observed React #418 trigger.
- React `main` commit `a99679a180825045690dc0921acb092349f4513b`: fix `FooterMiddle`, `SomeInfo` and `RouteLinks` to preserve identical initial SSR and hydrated markup, then switch after mount using an effect. The UI retains mobile responsive behavior.
- Focused diagnostic workflow `57b4ca0d` updated path filters; dev QA run `40216005689` on footer fix produced **zero browser page errors** (React #418 disappeared), but was still marked failed because Next DEV HMR emitted a framework `TypeError` warning unrelated to page hydration. Production-mode rerun requested by workflow change `241c04007980f1eeee33b796dd76a69011602e71`; outcome pending at this checkpoint. Do not mark React full QA green until the production-mode focused and full QA tests pass.
- All React browser checks still rely on synthetic fixtures, do not replace authenticated browser/device E2E or release signoff.


## 2026-10-26 — Continued QA / FCM checkpoint

- Owner requested continuing work across stages 2–7. No direct production deployment, migration, SMS, Firebase Console or live Keepz payment has been run; production remains **NO-GO**.
- React root-page Chromium QA: a previous production focused run revealed `/api/v1/customer/cart/get-all` was missing from mock API fixtures, causing 501 on every page. Matched response to backend `CartController::groupedByStore`, `CartStoreGroupResource` and the official V4.2 React `useGetGroupedCart()`. React main commits `8d482e1080d2c4e3078b71b8616b6af3153dd0d2` (grouped cart fixture) and `7195b2d12000a174f79be46ba47fa6f68cacb0fd` (focused test trigger). Focused Action `40261361880` completed **SUCCESS**, after the earlier React #418 footer hydration repair. This is a narrow root-page test, NOT full matrix PASS.
- React focused browser scope expanded to `/`, `/home`, `/checkout` by commit `cd52ee7fdf77210aca58c926641f2e7dbeb03ccb`. Run `40261941694` was in progress at this checkpoint. The full browser matrix still has unresolved missing fixtures and intentionally absent paid Service addon routes.
- The user-uploaded official V4.2 React ZIP **itself** contains `src/components/home/module-wise-components/service/README.md` and `service-api-manage/ApiRoutes.js` placeholder stubs; official Backend includes Service module, but real frontend Service addon source is NOT provided by that ZIP. Do not invent its endpoints/implementation or call Service E2E certified without obtaining actual addon source. Service provider/details/checkout components in MILI are placeholders.
- React Firebase initially had browser `src/firebase.js` on `portal-9524e` and SW `public/firebase-messaging-sw.js` on `stackmart-500c7`. React main `719dad48ed664e0a1cccf31c2fb9dadb8ba4c6ba` aligned SW to current browser config and added web project parity CI `40261757479` PASS. Backend service-account remains `mili-a2a33` and iOS/Android split remains; **live push NOT certified**, VAPID compatibility and canonical project selection remain to resolve.
- React main `0268177704d44dadd8896573cd04700ffe68ba0b` corrected foreground FCM event subscription lifecycle: use a single listener with unsubscribe on unmount to avoid repeated listeners and duplicate toasts on each notification. Source checks/full browser CI were pending at checkpoint.
- Backend main `a1e9ab684d952452d077c37ce0e094a0d8ccb844` added parcel request tampering, missing receiver and takeaway non-route regression tests. Delivery Distance Security Action `40261575395` **PASS**. Google Routes API key is still not configured/verified in Production. Never deploy server-side fail-closed checkout pricing without supplying a restricted Google Routes API key and staging testing.
- Keepz official current docs: authenticated `GET /api/integrator/order/status` response guarantees `integratorOrderId`, `status`, transactionId but **does not require amount or currency** in status response. Existing `KeepzStatusIdentity::matches()` checks id and is tested; optional checks of amount/currency in code should not be blindly made mandatory on this endpoint. Live callbacks/recovery/refunds/split and payment reconciliation still need sandbox E2E.
- Firebase iOS repository recheck: Xcode targets `ge.mili.customer`, `ge.mili.vendor`, `ge.mili.delivery`. Root `ios/GoogleService-Info.plist` project IDs customer/vendor=`stackmart-500c7`, delivery=`ammart-8885e`, Vendor plist BUNDLE_ID=`com.sixamtech.6amMartStore` mismatch. Customer additionally has `ios/Runner/GoogleService-Info.plist` on `portal-9524e`. Which plist is included in built app must follow Xcode PBXGroup resources, not filename guessing. Obtain project-correct files from Firebase Console; never invent Google app IDs or publish service-account credentials.


## 2026-10-26 — Staging E2E fixture expansion and FCM background fix

- React focused smoke `40261941694`: Chromium 390px: `/` PASSED (0 missing fixtures, no runtime errors); `/home` BLOCKED due to 8 missing synthetic endpoints; `/checkout` BLOCKED due to 4 missing synthetic endpoints; **zero runtime errors** on all three routes. Not a production API defect; the isolated fixture mock returned 501 where no response existed.
- React main `e0fba8acfeac145355fc857cfcddeb0351d32f03` added V4.2 Backend-derived synthetic responses for Happy Hour, Top Offer, Reels, BOGO, last order, quick delivery, Bundle, app-download, delivery coverage, Cashback, Cart discount eligibility, and Checkout Summary (12 newly modeled paths), and `scripts/check-qa-fixture-contracts.mjs` with checks. Values are synthetic; they do **NOT** represent real financial E2E or live orders. Focused three-route Action `40262555475` in progress at checkpoint; do not claim PASS yet.
- React main `0c7dd4371bdd39fa7297c53d3ce2ae397ad053a3`: Web Firebase SW now avoids manually displaying `notification` payloads already displayed automatically by the Firebase SDK, while displaying data-only payloads with a title; avoids null `payload.notification` errors. Added Node VM regression `scripts/test-fcm-background.mjs`. Firebase Web Config Parity Action `40262659912` **PASS**, including static project parity and background notification behavior tests. This is local behavior only; backend canonical Firebase/FCM and on-device receipt E2E remain UNVERIFIED.
- User-facing Release gate unchanged: React full browser QA remains not certified; paid Service addon React code is placeholders in the user-supplied official package; iOS/Android Firebase project split; Keepz real sandbox reconciliation and split/refund coverage; Google Routes production credential not set/tested; no production rebuild authorized/executed. Always verify actual CI latest heads before declaring success.


## 2026-10-26 — Keepz unresolved-state guard, POS distance and OTP remediation

- Uploaded **official React V4.2 ZIP is present**; its Service addon frontend is explicitly placeholder-only (`service/README.md`, `service-api-manage/ApiRoutes.js`). Do not claim Service React E2E or all v4.2 features complete until a real licensed addon source is provided and validated.
- React focused Chromium 390px smoke `40262555475` **PASS** for `/`, `/home`, `/checkout` after DB-backed API contract fixture modeling. Synthetic fixtures are not real payments or authenticated E2E. The broad Production QA Audit `40262793245` was still in progress when checked; no blanket PASS.
- Keepz Backend `108c28c445a0d91f5585c8d1a6c24705cf94f654`: no longer finalizes a failed order or triggers its failure hook when **order creation is unresolved** (network timeout/malformed response/no redirect) or **fail redirect** cannot fetch authenticated provider status. Only an explicitly terminal provider-reported create status can invoke the failure hook. Existing `getOrderStatusPayload` already enforces `KeepzStatusIdentity::matches` before processing; do not duplicate that gate. New verified-failure PHPUnit unit tests. CI `40263766738` PASS. **Provider-sandbox reconciliation, split, refund and callback E2E remain outstanding.**
- Customer checkout anti-tampering tests were extended `a1e9ab684d952452d077c37ce0e094a0d8ccb844`, CI `40261575395` PASS. Backend POS audit then identified hidden client distance and persisted session distance in Admin and Vendor POS as a remaining shipping pricing trust boundary.
- POS Backend main `1569d111d391a89e1fd41bedefc0fd84129c7afe`: Admin + Vendor POS add-address and final order placement now independently remeasure route from database store coords to pinned destination; distrust hidden form distance/session distance. CI `40264281522` PASS.
- POS Backend main `11ca05239ef442d09815a9edebfded5d86dddbd1`: Admin + Vendor POS initial `extra_charge` AJAX quote now posts pinned coords and independently uses server route distance, including coverage picker, rather than relying on client `distancMileResult`. Failed quote no longer shows misleading free delivery. CI `40264482935` PASS. **Breaking change** for external POS preview API callers that do not send latitude/longitude. Google Routes server key, quota, route modality and end-to-end staging behavior still required.
- Order handover OTP generator was already cryptographically secure in standard `PlaceNewOrderTrait` (recent other contributor commits). Backend `cf49e2b6d59ac5c819244a2bc219fafc15caf8d2` also switched **Admin and Vendor POS** to `OrderOtpGenerator::generate()`, replacing `rand(1000,9999)`. Expanded tests; CI `40264683970` and `40264683964` PASS.
- Audited external blockers recorded as [Backend Firebase issue #7](https://github.com/Ertoba/portal-backend/issues/7) and [Customer Android signing issue #14](https://github.com/Ertoba/mart-app/issues/14). DO NOT invent Firebase app IDs, rotate/remove active signing material, commit secrets or mark FCM fixed without platform credentials / real-device evidence.
- **Release gate remains NO-GO**: no Hetzner SSH access from this chat, no production deploy/restart/migration, restricted `GOOGLE_ROUTES_API_KEY` production setting is unverified, existing production SHA older, no test purchase/Keepz real settlement, no complete Flutter Android/iOS artifacts nor Firebase cross-project push acceptance, React full browser QA not certified.


## 2026-10-26 — Browser CI cancellation correction

- A root cause for repeatedly cancelled React `Production QA Audit` runs was confirmed in `.github/workflows/production-audit.yml`: `push` and `pull_request` had no path filtering and `concurrency.cancel-in-progress: true`. Every documentation-only update to `mili-final-context.md` canceled the lengthy Chromium/Firefox/WebKit QA and started it over, so repeated `cancelled` was a **workflow scheduling artifact**, not evidence of green or red application tests.
- React main `fda618676f85d4ba6aec5bb8cfee6b1ff71e78ff` added `paths-ignore` for context/documentation Markdown updates to both push/PR triggers; real source changes continue to run QA. It will trigger one last full QA because the workflow itself changed. `workflow_dispatch` remains available. This DOES NOT weaken or bypass the QA checks and no source test assertions were changed.
- Backend latest POS route security and handover OTP patches had success in `Customer Delivery Distance Security` `40264683964` and `Order Handover OTP Security` `40264683970`, while Keepz verified-failure `40263766738` passed. Restricted Google Routes key, provider sandbox acceptance and production release still required. 


## 2026-10-26 — Keepz failure finalization concurrency protection

- Backend `main` squash commit `4800d90a09048198012234efccc13cc543619714` merges [PR #8](https://github.com/Ertoba/portal-backend/pull/8). It introduces `KeepzFailureFinalizer::claim()` with a DB transaction and row-level lock before setting `keepz_failure_handled`, preventing duplicate failure-hook claims by concurrent callbacks that previously read stale JSON metadata. Paid/already handled/missing payment cannot be claimed. Preserves prior transaction IDs and metadata. Controller delegates its existing failure finalization to this helper.
- Added SQLite unit regression cases for first claim, stale second callback, already paid payment and missing payment. New helper/test included in `Keepz Status Integrity` CI. PR run [40266157877](https://github.com/Ertoba/portal-backend/actions/runs/40266157877) **PASS**. Main run [40266216065](https://github.com/Ertoba/portal-backend/actions/runs/40266216065) was **in progress** when logged (check current outcome).
- Current Customer/Vendor/Delivery main Production QA succeeded on [40264133272](https://github.com/Ertoba/mart-app/actions/runs/40264133272), [40264135982](https://github.com/Ertoba/vendor-app/actions/runs/40264135982), [40264139666](https://github.com/Ertoba/delivery-app/actions/runs/40264139666). This is source/CI acceptance only, not signed real-device E2E.
- React broad browser Production QA run [40265024482](https://github.com/Ertoba/-react-user-web/actions/runs/40265024482) was in progress; checks job PASS, full Chromium/Firefox/WebKit result unconfirmed. Docs-only changes must not cancel the job.
- **NO-GO remains**: Keepz sandbox callback/retry/split/refund/settlement E2E and MariaDB concurrent-callback test; canonical Firebase project with exact iOS app registrations, APNs and browser VAPID; Google Routes production key/billing and staging quote tests; complete React browser matrix, signed Android/iOS builds, authenticated cross-app E2E, backups/rollback and controlled Hetzner deploy. No secrets, license activation code, live transactions, production DB migrations or SSH deploy were used for this patch.


## 2026-10-26 — Android public keystore exposure confirmed

- Verified via connected GitHub repository metadata that `Ertoba/mart-app` visibility is **public**, and `main` still tracks `android/app/portalmart.jks` (size 2,752 bytes). `android/app/build.gradle.kts` reads the release key through `android/key.properties`, which is not in the repository. Whether this JKS is the actual Play Console upload key must be checked **offline** against Play Console App Integrity certificate SHA-256 fingerprint before altering/removing it. See [Customer signing issue #14](https://github.com/Ertoba/mart-app/issues/14), updated with evidence. This is an urgent release **NO-GO**; ordinary HEAD deletion does not erase public Git history.
- No secret/keystore bytes were accessed, copied, altered, downloaded or published. No signing key rotation or repository visibility change was made.
- Backend Keepz `main` run [40266216065](https://github.com/Ertoba/portal-backend/actions/runs/40266216065) **PASS** at merge commit `4800d90a`; React full cross-browser QA still requires final result before release.


## 2026-10-26 — Trusted route QA path parity

- Backend `main` squash commit `60ebbb7c9c5ccb2d21d6e31551d7d50cb6ba9a16`, [PR #9](https://github.com/Ertoba/portal-backend/pull/9), brought the `Customer Delivery Distance Security` GitHub Actions **push and pull_request filters into parity**. Formerly changes only to `PlaceOrderRequest.php` or `CheckoutSummaryRequest.php` on PR would skip this security test, and key checkout/fee traits and service were not watched. Added `PlaceNewOrderTrait.php`, `CheckoutSummaryTrait.php`, `DeliveryFeeTrait.php`, `DeliveryChargeService.php` to both triggers and their PHP syntax checks. Existing tests unchanged. PR run [40266960863](https://github.com/Ertoba/portal-backend/actions/runs/40266960863) **PASS**. Main run should be rechecked separately.
- This is CI hardening, not code coverage proof across all 6amMart V4.2 features, real orders or production setup. Full React browser QA / staging E2E and external key/payment/FCM/signing blockers are not released.


## 2026-10-26 — Production source exposure and main regression rerun

- Rechecked GitHub metadata: all five main MILI repositories (`portal-backend`, `-react-user-web`, `mart-app`, `vendor-app`, `delivery-app`) currently report `visibility=public`. Audit owner must decide whether these should be private given private-license source and in-repo signing material; changing visibility alone cannot retract data cloned or seen before.
- Backend `main` Keepz run [40266216065](https://github.com/Ertoba/portal-backend/actions/runs/40266216065) **PASS**, and `main` trusted-distance expanded CI [40267026299](https://github.com/Ertoba/portal-backend/actions/runs/40267026299) **PASS**. React complete three-browser Production QA [40265024482](https://github.com/Ertoba/-react-user-web/actions/runs/40265024482) still in progress at check.
- Existing MILI GitHub QA hourly condition watcher was re-enabled 2026-10-26 for future meaningful regression/recovery/status alerts; this is **monitoring**, not unattended feature development, autonomous production deployment or continuous SSH operations.


## 2026-10-26 — React full browser matrix evidence and recovery OTP fix

- The complete React Production QA [run 40265024482](https://github.com/Ertoba/-react-user-web/actions/runs/40265024482) finally **FAILED** on `fda61867`: source `checks` job PASSED but all three browser jobs FAILED. Chromium, Firefox and WebKit each reported **36 failed** responsive-route checks plus four failed interaction checks; 72/73/76 additional routes were fixture-blocked respectively. Repeated fail categories included `/custom-no-ssr` empty utility page, unimplemented paid Service addon frontend `/service/provider/1` and `/service/service-details/1` HTTP errors, missing synthetic fixtures for some storefront/Bogo routes, and stale AI chat/recovery scripted selectors. This is **not a Production E2E PASS**. The official uploaded React V4.2 ZIP also contains the client-only `pages/custom-no-ssr/index.js` helper and the Service placeholder frontend; preserve that distinction when triaging.
- A new React production defect was identified: `pages/home/index.js` rendered a second `AiChatBotLauncher` in addition to `MainLayout`'s global launcher. [PR #9](https://github.com/Ertoba/-react-user-web/pull/9) removes the duplicate, uses MainLayout-owned `happyHourActive` to maintain responsive floating control clearance, and adds a singleton regression test and a focused PR browser smoke. **PR #9 is pending focused smoke/merge at this checkpoint**; do not claim it is on main without rechecking.
- React password recovery had `goNext()` even when the OTP request response contained `errors`, incorrectly showing a code entry step when no OTP was sent. [PR #10](https://github.com/Ertoba/-react-user-web/pull/10) **squash-merged** to main as `acf39324f0f8cc45acabb060c78bf2fc62b33bbb`. A pure `recoveryOtpRequestSucceeded()` gate prevents advancing on failed/errored/absent results and tests now cover these cases. PR `checks` job PASSED in [run 40304706186](https://github.com/Ertoba/-react-user-web/actions/runs/40304706186); full 3-browser matrix and post-merge main QA are not yet certified.
- The customer, vendor and delivery Flutter apps' main CI remains previously **PASS**, but signing exposure, iOS Firebase project splits, APNs/FCM live delivery, Keepz sandbox ledger/refunds/split, Google Routes production key/quotas and authenticated cross-app E2E remain **NO-GO**. Neither Android/iOS release nor Hetzner deploy has been executed from this chat.


## 2026-10-26 — Verified AI launcher, recovery and read-only release preflight

- React [PR #9](https://github.com/Ertoba/-react-user-web/pull/9) squash-merged to `main` at `ca7263b7d6aab48692afd688eb2216d3cf512bbf`. There is now one sitewide `AiChatBotLauncher` (in `MainLayout`) instead of two concurrent launcher instances on `/home`; the same Layout now supplies `happyHourBannerActive` for mobile clearance. Node singleton regression is in `tests/home-ai-chat-singleton.test.mjs`. PR [focused smoke 40304185010](https://github.com/Ertoba/-react-user-web/actions/runs/40304185010) **PASS**, and **main** [focused smoke 40305460226](https://github.com/Ertoba/-react-user-web/actions/runs/40305460226) **PASS** for `/`, `/home`, `/checkout` at Chromium 390 px with synthetic API fixtures; this is NOT full E2E/browser certification.
- React [PR #10](https://github.com/Ertoba/-react-user-web/pull/10) `acf39324f0f8cc45acabb060c78bf2fc62b33bbb` fixed the wrong OTP next-step transition after provider errors, with logic in `recoveryOtpRequestSucceeded` and Node regression tests. Its PR static `checks` job completed **PASS** in [40304706186](https://github.com/Ertoba/-react-user-web/actions/runs/40304706186). Broad browser matrix for current `main` [40305460286](https://github.com/Ertoba/-react-user-web/actions/runs/40305460286) was **in progress** at this checkpoint; prior three-engine [40265024482](https://github.com/Ertoba/-react-user-web/actions/runs/40265024482) was definitively **FAILED** (36 responsive cases per engine, plus four interactions each). Full QA still **NO-GO**.
- Backend [PR #10](https://github.com/Ertoba/portal-backend/pull/10) squash-merged to `main` at `7f5aa272ef6ecd993bad0218093fceaf2e8522df`. It adds `scripts/mili-production-preflight.sh`, supporting read-only Laravel `.env`/APP_ENV/APP_DEBUG/HTTPS/DB/GOOGLE_ROUTES_API_KEY presence and PHP/www-data runtime permission checks without printing secret values, and `Documentation/MILI-production-release-preflight.md`. Synthetic positive and absent-Routes-key negative CI on PR [40306156005](https://github.com/Ertoba/portal-backend/actions/runs/40306156005) **PASS**; main [40306223526](https://github.com/Ertoba/portal-backend/actions/runs/40306223526) **PASS**. A passing static preflight does **NOT** confirm live key validity, payment/FCM, device E2E, DB migration readiness or deployment.
- NO direct access to Hetzner SSH, Production DB, Google Cloud Routes billing, Firebase Console registrations, Keepz sandbox settlements or Play signing private assets was available/exercised. **No Production rebuild, migration, restart or install occurred. Release is NO-GO** pending external gates, full React cross-browser completion, paid Service React frontend source and rollback acceptance.


## 2026-10-26 — AI chat single-flight request hardening

- An additional user-visible V4.2 chat bug was identified in the real MILI React implementation: `ChatDetailView` accepted repeated Enter while a send was in progress; `ChatBotPopover.handleSend` did not synchronously reject duplicate requests. React state `isTyping` is asynchronous, so fast submissions could duplicate a chat message and provider request.
- [React PR #11](https://github.com/Ertoba/-react-user-web/pull/11) squash-merged to `main` at `28a7a15beb9eed412a4e005046d50956616b158c`. A component-local `createSingleFlightGate()` acquires before optimistic message update and releases in `finally` for success/failure. `ChatDetailView` now blocks Enter/submit while `isTyping`; quick-suggestion creation also respects the guard. Node regression tests cover duplicate-submit rejection and release behavior. PR source `checks` **PASS** in [40306973659](https://github.com/Ertoba/-react-user-web/actions/runs/40306973659), and PR 390px `/`, `/home`, `/checkout` Chromium focused smoke **PASS** in [40306973630](https://github.com/Ertoba/-react-user-web/actions/runs/40306973630). Main focused [40307453212](https://github.com/Ertoba/-react-user-web/actions/runs/40307453212) and broad main browser suite [40307453297](https://github.com/Ertoba/-react-user-web/actions/runs/40307453297) were not yet completed when logged; check actual outcomes.
- No user account messages, transactions, production state or external provider calls were generated by these synthetic tests. This patch improves request idempotency on the client but does **not** certify Backend duplicate-order prevention, all browser E2E, vendor/courier push notifications or live payments. Production release remains **NO-GO** until documented Service frontend, Google Routes/Keepz/FCM/signing and deployment gates are met.


## 2026-10-26 — React full browser failures triaged and interaction PR pending

- On `main` React Production QA [40307453297](https://github.com/Ertoba/-react-user-web/actions/runs/40307453297), Chromium and Firefox browser jobs finished FAILURE with **36 route failures each** and **4 failed interaction probes** each; WebKit was still in progress at the 15:21 Asia/Tbilisi status check. Per browser, 36 route failures derive from **three paths × twelve viewport widths**: the technical client-only `/custom-no-ssr` utility (empty/no font; official source helper), and unavailable Service frontend `/service/provider/1` and `/service/service-details/1` (HTTP error). Do not translate 36 into 36 independent feature defects. At least 72 additional cases were BLOCKED by absent synthetic fixtures, not passed. Keep the paid Service addon source requirement and all blocked routes as explicit NO-GO for full V4.2 parity.
- Existing `.qa/interactions.mjs` used the prior `AI ჩატ-ასისტენტი` launcher and attempted to write directly into chat without clicking the new `New chat` action. Its browser-only config interception did not affect Next SSR, so synthetic `is_sms_active=false` / `is_mail_active=false` disabled the OTP forms. The actual shared AI popover also did not implement Escape-close/focus-return. [React PR #12](https://github.com/Ertoba/-react-user-web/pull/12), branch `fix/react-chat-escape-interaction-qa-20261026`, adds Escape-close and focus return, stable chat selectors, updates interaction probes to use the new UI and API response, supplies **localhost interaction-case-only** mocked config for SSR+browser parity and opts the focused smoke into real interactions. It does not change Production Firebase/SMS configuration or install the paid Service addon. PR focused [40315209695](https://github.com/Ertoba/-react-user-web/actions/runs/40315209695) and full [40315209698](https://github.com/Ertoba/-react-user-web/actions/runs/40315209698) were still running when logged. **Do not merge or call PASS without checking their actual results.**
- React `main` targeted Chromium [40307453212](https://github.com/Ertoba/-react-user-web/actions/runs/40307453212) PASS on `28a7a15b`. Backend main read-only release preflight [40306223526](https://github.com/Ertoba/portal-backend/actions/runs/40306223526) PASS. Production remains **NO-GO**: complete client/browser/device E2E, Keepz sandbox, Google Routes key, Firebase/APNs/FCM, Android signing, missing Service React add-on and Hetzner access/backup/rollback gates.


## 2026-10-26 — Password recovery phone normalization and dual-channel selection

- [React PR #13](https://github.com/Ertoba/-react-user-web/pull/13) squash-merged into `main` at `0255dae8b476db4d8ef2a498e29741f5e0413a1b`. The existing pure `normalizeOtpPhone()` function (already covered by tests) was **not actually used by the password recovery phone input**; `handleOnChange` blindly prepended a plus and could preserve duplicated `995995` if the country picker repeated the Georgian code. The live form now calls the pure helper, with idempotence and incomplete-number regression tests. PR static `checks` [40316109559](https://github.com/Ertoba/-react-user-web/actions/runs/40316109559) **PASS**; full provider SMS/real-device flow not verified.
- [React PR #14](https://github.com/Ertoba/-react-user-web/pull/14) squash-merged to `main` at `424cccd04b526bcc5b03bda7938dc6f5f59461b6`. The OTP password recovery form previously only selected `phone` when both `is_sms_active` and `is_mail_active` were set and offered **no selector to use email**. It now determines enabled methods using strict boolean/1/"1" checks, retains current valid method, and renders an exclusive SMS/Email toggle when both are enabled. With Firebase phone OTP configured, email resets now use Backend email OTP rather than calling Firebase signInWithPhoneNumber on an empty phone. Added pure Node regressions for both methods, disabled flags, selection retention, and `"0"` flags. PR source `checks` [40316889270](https://github.com/Ertoba/-react-user-web/actions/runs/40316889270) **PASS**; external SMS/SMTP/Firebase production identity flows and cross-browser E2E still require verification.
- Pending [React PR #12](https://github.com/Ertoba/-react-user-web/pull/12) adds Escape and focus restoration for the current AI dialog plus repairs old chat/recovery browser fixture tests. `checks` [40315209698](https://github.com/Ertoba/-react-user-web/actions/runs/40315209698) PASS, but focused interactive Chromium smoke [40315209695](https://github.com/Ertoba/-react-user-web/actions/runs/40315209695) was not yet complete when recorded. **Do not claim PR #12 merged before checking**.
- **NO-GO remains** for full Production V4.2 deployment: unresolved React Service addon source, 501 browser fixture coverage, Google Routes restricted live key, Keepz sandbox callbacks/split/refunds/reconciliation, Firebase project mismatches + APNs/FCM, Android signing public keystore, signed-device E2E, snapshot/rollback and Hetzner SSH.


## 2026-10-26 — Service QA blocker tracked, internal helper classified, PR #12 diagnostic

- [React issue #15](https://github.com/Ertoba/-react-user-web/issues/15) tracks the **hard NO-GO** caused by absent/incomplete V4.2 Service frontend addon pages `/service/provider/[id]` and `/service/service-details/[id]`, HTTP errors in browser QA, and additional missing API fixture contracts. Genuine functionality and authenticated E2E must be restored from authorized add-on source; do not fabricate functioning Service UI or silently skip it.
- [React PR #16](https://github.com/Ertoba/-react-user-web/pull/16) squash-merged to main as `219b35b896179ec660c69eddf8d6d6bbd7ab1871`. Browser QA now explicitly reports the file-router-only `/custom-no-ssr` utility page as an **excluded technical route** (while retaining its measured failure reasons), rather than treating its intentionally empty wrapper as a customer-facing feature. This does NOT exclude Service routes or 501 fixture blockers and does not turn QA green. Source `checks` in [40317516151](https://github.com/Ertoba/-react-user-web/actions/runs/40317516151) **PASS**.
- [PR #12 focused Chromium smoke 40315209695](https://github.com/Ertoba/-react-user-web/actions/runs/40315209695) **FAIL** on its first real interactive run. Actual logs demonstrate routes `/`, `/home`, `/checkout` all PASS; the new chat interactions `chat-motion` and `chat-reduced-motion` both **PASS** after the correct AI launcher/new-chat UI and Escape/focus fix; `recovery-phone` and `recovery-email` both **FAIL** waiting for absent/hidden OTP form inputs. The PR remains **unmerged** on purpose. A follow-up PR #12 commit `f96dcef00f803f15f87118848d37c51af3b8af87` enables synthetic read-only form/page diagnostics under `QA_VERBOSE_ERRORS=1`; focused run [40317921120](https://github.com/Ertoba/-react-user-web/actions/runs/40317921120) must be rechecked before repairing forms, merging or claiming success. This run does NOT place a live order/send a live SMS.
- The React full browser gate remains **NO-GO** regardless of internal helper exclusions, with unresolved Service addon, synthetic fixture gaps and real browser/provider E2E. Backend Keepz/Routes preflight source checks passing do not certify payment settlement, routes pricing or Production. No Hetzner deployment was conducted.


## 2026-10-26 — Recovery client exception isolated; SSR fix pending browser gate

- [PR #12](https://github.com/Ertoba/-react-user-web/pull/12) **remains OPEN** after focused run [40317921120](https://github.com/Ertoba/-react-user-web/actions/runs/40317921120): `/`, `/home`, `/checkout` PASS and both AI chat interactions PASS, but `recovery-phone` and `recovery-email` fail because **`/forgot-password` shows Next's `APPLICATION ERROR: A CLIENT-SIDE EXCEPTION HAS OCCURRED`**, with zero recovery form/input nodes. This is a real client-side page crash, not merely an outdated selector or missing fake provider response. `QA_VERBOSE_ERRORS` logged synthetic page text and absence of form. No production user data was involved.
- Recovery page `pages/forgot-password/index.js` had previously loaded `configData` only via a disabled-by-default client query and initially rendered the complete `MainLayout` with `configData=null`. Unlike working Home, the route provided no SSR config prop. PR #12 commit `5e57b44c93e60ad82b27f2ba0468858f2b43f27a` adds `getCommonServerSideProps(context, "home_page")` to provide Backend config before the first render, forwards it to Layout/child and dispatches Redux config. A Node source regression was added, and browser CI must prove that this actually fixes the exception; until then it remains **UNVERIFIED**, not a claim of root-cause resolution.
- PR #12 also added localized console-error/HTTP diagnostics for synthetic browser failures; focused test automation was hardened with branch-specific `concurrency.cancel-in-progress` in commit `c890b18cde39e72a55ba3304cf8a907043a78bb7` to avoid running multiple superseded Chromium smoke jobs for future source updates. Focused [40319493775](https://github.com/Ertoba/-react-user-web/actions/runs/40319493775) and full [40319494236](https://github.com/Ertoba/-react-user-web/actions/runs/40319494236) were not complete at this checkpoint. **Do not merge PR #12 until focused interactive QA passes and source checks succeed.**
- React `main` already has recovery number fix #13 `0255dae8`, dual SMS/email recovery toggle #14 `424cccd0`, and internal QA-helper classification #16 `219b35b8`. Service addon blocker issue [#15](https://github.com/Ertoba/-react-user-web/issues/15) and 501 fixtures remain separately unresolved. Overall production release is **NO-GO**. No server deployment/restart/migration was executed.
