# UI refinement: ISP Intelligence Engine

Only presentation changes. Question text, scoring weights and formula, citations, hypotheses, unknowns, and openers stay exactly as they are.

## 1. Dedicated account workspace
- The shortlist stays as is. Clicking a row or "View plan" opens a full-width account workspace instead of the narrow right panel.
- A "Back to shortlist" button sits at the top, and the shortlist's search, region and threshold filters are kept when you return.
- Workspace order:
  1. Header: account name, location, sector, latest evidence date, Research Priority score and tier.
  2. Stakeholder switcher right below the header.
  3. The three discovery questions, with their "Why ask this?" panels.
  4. Supporting verified evidence.
  5. Hypotheses (unverified) and unknowns.
  6. Conditional InkBridge relevance, reference case study, draft opener and copy button.
- Desktop: questions in a wide main column, with evidence beside them. Mobile: one column in the same order.

## 2. Title
- Main heading: "ISP Intelligence Engine".
- Subtitle: "Evidence-backed ISP account prioritization, technical discovery, and solution mapping."
- Remove "v0.1" and "working proof of concept" from the headings. The version moves to the footer and Methodology.

## 3. Dashboard stats
- Replace "Verified FreeRADIUS stacks" with "Technical discovery plans", counted as accounts x stakeholder roles (currently 5 x number of roles).
- Each account workspace and Methodology still show "FreeRADIUS deployment: not verified". The CSV keeps its `radiustech_verified` column.

## 4. Scoring wording
- Rename the score label from "Signal score" to "Research Priority" in the table, workspace and CSV column header. The calculation stays the same.
- Add one line near the table: "Reflects public research signals only, not confirmed technical fit, buying intent or purchase probability."
- **Beanfield Resilience (flagged, not changed):** the signal rests on two undated marketing pages, one mentioning "meshed redundancy" and one a 24/7 NOC. That supports a network design claim, but there is no dated event like CityWest's outage-driven route. I'll show a short "evidence note: undated marketing claims only" in Beanfield's workspace and in Methodology. The score stays the same.

## 5. Disclaimer
- Replace the long sidebar box with a short, always-visible line: "Independent prototype · not affiliated with InkBridge Networks".
- The full limitations stay in Methodology and the footer.

## Testing
- Update the dashboard count test and add one for the plan count (accounts x roles).
- In the browser at desktop and mobile sizes: open a plan, go back, switch stakeholder, check the sliders, filters, CSV export, copy opener and tab navigation. Then report any failures.

## Technical notes
- Edits stay in `isp-markup.ts`, `isp-app.ts`, `isp.css` and `discovery.ts` (`datasetMetrics` gets a `discoveryPlans` count). `discovery-data.ts` question content stays as is, except possibly a display-only evidence note.
- Add a `detail` view state in `isp-app.ts`. "Back" calls `setView('research')`.
