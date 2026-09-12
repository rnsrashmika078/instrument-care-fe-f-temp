import React from 'react'
import Navbar from '../../Components/Technician/Navbar'
import Sidebar from '../../Components/Technician/Sidebar'
import DashboardStats from "../../Components/Technician/DashboardStats";
import ServiceRequestTable from "../../Components/Technician/ServiceRequestTable";
import JobSummaryTable from "../../Components/Technician/JobSummaryTable";
import Footer from '../../Components/Common/Footer'

export default function Technician_Dashboard() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-50">
        <Sidebar />

        {/* pt-14 on mobile gives clearance for the floating hamburger button */}
        <main className="flex-1 bg-white border border-orange-200 rounded-2xl p-4 pt-14 md:pt-4">
          <div className="mb-5 border-b border-orange-200 pb-3">
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Overview of your service requests and job activity</p>
          </div>
          <DashboardStats />
          <ServiceRequestTable />
          <JobSummaryTable />
        </main>
      </div>
      <Footer />
    </>
  );
}
