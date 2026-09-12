import React, { useState, useEffect } from "react";
import { API_BASE } from "../../config";
import Navbar from '../../Components/Technician/Navbar';
import Sidebar from '../../Components/Technician/Sidebar';
import ServiceRequestTable_Request from "../../Components/Technician/ServiceRequestTable-Request";
import ServiceRequestDetails from "../../Components/Technician/ServiceRequestDetails";
import Footer from '../../Components/Common/Footer';
import BG from '../../assets/images/technician-dashboard-bg-4.jpg';

export default function Service_Request() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const techId = sessionStorage.getItem("technician_id");
        if (!techId) {
          console.error("Technician ID not found in sessionStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE}/user/service-request/${techId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch service requests");
        }

        const data = await response.json();
        console.log(data);
        setRequestData(data); // Assuming backend returns an array
      } catch (error) {
        console.error("Error fetching service requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <>
      <Navbar />

      {/* Background Image Wrapper */}
      <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-[#ffffff80] rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Service Request</h2>

          {loading ? (
            <p>Loading service requests...</p>
          ) : (
            <ServiceRequestTable_Request
              data={requestData}
              onView={setSelectedRequest}
            />
          )}

          <ServiceRequestDetails details={selectedRequest} />
        </main>
      </div>

      <Footer />
    </>
  );
}
