import React, { useState } from 'react';
import Navbar from '../../Components/owner/Navbar';
import Footer from '../../Components/Common/Footer';
import BG from '../../assets/images/technician-dashboard-bg-4.jpg'
import MyPreviousRequestHistoryTable from "../../Components/owner/MyPreviousRequest";

export default function MyRequest() {
  const [searchTerm, setSearchTerm] = useState(""); // central search state

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-100">
        <div className="w-full bg-[#ffffff70] p-6 font-poppins rounded-md">
          <h1 className="text-2xl font-bold mb-6">All My Requests</h1>

          <div className="">
            <div className="">
              <MyPreviousRequestHistoryTable />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
