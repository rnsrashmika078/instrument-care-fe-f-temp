export const doFrontendLogout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user_id");
  sessionStorage.removeItem("technician_id");
};