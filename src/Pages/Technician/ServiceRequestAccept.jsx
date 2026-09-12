import React, { useState, useEffect } from "react";
import { API_BASE } from "../../config";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Technician/Navbar";
import Sidebar from "../../Components/Technician/Sidebar";
import ServiceRequestTable_Request from "../../Components/Technician/ServiceRequestTable-Request";
import ServiceRequestDetails from "../../Components/Technician/ServiceRequestDetails";
import Footer from "../../Components/Common/Footer";
import ServiceRequestAccept from "../../Components/Technician/Service-Request-Accept";
import ServiceRequestSuccess from "../../Components/Technician/ServiceRequestSuccess";
import BG from "../../assets/images/technician-dashboard-bg-4.jpg";

export default function Accept_Service_Request() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailResponse, setEmailResponse] = useState(null);

  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const { request_id, email } = location.state || {};

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
          `${API_BASE}/user/service-request/${techId}`
        );

        if (!response.ok) throw new Error("Failed to fetch service requests");

        const data = await response.json();
        console.log("✅ Service Requests:", data);
        setRequestData(data);
      } catch (error) {
        console.error("Error fetching service requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleEmailSuccess = (responseData) => {
    console.log("🎉 Email success response received:", responseData);
    setEmailResponse(responseData);
    setShowSuccess(true);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-100">
        <Sidebar />

        <main className="flex-1 bg-[#ffffff80] rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Accept Service Request</h2>

          {!showSuccess ? (
            <ServiceRequestAccept
              initialFormData={{
                ownerEmail: email || "",
                subject: `Service Request #${request_id || ""} Accepted`,
                message:
                  "Dear Customer, your service request has been accepted and is now in progress.",
                request_id: request_id || null,
              }}
              onSend={handleEmailSuccess} 
            />
          ) : (
            <ServiceRequestSuccess
              onBack={() => setShowSuccess(false)}
              responseData={emailResponse} 
            />
          )}

          <br />
        </main>
      </div>

      <Footer />
    </>
  );
}
