import React, { useEffect } from "react";
import { HOME_BASE } from "../../config";

// Full-page redirect to the CodeIgniter login at VITE_HOME_BASE.
//
// Needed because the React /auth/login route was removed: App.jsx's catch-all
// ("*") and ProtectedRoute both still target /auth/login, so without a real
// route there they would match "*" and bounce here forever.
export default function CiLoginRedirect() {
  useEffect(() => {
    window.location.replace(`${HOME_BASE}/user_authentication`);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-poppins">
      <p className="text-sm text-gray-600">Redirecting to sign in&hellip;</p>
    </div>
  );
}
