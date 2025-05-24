"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { PowerHistoryResponse } from "@/app/types/solar";
import { processChartData, wattsToKilowatts } from "@/app/utils/solar";
import { useEffect, useState } from "react";
import { AlertCircle, Clock, Zap } from "lucide-react";

interface PowerChart24HProps {
  data: PowerHistoryResponse | null;
  loading: boolean;
  selectedDate?: Date;
}

const chartConfig = {
  power: {
    label: "Power Generation",
    color: "hsl(var(--chart-1))",
  },
} as const;

export const PowerChart24H = ({
  data,
  loading,
  selectedDate,
}: PowerChart24HProps) => {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  // Helper function to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Helper function to format date for display
  const formatDateForDisplay = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const currentDate = selectedDate || new Date();
  const dateLabel = formatDateForDisplay(currentDate);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-base sm:text-lg">
            24H Power Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="w-full h-[240px] sm:h-[320px] lg:h-[400px] animate-pulse bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-base sm:text-lg text-red-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            24H Power Generation - No Data
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="w-full h-[240px] sm:h-[320px] lg:h-[400px] flex flex-col items-center justify-center text-red-600 border-2 border-red-200 rounded-lg bg-red-25">
            <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
            <div className="text-center space-y-2">
              <p className="font-semibold text-lg">No Data Available</p>
              <p className="text-sm">
                Solar generation data is not available for{" "}
                {dateLabel.toLowerCase()}
              </p>
              <p className="text-xs text-red-500 mt-3 max-w-md">
                This could mean the date is outside the system&apos;s
                operational period, before data recording began, or there was a
                system outage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = processChartData(data.records);
  const maxPower = Math.max(...chartData.map((d) => d.power));

  // If no intraday records are available
  if (chartData.length === 0 || chartData.every((d) => d.power === 0)) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg text-yellow-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            24H Power Generation - Limited Data
          </CardTitle>
          <div className="text-xs sm:text-sm text-yellow-600">
            {dateLabel}:{" "}
            {data.statistics?.generationValue?.toFixed(2) || "0.00"} kWh •{" "}
            {data.statistics?.fullPowerHoursDay?.toFixed(1) || "0.0"} full power
            hours
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="w-full h-[240px] sm:h-[320px] lg:h-[400px] flex flex-col items-center justify-center text-yellow-700 border-2 border-yellow-200 rounded-lg bg-yellow-25">
            <AlertCircle className="h-10 w-10 mb-3 text-yellow-500" />
            <div className="text-center space-y-2">
              <p className="font-semibold">
                ⚡ Detailed Hourly Data Unavailable
              </p>
              <p className="text-sm">
                Only daily summary is available for {dateLabel.toLowerCase()}
              </p>
              <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                <p className="text-sm font-medium">Daily Total Production</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {data.statistics?.generationValue?.toFixed(2) || "0.00"} kWh
                </p>
              </div>
              <p className="text-xs text-yellow-600 mt-3">
                Detailed 5-minute interval data is not available for this date.
                This may occur for older dates or during system maintenance
                periods.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Responsive configuration
  const getChartConfig = () => {
    switch (screenSize) {
      case "mobile":
        return {
          height: 240,
          fontSize: 8,
          margins: { right: 10 },
          xAxisHeight: 35,
          yAxisWidth: 35,
          angle: -45,
          tickInterval: 3, // Show every 4th hour (00, 04, 08, 12, 16, 20)
        };
      case "tablet":
        return {
          height: 320,
          fontSize: 10,
          margins: { right: 15 },
          xAxisHeight: 35,
          yAxisWidth: 50,
          angle: -30,
          tickInterval: 1, // Show every 2nd hour
        };
      default:
        return {
          height: 400,
          fontSize: 12,
          margins: { right: 20 },
          xAxisHeight: 30,
          yAxisWidth: 60,
          angle: 0,
          tickInterval: 0, // Show all hours
        };
    }
  };

  const config = getChartConfig();

  // For 5-minute data, we want to show all data points but only hour labels on axis
  const displayData = chartData;

  return (
    <Card>
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-sm sm:text-base lg:text-lg">
          24H Power Generation
        </CardTitle>
        <div className="text-xs sm:text-sm text-muted-foreground">
          {data.statistics?.acceptDay ? (
            <>
              {data.statistics?.acceptDay} • Peak:{" "}
              {wattsToKilowatts(maxPower).toFixed(2)} kW
            </>
          ) : (
            <>
              {dateLabel} • Peak: {wattsToKilowatts(maxPower).toFixed(2)} kW
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="w-full" style={{ height: `${config.height}px` }}>
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData} margin={config.margins}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={config.fontSize}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  angle={config.angle}
                  textAnchor={config.angle < 0 ? "end" : "middle"}
                  height={config.xAxisHeight}
                  tickFormatter={(value) => {
                    // Only show hour labels (when minutes are :00)
                    if (value.endsWith(":00")) {
                      return value.substring(0, 2); // Show just the hour part (00, 01, 02, etc.)
                    }
                    return "";
                  }}
                  interval={0} // Check every tick but only show some
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={config.fontSize}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `${wattsToKilowatts(value).toFixed(1)}kW`
                  }
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  width={config.yAxisWidth}
                  domain={[0, "dataMax"]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold">Time: {value}</span>
                        </div>
                      )}
                      formatter={(value) => [
                        <div className="flex items-center gap-2" key="power">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">
                            {wattsToKilowatts(Number(value)).toFixed(2)} kW
                          </span>
                        </div>,
                      ]}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="hsl(var(--chart-1))"
                  fill="url(#colorPower)"
                  strokeWidth={screenSize === "mobile" ? 1.5 : 2}
                  dot={false}
                  activeDot={{ r: screenSize === "mobile" ? 3 : 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
