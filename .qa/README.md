# Storefront UI audit

Run from the repository root:

```sh
yarn install --frozen-lockfile
npm ci --prefix .qa
node .qa/node_modules/playwright/cli.js install chromium firefox webkit
python3 .qa/inventory.py
node .qa/run.mjs
```

The runner creates `.next-qa`, builds with a local API at `127.0.0.1:4319`, starts Next at `127.0.0.1:4318`, and closes its child processes afterward. Production `.next` and environment files are not changed. Never deploy `.next-qa`.

Playwright has its own exact dependency and lockfile. Scripts execute beside that dependency; no `/tmp` module resolution or application dependency mutation is involved.

The default matrix covers every Pages Router entry (including dynamic routes using fixture IDs), widths 320/360/375/390/393/412/430/480/768/1024/1280/1440, and Chromium/Firefox/WebKit. `QA_BROWSERS=chrome,msedge` uses locally installed browsers. `QA_WIDTHS`, `QA_ROUTES`, and `QA_ONLY_INTERACTIONS=1` permit targeted reruns. `QA_SKIP_BUILD=1` is only appropriate when the existing QA build contains the code being tested.

Artifacts in `results/` include the complete static file inventory, an incremental browser ledger, API contract gaps (including SSR requests), screenshots at 390 and 1440 pixels, interaction results, build output and an explicit summary. Runtime exceptions, Next error boundaries, horizontal document overflow, missing fonts, broken images, invalid numbers, missing API fixtures and unexpected redirects fail the active-page checks. Heuristic clipping/target-name/target-size candidates are recorded for review; they are not an accessibility certification.

Eight retained rental routes import intentionally disabled components that return `null`. They are visited and explicitly excluded from functional certification, with a reason in each result. Taxi/rental implementation is outside this release. The unused `/custom-no-ssr` helper page was removed after verifying that it had no imports or links.

Fixtures use synthetic users, addresses, products, carts and orders. Public presentation configuration was sanitized for local use. External services are blocked. Interaction tests intercept AI and recovery submissions locally, verify invalid input does not submit, reject duplicate chat sends, check Escape/focus restoration and exercise normal/reduced motion. No real SMS, order, payment or support message is sent.

WebKit testing does not replace Safari on an Apple device. Real payment providers, native maps, social sign-in, hardware keyboard/assistive technology and every business-state permutation require their respective integration environments.
