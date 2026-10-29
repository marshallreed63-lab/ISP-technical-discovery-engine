# ISP Intelligence Engine

An independent, non-affiliated prototype for researching ISP prospects and preparing credible AAA/RADIUS technical discovery tailored to InkBridge Networks' published capabilities. It is not an official InkBridge product and does not contain verified customer opportunities.
## Live Application

[Launch ISP Intelligence Engine](https://source-to-studio-bridge.lovable.app)

## Project Overview

The ISP Intelligence Engine is a technical sales intelligence prototype built to address a specific challenge in B2B infrastructure sales: moving from public company research to credible technical discovery and actionable qualification.

The application supports a four-stage workflow:

1. **Research:** Prioritize ISP accounts using source-linked public signals.
2. **Discovery:** Prepare technical questions for network engineers, NOC teams, and technology leadership.
3. **Qualification:** Record findings and evaluate potential AAA/RADIUS-related needs.
4. **Handoff:** Generate structured summaries for engineering and commercial follow-up.

**Built with:** React, TypeScript, Lovable, and AI-assisted development.

**Scope:** Five ISP accounts, three buyer personas, and rules-based qualification.

Independent prototype. Not affiliated with InkBridge Networks.

## Business problem and intended users

Expansion news can justify research, but cannot establish a prospect's authentication stack, technical pain or buying intent. This tool helps business development representatives, account executives and technical specialists separate public facts, testable hypotheses and unanswered questions before deciding whether engineering involvement is useful.

## Research-to-handoff workflow

1. **Research:** search five illustrative ISP accounts, filter by region or research priority, adjust public-signal weights and export the ranked CSV. The score is research prioritization, not technical fit or purchase probability.
2. **Discovery:** select one of three stakeholders and review an evidence-linked snapshot and three ordered questions. Supporting sources are shown when a hypothesis requires broader context.
3. **Outcome:** record prospect-reported technical findings and optional commercial details. Unknown, unclear, explicitly relevant and unrelated needs remain distinct.
4. **Handoff:** generate a preliminary discovery brief, or a pre-call research summary when no technical findings exist. Empty summaries never complete handoff. Any input or stakeholder change invalidates the document.

Category A requires further qualification. Category B requires an explicitly AAA/RADIUS-related need and suggests exploratory engineering validation only, even if the exact RADIUS deployment is unknown. Category C covers no relevant use case, no relevant need or an unrelated need. Commercial fields never upgrade the category, and Category B is not a fully qualified commercial opportunity.

## Technical architecture

- React 19, TypeScript, TanStack Start/TanStack Router, Vite and Tailwind CSS.
- `src/routes/index.tsx` mounts the migrated single-page interface; `src/lib/isp-markup.ts` and `src/lib/isp-app.ts` retain its imperative rendering and interaction model.
- `src/lib/discovery-data.ts` stores static evidence, hypotheses, services and questions; `src/lib/discovery.ts` assembles all 15 plans deterministically, without model calls or randomness.
- `src/lib/outcome.ts` contains pure qualification, progress and brief-generation rules.
- Discovery inputs and documents exist only in per-tab memory. Refreshing clears them. Demo inputs are fictional and account-isolated; they never modify research.
- There is no database, authentication, live AI API, CRM connection or automatic research refresh. Clipboard and CSV functions run in the browser.

## Evidence verification and limitations

Each evidence record includes a publisher, citation, date, limitation and verification state. “Source reviewed” records reflect the curated dataset's review status, not a guarantee of current accuracy. “Source requires verification” records must not be treated as independently confirmed. The Xplore Alberta fixed-wireless item references a newsroom index and still requires re-verification; this correction pass did not re-review external sources.

Hypotheses are inferences, not established architecture. No researched account has a publicly verified FreeRADIUS deployment in this dataset. Announced builds are not completed infrastructure, transport resilience does not demonstrate AAA resilience, and simulated inputs are not real customer information. Research is static and must be checked before external use.

## Demonstration

1. Open an account such as Sonic and switch stakeholders to compare discovery questions.
2. Generate an empty brief: it is a pre-call summary and does not complete handoff.
3. Choose **Load demo inputs**. Review the fictional-data banner, relevant need and Category B validation-only recommendation.
4. Generate the preliminary handoff; edit notes or a qualification field and confirm the brief disappears and progress updates.
5. Regenerate, reset, then open another account to confirm inputs do not leak between accounts. Reload to clear all in-memory inputs.
6. Test filters, weights, ranked CSV and copy controls independently of the simulation.

## Local setup

Install a current Node.js version compatible with Vite and Bun. Clone this repository, enter its directory, then run:

```sh
bun install
bun run dev
```

Use the local URL printed by Vite. No application credentials or backend provisioning are required. For a production build outside the Lovable preview, run `bun run build`.

## Testing

```sh
bun run test
bunx vitest run src/test/discovery.test.tsx src/test/pre-release.test.tsx src/test/app-routing.test.tsx
```

Tests cover deterministic plans, evidence relationships, qualification rules, handoff completion and routing. Browser regression checks should also cover stakeholder changes, all input types, clipboard contents, CSV values, account isolation and mobile navigation. See `QA_REPORT.md` for this correction pass's results and remaining limitations.

## Development transparency

This project was imported and developed with AI assistance using Lovable. It demonstrates a research and qualification workflow; it does not claim independently written code, deployed sales operations or validated commercial results. Human review remains necessary for research, outreach and engineering recommendations.

## Future development ideas (not implemented)

Potential later work includes consent-based saved research, source-refresh workflows, reviewed AI-assisted summaries and CRM handoff. Each would require separate scope, privacy controls and evaluation; none is part of this prototype or correction pass.
