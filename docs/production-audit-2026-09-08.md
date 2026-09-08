# Production audit follow-up

The previous audit run visited 37 static routes at 12 widths in three engines (1,332 visits). It reported 744 instances of React hydration error #418 while the workflow still finished successfully. Those are occurrences of a shared failure, not 744 independent bugs.

## Changes

- Restore the server-compatible first render for MUI media queries in the base, light and dark themes. The previous global `noSsr: true` setting allowed different text/markup on the server and client.
- Keep style-only component props off the DOM and correct Emotion's prefixed CSS property names. Remove invalid `const` and `row` attributes from checkout controls.
- Move checkout state/Redux updates out of rendering and into effects. Calculation formulas, tax APIs and payment submission contracts remain the same.
- Normalize missing/imported image sources so loading data does not request `null/undefined`; preserve the local image fallback and image sizing.
- Request notification permission only from the profile opt-in button. Skip automatic token requests without permission and avoid posting an empty FCM token.
- Validate the currently selected password-recovery method. The former boolean/string condition skipped validation; the old ten-digit pattern also rejected Georgian numbers with `+995`. Regression tests cover invalid values and valid Georgian/email inputs.
- Replace the inline audit shell script with locked, versioned browser tooling, local API fixtures, screenshots, incremental results, explicit exclusions and real failure conditions. ESLint uses the supported CLI rather than the removed `next lint` command.

## Evidence

The first completed Chrome matrix after the shared hydration fixes visited 44 routes at 320/390/768/1440 pixels: 144 active-page cases passed, 32 retained rental cases were excluded, and none failed. This checkpoint preceded the final recovery-form changes; final commit validation is recorded in GitHub Actions and the release report.

The source inventory lists every scanned source file and all static/dynamic routes. File counts represent inventory coverage, not individual manual review of every component. Existing lint warnings remain reported. Disabled rental screens, real provider transactions, native Safari/device testing and exhaustive authenticated business-state combinations are not certified by this audit.

## References

- [React hydration error #418](https://react.dev/errors/418)
- [MUI server rendering and media queries](https://mui.com/material-ui/react-use-media-query/#server-side-rendering)
- [Notification permission and user interaction](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission_static)
- [Playwright browser support](https://playwright.dev/docs/browsers)
