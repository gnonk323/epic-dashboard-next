"use client"

import { IReport } from "@/types/Report";
import { useState, useEffect } from "react";
import axios from "axios";
import { Cloud } from "lucide-react";
import { formatDate } from "@/lib/utils";
import ResortCard from "@/components/ResortCard";

export default function Home() {
  const [reports, setReports] = useState<IReport>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<"in" | "cm">("in");

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get<IReport>("/api/reports/latests")
        setReports(response.data)
      } catch (e) {
        console.error("Error loading reports.", e)
        setError(e as string)
      } finally {
        setLoading(false)
      }
    }

    loadReports();
  }, []);

  return (
    <div className="min-h-screen">
      {loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Cloud className="h-16 w-16 text-blue-400 animate-bounce" />
              <div className="absolute inset-0 blur-xl bg-blue-200 opacity-50 animate-pulse"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 font-medium">Loading snow reports...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        </div>
      )}
      {!loading && reports && !error && (
        <>
        <div className="dark:bg-zinc-900 bg-background px-4 sm:px-6 lg:px-8 py-1 sm:py-4 shadow-md fixed w-full z-10 border-b border-neutral-200 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">
                New England Epic Pass Mountains
              </h1>
              <span className="text-xs text-gray-400">Updated {formatDate(reports.timestamp)}</span>
            </div>
            <div>
              <button
                className={`p-1 w-12 rounded-l-lg font-semibold cursor-pointer ${units === 'in' ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                onClick={() => setUnits("in")}
              >
                in
              </button>
              <button
                className={`p-1 w-12 rounded-r-lg font-semibold cursor-pointer ${units === 'cm' ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                onClick={() => setUnits("cm")}
              >
                cm
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6 lg:gap-8 sm:pt-16 pt-8">
            {Object.entries(reports.reports).map(([mountain, resortData]) => (
              <ResortCard
                key={mountain}
                mountain={mountain}
                resortData={resortData}
                units={units}
              />
            ))}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
