"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { DailyProduction } from "@/app/types/solar";
import { calculateTotalProduction } from "@/app/utils/solar";
import { useEffect, useState } from "react";
import { AlertCircle, Calendar, Zap } from "lucide-react";

interface DailyChartProps {
  data: DailyProduction[];
  loading: boolean;
}

const chartConfig = {
  generation: {
    label: "Daily Generation",
    color: "hsl(var(--chart-2))",
  },
} as const;

export const DailyChart = ({ data, loading }: DailyChartProps) => {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

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
            Monthly Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="w-full h-[240px] sm:h-[320px] lg:h-[400px] animate-pulse bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-base sm:text-lg text-red-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Monthly Generation - No Data
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="w-full h-[240px] sm:h-[320px] lg:h-[400px] flex flex-col items-center justify-center text-red-600 border-2 border-red-200 rounded-lg bg-red-25">
            <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
            <div className="text-center space-y-2">
              <p className="font-semibold text-lg">No Monthly Data Available</p>
              <p className="text-sm">
                Unable to load monthly solar generation data
              </p>
              <p className="text-xs text-red-500 mt-3 max-w-md">
                This could indicate a system error, network connectivity issues,
                or no data recorded for the selected month. Please try
                refreshing or contact support if the problem persists.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort data and prepare chart data
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedData.map((day) => ({
    ...day,
    dateShort: new Date(day.date).getDate().toString().padStart(2, "0"),
    fullDate: new Date(day.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));

  const totalGeneration = calculateTotalProduction(data);
  const avgGeneration = totalGeneration / data.length;
  const maxGeneration = Math.max(...data.map((d) => d.generation));

  // Responsive configuration
  const getChartConfig = () => {
    switch (screenSize) {
      case "mobile":
        return {
          height: 220,
          fontSize: 8,
          margins: { right: 10 },
          xAxisHeight: 35,
          yAxisWidth: 30,
          angle: 0,
          //   tickInterval: Math.ceil(chartData.length / 30),
          tickInterval: 1,
        };
      case "tablet":
        return {
          height: 320,
          fontSize: 11,
          margins: { right: 15 },
          xAxisHeight: 40,
          yAxisWidth: 45,
          angle: 0,
          tickInterval: Math.ceil(chartData.length / 15),
        };
      default:
        return {
          height: 400,
          fontSize: 12,
          margins: { right: 20 },
          xAxisHeight: 30,
          yAxisWidth: 60,
          angle: 0,
          tickInterval: 1,
        };
    }
  };

  const config = getChartConfig();

  return (
    <Card>
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-sm sm:text-base lg:text-lg">
          Monthly Generation ({data.length} days)
        </CardTitle>
        <div className="text-xs sm:text-sm text-muted-foreground">
          {screenSize === "mobile" ? (
            <div className="space-y-1">
              <div>Total: {totalGeneration.toFixed(1)} kWh</div>
              <div>
                Avg: {avgGeneration.toFixed(1)} kWh • Peak:{" "}
                {maxGeneration.toFixed(1)} kWh
              </div>
            </div>
          ) : (
            <div>
              Total: {totalGeneration.toFixed(2)} kWh • Avg:{" "}
              {avgGeneration.toFixed(2)} kWh • Peak: {maxGeneration.toFixed(2)}{" "}
              kWh
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="w-full" style={{ height: `${config.height}px` }}>
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={config.margins}>
                <XAxis
                  dataKey="dateShort"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={config.fontSize}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  angle={config.angle}
                  textAnchor="middle"
                  height={config.xAxisHeight}
                  interval={screenSize === "mobile" ? config.tickInterval : 0}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={config.fontSize}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    screenSize === "mobile"
                      ? `${value.toFixed(0)}`
                      : `${value.toFixed(1)}`
                  }
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  width={config.yAxisWidth}
                  domain={[0, "dataMax"]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value, payload) => {
                        if (payload && payload[0] && payload[0].payload) {
                          const data = payload[0].payload;
                          return (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="font-semibold">
                                {data.fullDate}
                              </span>
                            </div>
                          );
                        }
                        return `Date: ${value}`;
                      }}
                      formatter={(value) => [
                        <div
                          className="flex  items-center gap-2"
                          key="generation"
                        >
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">
                            {Number(value).toFixed(2)} kWh
                          </span>
                        </div>
                      ]}
                    />
                  }
                />
                <Bar
                  dataKey="generation"
                  fill="hsl(var(--chart-2))"
                  radius={screenSize === "mobile" ? [2, 2, 0, 0] : [4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
