// Discovery outcome → next action → handoff brief. Deterministic, client-side only.
// Outcome inputs are prospect-reported or simulated; they never alter public evidence.
import { buildPlan } from "./discovery";

export type Radius = "unknown" | "freeradius" | "other" | "none";
export type Need = "unknown" | "identified" | "none";
export type Ownership = "unknown" | "internal" | "external";

export interface Outcome {
  radius: Radius; need: Need; ownership: Ownership; notes: string; openQuestions: string; demo: boolean;
}

export const EMPTY_OUTCOME: Outcome = { radius: "unknown", need: "unknown", ownership: "unknown", notes: "", openQuestions: "", demo: false };

export const RADIUS_LABELS: Record<Radius, string> = {
  unknown: "Not established", freeradius: "FreeRADIUS confirmed", other: "Another implementation", none: "No relevant RADIUS use case",
};
export const NEED_LABELS: Record<Need, string> = {
  unknown: "Not established", identified: "Identified but unvalidated", none: "No relevant need",
};
export const OWNERSHIP_LABELS: Record<Ownership, string> = {
  unknown: "Unknown", internal: "Internal engineering", external: "External provider",
};

/** Fictional inputs for demonstration mode — never facts about the real company. */
export const DEMO_OUTCOME: Outcome = {
  radius: "freeradius", need: "identified", ownership: "internal",
  notes: "[SIMULATED] Prospect described a single RADIUS pair serving all subscriber regions and wants failover tested before a new market launch.",
  openQuestions: "[SIMULATED] Is accounting data replicated between sites? What is the acceptable authentication outage window during maintenance?",
  demo: true,
};

export type ActionKey = "A" | "B" | "C";
export const ACTIONS: Record<ActionKey, { title: string; summary: string }> = {
  A: { title: "Further qualification required", summary: "Insufficient technical information to determine relevance." },
  B: { title: "Potential specialist discussion", summary: "A relevant technical requirement has been reported and merits engineering validation." },
  C: { title: "No demonstrated opportunity", summary: "Available information does not support further technical engagement." },
};

/**
 * Rules (first match wins):
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
  if (o.radius === "freeradius") r.push("FreeRADIUS being in use does not by itself indicate a need for InkBridge help.");
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

export function buildHandoff(accountName: string, plan: ReturnType<typeof buildPlan>, o: Outcome): string {
  const act = nextAction(o);
  const tag = o.demo ? "SIMULATED (demonstration input — not a fact about this company)" : "PROSPECT-REPORTED (unverified)";
  const showServices = act.key !== "C" && !plan.insufficient;
  const unknowns = outcomeUnknowns(o);
  const L: string[] = [];
  L.push(`TECHNICAL HANDOFF BRIEF — ${accountName}`);
  L.push(`Stakeholder: ${plan.persona}`);
  L.push(`Independent prototype · draft for internal review`);
  L.push("");
  L.push("1. VERIFIED PUBLIC EVIDENCE (pre-call)");
  for (const e of plan.evidence) L.push(`- ${e.date}: ${e.fact} [${e.sourceTitle} — ${e.url}]`);
  L.push("");
  L.push("2. ORIGINAL TECHNICAL HYPOTHESIS (unverified)");
  L.push(plan.challenges[0] ? `- ${plan.challenges[0].hypothesis}` : "- No AAA-specific hypothesis is supported by public evidence.");
  L.push("");
  L.push(`3. DISCOVERY FINDINGS — ${tag}`);
  L.push(`- RADIUS deployment: ${RADIUS_LABELS[o.radius]}`);
  L.push(`- Technical need: ${NEED_LABELS[o.need]}`);
  L.push(`- Infrastructure ownership: ${OWNERSHIP_LABELS[o.ownership]}`);
  L.push(`- Notes: ${o.notes.trim() || "None recorded"}`);
  L.push("");
  L.push("4. KNOWN AND UNKNOWN REQUIREMENTS");
  const known = [o.radius !== "unknown" && `RADIUS: ${RADIUS_LABELS[o.radius]}`, o.need !== "unknown" && `Need: ${NEED_LABELS[o.need]}`, o.ownership !== "unknown" && `Ownership: ${OWNERSHIP_LABELS[o.ownership]}`].filter(Boolean);
  L.push(`- Reported (${o.demo ? "simulated" : "prospect-reported"}): ${known.length ? known.join("; ") : "none"}`);
  L.push(`- Still unknown: ${unknowns.length ? unknowns.join("; ") : "none of the recorded fields"}`);
  for (const u of plan.unknowns.slice(0, 4)) L.push(`- Open from research: ${u}`);
  L.push("");
  L.push("5. CONDITIONAL INKBRIDGE RELEVANCE");
  if (showServices) for (const s of plan.services) L.push(`- ${s.service?.name ?? s.serviceId} — only if: ${s.confirm.join("; ")}`);
  else L.push("- No RADIUS/AAA-related service suggested. Current information does not support a specific recommendation; other InkBridge offerings were not assessed.");
  L.push("");
  L.push(`6. SUGGESTED NEXT ACTION: ${act.key}. ${ACTIONS[act.key].title}`);
  for (const r of act.reasons) L.push(`- ${r}`);
  L.push("");
  L.push("7. QUESTIONS FOR INKBRIDGE ENGINEERING");
  const oq = o.openQuestions.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  if (oq.length) for (const q of oq) L.push(`- ${q}`);
  else if (act.key === "C") L.push("- None — no technical engagement recommended at this stage.");
  else L.push("- No open questions recorded yet.");
  return L.join("\n");
}
