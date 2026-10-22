import { fetchWithAuth } from '../../Components/utils/api';
import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Technician/Navbar';
import Admin_Sidebar from '../../Components/admin/Sidebar';
import AdminAllServiceRequest from '../../Components/admin/AdminAllServiceRequest';
import { TableCard, TableSkeleton } from '../../Components/admin/TableUI';
import Footer from '../../Components/Common/Footer';
import { API_BASE } from '../../config';

export default function All_Service_Requests() {
  const [requestsData, setRequestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_BASE}/admin/service-requests`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch service requests');
        }

        const data = await response.json();

        let mappedData = [];
        if (Array.isArray(data)) {
          mappedData = data.map((req) => ({
            ...req,
            requesterName: req.full_name || "N/A",
            instrument: req.instrument_name || "N/A",
            requestedOn: req.created_at ? req.created_at.split(' ')[0] : "N/A",
            technicianName: req.first_name ? `${req.first_name} ${req.last_name || ''}`.trim() : "Unassigned",
          }));
        }

        setRequestsData(mappedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

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
            <AdminAllServiceRequest requestsData={requestsData} />
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
