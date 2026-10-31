import { useEffect, useState } from 'react';
import Navbar from '../../Components/Technician/Navbar';
import Admin_Sidebar from '../../Components/admin/Sidebar';
import AdminDashboardStats from '../../Components/admin/AdminDashboardStstus';
import Footer from '../../Components/Common/Footer';
import ReportCharts from '../../Components/admin/reports/ReportCharts';
import { fetchWithAuth } from '../../Components/utils/api';
import { API_BASE } from '../../config';

export default function Admin_Dashboard() {
  const [report, setReport] = useState({});
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchReport = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE}/admin/reports`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response) return;

        if (!response.ok) {
          throw new Error(`Report request failed (${response.status})`);
        }

        const data = await response.json();

        if (active) setReport(data ?? {});
      } catch (error) {
        console.error('Failed to fetch dashboard report:', error);

        if (active) {
          setChartsError('Unable to load the National Statistics charts.');
        }
      } finally {
        if (active) setChartsLoading(false);
      }
    };

    fetchReport();

    return () => {
      active = false;
    };
  }, []);

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

            <div className="mt-6">
              {chartsError ? (
                <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {chartsError}
                </div>
              ) : null}

              {chartsLoading ? (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-80 animate-pulse rounded-[1.5rem] border border-gray-200 bg-white"
                    />
                  ))}
                </div>
              ) : (
                <ReportCharts report={report} />
              )}
            </div>
          </main>
      </div>

      <Footer />
    </>
  );
}
