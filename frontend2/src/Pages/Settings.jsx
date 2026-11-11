import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LANGUAGE_OPTIONS } from "../Components/languages";
import { useLanguage } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api/client";
import "./Settings.css";

function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [pendingLanguage, setPendingLanguage] = useState(language);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  function handleLanguageChange(e) {
    setPendingLanguage(e.target.value);
    setSaved(false);
  }

  async function handleSave() {
    setError("");
    setLanguage(pendingLanguage);
    try {
      await api.updateLanguage(pendingLanguage);
      setSaved(true);
    } catch (err) {
      setError(err.message || t("error"));
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteAccount();
      navigate("/");
    } catch (err) {
      setDeleteError(err.message || t("error"));
      setDeleting(false);
    }
  }

  return (
    <section className="settings-page">

      <div className="dashboard-title">
        <h1>{t("settings")}</h1>
        <p>{t("languageAndAlerts")}</p>
      </div>

      <div className="settings-card">

        <div className="settings-row">
          <div>
            <h3>{t("preferredLanguage")}</h3>
            <p>{t("languageUsed")}</p>
          </div>
          <select value={pendingLanguage} onChange={handleLanguageChange} className="settings-select">
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>

        <div className="settings-row">
          <div>
            <h3>{t("emailAlerts")}</h3>
            <p>New scheme matches and application updates.</p>
          </div>
          <button
            type="button"
            className={`settings-toggle${emailAlerts ? " on" : ""}`}
            onClick={() => { setEmailAlerts((v) => !v); setSaved(false); }}
            aria-pressed={emailAlerts}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        <div className="settings-row">
          <div>
            <h3>{t("smsAlerts")}</h3>
            <p>Deadline reminders for schemes you've applied to.</p>
          </div>
          <button
            type="button"
            className={`settings-toggle${smsAlerts ? " on" : ""}`}
            onClick={() => { setSmsAlerts((v) => !v); setSaved(false); }}
            aria-pressed={smsAlerts}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        <div className="settings-actions">
          <button type="button" className="settings-save" onClick={handleSave}>
            {t("saveChanges")}
          </button>
          {saved && <span className="settings-saved-note">{t("saved")}</span>}
          {error && <span className="settings-saved-note" style={{ color: "#b3261e" }}>{error}</span>}
        </div>

      </div>

      <div className="settings-danger-card">
        <h3>Delete account</h3>
        <p>
          This permanently deletes your account, profile, uploaded documents, and match history.
          This cannot be undone.
        </p>

        {!confirmingDelete ? (
          <button type="button" className="settings-delete-btn" onClick={() => setConfirmingDelete(true)}>
            Delete Account
          </button>
        ) : (
          <div className="settings-delete-confirm">
            <span>Are you sure? This can't be undone.</span>
            <button
              type="button"
              className="settings-delete-confirm-btn"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Yes, delete my account"}
            </button>
            <button type="button" className="switch-button" onClick={() => setConfirmingDelete(false)} disabled={deleting}>
              Cancel
            </button>
          </div>
        )}
        {deleteError && <p style={{ color: "#b3261e", fontSize: 13, marginTop: 12 }}>{deleteError}</p>}
      </div>

    </section>
  );
}

export default Settings;
