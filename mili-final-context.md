# MILI — authoritative final context (V4.2)

> Current context: **2026-11-12**. A fresh read-only Play Console audit confirms
> Customer **57**, Vendor **39** and Courier **42** are **Available on Google Play**,
> **Full rollout**. This supersedes the Nov 11 in-review/blocked snapshots below;
> the publication actor is not determined. Customer v57 advertising opt-out AAB
> completed binary verification and upload; it is NOT still building.
> All three genuine Firebase Apple registrations and manual unsigned iOS
> Codemagic workflows are configured on pushed main branches. All three corrected
> builds finished; their downloaded unsigned arm64 IPAs and provenance passed
> independent verification. They are ready for **local Sideloadly re-signing**,
> not yet signed or installed. Native SwiftPM migration evidence is incomplete;
> no full dependency-reproducibility or iPhone runtime acceptance is claimed.
> Backend/React runtime and Nov 8 device-install evidence were not refreshed by
> this operation. Historical records below remain dated, not current assertions.

## 2026-11-12 — Current Android production and verified unsigned iOS artifacts

The machine-readable [mobile/iOS status record](Documentation/operations/mobile-ios-status-20261112.json)
records the observation scope, exact identities, hashes, commits and build IDs.
It supersedes status-only claims in the immutable Nov 11 upload/review records;
those records remain unchanged as evidence of their own earlier operations.

### Android: all three latest releases are now available

Read-only inspection of each **Production > Latest releases** page at
**2026-11-12 03:07–03:11 UTC / 07:07–07:11 +04** found:

| App / package | Available version | Console state | Last-updated text, literally as displayed |
|---|---|---|---|
| Customer / `ge.mili.customer` | `4.2.0+57`, release 11 | Available on Google Play; Full rollout | Nov 11, 2026, 11:54 PM |
| Vendor / `ge.mili.vendor` | `4.2.0+39` | Available on Google Play; Full rollout | Nov 11, 2026, 9:58 PM |
| Courier / `ge.mili.delivery` | `4.2.0+42` | Available on Google Play; Full rollout | Nov 11, 2026, 9:58 PM |

The UI's displayed last-updated times are not converted to an assumed timezone.
This audit did **not** click Publish, start a rollout, change review declarations,
or establish who published the releases. The earlier **Managed publishing ON**
observation is historical and must not be used to contradict the current live
release state. Customer v56 is not the selected current production release.

Customer v57 was built from pushed main
`097860cd0dc5a3b3170e1cda8572d5530c2724c1`. Compilation completed on Nov 11 at
approximately **18:31:48 UTC**, after **1752.3 seconds**. Finalization initially
stopped because four untracked Codemagic preparation files made the original
source checkout dirty. Those files were preserved by moving them into the
[dedicated iOS preparation directory](../../build-workspace/production/ios/codemagic-prepared-20261111/customer/),
not deleted. The supported resume path reused and reverified the same compiled
AAB; full finalization completed **2026-11-11 18:39:52.9604863 UTC**.

The [final v57 AAB](../../artifacts/production/android/20261111-customer-no-ad-id/mili-customer-main-097860c-v57-release.aab)
is **110100614 bytes**, SHA-256
`456C87ABAC7354481A9DEB91025C880EDC1365F05B411F17231EF0108CE10A00`.
Its [completed build manifest](../../artifacts/production/android/20261111-customer-no-ad-id/production-build-manifest.json)
records the exact source, registered upload signer, package/version, release
ABIs and successful bundle validation. The exact binary contains **zero** of the
five forbidden advertising permissions and **five false** Meta automatic-
collection flags; the custom `.MiliApplication` and normal Facebook provider
remain. The [static 16KB report](../../build-workspace/production/android/20261111-customer-no-ad-id/customer/verification-16kb/16kb-static-report.json)
passed. This is not 16KB-device runtime or zero-network-traffic certification.
Customer full tests: **781 passed**, including **14** focused privacy guards;
focused analysis: zero issues. [Exact-commit QA](https://github.com/Ertoba/mart-app/actions/runs/43073736694)
also passed. Upload was observed on Nov 11 with Console text **6:54 PM**;
the agent did not finish Customer's review flow before the overnight interruption.
Today's actual available/full-rollout evidence, not an inferred agent action,
establishes the current Play state. No v57 installation on the owner's device
is claimed; the earlier Nov 8 installation is a different snapshot.

### iOS: genuine Firebase registrations and manual Codemagic workflows

The owner explicitly authorized three Apple registrations. Following the
[official 6amMart Customer setup](https://6ammart.app/documentation/user-application-configuration/mandatory-setup/),
[Vendor setup](https://6ammart.app/documentation/vendor-application-configuration/vendor-app-mandatory-setup/),
[Courier setup](https://6ammart.app/documentation/deliveryman-application-configuration/deliveryman-app-mandatory-setup/)
and [Firebase Apple setup](https://firebase.google.com/docs/ios/setup), all three
were added under the **existing** `mili-a2a33` project, not separate projects.
It now has **3 Android + 3 Apple + 1 Web** registrations. Existing Android/Web
registrations were not replaced or changed.

| App / bundle ID | Genuine Firebase Apple app ID | Current iOS-workflow main |
|---|---|---|
| Customer / `ge.mili.customer` | `1:294177416704:ios:0d67b4e977c5587b9e5ae5` | `38d015b5a26ed96ea935e0fd718d0c1ea38b3fcb` |
| Vendor / `ge.mili.vendor` | `1:294177416704:ios:1d322e9dc37cbb989e5ae5` | `b5df627d3fffdb86b98d1556b88ff13e261e5ccf` |
| Courier / `ge.mili.delivery` | `1:294177416704:ios:dd089861d2092eee9e5ae5` | `a54f5540dbaa3c2d0530252867a1944b2da4c895` |

The complete official downloaded plists supplied by the owner were validated
and moved from Downloads into the [MILI iOS configuration directory](../../ops/config/firebase/ios/20261111/).
All three repository root iOS plists now match their actual registrations;
Customer's additional Runner copy is byte-identical. No app IDs or OAuth fields
were fabricated. The official files have no iOS `CLIENT_ID`; Google OAuth setup
is therefore deferred, not declared ready. A Nov 11 read-only backend snapshot
showed Google/Facebook/Apple login and Firebase OTP disabled, SMS OTP enabled.

Customer's malformed nested Keepz URL dictionary was lifted into its own valid
top-level `mili-customer` URL type; its Facebook callback was retained. Stale
Google/Firebase callbacks were removed. Customer/Courier Firebase phone-auth
callbacks are derived from each genuine app ID; Vendor has no Firebase Auth
dependency. All **3 Firebase + 3 URL preflights** pass, as do **14 negative URL**
and **9 negative provenance** tests. The negative tests are mocked guards, not
macOS compilation or device acceptance. Android advertising opt-out does **not**
disable or certify iOS Meta SDK tracking behavior.

Each pushed main contains a manual `ios-sideloadly` Codemagic workflow and
reviewable helpers/documentation:
[Customer](../customer-app/docs/ios-sideloadly.md),
[Vendor](../vendor-app/docs/ios-sideloadly.md),
[Courier](../delivery-app/docs/ios-sideloadly.md).
Configuration follows [Codemagic's Flutter YAML guidance](https://docs.codemagic.io/yaml-quick-start/building-a-flutter-app/):
**Flutter 3.47.5**, **CocoaPods 1.16.2**, `xcode: latest`, **Mac mini M2**, maximum
**90 minutes**, main only, no automatic triggers, publishing or Apple credentials.
The first actual Vendor machine reported **Xcode 26.6**; `latest` can move, so
each artifact's provenance must record the real version and exact source SHA.

The current authenticated Codemagic team is `69f4882fda08a305baf699a0`;
app IDs are Customer `69f488537c6d9370df65885f`, Vendor
`69f4889272837a9d1290b6c9`, Courier `69f488a9dca7e0144c8f98a9`.
Earlier `6af4…` team/app settings are not the current configuration.
The initial Vendor build `6af52eac9679c85ac0aee780` successfully compiled a
**65.2 MB Runner.app**, then failed our `lipo` argument order before validated
IPA delivery. All three mains now use the corrected
`lipo FILE -verify_arch arm64` form. Initial Customer
`6af52f3b9679c85ac0aee7ae` and Courier `6af52f7c9679c85ac0aee7b9`
received cancellation requests because they used that known-bad helper.
Fresh corrected builds were started from the three corrected main commits:
[Vendor](https://codemagic.io/app/69f4889272837a9d1290b6c9/build/6af532c59679c85ac0aee88e),
[Customer](https://codemagic.io/app/69f488537c6d9370df65885f/build/6af5330b9679c85ac0aee89f),
[Courier](https://codemagic.io/app/69f488a9dca7e0144c8f98a9/build/6af533379679c85ac0aee8ab).
All three second attempts **finished successfully**: Vendor **5m49s**, Customer
**8m0s**, Courier **5m16s**. Their IPAs and evidence archives were downloaded into
the [dedicated final iOS artifact directory](../../artifacts/production/ios/20261112-codemagic-sideloadly/).
Independent reports completed **03:49:47–03:50:48 UTC** and all returned **passed**:

| App / unsigned IPA | Packaged version / minimum iOS | Exact bytes | Independent proof / CI provenance |
|---|---|---:|---|
| [Customer IPA](../../artifacts/production/ios/20261112-codemagic-sideloadly/customer/mili-customer-unsigned-sideloadly.ipa) | `4.2.0+54` / `15.6` | 40888623 | [Verification](../../artifacts/production/ios/20261112-codemagic-sideloadly/customer/independent-verification.json) / [Provenance](../../artifacts/production/ios/20261112-codemagic-sideloadly/customer/evidence/provenance.json) |
| [Vendor IPA](../../artifacts/production/ios/20261112-codemagic-sideloadly/vendor/mili-vendor-unsigned-sideloadly.ipa) | `4.2.0+38` / `15.0` | 24722168 | [Verification](../../artifacts/production/ios/20261112-codemagic-sideloadly/vendor/independent-verification.json) / [Provenance](../../artifacts/production/ios/20261112-codemagic-sideloadly/vendor/evidence/provenance.json) |
| [Courier IPA](../../artifacts/production/ios/20261112-codemagic-sideloadly/delivery/mili-delivery-unsigned-sideloadly.ipa) | `4.2.0+40` / `15.0` | 23875167 | [Verification](../../artifacts/production/ios/20261112-codemagic-sideloadly/delivery/independent-verification.json) / [Provenance](../../artifacts/production/ios/20261112-codemagic-sideloadly/delivery/evidence/provenance.json) |

The iOS build numbers are the committed main pubspec values, not Android's
separate Play override codes. Each provenance matches its exact corrected main
SHA above. All three used **Flutter 3.47.5 / Dart 3.13.4 / Xcode 26.6 (17F113) /
CocoaPods 1.16.2**. Independent checks verified SHA-256/bytes against provenance,
ZIP CRC and safe paths, unsigned arm64 device Mach-O, bundle/version/minimum OS,
packaged genuine Firebase configuration and URL structure. Root code signatures
and provisioning profiles are absent as expected. **12 negative verifier tests**
also passed. The [status record](Documentation/operations/mobile-ios-status-20261112.json)
contains all exact IPA hashes. These are artifact checks, not signing,
installation, runtime authentication or payment acceptance.
The [combined iOS build manifest](../../artifacts/production/ios/20261112-codemagic-sideloadly/ios-build-manifest.json)
groups the three exact source/build identities, artifacts and verification limits.

Initial configuration QA passed for
[Customer](https://github.com/Ertoba/mart-app/actions/runs/43082452864),
[Vendor](https://github.com/Ertoba/vendor-app/actions/runs/43082465880) and
[Courier](https://github.com/Ertoba/delivery-app/actions/runs/43082477710).
Courier's first attempt encountered a transient NDK archive-download failure;
one authorized rerun succeeded on Nov 12 at **03:19:36 UTC**. These are the
initial configuration commits' checks, not proof of final corrected Mac builds.
The corrected helper commits also have green exact-commit QA:
[Customer](https://github.com/Ertoba/mart-app/actions/runs/43147884377),
[Vendor](https://github.com/Ertoba/vendor-app/actions/runs/43147893787) and
[Courier](https://github.com/Ertoba/delivery-app/actions/runs/43147901938).
Their checks completed Nov 12 at 03:37:20, 03:33:35 and 03:34:10 UTC respectively;
these GitHub checks do not replace Mac IPA or physical-device acceptance.

Native dependency evidence revealed an important limitation: **Flutter 3.47
automatically migrated supported plugins to Swift Package Manager**, leaving
CocoaPods for remaining dependencies. This is consistent with
[Flutter's current SwiftPM guidance](https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers).
The much smaller resolved Pod locks are therefore **not safe to commit alone**
without the corresponding Xcode/SwiftPM migration files and `Package.resolved`.
The latter was not captured. All before/resolved Pod locks and diffs are retained
under each artifact's evidence directory; **no resolved native lock was committed**
and full native dependency reproducibility is **not** claimed. Before future
builds, capture and review the complete native migration and SwiftPM resolution
evidence together. Do not force a CocoaPods rollback, blanket-delete locks, or
auto-push an isolated reduced Pod lock. The provenance's generic lock-review
warning is not approval to commit an incomplete migration.

Customer's actual packaged Meta/FBSDK frameworks report **18.1.1**, not the old
CocoaPods snapshot's **18.0.2**. The compatible native SDK resolved through
SwiftPM; iOS privacy flag settings were not changed by this work. Android's
advertising opt-out does not prove those iOS frameworks stop collecting data.

Unsigned IPA archives are for **local Sideloadly re-signing** with the owner's
Apple account; they are not directly installable, App Store or TestFlight
releases. No Apple signing certificate/private key was requested. Personal
account capability/validity restrictions still apply. Physical-device signing,
installation, APNs, Google/Apple login, Maps and payments are not yet certified.
This operation did not install apps, make payments, change existing Android
keys, upload iOS apps to a store, or deploy Backend/React. No protected official
activation/licensing files were imported.

Production Android paths remain fixed at
[work/logs](../../build-workspace/production/android/) and
[final artifacts](../../artifacts/production/android/), separately from
[debug work/logs](../../build-workspace/debug/android/) and
[debug artifacts](../../artifacts/debug/android/).
Local iOS work/verifiers stay in the [dedicated production iOS workspace](../../build-workspace/production/ios/20261112-codemagic-sideloadly/),
with final IPA/proof files only in the [dedicated production iOS artifacts](../../artifacts/production/ios/20261112-codemagic-sideloadly/).
Earlier preserved preparation remains under [production iOS work](../../build-workspace/production/ios/).
No other Desktop directory was created. All project files remain inside MILI.

## 2026-11-11 — Historical advertising opt-out/build-start snapshot (superseded)

The following subsection records an intermediate Nov 11 snapshot before the
verified build/upload and Nov 12 available-release audit above. Its running,
pending-verification and future-review statements are **not current status**.

The owner confirmed Facebook login is not used and explicitly chose disabling
collection plus a new build rather than declaring the existing v56 advertising
behavior. Customer main is now `097860cd0dc5a3b3170e1cda8572d5530c2724c1`.
The Android-only change removes AD_ID and all four advertising-services
permissions, disables five Meta automatic-collection flags in the manifest,
and enforces their false values in `MiliApplication.attachBaseContext` BEFORE
initialization providers. This also overrides previously cached true SDK
settings on upgrade; manifest-only defaults would not reliably do that.
The directly included Meta SDK is pinned to the reviewed **19.0.1**.

The normal Facebook initialization provider is retained because Flutter's auth
plugin constructs LoginManager even when Facebook's login button is unused.
This does not claim zero Meta configuration traffic or deletion of historically
queued events. Phone/Google/Apple auth, Maps, notifications and Keepz code were
not changed. No iOS/web collection behavior was changed or certified.

Verification before build: **781 full Customer tests passed**, including 14 new
source-configuration guards; focused test analysis found no issues. The exact
compiled AAB still needs its independent privacy/package/signer/ABI checks.

Production build started **2026-11-11 18:02:01 UTC / 22:02:01 +04** using the
existing Nov 7 registered upload key, from clean pushed main. Console maximum
was freshly checked as 56; the requested override is **4.2.0+57**, not a source
pubspec bump. Run ID: `20261111-customer-no-ad-id`.

- Work/source/logs: `build-workspace/production/android/20261111-customer-no-ad-id/`.
- Final AAB/manifest: `artifacts/production/android/20261111-customer-no-ad-id/`.
- Versioned entry point: `repos/customer-app/scripts/Build-MiliAdvertisingPrivacyRelease20261111.ps1`.
- VS Code task: `MILI: Customer advertising privacy AAB 20261111`.
- Debug roots remain `build-workspace/debug/android/<run>/` and `artifacts/debug/android/<run>/`; untouched.

The dated plan runs the maintained production runner and then checks the EXACT
AAB for all five advertising permissions absent, all five false flags, the
custom Application and the retained Facebook provider. At this intermediate
snapshot compilation is running: no finished v57 artifact, Play upload, updated
declaration or Customer review submission is claimed. The existing prepared
v56 will be replaced only after v57 passes binary checks. Do not regenerate
keys, overwrite earlier artifacts, clear device data or publish releases.

## 2026-11-11 — Production releases created; two in review, Customer blocked

This subsection is the **17:39 UTC snapshot** before the owner's later opt-out
choice and new build described above. Its review evidence is preserved.

After a read-only check showed that the owner had published older Nov 5 changes,
not the newly uploaded AABs, the owner explicitly authorized creating Production
releases and sending them for review. Each release uses ONLY its exact uploaded
current-main bundle; the older Production bundle is not included. Georgian
`ka-GE` release notes describe actual fixes. All three preview pages reported
**Ready to release**, with zero newly unsupported devices.

At **2026-11-11 17:39 UTC / 21:39 +04**, the verified state was:

| App | Production release | Review outcome |
|---|---|---|
| Vendor | `39 (4.2.0)`, release 7 | Submission **20**, **In review**; Console says "Your changes are now in review" |
| Courier | `42 (4.2.0)`, release 9 | Submission **23**, **In review**; Console says "Your changes are now in review" |
| Customer | `56 (4.2.0)`, release 9 | Saved in Publishing overview, **not submitted**; blocking policy issue below |

Vendor submission was accepted at 17:27:25 UTC; Courier at 17:35:40 UTC.
Their initial quick-check queues subsequently completed. Google may still find
issues during review: no approval or publication is claimed.
Exact release URLs, notes, submission identifiers and policy evidence:
[review record](Documentation/operations/play-review-20261111.json).

**Managed publishing ON** was confirmed separately on every app immediately
before submission/scope review and left unchanged. The existing release-editor
defaults (100% of already-targeted countries) were retained; Console describes
the FUTURE requested release action as "Start full rollout". No **Publish
changes** action was clicked and no live rollout started. Approval will not
automatically publish while managed publishing remains enabled. Backend, React
runtime, device apps, signing keys and original AAB bytes were not changed.

### Customer blocker — incomplete Advertising ID declaration

Google's completed pre-review checks explicitly block Customer with
**Incomplete advertising ID declaration**. Its declaration UI showed **No**
selected and Save disabled; this operation did not edit/save the declaration.
The prepared v56 remains saved, not in review. Do not click through or declare
"No" solely because the app does not display ads.

Read-only inspection of the EXACT uploaded v56 AAB confirms `AD_ID` and
advertising-services permissions. The
[built manifest](../../build-workspace/production/android/20261108-map-keepz-production/customer/verification-16kb/base-manifest.xml)
includes Facebook's auto-initializing provider; the
[merger report](../../build-workspace/production/android/20261108-map-keepz-production/customer/source/build/app/outputs/logs/manifest-merger-release-report.txt)
attributes AD_ID to Facebook Core **19.0.1**, brought by resolved
`flutter_facebook_auth` **7.2.0**. Exact SDK bytecode inspection confirms
AutoInitEnabled, AutoLogAppEventsEnabled and AdvertiserIDCollectionEnabled default
to true. No explicit disable/consent overrides were found. Firebase Analytics
plugin/full analytics SDK was NOT the proven origin. No actual identifier
transmission was captured, and arbitrary business purposes were not inferred.

[Google's declaration](https://developers.google.com/android-publisher/app-store-review/policy-declarations#2-advertising-id-declaration)
includes imported SDK usage. Meta's
[versioned defaults](https://github.com/facebook/facebook-android-sdk/blob/sdk-version-19.0.1/facebook-core/src/main/java/com/facebook/UserSettingsManager.kt),
[auto-init provider](https://github.com/facebook/facebook-android-sdk/blob/sdk-version-19.0.1/facebook-core/src/main/java/com/facebook/internal/FacebookInitProvider.kt)
and [SDK behavior](https://github.com/facebook/facebook-android-sdk/blob/sdk-version-19.0.1/facebook-core/src/main/java/com/facebook/FacebookSdk.kt)
support the technical finding, not an unverified owner privacy declaration.

An owner choice was requested: accurately declare the current SDK's
analytics/advertising use and submit v56, or explicitly authorize disabling that
collection and building a HIGHER unused version. No answer had been received at
this snapshot; neither policy declaration nor app source was changed. Do not
claim all three submitted until Customer's blocker is genuinely resolved.

## 2026-11-11 — Earlier upload-only snapshot: active keys and accepted AABs

This subsection records the **17:11 UTC upload-only operation**. Later release
and review status is superseded by the section above; its original upload record
and artifact provenance remain unchanged.

Under developer account `7565015607548339760`, the authenticated **App signing >
Upload key** SHA-256 values were copied through the Console UI and exactly matched
the Nov 7 new public certificates for all three packages. The Nov 9 activation
schedule has elapsed; the matching signed bundles were actually accepted today.
The owner also supplied the Vendor reset email with activation Nov 9 08:28 UTC
and matching SHA-1 `0E:E8:A0:3D:7D:A7:6A:9A:80:BD:2A:EC:48:DF:75:C8:75:D0:CC:8B`.
No old private key was sought, no new key generated, and no additional reset or
Google Play app-signing-key upgrade requested.

Combined verification completed at **2026-11-11 17:11:08 UTC / 21:11:08 +04**.
The exact files, bytes, hashes, source SHAs, active certificate fingerprints and
Console evidence URLs are in the versioned
[upload / registration record](Documentation/operations/play-upload-20261111.json).
This is an operator-observed Console record, not a Google-signed export.

| App / package | Exact current main SHA | Version accepted | Play maximum before upload | Status |
|---|---|---|---:|---|
| Customer / `ge.mili.customer` | `9afb21cb9de7254e44c5a699e6ab15d9ebfa4e4e` | `4.2.0+56` | 50 | Inactive |
| Vendor / `ge.mili.vendor` | `3d87c5d573b18fca15d9eb8e37ed9695fbf16675` | `4.2.0+39` | 34 | Inactive |
| Courier / `ge.mili.delivery` | `06662dd2f49a5ec994f41300fd072970a9913605` | `4.2.0+42` | 37 | Inactive |

Preflight freshly checked clean app `main` branches against live origin, artifact
SHA-256/size, JAR signatures and exact new signers, bundletool validation,
package/version and release/non-debuggable manifest (minSdk 24, targetSdk 36).
The existing verified Customer/Courier Nov 8 bundles and Vendor Nov 7 bundle were
already current, so **no rebuild was necessary**. Customer v55 and Courier v41
from Nov 7 were not selected. Original filenames retain their historical
`pending-upload-key-reset` suffix; do not rename, overwrite or rebuild solely
because of that suffix. Existing production/debug directory separation below is
unchanged. No protected official activation/licensing sources were used.

Uploads used **All app bundles > Upload new version**, not release-track editing.
Each new row shows the expected version name/code and **Inactive** after processing.
No release was created, review submitted, publishing changes applied or rollout
started by this operation. Pre-existing pending publishing changes were left
untouched. Uploaded does **not** mean available to users, approved for release,
financial-flow acceptance, or 16KB-device runtime certification.

The old `pending-registration`, `safeToUpload=false` and no-upload statements in
dated Nov 7/8 key/build records are creation-time historical snapshots, superseded
by today's observed registration and acceptance. They were not rewritten to
falsify build-time state. For future production builds, pass the per-app
`registrationEvidence` from the new record via `-PlayRegistrationEvidence` as an
outer PowerShell hashtable keyed `customer`, `vendor`, `delivery`; each entry
requires matching `certificateSha256`, `verifiedAtUtc`, `evidenceReference`.
Future bundles must use a fresh Console maximum-version check and higher unused
codes: 56 / 39 / 42 are now consumed, not available for re-upload.

Backend/React deployment and Pixel installation facts below were last verified
on Nov 8; this Play-only operation did not deploy, restart, reinstall or re-audit
those systems. This documentation and the public upload record are maintained
on React `main`; application repository commits remain unchanged.

## 2026-11-08 — Developer Map / Keepz audit fixes and safe rollout

The supplied Customer/Courier developer audit was checked against actual code,
full local Git history and current official 6amMart/Keepz/Flutter/Google guidance.
The owner superseded an interim main-only instruction with explicit safe
production deployment and rebuild authorization. No real financial transaction,
cash reset or order acceptance was used for testing.

### Fixed and pushed

| Component | Pushed main | Result |
|---|---|---|
| Customer | `9afb21cb9de7254e44c5a699e6ab15d9ebfa4e4e` | Parcel opens owned Keepz sheet directly, retains the same order across dismiss/fail/retry, and blocks unsafe changed-draft duplicates; Parcel and tracking road polylines restored; details use store-to-customer (parcel sender-to-receiver) independently of courier assignment |
| Courier | `06662dd2f49a5ec994f41300fd072970a9913605` | Cash transfer stays in one inline WebView sheet; no browser window/double back; success requires matching payment ID plus paid AND settled Backend proof; capability checked before any create POST |
| Backend | `6f538fc862a7a96ab6ca90ca2a3e76045bb3e64a` | Authenticated owned cash-status/capability contract; new Keepz cash payments atomically record paid state, ledger mutation and idempotent receipt; legacy payment records are not retrospectively settled |

Map state is screen-local, bounded, stale-response guarded and reused for stable
endpoints; courier GPS updates the marker without querying a new route each tick.
Loading/no-route/error and retry are distinct. No straight-line substitute is
presented as a road route. Sensitive API/WebView logging was removed. Courier's
new embedded cash flow is Keepz-only; unsupported gateways fail before POST.
HTTPS bank/3DS pages remain inline; unverified custom-bank schemes are blocked.
Pending-order/payment retry dedupe is in-memory; cross-restart dedupe and real
bank/3DS acceptance are not claimed.

Verification: Customer full suite **767 passed**, Courier **88 passed**; focused
map/payment/API static analysis passed. Backend financial suite **37 tests / 184
assertions**, no errors/failures/skips, independently rerun against memory SQLite
with stray provider HTTP blocked. Existing PHPUnit XML-schema deprecation remains.
No protected official activation/license sources were read or copied.

Exact-commit GitHub checks succeeded:
[Customer QA](https://github.com/Ertoba/mart-app/actions/runs/42483512777),
[Courier QA](https://github.com/Ertoba/delivery-app/actions/runs/42483518593),
[Backend integrity](https://github.com/Ertoba/portal-backend/actions/runs/42483917444),
[Backend OTP](https://github.com/Ertoba/portal-backend/actions/runs/42483917428).
Backend main then advanced to CI-only `35b4110c37afcc0c07ec5a3c3c335976772e07ab`,
adding the new owned-status/receipt/recovery tests and triggers to ongoing CI.
Its [expanded financial CI](https://github.com/Ertoba/portal-backend/actions/runs/42486762563)
also passed. Runtime PHP is unchanged from deployed `6f538fc`; no redeploy is
needed for a workflow-only commit.
Backend main is now `b7bb26c75a58f9e6ac4aca1cc82095375296f526`: the later change
fixes workstation build-result array/recovery handling only, not deployed PHP.

History correction: Customer `966ee69` → V4.2 import `546ebef` really removed the
tracking polyline pipeline. Backend already used Routes v2 before V4.2; a response
format migration is not the proven cause. Courier's browser/double-back flow was
byte-identical before/after V4.2 (`64a5883` → `65dc4a0`), and Parcel's generic
payment routing also predated V4.2. These are fixed current bugs, not all newly
introduced V4.2 regressions. Exact baselines, contracts and primary sources:
[history / financial boundary](../../reports/live-debug/20261108-map-keepz/HISTORY-AND-BACKEND-CONTRACT.md).

### Current production — Backend switched, React unchanged

At **2026-11-08 13:26:59–13:27:07 UTC / 17:26:59–17:27:07 +04**, the verified
candidate became `/var/www/mili-current` → `/var/www/mili-release-6f538fc`.
Its actual Git HEAD is `6f538fc862a7a96ab6ca90ca2a3e76045bb3e64a`.
Queue/Reverb now run PHP 8.3 from that release; Nginx/FPM/Supervisor/MariaDB are
active. Public home, React home, Admin login and API config returned 200; protected
cash status without authentication returned 401. Capability formatting passed
without a real courier/payment. New-version cash aggregates were zero at the
switch snapshot, not a permanent assertion about future user activity.

Fresh verified backup: `/var/backups/mili-db-prechange-20261108-map-keepz-131952.sql.gz`,
865610 bytes, mode 0600, SHA-256
`e73a6088c26d839577eae72c5c5cbc5db692ed98ae5f95760e8220acd41a4f3a`.
No migrations or DB restore ran. Previous Backend `ff94f1f` remains intact.
Do not blindly revert to old settlement code after new version-1 cash payments
exist: drain/preserve compatible callbacks and inspect current receipt state first.

Deployment used the verified production baseline plus only six reviewed runtime
PHP paths, not a full upstream/private archive. Installation payload directory
was excluded; no new activation/licensing logic was introduced. Unchanged
dependencies/Vite assets were reused. All **3729 tracked application-source files**
in the declared runtime scopes matched the pushed Git tree (generated bootstrap
cache excluded), and direct PHP 8.3 FPM candidate probes passed before switching.
The initial Windows CRLF export was rejected and corrected to exact Git LF bytes.
Server Git exclusion-pathspec diff crashes were bypassed with independent Git-blob
hash verification; a fully pristine deployment checkout is not claimed.

Five-minute soak at 13:32:40–43 UTC remained healthy: jobs/failed_jobs zero,
217 tables, no config cache. Artisan separately confirmed 407 present migration
files ran / zero pending; its ledger has 408 rows. A read-only public-landmark
route probe returned actual Routes-v2 encoded geometry (245 characters,
4502 metres, 968 seconds), HTTP 200. No personal location/provider key was logged:
[live road-route probe](../../reports/live-debug/20261108-map-keepz/live-road-route-probe.json).

React remains production `f6968b346819325797d517f4e2abea68d895baf8`, port 3002;
only this context document changed on React main, so no web rebuild/deploy was
needed. Vendor source/app also remains unchanged.

Exact deployment / rollback / source evidence:
[production rollout](../../reports/production/20261108-map-keepz-deployment.md).

### Verified mobile releases and data-preserving device update

Run `20261108-map-keepz-production` completed verification at **2026-11-08
14:10:21 UTC / 18:10:21 +04**, from the exact pushed application SHAs above.
Both use the SAME Nov 7 new upload keys, never regenerated or replaced.
Work/logs stay under `build-workspace/production/android/20261108-map-keepz-production/`;
final bundles/manifests under `artifacts/production/android/20261108-map-keepz-production/`.
The dated entry point is `ops/scripts/Build-MiliMapKeepzRelease20261108.ps1`.
Vendor does not need a rebuild. No old artifact or key was overwritten.

| App | Final signed AAB | Bytes | SHA-256 |
|---|---|---:|---|
| Customer `4.2.0+56` | [Nov 8 Customer](../../artifacts/production/android/20261108-map-keepz-production/mili-customer-main-9afb21c-v56-pending-upload-key-reset.aab) | 110098923 | `D6DA5A594C4C067107CA8299FA2AF6E9461AA886C70DF7E2853416E37B9B4539` |
| Courier `4.2.0+42` | [Nov 8 Courier](../../artifacts/production/android/20261108-map-keepz-production/mili-delivery-main-06662dd-v42-pending-upload-key-reset.aab) | 77483617 | `403A24391BD29BE903E509FF3F954718A54D497C28C01C41DD2782F864967FA1` |

Compilation took 1435.8 / 1617.5 seconds respectively. Both passed JAR signature,
exact new signer, bundletool/package/version/release/ABI/private-file checks.
Fourteen ELF64 libraries (Customer 8 / Courier 6) pass static 16KB LOAD alignment;
both bundles request `PAGE_ALIGNMENT_16K`. The final
[build manifest](../../artifacts/production/android/20261108-map-keepz-production/production-build-manifest.json)
is `verified-builds-complete`.

A PS5.1 empty/single-result array unwrap failed metadata append after Courier's
verified AAB/mapping were copied. The failed snapshot is preserved. The runner
fix and explicit resume fully reverified both existing binaries without recompiling
or overwriting either final file. Exact orphan AAB/symbol adoption requires matching
source/stage/version/signer/hash and is never a general overwrite permission.

At **14:12:34 UTC / 18:12:34 +04**, Pixel 6a `29301JEGR18798` was updated with
Customer v56 and Courier v42 using `-UpdateExisting`, not uninstall/reinstall.
Installed old signers were verified first; all selected APK sets were prepared
before writing. All eight installed APK hashes match generated payloads, and
the Nov 7 first-install times remain Customer 17:58:43 / Courier 17:58:56.
Vendor v39 remains unchanged (last update Nov 7 17:58:50). No app data clear ran.

Device run work/logs: `build-workspace/production/android/20261108-map-keepz-device-update/device-apks/`;
final APK sets and evidence: `artifacts/production/android/20261108-map-keepz-device-update/device-apks/`.
Evidence: [device manifest](../../artifacts/production/android/20261108-map-keepz-device-update/device-apks/device-install-manifest.json),
[launch smoke](../../artifacts/production/android/20261108-map-keepz-device-update/device-apks/cold-launch-smoke.json),
[APK ZIP alignment](../../artifacts/production/android/20261108-map-keepz-device-update/device-apks/apk-zip-alignment.json).
Both cold launches passed at 18:13:24–30 +04, live after four seconds, zero sampled
fatal/unhandled patterns. All eight generated APKs pass 16KB ZIP alignment checks.
Temporary password files and staging signing links were removed.

Pixel uses 4096-byte pages; 16KB-device runtime and real bank/3DS/payment acceptance
are not certified. These are local upload-key signatures, not Google Play's app
signing identity. At this Nov 8 snapshot, Play activation was still pending the
Nov 9 schedule below and no Play upload/rollout had occurred. The Nov 11 section
supersedes that upload-key/upload status. Preserve the separate debug directories below.

## 2026-11-07 — Play AAB rebuild and new upload keys

The owner requested production AAB rebuilds of all three current application
`main` branches, strict production/debug folder separation within MILI, and new
upload keys instead of searching for previously lost private keystores.

### Exclusive build and artifact directories

| Purpose | Workspace-relative path |
|---|---|
| Production source exports, build outputs and logs | `build-workspace/production/android/<run>/<app>/` |
| Final production AABs and verification manifest | `artifacts/production/android/<run>/` |
| Device-specific production APK conversion work/logs | `build-workspace/production/android/<device-run>/device-apks/` |
| Final production device APK sets and installation evidence | `artifacts/production/android/<device-run>/device-apks/` |
| Debug source exports, build outputs and logs | `build-workspace/debug/android/<run>/<app>/` |
| Final debug APKs and verification manifest | `artifacts/debug/android/<run>/` |
| Shared tool/dependency caches | `build-workspace/cache/` |
| Private upload keys and signing configuration | `ops/secrets/android-signing/<app>/<key-run>/` |
| Public certificates and non-secret key metadata | `ops/config/android-signing/<key-run>/` |

All paths are under `C:\Users\miro\Desktop\მილი`; M: is its ASCII alias, not
another workspace. Never recreate obsolete Desktop/build or Desktop/6ammart.
Each run is immutable. Existing 2026-11-01 debug APKs remain historical evidence;
older empty `artifacts/release/` directories are not upload sources.

Canonical workstation tools are versioned under Backend
`scripts/workstation/`, with thin local entry points under `ops/scripts/`.
The staging helper exports the exact clean pushed application SHA, omits Git
metadata and private key/configuration files, and builds inside the selected
mode's export, never in an app checkout's old debug build tree. No global Flutter
build-directory setting is changed. See the
[Android release runbook](../backend-admin/Documentation/MILI-android-release-builds.md).
The staging/debug/production/key-generation tools and runbook were pushed to
Backend `main` as `0070a913f558242a2d6359abeee363c6123e92bd`. This commit changes
workstation tooling/documentation only; the deployed Backend application remains
`ff94f1f` and was not redeployed.
The verified metadata-filter recovery, explicit resume path, and static ELF64
checker were subsequently pushed as `298b0f738838701ef5818123e3ca8f52372fbf08`.
General partial-run recovery and its PowerShell 5.1 single-record guard were
pushed as `3a5cb8c` and `065b94187ed378cbad64f8fc7f85f0f9b455a223`.

### Verified source and version plan

The authenticated Console All app bundles table was sorted by version code
descending on 2026-11-07. These maxima include uploaded bundles, not just the
active production release. New codes exceed both Play and current source:

| App | Application `main` at Nov 7 build | Git code | Play maximum | New AAB code |
|---|---|---:|---:|---:|
| Customer | `6b0d98f42fc25358474c3b8466eafe98aaa559bc` | 54 | 50 | 55 |
| Vendor | `3d87c5d573b18fca15d9eb8e37ed9695fbf16675` | 38 | 34 | 39 |
| Delivery | `396aef537b4521315a24ce6370198009e3141cc3` | 40 | 37 | 41 |

Version name remains `4.2.0`; a CLI build-number override is recorded without
modifying application `main`. The requested release run is `20261107-production`,
using [new key metadata](../../ops/config/android-signing/20261107-upload-reset/upload-keys.json).
Serial full-ABI signed release compilation started at 12:31 +04 and the final
resumed run completed successfully at **2026-11-07 17:34:50 +04**. All three signed
AABs were technically verified; at this Nov 7 snapshot, Play upload eligibility
was pending the scheduled upload-key activation below. No AAB was uploaded or
rolled out on Nov 7. See Nov 11 for the later activation and selected uploads.

### Final signed production AABs

Customer compiled successfully in 1526.2 seconds. Its initial post-build scan
mistook Google's public library-version metadata for a credential file. An exact
path/size/three-field/client/version check corrected the false positive without
weakening other private-file checks. The failed manifest was preserved, the same
fresh signed AAB was reverified without recompilation or timestamp changes, and
Vendor/Delivery continued serially in the same production run.

| App | Final signed candidate | Bytes | SHA-256 |
|---|---|---:|---|
| Customer | [Verified signed candidate v55](../../artifacts/production/android/20261107-production/mili-customer-main-6b0d98f-v55-pending-upload-key-reset.aab) | 110083676 | `50689AAFBEECD49588178C35F7660AE9581A05D262A148FBC04583FB3CA96EC9` |
| Vendor | [Verified signed candidate v39](../../artifacts/production/android/20261107-production/mili-vendor-main-3d87c5d-v39-pending-upload-key-reset.aab) | 87513976 | `526AA2961E4B474500BA4049D20A53DE5226EAAB4DDD736FF05BD8CD4CE1F9BB` |
| Delivery | [Verified signed candidate v41](../../artifacts/production/android/20261107-production/mili-delivery-main-396aef5-v41-pending-upload-key-reset.aab) | 77907717 | `4700AC6D38AECB119E138A12FC2A9C688A6B2164272C54DF522428ED56FFBCF0` |

Customer gates passed: JAR signature and exact NEW upload signer, bundletool
validation, package `ge.mili.customer`, version `4.2.0+55`, minSdk 24 / targetSdk
36, debuggable false, ARMv7/ARM64/x86-64 Flutter release libraries, and private-file
exclusion. Its R8 mapping is preserved beside the AAB. Eight ELF64 libraries passed
static LOAD alignment/congruence, with `PAGE_ALIGNMENT_16K` requested in bundle
config. This does not certify generated-APK ZIP alignment, 16KB device runtime,
Google Play acceptance, or payment-flow acceptance.

Vendor compiled successfully in 1487.6 seconds and passed the same release
signature/package/version/SDK/ABI/private-file gates (`ge.mili.vendor`,
`4.2.0+39`, minSdk 24 / targetSdk 36, debuggable false). Its six ELF64 libraries
pass static 16KB LOAD alignment/congruence and request `PAGE_ALIGNMENT_16K`;
generated-APK ZIP/runtime/Play acceptance are not certified.

Delivery's first build and Flutter's automatic retry stopped at
`:shared_preferences_android:generateReleaseLintModel` because DNS resolution of
`dl.google.com` prevented downloading the pinned AndroidX datastore 1.1.3 JARs.
On owner-requested continuation at 17:21 +04, DNS and the exact official Maven
artifact URL were reachable with HTTP 200. This is a dependency-download failure,
not an application-code change. Customer/Vendor verified AABs were preserved;
only Delivery was retried using its existing validated staging tree and cached
build outputs. No upload keys were regenerated or completed AABs overwritten.
At 17:26 +04 the runner had reverified and retained both finalized AABs unchanged
and restarted only Delivery's missing bundle. A PS5.1 single-record array issue
initially hit the no-overwrite guard safely; it was fixed and integration-tested
without modifying either completed file. Partial-run recovery preserves previous
failed-manifest snapshots and all original finalized-artifact timestamps/hashes.

Delivery's successful incremental retry completed in 502.8 seconds; both previously
missing pinned Google Maven JARs downloaded on 17:31. The final AAB passed the same
signature/new-signer/bundletool/package/version/SDK/ABI/private-file gates:
`ge.mili.delivery`, `4.2.0+41`, minSdk 24 / targetSdk 36, debuggable false.
Its six ELF64 libraries pass static 16KB LOAD alignment/congruence, with
`PAGE_ALIGNMENT_16K` requested. Customer/Vendor retained their original AAB bytes,
hashes and timestamps. All final AAB copies and mapping/symbol hashes were checked
again, and all temporary Android signing-property hard links were removed.

Static native reports: [Customer: 8 ELF64 libraries](../../build-workspace/production/android/20261107-production/customer/verification-16kb/16kb-static-report.json),
[Vendor: 6](../../build-workspace/production/android/20261107-production/vendor/verification-16kb/16kb-static-report.json),
[Delivery: 6](../../build-workspace/production/android/20261107-production/delivery/verification-16kb/16kb-static-report.json).
All 20 pass LOAD alignment/congruence. These are static checks only, not generated
APK ZIP alignment, 16KB-device runtime, financial-flow QA or Google Play acceptance.

The [production run manifest](../../artifacts/production/android/20261107-production/production-build-manifest.json)
now has `status=verified-builds-complete` and all three components. Timestamped
failed-manifest snapshots are historical recovery evidence, not the final result.
The historical manifest retains `safeToUploadAllToExistingPlayApps=false`, which
was correct when built before activation. Do not interpret that creation-time
snapshot as the current Console state; see the Nov 11 verification. Original
filenames retain the explicit `pending-upload-key-reset` qualifier.

### New upload keys — not Play app-signing upgrades

On explicit owner instruction, new per-app RSA-3072/SHA256withRSA upload keys were
generated once as `20261107-upload-reset`. Private JKS files and generated signing
properties are restricted to the current Windows owner and SYSTEM; passwords are
random, not printed, and absent from Git, public metadata and artifacts.
Public PEM/DER certificates cannot reconstruct private keys. The owner must keep
a separate secure backup; do not copy outside MILI without an explicit destination.

| App | NEW upload certificate SHA-256 |
|---|---|
| Customer | `FE:B2:A5:92:67:A9:0F:78:9D:8E:97:C5:48:BB:2A:70:F9:7F:3E:15:0C:EB:74:8B:73:56:D3:65:EA:F4:94:EB` |
| Vendor | `FB:2E:46:95:5E:EA:C1:6F:51:B3:E1:71:13:8F:4E:34:DE:DF:2B:00:B6:59:B9:27:1D:97:0B:88:AC:A6:41:69` |
| Delivery | `9D:9B:99:B0:46:2C:67:60:70:D2:FE:EA:5E:2D:81:38:49:BF:97:12:4E:F8:CF:6E:88:36:63:AA:57:FC:34:3E` |

At this Nov 7 snapshot, keys were `pending-registration`. Public PEMs
were submitted through **Upload key > Request reset**, not **App signing > Upgrade
key**; do not submit duplicate resets. Do not publish Console changes or start
rollout as part of this rebuild request. An acknowledged reset request is not proof
that the new signer is active; require matching Console certificate and effective
state before calling AABs upload-ready. The original candidates retain the
`pending-upload-key-reset.aab` suffix.

All three new PEM certificates were submitted through the authenticated Console
on 2026-11-07; each request changed to **processing**. The App signing page's
banners show stale October 16 dates. This was resolved by expanding the **new
Nov 7 reset-received notifications**: each identifies the matching NEW certificate
SHA-1 and explicitly states the following activation time and upload prohibition
until then. Use those matching notifications, not the stale banners:

| App | Google notification activation (UTC) | Asia/Tbilisi |
|---|---|---|
| Customer | 2026-11-09 08:33 | **2026-11-09 12:33 +04** |
| Vendor | 2026-11-09 08:28 | **2026-11-09 12:28 +04** |
| Delivery | 2026-11-09 08:36 | **2026-11-09 12:36 +04** |

All three were pending on Nov 7. The prohibition on uploading before the scheduled
times was followed. Expected active upload fingerprints and actual acceptance were
verified on Nov 11; see the current section above. The
[Nov 7 reset-state record](../../ops/config/android-signing/20261107-upload-reset/play-reset-status.json)
is preserved as historical evidence, not a current pending-reset assertion.

Authenticated Console app-signing SHA-256 values remain unchanged:

- Customer: `D0:BA:E5:29:36:57:94:64:2A:45:D8:74:AD:D3:C9:B6:7E:56:82:2A:08:AD:8A:16:A6:8F:14:04:17:94:C5:71`.
- Vendor: `44:68:4F:3C:B9:97:8F:DD:12:3F:64:E9:C7:24:97:DE:C2:D5:A9:95:60:5B:3B:47:D3:98:4E:25:0F:39:9D:D6`.
- Delivery: `35:7C:23:56:E9:65:72:82:54:80:42:83:3F:EC:E6:14:D0:10:0E:5B:91:FF:5E:D5:48:71:B3:58:24:87:8E:97`.

The supplied Vendor deployment certificate matches its Console app-signing SHA-256
`44:68:4F:3C:B9:97:8F:DD:12:3F:64:E9:C7:24:97:DE:C2:D5:A9:95:60:5B:3B:47:D3:98:4E:25:0F:39:9D:D6`.
The supplied pre-reset upload certificate has SHA-256
`25:62:DC:21:59:E3:E9:C9:E1:6A:FC:37:A8:98:F7:73:3E:3B:0A:E8:ED:99:27:0A:54:58:30:5F:7D:9E:49:E5`
(created 2026-10-14), superseding older historical upload-fingerprint assertions.
Keep Play app-signing fingerprints in Digital Asset Links/API provider mappings;
do not replace them with the new upload-key fingerprints.

Validation tool: official Google bundletool 1.18.3, SHA-256
`A099CFA1543F55593BC2ED16A70A7C67FE54B1747BB7301F37FDFD6D91028E29`, verified
against the GitHub release asset digest. Java must use its ASCII path
`M:/tools/bundletool/bundletool-all-1.18.3.jar`. Pinned Flutter and dependency
lockfiles are retained; no framework/plugin upgrade or activation code import
is included in this rebuild.
Android production builds/signature checks used existing Android Studio JBR
**21.0.9**; the separately restored system Java 17 listed historically below is
not this release compiler. Kotlin/Gradle forward-compatibility warnings were
recorded, not "fixed" through an unrequested framework upgrade.

No off-workspace backup was created. The new private upload keystores and signing
configuration are currently only in the protected MILI directory. A separate
secure backup is still required to survive deletion of this workspace; the owner
was asked for an explicit backup destination or to retain a backup themselves.

### Historical Pixel 6a fresh installation — 2026-11-07

Customer v55 and Courier v41 below were superseded by the Nov 8 data-preserving
v56/v42 updates above. Vendor v39 remains current; original first-install facts
and hashes below are retained as dated history.

The owner explicitly requested the NEW signatures and authorized deleting the
three old installations before reinstalling. All three release APK sets were
prepared and verified **before the first uninstall**. Only `ge.mili.customer`,
`ge.mili.vendor` and `ge.mili.delivery` were uninstalled on Pixel 6a
`29301JEGR18798`. Their local data/sessions were reset; no server-side account,
order or financial transaction was deleted or modified.

No Flutter recompilation was needed: official pinned bundletool generated
device-specific APKs directly from the verified production AABs above, using the
same NEW per-app upload certificates (Customer `FE:B2:…:94:EB`, Vendor
`FB:2E:…:41:69`, Delivery `9D:9B:…:34:3E`; full fingerprints above).
All three application source SHAs still matched live GitHub `main` before install.
The original Play AAB bytes/hashes were rechecked and remain unchanged.

| App / package | Installed version | Fresh first-install time (+04) | Installed base APK SHA-256 |
|---|---|---|---|
| Customer / `ge.mili.customer` | `4.2.0+55` | 2026-11-07 17:58:43 | `E56953CB0358B07499A5632CFBE622CDD6A63901F85B4660738B1CC894A11659` |
| Vendor / `ge.mili.vendor` | `4.2.0+39` | 2026-11-07 17:58:50 | `428AF99DDFCA387448A819E14A2CC15855CFE4C10D1AD07E6B792FEB5537312E` |
| Delivery / `ge.mili.delivery` | `4.2.0+41` | 2026-11-07 17:58:56 | `C456317BCD731AB77B62ED39C7D83865F9201A71657DB60E22368842F3A36A3E` |

Each installation consists of the release base plus ARM64, English and xxhdpi
splits. All 12 APKs passed signature checks against their expected new certificate;
all 12 installed APK hashes exactly match the generated payload. Release manifests
remain non-debuggable. First-install times changed from Oct 29, confirming fresh
installations rather than data-preserving updates. All temporary password files
were removed; private keystores were neither regenerated nor copied into artifacts.

Evidence: [installation manifest](../../artifacts/production/android/20261107-device-new-signature-install/device-apks/device-install-manifest.json)
and [cold-launch smoke](../../artifacts/production/android/20261107-device-new-signature-install/device-apks/cold-launch-smoke.json).
Conversion work is confined to
`build-workspace/production/android/20261107-device-new-signature-install/device-apks/`;
final device APK sets/evidence are confined to
`artifacts/production/android/20261107-device-new-signature-install/device-apks/`.
The separate `20261107-device-new-signature` directory contains only an earlier
read-only device-spec preflight, not final installation outputs.

At 17:59:44–54 +04 all three cold launches returned `Status: ok`, retained a live
process after four seconds, and had zero sampled fatal/unhandled/build-during-build
exception patterns. This is launch smoke only, not login, payment, order acceptance,
full feature QA or 16KB-device certification. These locally upload-key-signed APKs
are **not** Google Play's app-signing identity; provider/App Links configuration
was not changed. Play upload was pending at this Nov 7 device-install snapshot;
the Nov 11 section records the subsequent activation and uploads.

The verified installer and release runbook were pushed to Backend `main` as
`3006174d487c0ccce56fac3a8e8f7472fcc33be1`; workstation changes only, no runtime deploy.

### Backend/Admin and React production versus main — 2026-11-07

After installation the owner requested checking both production applications
against their latest `main`. Authenticated pinned-host SSH observations ran at
17:59:48–18:00:59 +04; public GET probes completed by 18:02:26 +04.

| Component | Actual production Git HEAD | GitHub main at audit | Difference |
|---|---|---|---|
| Backend/Admin | `ff94f1fdd38e095675aa9c99a27236859b785eeb` | `3006174d487c0ccce56fac3a8e8f7472fcc33be1` | Seven workstation/runbook files only |
| React | `f6968b346819325797d517f4e2abea68d895baf8` | `8ff8e2ba8e0df5f5ac8517accbb6620ed61d00ce` | This context document only |

Production is **not literally checked out at the newest main commit IDs**.
However, there are no newer tracked application-source changes missing from
either deployed application; the newer commits are documentation/workstation
tools. This context update advances React main again without changing runtime
code. No deployment was performed merely to match documentation-only SHAs.

Backend `/var/www/mili-current` still resolves to the `ff94f1f` release; Nginx
uses its `public` root and React port 3002. React PM2 process is online in the
`f6968b3` release, with the expected Next BUILD_ID; its tracked tree is clean.
Nginx, PHP 8.3 FPM, Supervisor and MariaDB are active. Queue/Reverb are running
PHP 8.3 from the correct Backend release. The preserved React rollback remains
online; no rollback or restart was performed.

Important qualification: Backend has **14 tracked deployment/generated-path
changes**, not a fully clean worktree: three generated `bootstrap/cache` PHP
files, the tracked `public/build` placeholder replaced by real Vite output, and
storage placeholders beneath the persistent storage link. Excluding exactly
`bootstrap/cache/**`, `public/build` and `storage/**`, its tracked source diff
against the deployed HEAD is empty. The Vite manifest hash matches the original
release evidence; generated-cache semantics were not audited. The historical
Oct 28 `runtimeDirtyEntries=0` assertion is therefore superseded, not current.

Public home, API config, Admin login and the Admin/Vendor/Store host redirects
all returned HTTP 200. No authenticated user-session, payment, notification,
queue-content or migration acceptance is claimed. Production files, database,
services and financial state were not modified by this read-only check.

Exact evidence and path lists:
[Nov 7 production/main audit](../../reports/production/20261107-production-main-audit.md).
The separately dated restoration section below preserves its original broader
audit results and must not be read as newly revalidated in full.

## 2026-11-01 — Mobile live-debug fixes

The owner authorized implementing the collected bugs, pushing to each `main`,
and rebuilding the debug applications. All six reported bugs are implemented:

- Customer: Georgian/Russian flags restored from MILI Git history; Keepz hosted
  checkout remains inside the bottom sheet in both entry paths. Backend-paid
  status is required before success/cart clearing; unknown state stays retryable
  without covering the hosted payment UI.
- Vendor: BOGO home copy is localized in Georgian/Russian/English; the card grows
  with text. Android launcher/adaptive assets preserve the canonical SVG ratio,
  transparency and safe zone, correcting the first Android system splash too.
- Delivery: profile capabilities gate Delivery/Ride income calls; delivery-only
  couriers no longer call the absent RideShare endpoint. Order details loads
  after the first frame, releases refresh guards on error, and offers retry.
  A fresh, accurate cached GPS fix avoids another unnecessary acceptance wait.

Pushed mobile source SHAs:

| Component | Pushed main at Nov 1 build |
|---|---|
| Customer | `6b0d98f42fc25358474c3b8466eafe98aaa559bc` |
| Vendor | `3d87c5d573b18fca15d9eb8e37ed9695fbf16675` (fix `4dcf67e` plus the existing CI-generated branding commit) |
| Delivery | `396aef537b4521315a24ce6370198009e3141cc3` (same-order item preservation and bounded indoor GPS fast path) |

Verification: Customer focused tests 10/10; Delivery full suite 63/63
plus affected follow-up tests 5/5 and final GPS tests 6/6;
Vendor locale and 17-icon geometry/reproducibility checks passed. Windows CLI
static analysis did not terminate reliably and is not claimed green. Linux CI
app-analysis/test/Android-build quality gates succeeded for Customer `6b0d98f`,
Vendor source fix `4dcf67e`, and Delivery `396aef5`:
[Customer](https://github.com/Ertoba/mart-app/actions/runs/41302001364),
[Vendor](https://github.com/Ertoba/vendor-app/actions/runs/41301882540),
[Delivery](https://github.com/Ertoba/delivery-app/actions/runs/41303155445).
Vendor's generated-only `3d87c5d` follow-up is checked by the local APK build,
not claimed as a separate CI QA run. All three serial ARM64 debug APK builds
completed successfully from clean pushed `main` checkouts at 15:59 +04;
the [fix/rebuild record](../../reports/live-debug/LIVE-DEBUG-FIXES-20261101.md)
tracks final outputs and device verification. Backend/runtime production,
private-license/activation code and financial transactions were not changed.

Historical 2026-11-01 build entry point: `ops/scripts/Build-MiliDebugApps.ps1` (or the workspace VS Code
task “MILI: serial debug rebuilds from main”). It verifies clean
`main == origin/main`, uses locked dependencies and serial builds, writes logs
and a SHA-256 manifest under `build-workspace/logs`, and places final APKs under
`artifacts/debug`. These ARM64 builds target the Pixel test device, not a signed
store release. The 2026-11-07 directory contract above supersedes this older
runner's flat log/output locations for all future builds.

### Historical debug artifacts — 2026-11-01

| App | APK | Package / version | Bytes |
|---|---|---|---:|
| Customer | [6b0d98f](../../artifacts/debug/mili-customer-main-6b0d98f-arm64-debug.apk) | `ge.mili.customer` / 4.2.0+54 | 171809092 |
| Vendor | [3d87c5d](../../artifacts/debug/mili-vendor-main-3d87c5d-arm64-debug.apk) | `ge.mili.vendor` / 4.2.0+38 | 111840409 |
| Delivery | [396aef5](../../artifacts/debug/mili-delivery-main-396aef5-arm64-debug.apk) | `ge.mili.delivery` / 4.2.0+40 | 133340872 |

Artifact copies were rehashed against the [build manifest](../../build-workspace/logs/debug-rebuild-20261101-152931.json):

| App | SHA-256 |
|---|---|
| Customer | `E9BF1C402867111EDF7BA66B2D582CD1A8742BA2D7DBF6F50F9F3D8D683CBBAD` |
| Vendor | `50D09B492FF77137DBD70F27609233D9E9F53332925B706DA3F6E3990FEE4541` |
| Delivery | `60A4A4A32447C70FCD36F5EAC0FC8123E531569645BA4AA1541F4CD4334FB31A` |

APK metadata confirms debuggable packages and their expected launch activities.
Customer's packaged flags and Vendor's Georgian copy/proportional transparent
adaptive foreground were verified. The pinned toolchain emits future Kotlin/KGP
migration warnings; no untested framework/plugin upgrade was mixed into this
bug-fix batch.

The following Nov 1 installation is historical and was superseded by the
owner-authorized Nov 7 fresh installations above.

**Installation completed on Pixel 6a `29301JEGR18798`.** The device reconnected
and authorized ADB after the earlier 15:59 disconnected check. All three APKs
were successfully installed with `adb install -r`, without uninstalling or
clearing data. Package-manager update times on 2026-11-01 +04 are Customer
16:16:45, Vendor 16:16:55 and Delivery 16:17:01; their original 2026-10-29
first-install times remain unchanged. SHA-256 of each installed `base.apk`
matches the corresponding artifact above exactly.

Cold-launch smoke at 16:18 +04: all three returned `Status: ok`, resumed their
expected `MainActivity`, and had live processes after four seconds. The sampled
new-process logs contained no fatal/unhandled exception or build-time
`markNeedsBuild` exception. This is launch smoke, not full feature acceptance.
Remaining owner-led device checks are flags, Keepz hosted sheet/cancel/bank
return, owner-supervised paid completion, Vendor launcher/native splash/BOGO,
and Courier income/details. Opening Keepz Pay/Retry can change payment intents,
so it is not an automatic read-only test. No real financial transaction or new
order acceptance was performed by this batch. Backend and deployed React
application SHAs are unchanged.

## Production restoration outcome — 2026-10-28/29

The deleted local development/production-management environment is restored
inside the sole workspace `C:\Users\miro\Desktop\მილი`. Production is running
immutable Backend and React releases built from exact pushed application SHAs,
with verified database backup, stable Backend symlink, explicit PHP 8.3 runtime,
and live hot rollback targets.

There were no production deployment blockers at the final restoration audit.
Known CI/acceptance gaps are disclosed below and are not described as green.
No real Keepz financial transaction or real-device FCM delivery was used as a
health check. This dated evidence is not a new production audit on 2026-11-01.

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

At the 2026-10-28 production application deployment all five repositories were clean on `main` and
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

## Production mapping — last authenticated 2026-10-28/29

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

At that audit, both React ports 3002 (live) and 3001 (rollback) were listening.
PHP 8.2 was also installed/active as a rollback option, while every production
runtime binding explicitly selected PHP 8.3. No server configuration was
changed during the 2026-11-01 mobile-fix batch.

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
- Current Customer, Vendor and Delivery debug APKs are listed in the
  [2026-11-01 artifact table](#current-debug-artifacts--2026-11-01) above.
- Older debug APKs remain historical evidence; they do not contain these fixes.

Historical recovery/audit files under `../../context/` and older reports remain
useful evidence, but their old missing-SSH, old-release, PHP 8.2 runtime, and
NO-GO assertions are superseded by this document.
