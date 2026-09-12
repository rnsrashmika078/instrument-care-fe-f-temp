import React from 'react'
import Navbar from '../Components/Common/Navbar'
import Footer from '../Components/Common/Footer'
import TechnicianHeader from '../Components/Technician/Technician-Hero-Section'
import RecentTechniciansSection from '../Components/Technician/RecentTechniciansSection'
import AppointmentSection from '../Components/Common/Appointment'

export default function Technician() {
  return (
    <>
      <Navbar />
      <TechnicianHeader />
      <RecentTechniciansSection />
      <AppointmentSection/>
      <Footer />
    </>
  )
}
