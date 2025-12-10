"use client"

import { IResortData } from "@/types/Report";
import { useState } from "react";
import { MountainSnow, Snowflake, ChevronDown, ChevronRight, CloudSnow } from "lucide-react";
import { deslugify, calculatePercentage } from "@/lib/utils";

export default function ResortCard({ mountain, resortData, units }: { mountain: string, resortData: IResortData, units: "in" | "cm" }) {
  const [resortCommentsExpanded, setResortCommentsExpanded] = useState(false);

  return (
    <div className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-200 dark:border-zinc-700">
      <div className="bg-linear-to-r rounded-t-2xl from-blue-600 to-indigo-600 px-6 py-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <MountainSnow className="h-6 w-6 text-white opacity-90" />
            <h2 className="text-2xl font-bold text-white">{deslugify(mountain)}</h2>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border bg-white text-zinc-900 gap-2">
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
        <div>
          <h3 className="flex items-center gap-2 font-semibold mb-6">
            <CloudSnow className="w-5 h-5 text-blue-500 shrink-0" />
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
      </div>
    </div>
  )
}