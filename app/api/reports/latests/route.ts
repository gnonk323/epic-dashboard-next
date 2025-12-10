import { NextResponse } from "next/server";
import Report from "@/models/Report";
import WeatherCache from "@/models/Weather";
import { connectMongoose } from "@/lib/mongoose";
import axios from "axios";
import { IWeatherForecast } from "@/types/Weather";
import { IResortData, IReport } from "@/types/Report";

const RESORT_GRIDPOINTS: Record<string, string> = {
  "stowe": "BTV/106,62",
  "okemo": "BTV/114,10",
  "mount-snow": "ALY/101,81",
  "mount-sunapee": "GYX/16,32",
  "wildcat": "GYX/39,81",
  "attitash": "GYX/35,71",
  "crotched": "GYX/26,18",
  "hunter": "ALY/59,41",
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

async function fetchWeather(gridpoint: string): Promise<IWeatherForecast | null> {
  console.log("hitting weather.gov. gridpoint", gridpoint)
  try {
    const response = await axios.get(
      `https://api.weather.gov/gridpoints/${gridpoint}/forecast`,
      {
        headers: { "User-Agent": "EpicMtnsDashApp (gmt015@gmail.com)" }
      }
    )
    return response.data as IWeatherForecast;
  } catch (e) {
    console.error("Error while fetching weather.", e)
    return null;
  }
}

/**
 * Checks the database cache, fetches new weather if stale, and updates the cache.
 */
async function getWeatherForResort(resort: string, gridpoint: string): Promise<IWeatherForecast | null> {
  const now = Date.now();

  const cacheEntry = await WeatherCache.findOne({ resort }).lean();

  if (cacheEntry) {
    const cacheAge = now - cacheEntry.timestamp.getTime();

    // Check if the cache is still fresh
    if (cacheAge < CACHE_TTL_MS) {
      console.log(`using database cache for ${resort}! Cache age: ${Math.round(cacheAge / 1000 / 60)} minutes.`);
      return cacheEntry.weatherData;
    }
  }

  console.log(`Cache stale or missing for ${resort}. Fetching new weather...`);
  const newWeather = await fetchWeather(gridpoint);

  if (newWeather) {
    await WeatherCache.updateOne(
      { resort: resort },
      {
        $set: {
          weatherData: newWeather,
          timestamp: new Date(),
        }
      },
      { 
        upsert: true
      }
    );
    console.log("Saved new weather to database cache for", resort);
  }

  return newWeather;
}

export async function GET() {
  await connectMongoose();

  try {
    const latest = await Report
      .findOne()
      .sort({ timestamp: -1 })
      .lean<IReport>();

    if (!latest) {
      return NextResponse.json(
        { error: "No reports found." },
        { status: 404 }
      );
    }
    
    const reportsObj = latest.reports;
    
    const weatherPromises = Object.entries(reportsObj).map(
      async ([resort, data]): Promise<[string, IResortData]> => {
        const gridpoint = RESORT_GRIDPOINTS[resort];
        const weather = gridpoint ? await getWeatherForResort(resort, gridpoint) : undefined; 
        return [resort, { ...data, weather: weather || undefined }];
      }
    );
    const reportsWithWeatherEntries = await Promise.all(weatherPromises);
    const reportsWithWeather: Record<string, IResortData> = Object.fromEntries(reportsWithWeatherEntries);

    const response: IReport = {
      ...latest, 
      reports: reportsWithWeather,
    };

    return NextResponse.json(response);

  } catch (err) {
    console.error("Failed to fetch latest report:", err);
    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}