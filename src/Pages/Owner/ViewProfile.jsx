import React, { useCallback, useState } from 'react'
import { useParams } from "react-router-dom";
import Navbar from '../../Components/owner/Navbar'
import Footer from '../../Components/Common/Footer'
import Tabs from "../../Components/owner/Tabs";
import ProfileCard from "../../Components/owner/ProfileCard";
import Qualifications from "../../Components/owner/Qualifications";
import TechnicalExpertise from '../../Components/Technician/TechnicalExpertise';
import WorkExperience from '../../Components/Technician/WorkExperience';
import DashboardStats from '../../Components/Technician/DashboardStats';
import JobSummaryTable_UserPage from '../../Components/owner/JobSummery-user-page';
import BG from '../../assets/images/technician-dashboard-bg-4.jpg'

export default function ViewProfile() {
  const { id } = useParams(); // technician ID from URL
  const [techUserId, setTechUserId] = useState("");

  // Must be stable: ProfileCard's fetch effect depends on this callback, and an
  // inline arrow would change identity every render and loop forever.
  const handleTechLoaded = useCallback((userId) => setTechUserId(userId), []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full px-3 py-4 md:px-6 md:py-6 bg-gradient-to-br from-orange-50/30 to-amber-50/30">
        <div className="w-full">
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Technical Expertise Profile</h1>

          <Tabs />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-4">
            <div className="xl:col-span-1">
              <ProfileCard onTechLoaded={handleTechLoaded} />
            </div>

            <div className="xl:col-span-3 flex flex-col gap-4">
              {/* Pass technician ID as prop */}
              <DashboardStats technicianId={id} />
              <Qualifications technicianId={id} />
              {techUserId && (
                <TechnicalExpertise userId={techUserId} readOnly />
              )}
              {techUserId && (
                <WorkExperience userId={techUserId} sectionId="view-profile-work" readOnly />
              )}
              <JobSummaryTable_UserPage />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
