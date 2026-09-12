import { fetchWithAuth } from '../../Components/utils/api';
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Technician/Navbar'
import Admin_Sidebar from '../../Components/admin/Sidebar'
import AllTechnicianTable from '../../Components/admin/AdminAllTechnician';
import Footer from '../../Components/Common/Footer'
import BG from '../../assets/images/technician-dashboard-bg-4.jpg';
import { API_BASE } from '../../config';

export default function All_Technicians() {
  const token = sessionStorage.getItem("token");
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE}/admin/technicians`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        console.log(data)
        // Directly set the response since it contains only technicians
        setTechnicians(data);
      } catch (error) {
        console.error("Failed to fetch technicians:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-100">
        <Admin_Sidebar />

        <main className="flex-1 bg-[#ffffff80] rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">All Technicians</h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading technicians...</p>
          ) : (
            <AllTechnicianTable usersData={technicians} />
          )}
        </main>
      </div>

      <Footer />
    </>
  )
}
