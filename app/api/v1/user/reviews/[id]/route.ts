import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const mockUserReviews = [
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
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id);

    const review = mockUserReviews.find(r => r.id === reviewId);

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { review },
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id);
    const body = await request.json();

    const reviewIndex = mockUserReviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    const updatedReview = {
      ...mockUserReviews[reviewIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    mockUserReviews[reviewIndex] = updatedReview;

    return NextResponse.json({
      success: true,
      data: { review: updatedReview },
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id);

    const reviewIndex = mockUserReviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    mockUserReviews.splice(reviewIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}