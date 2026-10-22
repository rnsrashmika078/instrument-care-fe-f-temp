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
  const [chartLoading, setChartLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  // 🔥 Fetch line chart data from backend
  useEffect(() => {
    let active = true;

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

        //  Set backend response to chartData
        if (active) setChartData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch line chart data:', error);
      } finally {
        if (active) setChartLoading(false);
      }
    };

    fetchChartData();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <>
      <Navbar />

      <div className="flex w-full flex-col gap-4 bg-[#fffaf5] p-2 md:h-full md:flex-row md:p-4">
          <Admin_Sidebar />

          <main className="min-w-0 flex-1 rounded-[1.75rem] border border-gray-200 bg-white p-4 pt-14 md:p-6 md:pt-6">
            <div className="mb-6 flex flex-col gap-3 border-b border-gray-200 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                  Control Center
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                  Admin Dashboard
                </h2>
              </div>
              <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                System overview
              </div>
            </div>

            <AdminDashboardStats />

            <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
              <AdminDashboardLineChart data={chartData} loading={chartLoading} />
              <AdminDashboardTechnicianViewStats />
            </div>

            <div className="mt-6">
              <SearchTrendsChart />
            </div>
          </main>
      </div>

      <Footer />
    </>
  );
}
