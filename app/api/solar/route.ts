import { NextRequest, NextResponse } from "next/server";
import { fetchPowerHistory } from "../../utils/solar-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const day = searchParams.get("day");

    if (!year || !month || !day) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: year, month, and day are required",
        },
        { status: 400 }
      );
    }

    const data = await fetchPowerHistory(
      Number(year),
      Number(month),
      Number(day)
    );

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const responseData =
      error && typeof error === "object" && "response" in error
        ? (error as { response?: { data: unknown } }).response?.data
        : undefined;

    console.error("Error fetching power history:", errorMessage);
    return NextResponse.json(
      {
        error: "Failed to fetch power history",
        details: errorMessage,
        response: responseData,
      },
      { status: 500 }
    );
  }
}
