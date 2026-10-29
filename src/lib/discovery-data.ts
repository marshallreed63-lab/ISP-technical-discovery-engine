// Static, vetted reference data for Phase 1 account-specific discovery plans.
// Everything here is hand-researched public information or clearly-labelled inference.

export type Persona = "Network Engineering" | "NOC / Infrastructure" | "CTO / VP Technology";
export type Depth = "opening" | "architecture" | "qualification";

export interface Evidence {
  id: string;
  accountId: string;
  fact: string;
  publisher: string;
  sourceTitle: string;
  url: string;
  date: string; // ISO date, "2026" style partial, or "Undated"
  signals: string[];
  limitation: string;
  verification: "Source reviewed" | "Requires re-verification";
}

export interface ServiceFit {
  serviceId: string;
  why: string;
  confirm: string[];
}

export interface Challenge {
  id: string;
  accountId: string;
  title: string;
  concepts: string[];
  evidenceIds: string[];
  hypothesis: string;
  relevance: string;
  unknowns: string[];
  services: ServiceFit[]; // empty = insufficient evidence for a specific recommendation
  strength: number; // 1-3: how directly the evidence relates to AAA discovery
}

export interface Question {
  id: string;
  accountId: string;
  persona: Persona;
  depth: Depth;
  challengeId: string;
  evidenceId: string;
  concept: string;
  text: string;
  why: string;
  learn: string;
  followUp: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  url: string;
  conditions: string[];
}

export interface Concept {
  id: string;
  name: string;
  explain: string;
  caution: string;
  ref?: string;
}

export const PERSONAS: Record<Persona, string> = {
  "Network Engineering": "Focus on architecture, protocols, integrations, dependencies, and scaling.",
  "NOC / Infrastructure": "Focus on availability, incident response, monitoring, recovery, and operational ownership.",
  "CTO / VP Technology": "Focus on infrastructure strategy, risk, standardization, and engineering capacity.",
};

export const SERVICES: Record<string, Service> = {
  support: {
    id: "support",
    name: "Commercial FreeRADIUS support",
    description: "Support tiers from the FreeRADIUS team: troubleshooting, configuration review, incident escalation and upgrade guidance.",
    url: "https://www.inkbridgenetworks.com/support/freeradius-support",
    conditions: ["Operator confirms FreeRADIUS (not just RADIUS) is in production", "Internal coverage, escalation or upgrade gaps are acknowledged by the buyer"],
  },
  services: {
    id: "services",
    name: "Professional services & architecture consulting",
    description: "Engineering help with AAA design, deployment, migration, integration, scaling and multi-site architecture.",
    url: "https://www.inkbridgenetworks.com/services/overview",
    conditions: ["A real design, migration or integration initiative exists", "The team wants outside specialist input rather than purely internal delivery"],
  },
  radius: {
    id: "radius",
    name: "InkBridgeRADIUS",
    description: "Commercial network authentication product built on the FreeRADIUS foundation with additional enterprise-oriented capabilities.",
    url: "https://www.inkbridgenetworks.com/products/inkbridge-radius",
    conditions: ["Architecture requirements justify evaluating a commercial AAA platform", "Current platform's limits are described by the buyer, not assumed"],
  },
  deploy: {
    id: "deploy",
    name: "InkBridge Deploy",
    description: "Orchestration framework for managing deployments and related components across sites.",
    url: "https://www.inkbridgenetworks.com/products/overview",
    conditions: ["Multi-site AAA deployments exist", "Configuration consistency or recovery workflows are a stated concern"],
  },
  policy: {
    id: "policy",
    name: "InkBridge Policy",
    description: "Policy-management layer supporting complex business and network access rules.",
    url: "https://www.inkbridgenetworks.com/products/overview",
    conditions: ["Access policy differs across platforms or regions", "Buyer wants policy standardized or integrated with existing data systems"],
  },
  manage: {
    id: "manage",
    name: "InkBridge Manage",
    description: "APIs that help ISP administrators manage subscribers and policies.",
    url: "https://www.inkbridgenetworks.com/products/overview",
    conditions: ["Verified requirement for subscriber provisioning or policy-update integration"],
  },
};

