import { useState, useEffect, useCallback } from "react";
import { HOME_BASE } from "../../config";

export const useAuthUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${HOME_BASE}/auth_api/me`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
};

// Usage in component
// const UserProfile = () => {
//   const { user, loading, error, refetch } = useAuthUser();

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h1>
//         Welcome, {user?.first_name} {user?.last_name}
//       </h1>
//       <button onClick={refetch}>Refresh</button>
//     </div>
//   );
// };
