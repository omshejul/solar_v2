import axios from "axios";
import { config } from "dotenv";
import * as https from "https";

// Initialize dotenv
config();

const BEARER_TOKEN = process.env.TOKEN;
const BASE_URL = "https://pvcheck.havells.com";
const DEVICE_ID = "63295957";

// Create a custom HTTPS agent that allows self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

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
  } catch (error: any) {
    console.error("Error fetching power history:", error.message);
    throw new Error(`Failed to fetch power history: ${error.message}`);
  }
};

export const getMonthlyStats = async (year: number, month: number) => {
  try {
    const response = await axios.get("/api/solar/monthly", {
      params: { year, month },
    });
    return response;
  } catch (error: any) {
    console.error("Error fetching monthly stats:", error.message);
    throw new Error(`Failed to fetch monthly stats: ${error.message}`);
  }
};

export { BEARER_TOKEN, BASE_URL, DEVICE_ID };
