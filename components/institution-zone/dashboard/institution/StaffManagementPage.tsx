"use client";

import React, { useState } from "react";
import { 
  Users, UserPlus, Phone, Mail, 
  Search, Filter, MoreHorizontal,
  ChevronDown, Building, BookOpen,
  Award, Edit2, Trash2, MailQuestion, Eye
} from "lucide-react";

interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave" | "Exited";
  color: string;
}

const StaffManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const staffList: Staff[] = [
    { id: "1", name: "Dr. Ram Sharma", role: "Principal", department: "Administration", email: "ram.sharma@ncit.edu.np", phone: "9851012345", status: "Active", color: "blue" },
    { id: "2", name: "Er. Sita Poudel", role: "HOD", department: "Computer", email: "sita.poudel@ncit.edu.np", phone: "9841098765", status: "Active", color: "emerald" },
    { id: "3", name: "Prof. Hari Bhatta", role: "Lecturer", department: "IT", email: "hari.bhatta@ncit.edu.np", phone: "9861234567", status: "On Leave", color: "amber" },
    { id: "4", name: "Ar. Gita Rai", role: "Lecturer", department: "Architecture", email: "gita.rai@ncit.edu.np", phone: "9801234567", status: "Active", color: "purple" },
  ];

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Faculty & Staff</h1>
          <p className="text-slate-500 text-sm mt-1">Manage academic and administrative personnel directory.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
              <MailQuestion className="w-4 h-4" /> Bulk Email
           </button>
           <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm">
              <UserPlus className="w-4 h-4" /> Add Member
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                 type="text" 
                 placeholder="Search by name, department..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
              />
           </div>
           <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
             <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50">
               <Filter className="w-3 h-3" /> All Depts <ChevronDown className="w-3 h-3" />
             </button>
             <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50">
               <Building className="w-3 h-3" /> Role <ChevronDown className="w-3 h-3" />
             </button>
             <button className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
               Total: {staffList.length}
             </button>
           </div>
        </div>

        {/* Staff Grid/Table */}
        <div className="flex-1 overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100 uppercase text-[10px] font-bold text-slate-500 tracking-wider">
                 <tr>
                    <th className="px-6 py-4">Name & Role</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="font-bold divide-y divide-slate-100">
                 {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors group">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full bg-${staff.color}-50 text-${staff.color}-600 flex items-center justify-center font-bold text-sm shadow-sm border border-${staff.color}-100`}>
                                {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                             </div>
                             <div>
                                <p className="text-sm text-slate-900">{staff.name}</p>
                                <p className="text-[10px] text-slate-400 uppercase italic">{staff.role}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                             {staff.department}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="space-y-1">
                             <p className="text-[11px] text-slate-500 flex items-center gap-1.5"><Mail className="w-3 h-3" /> {staff.email}</p>
                             <p className="text-[11px] text-slate-500 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {staff.phone}</p>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase ring-1 ${
                             staff.status === "Active" ? "bg-emerald-50 text-emerald-600 ring-emerald-100" :
                             staff.status === "On Leave" ? "bg-amber-50 text-amber-600 ring-amber-100" :
                             "bg-slate-50 text-slate-600 ring-slate-100"
                          }`}>
                            {staff.status}
                          </span>
                       </td>
                       <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button title="View Profile" className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-100"><Eye className="w-4 h-4" /></button>
                             <button title="Edit" className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-100"><Edit2 className="w-4 h-4" /></button>
                             <button title="Remove" className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-rose-600 border border-transparent hover:border-slate-100"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {filteredStaff.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-20 text-center text-slate-400 font-bold">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        No members found matching your search.
                     </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-xs font-bold text-slate-400">
           <p>Showing {filteredStaff.length} of {staffList.length} members</p>
           <div className="flex gap-2">
              <button disabled className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Previous</button>
              <button disabled className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Next</button>
           </div>
        </div>
      </div>
      
      {/* Footer stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-bold">
         <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BookOpen className="w-5 h-5"/></div>
            <div>
               <p className="text-xl text-slate-900">42</p>
               <p className="text-xs text-slate-400 uppercase italic">Teaching Faculty</p>
            </div>
         </div>
         <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Award className="w-5 h-5"/></div>
            <div>
               <p className="text-xl text-slate-900">18</p>
               <p className="text-xs text-slate-400 uppercase italic">Ph.D. Holders</p>
            </div>
         </div>
         <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Users className="w-5 h-5"/></div>
            <div>
               <p className="text-xl text-slate-900">1:20</p>
               <p className="text-xs text-slate-400 uppercase italic">Student-Faculty Ratio</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StaffManagementPage;
