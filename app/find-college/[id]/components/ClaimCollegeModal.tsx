"use client";

import React, { useState } from "react";

interface ClaimCollegeModalProps {
  collegeName: string;
  isOpen: boolean;
  onClose: () => void;
}

const ClaimCollegeModal: React.FC<ClaimCollegeModalProps> = ({
  collegeName,
  isOpen,
  onClose,
}) => {
  const [institutionName, setInstitutionName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  React.useEffect(() => {
    if (isOpen) {
      setInstitutionName(collegeName || "");
      setRegistrationNumber("");
      setEmail("");
      setContactPerson("");
      setContactNumber("");
    }
  }, [isOpen, collegeName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Claim request submitted successfully! Our team will verify and grant you access.",
    );
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <div
        className={`mx-4 flex max-h-[90vh] w-full max-w-md flex-col rounded-[20px] bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <i className="fa-solid fa-building-shield text-[20px] text-brand-blue"></i>
            Claim Institution
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <i className="fa-solid fa-xmark text-[20px]"></i>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-3.5">
            <i className="fa-solid fa-circle-info mt-0.5 shrink-0 text-[18px] text-brand-blue"></i>
            <p className="line-height-extra text-[13px] text-brand-blue">
              Provide official details to claim{" "}
              <span className="font-bold text-brand-blue">{collegeName}</span>.
              Upon verification, you will receive full control over this
              profile.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="College name"
              required
              value={institutionName}
              onChange={(event) => setInstitutionName(event.target.value)}
              className="w-full px-4 py-3 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none text-[14px] shadow-sm"
            />
            <input
              type="text"
              placeholder="Institution registration number"
              required
              value={registrationNumber}
              onChange={(event) => setRegistrationNumber(event.target.value)}
              className="w-full px-4 py-3 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none text-[14px] shadow-sm"
            />
            <input
              type="email"
              placeholder="Work email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-3 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none text-[14px] shadow-sm"
            />
            <input
              type="text"
              placeholder="Contact Person Full Name"
              required
              value={contactPerson}
              onChange={(event) => setContactPerson(event.target.value)}
              className="w-full px-4 py-3 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none text-[14px] shadow-sm"
            />
            <input
              type="tel"
              placeholder="Contact Number"
              required
              value={contactNumber}
              onChange={(event) => setContactNumber(event.target.value)}
              className="w-full px-4 py-3 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none text-[14px] shadow-sm"
            />
            <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-bold text-gray-600 transition-colors hover:bg-gray-50 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-2.5 text-[14px] font-bold text-white shadow-[0_4px_12px_rgba(0,0,255,0.2)] transition-all hover:-translate-y-0.5 hover:bg-brand-hover sm:w-auto"
              >
                Submit Claim Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClaimCollegeModal;