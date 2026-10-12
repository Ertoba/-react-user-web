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
