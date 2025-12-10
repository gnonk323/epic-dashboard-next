"use client"

import { IResortData } from "@/types/Report";
import { useState } from "react";
import {
  MountainSnow,
  Snowflake,
  ChevronDown,
  ChevronRight,
  CloudSnow,
  Calendar,
  Cloud,
  ChartNoAxesColumn,
  Thermometer, // <-- NEW: Icon for temperature
  Wind,        // <-- NEW: Icon for wind
  Droplet      // <-- NEW: Icon for precipitation
} from "lucide-react";
import { deslugify, calculatePercentage } from "@/lib/utils";

// Helper function to map a short forecast string to an appropriate Lucide icon
// Note: This is a simple, illustrative mapping. You may need a more robust system.
const getWeatherIcon = (shortForecast: string) => {
  const forecast = shortForecast.toLowerCase();
  if (forecast.includes("snow") || forecast.includes("flurries")) {
    return <CloudSnow className="w-5 h-5 text-blue-500 shrink-0" />;
  }
  if (forecast.includes("sunny") || forecast.includes("clear")) {
    // Sun icon is not standard Lucide, using Cloud for consistency or find a suitable one
    return <Cloud className="w-5 h-5 text-amber-500 shrink-0" />;
  }
  if (forecast.includes("rain") || forecast.includes("showers")) {
    return <Droplet className="w-5 h-5 text-cyan-500 shrink-0" />;
  }
  if (forecast.includes("windy")) {
    return <Wind className="w-5 h-5 text-gray-500 shrink-0" />;
  }
  // Default to cloud for general or mostly cloudy conditions
  return <Cloud className="w-5 h-5 text-neutral-500 shrink-0" />;
}


const weatherLinks = {
  "stowe": "https://forecast.weather.gov/MapClick.php?lat=44.4653&lon=-72.6843",
  "okemo": "https://forecast.weather.gov/MapClick.php?lat=43.3968&lon=-72.695",
  "mount-snow": "https://forecast.weather.gov/MapClick.php?lat=42.9369&lon=-72.8091",
  "mount-sunapee": "https://forecast.weather.gov/MapClick.php?lat=43.3212&lon=-72.0363",
  "wildcat": "https://forecast.weather.gov/MapClick.php?lat=44.2889&lon=-71.1185",
  "attitash": "https://forecast.weather.gov/MapClick.php?lat=44.0781&lon=-71.2822",
  "crotched": "https://forecast.weather.gov/MapClick.php?lat=42.9877&lon=-71.8128",
  "hunter": "https://forecast.weather.gov/MapClick.php?lat=42.2137&lon=-74.2193",
}

