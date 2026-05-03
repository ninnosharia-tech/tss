/* Login / Onboarding app — i18n-aware */
const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "density": 12,
  "speed": 1.2,
  "palette": "blue",
  "layout": "flipped",
  "showLogo": true,
  "brand": "SET STUDIES",
  "accent": "#1E48B8"
}/*EDITMODE-END*/;

// ----- icons -----
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="10" width="16" height="11" rx="2.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);
const IconEye = ({ off }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <line x1="3" y1="3" x2="21" y2="21" />}
  </svg>
);
const IconKey = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="14" r="4" />
    <path d="M11 12l9-9 2 2-2 2 2 2-2 2-2-2-3 3" />
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 12 10 18 20 6" />
  </svg>
);
const IconGoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
    <path fill="#FBBC05" d="M11.69 28.18A13.6 13.6 0 0 1 11 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A22 22 0 0 0 2 24c0 3.55.85 6.92 2.34 9.88l7.35-5.7z"/>
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.42 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7C13.42 14.62 18.27 10.75 24 10.75z"/>
  </svg>
);
const IconGlobe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z" />
  </svg>
);
const IconChevron = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Mark = ({ accent }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" stroke={accent} strokeWidth="2" />
    <circle cx="16" cy="16" r="6" fill={accent} />
    <circle cx="22.5" cy="9.5" r="2.5" fill={accent} opacity="0.5" />
  </svg>
);

// ----- form -----
const SignInForm = ({ accent, onSwitch, mode, t, onComplete }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState({});

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwValid = pw.length >= 8;
  const nameValid = mode === "signup" ? name.trim().length >= 2 : true;
  const formValid = emailValid && pwValid && nameValid;

  const strength = useMemo(() => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }, [pw]);

  const submit = (e) => {
    e.preventDefault();
    setTouched({ email: true, pw: true, name: true });
    if (!formValid) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      // After the success animation plays, transition to the dashboard.
      setTimeout(() => { if (onComplete) onComplete(); }, 1100);
    }, 1100);
  };

  if (done) {
    return (
      <div className="success">
        <div className="success-mark">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 12 10 18 20 6" />
          </svg>
        </div>
        <h2>{t.youreIn}</h2>
        <p>{t.redirecting}</p>
        <div className="dots"><span></span><span></span><span></span></div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="card-title">
        {mode === "signup" ? t.createAccount : t.signinSub}
      </h1>
      {mode === "signup" && (
        <p className="card-sub">{t.signupSub}</p>
      )}

      <div className="social">
        <button type="button" className="social-btn">
          <IconGoogleG />
          <span>{t.continueGoogle}</span>
        </button>
        <button type="button" className="social-btn">
          <IconKey />
          <span>{t.continuePasskey}</span>
        </button>
      </div>

      <div className="divider"><span>{t.orEmail}</span></div>

      {mode === "signup" && (
        <label className="field">
          <span className="label">{t.fullName}</span>
          <div className={`input-wrap ${touched.name && !nameValid ? "err" : ""}`}>
            <input
              type="text"
              placeholder={t.fullNamePh}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((tt) => ({ ...tt, name: true }))}
              autoComplete="name"
            />
          </div>
        </label>
      )}

      <label className="field">
        <span className="label">{t.email}</span>
        <div className={`input-wrap ${touched.email && !emailValid && email ? "err" : ""}`}>
          <span className="leading"><IconMail /></span>
          <input
            type="email"
            placeholder={t.emailPh}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((tt) => ({ ...tt, email: true }))}
            autoComplete="email"
          />
          {email && emailValid && (<span className="trailing valid"><IconCheck /></span>)}
        </div>
      </label>

      <label className="field">
        <div className="label-row">
          <span className="label">{t.password}</span>
          {mode === "signin" && (
            <a href="#" className="forgot" style={{ color: accent }}>{t.forgot}</a>
          )}
        </div>
        <div className={`input-wrap ${touched.pw && !pwValid && pw ? "err" : ""}`}>
          <span className="leading"><IconLock /></span>
          <input
            type={showPw ? "text" : "password"}
            placeholder={mode === "signup" ? t.passwordPhNew : t.passwordPh}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onBlur={() => setTouched((tt) => ({ ...tt, pw: true }))}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
          <button
            type="button"
            className="trailing toggle"
            onClick={() => setShowPw((s) => !s)}
            aria-label={showPw ? t.hidePw : t.showPw}
          >
            <IconEye off={showPw} />
          </button>
        </div>
        {mode === "signup" && pw && (
          <div className="strength">
            <div className="bars">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`bar ${i < strength ? `s${strength}` : ""}`} />
              ))}
            </div>
            <span className="strength-label">{t.strength[strength]}</span>
          </div>
        )}
      </label>

      {mode === "signin" && (
        <label className="check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span className="box" style={{ "--accent": accent }}>{remember && <IconCheck />}</span>
          <span>{t.remember}</span>
        </label>
      )}

      <button type="submit" className="primary" disabled={submitting} style={{ background: accent }}>
        {submitting ? <span className="spinner" /> : (
          <>
            <span>{mode === "signup" ? t.create : t.signIn}</span>
            <IconArrow />
          </>
        )}
      </button>

      <div className="switch">
        {mode === "signup" ? (
          <>{t.alreadyHave}{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onSwitch("signin"); }} style={{ color: accent }}>
              {t.signIn2}
            </a>
          </>
        ) : (
          <>{t.newHere}{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onSwitch("signup"); }} style={{ color: accent }}>
              {t.create2}
            </a>
          </>
        )}
      </div>
    </form>
  );
};

