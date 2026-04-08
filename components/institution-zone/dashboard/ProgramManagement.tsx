"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  FolderOpen, 
  BookOpen, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface Program {
  id: number;
  name: string;
  level: string;
  affiliation: string;
  status: 'Ongoing' | 'Closed';
}

const TABS = ['+2', 'Bachelor', 'Master', 'Diploma', 'Training'];

const defaultPrograms: Program[] = [
  { id: 1, name: 'Science', level: '+2', affiliation: 'NEB', status: 'Ongoing' },
  { id: 2, name: 'Management', level: '+2', affiliation: 'NEB', status: 'Ongoing' },
  { id: 3, name: 'Humanities', level: '+2', affiliation: 'NEB', status: 'Closed' },
  { id: 4, name: 'BCA (Bachelor of Computer Application)', level: 'Bachelor', affiliation: 'TU', status: 'Ongoing' },
  { id: 5, name: 'BBA (Bachelor of Business Administration)', level: 'Bachelor', affiliation: 'PU', status: 'Ongoing' },
  { id: 6, name: 'Civil Engineering', level: 'Bachelor', affiliation: 'TU', status: 'Ongoing' },
  { id: 7, name: 'MBA (Master of Business Administration)', level: 'Master', affiliation: 'TU', status: 'Ongoing' },
  { id: 8, name: 'Computer Engineering', level: 'Diploma', affiliation: 'CTEVT', status: 'Ongoing' },
  { id: 9, name: 'Web Development Bootcamp', level: 'Training', affiliation: 'Internal', status: 'Closed' }
];

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export default function ProgramManagement() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [currentTab, setCurrentTab] = useState('+2');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCol, setSortCol] = useState<keyof Program>('name');
  const [sortAsc, setSortAsc] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<Program | null>(null);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    level: '+2',
    affiliation: '',
    status: 'Ongoing' as 'Ongoing' | 'Closed'
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('college_programs_data');
    if (saved) {
      setPrograms(JSON.parse(saved));
    } else {
      setPrograms(defaultPrograms);
    }
  }, []);

  const saveToStorage = (updatedPrograms: Program[]) => {
    localStorage.setItem('college_programs_data', JSON.stringify(updatedPrograms));
    setPrograms(updatedPrograms);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSort = (col: keyof Program) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  const filteredAndSortedPrograms = useMemo(() => {
    let filtered = programs.filter(p => {
      const matchesTab = p.level === currentTab;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.affiliation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });

    return filtered.sort((a, b) => {
      const valA = String(a[sortCol]).toLowerCase();
      const valB = String(b[sortCol]).toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [programs, currentTab, searchQuery, sortCol, sortAsc]);

  const openAddModal = () => {
    setProgramToEdit(null);
    setFormData({
      name: '',
      level: currentTab,
      affiliation: '',
      status: 'Ongoing'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (program: Program) => {
    setProgramToEdit(program);
    setFormData({
      name: program.name,
      level: program.level,
      affiliation: program.affiliation,
      status: program.status
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (programToEdit) {
      const updated = programs.map(p => 
        p.id === programToEdit.id ? { ...p, ...formData } : p
      );
      saveToStorage(updated);
      showToast('Program updated successfully');
    } else {
      const newProgram: Program = {
        id: programs.length > 0 ? Math.max(...programs.map(p => p.id)) + 1 : 1,
        ...formData
      };
      saveToStorage([...programs, newProgram]);
      showToast('Program added successfully');
      if (formData.level !== currentTab) {
        setCurrentTab(formData.level);
      }
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (program: Program) => {
    setProgramToDelete(program);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (programToDelete) {
      const updated = programs.filter(p => p.id !== programToDelete.id);
      saveToStorage(updated);
      showToast('Program deleted successfully');
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transform transition-all duration-300 animate-in slide-in-from-right-full ${
              toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            Program Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage all college programs, affiliations, and statuses.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Program
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 pt-4 bg-gray-50/50">
          <nav className="flex space-x-6 overflow-x-auto pb-px">
            {TABS.map(tab => (
              <button 
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 outline-none ${
                  currentTab === tab 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab} Programs
              </button>
            ))}
          </nav>
        </div>

        {/* Table Controls */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search programs or affiliations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filteredAndSortedPrograms.length}</span> programs
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredAndSortedPrograms.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'name', label: 'Program Name' },
                    { key: 'level', label: 'Level' },
                    { key: 'affiliation', label: 'Affiliation' },
                    { key: 'status', label: 'Status' }
                  ].map((col) => (
                    <th 
                      key={col.key}
                      scope="col" 
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none transition-colors ${sortCol === col.key ? 'bg-gray-100' : ''}`}
                      onClick={() => handleSort(col.key as keyof Program)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortCol === col.key ? (
                          sortAsc ? <ArrowUp className="w-3 h-3 text-indigo-600" /> : <ArrowDown className="w-3 h-3 text-indigo-600" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedPrograms.map(program => (
                  <tr key={program.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{program.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-gray-100 text-gray-800">
                        {program.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{program.affiliation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${program.status === 'Ongoing' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 self-center ${program.status === 'Ongoing' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        {program.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openEditModal(program)}
                        className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-md hover:bg-indigo-50 transition-colors mr-2 opacity-0 group-hover:opacity-100 focus:opacity-100" 
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(program)}
                        className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No programs found</h3>
              <p className="text-gray-500 text-sm max-w-sm">There are no programs available matching your criteria. Try adjusting your search or click "Add Program" to create one.</p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full animate-in zoom-in-95 duration-200">
              <form onSubmit={handleSave}>
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900">
                          {programToEdit ? 'Edit Program' : 'Add New Program'}
                        </h3>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Program Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Science, BBA, Civil Engineering" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Level <span className="text-red-500">*</span></label>
                            <select 
                              required 
                              value={formData.level}
                              onChange={(e) => setFormData({...formData, level: e.target.value})}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-white"
                            >
                              {TABS.map(tab => <option key={tab} value={tab}>{tab}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
                            <select 
                              required 
                              value={formData.status}
                              onChange={(e) => setFormData({...formData, status: e.target.value as 'Ongoing' | 'Closed'})}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-white"
                            >
                              <option value="Ongoing">Ongoing</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Affiliation / Board <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. NEB, TU, CTEVT" 
                            value={formData.affiliation}
                            onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
                  <button 
                    type="submit" 
                    className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto transition-colors"
                  >
                    Save Program
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && programToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsDeleteModalOpen(false)}
            ></div>

            <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-in zoom-in-95 duration-200">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">Delete Program</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <strong className="text-gray-900">{programToDelete.name}</strong>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={handleDelete}
                  className="inline-flex w-full justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto transition-colors"
                >
                  Delete
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
