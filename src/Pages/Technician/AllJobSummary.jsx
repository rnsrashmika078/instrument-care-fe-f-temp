import React from 'react'
import Navbar from '../../Components/Technician/Navbar'
import Sidebar from '../../Components/Technician/Sidebar'
import Footer from '../../Components/Common/Footer'
import AllJobSummary from '../../Components/Technician/AllJobSummary';

export default function AllJobSummaryPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#fffaf5] px-3 py-4 md:px-5 md:py-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 lg:flex-row">
          <Sidebar />

          <main className="flex-1 rounded-[1.75rem] border-2 border-gray-200 bg-white p-4 pt-14 md:p-6 md:pt-6">
            <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                  Job History
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                  All Job Summary
                </h2>
              </div>
              <div className="inline-flex items-center rounded-full border border-gray-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                Completed &amp; ongoing
              </div>
            </div>

            <AllJobSummary />
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
