// Discovery outcome → next action → handoff brief. Deterministic, client-side only.
// Outcome inputs are prospect-reported or simulated; they never alter public evidence.
import { buildPlan } from "./discovery";
import { SERVICES } from "./discovery-data";

export type Radius = "unknown" | "freeradius" | "other" | "none";
export type Need = "unknown" | "identified" | "none";
export type Ownership = "unknown" | "internal" | "external";
export type Support = "unknown" | "none" | "internal" | "vendor";
export type Urgency = "unknown" | "active" | "none";
export type Budget = "unknown" | "allocated" | "planning" | "none";
export type Decision = "unknown" | "described";

export interface Outcome {
  radius: Radius; need: Need; ownership: Ownership; notes: string; openQuestions: string;
  impact: string; support: Support; urgency: Urgency; budget: Budget; decision: Decision; decisionNotes: string;
  stakeholders: string; agreedNext: string;
  demo: boolean;
}

export const EMPTY_OUTCOME: Outcome = {
  radius: "unknown", need: "unknown", ownership: "unknown", notes: "", openQuestions: "",
  impact: "", support: "unknown", urgency: "unknown", budget: "unknown", decision: "unknown", decisionNotes: "",
  stakeholders: "", agreedNext: "", demo: false,
};

export const RADIUS_LABELS: Record<Radius, string> = {
  unknown: "Not established", freeradius: "FreeRADIUS confirmed", other: "Another implementation", none: "No relevant RADIUS use case",
};
export const NEED_LABELS: Record<Need, string> = {
  unknown: "Not established", identified: "Identified but unvalidated", none: "No relevant need",
};
export const OWNERSHIP_LABELS: Record<Ownership, string> = {
  unknown: "Unknown", internal: "Internal engineering", external: "External provider",
};
export const SUPPORT_LABELS: Record<Support, string> = {
  unknown: "Not established", none: "No formal support", internal: "Internal team only", vendor: "Third-party / vendor support",
};
export const URGENCY_LABELS: Record<Urgency, string> = {
  unknown: "Not established", active: "Active initiative reported", none: "No active initiative",
};
export const BUDGET_LABELS: Record<Budget, string> = {
  unknown: "Not established", allocated: "Prospect says budget exists", planning: "In planning / to be requested", none: "No budget reported",
};
export const DECISION_LABELS: Record<Decision, string> = {
  unknown: "Not established", described: "Process described by prospect",
};

/** Fictional inputs for demonstration mode — never facts about the real company. */
export const DEMO_OUTCOME: Outcome = {
  radius: "freeradius", need: "identified", ownership: "internal",
  notes: "[SIMULATED] Prospect described a single RADIUS pair serving all subscriber regions and wants failover tested before a new market launch.",
  openQuestions: "[SIMULATED] Is accounting data replicated between sites? What is the acceptable authentication outage window during maintenance?",
  impact: "[SIMULATED] An authentication outage would stop new-market subscribers from connecting.",
  support: "internal", urgency: "active", budget: "unknown", decision: "described",
  decisionNotes: "[SIMULATED] Director of Network Engineering recommends; VP Technology approves.",
  stakeholders: "[SIMULATED] Network Engineering lead; NOC manager.",
  agreedNext: "[SIMULATED] Follow-up call with the network lead next week.",
  demo: true,
};

export type ActionKey = "A" | "B" | "C";
export const ACTIONS: Record<ActionKey, { title: string; summary: string }> = {
  A: { title: "Further qualification required", summary: "Insufficient technical information to determine relevance." },
  B: { title: "Potential specialist discussion", summary: "A relevant technical requirement has been reported and merits engineering validation." },
  C: { title: "No demonstrated opportunity", summary: "Available information does not support further technical engagement." },
};

/**
 * Rules (first match wins). Commercial fields never change the category.
 * 1. No relevant RADIUS use case → C.
 * 2. No relevant need → C.
 * 3. Need identified → B (FreeRADIUS, another implementation, or not yet established).
 * 4. Otherwise → A. Confirming FreeRADIUS alone never qualifies.
 */
