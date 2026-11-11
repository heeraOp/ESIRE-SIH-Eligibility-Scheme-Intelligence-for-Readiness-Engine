import "./Help.css";

const FAQS = [
  {
    q: "How does PAANGBA match me to schemes?",
    a: "We compare the details in your profile against each scheme's eligibility criteria to calculate a match score, shown on every scheme card.",
  },
  {
    q: "Do I need to upload documents before applying?",
    a: "Most schemes require identity and income proof. Track what's ready on the Documents page before you start an application.",
  },
  {
    q: "Can I apply to more than one scheme?",
    a: "Yes — there's no limit. Apply to every scheme you're eligible for and track them all from My Schemes.",
  },
  {
    q: "How do I change my preferred language?",
    a: "Use the language switcher in the header, or update it anytime from Settings.",
  },
];

// Placeholder contact details — swap for real support channels before launch.
function Help() {
  return (
    <section className="help-page">

      <div className="dashboard-title">
        <h1>Help</h1>
        <p>Answers and ways to reach us</p>
      </div>

      <div className="faq-list">
        {FAQS.map((item) => (
          <div className="faq-item" key={item.q}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>

      <div className="contact-card">
        <h3>Still need help?</h3>
        <p>Reach our support team and we'll get back to you.</p>
        <div className="contact-methods">
          <span>support@esire.app</span>
          <span>+91 1800-XXX-XXX</span>
        </div>
      </div>

    </section>
  );
}

export default Help;
