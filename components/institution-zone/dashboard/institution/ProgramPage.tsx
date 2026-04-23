"use client";
import React, { useState } from "react";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, AlertTriangle } from "lucide-react";

type Level = "All" | "+2" | "Bachelor" | "Master" | "Diploma" | "Training";
type Status = "Active" | "Inactive" | "Pending";

interface Program {
  id: number;
  name: string;
  level: Exclude<Level, "All">;
  affiliation: string;
  status: Status;
  duration: string;
}

const DEFAULT_PROGRAMS: Program[] = [
  { id: 1, name: "BSc CSIT", level: "Bachelor", affiliation: "Tribhuvan University", status: "Active", duration: "4 Years" },
  { id: 2, name: "BIM", level: "Bachelor", affiliation: "Tribhuvan University", status: "Active", duration: "4 Years" },
  { id: 3, name: "BBA", level: "Bachelor", affiliation: "Pokhara University", status: "Active", duration: "4 Years" },
  { id: 4, name: "MBA", level: "Master", affiliation: "Tribhuvan University", status: "Active", duration: "2 Years" },
  { id: 5, name: "MSc IT", level: "Master", affiliation: "Kathmandu University", status: "Inactive", duration: "2 Years" },
  { id: 6, name: "+2 Science", level: "+2", affiliation: "NEB", status: "Active", duration: "2 Years" },
  { id: 7, name: "+2 Management", level: "+2", affiliation: "NEB", status: "Active", duration: "2 Years" },
  { id: 8, name: "Diploma in IT", level: "Diploma", affiliation: "CTEVT", status: "Active", duration: "3 Years" },
  { id: 9, name: "Web Development Bootcamp", level: "Training", affiliation: "Internal", status: "Pending", duration: "3 Months" },
];

const LEVELS: Level[] = ["All", "+2", "Bachelor", "Master", "Diploma", "Training"];
const AFFILIATIONS = ["Tribhuvan University", "Pokhara University", "Kathmandu University", "Purbanchal University", "NEB", "CTEVT", "Internal", "Other"];

const statusColors: Record<Status, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-slate-100 text-slate-600",
  Pending: "bg-yellow-100 text-yellow-700",
};

type SortKey = "name" | "level" | "affiliation" | "status";

const emptyForm: Omit<Program, "id"> = {
  name: "", level: "Bachelor", affiliation: "Tribhuvan University", status: "Active", duration: "4 Years",
};

const ProgramPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>(DEFAULT_PROGRAMS);
  const [activeLevel, setActiveLevel] = useState<Level>("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Program, "id">>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = programs
    .filter(p => activeLevel === "All" || p.level === activeLevel)
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return sortAsc ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(prev => !prev);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="w-3.5 h-3.5 opacity-30" />;
    return sortAsc ? <ChevronUp className="w-3.5 h-3.5 text-indigo-600" /> : <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />;
  };

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p: Program) => { setEditId(p.id); setForm({ name: p.name, level: p.level, affiliation: p.affiliation, status: p.status, duration: p.duration }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId !== null) {
      setPrograms(prev => prev.map(p => p.id === editId ? { ...form, id: editId } : p));
    } else {
      const newId = Math.max(0, ...programs.map(p => p.id)) + 1;
      setPrograms(prev => [...prev, { ...form, id: newId }]);
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteId !== null) setPrograms(prev => prev.filter(p => p.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Program Management</h1>
          <p className="text-slate-500 text-sm mt-1">Add, edit and manage academic programs offered by your institution.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition-colors "
        >
          <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>

      {/* Level Tabs */}
      <div className="bg-white rounded-md border border-slate-200  overflow-hidden">
        <div className="flex gap-1 p-3 border-b border-slate-100 flex-wrap">
          {LEVELS.map(level => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeLevel === level ? "bg-indigo-600 text-white " : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-100">
                <th className="p-3 font-semibold">#</th>
                {(["name", "level", "affiliation", "status"] as SortKey[]).map(col => (
                  <th key={col} className="p-3 font-semibold">
                    <button
                      onClick={() => toggleSort(col)}
                      className="flex items-center gap-1 uppercase tracking-wide hover:text-slate-700 transition-colors"
                    >
                      {col === "name" ? "Program Name" : col.charAt(0).toUpperCase() + col.slice(1)}
                      <SortIcon col={col} />
                    </button>
                  </th>
                ))}
                <th className="p-3 font-semibold">Duration</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400 text-sm">No programs found for this level.</td></tr>
              ) : filtered.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-sm text-slate-400">{idx + 1}</td>
                  <td className="p-3 font-medium text-slate-800">{p.name}</td>
                  <td className="p-3 text-sm">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">{p.level}</span>
                  </td>
                  <td className="p-3 text-sm text-slate-600">{p.affiliation}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="p-3 text-sm text-slate-600">{p.duration}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-md hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100">
          <p className="text-sm text-slate-400">Total: {filtered.length} program{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-md shadow-2xl overflow-hidden m-4">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800">{editId ? "Edit Program" : "Add New Program"}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Program Name <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. BSc CSIT"
                  className="w-full border border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Academic Level</label>
                  <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value as Program["level"] }))} className="w-full border border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                    {(["+2", "Bachelor", "Master", "Diploma", "Training"] as Program["level"][]).map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                  <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 4 Years" className="w-full border border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Affiliation</label>
                <select value={form.affiliation} onChange={e => setForm(f => ({ ...f, affiliation: e.target.value }))} className="w-full border border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  {AFFILIATIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))} className="w-full border border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end p-4 border-t bg-slate-50">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md text-slate-600 hover:bg-slate-100 text-sm">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition-colors">
                {editId ? "Save Changes" : "Add Program"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-md shadow-2xl overflow-hidden m-4">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Program?</h3>
              <p className="text-sm text-slate-500">This action cannot be undone. The program and all associated data will be permanently deleted.</p>
              <div className="flex gap-3 justify-center pt-2">
                <button onClick={() => setDeleteId(null)} className="px-5 py-2 border rounded-md text-slate-700 hover:bg-slate-50 text-sm font-medium">Cancel</button>
                <button onClick={confirmDelete} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-colors">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramPage;
