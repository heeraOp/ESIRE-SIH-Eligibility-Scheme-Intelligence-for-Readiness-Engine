// Frontend-only placeholder for a real backend. saveAccount() merges into
// whatever's already stored, so the header's quick language switch, Signup,
// and the Profile page can each update their own piece without wiping out
// the others.

const ACCOUNT_KEY = "esire_account";

export function saveAccount(data) {
  const merged = { ...(loadAccount() || {}), ...data };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(merged));
  return merged;
}

export function loadAccount() {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAccount() {
  localStorage.removeItem(ACCOUNT_KEY);
}
