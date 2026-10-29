import { describe, expect, it } from "vitest";
import { buildPlan, snapshotFor } from "@/lib/discovery";
import { ACCOUNTS } from "@/lib/isp-data";
import { CHALLENGES, PERSONAS, type Persona } from "@/lib/discovery-data";
import { EMPTY_OUTCOME, DEMO_OUTCOME, nextAction, workflowProgress, hasDiscoveryFindings, opportunityFraming, type Need } from "@/lib/outcome";

describe("snapshot relationships for all 15 plans", () => {
  for (const account of ACCOUNTS) for (const persona of Object.keys(PERSONAS) as Persona[]) {
    it(`${account.id} / ${persona} uses the selected question's challenge and all supporting sources`, () => {
      const plan = buildPlan(account.id, persona);
      const question = plan.questions[0];
      const snapshot = snapshotFor(plan);
      const challenge = CHALLENGES.find(c => c.id === question?.challengeId);
      expect(challenge).toBeDefined();
      expect(snapshot.hypothesis).toBe(challenge?.hypothesis);
      expect(snapshot.signal?.id).toBe(question?.evidenceId);
      expect(new Set([snapshot.signal?.id, ...snapshot.supportingEvidence.map(e => e.id)])).toEqual(new Set([question?.evidenceId, ...(challenge?.evidenceIds ?? [])]));
      expect(snapshot.supportingEvidence.every(e => e.accountId === account.id)).toBe(true);
    });
  }
});

describe("explicit technical relevance", () => {
  it.each(["unknown", "identified"] as Need[])("%s need never justifies a specialist even with FreeRADIUS", need => {
    expect(nextAction({ ...EMPTY_OUTCOME, radius: "freeradius", need }).key).toBe("A");
    expect(opportunityFraming({ ...EMPTY_OUTCOME, radius: "freeradius", need }).primary).toBeNull();
  });
  it("vague need with unknown deployment remains A", () => expect(nextAction({ ...EMPTY_OUTCOME, need: "identified" }).key).toBe("A"));
  it("explicit relevant need allows exploratory validation with deployment unknown", () => expect(nextAction({ ...EMPTY_OUTCOME, need: "relevant" }).key).toBe("B"));
  it("unrelated need does not justify specialist involvement", () => expect(nextAction({ ...DEMO_OUTCOME, need: "unrelated" }).key).toBe("C"));
  it("no relevant RADIUS use case overrides relevant need", () => expect(nextAction({ ...DEMO_OUTCOME, radius: "none" }).key).toBe("C"));
  it("all commercial details cannot upgrade unclear technical relevance", () => expect(nextAction({ ...DEMO_OUTCOME, need: "identified", budget: "allocated" }).key).toBe("A"));
});

describe("meaningful discovery and synchronized progress", () => {
  it("empty generated summary does not complete discovery or handoff", () => {
    expect(workflowProgress(EMPTY_OUTCOME, true)).toMatchObject({ discovery: false, outcome: false, handoff: false, current: 2 });
  });
  it("questions and commercial-only entries do not establish technical findings", () => {
    expect(hasDiscoveryFindings({ ...EMPTY_OUTCOME, openQuestions: "What AAA is in use?", budget: "allocated", impact: "Follow-up required" })).toBe(false);
  });
  it("notes alone support a preliminary handoff despite missing commercial fields", () => {
    const outcome = { ...EMPTY_OUTCOME, notes: "Prospect reported two authentication sites" };
    expect(workflowProgress(outcome, true)).toMatchObject({ discovery: true, outcome: true, handoff: true, current: 3 });
    expect(workflowProgress(outcome, false).handoff).toBe(false);
  });
  it("clearing last finding returns the current step to outcome", () => {
    expect(workflowProgress({ ...EMPTY_OUTCOME, notes: "   " }, false)).toMatchObject({ discovery: false, outcome: false, handoff: false, current: 2 });
  });
});