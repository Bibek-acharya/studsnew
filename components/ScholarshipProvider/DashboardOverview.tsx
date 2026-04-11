import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { scholarshipProviderApi, DashboardStats, AnalyticsData, ProviderApplication } from '@/services/scholarshipProviderApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardOverviewProps {
  onNavigate?: (section: string) => void;
  onReviewStudent?: (id: string) => void;
}

export default function DashboardOverview({ onNavigate, onReviewStudent }: DashboardOverviewProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentApps, setRecentApps] = useState<ProviderApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [dashboardRes, analyticsRes, appsRes] = await Promise.all([
        scholarshipProviderApi.getDashboard(),
        scholarshipProviderApi.getAnalytics(),
        scholarshipProviderApi.getApplications({ page: 1, limit: 5 }),
      ]);
      setStats(dashboardRes);
      setAnalytics(analyticsRes);
      setRecentApps(appsRes.applications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="fade-in flex items-center justify-center py-20">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-primary-600"></i>
      </section>
    );
  }

  if (error) {
    return (
      <section className="fade-in">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 font-bold">
          {error}
        </div>
      </section>
    );
  }

  const totalApps = stats?.total_applications || 0;
  const activeSchs = stats?.total_scholarships || 0;
  const shortlisted = analytics?.status_breakdown?.shortlisted || 0;
  const selected = analytics?.status_breakdown?.approved || 0;
  const acceptanceRate = totalApps > 0 ? ((selected / totalApps) * 100).toFixed(1) : '0.0';

  const statusBreakdown = analytics?.status_breakdown || {};

  const doughnutLabels = Object.keys(statusBreakdown);
  const doughnutValues = Object.values(statusBreakdown);
  const doughnutColors = ['#cbd5e1', '#3b82f6', '#f59e0b', '#6366f1', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

  const doughnutData = {
    labels: doughnutLabels.length ? doughnutLabels.map(l => l.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())) : ['No Data'],
    datasets: [
      {
        data: doughnutValues.length ? doughnutValues : [1],
        backgroundColor: doughnutColors.slice(0, Math.max(doughnutLabels.length, 1)),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    cutout: '75%',
    plugins: {
      legend: { display: false },
    },
  };

  const scholarshipStats = analytics?.scholarship_stats || [];
  const barLabels = scholarshipStats.map(s => s.title.length > 20 ? s.title.slice(0, 20) + '...' : s.title);
  const barValues = scholarshipStats.map(s => s.applications);

  const barData = {
    labels: barLabels.length ? barLabels : ['No Data'],
    datasets: [
      {
        label: 'Applicants',
        data: barValues.length ? barValues : [0],
        backgroundColor: '#3b82f6',
        borderRadius: 8,
      },
    ],
  };

  return (
    <section className="fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1 block">Total Applications</span>
            <div className="flex items-end gap-3 mt-2">
              <span className="text-4xl font-black text-slate-800">{totalApps}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1 block">Active Scholarships</span>
            <div className="flex items-end gap-3 mt-2">
              <span className="text-4xl font-black text-slate-800">{activeSchs}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-50 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1 block">Shortlisted</span>
            <div className="flex items-end gap-3 mt-2">
              <span className="text-4xl font-black text-warning">{shortlisted}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1 block">Final Selected</span>
            <div className="flex items-end gap-3 mt-2">
              <span className="text-4xl font-black text-success">{selected}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hidden xl:block">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1 block">Acceptance Rate</span>
            <div className="flex items-end gap-3 mt-2">
              <span className="text-4xl font-black text-danger">{acceptanceRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm xl:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Applications by Scholarship</h3>
              <p className="text-sm text-slate-500">Total applicants per scholarship program.</p>
            </div>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><i className="fa-solid fa-download"></i></button>
          </div>
          <div className="flex-1 relative min-h-[300px] w-full">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { display: false } },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-bold text-slate-800">Current Pipeline Status</h3>
            <p className="text-sm text-slate-500">Breakdown of all active applications</p>
          </div>
          <div className="relative flex-1 w-full min-h-[250px] flex justify-center items-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
              <span className="text-3xl font-black text-slate-800">{totalApps}</span>
              <span className="text-xs text-slate-500 font-medium">Total Apps</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {doughnutData.labels.map((label: string, i: number) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[i] }}></div>
                <span className="text-slate-600 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Newest Applications</h3>
            <p className="text-xs text-slate-500 mt-1">Latest students seeking opportunities</p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('sec-applications')}
              className="text-sm font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg transition"
            >
              View All Directory
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Applicant Info</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {recentApps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-bold">No applications yet</td>
                </tr>
              ) : (
                recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 group transition">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-black text-xs shadow-sm border border-slate-100">
                          {app.first_name?.[0]}{app.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{app.first_name} {app.last_name}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 uppercase font-bold tracking-tighter">
                            ID: APP-{app.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-slate-600 font-medium">{app.email}</td>
                    <td className="py-3 px-6">
                      <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded font-black text-xs">
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      {onReviewStudent && (
                        <button
                          onClick={() => onReviewStudent(String(app.id))}
                          className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary-600 hover:text-white transition flex items-center justify-center mx-auto lg:ml-auto"
                        >
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
