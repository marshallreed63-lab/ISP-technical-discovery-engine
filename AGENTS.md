<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Discovery content (evidence, hypotheses, questions, services) lives as static data in `src/lib/discovery-data.ts`; `src/lib/discovery.ts` builds plans deterministically from it. Why: plans must be traceable to cited evidence, with no AI or randomness.
- Discovery outcomes, next-action rules and handoff briefs live in `src/lib/outcome.ts` as pure functions over in-memory, per-tab state. Why: simulated call inputs must stay separate from verified research and never persist.
