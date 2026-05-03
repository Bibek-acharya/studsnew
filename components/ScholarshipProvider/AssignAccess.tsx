"use client";

import React, { useState, useEffect, memo } from "react";
import { Home, Users, Plus, Pencil, Trash2, Search, X, ShieldCheck, UserPlus, AlertTriangle, Eye, EyeOff, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  providerRbacApi,
  ProviderUser,
} from "@/services/providerRbac";


const STATUS_COLORS: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Inactive: "bg-red-100 text-red-700",
};

const PERMISSIONS = [
  { id: "scholarships", label: "Manage Scholarships", desc: "Create, edit, and delete scholarships" },
  { id: "applications", label: "Manage Applications", desc: "View, approve, and reject applications" },
  { id: "shortlists", label: "Manage Shortlists", desc: "Add and remove shortlisted applicants" },
  { id: "messages", label: "Message", desc: "Send and receive messages" },
  { id: "news", label: "Manage News", desc: "Create, edit, and publish news" },
  { id: "events", label: "Manage Events", desc: "Create, edit, and manage events" },
  { id: "blogs", label: "Manage Blogs", desc: "Create, edit, and publish blog posts" },
  { id: "profile", label: "Manage Profile", desc: "Edit organization profile details" },
  { id: "analytics", label: "Analytics", desc: "View analytics and reports" },
  { id: "evaluation", label: "Evaluation & Results", desc: "Manage written exam, interview, and final results" },
  { id: "access", label: "Assign Access", desc: "Manage user permissions and roles" },
  { id: "settings", label: "Settings", desc: "Configure system settings" },
];

