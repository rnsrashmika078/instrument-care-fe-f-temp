import React from 'react'
import Navbar from '../../Components/Technician/Navbar'
import Sidebar from '../../Components/Technician/Sidebar'
import AllServiceRequestTable from "../../Components/Technician/AllServiceRequest"
import Footer from '../../Components/Common/Footer'
import BG from '../../assets/images/technician-dashboard-bg-4.jpg';

export default function AllServiceRequestPage() {
  return (
    <>
      <Navbar />

      {/* Background Image Wrapper */}
      <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-[#ffffff80] rounded-lg p-4 pt-14 md:pt-4">
          <AllServiceRequestTable />
        </main>
      </div>

      <Footer />
    </>
  )
}
