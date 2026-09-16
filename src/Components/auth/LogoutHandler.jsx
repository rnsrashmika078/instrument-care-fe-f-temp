import { useEffect } from "react";
import { HOME_BASE } from "../../config";
import { doFrontendLogout } from "./Logout";

// Clears the inst-care (JWT) session from sessionStorage and returns the
// browser to the instrument (CodeIgniter) app. This route is reached when a
// user logs out of instrument, so that BOTH systems are signed out.
export default function LogoutHandler() {
  useEffect(() => {
    doFrontendLogout();

    const params = new URLSearchParams(window.location.search);
    const requested = params.get("redirect");

    let target = `${HOME_BASE}/user_authentication/`;
    if (requested && requested.startsWith(HOME_BASE)) {
      target = requested;
    }

    window.location.replace(target);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <p className="text-[#6b7280] text-sm">Logging you out...</p>
    </div>
  );
}