const AssignAccess: React.FC = memo(() => {
  const [users, setUsers] = useState<ProviderUser[]>([]);
  const [search, setSearch] = useState("");

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [createdUser, setCreatedUser] = useState<ProviderUser | null>(null);

  // Step 1 fields
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [addError, setAddError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Step 2 - permissions
  const [wizardPermissions, setWizardPermissions] = useState<Record<string, boolean>>({});
  const [permSaving, setPermSaving] = useState(false);

  // Edit permissions (for existing users)
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [permUserName, setPermUserName] = useState("");
  const [permUserId, setPermUserId] = useState<number>(0);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  // Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ProviderUser | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadUsers() {
      try {
        const res = await providerRbacApi.getUsers();
        if (!mounted) return;
        setUsers(res.users || []);
      } catch {
        if (mounted) setUsers([]);
      }
    }
    loadUsers();
    return () => { mounted = false; };
  }, []);

  const filtered = search
    ? users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search))
    : users;

  const openWizard = () => {
    setWizardOpen(true);
    setWizardStep(1);
    setCreatedUser(null);
    setNewName(""); setNewEmail(""); setNewPassword("");
    setShowPassword(false);
    setAddError(""); setNameError(""); setEmailError(""); setPasswordError("");
    setWizardPermissions({});
  };

  const closeWizard = () => {
    setWizardOpen(false);
    setWizardStep(1);
    setCreatedUser(null);
  };

  // Step 1: validate and create user
  const handleStep1 = async () => {
    setAddError(""); setNameError(""); setEmailError(""); setPasswordError("");
    let hasError = false;
    if (!newName.trim()) { setNameError("Full name is required"); hasError = true; }
    if (!newEmail.trim()) { setEmailError("Email address is required"); hasError = true; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) { setEmailError("Please enter a valid email address"); hasError = true; }
    if (!newPassword.trim()) { setPasswordError("Password is required"); hasError = true; }
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
      setPasswordError("Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.");
      hasError = true;
    }
    if (hasError) return;

    setAddLoading(true);
    try {
      const created = await providerRbacApi.createUser({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: "user",
        roleLabel: "User",
        permissions: [],
      });
      setCreatedUser(created);
      setUsers((prev) => [...prev, created]);
      setWizardStep(2);
    } catch (err: any) {
      setAddError(err.message || "Failed to create user. Email might already be in use.");
    } finally {
      setAddLoading(false);
    }
  };

  // Step 2: save permissions and finish
  const handleStep2 = async () => {
    if (!createdUser) return;
    const selectedPerms = Object.entries(wizardPermissions).filter(([, v]) => v).map(([k]) => k);
    setPermSaving(true);
    try {
      await providerRbacApi.updatePermissions(createdUser.id, selectedPerms);
      setUsers((prev) => prev.map((u) => u.id === createdUser.id ? { ...u, permissions: selectedPerms } : u));
      toast.success(`User ${createdUser.email} added with permissions.`);
      closeWizard();
    } catch {
      toast.error("User created but failed to save permissions. You can edit them from the table.");
      closeWizard();
    } finally {
      setPermSaving(false);
    }
  };

  const openPermModal = (user: ProviderUser) => {
    setPermUserName(user.name);
    setPermUserId(user.id);
    const userPerms = user.permissions || [];
    setPermissions(userPerms.reduce((acc: Record<string, boolean>, p: string) => ({ ...acc, [p]: true }), {}));
    setPermModalOpen(true);
  };

  const handleDeleteUser = (u: ProviderUser) => { setUserToDelete(u); setDeleteModalOpen(true); };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await providerRbacApi.deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((x) => x.id !== userToDelete.id));
      toast.success(`Access has been removed from ${userToDelete.email}.`);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleSavePermissions = async () => {
    const selectedPerms = Object.entries(permissions).filter(([, v]) => v).map(([k]) => k);
    try {
      await providerRbacApi.updatePermissions(permUserId, selectedPerms);
      setUsers((prev) => prev.map((user) => (user.id === permUserId ? { ...user, permissions: selectedPerms } : user)));
      toast.success("Access permissions have been updated.");
      setPermModalOpen(false);
    } catch {
      toast.error("Failed to save permissions");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Assign Access</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Assign Access</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" /> Users with Access
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input type="text" className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={openWizard} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
          <table className="w-full text-sm" style={{ minWidth: "700px" }}>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Last Active</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr key="no-users"><td colSpan={5} className="py-8 text-center text-gray-500">No users found</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img className="h-8 w-8 rounded-full object-cover border border-gray-200" src={u.avatar} alt={u.name} />
                      <p className="font-medium text-gray-900">{u.name}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{u.email}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[u.status] || "bg-gray-100 text-gray-700"}`}>{u.status}</span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-500">{u.lastActive}</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openPermModal(u)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Edit Permissions"><ShieldCheck className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteUser(u)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Remove"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Showing <span className="font-medium">{filtered.length}</span> users</p>
        </div>
      </div>

      {/* ── Add User Wizard ── */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">

            {/* Header with step indicator */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  {wizardStep === 1 ? "Add New User" : "Assign Permissions"}
                </h2>
                <button onClick={closeWizard} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              {/* Steps */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${wizardStep === 1 ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-700'}`}>
                  <span>1</span><span>User Details</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${wizardStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <span>2</span><span>Permissions</span>
                </div>
              </div>
            </div>

            {/* Step 1: User Info */}
            {wizardStep === 1 && (
              <>
                <div className="p-6 space-y-5">
                  {addError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> {addError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${nameError ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Enter full name"
                      value={newName}
                      onChange={(e) => { setNewName(e.target.value); if (nameError) setNameError(""); }}
                    />
                    {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${emailError ? "border-red-500" : "border-gray-300"}`}
                      placeholder="user@example.com"
                      value={newEmail}
                      onChange={(e) => { setNewEmail(e.target.value); if (emailError) setEmailError(""); }}
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${passwordError ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Min 8 chars, upper, lower, number, special char"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); if (passwordError) setPasswordError(""); }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                  </div>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                  <button onClick={closeWizard} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                  <button
                    onClick={handleStep1}
                    disabled={addLoading || !newName.trim() || !newEmail.trim() || !newPassword.trim()}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {addLoading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</> : <>Next: Set Permissions <ChevronRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Permissions */}
            {wizardStep === 2 && (
              <>
                <div className="p-6">
                  <div className="bg-blue-50 rounded-lg p-3 mb-5 text-sm text-gray-700">
                    Setting permissions for: <span className="font-bold text-blue-700">{createdUser?.name}</span> (<span className="text-gray-500">{createdUser?.email}</span>)
                  </div>
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                    {PERMISSIONS.map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{perm.label}</p>
                          <p className="text-xs text-gray-500">{perm.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input type="checkbox" className="sr-only peer" checked={wizardPermissions[perm.id] || false} onChange={(e) => setWizardPermissions((prev) => ({ ...prev, [perm.id]: e.target.checked }))} />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between gap-3 px-6 py-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 self-center">You can always edit permissions later.</p>
                  <div className="flex gap-3">
                    <button onClick={closeWizard} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Skip</button>
                    <button
                      onClick={handleStep2}
                      disabled={permSaving}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {permSaving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><ShieldCheck className="w-4 h-4" />Save & Finish</>}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Permissions Modal (for existing users) */}
      {permModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600" /> Assign Permissions</h2>
              <button onClick={() => setPermModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">Assigning permissions for: <span className="font-bold text-blue-700">{permUserName}</span></p>
              </div>
              <div className="space-y-3">
                {PERMISSIONS.map((perm) => (
                  <div key={perm.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{perm.label}</p>
                      <p className="text-xs text-gray-500">{perm.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" checked={permissions[perm.id] || false} onChange={(e) => setPermissions((prev) => ({ ...prev, [perm.id]: e.target.checked }))} />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button onClick={() => setPermModalOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={handleSavePermissions} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Save Permissions</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full overflow-hidden shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Are you sure you want to remove <span className="font-bold text-gray-900">"{userToDelete?.name}"</span>?
                This action will revoke all their access and cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmDelete} className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all">Yes, Remove User</button>
                <button onClick={() => { setDeleteModalOpen(false); setUserToDelete(null); }} className="w-full py-3 bg-gray-50 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all border border-gray-200">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

AssignAccess.displayName = "AssignAccess";

export default AssignAccess;
