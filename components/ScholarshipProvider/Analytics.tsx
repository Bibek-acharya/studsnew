import React, { useEffect, useState, useMemo, useRef } from 'react';
import { scholarshipProviderApi, DetailedAnalyticsData, DetailedAnalyticsFilters, MetricCount } from '@/services/scholarshipProviderApi';
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
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Download, 
  Filter, 
  FileText, 
  Table, 
  Users, 
  MapPin, 
  GraduationCap, 
  RefreshCcw,
  LayoutDashboard,
  ChevronDown,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

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

  const dashboardRef = useRef<HTMLDivElement>(null);

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

  const COLORS = [
    'rgba(59, 130, 246, 0.8)',   // Blue 500
    'rgba(16, 185, 129, 0.8)',   // Emerald 500
    'rgba(245, 158, 11, 0.8)',   // Amber 500
    'rgba(239, 68, 68, 0.8)',    // Red 500
    'rgba(139, 92, 246, 0.8)',   // Violet 500
    'rgba(236, 72, 153, 0.8)',   // Pink 500
    'rgba(14, 165, 233, 0.8)',   // Sky 500
    'rgba(20, 184, 166, 0.8)',   // Teal 500
  ];

  const BORDER_COLORS = COLORS.map(c => c.replace('0.8', '1'));

  const getChartData = (metrics: MetricCount[] = [], label: string, type: 'pie' | 'bar' = 'bar') => {
    const labels = metrics.map(m => m.label || 'Unknown');
    const values = metrics.map(m => m.count);

    return {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: type === 'pie' ? COLORS : COLORS[0],
          borderColor: type === 'pie' ? BORDER_COLORS : BORDER_COLORS[0],
          borderWidth: 1,
        },
      ],
    };
  };

  const exportCSV = () => {
    if (!data) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Label,Count\n";
    
    const sections: (keyof DetailedAnalyticsData)[] = ['gender', 'ethnicity', 'gpa_breakdown', 'school_type', 'stream', 'province', 'district', 'status'];
    
    sections.forEach(section => {
      const metrics = data[section] as MetricCount[];
      if (Array.isArray(metrics)) {
        metrics.forEach(m => {
          csvContent += `${section},"${m.label}",${m.count}\n`;
        });
      }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Export Started');
  };

  const exportPDF = () => {
    window.print();
    toast.success('Generating PDF via Print');
  };

  if (error) return <div className="p-8 text-red-500 font-bold">{error}</div>;

  return (
    <section className="fade-in max-w-7xl mx-auto pb-20 px-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Applicant Analytics</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium italic">Advanced demographic and academic insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all font-bold text-sm shadow-sm"
          >
            <Table className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-sm shadow-md"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Cascading Filters */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 no-print">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-black text-slate-700 uppercase text-xs tracking-widest">Global Filters</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Province</label>
            <div className="relative">
              <select 
                value={filters.province}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
              >
                <option value="">All Provinces</option>
                {NEPAL_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">District</label>
            <div className="relative">
              <select 
                value={filters.district}
                disabled={!filters.province}
                onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium disabled:opacity-50"
              >
                <option value="">All Districts</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">School Type</label>
            <div className="relative">
              <select 
                value={filters.school_type}
                onChange={(e) => setFilters(prev => ({ ...prev, school_type: e.target.value }))}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
              >
                <option value="">All Types</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Scholarship Status</label>
            <div className="relative">
              <select 
                value={filters.scholarship_status}
                onChange={(e) => setFilters(prev => ({ ...prev, scholarship_status: e.target.value }))}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
              >
                <option value="all">All Applicants</option>
                <option value="recipients">Recipients Only</option>
                <option value="non-recipients">Non-Recipients Only</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <RefreshCcw className="w-10 h-10 text-blue-600 animate-spin" />
          <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Processing Data...</span>
        </div>
      ) : (
        <div ref={dashboardRef}>
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 text-white">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 opacity-50" />
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Total Reach</span>
              </div>
              <h4 className="text-4xl font-black mb-1">{data?.total_applicants || 0}</h4>
              <p className="text-sm font-medium text-blue-100">Filtered Applicants</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-6 h-6 text-emerald-500" />
                <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-emerald-500"></div>
                </div>
              </div>
              <h4 className="text-2xl font-black text-slate-800 mb-1">
                {data?.status?.find(s => s.label === 'approved')?.count || 0}
              </h4>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Approved Recipients</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <MapPin className="w-6 h-6 text-amber-500" />
                <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-amber-500"></div>
                </div>
              </div>
              <h4 className="text-2xl font-black text-slate-800 mb-1">
                {data?.province?.length || 0}
              </h4>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Regions Covered</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <GraduationCap className="w-6 h-6 text-violet-500" />
                <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-violet-500"></div>
                </div>
              </div>
              <h4 className="text-2xl font-black text-slate-800 mb-1">
                {data?.school_type?.find(s => s.label === 'Government')?.count || 0}
              </h4>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Public School Reach</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gender Distribution */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg">Gender Distribution</h3>
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">Demographics</span>
              </div>
              <div className="h-[300px] flex items-center justify-center">
                <Pie 
                  data={getChartData(data?.gender, 'Gender', 'pie')} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { weight: 'bold', size: 11 } } } }
                  }} 
                />
              </div>
            </div>

            {/* Stream Comparison */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg">Academic Stream</h3>
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">Academic</span>
              </div>
              <div className="h-[300px]">
                <Bar 
                  data={getChartData(data?.stream, 'Students')} 
                  options={{ 
                    maintainAspectRatio: false, 
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
                  }} 
                />
              </div>
            </div>

            {/* GPA Breakdown */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg">GPA Performance (SEE)</h3>
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">Academic Trend</span>
              </div>
              <div className="h-[300px]">
                <Line 
                  data={getChartData(data?.gpa_breakdown, 'Applicants')} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    elements: { line: { tension: 0.4, borderColor: '#3b82f6', borderWidth: 3 }, point: { radius: 4, backgroundColor: '#3b82f6' } },
                    scales: { y: { beginAtZero: true, grid: { display: true, color: '#f1f5f9' } }, x: { grid: { display: false } } }
                  }} 
                />
              </div>
            </div>

            {/* Ethnicity Breakdown */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg">Ethnicity Profile</h3>
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">Inclusion</span>
              </div>
              <div className="h-[300px]">
                <Bar 
                  data={getChartData(data?.ethnicity, 'Count')} 
                  options={{ 
                    indexAxis: 'y',
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { x: { beginAtZero: true, grid: { display: false } }, y: { grid: { display: false } } }
                  }} 
                />
              </div>
            </div>

            {/* Provincial Data */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg">Regional Penetration (Province)</h3>
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">Geographic</span>
              </div>
              <div className="h-[350px]">
                <Bar 
                  data={getChartData(data?.province, 'Applicants')} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, grid: { display: true, color: '#f1f5f9' } }, x: { grid: { display: false } } }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          /* Hide navigation elements */
          aside, 
          nav, 
          header, 
          .no-print,
          [style*="margin-left: 280px"],
          [style*="margin-left:280px"] {
            display: none !important;
            margin-left: 0 !important;
          }
          
          /* Reset main container */
          main, 
          .flex-1 {
            margin-left: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            display: block !important;
            overflow: visible !important;
          }

          .fade-in {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }

          /* Ensure KPI cards stay in a row if possible or grid */
          .grid-cols-4 {
            grid-template-columns: repeat(4, 1fr) !important;
          }

          .bg-white {
            border: 1px solid #eee !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }

          canvas {
            max-width: 100% !important;
            height: auto !important;
          }

          .mb-8 {
            margin-bottom: 2rem !important;
            page-break-inside: avoid;
          }

          h2 {
            font-size: 24pt !important;
            margin-top: 0 !important;
          }

          h3 {
            font-size: 16pt !important;
          }

          /* Ensure charts are visible */
          .h-[300px], .h-[350px] {
            height: 300px !important;
          }
        }
      `}</style>
    </section>
  );
}