export const CONCEPTS: Record<string, Concept> = {
  aaa: { id: "aaa", name: "AAA", explain: "Authentication proves who the subscriber is; authorization decides what access or policy they get; accounting records session events for operations and, sometimes, billing.", caution: "Not every ISP implements all three in one system." },
  radius: { id: "radius", name: "RADIUS", explain: "A protocol that carries authentication, authorization and accounting messages between access equipment (the RADIUS client) and an AAA server.", caution: "Do not assume every access architecture uses RADIUS.", ref: "https://www.rfc-editor.org/info/rfc2865/" },
  freeradius: { id: "freeradius", name: "FreeRADIUS", explain: "A specific open-source RADIUS server implementation — the software InkBridge's engineers maintain.", caution: "FreeRADIUS is not a synonym for the RADIUS protocol." },
  bng: { id: "bng", name: "BNG / NAS", explain: "The broadband network gateway or network access server that terminates subscriber sessions and, in many designs, queries the AAA server.", caution: "Access devices and their role differ by operator and access technology." },
  provisioning: { id: "provisioning", name: "Subscriber provisioning", explain: "Onboarding a subscriber and setting their service profile, which often has to line up with what the access network and AAA layer authorize.", caution: "Provisioning may live in billing/OSS systems separate from AAA." },
  ha: { id: "ha", name: "High availability & failover", explain: "Transport redundancy keeps packets flowing; authentication availability also depends on AAA servers, their databases and the paths to them.", caution: "A redundant fibre route says nothing about how AAA fails over." },
  accounting: { id: "accounting", name: "RADIUS accounting", explain: "Start, stop and interim-update records that feed session visibility, usage policy and sometimes billing.", caution: "Accounting may or may not feed billing in a given deployment.", ref: "https://www.rfc-editor.org/info/rfc2866/" },
  coa: { id: "coa", name: "Change of Authorization (CoA)", explain: "RADIUS dynamic authorization lets a server change an active session or request a disconnect, where the access equipment supports it.", caution: "Do not assume an ISP supports or uses CoA.", ref: "https://www.rfc-editor.org/info/rfc5176/" },
  multisite: { id: "multisite", name: "Multi-site policy consistency", explain: "Keeping access policy, subscriber records and configuration aligned across regions or platforms; drift shows up as inconsistent behaviour.", caution: "Regions may be deliberately run differently." },
  access: { id: "access", name: "Access technology differences", explain: "Fibre (e.g. XGS-PON, IPoE/PPPoE), fixed wireless and satellite can use different authentication and provisioning models.", caution: "Multiple access types do not imply one shared AAA platform." },
  storms: { id: "storms", name: "Reconnection surges", explain: "After an outage many subscribers re-authenticate at once; AAA and its database must absorb that burst.", caution: "Only relevant if sessions re-authenticate through a central service." },
};

export const ACCOUNT_CONTEXT: Record<string, { whyShortlisted: string; openerHook: string }> = {
  citywest: {
    whyShortlisted: "Two 2026 announcements point to resilience investment and a growing operating footprint in B.C.",
    openerHook: "CityWest is building a geographically separate Highway 37 fibre route for resiliency",
  },
  xplore: {
    whyShortlisted: "Operates fibre, fixed wireless and satellite across provinces, and is activating new fibre in Newfoundland and Labrador.",
    openerHook: "Xplore has started connecting its first fibre customers in Newfoundland and Labrador",
  },
  sonic: {
    whyShortlisted: "Announced fibre expansion into two new metro markets — Los Angeles and Dallas — beyond its Bay Area base.",
    openerHook: "Sonic is bringing fibre to Los Angeles and Dallas",
  },
  beanfield: {
    whyShortlisted: "Multi-market owned fibre with a 24/7 NOC; public evidence is mostly about transport, so the plan is deliberately tentative.",
    openerHook: "Beanfield runs its own fibre network across Toronto, Montreal and Vancouver",
  },
  altafiber: {
    whyShortlisted: "Published 2026 XGS-PON expansion into new Ohio markets plus disclosed fibre scale.",
    openerHook: "altafiber is bringing XGS-PON fibre to Grove City and Marysville",
  },
};

