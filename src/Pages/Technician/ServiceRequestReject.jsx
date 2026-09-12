import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from '../../Components/Technician/Navbar';
import Sidebar from '../../Components/Technician/Sidebar';
import ServiceRequestTable_Request from "../../Components/Technician/ServiceRequestTable-Request";
import Footer from '../../Components/Common/Footer';
import ServiceRequestAccept from '../../Components/Technician/Service-Request-Accept';
import ServiceRequestReject from '../../Components/Technician/Service-Request-Reject';
import ServiceRequestRejectSuccess from '../../Components/Technician/ServiceRequestRejectSuccess';
import ServiceRequestSuccess from '../../Components/Technician/ServiceRequestSuccess';
import ServiceRequestFailed from '../../Components/Technician/ServiceRequestFaild';
import ServiceRequestRejectFailed from '../../Components/Technician/ServiceRequestRejectFaild';
import BG from '../../assets/images/technician-dashboard-bg-4.jpg';

export default function Reject_Service_Request() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // <-- new state
  const [emailResponse, setEmailResponse] = useState(null);

  const location = useLocation();
  const { request_id, email } = location.state || {};

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
          <h2 className="text-xl font-bold mb-4">Reject Service Request</h2>
          <br />

          {!showSuccess ? (
            <ServiceRequestReject
              initialFormData={{
                ownerEmail: email || "",
                subject: `Service Request #${request_id || ""} Rejected`,
                message:
                  "Dear Customer, your service request has been rejected.",
                request_id: request_id || null,
              }}
              onSend={handleEmailSuccess}
            />
          ) : (
            <ServiceRequestRejectSuccess
              onBack={() => setShowSuccess(false)}
              responseData={emailResponse}
            />
          )}

          <br />
          {/* <ServiceRequestRejectFailed/> */}
        </main>
      </div>

      <Footer />
    </>
  );
}
