"use client";

import React, { useCallback, useRef } from "react";
import { X, Printer } from "lucide-react";
import { ProviderApplication } from "@/services/scholarshipProviderApi";

interface AdmitCardDownloadModalProps {
  application: ProviderApplication;
  onClose: () => void;
}

export default function AdmitCardDownloadModal({
  application,
  onClose,
}: AdmitCardDownloadModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const toAbsoluteUrl = (path: string | undefined | null): string => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const fullName = `${application.first_name} ${application.last_name}`;
  const rollNumber = application.roll_number || "—";
  const dob = application.date_of_birth_ad || application.date_of_birth_bs || "—";
  const gender = application.gender || "—";
  const stream = application.stream || "—";
  const examCentre = application.exam_center || "—";
  const photoUrl = toAbsoluteUrl(application.photo_url);
  const scholarshipTitle = application.scholarship?.title || stream;
  const examDate = application.scholarship?.exam_date || "—";
  const examTime = application.scholarship?.exam_time || "—";

  const cardHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Admit Card</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { margin: 0; padding: 0; background: white; display: flex; justify-content: center; }
        .a4-paper {
          width: 210mm; min-height: 297mm; background: white;
          position: relative; box-sizing: border-box; padding: 10mm 12mm;
          font-family: ui-sans-serif, system-ui, sans-serif;
        }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        @page { size: A4; margin: 0; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <div class="a4-paper">
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img src="${window.location.origin}/images/project-shiksha.jpg" alt="" class="w-[65%] object-contain opacity-5" onerror="this.style.display='none'">
        </div>
        <div class="relative z-10 flex flex-col" style="min-height: calc(297mm - 20mm);">
          <div class="flex items-center justify-between pb-2 w-full">
            <div class="w-32 h-32 shrink-0 flex items-center justify-center">
              <img src="${window.location.origin}/images/project-shiksha.jpg" alt="Logo" class="max-w-full max-h-full object-contain" onerror="this.style.display='none'">
            </div>
            <div class="text-center flex flex-col justify-center flex-1 px-2">
              <h1 class="text-[26px] font-bold tracking-wide text-black uppercase mb-1">PROJECT SHIKSHA</h1>
              <h2 class="text-[13px] font-semibold text-gray-800 uppercase tracking-wider mb-2">${scholarshipTitle}</h2>
              <h3 class="text-[14px] font-bold text-black uppercase tracking-widest">Admit Card</h3>
            </div>
            <div class="w-32 shrink-0 flex items-center justify-end">
              <div class="w-20 h-20 border border-gray-400 p-1 bg-white relative z-10">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://studsphere.com/" alt="QR" class="w-full h-full object-contain" onerror="this.src='https://chart.googleapis.com/chart?chs=200x200&amp;cht=qr&amp;chl=https://studsphere.com/'">
              </div>
            </div>
          </div>
          <div class="w-full border-b border-gray-400 mb-5 mt-3"></div>
          <div class="flex justify-between mb-5">
            <div class="flex-1 grid gap-y-2 text-[12.5px] text-gray-800 items-center" style="grid-template-columns:140px 10px 1fr">
              <div class="font-semibold">Candidate's Name</div><div>:</div><div class="font-semibold text-black text-[14px]">${fullName}</div>
              <div class="font-semibold">Date of Birth</div><div>:</div><div class="font-semibold text-black">${dob}</div>
              <div class="font-semibold">Gender</div><div>:</div><div class="font-semibold text-black">${gender}</div>
              <div class="font-semibold">Roll Number</div><div>:</div><div class="font-semibold text-black">${rollNumber}</div>
              <div class="font-semibold">Exam Centre Name</div><div>:</div><div class="font-semibold text-black">${examCentre}</div>
              <div class="font-semibold">Stream</div><div>:</div><div class="font-semibold text-black">${stream}</div>
            </div>
            <div class="w-[120px] ml-4 shrink-0 flex flex-col items-center">
              <div class="w-full h-[140px] border border-gray-400 mb-1 p-0.5 bg-white">
                ${photoUrl ? `<img src="${photoUrl}" alt="Photo" class="w-full h-full object-cover">` : '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>'}
              </div>
              <div class="w-full px-1 text-center mt-5">
                <div class="w-full border-b border-dashed border-gray-800 h-2 mb-1.5"></div>
                <p class="text-[9px] font-semibold text-gray-800 uppercase tracking-widest">Student Signature</p>
              </div>
            </div>
          </div>
          <div class="mb-8">
            <div class="text-[12px] font-bold text-black mb-1.5 pl-1">Details of Examination Subject (With scheduled exam program)</div>
            <table class="w-full border-collapse border border-gray-400 text-[11.5px] text-center">
              <thead class="bg-[#e0f2f1] text-gray-800">
                <tr>
                  <th class="border border-gray-400 py-1.5 px-2 font-semibold">Subject Name</th>
                  <th class="border border-gray-400 py-1.5 px-2 font-semibold">Exam Date</th>
                  <th class="border border-gray-400 py-1.5 px-2 font-semibold">Shift</th>
                  <th class="border border-gray-400 py-1.5 px-2 font-semibold">Exam Time</th>
                </tr>
              </thead>
              <tbody class="text-black font-medium">
                <tr>
                  <td class="border border-gray-400 py-3 px-2 text-left pl-4 font-bold">${stream}</td>
                  <td class="border border-gray-400 py-3 px-2">${examDate}</td>
                  <td class="border border-gray-400 py-3 px-2">1st</td>
                  <td class="border border-gray-400 py-3 px-2">${examTime}</td>
                </tr>
                <tr><td class="border border-gray-400 py-3 px-2"></td><td class="border border-gray-400 py-3 px-2"></td><td class="border border-gray-400 py-3 px-2"></td><td class="border border-gray-400 py-3 px-2"></td></tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-between items-end px-4 mt-auto mb-10">
            <div class="flex flex-col items-center">
              <div class="w-48 border-b-2 border-dotted border-gray-800 mb-2 mt-12"></div>
              <span class="text-[11.5px] font-bold text-black text-center">Authorized Seal &amp; Signature<br><span class="font-normal text-[10px]">(Head of Institution)</span></span>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-48 border-b-2 border-dotted border-gray-800 mb-2"></div>
              <span class="text-[11.5px] font-bold text-black">Controller of Examination</span>
            </div>
          </div>
          <div class="border-t border-dashed border-gray-400 pt-4 pb-2 mt-4">
            <div class="text-center mb-3">
              <h3 class="text-[13px] font-bold text-[#0066cc] uppercase tracking-wide">Important Instructions for Candidates</h3>
            </div>
            <table class="w-full text-left">
              <tbody class="text-[11px] text-gray-800 leading-[1.6]">
                <tr><td class="py-1 pr-2 align-top text-black w-5 text-right">1.</td><td class="py-1">Candidates must bring this Original Admit Card along with a valid Original Photo ID proof (Citizenship/School ID) to the examination centre.</td></tr>
                <tr><td class="py-1 pr-2 align-top text-black text-right">2.</td><td class="py-1">Candidates will be permitted to sit in their designated seats only. Latecomers (more than half an hour late) may not be allowed to take the exam.</td></tr>
                <tr><td class="py-1 pr-2 align-top text-black text-right">3.</td><td class="py-1">Electronic gadgets, mobile phones, smartwatches, and programmable calculators are strictly prohibited inside the hall.</td></tr>
                <tr><td class="py-1 pr-2 align-top text-black text-right">4.</td><td class="py-1">Use only Black/Blue ballpoint pen. Use of pencils for marking answers is strictly prohibited unless specified.</td></tr>
                <tr><td class="py-1 pr-2 align-top text-black text-right">5.</td><td class="py-1">Impersonation or any form of malpractice will lead to immediate disqualification and legal action.</td></tr>
                <tr><td class="py-1 pr-2 align-top text-black text-right">6.</td><td class="py-1">Any discrepancy in the admit card must be reported to the examination authority immediately for correction.</td></tr>
                <tr><td class="py-1 pr-2 align-top text-black text-right">7.</td><td class="py-1">Candidates must preserve this admit card securely until the final admission process is completed.</td></tr>
                <tr><td class="py-1 pr-2 align-top text-black text-right">8.</td><td class="py-1">Do not write anything on the front or back of this admit card. Rough work must be done on the provided sheet.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <script>window.onload = function() { window.print(); };</script>
    </body>
    </html>
  `;

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(cardHTML);
    printWindow.document.close();
  }, [cardHTML]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Admit Card</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 flex-1 flex justify-center bg-gray-100">
          <div ref={cardRef} className="a4-paper">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <img
                src="/images/project-shiksha.jpg"
                alt=""
                className="w-[65%] object-contain opacity-5"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between pb-2 w-full">
                <div className="w-32 h-32 shrink-0 flex items-center justify-center">
                  <img
                    src="/images/project-shiksha.jpg"
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="text-center flex flex-col justify-center flex-1 px-2">
                  <h1 className="text-[26px] font-bold tracking-wide text-black uppercase mb-1">
                    PROJECT SHIKSHA
                  </h1>
                  <h2 className="text-[13px] font-semibold text-gray-800 uppercase tracking-wider mb-2">
                    {scholarshipTitle}
                  </h2>
                  <h3 className="text-[14px] font-bold text-black uppercase tracking-widest">
                    Admit Card
                  </h3>
                </div>
                <div className="w-32 shrink-0 flex items-center justify-end">
                  <div className="w-20 h-20 border border-gray-400 p-1 bg-white relative z-10">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://studsphere.com/"
                      alt="QR Code"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=https://studsphere.com/";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full border-b-[1.5px] border-gray-400 mb-5 mt-3" />

              <div className="flex justify-between mb-5">
                <div className="flex-1 grid grid-cols-[140px_10px_1fr] gap-y-2 text-[12.5px] text-gray-800 items-center">
                  <div className="font-semibold">Candidate&apos;s Name</div>
                  <div>:</div>
                  <div className="font-semibold text-black text-[14px]">{fullName}</div>

                  <div className="font-semibold">Date of Birth</div>
                  <div>:</div>
                  <div className="font-semibold text-black">{dob}</div>

                  <div className="font-semibold">Gender</div>
                  <div>:</div>
                  <div className="font-semibold text-black">{gender}</div>

                  <div className="font-semibold">Roll Number</div>
                  <div>:</div>
                  <div className="font-semibold text-black">{rollNumber}</div>

                  <div className="font-semibold">Exam Centre Name</div>
                  <div>:</div>
                  <div className="font-semibold text-black">{examCentre}</div>

                  <div className="font-semibold">Stream</div>
                  <div>:</div>
                  <div className="font-semibold text-black">{stream}</div>
                </div>

                <div className="w-[120px] ml-4 shrink-0 flex flex-col items-center">
                  <div className="w-full h-[140px] border border-gray-400 mb-1 p-0.5 bg-white">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Candidate"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Photo
                      </div>
                    )}
                  </div>
                  <div className="w-full px-1 text-center mt-5">
                    <div className="w-full border-b-[1.5px] border-dashed border-gray-800 h-2 mb-1.5" />
                    <p className="text-[9px] font-semibold text-gray-800 uppercase tracking-widest">
                      Student Signature
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-[12px] font-bold text-black mb-1.5 pl-1">
                  Details of Examination Subject (With scheduled exam program)
                </div>
                <table className="w-full border-collapse border border-gray-400 text-[11.5px] text-center">
                  <thead className="bg-[#e0f2f1] text-gray-800">
                    <tr>
                      <th className="border border-gray-400 py-1.5 px-2 font-semibold">Subject Name</th>
                      <th className="border border-gray-400 py-1.5 px-2 font-semibold">Exam Date</th>
                      <th className="border border-gray-400 py-1.5 px-2 font-semibold">Shift</th>
                      <th className="border border-gray-400 py-1.5 px-2 font-semibold">Exam Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-black font-medium">
                    <tr>
                      <td className="border border-gray-400 py-3 px-2 text-left pl-4 font-bold">{stream}</td>
                      <td className="border border-gray-400 py-3 px-2">{examDate}</td>
                      <td className="border border-gray-400 py-3 px-2">1st</td>
                      <td className="border border-gray-400 py-3 px-2">{examTime}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 py-3 px-2" />
                      <td className="border border-gray-400 py-3 px-2" />
                      <td className="border border-gray-400 py-3 px-2" />
                      <td className="border border-gray-400 py-3 px-2" />
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-end px-4 mt-auto mb-10">
                <div className="flex flex-col items-center">
                  <div className="w-48 border-b-[2px] border-dotted border-gray-800 mb-2 mt-12" />
                  <span className="text-[11.5px] font-bold text-black text-center">
                    Authorized Seal &amp; Signature
                    <br />
                    <span className="font-normal text-[10px]">(Head of Institution)</span>
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-48 border-b-[2px] border-dotted border-gray-800 mb-2" />
                  <span className="text-[11.5px] font-bold text-black">
                    Controller of Examination
                  </span>
                </div>
              </div>

              <div className="border-t-[1.5px] border-dashed border-gray-400 pt-4 pb-2 mt-4">
                <div className="text-center mb-3">
                  <h3 className="text-[13px] font-bold text-[#0066cc] uppercase tracking-wide">
                    Important Instructions for Candidates
                  </h3>
                </div>
                <table className="w-full text-left">
                  <tbody className="text-[11px] text-gray-800 font-normal leading-[1.6]">
                    <tr><td className="py-1 pr-2 align-top text-black w-5 text-right">1.</td><td className="py-1">Candidates must bring this Original Admit Card along with a valid Original Photo ID proof (Citizenship/School ID) to the examination centre.</td></tr>
                    <tr><td className="py-1 pr-2 align-top text-black text-right">2.</td><td className="py-1">Candidates will be permitted to sit in their designated seats only. Latecomers (more than half an hour late) may not be allowed to take the exam.</td></tr>
                    <tr><td className="py-1 pr-2 align-top text-black text-right">3.</td><td className="py-1">Electronic gadgets, mobile phones, smartwatches, and programmable calculators are strictly prohibited inside the hall.</td></tr>
                    <tr><td className="py-1 pr-2 align-top text-black text-right">4.</td><td className="py-1">Use only Black/Blue ballpoint pen. Use of pencils for marking answers is strictly prohibited unless specified.</td></tr>
                    <tr><td className="py-1 pr-2 align-top text-black text-right">5.</td><td className="py-1">Impersonation or any form of malpractice will lead to immediate disqualification and legal action.</td></tr>
                    <tr><td className="py-1 pr-2 align-top text-black text-right">6.</td><td className="py-1">Any discrepancy in the admit card must be reported to the examination authority immediately for correction.</td></tr>
                    <tr><td className="py-1 pr-2 align-top text-black text-right">7.</td><td className="py-1">Candidates must preserve this admit card securely until the final admission process is completed.</td></tr>
                    <tr><td className="py-1 pr-2 align-top text-black text-right">8.</td><td className="py-1">Do not write anything on the front or back of this admit card. Rough work must be done on the provided sheet.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .a4-paper {
          width: 210mm;
          min-height: 297mm;
          background: white;
          position: relative;
          box-sizing: border-box;
          padding: 10mm 12mm;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
