# Production audit follow-up

The previous audit run visited 37 static routes at 12 widths in three engines (1,332 visits). It reported 744 instances of React hydration error #418 while the workflow still finished successfully. Those are occurrences of a shared failure, not 744 independent bugs.

## Changes

- Restore the server-compatible first render for MUI media queries in the base, light and dark themes. The previous global `noSsr: true` setting allowed different text/markup on the server and client.
- Keep style-only component props off the DOM and correct Emotion's prefixed CSS property names. Remove invalid `const` and `row` attributes from checkout controls.
- Move checkout state/Redux updates out of rendering and into effects. Calculation formulas, tax APIs and payment submission contracts remain the same.
- Normalize missing/imported image sources so loading data does not request `null/undefined`; preserve the local image fallback and image sizing.
- Request notification permission only from the profile opt-in button. Skip automatic token requests without permission and avoid posting an empty FCM token.
- Validate the currently selected password-recovery method. The former boolean/string condition skipped validation; the old ten-digit pattern also rejected Georgian numbers with `+995`. Regression tests cover invalid values and valid Georgian/email inputs.
- Replace the inline audit shell script with locked, versioned browser tooling, local API fixtures, screenshots, incremental results, explicit exclusions and real failure conditions. ESLint runs directly over application sources and reports its actual exit code.

## Evidence

The production application source at `ff58f50` completed all 44 routes across Chromium, Firefox and WebKit at 12 widths: 1,296 active-page cases passed; 288 retained rental cases were explicitly excluded. Each engine visited 528 cases. Separate Chrome and Edge runs covered 176 and 88 cases respectively, also with no active-page failures.

Chat and recovery interaction tests pass in Chrome, Edge, Firefox and WebKit. The controlled phone input is exercised through keyboard events and its final number is asserted before submission. Bulk fill did not reproduce its prefix/caret handling in Firefox/WebKit; the runner now models typing and registers its response listener before submitting. A clean-checkout TypeScript check first runs `next typegen`, which supplies Next's generated image/route declarations.

Seven JavaScript regression tests cover font integrity/case, missing-image handling and recovery validation. Existing lint warnings remain reported. Production was rebuilt with its real environment, deployed with rollback files, and verified at HTTP 200 with build ID `_gZWMtqc6hrb_lcBFo26B`. All 13 served font files match repository hashes. PM2 `mili-react` was restarted and saved. Backup: `/root/mili-backups/ui-audit-20260908-112754`.

The source inventory lists every scanned source file and all static/dynamic routes. File counts represent inventory coverage, not individual manual review of every component. Existing lint warnings remain reported. Disabled rental screens, real provider transactions, native Safari/device testing and exhaustive authenticated business-state combinations are not certified by this audit.

## References

- [React hydration error #418](https://react.dev/errors/418)
- [MUI server rendering and media queries](https://mui.com/material-ui/react-use-media-query/#server-side-rendering)
- [Notification permission and user interaction](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission_static)
- [Playwright browser support](https://playwright.dev/docs/browsers)
