import "./Landup.css";
import { Link } from "react-router-dom";
import { LANGUAGE_OPTIONS, languageLabel } from "../Components/languages";
import { useLanguage } from "../i18n/LanguageContext";

const Landup = () => {
  const { t, language, setLanguage } = useLanguage();

  const navItems = [
    { name: t("home"), className: "home-nav", path: "/" },
    { name: t("schemes"), className: "schemes-nav", path: "/auth" },
    { name: t("about"), className: "about-nav", path: "#" },
    { name: t("contact"), className: "contact-nav", path: "#" },
  ];

  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">
          <h1>ESIRE</h1>
          <p>{t("brandTag")}</p>
        </div>

        <nav className="navbar">
          {navItems.map((item) => (
            <Link key={item.className} to={item.path} className={item.className}>
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
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>ESIRE</h1>
          <span>{t("governmentSchemes")}</span>
          <p>
            {t("heroBody")}
          </p>
          <Link to="/auth" className="explore-btn">
            {t("getStarted")}
          </Link>
        </section>

        <section className="features">
          <div className="feature-card">
            <h2>{t("findSchemes")}</h2>
            <p>{t("findSchemesBody")}</p>
          </div>
          <div className="feature-card">
            <h2>{t("checkEligibility")}</h2>
            <p>{t("checkEligibilityBody")}</p>
          </div>
          <div className="feature-card">
            <h2>{t("simpleAccessible")}</h2>
            <p>{t("simpleAccessibleBody")}</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>ESIRE</h2>
            <p>{t("heroBody")}</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <a href="/">{t("home")}</a>
            <a href="/auth">{t("schemes")}</a>
            <a href="#">{t("about")}</a>
            <a href="#">{t("contact")}</a>
          </div>
          <div className="footer-section">
            <h3>Services</h3>
            <a href="/auth">{t("findSchemes")}</a>
            <a href="/auth">{t("checkEligibility")}</a>
            <a href="/dashboard/help">{t("help")}</a>
          </div>
          <div className="footer-section">
            <h3>Important</h3>
            <a href="#">{t("privacy")}</a>
            <a href="#">Terms of Use</a>
            <a href="#">Accessibility</a>
            <a href="#">Disclaimer</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 SIH. All Rights Reserved.</p>
          <p>{languageLabel(language)}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landup;