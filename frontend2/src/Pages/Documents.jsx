import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";
import "./Documents.css";

const READY_STATUSES = new Set(["uploaded", "extracted", "verified"]);

function Documents() {
  const { t } = useLanguage();
  const [docs, setDocs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const fileInputs = useRef({});

  function load() {
    setStatus("loading");
    api
      .documents()
      .then((data) => {
        setDocs(data.documents || []);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message || t("error"));
        setStatus("error");
      });
  }

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleUploaded(doc) {
    setBusyId(doc.id);
    try {
      const ready = READY_STATUSES.has(doc.status);
      await api.setDocumentStatus(doc.id, ready ? "missing" : "uploaded");
      load();
    } catch (err) {
      setError(err.message || t("error"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleFileSelected(doc, file) {
    if (!file) return;
    setBusyId(doc.id);
    try {
      await api.uploadDocument(doc.id, file);
      load();
    } catch (err) {
      setError(err.message || t("error"));
    } finally {
      setBusyId(null);
    }
  }

  const uploadedCount = docs.filter((doc) => READY_STATUSES.has(doc.status)).length;

  return (
    <section className="documents-page">

      <div className="dashboard-title">
        <h1>{t("documents")}</h1>
        <p>{status === "ready" ? `${uploadedCount} / ${docs.length} ${t("ofReady")}` : t("loading")}</p>
      </div>

      {error && <p className="scheme-list-empty">{error}</p>}

      {status === "loading" && <p className="scheme-list-empty">{t("loading")}</p>}

      {status === "ready" && docs.length === 0 && (
        <p className="scheme-list-empty">No documents are required for your current matches yet.</p>
      )}

      {status === "ready" && docs.length > 0 && (
        <div className="documents-list">
          {docs.map((doc) => {
            const isReady = READY_STATUSES.has(doc.status);
            const isBusy = busyId === doc.id;

            return (
              <div className="document-row" key={doc.id}>
                <div className="document-icon">▣</div>

                <div className="document-info">
                  <h3>{doc.name}</h3>
                  <p>{doc.note || (doc.original_name ? `Uploaded: ${doc.original_name}` : "")}</p>
                </div>

                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={(el) => {
                    fileInputs.current[doc.id] = el;
                  }}
                  onChange={(e) => handleFileSelected(doc, e.target.files?.[0])}
                />

                <div className="document-actions">
                  <button
                    type="button"
                    className="document-status"
                    onClick={() => fileInputs.current[doc.id]?.click()}
                    disabled={isBusy}
                  >
                    Upload file
                  </button>

                  <button
                    type="button"
                    className={`document-status${isReady ? " done" : ""}`}
                    onClick={() => toggleUploaded(doc)}
                    disabled={isBusy}
                  >
                    {isReady ? t("uploaded") : t("markUploaded")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}

export default Documents;
