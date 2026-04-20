import React, { useEffect, useMemo, useRef, useState } from "react";

interface ComparisonCollege {
  name?: string;
  logo?: string;
  location?: string;
  rating?: number;
  reviews_count?: number;
}

interface CollegeComparisonResultPageProps {
  onNavigate: (view: any, data?: any) => void;
  college1?: ComparisonCollege | string;
  college2?: ComparisonCollege | string;
}

type TabKey =
  | "overview"
  | "academics"
  | "facilities"
  | "financial"
  | "career"
  | "reviews"
  | "photos";

interface CompareRow {
  label: string;
  left: string;
  right: string;
}

interface CompareSection {
  title: string;
  rows: CompareRow[];
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "academics", label: "Academics" },
  { key: "facilities", label: "Facilities" },
  { key: "financial", label: "Financial & Scholarship" },
  { key: "career", label: "Career & Placement" },
  { key: "reviews", label: "Reviews & Reputation" },
  { key: "photos", label: "Photos & Video" },
];

const leftCourseOptions = [
  "BSc. CSIT",
  "BCA",
  "BBA",
  "BIM",
  "BBS",
  "BIT",
];

const rightCourseOptions = [
  "All Courses",
  "BSc. CSIT",
  "BCA",
  "BBA",
  "BBS",
  "BA",
];

