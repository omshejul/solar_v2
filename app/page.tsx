"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useSolarDataWithDate } from "@/app/hooks/useSolarDataWithDate";
import { MetricsCards } from "@/app/components/MetricsCards";
import { PowerChart24H } from "@/app/components/PowerChart24H";
import { DailyChart } from "@/app/components/DailyChart";
import { DatePicker } from "@/app/components/DatePicker";
import { ThemeToggle } from "@/app/components/theme-toggle";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    selectedDateData,
    monthlyData,
    monthlyStats,
    loading,
    error,
    dataError,
    lastUpdated,
    refetch,
  } = useSolarDataWithDate(selectedDate);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Solar Dashboard
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Real-time solar power generation monitoring
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>

            {/* Date Picker */}
            <div className="flex items-center w-full justify-between md:justify-start gap-3">
              <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
              <Button
                onClick={refetch}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2 w-fit"
                size="sm"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Error States */}
        {(error || dataError) && (
          <div className="space-y-4">
            {/* Critical System Error */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex items-center gap-3 text-red-700">
                    <AlertCircle className="h-6 w-6 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg">System Error</h3>
                      <p className="text-sm font-medium mt-1">{error}</p>
                    </div>
                  </div>
                  <Button
                    onClick={refetch}
                    disabled={loading}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100 w-fit mt-2 sm:mt-0"
                    size="sm"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {/* Data Availability Error */}
            {dataError && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex items-center gap-3 text-orange-700">
                    <AlertCircle className="h-6 w-6 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg">Data Not Available</h3>
                      <p className="text-sm font-medium mt-1">{dataError}</p>
                      <div className="mt-3 space-y-2">
                        <p className="text-xs">Suggested actions:</p>
                        <ul className="text-xs list-disc list-inside space-y-1 ml-2">
                          <li>Select a more recent date</li>
                          <li>
                            Check if the date is within the system&apos;s
                            operational period
                          </li>
                          <li>Try refreshing the data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-fit">
                    <Button
                      onClick={refetch}
                      disabled={loading}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      size="sm"
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${
                          loading ? "animate-spin" : ""
                        }`}
                      />
                      Retry
                    </Button>
                    <Button
                      onClick={() => setSelectedDate(new Date())}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      size="sm"
                    >
                      Go to Today
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Metrics Cards */}
        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            Production Metrics
          </h2>
          <MetricsCards
            todayData={selectedDateData}
            weeklyData={monthlyData}
            monthlyStats={monthlyStats}
            loading={loading}
          />
        </section>

        {/* Charts */}
        <section className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold">Energy Analytics</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <div className="order-1">
              <PowerChart24H
                data={selectedDateData}
                loading={loading}
                selectedDate={selectedDate}
              />
            </div>
            <div className="order-2">
              <DailyChart data={monthlyData} loading={loading} />
            </div>
          </div>
        </section>

        {/* Additional Info */}
        {selectedDateData && !loading && (
          <section className="bg-muted/50 rounded-lg p-3 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-2">
              System Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-medium whitespace-nowrap">
                  Monthly Days:
                </span>
                <span className="text-muted-foreground">
                  {monthlyData.length}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-medium whitespace-nowrap">
                  Selected Date:
                </span>
                <span className="text-muted-foreground">
                  {selectedDate.toLocaleDateString()}
                </span>
              </div>
              {lastUpdated && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium whitespace-nowrap">
                    Last Updated:
                  </span>
                  <span className="text-muted-foreground">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
