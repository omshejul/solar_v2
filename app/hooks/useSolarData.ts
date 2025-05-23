"use client";

import { useState, useEffect, useCallback } from "react";
import { getPowerHistory, getMonthlyStats } from "@/app/config/api";
import {
  PowerHistoryResponse,
  DailyProduction,
  MonthlyStatistics,
  MonthlyStatItem,
} from "@/app/types/solar";

interface UseSolarDataReturn {
  todayData: PowerHistoryResponse | null;
  monthlyData: DailyProduction[];
  monthlyStats: MonthlyStatistics | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
}

export const useSolarData = (): UseSolarDataReturn => {
  const [todayData, setTodayData] = useState<PowerHistoryResponse | null>(null);
  const [monthlyData, setMonthlyData] = useState<DailyProduction[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStatistics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTodayData = async () => {
    try {
      const today = new Date();
      const response = await getPowerHistory(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
      setTodayData(response.data);
    } catch (err) {
      console.error("Error fetching today data:", err);
      // Don't throw error for today's data as it might not be available
      // Just log it and continue with monthly data
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const today = new Date();
      const response = await getMonthlyStats(
        today.getFullYear(),
        today.getMonth() + 1
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
        allDailyData = monthlyStatsResponse.records.map(
          (item: MonthlyStatItem) => ({
            date: `${item.year}-${String(item.month).padStart(2, "0")}-${String(
              item.day
            ).padStart(2, "0")}`,
            generation: item.generationValue || 0,
            fullPowerHours: item.fullPowerHoursDay || 0,
          })
        );

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch both today's detailed data and monthly data
      await Promise.all([fetchTodayData(), fetchMonthlyData()]);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();

    const refreshInterval = setInterval(() => {
      fetchData();
    }, 1 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [fetchData]);

  return {
    todayData,
    monthlyData,
    monthlyStats,
    loading,
    error,
    lastUpdated,
    refetch,
  };
};
