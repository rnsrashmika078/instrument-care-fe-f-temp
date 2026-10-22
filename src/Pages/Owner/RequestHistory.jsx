import React from 'react'
import { useParams } from "react-router-dom";
import Navbar from '../../Components/owner/Navbar'
import Footer from '../../Components/Common/Footer'
import Tabs from "../../Components/owner/Tabs";
import ProfileCard from "../../Components/owner/ProfileCard";
import RequestHistoryTable from "../../Components/owner/RequestHistoryTable";
import BG from '../../assets/images/technician-dashboard-bg-4.jpg'

export default function RequestHistory() {
  const { id } = useParams(); // technician ID from URL

  return (
    <>
      <Navbar />

      <div className="min-h-screen w-full px-3 py-4 md:px-6 md:py-6 bg-gradient-to-br from-orange-50/30 to-amber-50/30">
        <div className="w-full">
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Previous Requests</h1>

          <Tabs />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-4">
            <div className="xl:col-span-1">
              <ProfileCard />
            </div>

            <div className="xl:col-span-3 flex flex-col gap-4">
              {/* Pass technician ID as prop */}
              <RequestHistoryTable />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
