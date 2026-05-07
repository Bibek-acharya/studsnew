"use client";

import { ChevronDown } from "lucide-react";

const MOCK_FAQS = [
  { q: "Who is eligible to apply for Project Shiksha Scholarship?", a: "SEE graduates of 2081/2082 from any board in Nepal with minimum 2.0 GPA, maximum 18 years of age, and must be enrolled or planning to enroll in Grade 11/+2 program in Nepal. Priority is given to students from economically disadvantaged backgrounds." },
  { q: "What is the difference between Fully Funded and Partially Funded scholarships?", a: "<strong>Fully Funded (60 seats):</strong> Covers tuition fees, food, and accommodation for students with family annual income below NPR 150,000. <strong>Partially Funded (50 seats):</strong> Covers tuition fees only for students with family annual income below NPR 300,000." },
  { q: "How do I apply for the scholarship?", a: "Applications are submitted online through the official Project Shiksha website. You need to fill out the application form and upload required documents including SEE mark sheet, character certificate, citizenship certificate (if available), birth certificate, family income certificate, recommendation letter, passport-sized photos, and +2 admission confirmation." },
  { q: "What is the selection process?", a: "The selection process consists of 4 stages: (1) Online application submission, (2) Written entrance examination (40% pass mark required), (3) Personal interview for shortlisted candidates, and (4) Final result publication on the official website." },
  { q: "Where will the entrance examination be held?", a: "The entrance examination is conducted simultaneously across 7 exam centers in different provinces: Kathmandu (Bagmati), Pokhara (Gandaki), Butwal (Lumbini), Biratnagar (Koshi), Kailali (Sudurpashchim), Lahan and Birgunj (Madhesh Province)." },
  { q: "Is there an age limit for applying?", a: "Yes, applicants must be maximum 18 years of age as of the application deadline date. This is a strict criteria and applications exceeding this age limit will not be considered." },
  { q: "Can I apply if I'm already enrolled in +2?", a: "Yes, students who are already enrolled in Grade 11/+2 programs can apply. However, you must provide +2 admission confirmation as part of your application documents." },
  { q: "What happens if I score below 40% in the entrance exam?", a: "Students must score at least 40% in the entrance examination to be considered for the scholarship. If you score below 40%, you will not be eligible to proceed to the interview round." },
  { q: "Are there separate quotas for boys and girls?", a: "Yes, for the Fully Funded scholarship (60 seats), there are 30 seats reserved for boys and 30 seats for girls. The Partially Funded scholarship (50 seats) is open to all genders without specific quotas." },
  { q: "How can I contact for more information?", a: "You can contact us at <strong>9851131074</strong> or email at <strong>info@projectshiksha.hundredgroupnepal.org</strong>. You can also visit our official website at <strong>projectshiksha.hundredgroupnepal.org</strong> for more information." },
];

function FaqTab({ faqs, faqOpen, toggleFaq }: { faqs: { q: string; a: string }[]; faqOpen: number[]; toggleFaq: (i: number) => void }) {
  const items = faqs.length > 0 ? faqs : MOCK_FAQS;
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="mt-1 text-[14px] text-gray-500">Find answers to common questions about Project Shiksha Scholarship</p>
      </div>
      <div className="space-y-3">
        {items.map((faq, i) => (
          <div key={i} className="overflow-hidden rounded-md bg-white">
            <button type="button" onClick={() => toggleFaq(i)} className="flex w-full items-center justify-between px-5 py-4 text-left transition-all">
              <span className="pr-4 text-[15px] font-semibold text-gray-900">
                <span className="mr-2 font-bold text-blue-600">Q{i + 1}.</span>{faq.q}
              </span>
              <ChevronDown size={20} className={`shrink-0 text-gray-400 transition-transform duration-200 ${faqOpen.includes(i) ? "rotate-180" : ""}`} />
            </button>
            {faqOpen.includes(i) && (
              <div className="px-5 pb-4">
                <p className="text-[14px] leading-relaxed text-gray-600 hyphens-none" dangerouslySetInnerHTML={{ __html: faq.a }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaqTab;
