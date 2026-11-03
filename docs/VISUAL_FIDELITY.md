# Stitch structural redesign: gap analysis and fidelity review

## Before implementation

Compared with the supplied inline Stitch reference, the prior implementation had these structural gaps:

| Area          | Prior application                                                          | Reference / required change                                                                                     |
| ------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Composition   | Large page title and introduction before metrics                           | Compact global application header, phase bar, metrics, then working surface                                     |
| Navigation    | Four flat links in a narrow sidebar                                        | Persistent wider sidebar with lifecycle and intelligence-library groups                                         |
| Workflow      | Research progression shown only as text; account progress local to details | Interactive horizontal phase navigation available across research and account work                              |
| Summary       | Four spacious rounded cards                                                | Five compact rectangular metrics aligned in one strip                                                           |
| Research grid | Four columns, generous row height                                          | Dense five-column table with a dedicated evidence-state column                                                  |
| Inspector     | Long continuous source list, narrow panel with independent scrollbar       | Wider inspector with account context, primary action, discrete evidence nodes, personas and hypothesis sections |
| Discovery     | Local progress, separate context blocks and long forms                     | Common shell and selected-account context; conversation guide paired with working inputs                        |
| Responsive    | Inspector stacks early, wide table requires scrolling                      | Keep split desktop geometry; controlled tablet stacking and mobile navigation/table behavior                    |
| Typography    | Small sans-serif interface, large headings, rounded surfaces               | Reference uses a serif-forward editorial hierarchy, compact headers and crisp dividers                          |

Navigation groups, common phase navigation, five-cell summary, fifth table column, inspector sections, and discovery component hierarchy require actual markup/controller changes. CSS alone cannot supply working navigation, evidence status, stakeholder controls, or account context.

The screenshot's ASN identifiers, funding claims, verified deployment implications, graph synchronization, and tenant details are not adopted without repository evidence. Research priority remains a heuristic, not verification confidence.

## Reference access

The original screenshot is visible inline in the conversation and was used for visual inspection. Its bitmap is not mounted in the execution workspace and no downloadable image file ID was supplied. The macOS Desktop path cannot be read from this cloud machine. A literal original-reference/implementation composite therefore requires the original image as an accessible file; this limitation must not be represented as completed acceptance.

## Implemented structural revision

- New `workspace-shell.ts` supplies readable application chrome and research markup with grouped lifecycle/library navigation, one global phase bar, a five-cell summary, a five-column research table, and a dedicated inspector section.
- The research page no longer begins with a large title or tall introductory cards. The scoring model remains functional in an expandable drawer below the table.
- Source state is derived from existing evidence review metadata. A source-review filter adds a usable control at the reference's filter location; the existing scoring and region filters remain available.
- Inspector evidence is presented as discrete source nodes. Full facts and limitations are accessible through native disclosures; all sources remain available, including additional evidence beyond the first two nodes. All three existing personas are actionable conversation lenses, never fabricated named contacts. The hypothesis remains explicitly unverified, with its full text expandable.
- The account workspace now has a breadcrumb, selected-account context, compact progress hint derived from `workflowProgress`, and a conversation guide paired with working inputs. Persona selection is inside the guide. Source-backed evidence stays linked; the longer research context is a separate expandable section.
- Global navigation opens the currently selected account at Discovery, Outcome, or Handoff and returns to the shortlist without changing account research or outcome rules.

## Visual inspection and measurements

Actual Chromium captures were inspected against the inline reference at **1722 × 1378** (the nearest known reference viewport). These are measured implementation coordinates, not a pixel-diff score:

| Element               | Actual implementation       |
| --------------------- | --------------------------- |
| Sidebar               | x=25, width=336 px          |
| Header                | y=25, height=64 px          |
| Phase bar             | y=89, height=39 px          |
| Five-metric strip     | y=138, height≈69 px         |
| Research working area | x=381, y≈217 px             |
| Table                 | y≈272, width=862 px         |
| Inspector             | x=1261, y≈217, width=424 px |

The sidebar/header, summary-strip location, table-to-inspector split, and selected-row/primary-action hierarchy now follow the reference's major geometry. The first visual pass was revised to reduce the inspector's height and to move discovery questions up beside the live inputs rather than below duplicated navigation and large context cards.

### Remaining differences

- The inspector remains taller (about 869 px) than the reference. The application preserves three real persona choices and the repository's actual source titles, facts and cautions. Full evidence and hypotheses can expand beyond the overview.
- The reference's heavy gray device-like outer frame is represented by a thin application boundary. Notification/account chrome, graph synchronization, unsupported ASNs, named stakeholders, and unverified deployment assertions were not reproduced as working product features.
- Source badges report **Source reviewed**, rather than implying verified AAA technology or treating the research score as confidence. This is an intentional factual difference from the reference.
- Smaller screens stack panels and retain horizontal scrolling within the table and lifecycle navigation. The 1722 px desktop composition is not squeezed unchanged into mobile.
- Literal original-left / implementation-right screenshot output is **pending** access to the original bitmap. `/workspace/design-review/reference-comparison.html` embeds the actual capture and can display the original locally via its file picker; it does not contain an invented reference substitute. This is a comparison tool, not evidence that the required composite was captured.

## Functional and responsive QA

- **58 tests passed across 4 files**: all original tests, the earlier UI regressions, and four new tests for shared lifecycle navigation, source/persona accessibility, textarea focus during progress updates, and source filtering without score changes.
- **Production build passed**: client, SSR, and Cloudflare-module output. Existing tsconfig-paths and inline-dynamic-import advisories remain nonblocking.
- Chromium exercised five accounts, five summary cells, search/region/threshold/source filters, account inspection, keyboard arrow navigation and focus, search shortcut, scoring/reset, and downloaded CSV content.
- All three personas and their three questions were exercised. Actual question clipboard contents, evidence-link highlighting, shared lifecycle navigation, A/B/C outcomes, commercial-field constraints, demo/reset, handoff generation/copy/invalidation, and retained textarea focus passed.
- Research and discovery fit page widths **1722, 1440, 1024, 768, and 390 px**, with table scrolling inside its container and no page-level horizontal overflow. No browser page errors were observed.
- `discovery-data.ts`, `discovery.ts`, `isp-data.ts`, and `outcome.ts` are unchanged from commit `6835628`; research content, scoring calculations, deterministic questions, qualification rules and handoff rules remain intact.
- Safari, Firefox, assistive technology and real mobile hardware were not tested. Browser captures use local Georgia/Times serif fallbacks matching the supplied reference's visible typography; there are no new font downloads.

## Artifacts and acceptance status

Artifacts outside the checkout in `/workspace/design-review`:

- `stitch-size-research.png` and `stitch-size-discovery.png`: actual 1722 × 1378 desktop viewports.
- `structural-mobile-research.png` and `structural-mobile-discovery.png`: full mobile pages at 390 px width.
- `structural-tablet-research.png` and `structural-tablet-discovery.png`: 768 px tablet viewports.
- `structural-qa.cjs`, `structural-qa-results.json`, `layout-measurements.json`, `structural-build.log`: reproducible browser check and current-run evidence.
- `reference-comparison.html`: offline original-file/actual-render comparison tool; original bitmap still required.

The structural implementation and listed functional checks are verified. **Final visual acceptance is not declared complete while the required original-reference composite is unavailable.** No merge, deployment, or release was performed.