export const EVIDENCE: Evidence[] = [
  // CityWest
  { id: "cw-hwy37", accountId: "citywest", fact: "CityWest announced a geographically separate fibre route along Highway 37 in northern B.C., separate from existing Highway 16 infrastructure, following an Aug. 11 outage on a third-party transport line. CityWest will own and operate the route (with TNDC, CRTC Broadband Fund support); it will also be available to other carriers and is anticipated to be operational by end of 2027.", publisher: "CityWest (company news)", sourceTitle: "New Highway 37 fibre route for resiliency", url: "https://www.citywest.ca/about-us/news/2026/08/24/citywest-building-new-highway-37-fibre-route-to-protect-northern-b.c.-connectivity", date: "2026-08-24", signals: ["resilience", "expansion"], limitation: "Describes transport-path diversity. Says nothing about authentication systems or past AAA incidents. Route is planned, not yet in service.", verification: "Source reviewed" },
  { id: "cw-cbt", accountId: "citywest", fact: "Columbia Basin Trust is transferring ownership and operations of its broadband network assets to CityWest in two stages: current assets later in 2026, Connect the Basin assets after construction completes in 2027. The network will continue to operate on an open-access basis supporting multiple ISPs.", publisher: "CityWest (company news, Columbia Basin Trust release)", sourceTitle: "Columbia Basin Trust to transition broadband assets to CityWest", url: "https://www.citywest.ca/about-us/news/2026/02/04/columbia-basin-trust-to-transition-broadband-assets-to-citywest", date: "2026-02-04", signals: ["multimarket", "expansion"], limitation: "A planned, staged transition of an open-access fibre network used by other ISPs. Does not indicate that CityWest takes on retail subscriber authentication for those households.", verification: "Source reviewed" },
  { id: "cw-cluculz", accountId: "citywest", fact: "A new northern B.C. fibre build to Cluculz Lake was announced as part of regional expansion.", publisher: "CityWest (company news)", sourceTitle: "Expands fibre service to Cluculz Lake", url: "https://www.citywest.ca/about-us/news/2026/07/28/citywest-expands-fibre-internet-to-cluculz-lake", date: "2026-07-28", signals: ["expansion"], limitation: "A local build; does not indicate architecture change.", verification: "Source reviewed" },
  // Xplore
  { id: "xp-nl", accountId: "xplore", fact: "Xplore reported connecting its first fibre customers in Newfoundland and Labrador, the first phase of a $181 million multi-year expansion intended to reach 27,785 households and businesses.", publisher: "Xplore (company news)", sourceTitle: "First fibre customers in Newfoundland and Labrador", url: "https://www.xplore.ca/about/news/xplore-connects-first-fibre-internet-customers-in-newfoundland-and-labrador/", date: "2026-09-15", signals: ["expansion"], limitation: "Target household count is a programme goal, not current subscribers.", verification: "Source reviewed" },
  { id: "xp-about", accountId: "xplore", fact: "Xplore describes fibre, wireless and satellite infrastructure with operations in multiple Canadian provinces.", publisher: "Xplore (company site)", sourceTitle: "Company technology and operating footprint", url: "https://www.xplore.ca/about/", date: "Undated", signals: ["mixed", "multimarket"], limitation: "Does not say whether access technologies share provisioning or AAA platforms.", verification: "Source reviewed" },
  { id: "xp-news", accountId: "xplore", fact: "Xplore's newsroom lists 2026 fixed-wireless expansion in Alberta alongside fibre announcements.", publisher: "Xplore (newsroom)", sourceTitle: "Xplore news (Alberta fixed-wireless expansion, Feb 2026)", url: "https://www.xplore.ca/about/news/", date: "2026-02", signals: ["expansion", "mixed"], limitation: "Index page; individual release should be re-checked before quoting specifics.", verification: "Requires re-verification" },
  // Sonic
  { id: "so-lada", accountId: "sonic", fact: "Sonic announced fibre expansion into Los Angeles and Dallas while continuing Bay Area operations.", publisher: "Sonic (company blog)", sourceTitle: "Sonic is bringing fibre to Los Angeles and Dallas", url: "https://www.sonic.com/blog/sonic-is-bringing-fiber-internet-to-los-angeles-and-dallas", date: "2026-05-07", signals: ["expansion", "multimarket"], limitation: "An announced expansion; build timing, subscriber volumes and back-office architecture are not disclosed.", verification: "Source reviewed" },
  // Beanfield
  { id: "bf-biz", accountId: "beanfield", fact: "Beanfield describes its own fibre network in Toronto and Montreal with expansion into Vancouver, multiple points of presence and meshed redundancy.", publisher: "Beanfield (company site)", sourceTitle: "Business network footprint and operational design", url: "https://www.beanfield.com/business/", date: "Undated", signals: ["multimarket", "resilience"], limitation: "Describes physical network design, not subscriber authentication.", verification: "Source reviewed" },
  { id: "bf-noc", accountId: "beanfield", fact: "Beanfield describes a 24/7 NOC and business connectivity offerings.", publisher: "Beanfield (company site)", sourceTitle: "Cloud Connect and NOC", url: "https://www.beanfield.com/business/cloud-exchange", date: "Undated", signals: ["resilience"], limitation: "A NOC exists; its scope over AAA systems is unknown.", verification: "Source reviewed" },
  { id: "bf-res", accountId: "beanfield", fact: "Beanfield markets 100% fibre residential internet in Toronto and states it builds and runs its own fibre network.", publisher: "Beanfield (company site)", sourceTitle: "Residential internet (Toronto)", url: "https://www.beanfield.ca/en/tor/residential/internet/", date: "Undated", signals: ["multimarket"], limitation: "Confirms a residential service line exists; nothing about how subscribers authenticate.", verification: "Source reviewed" },
  { id: "bf-uniti", accountId: "beanfield", fact: "Uniti Wholesale announced a strategic collaboration with Beanfield, anchored by Uniti's CanAm2 dark fibre route from Montreal to the New York metro region, including dark fibre and wavelength bundles connecting Montreal and Toronto.", publisher: "Uniti (investor news release)", sourceTitle: "Uniti Wholesale and Beanfield expand cross-border connectivity", url: "https://investor.uniti.com/news-releases/news-release-details/uniti-wholesale-and-beanfield-expand-cross-border-connectivity", date: "2026-06-08", signals: ["expansion"], limitation: "Wholesale dark fibre and wavelength services. Not, by itself, evidence of any AAA/RADIUS need.", verification: "Source reviewed" },
  // altafiber
  { id: "af-grove", accountId: "altafiber", fact: "altafiber announced fibre expansion to about 17,600 locations in Grove City and 15,000 in Marysville, Ohio, using its XGS-PON network (blog post dated Mar 23, 2026; the corporate press announcement is dated Mar 17, 2026).", publisher: "altafiber (company blog)", sourceTitle: "altafiber expands fibre in Ohio: Grove City and Marysville", url: "https://blog.altafiber.com/altafiber-grove-city-and-marysville", date: "2026-03-23", signals: ["expansion", "multimarket"], limitation: "Announced build, not completed deployment. XGS-PON is an access technology; it does not reveal the AAA protocol, server or backend.", verification: "Source reviewed" },
  { id: "af-dayton", accountId: "altafiber", fact: "altafiber reported its XGS-PON fibre network is available to 70,000 Dayton-region residential and business addresses, the midway point of an approx. $200 million build.", publisher: "altafiber (company blog)", sourceTitle: "altafiber passes 70,000 Dayton-region addresses", url: "https://blog.altafiber.com/altafiber-passes-70000-dayton-region-addresses-with-fiber", date: "2026-02-17", signals: ["scale", "expansion"], limitation: "Addresses passed, not subscribers activated.", verification: "Source reviewed" },
  { id: "af-rich", accountId: "altafiber", fact: "altafiber describes plans to begin building fibre to approximately 17,500 homes and businesses in Richmond in 2026.", publisher: "altafiber (company site)", sourceTitle: "Richmond fibre construction", url: "https://www.altafiber.com/offers/pre-release-richmond", date: "2026 plan", signals: ["expansion"], limitation: "A plan, not completed deployment.", verification: "Source reviewed" },
  { id: "af-brec", accountId: "altafiber", fact: "altafiber reports more than 300,000 fibre customers and continuing 2026 construction work.", publisher: "altafiber (company site)", sourceTitle: "Broadband rollout and customer scale", url: "https://www.altafiber.com/offers/pre-release-brec", date: "Undated", signals: ["scale"], limitation: "Company-reported figure; customer count does not imply AAA load problems.", verification: "Source reviewed" },
];