// ----- tweaks UI -----
const TweaksUI = ({ tweaks, setTweak }) => {
  const { TweaksPanel, TweakSection, TweakSlider, TweakRadio, TweakToggle, TweakText, TweakColor } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Background animation">
        <TweakSlider label="Circle count" value={tweaks.density} min={4} max={40} step={1}
          onChange={(v) => setTweak("density", v)} />
        <TweakSlider label="Drift speed" value={tweaks.speed} min={0} max={3} step={0.1}
          onChange={(v) => setTweak("speed", v)} />
        <TweakRadio label="Palette" value={tweaks.palette}
          options={[
            { value: "blue", label: "Blue" },
            { value: "sky", label: "Sky" },
            { value: "deep", label: "Deep" },
          ]}
          onChange={(v) => setTweak("palette", v)} />
      </TweakSection>
      <TweakSection label="Layout">
        <TweakRadio label="Variant" value={tweaks.layout}
          options={[
            { value: "split", label: "Split" },
            { value: "flipped", label: "Flipped" },
            { value: "centered", label: "Centered" },
          ]}
          onChange={(v) => setTweak("layout", v)} />
        <TweakToggle label="Show logo mark" value={tweaks.showLogo}
          onChange={(v) => setTweak("showLogo", v)} />
      </TweakSection>
      <TweakSection label="Brand">
        <TweakText label="Brand name" value={tweaks.brand}
          onChange={(v) => setTweak("brand", v)} />
        <TweakColor label="Accent" value={tweaks.accent}
          onChange={(v) => setTweak("accent", v)} />
      </TweakSection>
    </TweaksPanel>
  );
};

// ----- language selector -----
const LanguageSelector = ({ lang, setLang }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const langs = [
    { code: "KA", label: "ქართული" },
    { code: "EN", label: "English" },
    { code: "RU", label: "Русский" },
  ];
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const current = langs.find((l) => l.code === lang) || langs[0];
  return (
    <div className="lang" ref={ref}>
      <button type="button" className="lang-btn" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <IconGlobe />
        <span className="lang-code">{current.code}</span>
        <IconChevron />
      </button>
      {open && (
        <ul className="lang-menu" role="listbox">
          {langs.map((l) => (
            <li key={l.code}>
              <button type="button" role="option" aria-selected={l.code === lang}
                className={`lang-item ${l.code === lang ? "is-active" : ""}`}
                onClick={() => { setLang(l.code); setOpen(false); }}>
                <span className="lang-item-code">{l.code}</span>
                <span className="lang-item-label">{l.label}</span>
                {l.code === lang && <span className="lang-item-check"><IconCheck /></span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ----- main app -----
const App = () => {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULS);
  const [mode, setMode] = useState("signin");
  const [lang, setLang] = useState("KA");
  const [page, setPage] = useState("login");
  const t = window.I18N[lang] || window.I18N.EN;
  const accent = tweaks.accent || "#1E48B8";

  // set <html lang> for accessibility / font-rendering hints
  useEffect(() => {
    document.documentElement.lang = lang.toLowerCase();
  }, [lang]);

  if (page === "dashboard" && window.Dashboard) {
    return (
      <>
        <div className="bg-host">
          <window.CirclesBackground
            density={tweaks.density}
            speed={tweaks.speed}
            palette={tweaks.palette}
          />
          <div className="bg-veil" />
        </div>
        <TweaksUI tweaks={tweaks} setTweak={setTweak} />
        <window.Dashboard
          t={t}
          lang={lang}
          setLang={setLang}
          accent={accent}
          brand={tweaks.brand}
          showLogo={tweaks.showLogo}
          onLogout={() => setPage("login")}
        />
      </>
    );
  }

  return (
    <div className={`page layout-${tweaks.layout} lang-${lang}`} style={{ "--accent": accent }}>
      <div className="bg-host">
        <window.CirclesBackground
          density={tweaks.density}
          speed={tweaks.speed}
          palette={tweaks.palette}
        />
        <div className="bg-veil" />
      </div>
      <TweaksUI tweaks={tweaks} setTweak={setTweak} />

      <header className="topbar">
        <div className="brand">
          {tweaks.showLogo && <Mark accent={accent} />}
          <span className="brand-name">{t.brandLocal || tweaks.brand}</span>
        </div>
        <nav className="nav">
          <a href="#">{t.nav.product}</a>
          <a href="#">{t.nav.customers}</a>
          <a href="#">{t.nav.pricing}</a>
          <a href="#">{t.nav.docs}</a>
        </nav>
        <div className="top-right">
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>
      </header>

      <main className="main">
        <section className="copy">
          <h1 className="hero">{t.headline}</h1>
          <p className="lede">{t.sub}</p>
        </section>

        <section className="card-host">
          <div className="card">
            <SignInForm
              accent={accent}
              onSwitch={setMode}
              mode={mode}
              t={t}
              onComplete={() => setPage("dashboard")}
            />
          </div>
          <div className="legal">
            {t.legalPre} <a href="#">{t.terms}</a> {t.legalAnd} <a href="#">{t.privacy}</a>.
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© 2026 {t.brandLocal || tweaks.brand}, {t.rights}</span>
        <span className="status">
          <span className="status-dot"></span>
          {t.operational}
        </span>
      </footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
