import React, { useEffect, useState } from 'react';
import { scholarshipProviderApi, AnalyticsData } from '@/services/scholarshipProviderApi';

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    setError('');
    try {
      const data = await scholarshipProviderApi.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }

  const total = analytics?.total_applications || 0;
  const statusBreakdown = analytics?.status_breakdown || {};
  const pending = statusBreakdown.pending || 0;
  const underReview = statusBreakdown.under_review || 0;
  const shortlisted = statusBreakdown.shortlisted || 0;
  const approved = statusBreakdown.approved || 0;

  const funnelSteps = [
    { label: 'Total Apps', value: String(total), icon: 'fa-table-list', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
    { label: 'Under Review', value: String(underReview), icon: 'fa-magnifying-glass', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-primary-600' },
    { label: 'Shortlisted', value: String(shortlisted), icon: 'fa-star', bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-warning' },
    { label: 'Selected', value: String(approved), icon: 'fa-check-circle', bg: 'bg-green-50', border: 'border-green-400', text: 'text-success', large: approved > 0 }
  ];

  return (
    <section className="fade-in max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800">Analytics & Data Export</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Deep insights and report generation for stakeholders.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-primary-600"></i>
        </div>
      ) : (
        <>
          <div className="bg-white p-10 rounded-md border border-slate-200  mb-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-200 via-primary-400 to-green-400"></div>
            <h3 className="font-black text-slate-800 mb-12 text-xl text-center uppercase tracking-widest">Application Funnel Conversion</h3>

            <div className="flex flex-col md:flex-row items-center justify-between text-center max-w-5xl mx-auto relative px-4">
              <div className="hidden md:block absolute top-1/2 left-20 right-20 h-1.5 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>

              {funnelSteps.map((step, index) => (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center mb-10 md:mb-0 group">
                    <div className={`w-28 h-28 rounded-md ${step.bg} flex flex-col items-center justify-center border-4 ${step.border}  relative z-10 transition-transform group-hover:scale-110 duration-300 ${step.large ? 'scale-125 shadow-xl md:mx-6' : ''}`}>
                      <span className={`text-3xl font-black ${step.text}`}>{step.value}</span>
                      <i className={`fa-solid ${step.icon} text-[10px] mt-1 opacity-40`}></i>
                    </div>
                    <span className={`text-[10px] font-black mt-6 uppercase tracking-widest ${step.large ? 'text-green-700 bg-green-100 px-4 py-1.5 rounded-full' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < funnelSteps.length - 1 && (
                    <div className="text-slate-200 text-2xl hidden md:block transform transition-transform group-hover:translate-x-2">
                      <i className="fa-solid fa-chevron-right"></i>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Master Applicant List',
                desc: 'A complete raw data dump of all applicants, their demographic data, GPA, and current pipeline status.',
                icon: 'fa-table-list',
                color: 'emerald',
                action: 'Download CSV (.csv)'
              },
              {
                title: 'Financial Needs Report',
                desc: 'Anonymized report detailing the average family income, dependents, and financial need statements for audit.',
                icon: 'fa-file-invoice-dollar',
                color: 'rose',
                action: 'Generate PDF (.pdf)'
              },
              {
                title: 'Diversity & Demographics',
                desc: 'Breakdown by gender, province, and rural vs. urban background to ensure equitable distribution.',
                icon: 'fa-earth-asia',
                color: 'indigo',
                isMulti: true
              }
            ].map(report => {
              const colorMap: Record<string, { bg: string; text: string; btn: string; shadow: string }> = {
                blue: { bg: 'bg-blue-50', text: 'text-blue-600', btn: 'bg-blue-600', shadow: 'shadow-blue-500/20' },
                green: { bg: 'bg-green-50', text: 'text-green-600', btn: 'bg-green-600', shadow: 'shadow-green-500/20' },
                purple: { bg: 'bg-purple-50', text: 'text-purple-600', btn: 'bg-purple-600', shadow: 'shadow-purple-500/20' },
                orange: { bg: 'bg-orange-50', text: 'text-orange-600', btn: 'bg-orange-600', shadow: 'shadow-orange-500/20' },
                red: { bg: 'bg-red-50', text: 'text-red-600', btn: 'bg-red-600', shadow: 'shadow-red-500/20' },
                indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', btn: 'bg-indigo-600', shadow: 'shadow-indigo-500/20' },
              };
              const colors = colorMap[report.color] || colorMap.blue;

              return (
                <div key={report.title} className="bg-white p-8 rounded-md border border-slate-200 hover:shadow-xl transition-all group flex flex-col items-center text-center">
                  <div className={`w-20 h-20 ${colors.bg} ${colors.text} rounded-md flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform duration-500`}>
                    <i className={`fa-solid ${report.icon}`}></i>
                  </div>
                  <h3 className="font-black text-xl text-slate-800 mb-3 uppercase tracking-tighter">{report.title}</h3>
                  <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed font-medium">{report.desc}</p>

                  {report.isMulti ? (
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button className="py-4 bg-slate-50 text-slate-700 rounded-md hover:bg-slate-100 font-black text-xs uppercase transition border border-slate-100"><i className="fa-solid fa-file-csv mr-2"></i> CSV</button>
                      <button className="py-4 bg-slate-50 text-slate-700 rounded-md hover:bg-slate-100 font-black text-xs uppercase transition border border-slate-100"><i className="fa-solid fa-file-powerpoint mr-2"></i> PPT</button>
                    </div>
                  ) : (
                    <button className={`w-full py-4 ${colors.btn} text-white rounded-md hover:shadow-lg transition-all font-black text-xs uppercase tracking-widest shadow-lg ${colors.shadow} flex items-center justify-center gap-2`}>
                      <i className={`fa-solid ${report.action?.includes('CSV') ? 'fa-file-csv' : 'fa-file-pdf'}`}></i> {report.action}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
