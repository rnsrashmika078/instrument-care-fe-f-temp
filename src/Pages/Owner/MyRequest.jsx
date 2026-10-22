import React from 'react';
import Navbar from '../../Components/owner/Navbar';
import Footer from '../../Components/Common/Footer';
import MyPreviousRequestHistoryTable from "../../Components/owner/MyPreviousRequest";

export default function MyRequest() {
  return (
    <>
      <Navbar />
      <div className="flex w-full flex-col gap-4 bg-orange-50 p-2 md:h-full md:flex-row md:p-4">
        <main className="min-w-0 flex-1">
          <MyPreviousRequestHistoryTable />
        </main>
      </div>
      <Footer />
    </>
  );
}
