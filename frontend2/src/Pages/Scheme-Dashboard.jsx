import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Scheme from "../Components/Schemes";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";

// Renders inside DashboardLayout's <Outlet /> — sidebar, header and footer
// all live there now so every page in the dashboard shares one shell
// instead of each page rebuilding it.
function SchemeDashboard() {
  const { t } = useLanguage();
  const [state, setState] = useState({ status: "loading", schemes: [], error: "" });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "loading" }));
    try {
      const data = await api.dashboard();
      setState({ status: "ready", schemes: data.schemes || [], error: "" });
    } catch (err) {
      setState({ status: "error", schemes: [], error: err.message || t("error") });
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="scheme-dashboard">

      <div className="dashboard-title">
        <h1>{t("recommended")}</h1>
        <p>{t("recommendedSub")}</p>
      </div>

      {state.status === "loading" && (
        <p className="scheme-list-empty">{t("loading")}</p>
      )}

      {state.status === "error" && (
        <p className="scheme-list-empty">
          {state.error} —{" "}
          <button type="button" className="switch-button" onClick={load}>Try again</button>
        </p>
      )}

      {state.status === "ready" && state.schemes.length === 0 && (
        <p className="scheme-list-empty">
          {t("noMatches")} <Link to="/dashboard/profile">{t("myProfile")}</Link>
        </p>
      )}

      {state.status === "ready" && state.schemes.length > 0 && (
        <div className="scheme-list">
          {state.schemes.map((scheme) => (
            <Scheme key={scheme.scheme_id} scheme={scheme} />
          ))}
        </div>
      )}

    </section>
  );
}

export default SchemeDashboard;
