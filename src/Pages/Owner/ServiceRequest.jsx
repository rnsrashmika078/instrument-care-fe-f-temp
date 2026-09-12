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

      <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-100">
        <div className="w-full  bg-[#ffffff70] p-6 font-poppins rounded-md">
          <h1 className="text-2xl font-bold mb-6">Service Request</h1>

          <Tabs />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-4">
            <div className="lg:col-span-1">
              <ProfileCard />
            </div>

            <div className="lg:col-span-2 flex flex-col">
              {!showSuccess ? (
                <ServiceRequestForm onSend={() => setShowSuccess(true)} />
              ) : (
                <ServiceRequestSuccess onBack={() => setShowSuccess(false)} />
              )}

              {/* <ServiceRequestForm /> */}
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}
