import { describe, expect, it } from "vitest";
import { buildPlan, datasetMetrics, discoveryPlanCount, snapshotFor } from "@/lib/discovery";
import { DISCOVERY_ANGLE, NO_AAA_OBJECTIVE, PERSONAS, type Persona } from "@/lib/discovery-data";
import { ACCOUNTS, SIGNALS } from "@/lib/isp-data";

const personas = Object.keys(PERSONAS) as Persona[];
const names: Record<string, string[]> = {
  citywest: ["CityWest", "Highway 37", "Columbia Basin"],
  xplore: ["Xplore", "Newfoundland"],
  sonic: ["Sonic", "Los Angeles", "Dallas"],
  beanfield: ["Beanfield", "Uniti"],
  altafiber: ["altafiber", "Grove City", "Marysville", "Richmond", "XGS-PON"],
};

describe("discovery plans", () => {
  it("every account × persona has three ordered questions with source and rationale", () => {
    for (const a of ACCOUNTS) for (const p of personas) {
      const plan = buildPlan(a.id, p);
      expect(plan.questions.map((q) => q.depth)).toEqual(["opening", "architecture", "qualification"]);
      for (const q of plan.questions) {
        expect(q.why.length).toBeGreaterThan(10);
        expect(plan.evidence.some((e) => e.id === q.evidenceId)).toBe(true);
      }
    }
  });

  it("personas produce different questions for the same account", () => {
    for (const a of ACCOUNTS) {
      const texts = personas.map((p) => buildPlan(a.id, p).questions.map((q) => q.text).join("|"));
      expect(new Set(texts).size).toBe(3);
    }
  });

  it("openers never contain another account's wording or claim employment", () => {
    for (const a of ACCOUNTS) for (const p of personas) {
      const o = buildPlan(a.id, p).opener;
      for (const [id, words] of Object.entries(names)) if (id !== a.id) for (const w of words) expect(o).not.toContain(w);
      expect(o).not.toMatch(/I work (with|for|at) InkBridge/i);
    }
  });

  it("Beanfield has no specific InkBridge recommendation", () => {
    const plan = buildPlan("beanfield", "Network Engineering");
    expect(plan.insufficient).toBe(true);
    expect(plan.services).toHaveLength(0);
  });

  it("CityWest leads with resilience; no plan claims FreeRADIUS is confirmed", () => {
    expect(buildPlan("citywest", "Network Engineering").challenges[0]?.id).toBe("cw-ha");
    expect(datasetMetrics(ACCOUNTS).verifiedFreeRadius).toBe(0);
  });

  it("metrics come from the dataset", () => {
    const m = datasetMetrics(ACCOUNTS);
    expect(m.accounts).toBe(5);
    expect(m.regions.sort()).toEqual(["Canada", "USA"]);
    expect(m.latestYear).toBe(2026);
    expect(m.accountsWithLatestYear).toBe(5);
  });

  it("default weights are preserved", () => {
    expect(Object.fromEntries(Object.entries(SIGNALS).map(([k, v]: any) => [k, v.weight]))).toEqual({ expansion: 25, multimarket: 20, resilience: 20, mixed: 15, scale: 20 });
  });

  it("snapshot signal is the evidence cited by question 1 of the same account", () => {
    for (const a of ACCOUNTS) for (const p of personas) {
      const plan = buildPlan(a.id, p), snap = snapshotFor(plan);
      expect(snap.signal?.id).toBe(plan.questions[0]!.evidenceId);
      expect(snap.signal?.accountId).toBe(a.id);
    }
  });

  it("Beanfield's objective is to establish relevance, not pitch", () => {
    expect(snapshotFor(buildPlan("beanfield", "CTO / VP Technology")).objective).toBe(NO_AAA_OBJECTIVE);
    expect(DISCOVERY_ANGLE["beanfield"]).toBe("Establish AAA relevance");
  });

  it("plan count is built from real plans (5 accounts x 3 stakeholders = 15)", () => {
    expect(discoveryPlanCount(ACCOUNTS)).toBe(15);
    expect(discoveryPlanCount([{ id: "unknown-isp" }])).toBe(0);
  });

  it("every account has a discovery angle and persona focus uses the agreed wording", () => {
    for (const a of ACCOUNTS) expect(DISCOVERY_ANGLE[a.id]).toBeTruthy();
    expect(PERSONAS["NOC / Infrastructure"]).toBe("Focus on availability, incident response, monitoring, recovery, and operational ownership.");
  });
});

import { EMPTY_OUTCOME, DEMO_OUTCOME, nextAction, buildHandoff, outcomeUnknowns } from "@/lib/outcome";
describe("discovery outcome workflow", () => {
  const plan = buildPlan("citywest", "Network Engineering");
  it("default state is further qualification with everything unknown", () => {
    expect(nextAction(EMPTY_OUTCOME).key).toBe("A");
    expect(outcomeUnknowns(EMPTY_OUTCOME)).toEqual(["RADIUS deployment", "Technical need", "Infrastructure ownership"]);
  });
  it("FreeRADIUS confirmed alone does not qualify", () => {
    expect(nextAction({ ...EMPTY_OUTCOME, radius: "freeradius" }).key).toBe("A");
  });
  it("identified need leads to specialist discussion", () => {
    expect(nextAction({ ...EMPTY_OUTCOME, need: "identified" }).key).toBe("B");
  });
  it("no relevant RADIUS use case gives no opportunity and no services in brief", () => {
    const o = { ...EMPTY_OUTCOME, radius: "none" as const, need: "identified" as const };
    expect(nextAction(o).key).toBe("C");
    const b = buildHandoff("CityWest", plan, o);
    for (const s of plan.services) expect(b).not.toContain(s.service!.name);
  });
  it("no relevant need gives no opportunity", () => {
    expect(nextAction({ ...EMPTY_OUTCOME, radius: "freeradius", need: "none" }).key).toBe("C");
  });
  it("brief separates public evidence from simulated input", () => {
    const b = buildHandoff("CityWest", plan, DEMO_OUTCOME);
    expect(b).toContain("VERIFIED PUBLIC EVIDENCE");
    expect(b).toContain("SIMULATED");
    expect(b).toContain(plan.evidence[0]!.url);
    expect(buildHandoff("CityWest", plan, EMPTY_OUTCOME)).toContain("PROSPECT-REPORTED (unverified)");
  });
});
