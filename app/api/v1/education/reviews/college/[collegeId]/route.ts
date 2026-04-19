import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const mockReviews = [
  {
    id: 1,
    collegeId: 1,
    userId: 1,
    userName: "Bikash Sharma",
    userInitials: "BS",
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
    pros: "World-class faculty, excellent research opportunities, strong placement cell, beautiful campus environment",
    cons: "Hostel facilities could be better, limited parking space during peak hours",
    summaryTitle: "Great learning experience with excellent career prospects",
    yearlyFee: 85000,
    scholarship: false,
    internshipOutcome: "excellent",
    isVerified: true,
    isPublished: true,
    helpfulCount: 45,
    createdAt: "2026-03-15T10:30:00Z",
  },
  {
    id: 2,
    collegeId: 1,
    userId: 2,
    userName: "Anjali Thapa",
    userInitials: "AT",
    studentType: "current",
    course: "MBA",
    level: "Master's Degree",
    batchYear: 2025,
    ratings: {
      "Teaching Quality & Faculty Support": 4,
      "Infrastructure & Lab Facilities": 4,
      "Social & Campus Life": 5,
      "Placement & Internships": 4,
      "Value for Money": 3,
      "Hostels & Accommodation": 4,
      "Student Clubs & Activities": 5,
      "Administration & Management": 3,
      "Library & Resources": 4,
      "Overall Experience": 4,
    },
    pros: "Active student clubs, great networking opportunities, diverse campus life",
    cons: "Administrative delays, high fees compared to other options",
    summaryTitle: "Vibrant campus life with good academic quality",
    yearlyFee: 150000,
    scholarship: true,
    internshipOutcome: "good",
    isVerified: true,
    isPublished: true,
    helpfulCount: 32,
    createdAt: "2026-02-20T14:15:00Z",
  },
  {
    id: 3,
    collegeId: 1,
    userId: 3,
    userName: "Ramesh KC",
    userInitials: "RK",
    studentType: "alumni",
    course: "BE Computer",
    level: "Bachelor's Degree",
    batchYear: 2019,
    ratings: {
      "Teaching Quality & Faculty Support": 5,
      "Infrastructure & Lab Facilities": 5,
      "Social & Campus Life": 3,
      "Placement & Internships": 5,
      "Value for Money": 4,
      "Hostels & Accommodation": 4,
      "Student Clubs & Activities": 3,
      "Administration & Management": 4,
      "Library & Resources": 4,
      "Overall Experience": 4,
    },
    pros: "Top-notch technical infrastructure, great faculty, excellent placement opportunities",
    cons: "Limited social activities, very competitive environment can be stressful",
    summaryTitle: "Best engineering college for tech careers in Nepal",
    yearlyFee: 95000,
    scholarship: false,
    internshipOutcome: "excellent",
    isVerified: true,
    isPublished: true,
    helpfulCount: 67,
    createdAt: "2026-01-10T09:00:00Z",
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collegeId: string }> }
) {
  try {
    const { collegeId } = await params;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "newest";

    const collegeIdNum = parseInt(collegeId);
    
    const filteredReviews = mockReviews.filter(r => r.collegeId === collegeIdNum);
    
    const sortedReviews = [...filteredReviews].sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sort === "highest") {
        const aAvg = Object.values(a.ratings).reduce((s, v) => s + v, 0) / 10;
        const bAvg = Object.values(b.ratings).reduce((s, v) => s + v, 0) / 10;
        return bAvg - aAvg;
      }
      if (sort === "helpful") {
        return b.helpfulCount - a.helpfulCount;
      }
      return 0;
    });

    const total = sortedReviews.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedReviews = sortedReviews.slice(start, end);

    const allRatings = sortedReviews.flatMap(r => Object.values(r.ratings));
    const overallRating = allRatings.length > 0 
      ? allRatings.reduce((s, v) => s + v, 0) / allRatings.length 
      : 0;

    const categoryAverages: Record<string, number> = {};
    const categories = [
      "Teaching Quality & Faculty Support",
      "Infrastructure & Lab Facilities",
      "Social & Campus Life",
      "Placement & Internships",
      "Value for Money",
      "Hostels & Accommodation",
      "Student Clubs & Activities",
      "Administration & Management",
      "Library & Resources",
      "Overall Experience",
    ];

    categories.forEach(cat => {
      const catRatings = sortedReviews.map(r => r.ratings[cat]).filter(Boolean);
      categoryAverages[cat] = catRatings.length > 0
        ? catRatings.reduce((s, v) => s + v, 0) / catRatings.length
        : 0;
    });

    return NextResponse.json({
      success: true,
      data: {
        reviews: paginatedReviews,
        overallRating: parseFloat(overallRating.toFixed(1)),
        reviewCount: total,
        categoryAverages: Object.fromEntries(
          Object.entries(categoryAverages).map(([k, v]) => [k, parseFloat(v.toFixed(1))])
        ),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching college reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}