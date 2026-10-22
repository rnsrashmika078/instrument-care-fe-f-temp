const STORAGE_KEY = "tech_profile_completion";
const EVENT_NAME = "tech-profile-completion";

export function publishProfileCompletion(percent) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));

  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Storage can be unavailable (private mode / quota). The badge is
    // decorative, so a failure here must not break the profile page.
  }

  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { percent: value } }));
}

export function readProfileCompletion() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed)
      ? Math.max(0, Math.min(100, Math.round(parsed)))
      : null;
  } catch {
    return null;
  }
}

export function onProfileCompletion(handler) {
  const listener = (e) => handler(e.detail?.percent ?? null);
  window.addEventListener(EVENT_NAME, listener);

  // Keep other tabs in sync.
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) handler(readProfileCompletion());
  };
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(EVENT_NAME, listener);
    window.removeEventListener("storage", onStorage);
  };
}