export const COMMON_UNKNOWNS = [
  "Whether RADIUS is used for subscriber access",
  "Whether FreeRADIUS specifically is deployed",
  "Current AAA architecture and its dependencies",
  "Who owns authentication systems internally",
  "Cloud, on-premises or hybrid hosting",
  "Any actual authentication incidents",
  "Current support arrangements",
  "Any existing relationship with InkBridge",
  "Whether a relevant project or purchasing initiative exists",
];

export const CHALLENGES: Challenge[] = [
  { id: "cw-ha", accountId: "citywest", title: "Authentication availability across failure domains", concepts: ["ha", "storms"], evidenceIds: ["cw-hwy37"], hypothesis: "CityWest's investment in route diversity may warrant exploring whether subscriber authentication and its backend dependencies are designed for the same regional failure scenarios.", relevance: "If authentication depends on a single site or path, subscribers could fail to reconnect even when transport is restored — affecting restoration time and support load.", unknowns: ["Where AAA servers and their databases sit relative to the northern routes", "How sessions re-authenticate after a route failure"], services: [{ serviceId: "services", why: "Multi-site AAA resilience design is a core professional-services topic.", confirm: ["A resilience review includes the authentication layer", "Appetite for external architecture input"] }, { serviceId: "support", why: "Specialist escalation coverage matters if FreeRADIUS is confirmed and part of incident response.", confirm: ["FreeRADIUS confirmed in production"] }], strength: 3 },
  { id: "cw-integ", accountId: "citywest", title: "Integrating additional broadband infrastructure", concepts: ["provisioning", "multisite"], evidenceIds: ["cw-cbt"], hypothesis: "Taking over operation of the open-access Columbia Basin network may raise questions about which operational and network-service systems are integrated with CityWest's own — while recognizing the retail subscribers there belong largely to other ISPs.", relevance: "Separate platforms can mean duplicated operations; merged ones need careful migration. Either way, the choice shapes engineering workload.", unknowns: ["Whether any subscriber-facing AAA is in scope, or only open-access transport", "How the two-stage transition is being engineered"], services: [{ serviceId: "services", why: "Migration and consolidation of authentication environments is a published InkBridge service area.", confirm: ["An integration or consolidation project exists", "Authentication systems are in scope"] }], strength: 2 },

  { id: "xp-multi", accountId: "xplore", title: "Provisioning and policy across access technologies", concepts: ["access", "provisioning", "multisite"], evidenceIds: ["xp-about", "xp-news"], hypothesis: "Running fibre, fixed wireless and satellite may mean several provisioning and access-policy models; how standardized they are is worth learning — without assuming a shared AAA stack.", relevance: "Inconsistent policy across platforms can complicate onboarding, support and service changes for one customer base.", unknowns: ["Whether each access type has its own AAA/provisioning path", "Which systems are shared"], services: [{ serviceId: "services", why: "Architecture consulting fits if Xplore is considering standardizing access-policy design.", confirm: ["A standardization or integration initiative exists"] }, { serviceId: "policy", why: "A policy layer is relevant only if rules differ across platforms and need unifying.", confirm: ["Policy inconsistency acknowledged", "RADIUS-based authorization in use"] }], strength: 3 },
  { id: "xp-onboard", accountId: "xplore", title: "Regional fibre onboarding", concepts: ["provisioning", "bng"], evidenceIds: ["xp-nl"], hypothesis: "New fibre activation in Newfoundland and Labrador may be a point where subscriber onboarding and access configuration are being extended to a new region.", relevance: "Activation reliability affects customer first impressions and installer/support time.", unknowns: ["Whether NL fibre uses the same activation process as other regions"], services: [{ serviceId: "manage", why: "Subscriber/policy APIs matter only if provisioning integration is a stated need.", confirm: ["Verified provisioning-integration requirement"] }], strength: 2 },

  { id: "so-market", accountId: "sonic", title: "New-market activation and operating model", concepts: ["provisioning", "multisite", "bng"], evidenceIds: ["so-lada"], hypothesis: "Entering Los Angeles and Dallas may raise choices about which parts of access provisioning and authentication are centralized versus run per market.", relevance: "Those choices affect troubleshooting handoffs, configuration consistency and how fast new markets can scale.", unknowns: ["Whether new markets reuse Bay Area AAA infrastructure", "Build timeline and expected subscriber ramp"], services: [{ serviceId: "services", why: "Multi-region AAA architecture is a professional-services topic.", confirm: ["Architecture for new markets still being decided", "Interest in outside input"] }, { serviceId: "deploy", why: "Deployment orchestration matters only if AAA components are replicated per market.", confirm: ["Multi-site AAA deployment", "Config consistency is a concern"] }], strength: 2 },

  { id: "bf-scope", accountId: "beanfield", title: "Network-access functions across service lines", concepts: ["aaa", "multisite"], evidenceIds: ["bf-biz", "bf-res", "bf-uniti"], hypothesis: "Beanfield runs residential, enterprise and wholesale services; it is unclear which, if any, rely on centrally managed subscriber authentication. Public evidence is mostly about transport.", relevance: "Low until discovery shows a residential/enterprise AAA function exists and matters to the team.", unknowns: ["Whether residential access uses RADIUS-based AAA", "Whether wholesale/transport has any AAA dependency at all"], services: [], strength: 1 },
  { id: "bf-noc", accountId: "beanfield", title: "NOC visibility of subscriber-service dependencies", concepts: ["ha"], evidenceIds: ["bf-noc", "bf-biz"], hypothesis: "With a 24/7 NOC and meshed redundancy, it may be worth asking how the NOC distinguishes transport faults from subscriber-service faults — if authentication is in its scope.", relevance: "Clear triage shortens incident time, but only matters if AAA is a real dependency.", unknowns: ["NOC scope over AAA systems"], services: [], strength: 1 },

  { id: "af-activ", accountId: "altafiber", title: "Subscriber activation on new XGS-PON markets", concepts: ["access", "provisioning", "accounting"], evidenceIds: ["af-grove", "af-rich"], hypothesis: "Bringing new XGS-PON markets online may warrant exploring how activation and policy configuration are handled across newer access platforms and the existing network — without assuming an AAA platform.", relevance: "Activation reliability and consistent policy affect install success and support workload as markets open.", unknowns: ["Which subscriber authentication method XGS-PON markets use", "Whether new and legacy platforms share policy"], services: [{ serviceId: "services", why: "Integration of new access platforms with AAA/policy backends is a professional-services topic.", confirm: ["Integration work in progress", "RADIUS in the activation path"] }, { serviceId: "manage", why: "Relevant only if provisioning/policy APIs are a stated integration need.", confirm: ["Verified provisioning-integration requirement"] }], strength: 2 },
  { id: "af-scale", accountId: "altafiber", title: "Authentication and accounting at growing scale", concepts: ["accounting", "storms", "ha"], evidenceIds: ["af-brec", "af-dayton"], hypothesis: "With 300,000+ reported fibre customers and more addresses passed, it may be worth learning how session accounting and reconnection after outages are handled as the base grows.", relevance: "If accounting feeds usage or billing, accuracy and throughput matter; if not, this is low priority.", unknowns: ["Whether accounting feeds billing", "Peak re-authentication behaviour"], services: [{ serviceId: "support", why: "Specialist support matters only if FreeRADIUS is confirmed.", confirm: ["FreeRADIUS confirmed in production"] }], strength: 2 },
];

