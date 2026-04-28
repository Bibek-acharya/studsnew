"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import ScholarshipDetailPage from "@/components/scholarship-finder/ScholarshipDetailPage";

const MOCK_SCHOLARSHIP = {
  id: "project-shiksha",
  title: "Project Shiksha Scholarship 2025",
  description: `<p>Project Shiksha is a transformative <strong>full scholarship program</strong> designed to provide exceptional SEE graduates from across Nepal with access to higher secondary education, along with complete support for tuition, fooding, and accommodation.</p><p>This nationwide program is proudly co-led by <strong>100 Group, Sowers Action Nepal & Hong Kong, and Routine of Nepal Banda (RONB)</strong>, with academic partnership from <strong>Ncell Foundation, Dari Club USA</strong> and technical support from <strong>Creating Opportunities</strong>.</p>`,
  funding_type: "Full Scholarship",
  degree_level: "Grade 11/+2",
  value: "Full Support - Tuition, Food & Accommodation",
  provider: "Project Shiksha | 100 Group, Sowers Action Nepal & Hong Kong, RONB",
  location: "Nationwide Scholarship Program (7 Provinces)",
  provider_phone: "9851131074",
  provider_email: "info@projectshiksha.hundredgroupnepal.org",
  provider_website: "https://projectshiksha.hundredgroupnepal.org",
  journey_timeline: [
    { year: "2022", title: "Project Shiksha Launched", description: "Project Shiksha was founded by 100 Group, Sowers Action Nepal & Hong Kong, and RONB with a vision to provide quality education to underprivileged students across Nepal." },
    { year: "2023", title: "First Batch of Scholars", description: "Successfully enrolled the first batch of 50 scholarship recipients. Established partnerships with leading colleges and set up exam centers across 5 provinces." },
    { year: "2024", title: "Expanded Reach & Partnerships", description: "Partnered with Ncell Foundation and Dari Club USA. Expanded to 7 exam centers nationwide. Increased scholarship seats to 100 (60 Fully + 40 Partially Funded)." },
    { year: "2025", title: "National Recognition", description: "Received 'Best Educational Initiative Award 2025' from Ministry of Education. First batch graduates achieved 95% pass rate with 85% distinction. Added Creating Opportunities as technical partner." },
    { year: "2026", title: "Current Year - Growing Impact", description: "Expanded to 110 total seats (60 Fully + 50 Partially Funded). Launched online application system. Continuing to transform lives through education across all 7 provinces of Nepal." },
  ],
  eligibility_criteria: [
    "Must be a <strong>SEE graduate of 2081/2082</strong> from any board in Nepal",
    "Must have scored <strong>minimum 2.0 GPA</strong> in SEE examination",
    "Age limit: <strong>Maximum 18 years</strong> as of application date",
    "Must be enrolled or planning to enroll in <strong>Grade 11/+2 program</strong> in Nepal",
    "Priority given to students from <strong>economically disadvantaged backgrounds</strong>",
  ],
  required_documents: [
    "SEE Mark Sheet (Original & Copy)",
    "SEE Character Certificate",
    "Citizenship Certificate (if available)",
    "Birth Certificate",
    "Family Income Certificate",
    "Recommendation Letter",
    "Passport-sized Photos (4 copies)",
    "+2 Admission Confirmation",
  ],
  selection_process: [
    { title: "Application", description: "Online application submission" },
    { title: "Entrance Exam", description: "Written test (40% pass mark)" },
    { title: "Interview", description: "Personal interview round" },
    { title: "Final Selection", description: "Result publication" },
  ],
  timeline: [
    { title: "Application Opens", date: "Ashad 21, 2082 (Saturday)", description: "Online application portal becomes available for all eligible students" },
    { title: "Application Deadline", date: "Ashad 30, 2082 (Monday) - 11:59 PM", description: "Last date to submit complete scholarship applications" },
    { title: "Entrance Examination", date: "Shrawan 1, 2082 (Thursday) - 9:00 AM", description: "Exam conducted simultaneously across all provinces" },
    { title: "Entrance Exam Result", date: "Shrawan 1, 2082 (Thursday Evening)", description: "Entrance exam result will be published on official website" },
    { title: "Interviews", date: "Shrawan 2 and 3, 2082 (Friday, Saturday)", description: "Interview of shortlisted candidates will be conducted" },
    { title: "Final Result Publication", date: "Shrawan 4, 2082 (Sunday Evening)", description: "Final result will be published on official website" },
  ],
  exam_centers: [
    { province: "Bagmati Province", city: "Kathmandu", venue: "Advance Academy, Lalitpur", contact: "Mr. Bablu Gupta", phone: "9851131074, 9861116456" },
    { province: "Gandaki Province", city: "Pokhara", venue: "Gandaki College, Mahendrapul", contact: "Mr. Prasanna Dhungel, Mr. Pabin Chhetri", phone: "9801127672, 9856009596" },
    { province: "Lumbini Province", city: "Butwal", venue: "Butwal Campus, Tankasinwa", contact: "Mr. Sushant Acharya, Er. Subodh Regmi", phone: "9749394615, 9851313120" },
    { province: "Koshi Province", city: "Biratnagar", venue: "Koshi College, Main Road", contact: "Mr. Dhiraj Shah", phone: "9827329145" },
    { province: "Sudurpashchim Province", city: "Kailali", venue: "Seti College, Dhangadhi", contact: "Mr. Jay Dhami", phone: "9868742691" },
    { province: "Madhesh Province", city: "Lahan", venue: "Janak Education Center", contact: "Mr. Aashish Chaudhary, Mr. Shiv Yadav", phone: "9818378642, 9861969297" },
    { province: "Madhesh Province", city: "Birgunj", venue: "Narayani Academy, Ghantaghar", contact: "Mr. Anurag Gupta, Mr. Prabhat Kumar", phone: "9844000111, 9801230707" },
  ],
  news_items: [
    { title: "Entrance Examination Schedule Published", description: "The entrance examination for Project Shiksha Scholarship 2082 will be held on Shrawan 1, 2082 at all exam centers across Nepal.", category: "Notice", date: "22 Apr 2026", link: "#" },
    { title: "Final Scholarship Result Published", description: "The final result for Project Shiksha Scholarship 2082 has been published. 110 students selected.", category: "Result", date: "15 Apr 2026", link: "https://projectshiksha.hundredgroupnepal.org/final-result" },
    { title: "Leadership Training Workshop 2026", description: "Successful 3-day leadership training workshop for scholarship recipients conducted in April 2026.", category: "Event", date: "10 Apr 2026", link: "#" },
    { title: "Application Deadline Extended", description: "Due to overwhelming response, the application deadline has been extended until Ashad 30, 2082.", category: "Update", date: "28 Jun 2025", link: "#" },
  ],
  achievements: [
    { title: "Successful Scholarship Program 2081", description: "Project Shiksha successfully completed its first batch with 95% of scholarship holders achieving distinction in their +2 examinations.", badge: "Success", tags: ["95% Pass", "85% Distinction"], link: "#" },
    { title: "National Recognition", description: "Received the 'Best Educational Initiative Award 2025' from the Ministry of Education for outstanding contribution.", badge: "Award", tags: ["National Award", "2025"], link: "#" },
    { title: "Student Success Stories", description: "Scholarship recipients securing admissions in prestigious medical and engineering colleges across Nepal.", badge: "Students", tags: ["Medical", "Engineering"], link: "#" },
    { title: "Strategic Partnerships", description: "Built strong collaborations with leading educational institutions, NGOs, and corporate partners nationwide.", badge: "Partners", tags: ["5+ Partners", "Nationwide"], link: "#" },
  ],
  gallery_images: [
    "https://projectshiksha.hundredgroupnepal.org/images/shiks.jpg",
    "https://sowersaction.org.np/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-02-at-14.37.52_81769f1f.jpg",
    "https://sowersaction.org.np/wp-content/uploads/2025/02/cafe.jpg",
    "https://sowersaction.org.np/wp-content/uploads/2025/01/IMG_7141-scaled.jpg",
    "https://sowersaction.org.np/wp-content/uploads/2025/01/IMG_5591-e1739791077307.jpeg",
    "https://sowersaction.org.np/wp-content/uploads/2025/02/WhatsApp-Image-2025-03-28-at-14.19.06_688006be.jpg",
  ],
  faqs: [
    { question: "Who is eligible to apply for Project Shiksha Scholarship?", answer: "SEE graduates of 2081/2082 from any board in Nepal with minimum 2.0 GPA, maximum 18 years of age, and must be enrolled or planning to enroll in Grade 11/+2 program in Nepal. Priority is given to students from economically disadvantaged backgrounds." },
    { question: "What is the difference between Fully Funded and Partially Funded scholarships?", answer: "<strong>Fully Funded (60 seats):</strong> Covers tuition fees, food, and accommodation for students with family annual income below NPR 150,000. <strong>Partially Funded (50 seats):</strong> Covers tuition fees only for students with family annual income below NPR 300,000." },
    { question: "How do I apply for the scholarship?", answer: "Applications are submitted online through the official Project Shiksha website. You need to fill out the application form and upload required documents including SEE mark sheet, character certificate, citizenship certificate (if available), birth certificate, family income certificate, recommendation letter, passport-sized photos, and +2 admission confirmation." },
    { question: "What is the selection process?", answer: "The selection process consists of 4 stages: (1) Online application submission, (2) Written entrance examination (40% pass mark required), (3) Personal interview for shortlisted candidates, and (4) Final result publication on the official website." },
    { question: "Where will the entrance examination be held?", answer: "The entrance examination is conducted simultaneously across 7 exam centers in different provinces: Kathmandu (Bagmati), Pokhara (Gandaki), Butwal (Lumbini), Biratnagar (Koshi), Kailali (Sudurpashchim), Lahan and Birgunj (Madhesh Province)." },
    { question: "Is there an age limit for applying?", answer: "Yes, applicants must be maximum 18 years of age as of the application deadline date. This is a strict criteria and applications exceeding this age limit will not be considered." },
    { question: "Can I apply if I'm already enrolled in +2?", answer: "Yes, students who are already enrolled in Grade 11/+2 programs can apply. However, you must provide +2 admission confirmation as part of your application documents." },
    { question: "What happens if I score below 40% in the entrance exam?", answer: "Students must score at least 40% in the entrance examination to be considered for the scholarship. If you score below 40%, you will not be eligible to proceed to the interview round." },
    { question: "Are there separate quotas for boys and girls?", answer: "Yes, for the Fully Funded scholarship (60 seats), there are 30 seats reserved for boys and 30 seats for girls. The Partially Funded scholarship (50 seats) is open to all genders without specific quotas." },
    { question: "How can I contact for more information?", answer: "You can contact us at <strong>9851131074</strong> or email at <strong>info@projectshiksha.hundredgroupnepal.org</strong>. You can also visit our official website at <strong>projectshiksha.hundredgroupnepal.org</strong> for more information." },
  ],
  partners: [
    { name: "Sowers Action Nepal", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/sa_new.jpeg" },
    { name: "Sowers Hong Kong", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/sower-hk.jpeg" },
    { name: "RONB", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/ronb.jpg" },
    { name: "Ncell Foundation", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/ncell.png" },
    { name: "Creating Opportunities", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/creating.png" },
    { name: "Dari Club USA", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/dari-club.jpeg" },
  ],
};

export default function ScholarshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const { data: detailRes, isLoading: isDetailLoading, error: detailError } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: () => apiService.getEducationScholarshipById(id),
  });

  const { data: similarRes } = useQuery({
    queryKey: ["similar-scholarships", id],
    queryFn: () => apiService.getEducationSimilarScholarships(id),
  });

  const scholarship = detailRes?.data;
  const similarScholarships = similarRes?.data?.scholarships || [];

  if (isDetailLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="font-bold text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (detailError || !scholarship) {
    return <ScholarshipDetailPage scholarship={MOCK_SCHOLARSHIP} similarScholarships={[]} />;
  }

  return <ScholarshipDetailPage scholarship={scholarship} similarScholarships={similarScholarships} />;
}
