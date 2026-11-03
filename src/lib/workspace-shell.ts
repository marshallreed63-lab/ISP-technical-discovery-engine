/** Presentation-only application chrome. Research and outcome rules live elsewhere. */
const paths = {
  network:
    '<path d="M12 3v5m0 8v5M3 12h5m8 0h5M5.5 5.5l3.2 3.2m6.6 6.6 3.2 3.2M5.5 18.5l3.2-3.2m6.6-6.6 3.2-3.2"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="3" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="21" cy="12" r="1"/><circle cx="12" cy="21" r="1"/>',
  research: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M7 10h6m-3-3v6"/>',
  discovery: '<path d="M9 3h6v5H9zM3 16h6v5H3zm12 0h6v5h-6zM12 8v4m-6 4v-4h12v4"/>',
  outcome:
    '<path d="m12 2 3 3 4 1 1 4 2 2-2 3-1 4-4 1-3 2-3-2-4-1-1-4-2-3 2-2 1-4 4-1zM8 12l3 3 5-6"/>',
  handoff:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7m-5 12h7m-3-3 3 3-3 3"/>',
  book: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1v15"/>',
  workflow: '<path d="M3 3h6v6H3zm12 12h6v6h-6zM6 9v9h9M15 3h6v6h-6zM9 6h6"/>',
  method: '<path d="M5 21h14M9 17h6M10 3l5 5-4 4-5-5zm3 8 3 3c4-5 5 5-1 5H8"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  export: '<path d="M12 3v12m-4-4 4 4 4-4M4 15v6h16v-6"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  building: '<path d="M3 21V3h11v18m0-12h7v12M6 7h5M6 11h5M6 15h5M17 13h2m-2 4h2M1 21h22"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c6 6 6 12 0 18-6-6-6-12 0-18"/>',
  signal:
    '<circle cx="12" cy="12" r="2"/><path d="M7 7a7 7 0 0 0 0 10m10-10a7 7 0 0 1 0 10M4 4a11 11 0 0 0 0 16M20 4a11 11 0 0 1 0 16"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
} as const;
export function icon(name: keyof typeof paths, className = "") {
  return `<svg class="ui-icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
export const SIDEBAR = `
<aside class="sidebar" aria-label="Main navigation">
  <div class="brand"><span class="emblem">${icon("network")}</span><span class="brand-name">ISP Intelligence</span><span class="brand-sub">Research</span></div>
  <div class="workspace-label">${icon("building")}<span>Account Intelligence</span><span class="workspace-mark">⌘</span></div>
  <div class="nav-label">Discovery lifecycle</div>
  <nav class="nav lifecycle-nav" id="lifecycleNav" aria-label="Discovery lifecycle">
    <button class="active" data-stage="research">${icon("research")}Account Research</button>
    <button data-stage="discovery">${icon("discovery")}Technical Discovery</button>
    <button data-stage="outcome">${icon("outcome")}Qualification Outcome</button>
    <button data-stage="handoff">${icon("handoff")}Team Handoff</button>
  </nav>
  <div class="nav-label library-label">Intelligence library</div>
  <nav class="nav" id="nav" aria-label="Intelligence library">
    <button data-view="technical">${icon("book")}Technical Fluency</button>
    <button data-view="workflow">${icon("workflow")}Sales Workflow</button>
    <button data-view="methodology">${icon("method")}Methodology</button>
  </nav>
  <div class="sidebar-bottom"><div><span class="status-dot"></span>Session-only inputs<span class="sidebar-meta">Not persisted</span></div><div>Independent prototype<span class="sidebar-meta">Public research</span></div></div>
</aside>`;
export const HEADER = `
<header class="app-bar">
 <nav class="header-crumbs" aria-label="Workflow shortcuts"><button data-stage="research">Research</button><span>›</span><button data-stage="discovery">Discovery</button><span>›</span><button data-stage="outcome">Outcome</button><span>›</span><button data-stage="handoff">Handoff</button></nav>
 <span class="chip"><span class="status-dot amber"></span>Rules-based · Public Research</span>
 <button class="header-search" id="globalSearch">${icon("search")}<span>Search accounts…</span><kbd>/</kbd></button>
 <button class="header-guide" id="researchGuide" aria-label="Open research methodology">${icon("info")}</button>
</header>
<div class="phase-bar"><span class="phase-label">Discovery phase</span><nav id="stageNav" aria-label="Discovery phases">${["Research", "Discovery", "Outcome", "Handoff"].map((s, i) => `<button data-stage="${s.toLowerCase()}" ${i === 0 ? 'class="active" aria-current="step"' : ""}><span class="phase-number">0${i + 1}</span>${s}</button>${i < 3 ? '<span class="phase-arrow">→</span>' : ""}`).join("")}</nav><span class="phase-context">Curated research<span class="phase-separator">|</span><span class="gold">No verified FreeRADIUS deployments</span></span></div>
<div id="topline" class="sr-only"><h1>ISP Intelligence Engine</h1></div>`;
export const RESEARCH = `
<section id="view-research" aria-label="Account research">
 <div class="grid summary-strip" id="metrics"></div>
 <div class="shortlist-layout">
  <div class="research-column">
   <div class="research-toolbar"><div class="filters"><div class="search-field">${icon("search")}<input aria-label="Search accounts" type="search" id="search" placeholder="Search account or region…" /></div><select id="region" aria-label="Filter by region"><option value="all">Regions: CA, US</option><option value="Canada">Canada</option><option value="USA">USA</option></select><select id="threshold" aria-label="Minimum Research Priority"><option value="0">Score: Any</option><option value="40">Score: 40+</option><option value="60">Score: 60+</option></select><select id="evidenceFilter" aria-label="Filter by source review status"><option value="all">Source status</option><option value="reviewed">All reviewed</option><option value="review">Review required</option></select></div><button class="button" id="exportButton">${icon("export")}Export ranked CSV</button></div>
   <div class="table-surface"><div class="scroll" tabindex="0" role="region" aria-label="Account shortlist; scroll horizontally for all columns"><table class="tbl"><caption class="sr-only">Research-backed account shortlist, ranked by heuristic Research Priority</caption><thead><tr><th scope="col">Account &amp; footprint</th><th scope="col">Expansion signals</th><th scope="col">Source state</th><th scope="col">Signal score</th><th scope="col">Action</th></tr></thead><tbody id="accountsTable"></tbody></table></div><div class="table-footer"><span id="tableCount"></span><span>Sort: Signal score desc<span class="footer-divider">·</span>Keyboard ↑ / ↓ to inspect</span></div></div>
   <p class="research-caution">Research Priority is heuristic prioritization of public activity, not technical fit or buying intent. FreeRADIUS deployment is not verified for any account.</p>
   <details class="scoring-drawer"><summary>Signal scoring model<span>Customize weights</span></summary><div class="scoring-content"><div class="section-head"><div><h2>Customize the scoring model</h2><p>Scores update immediately; the underlying formula stays the same.</p></div><button class="button ghost small" id="resetWeights">Reset weights</button></div><div class="two"><div id="weights"></div><div class="callout"><strong>Why these signals?</strong><p>Expansion, multi-market operations, resilience, mixed access, and scale can justify discovery. None proves RADIUS use or authentication problems.</p><p class="caption">100 × sum(weights of observed public signals) / sum(all weights). Missing public information scores zero without implying a negative finding.</p></div></div></div></details>
  </div>
  <section class="inspector" id="accountInspector" aria-label="Selected account research"></section>
 </div>
</section>`;
