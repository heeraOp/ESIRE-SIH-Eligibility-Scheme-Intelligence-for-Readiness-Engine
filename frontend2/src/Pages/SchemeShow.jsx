import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";
import "./SchemeShow.css";

function SchemeShow() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [scheme, setScheme] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    api
      .scheme(id)
      .then((data) => {
        if (!cancelled) {
          setScheme(data);
          setStatus("ready");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || t("notFound"));
          setStatus("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, t]);

  async function handleApply() {
    setApplying(true);
    try {
      await api.apply(id);
      setScheme((prev) => (prev ? { ...prev, applied: true } : prev));
    } catch (err) {
      setError(err.message || t("error"));
    } finally {
      setApplying(false);
    }
  }

  if (status === "loading") {
    return (
      <section className="scheme-show scheme-show-empty">
        <p>{t("loading")}</p>
      </section>
    );
  }

  if (status === "error" || !scheme) {
    return (
      <section className="scheme-show scheme-show-empty">
        <p>{error || t("notFound")}</p>
        <Link to="/dashboard" className="back-link">{t("backDashboard")}</Link>
      </section>
    );
  }

  const scoreClass = scheme.final_score >= 75 ? "high" : "medium";
  const requirements = scheme.requirements?.length ? scheme.requirements : scheme.satisfied_conditions || [];

  return (
    <section className="scheme-show">

      <Link to="/dashboard" className="back-link">{t("backDashboard")}</Link>

      <div className="scheme-show-header">
        <div>
          <p className="scheme-show-department">{scheme.department}</p>
          <h1>
            {scheme.scheme_name}
            {scheme.applied && <span className="applied-badge">{t("applied")}</span>}
          </h1>
        </div>

        <div className={`dual-score large ${scoreClass}`}>
          {scheme.final_score}% {t("match")}
        </div>
      </div>

      <p className="scheme-show-description">{scheme.full_description || scheme.description}</p>

      {scheme.explanation && (
        <div className="scheme-show-card">
          <h2>{t("whyMatched")}</h2>
          <p>{scheme.explanation}</p>
        </div>
      )}

      <div className="scheme-show-grid">

        <div className="scheme-show-card">
          <h2>{t("eligibilityRequirements")}</h2>
          <ul>
            {requirements.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ul>
          {scheme.uncertain_conditions?.length > 0 && (
            <p className="signup-hint">
              {t("needsVerification")}: {scheme.uncertain_conditions.join(", ")}
            </p>
          )}
        </div>

        <div className="scheme-show-card">
          <h2>{t("benefits")}</h2>
          <ul>
            {(scheme.benefits || []).map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>

      </div>

      <div className="scheme-show-card">
        <h2>{t("documentsNeeded")}</h2>
        <ul className="documents-needed-list">
          {(scheme.required_documents || []).map((doc) => (
            <li key={doc}>
              {doc}
              {scheme.missing_documents?.includes(doc) ? ` — ${t("missing")}` : ""}
            </li>
          ))}
        </ul>
        <Link to="/dashboard/documents" className="documents-link">
          {t("trackDocuments")}
        </Link>
      </div>

      <div className="scheme-show-footer">
        <span className="scheme-deadline">{t("deadline")}: {scheme.deadline || "Open all year"}</span>

        <button
          type="button"
          className={`scheme-apply-btn${scheme.applied ? " applied" : ""}`}
          onClick={handleApply}
          disabled={scheme.applied || applying}
        >
          {scheme.applied ? t("alreadyApplied") : applying ? "…" : t("applyNow")}
        </button>
      </div>

    </section>
  );
}

export default SchemeShow;
