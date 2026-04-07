import { NextRequest, NextResponse } from "next/server";
import { fetchMonthlyStats } from "../../../utils/solar-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!year || !month) {
      return NextResponse.json(
        {
          error: "Missing required parameters: year and month are required",
        },
        { status: 400 }
      );
    }

    const data = await fetchMonthlyStats(Number(year), Number(month));

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const responseData =
      error && typeof error === "object" && "response" in error
        ? (error as { response?: { data: unknown } }).response?.data
        : undefined;

    console.error("Error fetching monthly stats:", errorMessage);
    return NextResponse.json(
      {
        error: "Failed to fetch monthly stats",
        details: errorMessage,
        response: responseData,
      },
      { status: 500 }
    );
  }
}
