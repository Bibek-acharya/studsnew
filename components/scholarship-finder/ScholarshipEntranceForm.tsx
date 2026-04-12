"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  CheckCircle2, 
  CreditCard, 
  Download, 
  Printer, 
  Calendar, 
  User, 
  Upload, 
  ShieldCheck,
  AlertCircle,
  X,
  ChevronDown,
  Bell,
  Mail,
} from "lucide-react";

type ViewState = "form" | "payment" | "success" | "admit";

export default function ScholarshipEntranceForm() {
  const [view, setView] = useState<ViewState>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedBsDate, setSelectedBsDate] = useState("");
  const [selectedAdDate, setSelectedAdDate] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [rollNumber, setRollNumber] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [copyAddress, setCopyAddress] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    phone: "",
    email: "",
    seeSchoolType: "",
    schoolName: "",
    otherReason: "",
    province: "",
    district: "",
    municipality: "",
    ward: "",
    tole: "",
    tempProvince: "",
    tempDistrict: "",
    tempMunicipality: "",
    tempWard: "",
    tempTole: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    fatherOccupation: "",
    motherOccupation: "",
    monthlyIncome: 0,
    familyCount: 1,
    declaration: false
  });

  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(2082); // BS Year

  const nepaliMonths = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 
    'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
    'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];

  // Logic: Sync address
  useEffect(() => {
    if (copyAddress) {
      setFormData(prev => ({
        ...prev,
        tempProvince: prev.province,
        tempDistrict: prev.district,
        tempMunicipality: prev.municipality,
        tempWard: prev.ward,
        tempTole: prev.tole,
      }));
    }
  }, [copyAddress, formData.province, formData.district, formData.municipality, formData.ward, formData.tole]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (bsDate: string) => {
    if (bsDate) {
      const bsYear = parseInt(bsDate.split("-")[0]);
      const adYear = bsYear - 57;
      const calculatedAge = new Date().getFullYear() - adYear;
      setAge(calculatedAge);
      setSelectedAdDate(`${adYear}-04-15`); // Approximation mapping
    }
  };

  const handleBsDateSelect = (day: number) => {
    const formattedDate = `${currentYear}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedBsDate(formattedDate);
    calculateAge(formattedDate);
    setShowCalendar(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Manual validation simulation as per HTML
    if (!formData.fullName || !formData.gender || !selectedBsDate || !photoPreview) {
      alert("Please fill in all required fields marked with *.");
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView("payment");
  };

  const processPayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRollNumber(`PS-${Math.floor(1000 + Math.random() * 9000)}`);
      setIsLoading(false);
      setView("success");
    }, 2000);
  };

  const printAdmitCard = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 pb-20 px-4 sm:px-6 bg-[#0000ff] font-['Inter',sans-serif] selection:bg-blue-100 selection:text-blue-900">
      
      {/* Header Section */}
      <header className="w-full max-w-[900px] mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 no-print">
        <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" opacity="0.9"/>
                    <path d="M2 7v10l10 5V12L2 7z" opacity="0.6"/>
                    <path d="M22 7v10l-10 5V12l10-5z"/>
                </svg>
                <span className="text-white text-[24px] font-bold tracking-wide">StudSphere</span>
            </div>
            <h1 className="text-[32px] sm:text-[40px] font-extrabold text-white mb-2 leading-tight drop-shadow-sm">Project Shiksha Entrance 2082</h1>
            <p className="text-[18px] text-white/90 font-medium">Empowering Education, Shaping Futures.</p>
        </div>
      </header>

      {/* Form Container */}
      <main className="w-full max-w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden relative min-h-[600px]">
        
        {/* Trust/Confidentiality Banner */}
        <div className={`bg-[#f0fdf4] border-b border-[#bbf7d0] py-3.5 px-6 flex justify-center items-center gap-3 text-[14px] text-[#166534] no-print ${view !== 'form' ? 'hidden' : ''}`}>
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Your data is secure and will be used for admission purposes only.</span>
        </div>

        {/* Important Note */}
        <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-5 mt-6 mx-6 sm:mx-12 rounded-r-lg shadow-sm no-print ${view !== 'form' ? 'hidden' : ''}`}>
            <p className="font-bold text-[14px] text-yellow-800 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Note:
            </p>
            <p className="text-[13.5px] text-yellow-800 leading-relaxed">
                This scholarship entrance examination is for students who have completed SEE. Applicants from all districts of Nepal are eligible to participate. Candidates must bring this admit card to the exam center. The entrance form charge is <span className="font-bold">NPR 250</span> and is non-refundable.
            </p>
        </div>

        {/* 1. Payment Overlay */}
        {view === "payment" && (
          <div className="absolute inset-0 bg-white z-40 flex flex-col items-center justify-center no-print px-6 sm:px-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-[#0000ff]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Fee Payment</h2>
            <p className="text-gray-500 mb-6 text-sm">Please complete the payment to finalize your registration and generate your admit card.</p>
            
            <div className="w-full max-w-sm bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 shadow-sm text-left">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600 font-medium">Entrance Exam Fee</span>
                    <span className="font-bold text-gray-800">Rs. 250.00</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600 font-medium">Processing Fee</span>
                    <span className="font-bold text-gray-800">Rs. 0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-gray-800 font-bold">Total Amount</span>
                    <span className="font-bold text-xl text-[#0000ff]">Rs. 250.00</span>
                </div>
            </div>

            <div className="w-full max-w-sm grid grid-cols-2 gap-3 mb-6">
                <div className="border-2 border-[#0000ff] bg-blue-50 rounded-lg p-3 flex flex-col items-center cursor-pointer transition-colors">
                    <span className="font-bold text-[#0000ff]">Online Payment</span>
                    <span className="text-[10px] text-gray-500">eSewa / Khalti / Banking</span>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 flex flex-col items-center cursor-not-allowed opacity-50">
                    <span className="font-bold text-gray-500">Bank Voucher</span>
                    <span className="text-[10px] text-gray-400">Offline Upload</span>
                </div>
            </div>

            <button 
              onClick={processPayment}
              disabled={isLoading}
              className="w-full max-w-sm bg-[#0000ff] hover:bg-[#0000cc] text-white font-bold text-[16px] py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Pay Rs. 250 Securely</span>
                )}
            </button>
          </div>
        )}

        {/* 2. Success Message Overlay */}
        {view === "success" && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center no-print px-6 sm:px-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-8 text-center px-6 max-w-md">Your payment of Rs. 250 has been received and your application for Project Shiksha is complete.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button 
                  onClick={() => setView("admit")}
                  className="flex-1 bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                    <Download className="w-5 h-5" />
                    Download Admit Card
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-300"
                >
                    Close
                </button>
            </div>
          </div>
        )}

        {/* 3. Admit Card View Overlay */}
        {view === "admit" && (
          <div className="absolute inset-0 bg-gray-50 z-[60] flex flex-col items-center justify-start pt-8 pb-12 px-4 shadow-inner overflow-y-auto">
            <div className="w-full max-w-lg mb-4 flex justify-between items-center no-print">
                <h2 className="text-xl font-bold text-gray-800">Your Admit Card</h2>
                <button onClick={() => setView("success")} className="text-gray-500 hover:text-gray-800">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* The Printable Card */}
            <div id="printable-admit-card" className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 w-full max-w-lg overflow-hidden relative print:border-2 print:border-black print:shadow-none">
                <div className="h-3 bg-[#0000ff] w-full print:bg-black"></div>
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-100 print:border-black">
                        <div className="flex items-center gap-3">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#0000ff" xmlns="http://www.w3.org/2000/svg" className="print:fill-black">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" opacity="0.9"/>
                                <path d="M2 7v10l10 5V12L2 7z" opacity="0.6"/>
                                <path d="M22 7v10l-10 5V12l10-5z"/>
                            </svg>
                            <div>
                                <h3 className="font-extrabold text-[#0000ff] text-[20px] tracking-tight uppercase print:text-black">Project Shiksha</h3>
                                <p className="text-[13px] text-gray-600 font-semibold tracking-widest uppercase mt-0.5 print:text-black">Entrance Exam 2082</p>
                            </div>
                        </div>
                        <div className="text-right bg-blue-50 py-2 px-4 rounded-lg border border-blue-100 print:bg-white print:border-black">
                            <p className="text-[11px] font-bold text-[#0000ff] uppercase tracking-wider mb-1 print:text-black">Roll Number</p>
                            <p className="font-mono font-bold text-gray-900 text-[18px] print:text-black">{rollNumber}</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Photo */}
                        <div className="w-32 h-40 bg-gray-50 border-2 border-gray-300 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center p-1 print:border-black">
                            {photoPreview && <img src={photoPreview} className="w-full h-full object-cover rounded-sm" alt="Candidate" />}
                        </div>
                        
                        {/* Details */}
                        <div className="flex-grow space-y-4 w-full">
                            <div>
                                <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1 print:text-black">Candidate Name</p>
                                <p className="font-bold text-gray-900 text-[18px] border-b border-gray-200 pb-1 print:text-black print:border-black">{formData.fullName}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1 print:text-black">Exam Date</p>
                                    <p className="font-semibold text-gray-800 text-[14px]">15th Baisakh, 2082</p>
                                </div>
                                <div>
                                    <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1 print:text-black">Time</p>
                                    <p className="font-semibold text-gray-800 text-[14px]">8:00 AM - 11:00 AM</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1 print:text-black">Exam Center</p>
                                <p className="font-bold text-gray-800 text-[15px] bg-gray-50 p-2 rounded border border-gray-200 print:bg-white print:border-black">Kathmandu District Main Center</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-dashed border-gray-300 print:border-black">
                        <h4 className="text-[12px] font-bold text-gray-800 mb-2 uppercase print:text-black">Important Instructions:</h4>
                        <ul className="text-[11px] text-gray-600 space-y-1 list-disc pl-4 print:text-black">
                            <li>Please bring a printed copy of this admit card to the examination hall.</li>
                            <li>Arrive at the exam center at least 30 minutes before the scheduled time.</li>
                            <li>Calculators and mobile phones are strictly prohibited.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-lg mt-6 no-print flex gap-4">
                <button 
                  onClick={printAdmitCard}
                  className="flex-1 bg-[#0000ff] hover:bg-[#0000cc] text-white font-bold text-[16px] py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                    <Printer className="w-6 h-6" />
                    Print / Save as PDF
                </button>
            </div>
          </div>
        )}

        {/* 4. The Form Details */}
        <form onSubmit={handleSubmit} className={`px-6 sm:px-12 py-8 no-print ${view !== 'form' ? 'hidden' : ''}`}>
            
            {/* Section 1: Personal Details */}
            <div className="mb-12">
                <div className="mb-6 border-b border-gray-200 pb-3">
                    <h2 className="text-[20px] font-bold text-[#1e293b]">Personal Details</h2>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Left fields */}
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 order-2 md:order-1">
                        <div className="col-span-1 sm:col-span-2">
                            <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Student's Full Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white" 
                              placeholder="E.g. Ram Bahadur Thapa"
                              value={formData.fullName}
                              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                              required 
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select 
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] appearance-none bg-white cursor-pointer"
                                value={formData.gender}
                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                required
                              >
                                  <option value="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Date of Birth (BS) <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input 
                                  readOnly
                                  type="text" 
                                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] bg-white cursor-pointer" 
                                  placeholder="Select from Calendar" 
                                  value={selectedBsDate}
                                  onClick={() => setShowCalendar(!showCalendar)}
                                  required 
                                />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                
                                {/* Custom Nepali Calendar */}
                                {showCalendar && (
                                  <div className="absolute left-0 mt-2 z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-[340px]">
                                    <div className="flex justify-between items-center mb-6 px-1">
                                      <button type="button" onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() - 1)))} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-4 h-4 rotate-45" /> {/* Using simplified nav icons */}
                                      </button>
                                      <div className="flex items-center gap-2 font-bold text-gray-900">
                                        <span>{nepaliMonths[calendarDate.getMonth()]}</span>
                                        <select 
                                          value={currentYear}
                                          onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                                          className="text-sm font-bold bg-transparent outline-none cursor-pointer hover:text-blue-600"
                                        >
                                          {Array.from({length: 51}, (_, i) => 2040 + i).map(y => (
                                            <option key={y} value={y}>{y}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <button type="button" onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() + 1)))} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-4 h-4 -rotate-45" />
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                        <div key={d} className="text-[13px] font-bold text-gray-500 py-2">{d}</div>
                                      ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center">
                                      {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                                        <button 
                                          key={d}
                                          type="button"
                                          onClick={() => handleBsDateSelect(d)}
                                          className={`aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all hover:bg-gray-100 ${selectedBsDate.endsWith(`-${String(d).padStart(2, '0')}`) ? 'bg-[#0000ff] text-white hover:bg-[#0000ff]' : ''}`}
                                        >
                                          {d}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Date of Birth (AD) <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-500 outline-none" 
                              placeholder="Auto-calculated" 
                              value={selectedAdDate}
                              readOnly 
                              required 
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Age</label>
                            <div className="relative">
                                <input 
                                  type="number" 
                                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pl-4 text-[15px] text-gray-500 outline-none font-medium" 
                                  placeholder="Auto-calc" 
                                  value={age}
                                  readOnly 
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Yrs</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                            <input 
                              type="tel" 
                              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white" 
                              placeholder="10-digit mobile number" 
                              maxLength={10}
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                              required 
                            />
                        </div>

                        <div className="col-span-1 sm:col-span-1">
                            <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <input 
                              type="email" 
                              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] bg-white" 
                              placeholder="form@gmail.com"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="col-span-1 sm:col-span-2 mt-2">
                            <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">From where did you give SEE? <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select 
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] appearance-none bg-white cursor-pointer"
                                value={formData.seeSchoolType}
                                onChange={(e) => setFormData({...formData, seeSchoolType: e.target.value})}
                                required
                              >
                                  <option value="">Select School Type</option>
                                  <option value="Private">Private</option>
                                  <option value="Government">Government</option>
                                  <option value="Community">Community</option>
                                  <option value="Other">Other</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                            </div>

                            {formData.seeSchoolType === 'Other' && (
                              <div className="mt-4 animate-in slide-in-from-top-2">
                                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Please specify the reason/type <span className="text-red-500">*</span></label>
                                  <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] bg-white" 
                                    placeholder="Specify other type/reason"
                                    value={formData.otherReason}
                                    onChange={(e) => setFormData({...formData, otherReason: e.target.value})}
                                    required
                                  />
                              </div>
                            )}

                            {formData.seeSchoolType && (
                              <div className="mt-4 animate-in slide-in-from-top-2">
                                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">School Name <span className="text-red-500">*</span></label>
                                  <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] bg-white" 
                                    placeholder="Enter your school's full name"
                                    value={formData.schoolName}
                                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                                    required
                                  />
                              </div>
                            )}
                        </div>
                    </div>

                    {/* Right Photo Upload */}
                    <div className="w-full md:w-40 flex-shrink-0 order-1 md:order-2 flex flex-col items-center">
                        <label className="block text-[14px] font-semibold text-gray-700 mb-2 w-full text-center md:text-left">Passport Photo <span className="text-red-500">*</span></label>
                        <div 
                          onClick={() => document.getElementById('photo-upload')?.click()}
                          className="relative w-32 h-40 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group shadow-sm"
                        >
                            {photoPreview ? (
                              <img src={photoPreview} className="absolute inset-0 w-full h-full object-cover rounded-xl" alt="Preview" />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-gray-300 group-hover:text-gray-400 p-4 text-center">
                                  <User className="w-12 h-12 mb-2" />
                                  <span className="text-[12px] font-bold">Upload Photo</span>
                                  <span className="text-[10px] opacity-70 mt-1">PP Size (Max 2MB)</span>
                              </div>
                            )}
                        </div>
                        <input 
                          type="file" 
                          id="photo-upload" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handlePhotoUpload}
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Address Section */}
            <div className="mb-12">
                <div className="mb-6 border-b border-gray-200 pb-3">
                    <h2 className="text-[20px] font-bold text-[#1e293b]">Address Details</h2>
                </div>

                <h3 className="text-[15px] font-extrabold text-black mb-4 uppercase tracking-wider">Permanent Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-10">
                    <div>
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Province <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select 
                            className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] appearance-none bg-white font-medium"
                            value={formData.province}
                            onChange={(e) => setFormData({...formData, province: e.target.value})}
                            required
                          >
                              <option value="">Select Province</option>
                              {['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'].map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">District <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-medium" 
                          placeholder="District name"
                          value={formData.district}
                          onChange={(e) => setFormData({...formData, district: e.target.value})}
                          required 
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Municipality / RM <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-medium" 
                          placeholder="Municipality Name"
                          value={formData.municipality}
                          onChange={(e) => setFormData({...formData, municipality: e.target.value})}
                          required 
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Ward No. <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-medium" 
                          placeholder="Ward Number"
                          value={formData.ward}
                          onChange={(e) => setFormData({...formData, ward: e.target.value})}
                          required 
                        />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Tole / Village</label>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-medium" 
                          placeholder="Tole or village name"
                          value={formData.tole}
                          onChange={(e) => setFormData({...formData, tole: e.target.value})}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4 mt-2">
                    <h3 className="text-[15px] font-extrabold text-black uppercase tracking-wider">Temporary Address</h3>
                    <label className="flex items-center gap-2.5 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 transition-colors hover:bg-blue-100">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-[#0000ff] rounded border-blue-200 focus:ring-0 cursor-pointer" 
                          checked={copyAddress}
                          onChange={(e) => setCopyAddress(e.target.checked)}
                        />
                        <span className="text-[12px] font-bold text-[#0000ff]">Same as Permanent</span>
                    </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                    <div>
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Province <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select 
                            disabled={copyAddress}
                            className={`w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] appearance-none font-medium ${copyAddress ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
                            value={formData.tempProvince}
                            onChange={(e) => setFormData({...formData, tempProvince: e.target.value})}
                            required
                          >
                              <option value="">Select Province</option>
                              {['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'].map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">District <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          disabled={copyAddress}
                          className={`w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-medium ${copyAddress ? 'bg-gray-50 text-gray-500' : 'bg-white'}`} 
                          placeholder="District name"
                          value={formData.tempDistrict}
                          onChange={(e) => setFormData({...formData, tempDistrict: e.target.value})}
                          required 
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Municipality / RM <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          disabled={copyAddress}
                          className={`w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-medium ${copyAddress ? 'bg-gray-50 text-gray-500' : 'bg-white'}`} 
                          placeholder="Municipality Name"
                          value={formData.tempMunicipality}
                          onChange={(e) => setFormData({...formData, tempMunicipality: e.target.value})}
                          required 
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Ward No. <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          disabled={copyAddress}
                          className={`w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-medium ${copyAddress ? 'bg-gray-50 text-gray-500' : 'bg-white'}`} 
                          placeholder="Ward Number"
                          value={formData.tempWard}
                          onChange={(e) => setFormData({...formData, tempWard: e.target.value})}
                          required 
                        />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Tole / Village</label>
                        <input 
                          type="text" 
                          disabled={copyAddress}
                          className={`w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-medium ${copyAddress ? 'bg-gray-50 text-gray-500' : 'bg-white'}`} 
                          placeholder="Tole or village name"
                          value={formData.tempTole}
                          onChange={(e) => setFormData({...formData, tempTole: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            {/* Section 3: Family Background */}
            <div className="mb-12">
                <div className="mb-6 border-b border-gray-200 pb-3">
                    <h2 className="text-[20px] font-bold text-[#1e293b]">Family Background <span className="text-sm font-normal text-gray-500 ml-2">(Scholarship Need-Based)</span></h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                    <div>
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Guardian's Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-medium" 
                          placeholder="E.g. Shyam Bahadur Thapa"
                          value={formData.guardianName}
                          onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                          required 
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Guardian's Phone <span className="text-red-500">*</span></label>
                        <input 
                          type="tel" 
                          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-medium" 
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          value={formData.guardianPhone}
                          onChange={(e) => setFormData({...formData, guardianPhone: e.target.value.replace(/\D/g, '')})}
                          required 
                        />
                    </div>
                    
                    <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                        <div>
                            <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Father's Occupation <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select 
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] appearance-none font-medium bg-white"
                                value={formData.fatherOccupation}
                                onChange={(e) => setFormData({...formData, fatherOccupation: e.target.value})}
                                required
                              >
                                  <option value="">Select Occupation</option>
                                  <option>Agriculture</option>
                                  <option>Business</option>
                                  <option>Government Service</option>
                                  <option>Private Sector</option>
                                  <option>Foreign Employment</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Mother's Occupation <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select 
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] appearance-none font-medium bg-white"
                                value={formData.motherOccupation}
                                onChange={(e) => setFormData({...formData, motherOccupation: e.target.value})}
                                required
                              >
                                  <option value="">Select Occupation</option>
                                  <option>Homemaker</option>
                                  <option>Agriculture</option>
                                  <option>Private Sector</option>
                                  <option>Teaching</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="group relative">
                        <label className="block text-[14px] font-semibold text-gray-700 mb-2">Monthly Income (NPR) <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-bold text-gray-900" 
                          value={formData.monthlyIncome}
                          onChange={(e) => setFormData({...formData, monthlyIncome: parseInt(e.target.value) || 0})}
                          required 
                        />
                        <div className="mt-3 px-2 group-focus-within:opacity-100 opacity-80 transition-opacity">
                          <input 
                            type="range" 
                            min="0" 
                            max="500000" 
                            step="5000" 
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0000ff]"
                            value={formData.monthlyIncome}
                            onChange={(e) => setFormData({...formData, monthlyIncome: parseInt(e.target.value)})}
                          />
                          <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-bold"><span>0</span><span>MAX 5 LAKH</span></div>
                        </div>
                    </div>
                    <div className="group relative">
                        <label className="block text-[14px] font-semibold text-gray-700 mb-2">Family Members <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] font-bold text-gray-900" 
                          value={formData.familyCount}
                          onChange={(e) => setFormData({...formData, familyCount: parseInt(e.target.value) || 1})}
                          required 
                        />
                        <div className="mt-3 px-2 group-focus-within:opacity-100 opacity-80 transition-opacity">
                          <input 
                            type="range" 
                            min="1" 
                            max="20" 
                            step="1" 
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0000ff]"
                            value={formData.familyCount}
                            onChange={(e) => setFormData({...formData, familyCount: parseInt(e.target.value)})}
                          />
                          <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-bold"><span>1</span><span>20</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 4: Document Uploads */}
            <div className="mb-10">
                <div className="mb-6 border-b border-gray-200 pb-3">
                    <h2 className="text-[20px] font-bold text-[#1e293b]">Documents Upload</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="border border-gray-100 rounded-xl p-5 bg-gray-50 group hover:border-blue-200 transition-colors">
                        <label className="block text-[13px] font-extrabold text-[#0000ff] mb-2 uppercase tracking-wide">SEE Marksheet <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input 
                            type="file" 
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-blue-100 file:text-[#0000ff] hover:file:bg-blue-200 cursor-pointer" 
                            required 
                          />
                        </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-5 bg-gray-50 group hover:border-blue-200 transition-colors">
                        <label className="block text-[13px] font-extrabold text-[#0000ff] mb-2 uppercase tracking-wide">Citizenship / Birth Cert <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input 
                            type="file" 
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-blue-100 file:text-[#0000ff] hover:file:bg-blue-200 cursor-pointer" 
                            required 
                          />
                        </div>
                    </div>
                </div>
            </div>

            {/* Declaration */}
            <div className="mt-10 pt-8 border-t border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 mt-0.5 text-[#0000ff] rounded border-gray-300 focus:ring-0 cursor-pointer" 
                      checked={formData.declaration}
                      onChange={(e) => setFormData({...formData, declaration: e.target.checked})}
                      required 
                    />
                    <span className="text-[15px] font-bold text-gray-800 leading-snug group-hover:text-blue-700 transition-colors">
                        I confirm that all information provided is correct. 
                        <span className="block text-[11px] text-gray-400 font-bold mt-1 uppercase tracking-wider">I understand that any false information may result in rejection.</span>
                    </span>
                </label>
            </div>

            {/* Submit Button */}
            <div className="mt-10 flex justify-end">
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-[#0000ff] hover:bg-[#0000cc] text-white font-bold text-[17px] py-4 px-16 rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                    Submit Application
                </button>
            </div>

        </form>
      </main>
      
      {/* Styles for print and complex elements */}
      <style jsx global>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        @media print {
          body { background: white !important; padding: 0 !important; }
          .no-print { display: none !important; }
          #printable-admit-card {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
