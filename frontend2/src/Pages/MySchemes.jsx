import { useEffect, useState } from "react";
import Scheme from "../Components/Schemes";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";

function MySchemes() {
  const { t } = useLanguage();
  const [state, setState] = useState({ status: "loading", schemes: [], error: "" });

  useEffect(() => {
    let cancelled = false;
    api
      .mySchemes()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", schemes: data.schemes || [], error: "" });
      })
      .catch((err) => {
        if (!cancelled) setState({ status: "error", schemes: [], error: err.message || t("error") });
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  return (
    <section className="scheme-dashboard">

      <div className="dashboard-title">
        <h1>{t("mySchemes")}</h1>
        <p>{t("mySchemesSub")}</p>
      </div>

      {state.status === "loading" && <p className="scheme-list-empty">{t("loading")}</p>}

      {state.status === "error" && <p className="scheme-list-empty">{state.error}</p>}

      {state.status === "ready" && state.schemes.length === 0 && (
        <p className="scheme-list-empty">
          {t("noApplied")}
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

export default MySchemes;