const renderComparisonRows = (rows: CompareRow[]) => (
  <div className="border border-gray-200 rounded-md overflow-hidden bg-white ">
    {rows.map((row, index) => {
      const isLast = index === rows.length - 1;
      return (
        <div key={row.label}>
          <div
            className={`bg-[#f8fafe] px-4 md:px-6 py-2.5 text-[14px] font-medium text-slate-600 ${
              isLast ? "" : "border-b border-gray-200"
            }`}
          >
            {row.label}
          </div>
          <div
            className={`grid grid-cols-2 bg-white ${
              isLast ? "" : "border-b border-gray-200"
            }`}
          >
            <div className="p-4 md:px-6 border-r border-gray-200">
              <span className="text-gray-900 font-semibold text-[15px]">{row.left}</span>
            </div>
            <div className="p-4 md:px-6">
              <span className="text-gray-900 font-semibold text-[15px]">{row.right}</span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const renderGroupedSections = (sections: CompareSection[]) => (
  <>
    {sections.map((section) => (
      <div key={section.title} className="mt-8 first:mt-0">
        <h3 className="text-[17px] font-bold text-gray-800 mb-3 pl-1">{section.title}</h3>
        {renderComparisonRows(section.rows)}
      </div>
    ))}
  </>
);

const CollegeComparisonResultPage: React.FC<CollegeComparisonResultPageProps> = ({ 
  onNavigate,
  college1,
  college2
}) => {
  const college1Obj: ComparisonCollege =
    typeof college1 === "string"
      ? { name: college1 }
      : college1 || {};
  const college2Obj: ComparisonCollege =
    typeof college2 === "string"
      ? { name: college2 }
      : college2 || {};

  const c1Name = college1Obj.name || "KIST College";
  const c2Name = college2Obj.name || "GoldenGate Int'l";

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [leftCourse, setLeftCourse] = useState("BSc. CSIT");
  const [rightCourse, setRightCourse] = useState("All Courses");
  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");
  const [leftDropdownOpen, setLeftDropdownOpen] = useState(false);
  const [rightDropdownOpen, setRightDropdownOpen] = useState(false);

  const leftDropdownRef = useRef<HTMLDivElement>(null);
  const rightDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (
        leftDropdownRef.current &&
        !leftDropdownRef.current.contains(event.target as Node)
      ) {
        setLeftDropdownOpen(false);
      }

      if (
        rightDropdownRef.current &&
        !rightDropdownRef.current.contains(event.target as Node)
      ) {
        setRightDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  const filteredLeftCourses = useMemo(
    () =>
      leftCourseOptions.filter((option) =>
        option.toLowerCase().includes(leftSearch.toLowerCase()),
      ),
    [leftSearch],
  );

  const filteredRightCourses = useMemo(
    () =>
      rightCourseOptions.filter((option) =>
        option.toLowerCase().includes(rightSearch.toLowerCase()),
      ),
    [rightSearch],
  );

  const overviewRows: CompareRow[] = [
    { label: "Year Established", left: "1995", right: "2007" },
    {
      label: "Type (Private / Public / Community)",
      left: "Private",
      right: "Private",
    },
    {
      label: "Affiliated University",
      left: "Pokhara University (PU)",
      right: "Tribhuvan University (TU)",
    },
    { label: "Total Students (Approx.)", left: "3,500+", right: "2,800+" },
    { label: "Campus Size", left: "3 Acres", right: "2.5 Acres" },
    {
      label: "Class Mode (Physical / Hybrid / Online)",
      left: "Physical / Hybrid",
      right: "Physical",
    },
  ];

  const academicsSections: CompareSection[] = [
    {
      title: "Programs Offered",
      rows: [
        {
          label: "+2 Programs",
          left: "Science, Management",
          right: "Science, Management, Humanities",
        },
        {
          label: "Bachelor Programs",
          left: "BBA, BIM, BIT, BBS",
          right: "BSc. CSIT, BCA, BBA, BA",
        },
        {
          label: "Master Programs",
          left: "MBS, MIT",
          right: "MSc, MA, MBS",
        },
      ],
    },
    {
      title: "Academic Structure",
      rows: [
        {
          label: "Semester / Annual System",
          left: "Semester Based",
          right: "Semester Based",
        },
        {
          label: "Credit System (Yes/No)",
          left: "Yes (120 Credits)",
          right: "Yes (120 Credits)",
        },
        {
          label: "Internship Included (Yes/No)",
          left: "Yes (Mandatory in 8th Sem)",
          right: "Yes",
        },
      ],
    },
    {
      title: "Faculty Information",
      rows: [
        { label: "Total Faculty", left: "120+", right: "100+" },
        {
          label: "% with Masters / PhD",
          left: "85% Masters / 15% PhD",
          right: "80% Masters / 12% PhD",
        },
        {
          label: "Industry Experience (Yes/No)",
          left: "Yes (IT & Mgmt Experts)",
          right: "Yes",
        },
      ],
    },
    {
      title: "Academic Performance",
      rows: [
        { label: "Board / University Pass Rate", left: "88%", right: "85%" },
        { label: "Distinction / GPA Holders", left: "22%", right: "18%" },
        {
          label: "Research / Project-Based Learning",
          left: "High Emphasis (Annual IT Fests)",
          right: "Moderate",
        },
      ],
    },
  ];

  const facilitiesSections: CompareSection[] = [
    {
      title: "Academic Facilities",
      rows: [
        {
          label: "Computer Labs (No. of Labs)",
          left: "5 Labs (200+ PCs)",
          right: "4 Labs (150+ PCs)",
        },
        {
          label: "Science Labs",
          left: "Physics, Chemistry, Biology",
          right: "Physics, Chemistry, Biology",
        },
        {
          label: "Engineering Workshops",
          left: "No",
          right: "Yes (Basic Electronics)",
        },
        {
          label: "Library (No. of Books)",
          left: "15,000+ Books",
          right: "12,000+ Books",
        },
        {
          label: "E-Library Access",
          left: "Yes (ProQuest, IEEE)",
          right: "Yes (HINARI, Local Portal)",
        },
      ],
    },
    {
      title: "Student Facilities",
      rows: [
        {
          label: "Hostel (Boys / Girls)",
          left: "Available (Both)",
          right: "Available (Both)",
        },
        {
          label: "Transportation",
          left: "Valley-wide Service",
          right: "Limited Routes",
        },
        {
          label: "Cafeteria",
          left: "2 Hygienic Canteens",
          right: "Standard Cafeteria",
        },
        {
          label: "Sports (Indoor / Outdoor)",
          left: "Basketball, TT, Futsal",
          right: "Basketball, TT, Badminton",
        },
        {
          label: "Clubs",
          left: "IT, Robotics, Management, Debate",
          right: "IT, Sports, Arts & Culture",
        },
        {
          label: "Healthcare / First Aid",
          left: "On-campus Clinic & Nurse",
          right: "Basic First Aid",
        },
        {
          label: "Counseling Services",
          left: "Weekly Sessions",
          right: "On-demand",
        },
      ],
    },
    {
      title: "Digital Infrastructure",
      rows: [
        {
          label: "Student Portal",
          left: "Yes (Attendance, Grades, Notes)",
          right: "Yes (Basic Portal)",
        },
        {
          label: "WiFi Access",
          left: "Campus-wide (High-speed)",
          right: "Limited Zones",
        },
        {
          label: "Online Exam System",
          left: "Moodle Based",
          right: "Custom Portal",
        },
      ],
    },
  ];

  const financialSections: CompareSection[] = [
    {
      title: "Fee Structure",
      rows: [
        {
          label: "Total Fee Range (Approx.)",
          left: "NPR 6,00,000 - 12,00,000",
          right: "NPR 5,50,000 - 10,00,000",
        },
        {
          label: "Admission Fee",
          left: "NPR 50,000 (One-time)",
          right: "NPR 40,000 (One-time)",
        },
        {
          label: "Exam Fee (if separate)",
          left: "As per University Norms",
          right: "As per University Norms",
        },
      ],
    },
    {
      title: "Payment Options",
      rows: [
        {
          label: "Installment Available",
          left: "Yes (Semester-wise)",
          right: "Yes (Quarterly)",
        },
        {
          label: "EMI Option",
          left: "Available via Nabil Bank",
          right: "Not Available",
        },
        {
          label: "Payment Mode (Bank / Online)",
          left: "eSewa, ConnectIPS, Bank Deposit",
          right: "Bank Deposit Only",
        },
      ],
    },
    {
      title: "Scholarship Types",
      rows: [
        {
          label: "Merit-Based",
          left: "Up to 100% (GPA 3.6+)",
          right: "Up to 75% (GPA 3.6+)",
        },
        {
          label: "Need-Based",
          left: "Yes (Up to 50% waiver)",
          right: "Yes (Subject to verification)",
        },
        {
          label: "Entrance-Based",
          left: "Top 10 Rankers",
          right: "Top 5 Rankers",
        },
        {
          label: "Government Quota",
          left: "10% seats reserved",
          right: "10% seats reserved",
        },
        {
          label: "Special Category (Dalit / Remote Area / etc.)",
          left: "As per TU/PU regulations",
          right: "As per TU regulations",
        },
      ],
    },
    {
      title: "Financial Transparency",
      rows: [
        {
          label: "Refund Policy",
          left: "Security Deposit only",
          right: "Strict (No tuition refund)",
        },
        {
          label: "Hidden Charges (If Reported)",
          left: "Field trips / Events extra",
          right: "Handouts / Printed materials extra",
        },
      ],
    },
  ];

  const careerSections: CompareSection[] = [
    {
      title: "Career Support",
      rows: [
        {
          label: "Career Counseling (Yes/No)",
          left: "Yes (Dedicated Placement Cell)",
          right: "Yes (Faculty Advised)",
        },
        {
          label: "CV / Interview Training",
          left: "Regular Workshops & Mock Tests",
          right: "Occasional Seminars",
        },
        {
          label: "Internship Placement Assistance",
          left: "Strong (IT & Banking Sector)",
          right: "Moderate Support",
        },
        {
          label: "Job Fair Organized",
          left: "Yes (Annual IT & Mgmt Fest)",
          right: "Yes",
        },
      ],
    },
    {
      title: "Placement Information",
      rows: [
        {
          label: "MoU Companies",
          left: "F1Soft, Leapfrog, Nabil Bank",
          right: "Local IT Firms, Commercial Banks",
        },
        { label: "Placement Support (Yes/No)", left: "Yes", right: "Yes" },
        { label: "Placement Rate", left: "~75% (Specifically in IT)", right: "~65%" },
        {
          label: "Average Salary Range (Entry-level)",
          left: "NPR 25,000 - 45,000 / month",
          right: "NPR 20,000 - 35,000 / month",
        },
      ],
    },
    {
      title: "Alumni Network",
      rows: [
        {
          label: "Notable Alumni",
          left: "Tech Entrepreneurs, Senior Bankers",
          right: "Government Officials, Entrepreneurs",
        },
        {
          label: "Alumni Association",
          left: "Highly Active (KIST Alumni Society)",
          right: "Registered & Active",
        },
        {
          label: "Alumni Mentorship",
          left: "Yes (Frequent Guest Lectures)",
          right: "Informal Networking",
        },
      ],
    },
    {
      title: "Higher Study Support",
      rows: [
        {
          label: "Abroad Counseling",
          left: "Yes (In-house Guidance Cell)",
          right: "Basic General Guidance",
        },
        {
          label: "Recommendation Letters",
          left: "Standardized & Prompt Process",
          right: "Provided Upon Request",
        },
        {
          label: "Test Preparation Support",
          left: "Tie-ups with Top Consultancies",
          right: "Not Specifically Provided",
        },
      ],
    },
  ];

  const initials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  return (
    <div className="bg-gray-50/50 text-gray-800 min-h-screen p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Compare {c1Name} vs {c2Name}
          </h1>
          <button className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm">
            <i className="fa-solid fa-share-nodes text-[13px]"></i>
            Share
          </button>
        </div>

        <div className="relative border border-gray-200 rounded-md bg-white  flex flex-col md:flex-row overflow-visible">
          <div className="absolute left-1/2 top-[100px] md:top-24 transform -translate-x-1/2 -translate-y-1/2 bg-[#1b254b] text-white rounded-full w-8 h-8 items-center justify-center text-[10px] font-bold z-10 border-[3px] border-white  hidden md:flex">
            VS
          </div>

          <div className="flex-1 flex flex-col md:border-r border-gray-200">
            <div className="p-5 md:p-6 relative flex gap-4 rounded-tl-xl md:rounded-bl-none">
              <button 
                onClick={() => onNavigate("search")}
                className="absolute top-4 right-4 p-1.5 border border-gray-200 rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
              >
                <i className="fa-solid fa-pen text-[11px]"></i>
              </button>

              <div className="w-[72px] h-[72px] border border-gray-200 rounded-md flex items-center justify-center p-1 flex-shrink-0 bg-white  overflow-hidden">
                {college1Obj.logo ? (
                  <img src={college1Obj.logo} alt={c1Name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-sm font-bold text-indigo-700">{initials(c1Name)}</span>
                )}
              </div>

              <div className="flex-1">
                <button className="text-xl font-semibold text-[#2c51c6] hover:underline block mb-1 text-left">
                  {c1Name}
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#10b981] text-white px-1.5 py-0.5 rounded flex items-center gap-1 text-sm font-bold">
                    <i className="fa-solid fa-star text-[11px]"></i>
                    {college1Obj.rating?.toFixed(1) || "4.2"}
                  </span>
                  <span className="text-[#64748b] text-sm">
                    ({college1Obj.reviews_count?.toLocaleString() || "1.2k"} Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative border-t md:border-t-0 border-gray-200">
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-[#1b254b] text-white rounded-full w-8 h-8 flex items-center justify-center text-[10px] font-bold z-10 border-[3px] border-white  md:hidden">
              VS
            </div>

            <div className="p-5 md:p-6 relative flex gap-4">
              <button 
                onClick={() => onNavigate("search")}
                className="absolute top-4 right-4 p-1.5 border border-gray-200 rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
              >
                <i className="fa-solid fa-pen text-[11px]"></i>
              </button>

              <div className="w-[72px] h-[72px] border border-gray-200 rounded-md flex items-center justify-center p-1 flex-shrink-0 bg-white  overflow-hidden">
                {college2Obj.logo ? (
                  <img src={college2Obj.logo} alt={c2Name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-sm font-bold text-indigo-700">{initials(c2Name)}</span>
                )}
              </div>

              <div className="flex-1">
                <button className="text-xl font-semibold text-[#2c51c6] hover:underline block mb-1 text-left">
                  {c2Name}
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#f59e0b] text-white px-1.5 py-0.5 rounded flex items-center gap-1 text-sm font-bold">
                    <i className="fa-solid fa-star text-[11px]"></i>
                    {college2Obj.rating?.toFixed(1) || "4.0"}
                  </span>
                  <span className="text-[#64748b] text-sm">(980 Reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-b border-gray-200">
          <ul className="flex overflow-x-auto text-sm font-medium text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <li className="mr-2" key={tab.key}>
                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-block px-4 py-3 border-b-2 rounded-t-lg whitespace-nowrap ${
                    activeTab === tab.key
                      ? "text-[#2c51c6] border-[#2c51c6] font-semibold"
                      : "text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 mb-16">
          {activeTab === "overview" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-table-columns text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Overview</h2>
              </div>
              {renderComparisonRows(overviewRows)}
            </div>
          )}

          {activeTab === "academics" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-graduation-cap text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Academics</h2>
              </div>
              {renderGroupedSections(academicsSections)}
            </div>
          )}

          {activeTab === "facilities" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-building text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Facilities</h2>
              </div>
              {renderGroupedSections(facilitiesSections)}
            </div>
          )}

          {activeTab === "financial" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-wallet text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Financial & Scholarship</h2>
              </div>
              {renderGroupedSections(financialSections)}
            </div>
          )}

          {activeTab === "career" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-briefcase text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Career & Placement</h2>
              </div>
              {renderGroupedSections(careerSections)}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-star text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Reviews & Reputation</h2>
              </div>

              <h3 className="text-[17px] font-bold text-gray-800 mb-3 mt-6 pl-1">Student Ratings (Out of 5)</h3>
              {renderComparisonRows([
                { label: "Teaching Quality", left: "4.4 ★", right: "4.1 ★" },
                { label: "Infrastructure", left: "4.0 ★", right: "3.8 ★" },
                { label: "Administration", left: "3.9 ★", right: "3.5 ★" },
                { label: "Value for Money", left: "4.2 ★", right: "4.0 ★" },
                { label: "Campus Life", left: "4.5 ★", right: "3.9 ★" },
                { label: "Overall Rating", left: "4.2 ★", right: "4.0 ★" },
              ])}

              <div className="flex items-center gap-2 mb-4 mt-10 pl-1">
                <i className="fa-regular fa-message text-[#1b254b]"></i>
                <h3 className="text-[19px] font-bold text-[#1b254b]">Reviews</h3>
              </div>

              <div className="border border-gray-200 rounded-md overflow-hidden bg-white  flex flex-col md:flex-row">
                <div className="flex-1 flex flex-col md:border-r border-gray-200">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-[#2e7d32] rounded-sm mr-2"></div>
                        <span className="flex items-center gap-1 bg-[#2e7d32] text-white px-2 py-0.5 rounded text-[15px] font-bold">
                          <i className="fa-solid fa-star text-[11px]"></i> 4.5
                        </span>
                      </div>
                      <span className="text-[13px] text-gray-500 mt-1">updated on 15 Feb 2026</span>
                    </div>
                    <div className="mt-3 text-[13px]">
                      <span className="text-gray-500">rated by a BSc. CSIT Student in Kathmandu</span>
                      <div className="text-gray-900 font-semibold mt-0.5">Tribhuvan University (TU) · Full Time</div>
                    </div>
                    <div className="mt-5">
                      <h4 className="font-bold text-gray-900 text-[15px] mb-1">Likes</h4>
                      <p className="text-[14.5px] text-gray-700 leading-relaxed">
                        Great faculty for core subjects, good library resources, and active student clubs organizing regular tech fests.
                      </p>
                    </div>
                    <div className="mt-4 mb-2">
                      <h4 className="font-bold text-gray-900 text-[15px] mb-1">Dislikes</h4>
                      <p className="text-[14.5px] text-gray-700 leading-relaxed">
                        Practical labs need hardware upgrades. Administration processes can be quite slow during exam form submissions.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 p-4 bg-white">
                    <button className="text-blue-600 font-bold text-[14.5px] hover:underline">View all TU student reviews</button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-[#2e7d32] rounded-sm mr-2"></div>
                        <span className="flex items-center gap-1 bg-[#2e7d32] text-white px-2 py-0.5 rounded text-[15px] font-bold">
                          <i className="fa-solid fa-star text-[11px]"></i> 4.2
                        </span>
                      </div>
                      <span className="text-[13px] text-gray-500 mt-1">updated on 28 Jan 2026</span>
                    </div>
                    <div className="mt-3 text-[13px]">
                      <span className="text-gray-500">rated by a BCA Student in Pokhara</span>
                      <div className="text-gray-900 font-semibold mt-0.5">Pokhara University (PU) · Full Time</div>
                    </div>
                    <div className="mt-5">
                      <h4 className="font-bold text-gray-900 text-[15px] mb-1">Likes</h4>
                      <p className="text-[14.5px] text-gray-700 leading-relaxed">
                        Beautiful campus environment, updated modern curriculum for IT, and highly supportive professors.
                      </p>
                    </div>
                    <div className="mt-4 mb-2">
                      <h4 className="font-bold text-gray-900 text-[15px] mb-1">Dislikes</h4>
                      <p className="text-[14.5px] text-gray-700 leading-relaxed">
                        Extracurricular activities are somewhat limited compared to academics. Transportation to the main campus can be a hassle sometimes.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 p-4 bg-white">
                    <button className="text-blue-600 font-bold text-[14.5px] hover:underline">View all PU student reviews</button>
                  </div>
                </div>
              </div>

              <h3 className="text-[17px] font-bold text-gray-800 mb-3 mt-8 pl-1">Reputation Indicators</h3>
              {renderComparisonRows([
                {
                  label: "Awards & Achievements",
                  left: "Best IT College Award (2022)",
                  right: "Excellence in Education (2020)",
                },
                {
                  label: "Years of Operation Badge",
                  left: "25+ Years of Excellence",
                  right: "15+ Years Legacy",
                },
                {
                  label: "Media Mentions",
                  left: "Top 10 Colleges in Nepal",
                  right: "Tech Fest Highlights",
                },
                {
                  label: "Affiliation Recognition",
                  left: "TU & PU Highly Recognized",
                  right: "TU Recognized",
                },
              ])}
            </div>
          )}

          {activeTab === "photos" && (
            <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-md">
              Photos & Video content goes here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeComparisonResultPage;