type Q = Omit<Question, "id" | "accountId" | "persona" | "depth">;
const Q = (q: Q) => q;

// [opening, architecture, qualification] for each account × persona
export const QUESTION_BANK: Record<string, Record<Persona, [Q, Q, Q]>> = {
  citywest: {
    "Network Engineering": [
      Q({ challengeId: "cw-ha", evidenceId: "cw-hwy37", concept: "ha", text: "As you're investing in a geographically separate route along Highway 37, how are you thinking about the availability of subscriber authentication during a regional connectivity disruption?", why: "Ties a real resilience investment to the authentication layer without assuming it has problems.", learn: "Whether AAA is part of the resilience plan or managed separately.", followUp: "Where do the authentication servers and their databases sit relative to the northern routes?" }),
      Q({ challengeId: "cw-ha", evidenceId: "cw-hwy37", concept: "radius", text: "When a subscriber reconnects after a route fails over, what does that session depend on — local equipment, a central AAA service, a database somewhere else?", why: "Maps the dependency chain that determines whether transport failover is enough.", learn: "AAA architecture, whether RADIUS is used, and single points of dependency.", followUp: "Have you seen re-authentication bursts after an outage, or does that not apply in your design?" }),
      Q({ challengeId: "cw-integ", evidenceId: "cw-cbt", concept: "provisioning", text: "With the Columbia Basin network moving to CityWest while staying open-access, does any of that transition touch subscriber-facing systems on your side, or is it purely transport and operations?", why: "Identifies whether a real integration or migration project exists.", learn: "Whether there is a scoped project where authentication expertise could help.", followUp: "Who owns that integration work, and is the authentication side already designed?" }),
    ],
    "NOC / Infrastructure": [
      Q({ challengeId: "cw-ha", evidenceId: "cw-hwy37", concept: "ha", text: "When a regional route in the north goes down, how does your team tell a transport problem apart from an authentication or subscriber-service problem?", why: "NOC buyers care about triage; the new route makes regional failure a live topic.", learn: "Monitoring maturity and whether AAA is visible in incident response.", followUp: "What does your runbook look like for subscribers who can't reconnect after transport is restored?" }),
      Q({ challengeId: "cw-ha", evidenceId: "cw-hwy37", concept: "storms", text: "After an outage clears, how quickly do subscribers typically get back online, and what tends to slow that down?", why: "Restoration time is an operational metric the buyer can answer from experience.", learn: "Whether reconnection is a pain or a non-issue.", followUp: "Is that something you measure today?" }),
      Q({ challengeId: "cw-integ", evidenceId: "cw-cbt", concept: "multisite", text: "As you take on operating responsibility for more infrastructure, how are on-call coverage and escalation going to change — and does any of it extend to your own subscriber access and authentication systems?", why: "Probes support-model gaps tied to a real change in responsibilities.", learn: "Whether external escalation coverage would be valued.", followUp: "Is there anything in that stack that only one or two people know well?" }),
    ],
    "CTO / VP Technology": [
      Q({ challengeId: "cw-integ", evidenceId: "cw-cbt", concept: "multisite", text: "With the additional network responsibilities you're taking on, which parts of the access infrastructure are you trying to standardize, and which will stay separate?", why: "Strategic framing around a real announced change; standardization is treated as a hypothesis.", learn: "Architecture direction and whether authentication is in scope.", followUp: "Where does authentication and subscriber management sit in that picture?" }),
      Q({ challengeId: "cw-ha", evidenceId: "cw-hwy37", concept: "ha", text: "Is the resilience strategy behind the Highway 37 route limited to physical paths, or does it extend to the services subscribers depend on, like authentication?", why: "Tests whether resilience thinking reaches the AAA layer at the leadership level.", learn: "Whether AAA resilience is a recognized risk.", followUp: "How do you weigh the cost of a regional outage against the cost of extra redundancy?" }),
      Q({ challengeId: "cw-ha", evidenceId: "cw-cbt", concept: "aaa", text: "Is authentication infrastructure something you want to keep entirely in-house, or an area where specialist outside engineering would be useful during these changes?", why: "Directly qualifies appetite for external expertise without presuming need.", learn: "Make-vs-buy stance and who would evaluate an engagement.", followUp: "Who on the engineering side would need to be part of that conversation?" }),
    ],
  },
  xplore: {
    "Network Engineering": [
      Q({ challengeId: "xp-multi", evidenceId: "xp-nl", concept: "access", text: "With fibre activation expanding alongside your wireless and satellite services, how standardized are subscriber provisioning and access policies across those platforms?", why: "Grounded in Xplore's mixed-technology footprint; does not assume a shared AAA stack.", learn: "Whether access types share systems or run independently.", followUp: "Is that by design, or a result of how each platform was built?" }),
      Q({ challengeId: "xp-multi", evidenceId: "xp-about", concept: "radius", text: "For each access type, what actually authenticates and authorizes a subscriber session — and is that the same system or several?", why: "Directly maps the AAA architecture per technology.", learn: "Whether RADIUS/FreeRADIUS is used and how many AAA environments exist.", followUp: "How are policy changes pushed to an active session today, if at all?" }),
      Q({ challengeId: "xp-onboard", evidenceId: "xp-nl", concept: "provisioning", text: "For the Newfoundland and Labrador fibre build, are you extending an existing activation process, or is anything being redesigned for it?", why: "Identifies whether a live design project exists.", learn: "Whether there is near-term engineering work InkBridge could help with.", followUp: "What part of that process takes the most manual effort today?" }),
    ],
    "NOC / Infrastructure": [
      Q({ challengeId: "xp-multi", evidenceId: "xp-about", concept: "access", text: "When a customer can't connect, does triage look different depending on whether they're on fibre, fixed wireless or satellite?", why: "Operational angle on mixed access, answerable from experience.", learn: "Whether multiple systems complicate incident handling.", followUp: "Which access type generates the hardest tickets to diagnose?" }),
      Q({ challengeId: "xp-multi", evidenceId: "xp-news", concept: "multisite", text: "Across provinces, is monitoring for subscriber authentication and provisioning centralized, or handled by each regional team?", why: "Explores ownership and visibility across a multi-province footprint.", learn: "Operational ownership and monitoring coverage.", followUp: "How do regional teams escalate an issue that spans platforms?" }),
      Q({ challengeId: "xp-onboard", evidenceId: "xp-nl", concept: "provisioning", text: "As new fibre regions come online, how much extra operational load does activation create, and is coverage for those systems keeping pace?", why: "Qualifies a support-capacity gap without assuming one.", learn: "Whether external support or escalation would be valued.", followUp: "Are there systems in that path that rely on one or two specialists?" }),
    ],
    "CTO / VP Technology": [
      Q({ challengeId: "xp-multi", evidenceId: "xp-about", concept: "multisite", text: "Running fibre, wireless and satellite under one brand, is a common subscriber-access architecture a goal, or do you prefer each platform to stay independent?", why: "Strategic question about standardization, rooted in public footprint.", learn: "Architecture direction and appetite for consolidation.", followUp: "What would make standardization worth the migration effort?" }),
      Q({ challengeId: "xp-multi", evidenceId: "xp-news", concept: "aaa", text: "As you grow both fibre and fixed wireless, where do you see the most operational risk in how subscribers are onboarded and managed?", why: "Lets the leader name the risk rather than having one asserted.", learn: "Priorities and whether AAA features among them.", followUp: "How do you size the cost of that risk today?" }),
      Q({ challengeId: "xp-onboard", evidenceId: "xp-nl", concept: "aaa", text: "Is subscriber authentication something you see as a strategic in-house capability, or an area where specialist outside engineering could take load off the team?", why: "Qualifies make-vs-buy without presuming need.", learn: "Whether and how an engagement would be evaluated.", followUp: "Who would validate that from the engineering side?" }),
    ],
  },
  sonic: {
    "Network Engineering": [
      Q({ challengeId: "so-market", evidenceId: "so-lada", concept: "multisite", text: "As you activate subscribers in Los Angeles and Dallas, which parts of access provisioning and authentication are centrally standardized, and which are managed regionally?", why: "Ties a real new-market announcement to an architecture choice.", learn: "Centralized vs. regional AAA design.", followUp: "Are the new markets reusing the Bay Area stack as-is?" }),
      Q({ challengeId: "so-market", evidenceId: "so-lada", concept: "bng", text: "In the new markets, how will the access equipment reach the authentication service — locally deployed, or back to a central site?", why: "Maps dependencies and latency/availability trade-offs.", learn: "Whether RADIUS is used and how it's distributed.", followUp: "How do you keep configuration consistent between sites?" }),
      Q({ challengeId: "so-market", evidenceId: "so-lada", concept: "freeradius", text: "Is the authentication design for the new markets settled, or still being worked through as the build plans firm up?", why: "Finds out whether there is an open design window.", learn: "Timing and whether outside architecture input is relevant.", followUp: "Who on the team owns that decision?" }),
    ],
    "NOC / Infrastructure": [
      Q({ challengeId: "so-market", evidenceId: "so-lada", concept: "multisite", text: "With operations spreading from the Bay Area to Los Angeles and Dallas, how will troubleshooting and handoffs work across markets?", why: "Operational impact of geographic spread.", learn: "Support model and ownership across regions.", followUp: "Will each market have local operations staff, or will it be run centrally?" }),
      Q({ challengeId: "so-market", evidenceId: "so-lada", concept: "ha", text: "If the authentication service for one market became unreachable, what would subscribers in that market experience?", why: "Surfaces failure behaviour without asserting a problem.", learn: "Failover design and monitoring maturity.", followUp: "How would your monitoring show that was the cause?" }),
      Q({ challengeId: "so-market", evidenceId: "so-lada", concept: "aaa", text: "As the footprint grows, is there enough coverage and depth on the access and authentication systems, or is that an area you're looking to strengthen?", why: "Qualifies support needs tied to expansion.", learn: "Whether specialist support coverage would be valued.", followUp: "What would 'strengthen' look like — people, tooling or outside support?" }),
    ],
    "CTO / VP Technology": [
      Q({ challengeId: "so-market", evidenceId: "so-lada", concept: "multisite", text: "Expanding into Los Angeles and Dallas, what parts of your subscriber-access architecture are hardest to replicate in a new market?", why: "Strategic, grounded in the announcement, lets the leader identify friction.", learn: "Where AAA sits among scaling concerns.", followUp: "Is that a people, process or platform constraint?" }),
      Q({ challengeId: "so-market", evidenceId: "so-lada", concept: "aaa", text: "Are you aiming for one operating model across all markets, or allowing each to evolve on its own?", why: "Reveals standardization strategy and associated risk.", learn: "Whether consolidation or orchestration work is planned.", followUp: "What would drive that decision?" }),
      Q({ challengeId: "so-market", evidenceId: "so-lada", concept: "freeradius", text: "For authentication infrastructure in particular, do you see value in specialist outside expertise during the expansion, or is that firmly an internal capability?", why: "Qualifies make-vs-buy without presuming need.", learn: "Openness to an engagement and its sponsor.", followUp: "Who would evaluate that from engineering?" }),
    ],
  },
  beanfield: {
    "Network Engineering": [
      Q({ challengeId: "bf-scope", evidenceId: "bf-biz", concept: "aaa", text: "Across your residential, enterprise and wholesale services, which network-access functions are centrally managed, and which are specific to each service platform?", why: "Opens discovery honestly — evidence is mainly about transport, so we start by learning scope.", learn: "Whether a subscriber AAA function exists and where.", followUp: "For residential fibre specifically, what handles subscriber authentication?" }),
      Q({ challengeId: "bf-scope", evidenceId: "bf-res", concept: "radius", text: "On the residential side, how is a subscriber's session authorized when they connect — is there a central AAA service involved?", why: "Establishes whether RADIUS is relevant at all.", learn: "Whether RADIUS is used; if not, the account is likely not a fit.", followUp: "Does the enterprise side use the same approach?" }),
      Q({ challengeId: "bf-scope", evidenceId: "bf-biz", concept: "multisite", text: "As Vancouver grows alongside Toronto and Montreal, is anything about subscriber access being redesigned, or is it purely a network build?", why: "Qualifies whether any AAA work is in play; accepts 'no' as a valid answer.", learn: "Whether a relevant project exists.", followUp: "If nothing is changing, what would make you revisit that layer?" }),
    ],
    "NOC / Infrastructure": [
      Q({ challengeId: "bf-noc", evidenceId: "bf-noc", concept: "ha", text: "Your 24/7 NOC covers a lot of network — does its scope include subscriber-facing services like authentication, or mostly transport?", why: "Establishes scope before any assumption about AAA.", learn: "Whether AAA is even part of NOC operations.", followUp: "Who handles it if not the NOC?" }),
      Q({ challengeId: "bf-noc", evidenceId: "bf-biz", concept: "ha", text: "With meshed redundancy in the physical network, how do you confirm subscriber services also come back cleanly after a failover?", why: "Distinguishes transport redundancy from service availability.", learn: "Monitoring of service-layer recovery.", followUp: "Has that ever behaved differently from what you expected?" }),
      Q({ challengeId: "bf-scope", evidenceId: "bf-res", concept: "aaa", text: "Is there any part of the residential or enterprise access stack where coverage or escalation depth is thinner than you'd like?", why: "Open qualification — accepts that there may be none.", learn: "Whether a support need exists at all.", followUp: "Is that something you'd consider outside help for?" }),
    ],
    "CTO / VP Technology": [
      Q({ challengeId: "bf-scope", evidenceId: "bf-uniti", concept: "multisite", text: "With cross-border connectivity growing through partnerships like Uniti, how do you separate strategy for transport services from strategy for subscriber-facing services?", why: "Acknowledges the wholesale signal without treating it as an AAA need.", learn: "Whether subscriber services are a strategic focus.", followUp: "Which side gets more engineering investment over the next year?" }),
      Q({ challengeId: "bf-scope", evidenceId: "bf-biz", concept: "aaa", text: "For residential and enterprise access, is authentication infrastructure something you consider solved, or an area under review?", why: "Lets the leader say 'solved' — which is a useful disqualification.", learn: "Whether any initiative exists.", followUp: "What would make it worth revisiting?" }),
      Q({ challengeId: "bf-scope", evidenceId: "bf-res", concept: "aaa", text: "If authentication ever did become a constraint, would you expect to solve it internally or with specialist help?", why: "Light qualification appropriate to weak evidence.", learn: "Make-vs-buy stance for future nurture.", followUp: "Who would own that conversation?" }),
    ],
  },
  altafiber: {
    "Network Engineering": [
      Q({ challengeId: "af-activ", evidenceId: "af-grove", concept: "access", text: "As you bring Grove City and Marysville online on XGS-PON, how are subscriber activation and policy configuration handled across the newer access platforms and your existing network?", why: "Grounded in a specific XGS-PON announcement; doesn't assume an AAA platform.", learn: "Whether new and legacy platforms share activation/policy systems.", followUp: "Is the XGS-PON activation path different from older fibre?" }),
      Q({ challengeId: "af-activ", evidenceId: "af-grove", concept: "bng", text: "On the XGS-PON side, what does the session path look like — IPoE, PPPoE or something else, and what, if anything, does the access edge query to authorize a subscriber?", why: "Technical mapping a network engineer can answer precisely.", learn: "Whether RADIUS is in the activation path.", followUp: "How do policy changes reach an active session?" }),
      Q({ challengeId: "af-scale", evidenceId: "af-brec", concept: "accounting", text: "With 300,000+ fibre customers and more markets coming, is the authentication and accounting tier something you're already planning to scale, or is it comfortably ahead?", why: "Qualifies a capacity concern while allowing 'it's fine'.", learn: "Whether a scaling project exists.", followUp: "Does accounting feed billing or usage policy for you?" }),
    ],
    "NOC / Infrastructure": [
      Q({ challengeId: "af-activ", evidenceId: "af-grove", concept: "provisioning", text: "As new XGS-PON markets open, what do activation failures usually come down to — install, provisioning, or something in the access network?", why: "Operational question tied to expansion, answerable from tickets.", learn: "Whether AAA/provisioning features in failures.", followUp: "How long does it typically take to isolate the cause?" }),
      Q({ challengeId: "af-scale", evidenceId: "af-dayton", concept: "storms", text: "After a larger outage, how does reconnection go for subscribers — is there a backlog, or does everything come back cleanly?", why: "Reconnection behaviour at scale, no assumed problem.", learn: "Whether re-authentication load is a real concern.", followUp: "Do you track time-to-restore for subscriber sessions?" }),
      Q({ challengeId: "af-scale", evidenceId: "af-brec", concept: "aaa", text: "As the fibre base grows, is on-call and escalation coverage for the authentication systems keeping pace?", why: "Qualifies support needs without presuming them.", learn: "Whether external support coverage would be valued.", followUp: "Are any of those systems dependent on a few specialists?" }),
    ],
    "CTO / VP Technology": [
      Q({ challengeId: "af-activ", evidenceId: "af-grove", concept: "multisite", text: "With new markets like Grove City, Marysville and Richmond coming on, are you standardizing how subscribers are onboarded across old and new fibre, or keeping them separate?", why: "Strategic standardization question grounded in published build plans.", learn: "Architecture direction for the access layer.", followUp: "What's the main constraint on standardizing?" }),
      Q({ challengeId: "af-scale", evidenceId: "af-brec", concept: "aaa", text: "At your current scale, where do you see the most operational risk in subscriber access — capacity, consistency, or the people needed to run it?", why: "Lets the leader name the risk; ties to disclosed scale.", learn: "Priority concerns and whether AAA is among them.", followUp: "How is that risk being addressed today?" }),
      Q({ challengeId: "af-activ", evidenceId: "af-rich", concept: "aaa", text: "For the authentication and policy layer specifically, would outside specialist engineering be useful during this expansion, or is it firmly an internal capability?", why: "Qualifies make-vs-buy without presuming need.", learn: "Whether and how an engagement would be evaluated.", followUp: "Who on engineering would validate that?" }),
    ],
  },
};

