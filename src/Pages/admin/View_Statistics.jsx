import React from 'react'
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

            <div className="flex w-full flex-col gap-4 bg-orange-50 p-2 md:h-full md:flex-row md:p-4">
                <Admin_Sidebar />

                <main className="min-w-0 flex-1 space-y-4 pt-14 md:pt-0">
                    <div className="px-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500">
                            Insights
                        </p>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                            Statistics
                        </h2>
                    </div>

                    <SearchTerm />
                    <TechnicianSearchRequests />
                    <TechnicianViewAndActive />
                </main>
            </div>

            <Footer />
        </>
    )
}
