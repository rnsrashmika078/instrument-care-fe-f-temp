import { fetchWithAuth } from '../../Components/utils/api';
import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Technician/Navbar';
import Admin_Sidebar from '../../Components/admin/Sidebar';
import AdminDashboardStats from '../../Components/admin/AdminDashboardStstus';
import AdminDashboardLineChart from '../../Components/admin/AdminServiceRequestLineChart';
import Footer from '../../Components/Common/Footer';
import BG from '../../assets/images/technician-dashboard-bg-4.jpg';
import AdminDashboardTechnicianViewStats from '../../Components/admin/AdminDashboardTechnicianViewStats';
import SearchTrendsChart from '../../Components/admin/SearchTrendCharts';
import { API_BASE } from '../../config';

export default function Admin_Dashboard() {
  const [chartData, setChartData] = useState([]);
  const token = sessionStorage.getItem("token");

  // 🔥 Fetch line chart data from backend
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE}/admin/line-chart`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );
        const data = await response.json();

        // ✅ Set backend response to chartData
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch line chart data:', error);
      }
    };

    fetchChartData();
  }, [token]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#fffaf5] px-3 py-4 md:px-5 md:py-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 lg:flex-row">
          <Admin_Sidebar />

          <main className="flex-1 rounded-[1.75rem] border border-orange-100 bg-white p-4 md:p-6">
            <div className="mb-6 flex flex-col gap-3 border-b border-orange-100 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                  Control Center
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                  Admin Dashboard
                </h2>
              </div>
              <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                System overview
              </div>
            </div>

            <AdminDashboardStats />

            <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
              <AdminDashboardLineChart data={chartData} />
              <AdminDashboardTechnicianViewStats />
            </div>

            <div className="mt-6">
              <SearchTrendsChart />
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
