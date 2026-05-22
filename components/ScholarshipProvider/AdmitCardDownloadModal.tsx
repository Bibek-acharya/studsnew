"use client";

import React, { useRef, useState } from "react";
import { X, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
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
  const [downloading, setDownloading] = useState(false);

  const fullName = `${application.first_name} ${application.last_name}`;
  const rollNumber = application.roll_number || "—";
  const appId = `#APP-2026-${String(application.id).padStart(3, "0")}`;
  const dob = application.date_of_birth_bs || application.date_of_birth_ad || "—";
  const gender = application.gender || "—";
  const stream = application.stream || "—";
  const examCentre = application.exam_center || "—";
  const photoUrl = application.photo_url || "";
  const scholarshipTitle = application.scholarship?.title || stream;
  const examDate = application.scholarship?.exam_date || "—";
  const examTime = application.scholarship?.exam_time || "—";

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 3,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`admit-card_${rollNumber.replace(/\s+/g, "_")}.pdf`);
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

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
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Generating..." : "Download PDF"}
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
                src="https://projectshiksha.hundredgroupnepal.org/images/shiks.jpg"
                alt=""
                className="w-[65%] object-contain opacity-5"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between pb-2 w-full">
                <div className="w-32 h-32 shrink-0 flex items-center justify-center">
                  <img
                    src="https://projectshiksha.hundredgroupnepal.org/images/shiks.jpg"
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Logo";
                    }}
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

                  <div className="font-semibold">Application No.</div>
                  <div>:</div>
                  <div className="font-semibold text-black">{appId}</div>

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
                        crossOrigin="anonymous"
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
                      <td className="border border-gray-400 py-3 px-2 text-left pl-4 font-bold">{scholarshipTitle}</td>
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
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg"
                    className="h-8 mb-1 opacity-80"
                    alt="Signature"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
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
        @media print {
          .a4-paper {
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
