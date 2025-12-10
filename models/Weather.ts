import mongoose, { Schema, Document, Model } from "mongoose";
import { IWeatherForecast } from "@/types/Weather";

export interface IWeatherCacheDocument extends Document {
  resort: string;
  weatherData: IWeatherForecast;
  timestamp: Date;
}

const WeatherCacheSchema: Schema = new Schema({
  resort: { 
    type: String, 
    required: true, 
    unique: true
  }, 
  weatherData: { 
    type: Object,
    required: true 
  },
  timestamp: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
});

const WeatherCache = (mongoose.models.WeatherCache || 
  mongoose.model<IWeatherCacheDocument>("WeatherCache", WeatherCacheSchema)) as Model<IWeatherCacheDocument>;

export default WeatherCache;