# Enterprise interface review

> The initial styling pass below is superseded by the structural revision documented in [VISUAL_FIDELITY.md](docs/VISUAL_FIDELITY.md). The current revision passes 58 tests and the production build. Literal original-reference composite verification remains pending access to the original image file.

Branch: `design/enterprise-discovery-workspace`

The Stitch references inform the dark surfaces, restrained purple actions, compact research grid, account inspector, and paired discovery workspace. Existing React mounting, styling entry point, and interaction controller remain in use.

## Changes

- `src/isp.css`: shared visual tokens, typography, controls, table selection, evidence state styles, responsive navigation and workspace layout, focus states and reduced-motion support.
- `src/lib/isp-markup.ts`: workspace header, accessible filter labels and table headers, shortlist inspector container.
- `src/lib/isp-app.ts`: inspect an account in place; open its plan explicitly; arrow-key selection and Enter to open; question copy buttons; live inputs beside the conversation guide on wide screens. Reviewed public sources are labeled “Source reviewed,” rather than implying verified technical deployment.
- `src/test/workspace-ui.test.ts`: regression tests for inspection versus opening, filtered keyboard navigation and focus, and copying the active persona's question.

Account data, source evidence, three personas, scoring formula, filters, A/B/C qualification rules, handoff generation, and CSV content remain unchanged. Discovery state remains in tab memory. The brief's proposed commercial weighting, persistence, CRM integration, unsupported ASN/research details, and additional deployment claims were not adopted.

## Validation

- `bun run test`: 54 tests passed across four files (all 51 original tests plus three presentation interaction tests).
- `bun run build`: production Cloudflare-module build passed. Existing toolchain advisories about tsconfig paths and inline dynamic imports remain nonblocking.
- Chromium: desktop 1600 × 1100 and mobile 390 × 844; all five accounts, inspector selection, search, CSV download, three persona controls and questions, demo/reset, handoff generation and invalidation, no page-level horizontal overflow at mobile, and no browser page errors.
- Additional responsive overflow checks passed at widths 768, 1024, and 1440 pixels for both shortlist and discovery.
- Screenshots and the browser check script are retained outside the checkout in `/workspace/design-review`.

## Review considerations

Mobile retains horizontal scrolling inside the account table to preserve readable columns; the page itself fits the viewport. Long evidence and discovery content intentionally remains available. Browser checks use local Chromium and do not cover Safari, Firefox, or assistive technology. Fonts use the system sans-serif fallback when Inter is unavailable; no external font dependency was added.

Changes are prepared for review only. No merge, deployment, or production configuration change was performed.
