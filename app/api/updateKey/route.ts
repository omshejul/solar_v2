import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { clearTokenCache } from "../../utils/token";

const DB_BASE_URL = "https://db.omshejul.com";
const DB_TOKEN = process.env.DB_TOKEN;
const AUTH = process.env.AUTH;
// The specific record ID to update (from your curl example)
const RECORD_ID = "f55s9pu420ujudv";

interface UpdateKeyRequest {
  key: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check AUTH token for local requests
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const providedToken = authHeader.substring(7); // Remove "Bearer " prefix
    if (!AUTH || providedToken !== AUTH) {
      return NextResponse.json(
        { error: "Invalid authorization token" },
        { status: 401 }
      );
    }

    const body: UpdateKeyRequest = await request.json();

    if (!body.key) {
      return NextResponse.json(
        { error: "Missing required field: key" },
        { status: 400 }
      );
    }

    if (!DB_TOKEN) {
      return NextResponse.json(
        { error: "DB_TOKEN environment variable is not set" },
        { status: 500 }
      );
    }

    // Update the record in the database
    const response = await axios.patch(
      `${DB_BASE_URL}/api/collections/keys/records/${RECORD_ID}`,
      {
        value: body.key,
      },
      {
        headers: {
          Authorization: `Bearer ${DB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Clear the cached token since we've updated it
    clearTokenCache();

    return NextResponse.json({
      success: true,
      message: "Key updated successfully",
      data: response.data,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Error updating key:", errorMessage);

    // Check if it's an axios error with response
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status: number; data: unknown };
      };
      return NextResponse.json(
        {
          error: "Failed to update key in database",
          details: axiosError.response?.data || errorMessage,
        },
        { status: axiosError.response?.status || 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update key",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Also support PATCH method for consistency with the curl example
export async function PATCH(request: NextRequest) {
  return POST(request);
}
