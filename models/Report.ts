import mongoose, { Model, Document, Schema } from 'mongoose';

interface Metrics {
  '24_hour': { in: number; cm: number };
  '48_hour': { in: number; cm: number };
  '7_day': { in: number; cm: number };
  base_depth: { in: number; cm: number };
  season_total: { in: number; cm: number };
}

interface SnowReport {
  source_url: string;
  fetched_at: Date;
  updated_at: Date;
  overall_conditions: string;
  resort_commentary: string;
  metrics: Metrics;
}

interface TrailsStatus {
  source_url: string;
  fetched_at: Date;
  trails: { open: number; total: number };
}

interface ResortData {
  snow_report: SnowReport;
  trails_status: TrailsStatus;
}

export interface IReportDocument extends Document {
  reports: Map<string, ResortData>;
  timestamp: Date;
}

const MetricsSchema = new Schema<Metrics>({
  '24_hour': { in: Number, cm: Number },
  '48_hour': { in: Number, cm: Number },
  '7_day': { in: Number, cm: Number },
  base_depth: { in: Number, cm: Number },
  season_total: { in: Number, cm: Number },
}, { _id: false });

const SnowReportSchema = new Schema<SnowReport>({
  source_url: String,
  fetched_at: Date,
  updated_at: Date,
  overall_conditions: String,
  resort_commentary: String,
  metrics: MetricsSchema
}, { _id: false });

const TrailsStatusSchema = new Schema<TrailsStatus>({
  source_url: String,
  fetched_at: Date,
  trails: {
    open: Number,
    total: Number
  }
}, { _id: false });

const ResortDataSchema = new Schema<ResortData>({
  snow_report: SnowReportSchema,
  trails_status: TrailsStatusSchema
}, { _id: false });

const ReportSchema = new Schema<IReportDocument>({
  reports: { type: Map, of: ResortDataSchema },
  timestamp: { type: Date, default: Date.now }
});

const Report: Model<IReportDocument> =
  mongoose.models.Report as Model<IReportDocument> ||
  mongoose.model<IReportDocument>('Report', ReportSchema);

export default Report;