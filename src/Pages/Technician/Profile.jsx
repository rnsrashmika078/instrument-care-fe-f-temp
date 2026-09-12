import React from 'react'
import Navbar from '../../Components/Technician/Navbar'
import Sidebar from '../../Components/Technician/Sidebar'
import Footer from '../../Components/Common/Footer'
import EditProfileForm from "../../Components/Technician/EditProfileForm";
import ProfileForm from '../../Components/Technician/ProfileEditForm';
import BG from '../../assets/images/technician-dashboard-bg-4.jpg';

export default function Technician_Profile() {
  return (
    <>
      <Navbar />

      <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-100">
        <Sidebar />

        <main className="flex-1 bg-[#ffffff80] rounded-lg p-4">
          <ProfileForm />

        </main>
      </div>

      <Footer />
    </>
  )
}
