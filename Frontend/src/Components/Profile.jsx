import { useEffect, useState } from "react";
import { api } from "../api/client";
import { LANGUAGE_OPTIONS } from "./languages";
import { useLanguage } from "../i18n/LanguageContext";
import "./Profile.css";

const OCCUPATION_TYPES = [
  { value: "", label: "Prefer not to say" },
  { value: "farmer", label: "Farmer" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "self_employed", label: "Self-employed" },
  { value: "student", label: "Student" },
  { value: "salaried", label: "Salaried" },
  { value: "unemployed", label: "Unemployed" },
  { value: "small_business", label: "Small business owner" },
  { value: "micro_enterprise", label: "Micro enterprise owner" },
];

const CATEGORIES = [
  { value: "", label: "Prefer not to say" },
  { value: "general", label: "General" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "obc", label: "OBC" },
  { value: "ews", label: "EWS" },
  { value: "pwd", label: "Person with Disability" },
  { value: "minority", label: "Minority" },
];

const GENDERS = [
  { value: "", label: "Prefer not to say" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
];

const EMPTY_FORM = {
  name: "",
  language: "en",
  about_text: "",
  age: "",
  gender: "",
  state: "",
  district: "",
  occupation: "",
  occupation_type: "",
  annual_income: "",
  category: "",
  is_entrepreneur: false,
  has_existing_business: false,
  has_land: false,
};

function toForm(me) {
  const profile = me.profile || {};
  return {
    ...EMPTY_FORM,
    name: me.name || "",
    language: me.language || "en",
    about_text: profile.about_text || "",
    age: profile.age ?? "",
    gender: profile.gender || "",
    state: profile.state || "",
    district: profile.district || "",
    occupation: profile.occupation || "",
    occupation_type: profile.occupation_type || "",
    annual_income: profile.annual_income ?? "",
    category: profile.category || "",
    is_entrepreneur: Boolean(profile.is_entrepreneur),
    has_existing_business: Boolean(profile.has_existing_business),
    has_land: Boolean(profile.has_land),
  };
}

const Profile = () => {
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("loading");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .me()
      .then((me) => {
        if (cancelled) return;
        setPhone(me.phone || "");
        setForm(toForm(me));
        setStatus("ready");
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || t("error"));
          setStatus("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        ...form,
        age: form.age === "" ? null : Number(form.age),
        annual_income: form.annual_income === "" ? null : Number(form.annual_income),
        gender: form.gender || null,
        state: form.state || null,
        district: form.district || null,
        occupation: form.occupation || null,
        occupation_type: form.occupation_type || null,
        category: form.category || null,
      };
      await api.updateProfile(body);
      setSaved(true);
    } catch (err) {
      setError(err.message || t("error"));
    } finally {
      setSaving(false);
    }
  }

  const initial = form.name ? form.name.trim().charAt(0).toUpperCase() : "?";

  if (status === "loading") {
    return (
      <section className="profile-page">
        <p className="scheme-list-empty">{t("loading")}</p>
      </section>
    );
  }

  return (
    <section className="profile-page">

      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-avatar-lg">{initial}</div>
          <div>
            <h2>{form.name || t("yourProfile")}</h2>
            <p>{t("keepDetails")}</p>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="profile-name">{t("fullName")}</label>
            <input id="profile-name" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="profile-phone">Mobile number</label>
            <div className="phone-input">
              <span className="phone-prefix">+91</span>
              <input id="profile-phone" value={phone} disabled readOnly />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="profile-language">{t("preferredLanguage")}</label>
            <select id="profile-language" name="language" value={form.language} onChange={handleChange}>
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>

          <p className="profile-section-title">Location</p>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="profile-state">{t("state")}</label>
              <input id="profile-state" name="state" value={form.state} onChange={handleChange} placeholder="e.g. Meghalaya" />
            </div>
            <div className="form-group">
              <label htmlFor="profile-district">District</label>
              <input id="profile-district" name="district" value={form.district} onChange={handleChange} placeholder="e.g. East Khasi Hills" />
            </div>
          </div>

          <p className="profile-section-title">About you</p>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="profile-age">{t("age")}</label>
              <input id="profile-age" name="age" type="number" min="1" max="120" value={form.age} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="profile-gender">{t("gender")}</label>
              <select id="profile-gender" name="gender" value={form.gender} onChange={handleChange}>
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="profile-category">{t("category")}</label>
            <select id="profile-category" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <p className="profile-section-title">Work &amp; income</p>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="profile-occupation-type">{t("occupationType")}</label>
              <select id="profile-occupation-type" name="occupation_type" value={form.occupation_type} onChange={handleChange}>
                {OCCUPATION_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="profile-occupation">Occupation</label>
              <input id="profile-occupation" name="occupation" value={form.occupation} onChange={handleChange} placeholder="e.g. Tailoring business" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="profile-income">{t("annualIncome")}</label>
            <input id="profile-income" name="annual_income" type="number" min="0" value={form.annual_income} onChange={handleChange} />
          </div>
          <label className="form-checkbox">
            <input type="checkbox" name="has_land" checked={form.has_land} onChange={handleChange} />
            {t("hasLand")}
          </label>

          <p className="profile-section-title">Tell us more (optional)</p>
          <div className="form-group">
            <label htmlFor="profile-about">Describe your situation</label>
            <textarea
              id="profile-about"
              name="about_text"
              value={form.about_text}
              onChange={handleChange}
              placeholder="e.g. I run a small tailoring business from home and want to expand it..."
            />
            <p className="signup-hint">
              We use this to fill in details you haven't entered above — nothing here overrides fields you set yourself.
            </p>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="profile-form-actions">
            <button type="submit" className="profile-save" disabled={saving}>
              {saving ? "…" : t("saveChanges")}
            </button>
            {saved && <span className="profile-saved-note">{t("saved")}</span>}
          </div>

        </form>
      </div>

    </section>
  );
};

export default Profile;
