/* Dashboard — visible after login.
   Shares background, palette, and language with the login flow. */
const { useState: useStateD, useEffect: useEffectD, useRef: useRefD } = React;

// -- icons (small, line-style, matching login icons) --
const IconWorks = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {/* writing hand: pen + cuff + paper line */}
    <path d="M3 20h10" />
    <path d="M14.5 4.5l3.2-1.6a1 1 0 0 1 1.3.4l1 1.7a1 1 0 0 1-.3 1.3L17 8" />
    <path d="M14.5 4.5L6 13l-1.2 4.6a.6.6 0 0 0 .7.7L10 17l8.5-8.5" />
    <path d="M13 6l4 4" />
  </svg>
);
const IconExperiments = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="16" r="3.5" />
    <circle cx="14" cy="13" r="5" />
    <circle cx="19.5" cy="6.5" r="2" />
  </svg>
);
const IconClassics = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {/* open book */}
    <path d="M3 5.5C5.5 4.5 8.5 4.5 12 6" />
    <path d="M21 5.5C18.5 4.5 15.5 4.5 12 6" />
    <path d="M3 5.5V19c2.5-1 5.5-1 9 .5" />
    <path d="M21 5.5V19c-2.5-1-5.5-1-9 .5" />
    <path d="M12 6v13.5" />
  </svg>
);
const IconResources = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3.5 12h17" />
    <path d="M12 3a13 13 0 0 1 0 18a13 13 0 0 1 0-18z" />
  </svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    <path d="M9 12h11" />
    <polyline points="14 7 19 12 14 17" />
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="20" y1="20" x2="16.5" y2="16.5" />
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const tagClassFor = (tag, kind) => {
  // kind = "work" | "exp"
  const norm = (tag || "").toLowerCase();
  if (kind === "work") {
    if (norm.includes("draft") || norm.includes("მონახ") || norm.includes("чернов")) return "draft";
    if (norm.includes("review") || norm.includes("განხილვ") || norm.includes("рецен")) return "review";
    return "final";
  }
  if (norm.includes("recruit") || norm.includes("რეკრუტ") || norm.includes("набор")) return "recruiting";
  if (norm.includes("hold") || norm.includes("შეცდა") || norm.includes("приостан")) return "hold";
  return "running";
};

