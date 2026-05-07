"use client";
import React from "react";
import SectionHeader from "../shared/SectionHeader";

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("all");

  const tabs = [
    { key: "all", label: "All", count: null, countBg: "", countColor: "" },
    { key: "admission", label: "Admission", count: 2, countBg: "bg-blue-100", countColor: "text-blue-600" },
    { key: "scholarship", label: "Scholarship", count: 1, countBg: "bg-orange-100", countColor: "text-orange-600" },
    { key: "entrance", label: "Entrance", count: 0, countBg: "bg-green-100", countColor: "text-green-600" },
    { key: "message", label: "Message", count: 1, countBg: "bg-green-100", countColor: "text-green-600" },
    { key: "news", label: "News", count: 0, countBg: "bg-gray-100", countColor: "text-gray-600" },
    { key: "events", label: "Events", count: 1, countBg: "bg-yellow-100", countColor: "text-yellow-600" },
    { key: "blogs", label: "Blogs", count: 0, countBg: "bg-gray-100", countColor: "text-gray-600" },
    { key: "system", label: "System", count: 1, countBg: "bg-red-100", countColor: "text-red-600" },
  ];

  const notifications = [
    { type: "admission", icon: "ph ph-user-plus", iconBg: "bg-blue-50", iconColor: "text-blue-600", title: "New student application received", desc: "Emily Johnson applied for B.Tech Computer Science", time: "2 minutes ago", unread: true },
    { type: "scholarship", icon: "ph ph-clock", iconBg: "bg-orange-50", iconColor: "text-orange-500", title: "Scholarship deadline approaching", desc: "Project Shiksha 2025 deadline is in 3 days", time: "1 hour ago", unread: true },
    { type: "message", icon: "ph ph-chats", iconBg: "bg-green-50", iconColor: "text-green-600", title: "New message from applicant", desc: "Alex Johnson sent a message about document verification", time: "3 hours ago", unread: true },
    { type: "admission", icon: "ph ph-file-text", iconBg: "bg-purple-50", iconColor: "text-purple-600", title: "Admission form updated", desc: "BBA admission form has been modified", time: "1 day ago", unread: false },
    { type: "system", icon: "ph ph-book", iconBg: "bg-red-50", iconColor: "text-red-600", title: "Book issued to student", desc: "Data Structures book issued to Michael Chen", time: "3 days ago", unread: false },
    { type: "events", icon: "ph ph-calendar-check", iconBg: "bg-yellow-50", iconColor: "text-yellow-600", title: "Event created", desc: "Annual Sports Day scheduled for June 15", time: "5 days ago", unread: false },
  ];

  const filteredNotifications = activeTab === "all"
    ? notifications
    : notifications.filter((n) => n.type === activeTab);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Notification"
        breadcrumbItems={[{ label: "Dashboard", href: "/institution-zone/dashboard/overview" }, { label: "Notification" }]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex overflow-x-auto gap-1 p-3" style={{ scrollbarWidth: "none" }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "bg-brand-50 text-brand-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className={`ml-1 ${tab.countBg} ${tab.countColor} px-1.5 py-0.5 rounded-full text-xs`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="px-4 pb-3 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {activeTab === "all" ? "Showing all notifications" : `Showing ${activeTab} notifications`}
            </p>
            <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
              Mark All Read
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredNotifications.map((notif, i) => (
            <div
              key={i}
              className="p-4 hover:bg-brand-50 flex items-start gap-3 transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-full ${notif.iconBg} flex items-center justify-center shrink-0`}>
                <i className={`${notif.icon} ${notif.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{notif.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
              </div>
              {notif.unread && <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
