"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { ShieldCheck, Users, Save, Edit, Trash2 } from "lucide-react";
import SectionCard from "./common/SectionCard";
import SelectField from "./common/SelectField";
import ToggleSwitch from "./common/ToggleSwitch";
import Button from "./common/Button";
import Avatar from "./common/Avatar";
import Badge from "./common/Badge";
import { scholarshipProviderApi, ProviderAccess } from "@/services/scholarshipProviderApi";

const ROLE_OPTIONS = [
  { value: "", label: "Select role" },
  { value: "admin", label: "Administrator" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "scholarship_manager", label: "Scholarship Manager" },
  { value: "content_manager", label: "Content Manager" },
];

const roleVariant = (role: string) => {
  if (role === "admin") return "purple";
  if (role === "editor") return "blue";
  if (role === "scholarship_manager") return "indigo";
  return "gray";
};

const statusVariant = (status: string) => (status === "active" ? "green" : "yellow");

const AssignAccess: React.FC = memo(() => {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState({
    scholarship: true,
    application: true,
    content: false,
    user: false,
    analytics: true,
    settings: false,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [accessList, setAccessList] = useState<ProviderAccess[]>([]);

  useEffect(() => {
    async function fetchAccess() {
      try {
        const res = await scholarshipProviderApi.getAccess(1, 50);
        setAccessList(res.access);
      } catch {
        setAccessList([]);
      }
    }
    fetchAccess();
  }, []);

  const handlePermissionChange = useCallback((key: keyof typeof permissions) => (value: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAssign = useCallback(async () => {
    if (!email.trim() || !selectedRole) return;
    setError("");
    setSuccess("");
    try {
      const created = await scholarshipProviderApi.createAccess({
        email: email.trim(),
        role: selectedRole,
      });
      setAccessList((prev) => [...prev, created]);
      setSuccess("Access assigned successfully!");
      setEmail("");
      setSelectedRole("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to assign access");
    }
  }, [email, selectedRole]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Remove this access?")) return;
    try {
      await scholarshipProviderApi.deleteAccess(id);
      setAccessList((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to remove access");
    }
  }, []);

  return (
    <div className="space-y-6">
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" /> Assign Access
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <SelectField label="Role" required value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} options={ROLE_OPTIONS} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Permissions</label>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
              {[
                { key: "scholarship" as const, title: "Scholarship Management", desc: "Create, edit, and manage scholarships" },
                { key: "application" as const, title: "Application Review", desc: "Review and approve scholarship applications" },
                { key: "content" as const, title: "Content Management", desc: "Manage news, blogs, and events" },
                { key: "user" as const, title: "User Management", desc: "Manage users and assign roles" },
                { key: "analytics" as const, title: "Analytics & Reports", desc: "View analytics and generate reports" },
                { key: "settings" as const, title: "Settings Management", desc: "Modify system settings and configurations" },
              ].map(({ key, title, desc }) => (
                <div key={key} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{title}</p>
                      <p className="text-sm text-slate-500">{desc}</p>
                    </div>
                    <ToggleSwitch checked={permissions[key]} onChange={handlePermissionChange(key)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">{error}</div>}
          {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">{success}</div>}

          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleAssign} disabled={!email.trim() || !selectedRole}><ShieldCheck className="w-4 h-4" /> Assign Access</Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" /> Current Access Holders
        </h2>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Role</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accessList.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-slate-500">No access holders</td></tr>
              ) : accessList.map((holder) => (
                <tr key={holder.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={holder.email} size="sm" />
                      <span className="font-medium text-slate-900">{holder.email}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4"><Badge variant={roleVariant(holder.role) as any}>{holder.role}</Badge></td>
                  <td className="text-center py-3 px-4"><Badge variant={statusVariant(holder.status) as any}>{holder.status}</Badge></td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-red-600 transition-colors" onClick={() => handleDelete(holder.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
});

AssignAccess.displayName = "AssignAccess";

export default AssignAccess;
