"use server";

import { forecastSchema, ForecastData } from "@/schema/forecastSchema";
import { weatherSchema, WeatherData } from "@/schema/weatherSchema";
import { z } from "zod";

export async function getWeatherData(city: string): Promise<{
  data?: WeatherData;
  error?: string;
}> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    if (!city.trim()) {
      return { error: "City Name is Required" };
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const rawData = await response.json();
    const data = weatherSchema.parse(rawData); // Validate with weatherSchema
    return { data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Invalid data format" };
    }
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function get5daysWeatherData(city: string): Promise<{
  data?: ForecastData;
  error?: string;
}> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    if (!city.trim()) {
      return { error: "City Name is Required" };
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const rawData = await response.json();
    const data = forecastSchema.parse(rawData); // Validate with forecastSchema
    return { data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Invalid data format" };
    }
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
