# Revised UI plan: ISP Intelligence Engine

This is presentation work only. It does not change question text, evidence or citations, hypotheses, scores, weights or the formula, openers, service-mapping logic, filters, CSV export, technical fluency content or source links. No backend, AI or new research is added.

## Account workspace layout

```text
[< Back to shortlist]   Account name · location · sector · latest evidence date
                        Research Priority 72 / 100 · tier · "not fit or purchase probability"
Stakeholder: [Network Eng | NOC / Infra | CTO / VP]  -> one-line focus sentence
+--------------------+    +----------------------+    +----------------------+
| Public signal      | -> | Technical hypothesis | -> | Discovery objective  |
| fact, source, date |    | (unverified)         |    |                      |
+--------------------+    +----------------------+    +----------------------+
+------------------------------------------+  +------------------------------+
| DISCOVERY (primary, wide)                |  | Context (secondary)          |
| Step 1 Open the conversation             |  | Evidence cards cited by the  |
| Step 2 Understand the architecture       |  | questions, with limitations  |
| Step 3 Qualify relevance and next steps  |  | Evidence notes (Beanfield)   |
|   > Why ask this? (5 subheadings)        |  |                              |
+------------------------------------------+  +------------------------------+
Hypotheses and unknowns (collapsible)
Potential InkBridge relevance (conditional)
Reference case study · Draft opener · Copy
```
On mobile everything sits in one column in this order: header, stakeholder, snapshot, questions, then research.

## 1. Account Intelligence Snapshot
- **Public signal:** the evidence record cited by the first discovery question, with its source link and date. All three parts come from existing data.
- **Technical hypothesis:** the first plan challenge's existing hypothesis text, labelled "Unverified".
- **Discovery objective:** the first question's existing "What we could learn" text.
- When the plan has no supported service mapping (Beanfield today), the objective reads: "Establish whether AAA/RADIUS is relevant at all, before discussing any solution."

## 2. Discovery as the centrepiece
- Step labels: "Step 1 · Open the conversation", "Step 2 · Understand the architecture or operating environment", "Step 3 · Qualify technical relevance and possible next steps". The question wording stays exactly as it is.
- Each "Why ask this?" panel uses five consistent subheadings, all filled from existing fields:
  - **Evidence behind this question:** source title, date and link.
  - **Technical reasoning:** the existing "why" text.
  - **What the answer helps establish:** the existing "learn" text.
  - **Relevant technical concept:** concept name, explanation, caution and RFC link.
  - **Suggested follow-up:** the existing follow-up question.
- Each question shows a small "Evidence: [title, date]" chip. Clicking it highlights the matching card in the side column, so evidence isn't shown twice.

## 3. Stakeholder switching
- The selector is a compact three-button switch placed right under the header. Switching redraws the snapshot and questions instantly.
- The focus sentences become your three wordings exactly. These are display text only; the question sets stay the same.

## 4. Discovery angle in the shortlist
- Add a small label under each account name: CityWest "Network resilience", Xplore "Multi-technology subscriber provisioning", Sonic "New-market network activation", Beanfield "Establish AAA relevance", altafiber "Subscriber activation and fibre expansion".
- Each label is a fixed text entry tied to the account's existing hypothesis. It is not a score.

## 5. Conditional InkBridge relevance
- This is its own section after the hypotheses. Each service card shows the service name, its capability (existing description), why it could matter, what must be confirmed, and the official link. The section has a muted "Conditional, only if discovery confirms" heading.
- Beanfield's insufficient-evidence message stays the same.

## 6. Less scrolling
- The dashboard stat cards and page intro show only on the shortlist, never in the workspace.
- At a 1280x800 window, the header, stakeholder switch, snapshot and Step 1 question should fit without scrolling.
- Hypotheses, unknowns and the case study stay collapsible. It keeps the same dark look, with no new charts or animations.

## 7. Carried over from the first plan
- The title is "ISP Intelligence Engine" with your subtitle. "v0.1" and "proof of concept" move out of the headings, and the version stays in the footer and Methodology.
- The "Technical discovery plans" stat is counted by actually building a plan for each account and stakeholder pair and counting the ones that return questions, not by multiplying.
- Visible score labels change to "Research Priority". One line explains it is not technical fit, buying intent or purchase probability. The CSV column header gets the same label, with the same values.
- The Beanfield Resilience note ("supported only by undated marketing descriptions of meshed redundancy and a 24/7 NOC") shows in its workspace and in Methodology. The score stays the same.
- "FreeRADIUS deployment: not verified" stays in each workspace, in Methodology, and in the CSV column.
- The long sidebar disclaimer becomes one persistent line: "Independent prototype · not affiliated with InkBridge Networks". Full limitations stay in Methodology.
- "Back to shortlist" keeps the search, region, threshold, selected account and slider weights.

## Files affected
- `src/lib/isp-markup.ts`: title and subtitle, the new workspace section, shortlist intro, compact disclosure, Methodology notes.
- `src/lib/isp-app.ts`: workspace view state, back button, rewritten detail render (snapshot, steps, subheadings, evidence chips, service section), angle label in table rows, persona switch.
- `src/isp.css`: workspace grid, snapshot strip, step cards, segmented switch, mobile rules.
- `src/lib/discovery.ts`: add `discoveryPlanCount()` and `snapshotFor(plan)`, both pure functions over existing data.
- `src/lib/discovery-data.ts`: add display-only fields: `DISCOVERY_ANGLE` per account, `EVIDENCE_NOTES` (Beanfield), the updated persona focus sentences, and step labels. Questions, evidence, hypotheses and services stay as they are.
- `src/test/discovery.test.tsx`: tests for snapshot evidence matching, plan count, angle per account, Beanfield objective, and persona focus text.

**Refactoring risk:** none of this needs a big restructure. The app keeps its current single-page setup with tab switching; the workspace is one more view in the same file. The only real rewrite is the detail render function in `isp-app.ts`, about 15 lines.

## Testing
- Automated tests for items 1, 3, 4 and 5 of your test list, plus the plan count.
- Browser checks at 1280x800 and at mobile size cover:
  - the snapshot matches its evidence, and the evidence chips are correct;
  - switching stakeholder updates the questions and focus sentence;
  - Step 1 shows without scrolling;
  - back to shortlist keeps the filters;
  - sliders, CSV export, copy buttons, navigation and source links still work;
  - the page text has no interview wording and nothing suggests an official InkBridge product.
- I'll report any failures, then stop for your review.
