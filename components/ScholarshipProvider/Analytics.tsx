"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { scholarshipProviderApi, DetailedAnalyticsData, DetailedAnalyticsFilters, MetricCount, CrossMetric } from '@/services/scholarshipProviderApi';
import { NEPAL_PROVINCES, NEPAL_DISTRICTS } from '@/lib/location-data';
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
import {
  Download,
  Home,
  RefreshCcw,
} from 'lucide-react';
import { toast } from 'sonner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

ChartJS.defaults.color = '#64748b';

const tooltipConfig: any = {
  backgroundColor: 'rgba(15, 23, 42, 0.9)',
  padding: 10,
  cornerRadius: 8,
  displayColors: true,
};

export default function Analytics() {
  const [data, setData] = useState<DetailedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<DetailedAnalyticsFilters>({
    province: '',
    district: '',
    school_type: '',
    scholarship_status: 'all',
  });

  useEffect(() => {
    loadDetailedAnalytics();
  }, [filters]);

  async function loadDetailedAnalytics() {
    setLoading(true);
    try {
      const res = await scholarshipProviderApi.getDetailedAnalytics(filters);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      toast.error('Could not fetch analytics data');
    } finally {
      setLoading(false);
    }
  }

  const districts = useMemo(() => {
    if (!filters.province) return [];
    return NEPAL_DISTRICTS[filters.province as keyof typeof NEPAL_DISTRICTS] || [];
  }, [filters.province]);

  const handleProvinceChange = (province: string) => {
    setFilters(prev => ({ ...prev, province, district: '' }));
  };

  const highestGender = useMemo(() => {
    if (!data?.gender?.length) return { label: 'N/A', count: 0, total: 0 };
    const total = data.gender.reduce((s, g) => s + g.count, 0);
    const top = data.gender.reduce((a, b) => a.count > b.count ? a : b);
    const pct = total > 0 ? Math.round((top.count / total) * 100) : 0;
    return { label: top.label, count: top.count, pct };
  }, [data]);

  const genderRatio = useMemo(() => {
    if (!data?.gender?.length) return '';
    const f = data.gender.find(g => g.label.toLowerCase() === 'female')?.count || 0;
    const m = data.gender.find(g => g.label.toLowerCase() === 'male')?.count || 0;
    const total = f + m;
    if (total === 0) return '';
    return `${Math.round((f / total) * 100)}% Female vs ${Math.round((m / total) * 100)}% Male`;
  }, [data]);

  const crossMetricToGroupedBar = (metrics: CrossMetric[] = [], labelKey: string) => {
    if (!metrics.length) return { labels: [], datasets: [] };
    const labels = metrics.map(m => m.label);
    const subLabels = [...new Set(metrics.flatMap(m => m.values.map(v => v.label)))];

    const colors = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6', '#94a3b8', '#14b8a6'];
    const subColors: Record<string, string> = {};
    subLabels.forEach((l, i) => { subColors[l] = colors[i % colors.length]; });

    const datasets = subLabels.map(sl => ({
      label: sl,
      data: metrics.map(m => m.values.find(v => v.label === sl)?.count || 0),
      backgroundColor: subColors[sl],
      borderRadius: 4,
    }));

    return { labels, datasets };
  };

  const provinceColors = (values: number[]) => {
    if (!values.length) return [];
    const max = Math.max(...values);
    const min = Math.min(...values);
    return values.map(v => {
      if (v === max) return '#4f46e5';
      if (v === min) return '#f97316';
      return '#3b82f6';
    });
  };

  const downloadChart = (e: React.MouseEvent<HTMLButtonElement>, name: string) => {
    const container = (e.currentTarget).closest('[data-chart]') as HTMLElement;
    const canvas = container?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (error) return <div className="p-8 text-red-500 font-bold">{error}</div>;

  return (
    <section className="fade-in max-w-7xl mx-auto pb-10 px-6">

 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Analytics</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <RefreshCcw className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Processing Data...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Applicants</p>
                  <h2 className="text-2xl font-bold text-slate-900">{data?.total_applicants?.toLocaleString() || 0}</h2>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                {highestGender.pct}% {highestGender.label}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Highest Participation</p>
                  <h2 className="text-2xl font-bold text-slate-900">{highestGender.label}</h2>
                </div>
                <div className="bg-pink-50 p-2 rounded-lg text-pink-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-2">{genderRatio}</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Admit Cards Sent</p>
                  <h2 className="text-2xl font-bold text-slate-900">{data?.admit_cards_sent?.toLocaleString() || 0}</h2>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-2">Via Email & SMS</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Admit Cards Pending</p>
                  <h2 className="text-2xl font-bold text-slate-900">{data?.admit_cards_pending?.toLocaleString() || 0}</h2>
                </div>
                <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
              </div>
              <p className="text-xs text-amber-600 font-medium mt-2">Awaiting processing</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Geographic Reach</p>
                  <div className="flex items-baseline space-x-1">
                    <h2 className="text-2xl font-bold text-slate-900">{data?.district_count || data?.district?.length || 0}</h2>
                    <span className="text-xs font-medium text-slate-500">Districts</span>
                  </div>
                </div>
                <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-2">Across all {data?.province?.length || 0} Provinces</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div data-chart className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-800">Payment Methods</h3>
                <button onClick={(e) => downloadChart(e, 'payment-methods')} className="text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
              </div>
              <div className="relative h-[220px] w-full">
                {data?.payment_methods?.length ? (
                  <Doughnut
                    data={{
                      labels: data.payment_methods.map(m => m.label),
                      datasets: [{
                        data: data.payment_methods.map(m => m.count),
                        backgroundColor: ['#16a34a', '#9333ea', '#2563eb'],
                        borderWidth: 0,
                        hoverOffset: 4,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
                        tooltip: tooltipConfig,
                      },
                      cutout: '65%',
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-slate-400">No data</div>
                )}
              </div>
            </div>

            <div data-chart className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-base font-bold text-slate-800">Applications Per Day</h3>
                <button onClick={(e) => downloadChart(e, 'applications-per-day')} className="text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-sm text-slate-500 mb-4">Daily application submissions over time.</p>
              <div className="relative h-[220px] w-full">
                {data?.applications_per_day?.length ? (
                  <Bar
                    data={{
                      labels: data.applications_per_day.map(m => m.label),
                      datasets: [{
                        label: 'Applications',
                        data: data.applications_per_day.map(m => m.count),
                        backgroundColor: '#3b82f6',
                        borderRadius: 4,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: tooltipConfig,
                      },
                      scales: {
                        y: { grid: { color: '#f1f5f9' }, beginAtZero: true, ticks: { stepSize: 1 } },
                        x: { grid: { display: false }, ticks: { maxRotation: 45, font: { size: 10 } } },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-slate-400">No data</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div data-chart className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-base font-bold text-slate-800">Ethnicity Distribution</h3>
                <button onClick={(e) => downloadChart(e, 'ethnicity-distribution')} className="text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-sm text-slate-500 mb-4">Detailed breakdown across all ethnic categories recognized in Nepal.</p>
              <div className="relative h-[320px] w-full">
                {data?.ethnicity?.length ? (
                  <Bar
                    data={{
                      labels: data.ethnicity.map(m => m.label),
                      datasets: [{
                        label: 'Number of Applicants',
                        data: data.ethnicity.map(m => m.count),
                        backgroundColor: '#8b5cf6',
                        borderRadius: 4,
                      }]
                    }}
                    options={{
                      indexAxis: 'y',
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: tooltipConfig,
                      },
                      scales: {
                        x: { grid: { color: '#f1f5f9' }, title: { display: true, text: 'Applicants Count' } },
                        y: { grid: { display: false }, ticks: { font: { size: 11 } } },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-slate-400">No data</div>
                )}
              </div>
            </div>

            <div className="space-y-6 flex flex-col justify-between">
              <div data-chart className="bg-white rounded-xl border border-slate-100 p-6 flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-slate-800">GPA Distribution</h3>
                  <button onClick={(e) => downloadChart(e, 'gpa-distribution')} className="text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                </div>
                <div className="relative h-[220px] w-full">
                  {data?.gpa_breakdown?.length ? (
                    <Bar
                      data={{
                        labels: data.gpa_breakdown.map(m => m.label),
                        datasets: [{
                          label: 'Applicants',
                          data: data.gpa_breakdown.map(m => m.count),
                          backgroundColor: '#14b8a6',
                          borderRadius: 4,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: tooltipConfig,
                        },
                        scales: {
                          y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
                          x: { grid: { display: false } },
                        },
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-slate-400">No data</div>
                  )}
                </div>
              </div>

              <div data-chart className="bg-white rounded-xl border border-slate-100 p-6 flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-base font-bold text-slate-800">Provincial Breakdown</h3>
                  <button onClick={(e) => downloadChart(e, 'provincial-breakdown')} className="text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  {data?.province?.length ? (() => {
                    const maxP = data.province.reduce((a, b) => a.count > b.count ? a : b);
                    const minP = data.province.reduce((a, b) => a.count < b.count ? a : b);
                    return <>Highest: <span className="font-bold text-indigo-600">{maxP.label} ({maxP.count.toLocaleString()})</span> &bull; Lowest: <span className="font-bold text-orange-500">{minP.label} ({minP.count.toLocaleString()})</span></>;
                  })() : ''}
                </p>
                <div className="relative h-[220px] w-full">
                  {data?.province?.length ? (
                    <Bar
                      data={{
                        labels: data.province.map(m => m.label),
                        datasets: [{
                          label: 'Applicants by Province',
                          data: data.province.map(m => m.count),
                          backgroundColor: provinceColors(data.province.map(m => m.count)),
                          borderRadius: 4,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: tooltipConfig,
                        },
                        scales: {
                          y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
                          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                        },
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-slate-400">No data</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div data-chart className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-base font-bold text-slate-800">Average GPA by School Type</h3>
                <button onClick={(e) => downloadChart(e, 'avg-gpa-by-school-type')} className="text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-sm text-slate-500 mb-4">Comparing highest average GPA across institutions.</p>
              <div className="relative h-[220px] w-full">
                {data?.gpa_by_school_type?.length ? (
                  <Bar
                    data={{
                      labels: data.gpa_by_school_type.map(m => m.label),
                      datasets: [{
                        label: 'Average GPA',
                        data: data.gpa_by_school_type.map(m => +(m.count / 100).toFixed(2)),
                        backgroundColor: ['#4f46e5', '#3b82f6', '#14b8a6', '#94a3b8'],
                        borderRadius: 4,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          ...tooltipConfig,
                          callbacks: {
                            label: (ctx: any) => `Average GPA: ${(ctx.parsed.y ?? 0).toFixed(2)}`,
                          },
                        },
                      },
                      scales: {
                        y: { grid: { color: '#f1f5f9' }, beginAtZero: true, max: 4.0 },
                        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-slate-400">No data</div>
                )}
              </div>
            </div>

            <div data-chart className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-base font-bold text-slate-800">Stream by Province</h3>
                <button onClick={(e) => downloadChart(e, 'stream-by-province')} className="text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-sm text-slate-500 mb-4">Science vs Management applicants across all provinces.</p>
              <div className="relative h-[220px] w-full">
                {data?.stream_by_province?.length ? (() => {
                  const chartData = crossMetricToGroupedBar(data.stream_by_province, 'stream');
                  return (
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
                          tooltip: tooltipConfig,
                        },
                        scales: {
                          y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
                          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                        },
                      }}
                    />
                  );
                })() : (
                  <div className="flex items-center justify-center h-full text-sm text-slate-400">No data</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div data-chart className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-base font-bold text-slate-800">School Type by Province</h3>
                <button onClick={(e) => downloadChart(e, 'school-type-by-province')} className="text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-sm text-slate-500 mb-4">Distribution of institution types across regions.</p>
              <div className="relative h-[220px] w-full">
                {data?.school_type_by_province?.length ? (() => {
                  const chartData = crossMetricToGroupedBar(data.school_type_by_province, 'school_type');
                  return (
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
                          tooltip: tooltipConfig,
                        },
                        scales: {
                          y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
                          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                        },
                      }}
                    />
                  );
                })() : (
                  <div className="flex items-center justify-center h-full text-sm text-slate-400">No data</div>
                )}
              </div>
            </div>

            <div data-chart className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-base font-bold text-slate-800">Gender by Province</h3>
                <button onClick={(e) => downloadChart(e, 'gender-by-province')} className="text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-sm text-slate-500 mb-4">Applicant gender distribution across regions.</p>
              <div className="relative h-[220px] w-full">
                {data?.gender_by_province?.length ? (() => {
                  const chartData = crossMetricToGroupedBar(data.gender_by_province, 'gender');
                  return (
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
                          tooltip: tooltipConfig,
                        },
                        scales: {
                          y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
                          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                        },
                      }}
                    />
                  );
                })() : (
                  <div className="flex items-center justify-center h-full text-sm text-slate-400">No data</div>
                )}
              </div>
            </div>
          </div>

          <div data-chart className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-base font-bold text-slate-800">Exam Center Allocation by Stream</h3>
              <button onClick={(e) => downloadChart(e, 'exam-center-allocation')} className="text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
            </div>
            <p className="text-sm text-slate-500 mb-4">Applicant distribution across major designated exam centers for Science and Management.</p>
            <div className="relative h-[350px] w-full">
              {data?.exam_centers?.length ? (
                <Bar
                  data={{
                    labels: data.exam_centers.map(m => m.name),
                    datasets: [
                      { label: 'Management', data: data.exam_centers.map(m => m.management), backgroundColor: '#0ea5e9', borderRadius: 4 },
                      { label: 'Science', data: data.exam_centers.map(m => m.science), backgroundColor: '#10b981', borderRadius: 4 },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
                      tooltip: tooltipConfig,
                    },
                    scales: {
                      y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
                      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-slate-400">No data</div>
              )}
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.4in;
          }

          body > :not(.fade-in) {
            display: none !important;
          }

          .fade-in {
            max-width: 100% !important;
            padding: 0 12px !important;
            margin: 0 !important;
            background: white !important;
          }

          .fade-in .no-print,
          .fade-in select,
          .fade-in button {
            display: none !important;
          }

          [class*="grid"] {
            display: grid !important;
            gap: 8px !important;
          }

          [class*="lg:grid-cols-2"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          [class*="lg:grid-cols-5"],
          [class*="lg:grid-cols-4"] {
            grid-template-columns: repeat(5, 1fr) !important;
          }

          [class*="md:grid-cols-2"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          [class*="bg-white"] {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            border-radius: 6px !important;
            break-inside: avoid !important;
          }

          canvas {
            max-width: 100% !important;
            display: block !important;
          }

          h1 { font-size: 20pt !important; margin: 0 0 4px 0 !important; }
          .mb-2 { margin-bottom: 8px !important; }
          [class*="space-y-6"] > * { margin-bottom: 12px !important; break-inside: avoid !important; }
          [class*="h-\\[220px\\]"] { height: 150px !important; }
          [class*="h-\\[320px\\]"] { height: 190px !important; }
          [class*="h-\\[350px\\]"] { height: 210px !important; }
          [class*="p-4"] { padding: 8px !important; }
          [class*="p-6"] { padding: 10px !important; }
        }
      `}</style>
    </section>
  );
}
