import { IWeatherForecast } from "./Weather";

export interface IMetrics {
  '24_hour': { in: number; cm: number };
  '48_hour': { in: number; cm: number };
  '7_day': { in: number; cm: number };
  base_depth: { in: number; cm: number };
  season_total: { in: number; cm: number };
}

export interface ISnowReport {
  source_url: string;
  fetched_at: Date;
  updated_at: Date;
  overall_conditions: string;
  resort_commentary: string;
  metrics: IMetrics;
}

export interface ITrailsStatus {
  source_url: string;
  fetched_at: Date;
  trails: { open: number; total: number };
}

export interface IResortData {
  snow_report: ISnowReport;
  trails_status: ITrailsStatus;
  weather?: IWeatherForecast;
}

export interface IReport {
  reports: Record<string, IResortData>;
  timestamp: Date;
}
