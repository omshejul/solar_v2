import { NextResponse } from "next/server";

import { checkSolarApiHealth } from "@/app/utils/solar-api";

export async function GET() {
  const solarApiHealth = await checkSolarApiHealth();

  if (!solarApiHealth.healthy) {
    return NextResponse.json(
      {
        status: "error",
        message: "Internal solar API dependency is unavailable",
        checks: {
          solarApi: solarApiHealth,
        },
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: "ok",
    message: "Service is healthy",
    checks: {
      solarApi: solarApiHealth,
    },
  });
}
