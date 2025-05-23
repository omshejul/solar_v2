import axios from "axios";

const BEARER_TOKEN = process.env.TOKEN;
const BASE_URL = process.env.BASE_URL;
const DEVICE_ID = process.env.DEVICE_ID;

// Utility function for making authenticated API calls
export const apiConfig = {
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    "Content-Type": "application/json",
  },
  baseURL: BASE_URL,
  deviceId: DEVICE_ID,
};

export const getPowerHistory = async (
  year: number,
  month: number,
  day: number,
  httpsAgent?: any
) => {
  const response = await axios.get(
    `${BASE_URL}/maintain-s/history/power/${DEVICE_ID}/record`,
    {
      params: { year, month, day },
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
      httpsAgent,
    }
  );
  return response;
};

export { BEARER_TOKEN, BASE_URL, DEVICE_ID };
