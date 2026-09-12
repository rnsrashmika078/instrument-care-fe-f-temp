import { fetchWithAuth } from '../../Components/utils/api';
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Technician/Navbar";
import Admin_Sidebar from "../../Components/admin/Sidebar";
import AllOwnerTable from "../../Components/admin/AdminAllOwners";
import Footer from "../../Components/Common/Footer";
import BG from "../../assets/images/technician-dashboard-bg-4.jpg";
import { API_BASE } from "../../config";


export default function All_Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch Users From Backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_BASE}/admin/users`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        // ✅ KEEP FULL RAW USER + ADD FORMATTED FIELDS
        const formattedUsers = data.map((user) => ({
          ...user, // ✅ VERY IMPORTANT

          fullName: `${user.first_name} ${user.last_name}`,
          contact: user.mobile_number,
          role: user.user_type_id === 1 ? "Admin" : "User",
          createdAt: user.created || "N/A",
          active: user.user_status === 1,
          bio: user.designation || "N/A",
        }));

        setUsers(formattedUsers);
        setLoading(false);
      } catch (err) {
        console.error("Error loading users:", err);
        setError("Failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />

      {/* Background Image Wrapper */}
      <div
        className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG})` }}
      >
        {/* Sidebar */}
        <Admin_Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-[#ffffff80] rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">All Users</h2>

          {/* ✅ Loading State */}
          {loading && <p className="text-center">Loading users...</p>}

          {/* ✅ Error State */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* ✅ Data Table */}
          {!loading && !error && <AllOwnerTable usersData={users} />}
        </main>
      </div>

      <Footer />
    </>
  );
}
