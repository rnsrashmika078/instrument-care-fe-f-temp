import { fetchWithAuth } from '../../Components/utils/api';
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Technician/Navbar'
import Admin_Sidebar from '../../Components/admin/Sidebar'
import AllInstrument from '../../Components/admin/AdminAllInstrument';
import { TableCard, TableSkeleton } from '../../Components/admin/TableUI';
import Footer from '../../Components/Common/Footer';
import { API_BASE } from '../../config';

export default function All_Instruments() {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE}/admin/instruments`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setInstruments(result.data);
        } else {
          console.error('Failed to fetch instruments:', result);
        }
      } catch (error) {
        console.error('Error fetching instruments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, [token]);

  return (
    <>
      <Navbar />

      <div className="flex w-full flex-col gap-4 bg-orange-50 p-2 md:h-full md:flex-row md:p-4">
        <Admin_Sidebar />

          <main className="min-w-0 flex-1 pt-14 md:pt-0">
          {loading ? (
            <TableCard>
              <TableSkeleton rows={8} columns={5} />
            </TableCard>
          ) : (
            <AllInstrument instrumentsData={instruments} />
          )}
        </main>
      </div>

      <Footer />
    </>
  )
}
