# Final Stitch visual fidelity review

## Recommendation

**Ready to merge.** The major desktop composition now follows the Stitch reference, the actual original/implementation comparison has been captured and inspected, and functional validation passes. The remaining differences below preserve honest research and useful controls; exact pixel equivalence is not claimed. Nothing has been merged, deployed, or released.

## Original reference and comparison evidence

The ZIP supplied in the review chat contains `isp-stitch-original-reference.png`. The original was extracted, decoded, and opened successfully in the execution workspace. Its dimensions are **1722 × 1376 pixels**, with SHA-256 `e8ecc19466a4dc77325d05f76eb98c5f07f2a9b55800fed9deb9068ce522b1b8`.

The live application was captured in Chromium at exactly **1722 × 1376**, device scale factor 1. Chromium then displayed both unmodified screenshots at their native dimensions and captured the comparison page. The result is **3444 × 1424**: two 1722 × 1376 panels plus a 48 px label strip. The original is on the **left**, actual application on the **right**. No generated or reconstructed reference image was used.

- [Final original-versus-implementation comparison](design-review/stitch-comparison.png)
- [Actual Account Research capture](design-review/account-research-1722x1376.png)

The earlier missing-original-file blocker is resolved. These checked-in artifacts supersede the previous file-picker-only comparison tool and approximate-height screenshots.

## Geometry and visual inspection

The original and actual captures were compared for panel proportions, sidebar/header alignment, phase navigation, metrics, table/inspector split, typography, spacing and density.

The implementation retains a 336 px sidebar, 64 px header, horizontal phase bar, five-cell metric strip, five-column research table, and 424 px inspector. At this width the metric strip starts at y=138, the research area near y=219, and the table header near y=274, closely following the reference. Selected-account highlighting, purple primary actions, discrete evidence nodes, persona controls and an explicitly unverified hypothesis retain the reference's hierarchy.

### Three largest remaining visual differences

1. **Inspector length and content density.** The implemented inspector extends farther down the page. It includes all three actual buyer personas, the real source titles, additional-evidence access, full-evidence/limitation disclosures and an unverified-hypothesis disclosure. The reference shows two stakeholder cards and shorter source content. These controls and factual distinctions remain available rather than replacing them with shorter fictional content.
2. **Table typography and evidence presentation.** The original has larger, more varied evidence badges and shorter footprint labels with ASNs. The implementation uses truthful `Source reviewed`/`Review required` states; source review never implies a verified RADIUS deployment. Longer existing footprint/angle text truncates visually at desktop sizes, with its complete text retained in tooltips and the DOM. No ASNs or deployment states were invented to reproduce the reference.
3. **Outer frame and header chrome.** The screenshot's heavy gray rounded frame, notifications/avatar, tenant status and graph synchronization are simplified to a thin application boundary, functional search and methodology controls, and honest public-research/session status. Fake account or synchronization features were not introduced.

## Targeted final corrections

The first exact-resolution comparison exposed undersized desktop text. The final pass increases navigation, metric, table and inspector-label reading sizes, tightens navigation rhythm, and keeps table rows compact with single-line desktop subtitles. Full subtitles are available via native tooltips. No further structural rebuild or new feature was necessary.

Changes in this final pass:

- `src/isp.css`: desktop reading scale and navigation/table density.
- `src/lib/isp-app.ts`: full account subtitle tooltip; no calculation or outcome changes.
- `docs/VISUAL_FIDELITY.md` and `DESIGN_REVIEW.md`: resolved reference access and final review result.
- `docs/design-review/*.png`: durable original/actual comparison and actual research capture.

The earlier structural revision replaced the large introductory layout with grouped navigation, shared phase navigation, a compact five-metric strip, dense table and persistent inspector. Discovery uses the same shell and pairs live inputs with the conversation guide. Styling changes alone did not supply those interactions.

## Validation after the final corrections

- **58 tests passed across 4 files.** The full existing test suite ran, including deterministic qualification and handoff tests and presentation interaction regressions.
- **Production build passed**, including client, SSR and Cloudflare-module output. Existing tsconfig-paths and inline-dynamic-import advisories remain nonblocking.
- Chromium verified all five accounts; search, region, score and source filters; account inspection; arrow-key focus and search shortcut; scoring/reset; and actual downloaded CSV contents.
- All three personas and question sets were exercised. Actual clipboard contents, evidence highlighting, shared Research → Discovery → Outcome → Handoff navigation, A/B/C decisions and commercial-field constraints, demo/reset, handoff generation/copy/invalidation and retained textarea focus passed.
- Research and discovery had no page-level horizontal overflow at widths **1722, 1440, 1024, 768 and 390 px**. The table scrolls inside its container on smaller screens. No browser page errors were observed.
- `discovery-data.ts`, `discovery.ts`, `isp-data.ts` and `outcome.ts` are unchanged from the pre-review branch. Research, citations, scoring calculations, qualification rules and handoff logic remain intact.

Safari, Firefox, assistive technology and physical mobile devices were not tested. The existing browser/test evidence supports merging this interface revision; it does not establish universal browser or accessibility certification.
