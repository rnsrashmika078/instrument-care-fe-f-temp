import { fetchWithAuth } from '../../Components/utils/api';
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Technician/Navbar'
import Admin_Sidebar from '../../Components/admin/Sidebar'
import AllTechnicianTable from '../../Components/admin/AdminAllTechnician';
import { TableCard, TableSkeleton } from '../../Components/admin/TableUI';
import Footer from '../../Components/Common/Footer'
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
        // Directly set the response since it contains only technicians
        setTechnicians(Array.isArray(data) ? data : []);
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
      <div className="flex w-full flex-col gap-4 bg-orange-50 p-2 md:h-full md:flex-row md:p-4">
        <Admin_Sidebar />

          <main className="min-w-0 flex-1 pt-14 md:pt-0">
          {loading ? (
            <TableCard>
              <TableSkeleton rows={8} columns={6} />
            </TableCard>
          ) : (
            <AllTechnicianTable usersData={technicians} />
          )}
        </main>
      </div>

      <Footer />
    </>
  )
}
