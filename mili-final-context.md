# MILI — authoritative final context (V4.2)

> Current source of truth as of 2026-10-29. This file replaces all previous
> production-readiness and workstation-recovery assertions. Historical audits
> remain evidence only and must not override the live mapping below.

## Final outcome

The deleted local development/production-management environment is restored
inside the sole workspace `C:\Users\miro\Desktop\მილი`. Production is running
immutable Backend and React releases built from exact pushed application SHAs,
with verified database backup, stable Backend symlink, explicit PHP 8.3 runtime,
and live hot rollback targets.

There are no current production deployment blockers. Known CI/acceptance gaps
are disclosed below and are not described as green. No real Keepz financial
transaction or real-device FCM delivery was used as a health check.

Canonical evidence:

- [Production restoration record](../../reports/production/production-restoration-20261028T191014Z.md)
- [Final post-soak public probe](../../reports/production/public-probe-20261029-035310.json)
- [Production-management runbook](../../ops/runbooks/PRODUCTION-MANAGEMENT.md)
- [Machine-readable production mapping](../../ops/config/production.json)
- [Official V4.2 parity verdict](../../reports/official-v42/MILI-OFFICIAL-V42-PARITY-VERDICT-20261027.md)

## Canonical local layout

- Sole workspace: `C:\Users\miro\Desktop\მილი`
- Repositories: `C:\Users\miro\Desktop\მილი\repos`
- Rebuild/cache root: `C:\Users\miro\Desktop\მილი\build-workspace`
- Toolchain: `C:\Users\miro\Desktop\მილი\tools`
- Operations: `C:\Users\miro\Desktop\მილი\ops`
- Reports: `C:\Users\miro\Desktop\მილი\reports`
- Final artifacts: `C:\Users\miro\Desktop\მილი\artifacts`
- Historical context/audits: `C:\Users\miro\Desktop\მილი\context`

Do not create another MILI clone, worktree, dependency cache, build directory,
report, or artifact elsewhere on the Desktop. The `M:` SUBST used by the
Flutter/Dart tooling points to this same workspace and is not a second copy.

The local production Ed25519 key remains only under ignored
`ops/secrets/`; the server host key is pinned in `ops/config/known_hosts`.
Never print, commit, or paste either private credentials or provider secrets.

## Source repositories

At final application deployment all five repositories were clean on `main` and
exactly matched `origin/main`:

| Component | Validated application/main SHA | Final application state |
|---|---|---|
| Backend/Admin | `ff94f1fdd38e095675aa9c99a27236859b785eeb` | deployed; invalid Rental search dates are rejected with HTTP 422 |
| Customer Flutter | `b0489615d2be85483a867e9cf3b29166b8ecafa0` | clean/pushed; 729/729 tests passed |
| Vendor Flutter | `99ca2df8968b7d1329a376da5b6bf14052b40d8a` | clean/pushed; 51/51 tests and debug APK passed |
| Delivery Flutter | `80a4674c8af79d0e354622cff7bfa4b714b4b26d` | clean/pushed; 51/51 tests passed |
| React Web | `f6968b346819325797d517f4e2abea68d895baf8` | deployed; canonical proxy redirect and Rental date guard included |

This context-only commit advances React `main` without changing the deployed
application tree. The production React application remains exactly `f6968b3`;
future releases must distinguish application SHA from documentation-only
commits.

## Live production mapping

The server workspaces `/var/www/mili` and `/var/www/store_react` are dirty
non-runtime directories. They are not deployment sources and must never be
pulled, reset, cleaned, or used to construct a release.

| Layer | Current live target |
|---|---|
| Backend current link | `/var/www/mili-current` -> `/var/www/mili-release-ff94f1f` |
| Backend SHA | `ff94f1fdd38e095675aa9c99a27236859b785eeb` |
| PHP runtime | PHP 8.3.36 CLI/FPM; socket `/run/php/php8.3-fpm.sock` |
| HTTP document root | `/var/www/mili-current/public` |
| Queue/Reverb | Supervisor; PHP 8.3; CWD `/var/www/mili-release-ff94f1f` |
| Scheduler | every minute from `/var/www/mili-current` with `/usr/bin/php8.3` |
| React release | `/var/www/store_react-release-f6968b3` |
| React SHA/process | `f6968b3`; PM2 `mili-react-f6968b3`; port 3002 |
| Nginx config | `mili.ge.backend-ff94f1f.react-f6968b3` |
| React rollback | `/var/www/store_react-release-d1`; PM2 `mili-react-279`; port 3001 |
| Backend rollback | `/var/www/mili-release-144e74d` |

Both React ports 3002 (live) and 3001 (rollback) remain listening. PHP 8.2
remains installed/active as a rollback option, while every production runtime
binding explicitly selects PHP 8.3.

## Database and configuration safety

- Verified pre-change backup:
  `/var/backups/mili-db-prechange-20261028T055407Z.sql.gz`.
- Backup size: 524,620 bytes; 217 tables; mode 0600.
- SHA-256:
  `816ab29ec4d5df7c6a18a765ad75e33a59f11ea70ae22dff0919a52abffe4724`.
- SHA-256 sidecar and gzip stream both verified.
- Migrations: 407 ran, zero pending. No migration was executed for this release.
- Queue rows: jobs 0, failed jobs 0 at final post-switch audit.
- Production `.env`: `root:www-data`, mode 0640.
- Shared `storage/logs`: `root:www-data`, mode 2775, application-writable.
- `GOOGLE_ROUTES_API_KEY` is configured without exposing its value. A live
  application route probe returned 4.339 km and 712 seconds.
- Laravel configuration cache is intentionally disabled. Do not enable it
  until runtime `env()` calls outside configuration files are eliminated.

