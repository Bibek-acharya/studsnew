"use client";

import React, { useState } from "react";
import { User, Envelope, Phone, Globe, Buildings, Image, FloppyDisk } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

const ProfilePage: React.FC = () => {
  const [collegeName, setCollegeName] = useState("KIST College of Technology");
  const [email, setEmail] = useState("admin@kist.edu");
  const [phone, setPhone] = useState("+977-01-5123456");
  const [website, setWebsite] = useState("https://www.kist.edu.np");
  const [address, setAddress] = useState("Kamal Pokhari, Kathmandu, Nepal");
  const [about, setAbout] = useState("KIST College is a premier institution offering world-class education across multiple disciplines.");
  const [vision, setVision] = useState("To be a center of excellence in education, fostering innovation and leadership.");
  const [mission, setMission] = useState("We strive to empower students with knowledge, skills, and values for a dynamic world.");
  const [facebook, setFacebook] = useState("https://facebook.com/kistcollege");
  const [instagram, setInstagram] = useState("https://instagram.com/kistcollege");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [tiktok, setTiktok] = useState("");

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Manage Profile"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Profile" },
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center relative group cursor-pointer">
              <Image className="w-10 h-10 text-blue-600" />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{collegeName}</h2>
              <p className="text-sm text-gray-500">Est. 1995 • Private Institution</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Buildings size={20} className="text-blue-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">College Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Vision</label>
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mission</label>
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Facebook", value: facebook, setter: setFacebook },
              { label: "Instagram", value: instagram, setter: setInstagram },
              { label: "LinkedIn", value: linkedin, setter: setLinkedin },
              { label: "Twitter", value: twitter, setter: setTwitter },
              { label: "TikTok", value: tiktok, setter: setTiktok },
            ].map((s) => (
              <div key={s.label}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{s.label}</label>
                <input
                  type="text"
                  value={s.value}
                  onChange={(e) => s.setter(e.target.value)}
                  placeholder={`https://${s.label.toLowerCase()}.com/...`}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Logo & Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer transition-colors">
                <Image className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Upload college logo</p>
                <p className="text-xs text-gray-400 mt-1">PNG, SVG (Max 2MB)</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer transition-colors">
                <Image className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Upload cover banner</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <FloppyDisk size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
