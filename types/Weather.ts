export interface IWeatherForecast {
  properties: {
    periods: Array<{
      name: string;
      windSpeed: string;
      temperature: number;
      temperatureUnit: string;
      shortForecast: string;
      detailedForecast: string;
    }>;
    updated: string;
  };
}