const SidebarLanguageSelector = ({ lang, setLang, t }) => {
  const [open, setOpen] = useStateD(false);
  const ref = useRefD(null);
  const langs = [
    { code: "KA", label: "ქართული" },
    { code: "EN", label: "English" },
    { code: "RU", label: "Русский" },
  ];
  useEffectD(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const current = langs.find((l) => l.code === lang) || langs[0];
  return (
    <div className="side-lang" ref={ref}>
      <button type="button" className="side-lang-btn" onClick={() => setOpen((o) => !o)}>
        <span className="side-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z" />
          </svg>
        </span>
        <span className="grow">{t.dashboard.language}</span>
        <span className="lang-code">{current.code}</span>
      </button>
      {open && (
        <ul className="side-lang-menu" role="listbox">
          {langs.map((l) => (
            <li key={l.code}>
              <button type="button" role="option" aria-selected={l.code === lang}
                className={`lang-item ${l.code === lang ? "is-active" : ""}`}
                onClick={() => { setLang(l.code); setOpen(false); }}>
                <span className="lang-item-code">{l.code}</span>
                <span className="lang-item-label">{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Dashboard = ({ t, lang, setLang, accent, brand, onLogout, showLogo }) => {
  const [active, setActive] = useStateD("home");
  const [activeSub, setActiveSub] = useStateD(null); // {section, label}
  const [expanded, setExpanded] = useStateD({ works: false, experiments: false, classics: false });
  const d = t.dashboard;

  const items = [
    { key: "works", label: d.works, icon: <IconWorks />, sub: d.worksSub },
    { key: "experiments", label: d.experiments, icon: <IconExperiments />, sub: d.experimentsSub },
    { key: "classics", label: d.classics, icon: <IconClassics />, sub: d.classicsSub },
    { key: "resources", label: d.resources, icon: <IconResources /> },
  ];

  const openSubPage = (sectionKey, label) => {
    setActive(sectionKey);
    setActiveSub({ section: sectionKey, label });
  };
  const goHome = () => { setActive("home"); setActiveSub(null); };

  return (
    <div className={`dashboard lang-${lang}`} style={{ "--accent": accent }}>
      <aside className="sidebar">
        <div className="brand">
          {showLogo && (
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke={accent} strokeWidth="2" />
              <circle cx="16" cy="16" r="6" fill={accent} />
              <circle cx="22.5" cy="9.5" r="2.5" fill={accent} opacity="0.5" />
            </svg>
          )}
          <span className="brand-name" style={{ fontSize: 16 }}>{t.brandLocal || brand}</span>
        </div>

        <nav className="side-nav" aria-label="Primary">
          <button
            type="button"
            className={`side-link ${active === "home" && !activeSub ? "is-active" : ""}`}
            onClick={goHome}
          >
            <span className="side-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11l9-7 9 7" />
                <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
              </svg>
            </span>
            <span className="side-link-label">{t.brandLocal || brand}</span>
          </button>
          {items.map((it) => {
            const hasSub = !!it.sub;
            const isOpen = !!expanded[it.key];
            return (
              <div key={it.key} className="side-group">
                <button
                  type="button"
                  className={`side-link ${active === it.key && !activeSub ? "is-active" : ""}`}
                  onClick={() => {
                    setActive(it.key);
                    setActiveSub(null);
                    if (hasSub) setExpanded((s) => ({ ...s, [it.key]: !s[it.key] }));
                  }}
                  aria-expanded={hasSub ? isOpen : undefined}
                >
                  <span className="side-icon">{it.icon}</span>
                  <span className="side-link-label">{it.label}</span>
                  {hasSub && (
                    <span className={`side-caret ${isOpen ? "is-open" : ""}`}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  )}
                </button>
                {hasSub && isOpen && (
                  <ul className="side-sub" role="list">
                    {it.sub.map((label) => {
                      const isActive = activeSub && activeSub.section === it.key && activeSub.label === label;
                      return (
                        <li key={label}>
                          <button
                            type="button"
                            className={`side-sub-link ${isActive ? "is-active" : ""}`}
                            onClick={() => openSubPage(it.key, label)}
                          >
                            {label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <SidebarLanguageSelector lang={lang} setLang={setLang} t={t} />
          <button type="button" className="side-logout" onClick={onLogout}>
            <span className="side-icon"><IconLogout /></span>
            <span>{d.logout}</span>
          </button>
        </div>
      </aside>

      <main className="dash-main">
        {activeSub ? (
          <DetailPage
            t={t}
            section={activeSub.section}
            label={activeSub.label}
            sectionLabel={items.find((i) => i.key === activeSub.section)?.label}
            sectionIcon={items.find((i) => i.key === activeSub.section)?.icon}
            onBack={goHome}
            accent={accent}
          />
        ) : (
          <HomeView t={t} d={d} />
        )}
      </main>
    </div>
  );
};

// ----- home view (the original dashboard content) -----
const HomeView = ({ t, d }) => (
  <>
    <div className="dash-header">
      <div>
        <h1 className="dash-greeting">{d.greeting}</h1>
        <p className="dash-sub">{d.todayOverview}</p>
      </div>
      <div className="dash-actions">
        <label className="dash-search">
          <IconSearch />
          <input type="search" placeholder={d.search} />
        </label>
        <button type="button" className="dash-cta">
          <IconPlus />
          <span>{d.newStudy}</span>
        </button>
      </div>
    </div>

    <div className="stat-row">
      <div className="stat">
        <span className="stat-label">{d.activeWorks}</span>
        <span className="stat-value">12</span>
        <span className="stat-meta">+3 {d.thisMonth}</span>
      </div>
      <div className="stat">
        <span className="stat-label">{d.runningExperiments}</span>
        <span className="stat-value">5</span>
        <span className="stat-meta">2 {d.thisMonth}</span>
      </div>
      <div className="stat">
        <span className="stat-label">{d.classicsRead}</span>
        <span className="stat-value">28</span>
        <span className="stat-meta">+4 {d.thisMonth}</span>
      </div>
    </div>

    <div className="dash-grid">
      <section className="dash-card">
        <header className="dash-card-head">
          <h2 className="dash-card-title">{d.works}</h2>
          <a href="#" className="see-all">{d.seeAll}</a>
        </header>
        {d.worksList.map((w, i) => (
          <div key={i} className="list-row">
            <div className="list-text">
              <div className="list-title">{w.title}</div>
              <div className="list-meta">{w.meta}</div>
            </div>
            <span className={`tag ${tagClassFor(w.tag, "work")}`}>{w.tag}</span>
          </div>
        ))}
      </section>

      <section className="dash-card">
        <header className="dash-card-head">
          <h2 className="dash-card-title">{d.experiments}</h2>
          <a href="#" className="see-all">{d.seeAll}</a>
        </header>
        {d.experimentsList.map((e, i) => (
          <div key={i} className="list-row">
            <div className="list-text">
              <div className="list-title">{e.title}</div>
              <div className="list-meta">{e.meta}</div>
            </div>
            <span className={`tag ${tagClassFor(e.status, "exp")}`}>{e.status}</span>
          </div>
        ))}
      </section>
    </div>

    <div className="dash-grid-second">
      <section className="dash-card">
        <header className="dash-card-head">
          <h2 className="dash-card-title">{d.classics}</h2>
          <a href="#" className="see-all">{d.seeAll}</a>
        </header>
        {d.classicsList.map((c, i) => (
          <div key={i} className="list-row">
            <div className="list-text">
              <div className="list-title">{c.title}</div>
              <div className="list-meta">{c.meta}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="dash-card">
        <header className="dash-card-head">
          <h2 className="dash-card-title">{d.recent}</h2>
        </header>
        <div className="list-row">
          <div className="list-text">
            <div className="list-title">{d.worksList[0].title}</div>
            <div className="list-meta">{d.worksList[0].meta}</div>
          </div>
        </div>
        <div className="list-row">
          <div className="list-text">
            <div className="list-title">{d.experimentsList[1].title}</div>
            <div className="list-meta">{d.experimentsList[1].meta}</div>
          </div>
        </div>
        <div className="list-row">
          <div className="list-text">
            <div className="list-title">{d.classicsList[0].title}</div>
            <div className="list-meta">{d.classicsList[0].meta}</div>
          </div>
        </div>
      </section>
    </div>
  </>
);

// ----- detail page (per sub-menu item) -----
const DetailPage = ({ t, section, label, sectionLabel, sectionIcon, onBack, accent }) => {
  const d = t.dashboard;

  // Pseudo-stable seeded numbers per (section, label) so each page feels distinct
  // but stays the same across renders.
  const seed = (section + label).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const items = 6 + (seed % 9);
  const contributors = 2 + (seed % 5);
  const citations = 8 + (seed % 24);
  const updated = ["2 days ago", "1 week ago", "3 weeks ago"][seed % 3];

  return (
    <div className="detail-page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <button type="button" className="crumb-link" onClick={onBack}>
          {t.brandLocal}
        </button>
        <span className="crumb-sep">/</span>
        <span className="crumb-section">
          <span className="crumb-icon">{sectionIcon}</span>
          {sectionLabel}
        </span>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{label}</span>
      </nav>

      <header className="detail-head">
        <div>
          <div className="detail-eyebrow">{sectionLabel}</div>
          <h1 className="detail-title">{label}</h1>
          <p className="detail-desc">{d.detailDescription}</p>
        </div>
        <div className="detail-actions">
          <button type="button" className="detail-btn">{d.detailShare}</button>
          <button type="button" className="detail-btn primary-btn" style={{ background: accent }}>
            {d.detailOpen}
          </button>
        </div>
      </header>

      <div className="stat-row">
        <div className="stat">
          <span className="stat-label">{d.detailMetaItems}</span>
          <span className="stat-value">{items}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{d.detailMetaContributors}</span>
          <span className="stat-value">{contributors}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{d.detailMetaCitations}</span>
          <span className="stat-value">{citations}</span>
        </div>
      </div>

      <div className="dash-grid">
        <section className="dash-card">
          <header className="dash-card-head">
            <h2 className="dash-card-title">{d.detailSummary}</h2>
          </header>
          <div className="detail-prose">
            <p>{d.detailDescription}</p>
            <p className="detail-meta-line">{d.detailLastUpdated}: {updated}</p>
          </div>
        </section>

        <section className="dash-card">
          <header className="dash-card-head">
            <h2 className="dash-card-title">{d.detailReferences}</h2>
          </header>
          {d.classicsList.slice(0, 3).map((c, i) => (
            <div key={i} className="list-row">
              <div className="list-text">
                <div className="list-title">{c.title}</div>
                <div className="list-meta">{c.meta}</div>
              </div>
            </div>
          ))}
        </section>
      </div>

      <section className="dash-card">
        <header className="dash-card-head">
          <h2 className="dash-card-title">{d.detailNotes}</h2>
        </header>
        {Array.from({ length: 3 }).map((_, i) => {
          const src = section === "experiments" ? d.experimentsList : d.worksList;
          const ex = src[(i + (seed % src.length)) % src.length];
          return (
            <div key={i} className="list-row">
              <div className="list-text">
                <div className="list-title">{ex.title}</div>
                <div className="list-meta">{ex.meta}</div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

window.Dashboard = Dashboard;
