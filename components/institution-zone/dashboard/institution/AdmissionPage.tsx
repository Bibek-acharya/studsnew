"use client";
import React, { useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Search,
  Download,
  Plus,
  Files,
  Bookmark,
  Hourglass,
  CircleX,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Check,
  MessageSquare,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  BookmarkCheck,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type Level = "+2" | "Bachelor" | "Master" | "Diploma";
type TabLevel = Level | "ShortlistedOnly";
type ApplicantStatus = "Pending" | "Shortlisted" | "Approved" | "Rejected";
type Province = "Koshi" | "Madhesh" | "Bagmati" | "Gandaki" | "Lumbini" | "Karnali" | "Sudurpashchim";

interface Applicant {
  id: number;
  name: string;
  gender: "Male" | "Female";
  dob: string;
  level: Level;
  program: string;
  gpa: number;
  prevInstitution: string;
  email: string;
  phone: string;
  province: Province;
  district: string;
  address: string;
  status: ApplicantStatus;
}

const NEPAL_LOCATIONS: Record<Province, string[]> = {
  Koshi: ["Morang", "Sunsari", "Jhapa", "Dhankuta", "Ilam"],
  Madhesh: ["Parsa", "Bara", "Rautahat", "Sarlahi", "Dhanusha", "Siraha", "Saptari"],
  Bagmati: ["Kathmandu", "Lalitpur", "Bhaktapur", "Kavrepalanchok", "Chitwan", "Makwanpur"],
  Gandaki: ["Kaski", "Tanahun", "Syangja", "Nawalpur", "Gorkha"],
  Lumbini: ["Rupandehi", "Kapilvastu", "Banke", "Dang", "Palpa"],
  Karnali: ["Surkhet", "Dailekh", "Jumla", "Salyan"],
  Sudurpashchim: ["Kailali", "Kanchanpur", "Dadeldhura", "Baitadi"],
};

const APPLICANTS: Applicant[] = [
  { id: 125, name: "Aarav Sharma", gender: "Male", dob: "2003-06-14", level: "Bachelor", program: "BSc. CSIT", gpa: 3.8, prevInstitution: "Trinity Int. College", email: "student125@example.com", phone: "9812345678", province: "Bagmati", district: "Kathmandu", address: "Ward-5", status: "Shortlisted" },
  { id: 124, name: "Nisha Thapa", gender: "Female", dob: "2004-03-11", level: "+2", program: "Science", gpa: 3.5, prevInstitution: "St. Xavier's", email: "student124@example.com", phone: "9823456789", province: "Bagmati", district: "Bhaktapur", address: "Ward-12", status: "Pending" },
  { id: 123, name: "Rohan Karki", gender: "Male", dob: "2002-10-19", level: "Master", program: "MBA", gpa: 3.7, prevInstitution: "Global College", email: "student123@example.com", phone: "9834567890", province: "Gandaki", district: "Kaski", address: "Bazar", status: "Approved" },
  { id: 122, name: "Puja Rai", gender: "Female", dob: "2005-01-22", level: "Diploma", program: "Computer Eng.", gpa: 3.1, prevInstitution: "NIST", email: "student122@example.com", phone: "9845678901", province: "Lumbini", district: "Rupandehi", address: "Ward-8", status: "Pending" },
  { id: 121, name: "Bikash Magar", gender: "Male", dob: "2003-08-09", level: "Bachelor", program: "BCA", gpa: 2.9, prevInstitution: "KMC", email: "student121@example.com", phone: "9856789012", province: "Koshi", district: "Jhapa", address: "Chowk", status: "Rejected" },
  { id: 120, name: "Sita Gurung", gender: "Female", dob: "2002-12-01", level: "Master", program: "MSc. IT", gpa: 3.9, prevInstitution: "Little Angels", email: "student120@example.com", phone: "9867890123", province: "Bagmati", district: "Lalitpur", address: "Ward-4", status: "Approved" },
  { id: 119, name: "Pradeep Adhikari", gender: "Male", dob: "2004-07-17", level: "+2", program: "Management", gpa: 3.2, prevInstitution: "Sagarmatha College", email: "student119@example.com", phone: "9878901234", province: "Madhesh", district: "Dhanusha", address: "Ward-2", status: "Shortlisted" },
  { id: 118, name: "Anjali Tamang", gender: "Female", dob: "2003-11-27", level: "Bachelor", program: "BBM", gpa: 3.4, prevInstitution: "GoldenGate Int.", email: "student118@example.com", phone: "9889012345", province: "Karnali", district: "Surkhet", address: "Bazar", status: "Pending" },
  { id: 117, name: "Kiran Lama", gender: "Male", dob: "2005-02-06", level: "Diploma", program: "Civil Eng.", gpa: 3.0, prevInstitution: "Kathmandu Model College", email: "student117@example.com", phone: "9801112233", province: "Sudurpashchim", district: "Kailali", address: "Ward-9", status: "Shortlisted" },
  { id: 116, name: "Sunita Poudel", gender: "Female", dob: "2004-05-13", level: "+2", program: "Law", gpa: 3.6, prevInstitution: "Himalayan WhiteHouse", email: "student116@example.com", phone: "9802223344", province: "Bagmati", district: "Chitwan", address: "Ward-10", status: "Approved" },
  { id: 115, name: "Manish Yadav", gender: "Male", dob: "2003-09-21", level: "Bachelor", program: "BBS", gpa: 3.3, prevInstitution: "NIST", email: "student115@example.com", phone: "9803334455", province: "Madhesh", district: "Parsa", address: "Ward-1", status: "Pending" },
  { id: 114, name: "Gita Dahal", gender: "Female", dob: "2002-04-28", level: "Master", program: "MBS", gpa: 3.5, prevInstitution: "Trinity Int. College", email: "student114@example.com", phone: "9804445566", province: "Gandaki", district: "Nawalpur", address: "Ward-7", status: "Shortlisted" },
  { id: 113, name: "Hari Khatri", gender: "Male", dob: "2005-06-03", level: "+2", program: "Humanities", gpa: 2.8, prevInstitution: "Global College", email: "student113@example.com", phone: "9805556677", province: "Lumbini", district: "Dang", address: "Ward-3", status: "Rejected" },
  { id: 112, name: "Rina Chaudhary", gender: "Female", dob: "2004-01-25", level: "Diploma", program: "Nursing", gpa: 3.7, prevInstitution: "KIST", email: "student112@example.com", phone: "9806667788", province: "Sudurpashchim", district: "Kanchanpur", address: "Ward-6", status: "Approved" },
  { id: 111, name: "Nabin Gautam", gender: "Male", dob: "2003-03-30", level: "Bachelor", program: "B.Ed", gpa: 3.1, prevInstitution: "St. Xavier's", email: "student111@example.com", phone: "9807778899", province: "Koshi", district: "Morang", address: "Ward-11", status: "Pending" },
  { id: 110, name: "Bina Bhattarai", gender: "Female", dob: "2002-08-15", level: "Master", program: "MA", gpa: 3.8, prevInstitution: "Kathmandu Model College", email: "student110@example.com", phone: "9808889900", province: "Bagmati", district: "Makwanpur", address: "Chowk", status: "Shortlisted" },
  { id: 109, name: "Sujan Shrestha", gender: "Male", dob: "2005-11-12", level: "+2", program: "Science", gpa: 3.0, prevInstitution: "Little Angels", email: "student109@example.com", phone: "9811112234", province: "Koshi", district: "Sunsari", address: "Ward-13", status: "Pending" },
  { id: 108, name: "Ram Maharjan", gender: "Male", dob: "2003-01-05", level: "Bachelor", program: "BA", gpa: 2.9, prevInstitution: "GoldenGate Int.", email: "student108@example.com", phone: "9812223345", province: "Bagmati", district: "Kathmandu", address: "Ward-15", status: "Rejected" },
  { id: 107, name: "Kamal Gurung", gender: "Male", dob: "2004-09-08", level: "Diploma", program: "Agriculture", gpa: 3.4, prevInstitution: "Sagarmatha College", email: "student107@example.com", phone: "9813334456", province: "Gandaki", district: "Tanahun", address: "Ward-14", status: "Pending" },
  { id: 106, name: "Sandeep Tamang", gender: "Male", dob: "2003-07-07", level: "Bachelor", program: "BCA", gpa: 3.6, prevInstitution: "Himalayan WhiteHouse", email: "student106@example.com", phone: "9814445567", province: "Karnali", district: "Jumla", address: "Ward-4", status: "Shortlisted" },
  { id: 105, name: "Aarati Adhikari", gender: "Female", dob: "2002-05-09", level: "Master", program: "MBA", gpa: 3.2, prevInstitution: "KMC", email: "student105@example.com", phone: "9815556678", province: "Madhesh", district: "Siraha", address: "Ward-3", status: "Pending" },
];

const statusStyles: Record<ApplicantStatus, string> = {
  Pending: "bg-slate-100 text-slate-700 border-slate-200",
  Shortlisted: "bg-blue-100 text-blue-700 border-blue-200",
  Approved: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
};

const levels: Level[] = ["+2", "Bachelor", "Master", "Diploma"];
const templates: Record<string, string> = {
  shortlist: "Congratulations! You have been shortlisted for admission. Please check your portal for next steps.",
  interview: "We would like to invite you for an interview regarding your application. Please check your dashboard for details.",
  reject: "Thank you for your application. We regret to inform you that we cannot offer admission at this time.",
  missing: "Your application is currently pending due to missing documents. Please upload the required files as soon as possible.",
};

const ITEMS_PER_PAGE = 7;

const AdmissionPage: React.FC = () => {
  const [rows, setRows] = useState<Applicant[]>(APPLICANTS);
  const [activeLevel, setActiveLevel] = useState<TabLevel>("+2");
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState<"All" | Province>("All");
  const [district, setDistrict] = useState("All");
  const [minGpa, setMinGpa] = useState<number | "">("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageTargetName, setMessageTargetName] = useState("Selected Applicants");
  const [msgTemplate, setMsgTemplate] = useState<"" | "shortlist" | "interview" | "reject" | "missing">("");
  const [msgText, setMsgText] = useState("");

  const districtOptions = useMemo(() => {
    if (province === "All") return ["All"];
    return ["All", ...NEPAL_LOCATIONS[province]];
  }, [province]);

  const contextRows = useMemo(() => {
    if (activeLevel === "ShortlistedOnly") return rows;
    return rows.filter((row) => row.level === activeLevel);
  }, [activeLevel, rows]);

  const stats = useMemo(() => {
    const total = contextRows.length;
    const shortlisted = contextRows.filter((row) => row.status === "Shortlisted").length;
    const pending = contextRows.filter((row) => row.status === "Pending").length;
    const rejected = contextRows.filter((row) => row.status === "Rejected").length;
    return { total, shortlisted, pending, rejected, shortlistPct: total ? (shortlisted / total) * 100 : 0 };
  }, [contextRows]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const levelOk = activeLevel === "ShortlistedOnly" ? row.status === "Shortlisted" : row.level === activeLevel;
      if (!levelOk) return false;

      const s = search.trim().toLowerCase();
      const searchOk = !s || row.name.toLowerCase().includes(s) || row.email.toLowerCase().includes(s) || row.phone.includes(s);
      const provinceOk = province === "All" || row.province === province;
      const districtOk = district === "All" || row.district === district;
      const gpaOk = minGpa === "" || row.gpa >= minGpa;
      return searchOk && provinceOk && districtOk && gpaOk;
    });
  }, [activeLevel, district, minGpa, province, rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const pageStart = filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const pageEnd = Math.min(safePage * ITEMS_PER_PAGE, filtered.length);

  const programChartData = useMemo(() => {
    const source = activeLevel === "ShortlistedOnly" ? rows : rows.filter((row) => row.level === activeLevel);
    const counts: Record<string, number> = {};
    source.forEach((row) => {
      counts[row.program] = (counts[row.program] || 0) + 1;
    });
    return {
      labels: Object.keys(counts),
      datasets: [{ data: Object.values(counts), backgroundColor: "rgba(34, 197, 94, 0.8)", borderRadius: 6 }],
    };
  }, [activeLevel, rows]);

  const provinceChartData = useMemo(() => {
    const source = activeLevel === "ShortlistedOnly" ? rows : rows.filter((row) => row.level === activeLevel);
    const counts: Record<string, number> = {};
    source.forEach((row) => {
      counts[row.province] = (counts[row.province] || 0) + 1;
    });
    return {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e"],
        borderWidth: 0,
      }],
    };
  }, [activeLevel, rows]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: { legend: { position: "right" as const, labels: { boxWidth: 12, usePointStyle: true } } },
  };

  const resetFilters = () => {
    setSearch("");
    setProvince("All");
    setDistrict("All");
    setMinGpa("");
    setPage(1);
    setSelected([]);
  };

  const updateStatus = (id: number, status: ApplicantStatus) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    setSelected((prev) => (prev.length === paginated.length ? [] : paginated.map((row) => row.id)));
  };

  const bulkAction = (status: ApplicantStatus) => {
    const target = new Set(selected);
    setRows((prev) => prev.map((row) => (target.has(row.id) ? { ...row, status } : row)));
    setSelected([]);
  };

  const openSingleMessage = (name: string) => {
    setMessageTargetName(name);
    setShowMessageModal(true);
  };

  const openBulkMessage = () => {
    setMessageTargetName(`${selected.length} Selected Applicants`);
    setShowMessageModal(true);
  };

  const onTemplateChange = (value: "" | "shortlist" | "interview" | "reject" | "missing") => {
    setMsgTemplate(value);
    setMsgText(value ? templates[value] : "");
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 bg-slate-50 min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="bg-white rounded-md p-1  border border-slate-200 inline-flex overflow-x-auto max-w-full">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => {
                setActiveLevel(level);
                setSelected([]);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeLevel === level ? "bg-green-50 text-green-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {level === "+2" ? "+2 Programs" : level === "Bachelor" ? "Bachelor's" : level === "Master" ? "Master's" : "Diploma"}
            </button>
          ))}
          <div className="w-px h-6 bg-slate-300 mx-2 self-center" />
          <button
            onClick={() => {
              setActiveLevel("ShortlistedOnly");
              setSelected([]);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeLevel === "ShortlistedOnly" ? "bg-blue-100 text-blue-800" : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            <BookmarkCheck className="w-4 h-4" /> Shortlisted List
          </button>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium  hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium  hover:bg-green-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Manual Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-md p-5  border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Applications</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Files className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center gap-1"><TrendingUp className="w-4 h-4" /> 12%</span>
            <span className="text-slate-400 ml-2">vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-md p-5  border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Shortlisted</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.shortlisted}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${stats.shortlistPct}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-5  border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Review</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.pending}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Hourglass className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">Requires immediate action</div>
        </div>

        <div className="bg-white rounded-md p-5  border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Rejected</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.rejected}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <CircleX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-500 font-medium flex items-center gap-1"><TrendingDown className="w-4 h-4" /> 3%</span>
            <span className="text-slate-400 ml-2">vs last week</span>
          </div>
        </div>
      </div>

      {activeLevel !== "ShortlistedOnly" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-md  border border-slate-200 p-5">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Applications by Program</h3>
            <div className="h-64"><Bar data={programChartData} options={barOptions} /></div>
          </div>
          <div className="bg-white rounded-md  border border-slate-200 p-5">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Applicant Origin (Province)</h3>
            <div className="h-64"><Doughnut data={provinceChartData} options={doughnutOptions} /></div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-md  border border-slate-200 mb-8 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-end bg-slate-50/50">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Search Applicants</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, Email, Phone..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white " />
            </div>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Province</label>
            <select value={province} onChange={(event) => { const value = event.target.value as "All" | Province; setProvince(value); setDistrict("All"); setPage(1); }} className="w-full text-sm rounded-md border-slate-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
              <option value="All">All Provinces</option>
              {(Object.keys(NEPAL_LOCATIONS) as Province[]).map((prov) => <option key={prov} value={prov}>{prov}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">District</label>
            <select value={district} onChange={(event) => { setDistrict(event.target.value); setPage(1); }} className="w-full text-sm rounded-md border-slate-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
              {districtOptions.map((dist) => <option key={dist} value={dist}>{dist}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[100px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Min GPA</label>
            <input type="number" value={minGpa} onChange={(event) => { const val = event.target.value; setMinGpa(val === "" ? "" : Number.parseFloat(val)); setPage(1); }} step="0.1" min="0" max="4" placeholder="e.g. 2.5" className="w-full text-sm rounded-md border-slate-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
          </div>
          <div>
            <button onClick={resetFilters} className="py-2 px-4 bg-white border border-slate-300 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between transition-all">
            <span className="text-sm text-indigo-800 font-medium flex items-center gap-2">
              <Check className="w-4 h-4" /> {selected.length} applicants selected
            </span>
            <div className="flex gap-2">
              <button onClick={() => bulkAction("Shortlisted")} className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded  hover:bg-blue-700 transition-colors flex items-center gap-1"><Bookmark className="w-3.5 h-3.5" /> Shortlist</button>
              <button onClick={() => bulkAction("Approved")} className="px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded  hover:bg-green-700 transition-colors flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Approve</button>
              <button onClick={() => bulkAction("Rejected")} className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded  hover:bg-red-700 transition-colors flex items-center gap-1"><X className="w-3.5 h-3.5" /> Reject</button>
              <button onClick={openBulkMessage} className="px-3 py-1.5 text-xs font-semibold bg-slate-700 text-white rounded  hover:bg-slate-800 transition-colors flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Message</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap text-sm min-w-[1220px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <th className="p-4 py-3 w-12 text-center"><input type="checkbox" onChange={toggleSelectAll} checked={paginated.length > 0 && selected.length === paginated.length} className="rounded border-slate-300 text-green-500 focus:ring-green-500 cursor-pointer" /></th>
                <th className="p-4 py-3">Full Name</th>
                <th className="p-4 py-3">Program</th>
                <th className="p-4 py-3">GPA</th>
                <th className="p-4 py-3">Previous Institution</th>
                <th className="p-4 py-3">Contact Info</th>
                <th className="p-4 py-3">Location</th>
                <th className="p-4 py-3">Status</th>
                <th className="p-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-slate-500">No applicants found matching the criteria.</td></tr>
              ) : (
                paginated.map((row) => {
                  const isSelected = selected.includes(row.id);
                  return (
                    <tr key={row.id} className={`hover:bg-slate-50 transition-colors ${isSelected ? "bg-indigo-50/30" : ""}`}>
                      <td className="p-4 py-3 text-center">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(row.id)} className="rounded border-slate-300 text-green-500 focus:ring-green-500 cursor-pointer" />
                      </td>
                      <td className="p-4 py-3">
                        <div className="font-medium text-slate-800">{row.name}</div>
                        <div className="text-xs text-slate-500 flex gap-2"><span>{row.gender}</span> • <span>DOB: {row.dob}</span></div>
                      </td>
                      <td className="p-4 py-3"><span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">{activeLevel === "ShortlistedOnly" ? `${row.level} - ` : ""}{row.program}</span></td>
                      <td className="p-4 py-3 font-semibold text-slate-700">{row.gpa.toFixed(1)}</td>
                      <td className="p-4 py-3 text-slate-600"><div className="truncate max-w-[150px]" title={row.prevInstitution}>{row.prevInstitution}</div></td>
                      <td className="p-4 py-3 text-slate-600 text-xs">
                        <div>{row.email}</div>
                        <div>{row.phone}</div>
                      </td>
                      <td className="p-4 py-3 text-slate-600 text-xs">
                        <div className="truncate max-w-[160px]" title={`${row.address}, ${row.district}, ${row.province}`}>{row.address}, {row.district}, {row.province}</div>
                      </td>
                      <td className="p-4 py-3"><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[row.status]}`}>{row.status}</span></td>
                      <td className="p-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => updateStatus(row.id, "Shortlisted")} className={`p-1.5 rounded transition-colors ${row.status === "Shortlisted" ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"}`} title="Shortlist" disabled={row.status === "Shortlisted"}><Bookmark className="w-4 h-4" /></button>
                          <button onClick={() => updateStatus(row.id, "Approved")} className={`p-1.5 rounded transition-colors ${row.status === "Approved" ? "text-green-600 bg-green-50" : "text-slate-400 hover:text-green-600 hover:bg-green-50"}`} title="Approve" disabled={row.status === "Approved"}><Check className="w-4 h-4" /></button>
                          <button onClick={() => updateStatus(row.id, "Rejected")} className={`p-1.5 rounded transition-colors ${row.status === "Rejected" ? "text-red-600 bg-red-50" : "text-slate-400 hover:text-red-600 hover:bg-red-50"}`} title="Reject" disabled={row.status === "Rejected"}><X className="w-4 h-4" /></button>
                          <div className="w-px h-4 bg-slate-200 mx-1" />
                          <button onClick={() => openSingleMessage(row.name)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Send Message"><MessageSquare className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <p className="text-sm text-slate-500">Showing {pageStart} to {pageEnd} of {filtered.length} records</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={safePage === 1} className="p-2 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, safePage - 3), Math.max(0, safePage - 3) + 5)
                .map((n) => (
                  <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded border text-sm font-medium flex items-center justify-center ${n === safePage ? "border-green-500 bg-green-50 text-green-700" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                    {n}
                  </button>
                ))}
            </div>
            <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={safePage >= totalPages} className="p-2 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-green-600" /> Message Applicant</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">Send a direct message or SMS to <strong className="text-slate-800">{messageTargetName}</strong>.</p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
                <select value={msgTemplate} onChange={(event) => onTemplateChange(event.target.value as "" | "shortlist" | "interview" | "reject" | "missing")} className="w-full border-slate-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border">
                  <option value="">-- Custom Message --</option>
                  <option value="shortlist">Shortlist Notification</option>
                  <option value="interview">Interview Invitation</option>
                  <option value="reject">Rejection Notice</option>
                  <option value="missing">Missing Documents Request</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea rows={4} value={msgText} onChange={(event) => setMsgText(event.target.value)} placeholder="Type your message here..." className="w-full border-slate-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border" />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-green-500 focus:ring-green-500" />
                  <span className="text-slate-700">Send via Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-green-500 focus:ring-green-500" />
                  <span className="text-slate-700">Send via SMS</span>
                </label>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={() => setShowMessageModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={() => setShowMessageModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700  transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionPage;
