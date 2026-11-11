import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LANGUAGE_OPTIONS } from "../../Components/languages";
import { useAuth } from "../../auth/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Signup.css";

const TOTAL_STEPS = 3;

function Signup({ onSwitchToLogin }) {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    language,
    name: "",
    aboutText: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData((prev) => ({ ...prev, phone: value.replace(/\D/g, "").slice(0, 10) }));
      return;
    }
    if (name === "language") setLanguage(value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const goNext = (e) => {
    e.preventDefault();
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signup({
        phone: formData.phone,
        name: formData.name,
        language: formData.language,
        about_text: formData.aboutText,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const step1Valid = formData.phone.length === 10 && formData.language !== "";
  const step2Valid = formData.name.trim().length > 0;
  const step3Valid = formData.aboutText.trim().length > 0;

  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="signup-line"></div>
        <div className="signup-content">
          <div className="signup-brand">
            <h1>PAANGBA</h1>
            <p>{t("governmentSchemes")}</p>
          </div>
          <div className="signup-progress">
            <span className="signup-step-label">Step {step} of {TOTAL_STEPS}</span>
            <div className="progress-track">
              <div className={`progress-segment${step >= 1 ? " filled" : ""}`} />
              <div className={`progress-segment${step >= 2 ? " filled" : ""}`} />
              <div className={`progress-segment${step >= 3 ? " filled" : ""}`} />
            </div>
          </div>

          {step === 1 && (
            <>
              <div className="signup-heading">
                <h2>{t("letsGetStarted")}</h2>
                <p>{t("mobileAndLanguage")}</p>
              </div>
              <form className="signup-form" onSubmit={goNext}>
                <div className="form-group">
                  <label htmlFor="phone">{t("mobileNumber")}</label>
                  <div className="phone-input">
                    <span className="phone-prefix">+91</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      inputMode="numeric"
                      autoComplete="tel"
                      autoFocus
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="language">{t("preferredLanguage")}</label>
                  <select id="language" name="language" value={formData.language} onChange={handleChange} required>
                    {LANGUAGE_OPTIONS.map((item) => (
                      <option key={item.code} value={item.code}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="signup-submit" disabled={!step1Valid}>{t("continue")}</button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="signup-heading">
                <h2>{t("whatShouldWeCallYou")}</h2>
                <p>{t("fullName")}</p>
              </div>
              <form className="signup-form" onSubmit={goNext}>
                <div className="form-group">
                  <label htmlFor="name">{t("fullName")}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    autoFocus
                    required
                  />
                </div>
                <div className="signup-step-actions">
                  <button type="button" className="signup-back" onClick={() => setStep((s) => s - 1)}>{t("back")}</button>
                  <button type="submit" className="signup-submit" disabled={!step2Valid}>{t("continue")}</button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <div className="signup-heading">
                <h2>{t("tellUsAboutYourself")}</h2>
                <p>{t("describeSituation")}</p>
              </div>
              <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="aboutText">{t("aboutYou")}</label>
                  <textarea
                    id="aboutText"
                    name="aboutText"
                    placeholder="e.g. I run a small tailoring business from home in Jaipur and want to expand it..."
                    value={formData.aboutText}
                    onChange={handleChange}
                    rows={5}
                    autoFocus
                  />
                  <p className="signup-hint">{t("aboutHint")}</p>
                </div>
                {error && <p className="auth-error">{error}</p>}
                <div className="signup-step-actions">
                  <button type="button" className="signup-back" onClick={() => setStep((s) => s - 1)}>{t("back")}</button>
                  <button type="submit" className="signup-submit" disabled={!step3Valid || busy}>{t("createAccountCta")}</button>
                </div>
              </form>
            </>
          )}

          <div className="signup-switch">
            <span>{t("alreadyAccount")}</span>
            <button type="button" onClick={onSwitchToLogin} className="switch-button">{t("signIn")}</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Signup;
