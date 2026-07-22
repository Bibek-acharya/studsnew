"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/services/AuthContext";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    // logout() handles redirect; no need to close
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-xl bg-white shadow-2xl">
        <div className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <LogOut className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">Logout</h3>
          <p className="mb-6 text-sm text-gray-500">
            Are you sure you want to logout from your account?
          </p>
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={loggingOut}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loggingOut ? "Logging out..." : "Yes, Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
