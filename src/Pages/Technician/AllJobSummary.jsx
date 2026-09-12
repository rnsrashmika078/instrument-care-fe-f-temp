import React from 'react'
import Navbar from '../../Components/Technician/Navbar'
import Sidebar from '../../Components/Technician/Sidebar'
import Footer from '../../Components/Common/Footer'
import AllJobSummary from '../../Components/Technician/AllJobSummary';
import BG from '../../assets/images/technician-dashboard-bg-4.jpg';

export default function AllJobSummaryPage() {
  return (
    <>
      <Navbar />

      {/* Background Image Wrapper */}
      <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-[#ffffff80] rounded-lg p-4">
          <AllJobSummary />
        </main>
      </div>

      <Footer />
    </>
  )
}
