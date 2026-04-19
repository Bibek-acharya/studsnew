import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let mockUserReviews = [
  {
    id: 1,
    collegeId: 1,
    collegeName: "Pulchowk Campus (IOE)",
    userId: 1,
    studentType: "alumni",
    course: "B.Sc. CSIT",
    level: "Bachelor's Degree",
    batchYear: 2018,
    ratings: {
      "Teaching Quality & Faculty Support": 5,
      "Infrastructure & Lab Facilities": 4,
      "Social & Campus Life": 4,
      "Placement & Internships": 5,
      "Value for Money": 4,
      "Hostels & Accommodation": 3,
      "Student Clubs & Activities": 4,
      "Administration & Management": 4,
      "Library & Resources": 5,
      "Overall Experience": 4,
    },
    pros: "World-class faculty, excellent research opportunities, strong placement cell",
    cons: "Hostel facilities could be better",
    summaryTitle: "Great learning experience with excellent career prospects",
    yearlyFee: 85000,
    scholarship: false,
    internshipOutcome: "excellent",
    email: "bikash@example.com",
    isVerified: true,
    isPublished: true,
    helpfulCount: 45,
    createdAt: "2026-03-15T10:30:00Z",
  },
  {
    id: 2,
    collegeId: 3,
    collegeName: "Kathmandu University",
    userId: 1,
    studentType: "current",
    course: "M.Sc. Data Science",
    level: "Master's Degree",
    batchYear: 2025,
    ratings: {
      "Teaching Quality & Faculty Support": 4,
      "Infrastructure & Lab Facilities": 5,
      "Social & Campus Life": 4,
      "Placement & Internships": 4,
      "Value for Money": 5,
      "Hostels & Accommodation": 4,
      "Student Clubs & Activities": 3,
      "Administration & Management": 4,
      "Library & Resources": 5,
      "Overall Experience": 4,
    },
    pros: "Excellent research labs, beautiful campus, good value for money",
    cons: "Limited events and social activities",
    summaryTitle: "Great for research, beautiful campus location",
    yearlyFee: 120000,
    scholarship: true,
    internshipOutcome: "good",
    email: "bikash@example.com",
    isVerified: true,
    isPublished: true,
    helpfulCount: 23,
    createdAt: "2026-02-10T15:20:00Z",
  },
];

let nextId = 3;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const total = mockUserReviews.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedReviews = mockUserReviews.slice(start, end);

    return NextResponse.json({
      success: true,
      data: {
        reviews: paginatedReviews,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      collegeId,
      collegeName,
      studentType,
      course,
      level,
      batchYear,
      ratings,
      pros,
      cons,
      summaryTitle,
      yearlyFee,
      scholarship,
      internshipOutcome,
      email,
    } = body;

    if (!collegeId || !studentType || !course || !level || !batchYear || !pros || !cons || !summaryTitle || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReview = {
      id: nextId++,
      collegeId,
      collegeName: collegeName || `College ${collegeId}`,
      userId: 1,
      studentType,
      course,
      level,
      batchYear,
      ratings,
      pros,
      cons,
      summaryTitle,
      yearlyFee: yearlyFee || null,
      scholarship: scholarship || false,
      internshipOutcome: internshipOutcome || null,
      email,
      isVerified: false,
      isPublished: true,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
    };

    mockUserReviews.unshift(newReview);

    return NextResponse.json({
      success: true,
      data: {
        review: newReview,
        message: "Review submitted successfully",
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 }
    );
  }
}