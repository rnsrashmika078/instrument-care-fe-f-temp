import React from 'react'
import { useParams } from "react-router-dom";
import Navbar from '../../Components/owner/Navbar'
import Footer from '../../Components/Common/Footer'
import Tabs from "../../Components/owner/Tabs";
import ProfileCard from "../../Components/owner/ProfileCard";
import DashboardStats from '../../Components/Technician/DashboardStats';
import JobSummaryTable_UserPage from '../../Components/owner/JobSummery-user-page';
import BG from '../../assets/images/technician-dashboard-bg-4.jpg'

export default function ViewProfile() {
  const { id } = useParams(); // technician ID from URL

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-100">
        <div className="w-full bg-[#ffffff70] p-6 font-poppins rounded-md">
          <h1 className="text-2xl font-bold mb-6">Technical Expertise Profile</h1>

          <Tabs />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-4">
            <div className="lg:col-span-1">
              <ProfileCard />
            </div>

            <div className="lg:col-span-2 flex flex-col">
              {/* Pass technician ID as prop */}
              <DashboardStats technicianId={id} />
              <JobSummaryTable_UserPage />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
