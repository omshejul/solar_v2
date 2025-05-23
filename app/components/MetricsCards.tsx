"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import {
  PowerHistoryResponse,
  DailyProduction,
  MonthlyStatistics,
} from "@/app/types/solar";
import {
  calculatePeakPower,
  calculateCurrentPower,
  wattsToKilowatts,
  calculateTotalProduction,
  isSystemActive,
  calculateMonthlyTotals,
} from "@/app/utils/solar";

interface MetricsCardsProps {
  todayData: PowerHistoryResponse | null;
  weeklyData: DailyProduction[];
  monthlyStats: MonthlyStatistics | null;
  loading: boolean;
}

export const MetricsCards = ({
  todayData,
  weeklyData,
  monthlyStats,
  loading,
}: MetricsCardsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Check for critical data availability
  const hasData = todayData || weeklyData.length > 0 || monthlyStats;

  if (!hasData) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-red-700 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Production Metrics - Critical Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center space-y-3">
              <AlertCircle className="h-16 w-16 text-red-500" />
              <div>
                <p className="font-semibold text-red-700 text-lg">
                  No Production Data Available
                </p>
                <p className="text-red-600 text-sm mt-2">
                  Unable to load any solar production metrics. This indicates a
                  critical system error.
                </p>
                <p className="text-red-500 text-xs mt-3">
                  Please refresh the page or contact technical support
                  immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPower = todayData ? calculateCurrentPower(todayData.records) : 0;
  const peakPower = todayData ? calculatePeakPower(todayData.records) : 0;
  const systemActive = todayData ? isSystemActive(todayData.records) : false;
  const todayGeneration = todayData?.statistics.generationValue || 0;

  // Use monthly statistics for more accurate data
  const monthlyGeneration =
    monthlyStats?.generationValue || calculateTotalProduction(weeklyData);
  const monthlyTotals = monthlyStats
    ? calculateMonthlyTotals(monthlyStats)
    : null;

  // Estimate yearly production (monthly * 12)
  const yearlyGeneration = monthlyGeneration * 12;

  // Use a conservative estimate for total production (assume 2 years of operation)
  const totalProduction = yearlyGeneration * 2;

  // Installed capacity assumption - 5.4 kW is a common residential solar system size
  const installedCapacity = 5.4; // kW

  const metrics = [
    {
      title: "Production-Today",
      value: todayData ? `${todayGeneration.toFixed(2)} kWh` : "N/A",
      subtitle: todayData
        ? `${todayData.statistics.fullPowerHoursDay || 0} full power hours`
        : "No data for selected date",
      status: todayData ? (systemActive ? "Active" : "Inactive") : "No Data",
      statusColor: todayData
        ? systemActive
          ? "bg-emerald-500"
          : "bg-zinc-500"
        : "bg-red-500",
      hasError: !todayData,
    },
    {
      title: "Production-This Month",
      value:
        monthlyStats || weeklyData.length > 0
          ? `${monthlyGeneration.toFixed(2)} kWh`
          : "N/A",
      subtitle: monthlyTotals
        ? `Avg: ${monthlyTotals.avgDailyGeneration.toFixed(1)} kWh/day`
        : weeklyData.length > 0
        ? `Based on ${weeklyData.length} days data`
        : "No monthly data available",
      status: monthlyStats
        ? "Actual"
        : weeklyData.length > 0
        ? `${weeklyData.length} days`
        : "No Data",
      statusColor: monthlyStats
        ? "bg-emerald-500"
        : weeklyData.length > 0
        ? "bg-sky-500"
        : "bg-red-500",
      hasError: !monthlyStats && weeklyData.length === 0,
    },
    {
      title: "Production Power",
      value: todayData
        ? `${wattsToKilowatts(currentPower).toFixed(2)} kW`
        : "N/A",
      subtitle: todayData
        ? `Peak: ${wattsToKilowatts(peakPower).toFixed(2)} kW`
        : "No power data available",
      status: todayData
        ? currentPower > 0
          ? "Generating"
          : "Standby"
        : "No Data",
      statusColor: todayData
        ? currentPower > 0
          ? "bg-emerald-500"
          : "bg-amber-500"
        : "bg-red-500",
      hasError: !todayData,
    },
    {
      title: "Installed Capacity",
      value: `${installedCapacity.toFixed(1)} kW`,
      subtitle: "System rated capacity",
      status: "Rated",
      statusColor: "bg-violet-500",
      hasError: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className={`hover:shadow-lg transition-shadow ${
            metric.hasError ? "border-red-200 bg-red-50" : ""
          }`}
        >
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <div className="flex justify-between items-start gap-2">
              <CardTitle
                className={`text-xs sm:text-sm font-medium leading-tight flex items-center gap-1 ${
                  metric.hasError ? "text-red-600" : "text-muted-foreground"
                }`}
              >
                {metric.hasError && <AlertCircle className="h-3 w-3" />}
                {metric.title}
              </CardTitle>
              <Badge
                variant="secondary"
                className={`text-white text-xs ${metric.statusColor} flex-shrink-0`}
              >
                {metric.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div
              className={`text-xl sm:text-2xl font-bold leading-tight ${
                metric.hasError ? "text-red-600" : ""
              }`}
            >
              {metric.value}
            </div>
            <p
              className={`text-xs mt-1 leading-tight ${
                metric.hasError ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {metric.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
