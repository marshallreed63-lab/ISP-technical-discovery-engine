// Deterministic discovery-plan generator. No AI, no randomness: same inputs, same plan.
import {
  ACCOUNT_CONTEXT, CHALLENGES, NO_AAA_OBJECTIVE, PERSONAS, COMMON_UNKNOWNS, EVIDENCE, QUESTION_BANK, SERVICES,
  type Depth, type Evidence, type Persona, type Question,
} from "./discovery-data";

const DEPTHS: Depth[] = ["opening", "architecture", "qualification"];

export const evidenceFor = (accountId: string) => EVIDENCE.filter((e) => e.accountId === accountId);

export function evidenceYear(e: Evidence): number | null {
  const m = /^(\d{4})/.exec(e.date);
  return m ? Number(m[1]) : null;
}

/** Sort key: full dates > year-only > undated. */
function dateKey(e: Evidence | undefined) {
  if (!e) return "0000";
  if (/^\d{4}-\d{2}-\d{2}$/.test(e.date)) return e.date;
  if (/^\d{4}-\d{2}$/.test(e.date)) return e.date + "-00";
  if (/^\d{4}/.test(e.date)) return e.date.slice(0, 4) + "-00-00";
  return "0000";
}

export function latestEvidence(accountId: string) {
  return evidenceFor(accountId).slice().sort((a, b) => dateKey(b).localeCompare(dateKey(a)))[0];
}

export function buildPlan(accountId: string, persona: Persona) {
  const context = ACCOUNT_CONTEXT[accountId];
  const evidence = evidenceFor(accountId).slice().sort((a, b) => dateKey(b).localeCompare(dateKey(a)));
  const challenges = CHALLENGES.filter((c) => c.accountId === accountId)
    .sort((a, b) => b.strength - a.strength || dateKey(evById(b.evidenceIds[0])).localeCompare(dateKey(evById(a.evidenceIds[0]))))
    .slice(0, 2);
  const bank = QUESTION_BANK[accountId]?.[persona];
  const questions: Question[] = bank
    ? bank.map((q, i) => ({ ...q, id: `${accountId}-${persona}-${i}`, accountId, persona, depth: DEPTHS[i] ?? "qualification" }))
    : [];
  const services = challenges.flatMap((c) => c.services.slice(0, 2).map((s) => ({ ...s, service: SERVICES[s.serviceId], challengeId: c.id })));
  const strongest = Math.max(0, ...challenges.map((c) => c.strength));
  const confidence = services.length === 0 ? "None established" : strongest >= 3 ? "Low–moderate (unvalidated)" : "Low (unvalidated)";
  const unknowns = Array.from(new Set([...challenges.flatMap((c) => c.unknowns), ...COMMON_UNKNOWNS]));
  return {
    accountId, persona, context, evidence, challenges, questions, services, confidence, unknowns,
    insufficient: services.length === 0,
    opener: questions.length && context ? buildOpener(context.openerHook, questions[0]?.text ?? "") : "",
  };
}

function evById(id: string | undefined) {
  return EVIDENCE.find((e) => e.id === id);
}

export function buildOpener(hook: string, firstQuestion: string) {
  return `Hi [First name] — I noticed ${hook}. ${firstQuestion}\n\nThe team behind FreeRADIUS at InkBridge Networks works with operators on network authentication design and support. Would it be worth comparing notes for 15 minutes?`;
}

export function datasetMetrics(accounts: { id: string; region: string }[]) {
  const years = EVIDENCE.map(evidenceYear).filter((y): y is number => y !== null);
  const latestYear = years.length ? Math.max(...years) : null;
  return {
    accounts: accounts.length,
    regions: Array.from(new Set(accounts.map((a) => a.region))),
    latestYear,
    accountsWithLatestYear: latestYear === null ? 0 : accounts.filter((a) => evidenceFor(a.id).some((e) => evidenceYear(e) === latestYear)).length,
    evidenceRecords: EVIDENCE.length,
    verifiedFreeRadius: 0, // no public record confirms a FreeRADIUS stack for any account
  };
}

/** Counts plans that actually build with questions, rather than assuming accounts × personas. */
export function discoveryPlanCount(accounts: { id: string }[]) {
  const personas = Object.keys(PERSONAS) as Persona[];
  return accounts.reduce((n, a) => n + personas.filter((p) => buildPlan(a.id, p).questions.length > 0).length, 0);
}

/** Signal → hypothesis → objective, taken only from existing plan data. */
export function snapshotFor(plan: ReturnType<typeof buildPlan>) {
  const q = plan.questions[0];
  const challenge = CHALLENGES.find((c) => c.accountId === plan.accountId && c.id === q?.challengeId);
  const supportingEvidence = plan.evidence.filter((e) => challenge?.evidenceIds.includes(e.id) && e.id !== q?.evidenceId);
  return {
    signal: q ? evById(q.evidenceId) : plan.evidence[0],
    challenge,
    supportingEvidence,
    hypothesis: challenge?.hypothesis ?? null,
    objective: plan.insufficient ? NO_AAA_OBJECTIVE : q?.learn ?? NO_AAA_OBJECTIVE,
  };
}
