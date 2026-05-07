"use client";
import React, { useState } from "react";
import { BookOpen, CaretDown, CaretRight, FileArrowDown } from "@phosphor-icons/react";
import SectionHeader from "../shared/SectionHeader";

const syllabusData = [
  {
    courseId: 1,
    courseName: "B.Tech Computer Science",
    sections: [
      {
        title: "Semester 1 - Fundamentals",
        topics: [
          "Introduction to Programming",
          "Computer Organization",
          "Engineering Mathematics I",
          "Communication Skills",
          "Environmental Science",
        ],
      },
      {
        title: "Semester 2 - Core Concepts",
        topics: [
          "Data Structures",
          "Discrete Mathematics",
          "Digital Logic Design",
          "Engineering Mathematics II",
          "Object Oriented Programming",
        ],
      },
      {
        title: "Semester 3 - Intermediate",
        topics: [
          "Design & Analysis of Algorithms",
          "Computer Networks",
          "Database Management Systems",
          "Operating Systems",
          "Probability & Statistics",
        ],
      },
      {
        title: "Semester 4 - Advanced",
        topics: [
          "Software Engineering",
          "Theory of Computation",
          "Microprocessors",
          "Compiler Design",
          "Artificial Intelligence",
        ],
      },
    ],
  },
  {
    courseId: 2,
    courseName: "BBA",
    sections: [
      {
        title: "Year 1 - Foundation",
        topics: [
          "Principles of Management",
          "Business Communication",
          "Financial Accounting",
          "Business Economics",
          "Business Mathematics",
        ],
      },
      {
        title: "Year 2 - Core",
        topics: [
          "Marketing Management",
          "Human Resource Management",
          "Cost Accounting",
          "Business Law",
          "Organizational Behavior",
        ],
      },
      {
        title: "Year 2 - Specialization",
        topics: [
          "Financial Management",
          "Entrepreneurship",
          "Research Methodology",
          "Business Statistics",
          "International Business",
        ],
      },
      {
        title: "Year 3 - Capstone",
        topics: [
          "Strategic Management",
          "Project Work",
          "Corporate Governance",
          "Supply Chain Management",
          "Business Ethics",
        ],
      },
    ],
  },
  {
    courseId: 3,
    courseName: "BCA",
    sections: [
      {
        title: "Semester 1",
        topics: [
          "Programming in C",
          "Digital Fundamentals",
          "Mathematics for Computing",
          "English Communication",
          "Office Automation",
        ],
      },
      {
        title: "Semester 2",
        topics: [
          "Data Structures with C",
          "Object Oriented Programming with C++",
          "Computer Architecture",
          "Statistics for Computing",
          "Environmental Studies",
        ],
      },
      {
        title: "Semester 3",
        topics: [
          "Java Programming",
          "Web Technologies",
          "Database Management",
          "Software Engineering",
          "Cloud Computing Basics",
        ],
      },
      {
        title: "Semester 4",
        topics: [
          "Python Programming",
          "Mobile Application Development",
          "Data Mining",
          "Cyber Security",
          "Major Project",
        ],
      },
    ],
  },
];

const CourseSyllabusPage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState(1);
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

  const course = syllabusData.find((c) => c.courseId === selectedCourse);

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Syllabus"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Course" },
          { label: "Syllabus" },
        ]}
      />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Select Course
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(Number(e.target.value));
            setExpandedSections([0]);
          }}
          className="w-full md:w-80 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
        >
          {syllabusData.map((c) => (
            <option key={c.courseId} value={c.courseId}>
              {c.courseName}
            </option>
          ))}
        </select>
      </div>

      {course && (
        <div className="space-y-4">
          {course.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleSection(idx)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">
                    {section.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50"
                  >
                    <FileArrowDown />
                    Download PDF
                  </button>
                  {expandedSections.includes(idx) ? (
                    <CaretDown className="text-gray-500" />
                  ) : (
                    <CaretRight className="text-gray-500" />
                  )}
                </div>
              </button>

              {expandedSections.includes(idx) && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="pt-4 space-y-2.5">
                    {section.topics.map((topic, tIdx) => (
                      <div
                        key={tIdx}
                        className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg"
                      >
                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                          {tIdx + 1}
                        </span>
                        <span className="text-sm text-gray-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseSyllabusPage;
