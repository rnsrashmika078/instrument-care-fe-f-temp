import { toast } from "react-toastify";
import { API_BASE } from "../../config";

export const assetUrl = (path) => {
  if (!path) return null;
  if (/^(https?:)?\/\//i.test(path)) return path;
  return `${API_BASE}/public/${path.replace(/^\/+/, "")}`;
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = sessionStorage.getItem("token");

  // Automatically attach the Bearer token to headers
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  // Catch the expired session globally
  if (response.status === 401) {
    sessionStorage.clear();
    toast.error("Session expired. Please log in again.");
    window.location.href = "/auth/login";
    return null;
  }

  return response;
};