export function nextAction(o: Outcome): { key: ActionKey; reasons: string[] } {
  if (o.radius === "none") return { key: "C", reasons: ["Prospect reported no relevant RADIUS use case, so no AAA/RADIUS opportunity is demonstrated and no RADIUS-related InkBridge service is suggested. This does not assess other InkBridge offerings."] };
  if (o.need === "none") return { key: "C", reasons: ["Prospect reported no relevant technical need."] };
  if (o.need === "identified") {
    const r = ["A technical need was reported but is not yet validated by engineering."];
    r.push(o.radius === "unknown" ? "RADIUS deployment is still not established — confirm in the specialist call." : `RADIUS deployment reported as: ${RADIUS_LABELS[o.radius]}.`);
    if (o.ownership === "unknown") r.push("Infrastructure ownership is still unknown.");
    return { key: "B", reasons: r };
  }
  const r = ["No technical need has been established yet."];
  if (o.radius === "freeradius") r.push("FreeRADIUS being in use does not by itself indicate a need for InkBridge support.");
  return { key: "A", reasons: r };
}

/** Lists what remains unknown; unknown fields are never presented as confirmed. */
export function outcomeUnknowns(o: Outcome): string[] {
  const u: string[] = [];
  if (o.radius === "unknown") u.push("RADIUS deployment");
  if (o.need === "unknown") u.push("Technical need");
  if (o.ownership === "unknown") u.push("Infrastructure ownership");
  return u;
}

/** Commercial qualification items still missing. Never inferred from technical answers. */
export function missingCommercial(o: Outcome): string[] {
  const m: string[] = [];
  if (!o.impact.trim()) m.push("Operational or business impact");
  if (o.support === "unknown") m.push("Current support arrangements");
  if (o.urgency === "unknown") m.push("Urgency or active initiative");
  if (o.budget === "unknown") m.push("Budget status");
  if (o.decision === "unknown") m.push("Decision-maker and purchasing process");
  if (!o.stakeholders.trim()) m.push("Relevant stakeholders");
  if (!o.agreedNext.trim()) m.push("Next agreed action");
  return m;
}

/** Support-first framing: FreeRADIUS support is primary only when FreeRADIUS is reported AND a need is identified. */
export function opportunityFraming(o: Outcome): { primary: string | null; secondary: string } {
  const act = nextAction(o).key;
  if (act === "C") return { primary: null, secondary: "No RADIUS-related opportunity demonstrated; other InkBridge offerings not assessed." };
  if (o.radius === "freeradius" && o.need === "identified")
    return { primary: `${SERVICES["support"]!.name} for the reported existing deployment (conditional on engineering validation).`, secondary: "Professional services or products remain secondary and conditional on a described initiative." };
  if (o.radius === "freeradius") return { primary: null, secondary: "FreeRADIUS reported, but no support need established — support is not yet a demonstrated opportunity." };
  if (o.radius === "other" && o.need === "identified") return { primary: null, secondary: "Not a FreeRADIUS support case. Professional services or products may be relevant only if engineering validates the reported need." };
  return { primary: null, secondary: "Opportunity type not established until the RADIUS deployment and a need are confirmed." };
}

export function explainAction(o: Outcome) {
  const act = nextAction(o).key;
  const established: string[] = [];
  if (o.radius !== "unknown") established.push(`RADIUS: ${RADIUS_LABELS[o.radius]}`);
  if (o.need !== "unknown") established.push(`Need: ${NEED_LABELS[o.need]}`);
  if (o.ownership !== "unknown") established.push(`Ownership: ${OWNERSHIP_LABELS[o.ownership]}`);
  if (o.support !== "unknown") established.push(`Support: ${SUPPORT_LABELS[o.support]}`);
  if (o.urgency !== "unknown") established.push(`Urgency: ${URGENCY_LABELS[o.urgency]}`);
  if (o.budget !== "unknown") established.push(`Budget: ${BUDGET_LABELS[o.budget]}`);
  if (o.decision !== "unknown") established.push("Decision process described");
  const unverified = [...outcomeUnknowns(o)];
  if (o.need === "identified") unverified.push("Reported need not yet validated by engineering");
  const missing = act === "C" ? [] : missingCommercial(o);
  let next: string, specialist: string;
  if (act === "C") {
    next = "Pause RADIUS-related outreach; note what was learned and revisit only if circumstances change.";
    specialist = "Not justified — no RADIUS-related requirement reported.";
  } else if (act === "B") {
    next = missing.length ? `Arrange engineering validation and, in parallel, establish: ${missing.slice(0, 3).join(", ")}.` : "Arrange engineering validation with the stakeholders named.";
    specialist = missing.length
      ? "Justified for technical validation only. Commercial qualification is incomplete, so this is not a qualified opportunity."
      : "Justified. Technical need reported and commercial details described by the prospect — still unvalidated.";
  } else {
    next = "Continue discovery to establish whether a technical need exists before involving engineering.";
    specialist = "Not yet justified — no technical need established.";
  }
  return { established, unverified, missing, next, specialist };
}

