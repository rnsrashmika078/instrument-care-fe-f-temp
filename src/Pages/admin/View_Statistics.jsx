import { fetchWithAuth } from '../../Components/utils/api';
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Technician/Navbar'
import Admin_Sidebar from '../../Components/admin/Sidebar'
import SearchTerm from '../../Components/admin/SearchTerm';
import TechnicianSearchRequests from '../../Components/admin/TechnicianSearchRequests';
import TechnicianViewAndActive from '../../Components/admin/TechnicianViewAndActive';
import Footer from '../../Components/Common/Footer'

export default function View_Statistics() {
    return (
        <>
            <Navbar />

            <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-orange-100">
                <Admin_Sidebar />

                <main className="flex-1 bg-[#ffffff80] rounded-lg p-4">
                    <h2 className="text-xl font-bold mb-4">Statistics</h2>
                    <SearchTerm />
                    <TechnicianSearchRequests />
                    <TechnicianViewAndActive />
                </main>
            </div>

            <Footer />
        </>
    )
}