export const HEROTEL_NOTE = {
  text: "InkBridge has addressed similar categories of authentication complexity — consolidation of many legacy environments, reconnection after outages, geographic failover — in a published customer engagement. This demonstrates engineering capability, not proof that this prospect has the same problem.",
  url: "https://www.inkbridgenetworks.com/blog/case-studies-12/herotel-isp-authentication-201",
};

// ---- Display-only labels (no new claims) ----
/** Short shortlist label summarising each account's existing lead hypothesis. Not a score. */
export const DISCOVERY_ANGLE: Record<string, string> = {
  citywest: "Network resilience",
  xplore: "Multi-technology subscriber provisioning",
  sonic: "New-market network activation",
  beanfield: "Establish AAA relevance",
  altafiber: "Subscriber activation and fibre expansion",
};

/** Evidence-quality caveats shown in the workspace and Methodology. Scores are unchanged. */
export const EVIDENCE_NOTES: Record<string, string> = {
  beanfield: "Resilience signal is supported only by undated marketing descriptions of meshed redundancy and a 24/7 NOC. There is no dated resilience event; treat it as weak.",
};

export const STEP_LABELS: Record<Depth, string> = {
  opening: "Step 1 · Open the conversation",
  architecture: "Step 2 · Understand the architecture or operating environment",
  qualification: "Step 3 · Qualify technical relevance and possible next steps",
};

export const NO_AAA_OBJECTIVE = "Establish whether AAA/RADIUS is relevant at all, before discussing any solution.";
