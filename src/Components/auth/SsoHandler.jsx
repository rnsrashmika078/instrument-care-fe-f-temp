import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid token");
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function getDashboardPath(role) {
  const r = Number(role);
  if (r === 1) return "/admin/dashboard";
  if (r === 10) return "/tech/dashboard";
  return "/user/dashboard";
}

// The instrument (CodeIgniter) side can ask for a specific portal page after the
// handshake - e.g. the public "Hire Technician" button linking straight to
// /user/view-profile/:id. Only owner routes are honoured, and only with
// id-ish segments, so a crafted value cannot redirect off the portal.
function getRequestedPath(rawTarget) {
  if (!rawTarget) return null;

  const target = `/${String(rawTarget).replace(/^\/+/, "")}`;

  return /^\/user(?:\/[A-Za-z0-9_-]+)*$/.test(target) ? target : null;
}

export default function SsoHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    // Grab the target before the query string is rewritten below.
    const requestedPath = getRequestedPath(searchParams.get("redirect"));

    // Clean the token out of the URL as soon as possible.
    window.history.replaceState({}, document.title, window.location.pathname);

    if (!token) {
      navigate("/auth/login", { replace: true });
      return;
    }

    const payload = decodeJwt(token);
    if (!payload || typeof payload.sub === "undefined" || typeof payload.role === "undefined") {
      navigate("/auth/login", { replace: true });
      return;
    }

    const role = String(payload.role);
    const userId = String(payload.sub);

    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("user_id", userId);
    if (payload.technician_id) {
      sessionStorage.setItem("technician_id", String(payload.technician_id));
    }
    sessionStorage.setItem("token", token);

    navigate(requestedPath || getDashboardPath(role), { replace: true });
  }, [navigate, searchParams]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <p className="text-[#6b7280] text-sm">Redirecting to your dashboard...</p>
    </div>
  );
}