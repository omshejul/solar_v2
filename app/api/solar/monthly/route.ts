import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as https from "https";
import { getBearerToken } from "../../../utils/token";

const BASE_URL = "https://pvcheck.havells.com";
const DEVICE_ID = "63295957";

// Create a custom HTTPS agent that allows self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

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

    let bearerToken: string;
    try {
      bearerToken = await getBearerToken();
    } catch {
      return NextResponse.json(
        { error: "Failed to retrieve authentication token" },
        { status: 500 }
      );
    }

    const response = await axios.get(
      `${BASE_URL}/maintain-s/history/power/${DEVICE_ID}/stats/month`,
      {
        params: { year, month },
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          Accept: "application/json",
        },
        httpsAgent,
      }
    );

    return NextResponse.json(response.data);
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
