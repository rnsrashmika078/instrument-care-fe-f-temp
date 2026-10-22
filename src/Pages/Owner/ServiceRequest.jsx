import React, { useState } from "react";
import Navbar from '../../Components/owner/Navbar'
import Footer from '../../Components/Common/Footer'
import Tabs from "../../Components/owner/Tabs";
import ProfileCard from "../../Components/owner/ProfileCard";
import ServiceRequestForm from "../../Components/owner/ServiceRequestForm";
import ServiceRequestSuccess from '../../Components/owner/ServiceRequestSuccess';
import ServiceRequestFail from '../../Components/owner/ServiceRequestFail';
import BG from '../../assets/images/technician-dashboard-bg-4.jpg'

export default function ServiceRequest() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // <-- new state

  return (
    <>
      <Navbar />

        <div className="min-h-screen w-full px-3 py-4 md:px-6 md:py-6 bg-gradient-to-br from-orange-50/30 to-amber-50/30">
        <div className="w-full">
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Service Request</h1>

          <Tabs />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-4">
            <div className="xl:col-span-1">
              <ProfileCard />
            </div>

            <div className="xl:col-span-3 flex flex-col gap-4">
              {!showSuccess ? (
                <ServiceRequestForm onSend={() => setShowSuccess(true)} />
              ) : (
                <ServiceRequestSuccess onBack={() => setShowSuccess(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
