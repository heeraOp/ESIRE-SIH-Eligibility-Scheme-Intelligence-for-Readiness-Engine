import "./Landup.css";
import { Link } from "react-router-dom";
import { LANGUAGE_OPTIONS, languageLabel } from "../Components/languages";
import { useLanguage } from "../i18n/LanguageContext";

const Landup = () => {
  const { t, language, setLanguage } = useLanguage();

  const navItems = [
    { name: t("home"), className: "home-nav", path: "/" },
    { name: t("schemes"), className: "schemes-nav", path: "/auth" },
    { name: t("about"), className: "about-nav", path: "#about" },
    { name: t("contact"), className: "contact-nav", path: "#contact" },
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <header className="header">
        <Link to="/" className="logo" aria-label="PAANGBA home">
          <span className="logo-mark">P</span>

          <span className="logo-text">
            <span className="logo-title">PAANGBA</span>
            <span className="logo-subtitle">{t("brandTag")}</span>
          </span>
        </Link>

        <nav className="navbar" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.className}
              to={item.path}
              className={item.className}
            >
              {item.name}
            </Link>
          ))}

          <select
            className="landing-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label={t("preferredLanguage")}
          >
            {LANGUAGE_OPTIONS.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>

          <Link to="/auth" className="login-nav">
            {t("login")}
            <span aria-hidden="true"> ↗</span>
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-badge">
                <span className="status-dot" />
                Scheme Intelligence & Readiness Engine
              </div>

              <h1>
                Government schemes,
                <br />
                <span>made simpler.</span>
              </h1>

              <p className="hero-description">
                {t("heroBody")}
              </p>

              <div className="hero-actions">
                <Link to="/auth" className="explore-btn">
                  {t("getStarted")}
                  <span aria-hidden="true"> →</span>
                </Link>

                <Link to="/auth" className="secondary-btn">
                  {t("findSchemes")}
                </Link>
              </div>

              <div className="hero-note">
                <span className="note-check">✓</span>
                <span>
                  Discover schemes. Understand eligibility. Take the next step.
                </span>
              </div>
            </div>

            {/* Decorative scheme discovery panel */}
            <div className="hero-visual" aria-label="Scheme discovery preview">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />

              <div className="visual-card">
                <div className="visual-card-top">
                  <div>
                    <span className="visual-eyebrow">YOUR NEXT STEP</span>
                    <h2>Find what fits you.</h2>
                  </div>

                  <div className="visual-icon" aria-hidden="true">
                    ✳
                  </div>
                </div>

                <div className="visual-search">
                  <span aria-hidden="true">⌕</span>
                  <span>Explore government schemes</span>
                  <span className="search-arrow" aria-hidden="true">
                    →
                  </span>
                </div>

                <div className="visual-divider" />

                <p className="visual-section-label">
                  YOUR JOURNEY STARTS HERE
                </p>

                <div className="visual-step">
                  <div className="step-icon step-blue" aria-hidden="true">
                    01
                  </div>
                  <div className="step-content">
                    <strong>Discover schemes</strong>
                    <span>Find relevant opportunities</span>
                  </div>
                  <span className="step-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>

                <div className="visual-step">
                  <div className="step-icon step-orange" aria-hidden="true">
                    02
                  </div>
                  <div className="step-content">
                    <strong>Check eligibility</strong>
                    <span>Understand the requirements</span>
                  </div>
                  <span className="step-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>

                <div className="visual-step">
                  <div className="step-icon step-green" aria-hidden="true">
                    03
                  </div>
                  <div className="step-content">
                    <strong>Get prepared</strong>
                    <span>Know what comes next</span>
                  </div>
                  <span className="step-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>

                <div className="visual-card-footer">
                  <span className="footer-sparkle">✦</span>
                  Information made easier for everyone.
                </div>
              </div>

              <div className="floating-tag floating-tag-top">
                <span className="floating-tag-icon">✓</span>
                <span>
                  <strong>Clear information</strong>
                  <small>Less confusion</small>
                </span>
              </div>

              <div className="floating-tag floating-tag-bottom">
                <span className="floating-tag-icon green-icon">↗</span>
                <span>
                  <strong>Your next opportunity</strong>
                  <small>Starts with discovery</small>
                </span>
              </div>
            </div>
          </div>

          <div className="hero-bottom-accent" />
        </section>

        {/* Features */}
        <section className="features" id="about">
          <div className="section-heading">
            <span className="section-eyebrow">HOW PAANGBA HELPS</span>

            <h2>
              The right information.
              <br />
              <span>Without the complexity.</span>
            </h2>

            <p>
              Navigate government schemes with more clarity and confidence.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-card-top">
                <span className="feature-number">01 / DISCOVER</span>
                <span className="feature-icon icon-blue" aria-hidden="true">
                  ⌕
                </span>
              </div>

              <h3>{t("findSchemes")}</h3>

              <p>{t("findSchemesBody")}</p>

              <Link to="/auth" className="feature-link">
                Explore schemes <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="feature-card featured-card">
              <div className="feature-card-top">
                <span className="feature-number">02 / UNDERSTAND</span>
                <span
                  className="feature-icon icon-orange"
                  aria-hidden="true"
                >
                  ✓
                </span>
              </div>

              <h3>{t("checkEligibility")}</h3>

              <p>{t("checkEligibilityBody")}</p>

              <Link to="/auth" className="feature-link">
                Check eligibility <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-card-top">
                <span className="feature-number">03 / ACCESS</span>
                <span className="feature-icon icon-green" aria-hidden="true">
                  ↗
                </span>
              </div>

              <h3>{t("simpleAccessible")}</h3>

              <p>{t("simpleAccessibleBody")}</p>

              <Link to="/auth" className="feature-link">
                Get started <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="cta-section" id="contact">
          <div className="cta-decoration cta-decoration-one" />
          <div className="cta-decoration cta-decoration-two" />

          <div className="cta-content">
            <span className="cta-eyebrow">YOUR JOURNEY STARTS HERE</span>

            <h2>
              A little clarity
              <br />
              can open new doors.
            </h2>

            <p>
              Start exploring government schemes and discover the information
              you need to move forward.
            </p>

            <Link to="/auth" className="cta-button">
              {t("getStarted")} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="cta-symbol" aria-hidden="true">
            P
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-mark">P</span>
              <span>PAANGBA</span>
            </Link>

            <p>{t("heroBody")}</p>

            <span className="footer-brand-tag">{t("brandTag")}</span>
          </div>

          <div className="footer-section">
            <h3>Explore</h3>
            <Link to="/">{t("home")}</Link>
            <Link to="/auth">{t("schemes")}</Link>
            <Link to="/auth">{t("findSchemes")}</Link>
            <Link to="/auth">{t("checkEligibility")}</Link>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <Link to="/dashboard/help">{t("help")}</Link>
            <Link to="#about">{t("about")}</Link>
            <Link to="#contact">{t("contact")}</Link>
          </div>

          <div className="footer-section">
            <h3>Information</h3>
            <a href="#privacy">{t("privacy")}</a>
            <a href="#terms">Terms of Use</a>
            <a href="#accessibility">Accessibility</a>
            <a href="#disclaimer">Disclaimer</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 PAANGBA. All rights reserved.</p>

          <div className="footer-bottom-right">
            <span className="footer-status-dot" />
            <span>{languageLabel(language)}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landup;