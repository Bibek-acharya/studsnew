"use client";

import Image from "next/image";

interface AdmitCardProps {
  fullName: string;
  photoPreview: string | null;
  rollNumber: string;
  applicationNo: string;
  dob: string;
  gender: string;
  stream: string;
  examCentre: string;
  examDate: string;
  examTime: string;
  shift: string;
  subjectCode: string;
  subjectName: string;
}

export default function AdmitCard({
  fullName,
  photoPreview,
  rollNumber,
  applicationNo,
  dob,
  gender,
  stream,
  examCentre,
  examDate,
  examTime,
  shift,
  subjectCode,
  subjectName,
}: AdmitCardProps) {
  return (
    <div id="admit-card-content" className="a4-paper">
      {/* Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <Image
          src="https://projectshiksha.hundredgroupnepal.org/images/shiks.jpg"
          alt="Watermark"
          width={400}
          height={400}
          className="w-[65%] object-contain opacity-5"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-2 w-full">
          {/* Logo */}
          <div className="w-32 h-32 shrink-0 flex items-center justify-center">
            <Image
              src="https://projectshiksha.hundredgroupnepal.org/images/shiks.jpg"
              alt="Logo"
              width={128}
              height={128}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Logo";
              }}
            />
          </div>

          {/* Central Text */}
          <div className="text-center flex flex-col justify-center flex-1 px-2">
            <h1 className="text-[26px] font-bold tracking-wide text-black uppercase mb-1">
              PROJECT SHIKSHA
            </h1>
            <h2 className="text-[13px] font-semibold text-gray-800 uppercase tracking-wider mb-2">
              ENTRANCE EXAMINATION FOR 2083 BATCH
            </h2>
            <h3 className="text-[14px] font-bold text-black uppercase tracking-widest">
              Admit Card
            </h3>
          </div>

          {/* Right Side QR Code */}
          <div className="w-32 shrink-0 flex items-center justify-end">
            <div className="w-20 h-20 border border-gray-400 p-1 bg-white relative z-10">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                alt="QR Code"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="w-full border-b-[1.5px] border-gray-400 mb-5 mt-3" />

        {/* Candidate Details Section */}
        <div className="flex justify-between mb-5">
          {/* Details Form */}
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
            <div className="font-semibold text-black">{applicationNo}</div>

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

          {/* Right Side Photo & Barcode Area */}
          <div className="w-[120px] ml-4 shrink-0 flex flex-col items-center">
            <div className="w-full h-[140px] border border-gray-400 mb-1 p-0.5 bg-white">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Candidate"
                  width={120}
                  height={140}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Photo
                </div>
              )}
            </div>
            {/* Student Signature */}
            <div className="w-full px-1 text-center mt-5">
              <div className="w-full border-b-[1.5px] border-dashed border-gray-800 h-2 mb-1.5" />
              <p className="text-[9px] font-semibold text-gray-800 uppercase tracking-widest">
                Student Signature
              </p>
            </div>
          </div>
        </div>

        {/* Examination Details Table Section */}
        <div className="mb-8">
          <div className="text-[12px] font-bold text-black mb-1.5 pl-1">
            Details of Examination Subject (With scheduled exam program)
          </div>
          <table className="w-full border-collapse border border-gray-400 text-[11.5px] text-center">
            <thead className="bg-[#e0f2f1] text-gray-800">
              <tr>
                <th className="border border-gray-400 py-1.5 px-2 font-semibold">
                  Subject Code
                </th>
                <th className="border border-gray-400 py-1.5 px-2 font-semibold">
                  Subject Name
                </th>
                <th className="border border-gray-400 py-1.5 px-2 font-semibold">
                  Exam Date
                </th>
                <th className="border border-gray-400 py-1.5 px-2 font-semibold">
                  Shift
                </th>
                <th className="border border-gray-400 py-1.5 px-2 font-semibold">
                  Exam Time
                </th>
              </tr>
            </thead>
            <tbody className="text-black font-medium">
              <tr>
                <td className="border border-gray-400 py-3 px-2">{subjectCode}</td>
                <td className="border border-gray-400 py-3 px-2 text-left pl-4 font-bold">
                  {subjectName}
                </td>
                <td className="border border-gray-400 py-3 px-2">{examDate}</td>
                <td className="border border-gray-400 py-3 px-2">{shift}</td>
                <td className="border border-gray-400 py-3 px-2">{examTime}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 py-3 px-2" />
                <td className="border border-gray-400 py-3 px-2" />
                <td className="border border-gray-400 py-3 px-2" />
                <td className="border border-gray-400 py-3 px-2" />
                <td className="border border-gray-400 py-3 px-2" />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures Section */}
        <div className="flex justify-between items-end px-4 mt-auto mb-10">
          {/* Left: Authorized Seal & Signature */}
          <div className="flex flex-col items-center">
            <div className="w-48 border-b-[2px] border-dotted border-gray-800 mb-2 mt-12" />
            <span className="text-[11.5px] font-bold text-black text-center">
              Authorized Seal & Signature
              <br />
              <span className="font-normal text-[10px]">(Head of Institution)</span>
            </span>
          </div>

          {/* Right: Exam Controller */}
          <div className="flex flex-col items-center">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg"
              className="h-8 mb-1 opacity-80"
              alt="Signature"
              width={120}
              height={32}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="w-48 border-b-[2px] border-dotted border-gray-800 mb-2" />
            <span className="text-[11.5px] font-bold text-black">
              Controller of Examination
            </span>
          </div>
        </div>

        {/* Important Instructions Divider & Section */}
        <div className="border-t-[1.5px] border-dashed border-gray-400 pt-4 pb-2 mt-4">
          <div className="text-center mb-3">
            <h3 className="text-[13px] font-bold text-[#0066cc] uppercase tracking-wide">
              Important Instructions for Candidates
            </h3>
          </div>

          <div className="w-full">
            <table className="w-full text-left bg-transparent">
              <tbody className="text-[11px] text-gray-800 font-normal leading-[1.6]">
                <tr>
                  <td className="py-1 pr-2 align-top text-black w-5 text-right">1.</td>
                  <td className="py-1">
                    Candidates must bring this Original Admit Card along with a valid Original Photo ID proof (Citizenship/School ID) to the examination centre.
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 align-top text-black text-right">2.</td>
                  <td className="py-1">
                    Candidates will be permitted to sit in their designated seats only. Latecomers (more than half an hour late) may not be allowed to take the exam.
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 align-top text-black text-right">3.</td>
                  <td className="py-1">
                    Electronic gadgets, mobile phones, smartwatches, and programmable calculators are strictly prohibited inside the hall.
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 align-top text-black text-right">4.</td>
                  <td className="py-1">
                    Use only Black/Blue ballpoint pen. Use of pencils for marking answers is strictly prohibited unless specified.
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 align-top text-black text-right">5.</td>
                  <td className="py-1">
                    Impersonation or any form of malpractice will lead to immediate disqualification and legal action.
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 align-top text-black text-right">6.</td>
                  <td className="py-1">
                    Any discrepancy in the admit card must be reported to the examination authority immediately for correction.
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 align-top text-black text-right">7.</td>
                  <td className="py-1">
                    Candidates must preserve this admit card securely until the final admission process is completed.
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 align-top text-black text-right">8.</td>
                  <td className="py-1">
                    Do not write anything on the front or back of this admit card. Rough work must be done on the provided sheet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .a4-paper {
          width: 210mm;
          min-height: 297mm;
          background: white;
          margin: 0 auto;
          position: relative;
          box-sizing: border-box;
          padding: 10mm 12mm;
        }

        @media print {
          body {
            background-color: white;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .a4-paper {
            margin: 0;
            width: 100%;
            height: 100%;
            box-shadow: none;
            border: none;
            padding: 10mm 12mm;
          }
          @page {
            size: A4;
            margin: 0;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