## Release validation

### Backend `ff94f1f`

- Built from the exact pushed SHA with PHP 8.3 Composer platform requirements,
  production dependencies, and a successful Vite build.
- Direct PHP 8.3 FPM `/api/v1/config` response was valid JSON.
- Candidate `date=Invalid Date` request with the real Rental module context
  returned HTTP 422 and validation code `date`.
- After atomic switch, `/api/v1/config`, `/login/admin`, and `/` returned HTTP
  200; the live invalid-date request also returned HTTP 422.
- Queue/Reverb restarted with the correct release CWD and PHP executable;
  Reverb port 8080 listened.
- No new Laravel severity entry appeared after the switch. The preceding Carbon
  `Invalid Date` exception belonged to old release `144e74d` and occurred
  roughly ten minutes before deployment.

### React `f6968b3`

- Independent physical `node_modules`, frozen lockfile.
- Node tests: 63/63 passed.
- Next route type generation, TypeScript, lint command, and production build:
  passed. BUILD_ID: `36QqagNOF6bd3zOt9jlZH`.
- Direct candidate routes/static assets passed and the middleware redirect was
  exactly `https://mili.ge/home?module=sakvebi`, never a localhost URL.
- Public switch smoke passed for home, checkout, Service, Rental, static build,
  Backend config, reels-stream contract, and store subdomain behavior.
- Real shared-browser Rental flow loaded `Vehicle Search - მილი`. Four observed
  search requests sent `date=` (empty), never `Invalid Date`; all four returned
  HTTP 200 and no API error was observed.
- Live PM2 error log was empty and recent Nginx access records contained zero
  5xx responses at final audit.
- During the later soak, Nginx recorded two expected security-rule denials for
  an external scanner requesting `/.htaccess` and `/.htpasswd`; there was no
  upstream/application error. An older unrelated external-client TLS alert was
  also present.
- The queue worker exits successfully and is respawned by Supervisor every hour
  because its command deliberately uses `--max-time=3600`; the soak restart was
  `exit status 0; expected`, not a crash.

### Public endpoints

The final dated public probe returned HTTP 200 for:

- `https://mili.ge/`
- `https://mili.ge/api/v1/config`
- `https://mili.ge/login/admin`
- `https://admin.mili.ge/` (after expected redirect)
- `https://vendor.mili.ge/` (after expected redirect)
- `https://store.mili.ge/` (after expected redirect)

SSH port 22 was reachable. Public probes alone do not certify internal state;
the authenticated checks above provide the process/SHA/database evidence.

## CI and remaining QA debt

- Backend `ff94f1f` did not trigger GitHub Actions because the current workflow
  path filters do not include the two changed Rental files. Candidate/live
  contract gates verified HTTP 422 behavior, but the CI path-filter gap remains
  a repository improvement item.
- React [Production QA Audit #154](https://github.com/Ertoba/-react-user-web/actions/runs/40749518167)
  has a successful `checks` job. Chromium, Firefox, and WebKit all failed in the
  shared “Build and test against local API fixtures” step. Unauthenticated log
  access exposes no exact assertion, so this context does not speculate or
  claim that broad fixture matrix is green.
- The focused React build/tests and actual production Rental browser path are
  green. That evidence does not erase the broad fixture QA failure.
- The Backend targeted security suite previously passed 33/33. The full SQLite
  suite still has documented schema/fixture incompatibilities and is not
  represented as green.
- No real Keepz payment/refund/cancellation/settlement/split transaction and no
  real-device FCM/APNs/VAPID delivery was executed.

## Official V4.2 and license boundary

- Official private V4.2 archives remain protected comparison inputs outside
  the workspace. No protected archive was copied to Git or production.
- Activation, license, purchase-code, installer, updater-gate, and related
  files/logic are prohibited from every MILI `main`, application, Backend,
  artifact, report body, and deployment.
- Selective V4.2 feature work followed the official changed-files approach:
  compare, preserve MILI customizations, merge behavior rather than replace
  customized trees, then verify the resulting application.
- The parity verdict denied activation-related paths before classification.
  No missing official path is permission to copy a partial module architecture.
- No license/activation source was transferred during workstation recovery,
  SSH setup, server release construction, or production switching.

## Operational rules from this point

1. Start from clean pushed `main`; build only an immutable release from an exact
   SHA. Never build from dirty server workspaces.
2. Keep all local project material and caches under
   `C:\Users\miro\Desktop\მილი`; use `build-workspace` for rebuild/cache work.
3. Before a state-changing release, verify a fresh database backup, exact SHA,
   dependency/platform gates, migrations, queue counts, and rollback target.
4. Keep Backend on `/var/www/mili-current`; switch the symlink atomically and
   restart long-lived workers so their CWD matches the release.
5. Start React candidates on a private loopback port and verify direct smokes
   before an atomic Nginx config switch.
6. Do not enable Laravel config cache or run a migration merely because a
   deployment is occurring.
7. Preserve old releases, the verified DB backup, and hot rollback processes
   until a deliberate retention decision after soak.
8. Use the production runbook for exact verification and rollback steps.

## Restored toolchain and reusable outputs

- Flutter 3.47.5 / Dart 3.13.4 (`6a19cca564`)
- Java 17.0.18
- Node 22.20.0, npm 10.9.3, Yarn 1.22.22
- Portable local PHP 8.3.36 NTS
- Composer 2.10.3
- Vendor debug APK:
  `../../artifacts/debug/mili-vendor-v42-notification-20261027-debug.apk`

Historical recovery/audit files under `../../context/` and older reports remain
useful evidence, but their old missing-SSH, old-release, PHP 8.2 runtime, and
NO-GO assertions are superseded by this document.
