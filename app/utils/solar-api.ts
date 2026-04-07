import axios from "axios";
import * as https from "https";

import { getBearerToken } from "./token";

export const BASE_URL = "https://pvcheck.havells.com";
export const DEVICE_ID = "63295957";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

type SolarApiError = {
  message: string;
  responseData?: unknown;
  status?: number;
};

type SolarApiRequestError = Error & {
  responseData?: unknown;
  status?: number;
};

const normalizeSolarApiError = (error: unknown): SolarApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status,
    };
  }

  return {
    message: error instanceof Error ? error.message : "Unknown error",
  };
};

const createSolarApiRequestError = (error: unknown): SolarApiRequestError => {
  const normalizedError = normalizeSolarApiError(error);
  const requestError = new Error(
    normalizedError.message
  ) as SolarApiRequestError;

  requestError.responseData = normalizedError.responseData;
  requestError.status = normalizedError.status;

  return requestError;
};

export const fetchPowerHistory = async (
  year: number,
  month: number,
  day: number
) => {
  const bearerToken = await getBearerToken();

  try {
    const response = await axios.get(
      `${BASE_URL}/maintain-s/history/power/${DEVICE_ID}/record`,
      {
        params: { year, month, day },
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          Accept: "application/json",
        },
        httpsAgent,
      }
    );

    return response.data;
  } catch (error: unknown) {
    throw createSolarApiRequestError(error);
  }
};

export const fetchMonthlyStats = async (year: number, month: number) => {
  const bearerToken = await getBearerToken();

  try {
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

    return response.data;
  } catch (error: unknown) {
    throw createSolarApiRequestError(error);
  }
};

export const checkSolarApiHealth = async () => {
  const now = new Date();

  try {
    await fetchPowerHistory(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );

    return {
      healthy: true,
      checkedAt: now.toISOString(),
    };
  } catch (error: unknown) {
    const normalizedError =
      error instanceof Error
        ? {
            message: error.message,
            responseData:
              "responseData" in error ? error.responseData : undefined,
            status: "status" in error ? error.status : undefined,
          }
        : normalizeSolarApiError(error);

    return {
      healthy: false,
      checkedAt: now.toISOString(),
      error: normalizedError.message,
      response: normalizedError.responseData,
      status: normalizedError.status,
    };
  }
};
