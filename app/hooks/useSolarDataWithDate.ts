"use client";

import { useState, useEffect } from "react";
import { getPowerHistory, getMonthlyStats } from "@/app/config/api";
import {
  PowerHistoryResponse,
  DailyProduction,
  MonthlyStatsResponse,
  MonthlyStatistics,
} from "@/app/types/solar";

interface UseSolarDataWithDateReturn {
  selectedDateData: PowerHistoryResponse | null;
  monthlyData: DailyProduction[];
  monthlyStats: MonthlyStatistics | null;
  loading: boolean;
  error: string | null;
  dataError: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
}

export const useSolarDataWithDate = (
  selectedDate: Date
): UseSolarDataWithDateReturn => {
  const [selectedDateData, setSelectedDateData] =
    useState<PowerHistoryResponse | null>(null);
  const [monthlyData, setMonthlyData] = useState<DailyProduction[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStatistics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSelectedDateData = async (date: Date) => {
    try {
      const response = await getPowerHistory(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
      setSelectedDateData(response.data);
      setDataError(null);
    } catch (err) {
      console.error("Error fetching selected date data:", err);
      setSelectedDateData(null);

      const dateStr = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (err instanceof Error) {
        if (err.message.includes("404") || err.message.includes("not found")) {
          setDataError(
            `No solar data available for ${dateStr}. This date may be before system installation or data recording began.`
          );
        } else if (
          err.message.includes("network") ||
          err.message.includes("fetch")
        ) {
          setDataError(
            `Network error while fetching data for ${dateStr}. Please check your internet connection and try again.`
          );
        } else {
          setDataError(
            `Failed to load solar data for ${dateStr}: ${err.message}`
          );
        }
      } else {
        setDataError(
          `No solar data available for ${dateStr}. Please select a different date or contact support if this error persists.`
        );
      }
    }
  };

  const fetchMonthlyData = async (date: Date) => {
    try {
      const response = await getMonthlyStats(
        date.getFullYear(),
        date.getMonth() + 1
      );

      const monthlyStatsResponse = response.data;

      // Store the monthly statistics
      if (monthlyStatsResponse.statistics) {
        setMonthlyStats(monthlyStatsResponse.statistics);
      }

      // Process all monthly records into daily production data
      let allDailyData: DailyProduction[] = [];

      if (
        monthlyStatsResponse.records &&
        Array.isArray(monthlyStatsResponse.records)
      ) {
        allDailyData = monthlyStatsResponse.records.map((item: any) => ({
          date: `${item.year}-${String(item.month).padStart(2, "0")}-${String(
            item.day
          ).padStart(2, "0")}`,
          generation: item.generationValue || 0,
          fullPowerHours: item.fullPowerHoursDay || 0,
        }));

        // Sort by date
        allDailyData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setMonthlyData(allDailyData);
      } else {
        console.warn(
          "Unexpected monthly stats response structure:",
          monthlyStatsResponse
        );
        setMonthlyData([]);
      }
    } catch (err) {
      console.error("Error fetching monthly data:", err);
      throw err;
    }
  };

  const fetchData = async (date: Date) => {
    setLoading(true);
    setError(null);
    setDataError(null);

    try {
      // Fetch both selected date's detailed data and monthly data
      await Promise.all([fetchSelectedDateData(date), fetchMonthlyData(date)]);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching solar data";
      setError(
        `Critical Error: ${errorMessage}. Please refresh the page or contact technical support if the problem persists.`
      );
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData(selectedDate);
  };

  // Fetch data when selected date changes
  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  // Auto-refresh only if viewing today's data
  useEffect(() => {
    const isToday = (date: Date) => {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    if (isToday(selectedDate)) {
      const refreshInterval = setInterval(() => {
        fetchData(selectedDate);
      }, 5 * 60 * 1000); // Refresh every 5 minutes

      return () => {
        clearInterval(refreshInterval);
      };
    }
  }, [selectedDate]);

  return {
    selectedDateData,
    monthlyData,
    monthlyStats,
    loading,
    error,
    dataError,
    lastUpdated,
    refetch,
  };
};
