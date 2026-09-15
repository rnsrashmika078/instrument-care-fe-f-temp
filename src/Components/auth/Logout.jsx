import { HOME_BASE } from "../../config";

export const doFrontendLogout = () => {
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user_id");
  sessionStorage.removeItem("technician_id");
};

// Fully logs the user out of BOTH systems:
// 1. Destroys the instrument (CodeIgniter) PHP session.
// 2. Clears the inst-care (JWT) session from sessionStorage.
// 3. Returns to the instrument home page.
export const doFullLogout = async () => {
  try {
    // Destroy the CodeIgniter session. credentials:'include' is required so the
    // ci_session cookie is sent (localhost host is shared across the two ports).
    await fetch(`${HOME_BASE}/auth_api/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    // Even if the backend call fails, still clear the frontend session.
  }
  doFrontendLogout();
  window.location.href = HOME_BASE;
};