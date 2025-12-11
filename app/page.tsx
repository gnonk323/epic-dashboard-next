"use client"

import { IReport } from "@/types/Report";
import { useState, useEffect } from "react";
import axios from "axios";
import { Cloud } from "lucide-react";
import ResortCard from "@/components/ResortCard";

export default function Home() {
  const [reports, setReports] = useState<IReport>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="hidden sm:block fixed dark:bg-zinc-900 bg-background px-4 sm:px-6 lg:px-8 py-1 sm:py-4 shadow-md w-full z-10 border-b border-neutral-200 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">
                New England Epic Pass Mountains
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <a className="cursor-pointer focus:ring-0" href="https://github.com/gnonk323/epic-dashboard-next" target="_blank">
                <div className="p-2 rounded-lg border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-github h-6 w-6" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-8 py-4">
          <div className="grid gap-6 lg:gap-8 sm:pt-16">
            {Object.entries(reports.reports).map(([mountain, resortData]) => (
              <ResortCard
                key={mountain}
                mountain={mountain}
                resortData={resortData}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center my-8">Updated {new Date(reports.timestamp).toLocaleString()}</p>
        </div>
        </>
      )}
    </div>
  );
}
