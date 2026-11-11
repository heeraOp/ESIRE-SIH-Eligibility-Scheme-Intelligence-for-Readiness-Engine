import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Login.css";

const RESEND_SECONDS = 30;

function Login({ onSwitchToSignup }) {
  const navigate = useNavigate();
  const { requestOtp, verifyOtp } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step !== "otp" || timer === 0) return;
    const id = setInterval(() => setTimer((t0) => t0 - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
  };

  const send = async () => {
    setBusy(true);
    setError("");
    try {
      await requestOtp(phone);
      setOtp(["", "", "", "", "", ""]);
      setTimer(RESEND_SECONDS);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    send();
  };

  const handleResend = () => {
    if (timer > 0) return;
    send();
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await verifyOtp(phone, otp.join(""));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const otpComplete = otp.every((digit) => digit !== "");

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-line"></div>
        <div className="auth-content">
          <div className="auth-brand">
            <h1>PAANGBA</h1>
            <p>{t("governmentSchemes")}</p>
          </div>

          {step === "phone" ? (
            <>
              <div className="auth-heading">
                <h2>{t("welcomeBack")}</h2>
                <p>{t("signInMobile")}</p>
              </div>
              <form className="auth-form" onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label htmlFor="phone">{t("mobileNumber")}</label>
                  <div className="phone-input">
                    <span className="phone-prefix">+91</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={handlePhoneChange}
                      inputMode="numeric"
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="auth-submit" disabled={phone.length !== 10 || busy}>
                  {t("sendOtp")}
                </button>
                <p className="signup-hint">{t("otpDevHint")}</p>
              </form>
            </>
          ) : (
            <>
              <div className="auth-heading">
                <h2>{t("enterOtp")}</h2>
                <p>{t("otpSentTo")} {phone}</p>
              </div>
              <form className="auth-form" onSubmit={handleVerify}>
                <div className="form-group">
                  <label>One-time password</label>
                  <div className="otp-inputs">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="otp-box"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        ref={(el) => (otpRefs.current[index] = el)}
                        aria-label={`OTP digit ${index + 1}`}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="auth-submit" disabled={!otpComplete || busy}>
                  {t("verifyLogin")}
                </button>
              </form>
              <div className="otp-actions">
                <button type="button" className="switch-button" onClick={() => setStep("phone")}>
                  {t("changeNumber")}
                </button>
                <button type="button" className="switch-button" onClick={handleResend} disabled={timer > 0}>
                  {timer > 0 ? `${t("resendIn")} ${timer}s` : t("resendOtp")}
                </button>
              </div>
            </>
          )}

          <div className="auth-switch">
            <span>{t("noAccount")}</span>
            <button type="button" onClick={onSwitchToSignup} className="switch-button">
              {t("createAccount")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
