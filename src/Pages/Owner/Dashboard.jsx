import React, { useState } from 'react';
import Navbar from '../../Components/owner/Navbar';
import Footer from '../../Components/Common/Footer';
import TechniciansCard from '../../Components/owner/TechniciansCard';
import TechnicianHeader from '../../Components/owner/Technician-Hero-Section';
import TechnicianTable from '../../Components/owner/TechnicianTable';

export default function User_Dashboard() {
  const [searchTerm, setSearchTerm] = useState(""); // central search state

  return (
    <>
      <Navbar />
      <TechnicianHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <TechnicianTable searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <TechniciansCard />
      <Footer />
    </>
  );
}