export function buildHandoff(accountName: string, plan: ReturnType<typeof buildPlan>, o: Outcome): string {
  const act = nextAction(o);
  const ex = explainAction(o);
  const fr = opportunityFraming(o);
  const tag = o.demo ? "SIMULATED (demonstration input — not a fact about this company)" : "PROSPECT-REPORTED (unverified)";
  const src = o.demo ? "simulated" : "prospect-reported";
  const showServices = act.key !== "C" && !plan.insufficient;
  const t = (s: string) => s.trim() || "Not established";
  const L: string[] = [];
  L.push(`TECHNICAL HANDOFF BRIEF — ${accountName}`);
  L.push(`Stakeholder: ${plan.persona}`);
  L.push(`Independent prototype · draft for internal review · discovery findings: ${tag}`);
  L.push("");
  L.push("=== 1. TECHNICAL ENVIRONMENT ===");
  L.push("VERIFIED PUBLIC EVIDENCE (pre-call)");
  for (const e of plan.evidence) L.push(`- ${e.date}: ${e.fact} [${e.sourceTitle} — ${e.url}]`);
  L.push("ORIGINAL TECHNICAL HYPOTHESIS (unverified)");
  L.push(plan.challenges[0] ? `- ${plan.challenges[0].hypothesis}` : "- No AAA-specific hypothesis is supported by public evidence.");
  L.push(`DISCOVERY FINDINGS — ${tag}`);
  L.push(`- RADIUS deployment: ${RADIUS_LABELS[o.radius]}`);
  L.push(`- Technical need: ${NEED_LABELS[o.need]}`);
  L.push(`- Infrastructure ownership: ${OWNERSHIP_LABELS[o.ownership]}`);
  L.push(`- Architecture / operational notes: ${o.notes.trim() || "None recorded"}`);
  L.push("TECHNICAL UNKNOWNS");
  const unknowns = outcomeUnknowns(o);
  L.push(`- Still unknown: ${unknowns.length ? unknowns.join("; ") : "none of the recorded fields"}`);
  for (const u of plan.unknowns.slice(0, 4)) L.push(`- Open from research: ${u}`);
  L.push("CONDITIONAL INKBRIDGE RELEVANCE");
  if (fr.primary) L.push(`- Primary (support-first): ${fr.primary}`);
  L.push(`- ${fr.secondary}`);
  if (showServices) for (const s of plan.services) L.push(`- ${s.service?.name ?? s.serviceId} — only if: ${s.confirm.join("; ")}`);
  else L.push("- No RADIUS/AAA-related service suggested. Current information does not support a specific recommendation; other InkBridge offerings were not assessed.");
  L.push("");
  L.push(`=== 2. BUSINESS QUALIFICATION — ${tag} ===`);
  L.push(`- Operational / business impact: ${t(o.impact)}`);
  L.push(`- Current support arrangements: ${SUPPORT_LABELS[o.support]}`);
  L.push(`- Urgency / active initiative: ${URGENCY_LABELS[o.urgency]}`);
  L.push(`- Budget status: ${BUDGET_LABELS[o.budget]} (no amount recorded)`);
  L.push(`- Decision-maker & purchasing process: ${DECISION_LABELS[o.decision]}${o.decisionNotes.trim() ? ` — ${o.decisionNotes.trim()}` : ""} (buying authority not verified)`);
  L.push(`- Relevant stakeholders: ${t(o.stakeholders)}`);
  L.push(`- Next agreed action: ${t(o.agreedNext)}`);
  L.push(`- Missing commercial information: ${ex.missing.length ? ex.missing.join("; ") : act.key === "C" ? "not pursued" : "none"}`);
  L.push("");
  L.push(`=== 3. RECOMMENDED NEXT ACTION: ${act.key}. ${ACTIONS[act.key].title} ===`);
  for (const r of act.reasons) L.push(`- ${r}`);
  L.push(`- Established (${src}): ${ex.established.length ? ex.established.join("; ") : "nothing yet"}`);
  L.push(`- Unverified: ${ex.unverified.length ? ex.unverified.join("; ") : "none recorded"}`);
  L.push(`- Next step: ${ex.next}`);
  L.push(`- InkBridge specialist involvement: ${ex.specialist}`);
  L.push("QUESTIONS FOR INKBRIDGE ENGINEERING");
  const oq = o.openQuestions.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  if (oq.length) for (const q of oq) L.push(`- ${q}`);
  else if (act.key === "C") L.push("- None — no technical engagement recommended at this stage.");
  else L.push("- No open questions recorded yet.");
  return L.join("\n");
}
