import {
  PowerHistoryResponse,
  PowerRecord,
  ChartDataPoint,
  DailyProduction,
  MonthlyStatsResponse,
  MonthlyStatistics,
} from "@/app/types/solar";

/**
 * Convert Unix timestamp to readable time format
 */
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * Convert Unix timestamp to readable date format
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Process power records for 24H chart with 5-minute intervals
 */
export const processChartData = (records: PowerRecord[]): ChartDataPoint[] => {
  return records
    .map((record) => {
      const date = new Date(record.dateTime * 1000);
      return {
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        hour: date.getHours().toString().padStart(2, "0"), // Add hour for axis formatting
        power: record.generationPower,
        timestamp: record.dateTime,
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp); // Ensure chronological order
};

/**
 * Calculate peak power from records
 */
export const calculatePeakPower = (records: PowerRecord[]): number => {
  return Math.max(...records.map((record) => record.generationPower));
};

/**
 * Calculate current power (latest non-zero reading)
 */
export const calculateCurrentPower = (records: PowerRecord[]): number => {
  const sortedRecords = [...records].sort((a, b) => b.dateTime - a.dateTime);
  return (
    sortedRecords.find((record) => record.generationPower > 0)
      ?.generationPower || 0
  );
};

/**
 * Convert power from watts to kilowatts
 */
export const wattsToKilowatts = (watts: number): number => {
  return watts / 1000;
};

/**
 * Process multiple days data for daily chart
 */
export const processDailyData = (
  responses: PowerHistoryResponse[]
): DailyProduction[] => {
  return responses
    .map((response) => ({
      date: `${response.statistics.year}-${String(
        response.statistics.month
      ).padStart(2, "0")}-${String(response.statistics.day).padStart(2, "0")}`,
      generation: response.statistics.generationValue,
      fullPowerHours: response.statistics.fullPowerHoursDay,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculate total production from multiple days
 */
export const calculateTotalProduction = (
  dailyData: DailyProduction[]
): number => {
  return dailyData.reduce((total, day) => total + day.generation, 0);
};

/**
 * Get date range for API calls (last N days)
 */
export const getDateRange = (
  days: number = 7
): Array<{ year: number; month: number; day: number }> => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    dates.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
  }

  return dates.reverse(); // Return chronological order
};

/**
 * Check if system is currently generating power
 */
export const isSystemActive = (records: PowerRecord[]): boolean => {
  const latestRecords = records.slice(-10); // Check last 10 readings
  return latestRecords.some((record) => record.generationPower > 0);
};

/**
 * Calculate total monthly production from monthly statistics
 */
export const calculateMonthlyTotals = (statistics: MonthlyStatistics) => {
  return {
    totalGeneration: statistics.generationValue,
    totalFullPowerHours: statistics.fullPowerHoursDay,
    avgDailyGeneration:
      statistics.generationValue /
      new Date(statistics.year, statistics.month, 0).getDate(),
  };
};

/**
 * Process monthly stats response to get daily data
 */
export const processMonthlyStatsData = (
  response: MonthlyStatsResponse
): DailyProduction[] => {
  return response.records.map((record) => ({
    date: `${record.year}-${String(record.month).padStart(2, "0")}-${String(
      record.day
    ).padStart(2, "0")}`,
    generation: record.generationValue,
    fullPowerHours: record.fullPowerHoursDay,
  }));
};

/**
 * Get current month and year
 */
export const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};