export default function ResortCard({ mountain, resortData, units }: { mountain: string, resortData: IResortData, units: "in" | "cm" }) {
  const [resortCommentsExpanded, setResortCommentsExpanded] = useState(false);
  
  // Extract the weather forecast periods, taking the first three
  const forecastPeriods = resortData.weather?.properties?.periods.slice(0, 3) || [];
  
  // Determine temperature unit based on snow units for consistency
  const tempUnit = units === "in" ? "F" : "C"; 

  return (
    <div className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-200 dark:border-zinc-700">
      <div className="bg-linear-to-r rounded-t-2xl from-blue-600 to-indigo-600 px-6 py-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <MountainSnow className="h-6 w-6 text-white opacity-90" />
            <h2 className="text-2xl font-bold text-white">{deslugify(mountain)}</h2>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border dark:border-zinc-900 bg-white text-zinc-900 gap-2">
            <Snowflake className="h-4 w-4" />
            {resortData.snow_report.overall_conditions}
          </span>
        </div>
      </div>
      <div className="p-6 dark:bg-zinc-900 rounded-b-2xl">
        <div className="border-b border-zinc-300 dark:border-zinc-700 pb-6 mb-6">
          <button
            className="flex items-center gap-2 font-semibold cursor-pointer"
            onClick={() => setResortCommentsExpanded(!resortCommentsExpanded)}
          >
            {resortCommentsExpanded ? (
              <ChevronDown className="w-5 h-5 text-blue-500 shrink-0" />
            ): (
              <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
            )}
            <h3>Resort Comments</h3>
          </button>
          {resortCommentsExpanded && (
            <p className="mt-4 p-4 text-zinc-600 dark:text-zinc-400 rounded-xl border border-zinc-300 dark:border-zinc-700 shadow-inner">{resortData.snow_report.resort_commentary}</p>
          )}
        </div>
        <div className="border-b border-zinc-300 dark:border-zinc-700 pb-6 mb-6">
          <h3 className="flex items-center gap-2 font-semibold mb-6">
            <ChartNoAxesColumn className="w-5 h-5 text-blue-500 shrink-0" />
            Snowfall & Base
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-linear-to-br from-white to-neutral-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-500 hover:border-blue-400 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">24 Hours</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{units === "in" ? resortData.snow_report.metrics["24_hour"].in : resortData.snow_report.metrics["24_hour"].cm}</span>
                <span className="text-sm text-gray-500 dark:text-zinc-400">{units}</span>
              </div>
            </div>
            <div className="bg-linear-to-br from-white to-neutral-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-500 hover:border-blue-400 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">48 Hours</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{units === "in" ? resortData.snow_report.metrics["48_hour"].in : resortData.snow_report.metrics["48_hour"].cm}</span>
                <span className="text-sm text-gray-500 dark:text-zinc-400">{units}</span>
              </div>
            </div>
            <div className="bg-linear-to-br from-white to-neutral-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-500 hover:border-blue-400 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">7 Days</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{units === "in" ? resortData.snow_report.metrics["7_day"].in : resortData.snow_report.metrics["7_day"].cm}</span>
                <span className="text-sm text-gray-500 dark:text-zinc-400">{units}</span>
              </div>
            </div>
            <div className="bg-linear-to-br from-white to-neutral-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-500 hover:border-blue-400 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Base Depth</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{units === "in" ? resortData.snow_report.metrics.base_depth.in : resortData.snow_report.metrics.base_depth.cm}</span>
                <span className="text-sm text-gray-500 dark:text-zinc-400">{units}</span>
              </div>
            </div>
            <div className="bg-linear-to-br from-white to-neutral-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-500 hover:border-blue-400 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Season Total</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{units === "in" ? resortData.snow_report.metrics.season_total.in : resortData.snow_report.metrics.season_total.cm}</span>
                <span className="text-sm text-gray-500 dark:text-zinc-400">{units}</span>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-white-50 to-neutral-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-5 border border-neutral-200 dark:border-zinc-500 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-semibold">Trails Open</p>
                  <p className="text-2xl font-bold">
                    {resortData.trails_status.trails.open} / {resortData.trails_status.trails.total}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center justify-center px-4 py-3 bg-white dark:bg-zinc-800 rounded-xl shadow-md">
                  <span className="text-xl font-bold">
                    {calculatePercentage(resortData.trails_status.trails.open, resortData.trails_status.trails.total)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-linear-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${calculatePercentage(resortData.trails_status.trails.open, resortData.trails_status.trails.total)}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* NEW WEATHER FORECAST SECTION */}
        <div className="border-b border-zinc-300 dark:border-zinc-700 pb-6 mb-6">
          <h3 className="flex items-center gap-2 font-semibold mb-6">
            <CloudSnow className="w-5 h-5 text-blue-500 shrink-0" />
            Weather
          </h3>

          {forecastPeriods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {forecastPeriods.map((period, index) => (
                <div 
                  key={index} 
                  className="bg-linear-to-br from-white to-neutral-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-4 border border-neutral-200 dark:border-zinc-500 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-dashed border-zinc-200 dark:border-zinc-700 pb-2">
                    <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400">{period.name}</h4>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3">
                    {/* Temperature and Icon */}
                    <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-red-500 shrink-0" />
                        <span className="text-xl font-bold">
                          {period.temperature}°{tempUnit}
                        </span>
                    </div>

                    {/* Wind Speed and Direction */}
                    <div className="flex items-center gap-2 text-sm">
                      <Wind className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        {period.windSpeed.replace('W', 'Winds')} 
                      </span>
                    </div>
                  </div>

                  {/* Short Forecast Description */}
                  <div className="mt-3 flex items-start gap-3 p-3 bg-neutral-100 dark:bg-zinc-800 rounded-lg">
                    {getWeatherIcon(period.shortForecast)}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-snug">
                      {period.shortForecast}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-zinc-800 rounded-lg text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-zinc-700">
              <p>Weather forecast data is currently unavailable for this resort.</p>
            </div>
          )}
        </div>
        {/* END NEW WEATHER FORECAST SECTION */}
        
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <p>Updated {resortData.snow_report.updated_at.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1">
            <a
              className="flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors font-semibold cursor-pointer"
              target="_blank"
              href={weatherLinks[mountain as keyof typeof weatherLinks]}
            >
              <Cloud className="h-4 w-4" />
              Weather
            </a>
            <a
              className="flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors font-semibold cursor-pointer"
              target="_blank"
              href={resortData.snow_report.source_url}
            >
              <MountainSnow className="h-4 w-4" />
              Mountain
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}