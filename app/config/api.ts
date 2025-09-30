import axios from "axios";

const BASE_URL = "https://pvcheck.havells.com";
const DEVICE_ID = "63295957";

// Utility function for making authenticated API calls via our internal API route
export const apiConfig = {
  baseURL: BASE_URL,
  deviceId: DEVICE_ID,
};

export const getPowerHistory = async (
  year: number,
  month: number,
  day: number
) => {
  try {
    const response = await axios.get("/api/solar", {
      params: { year, month, day },
    });
    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching power history:", errorMessage);
    throw new Error(`Failed to fetch power history: ${errorMessage}`);
  }
};

export const getMonthlyStats = async (year: number, month: number) => {
  try {
    const response = await axios.get("/api/solar/monthly", {
      params: { year, month },
    });
    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching monthly stats:", errorMessage);
    throw new Error(`Failed to fetch monthly stats: ${errorMessage}`);
  }
};

export { BASE_URL, DEVICE_ID };
