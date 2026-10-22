import React, { useState } from 'react';
import Navbar from '../../Components/owner/Navbar';
import Footer from '../../Components/Common/Footer';
import TechniciansCard from '../../Components/owner/TechniciansCard';
import TechnicianTable from '../../Components/owner/TechnicianTable';

export default function User_Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-poppins">
      <Navbar />
      <main className="mx-auto w-full max-w-[1500px] px-3 py-6 sm:px-5 md:py-10 lg:px-6">
        <TechnicianTable searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <TechniciansCard />
      </main>
      <Footer />
    </div>
  );
}
