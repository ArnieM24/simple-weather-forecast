"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Droplets, Search, Thermometer, Wind } from "lucide-react";
import Image from "next/image";
import { get5daysWeatherData, getWeatherData } from "./action";
import { useState } from "react";
import { WeatherData } from "@/types/weather";
import { Card, CardContent } from "@/components/ui/card";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "@/public/assets/LandingPage-Icon.png";
import { ForecastData } from "@/schema/forecastSchema";
import groupForecastByDay from "@/utils/groupForecastByDay";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Search className={`h-5 w-5 ${pending ? "animate-spin" : ""}`} />
    </Button>
  );
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forecast, setForecast] = useState<Record<
    string,
    ForecastData["list"]
  > | null>(null);

  const handleSearch = async (formData: FormData) => {
    setError("");
    setIsLoading(true);
    const city = formData.get("city") as string;
    const { data, error: weatherError } = await getWeatherData(city);

    if (weatherError) {
      setError(weatherError);
    } else if (data) {
      setWeather(data);
    }

    const { data: forecastData, error: forecastError } =
      await get5daysWeatherData(city);
    if (forecastError) {
      console.error("Error fetching 5-day forecast:", forecastError);
      setForecast(null);
    } else if (forecastData) {
      const groupedData = groupForecastByDay(forecastData.list);
      setForecast(groupedData);
    }

    setIsLoading(false); // Move setIsLoading(false) here to ensure loading state is updated after data is set
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-500 p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-center mb-4 ">
          <Image
            src={Logo}
            alt="Weather App Logo"
            width={200}
            height={200}
            className="rounded-full"
          />
        </div>
        <h1 className="flex justify-center text-3xl font-bold text-green-100 ml-4">
          Weather Forecast
        </h1>
        <form action={handleSearch} className="flex gap-2">
          <Input
            name="city"
            type="text"
            placeholder="Enter city name"
            className="w-full p-4 rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <SubmitButton />
        </form>
        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-600 text-center "
          >
            {error}
          </motion.div>
        )}
        {isLoading ? (
          // Skeleton Loader
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
          >
            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-8 w-32 mb-4" />
                  <div className="flex items-center justify-center mt-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-10 w-20 ml-4" />
                  </div>
                  <Skeleton className="h-4 w-24 mt-2" />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Skeleton className="h-16 w-16 mx-auto" />
                  <Skeleton className="h-16 w-16 mx-auto" />
                  <Skeleton className="h-16 w-16 mx-auto" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          weather && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0 }}
            >
              <Card className="bg-white/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-center">
                      {weather.name}
                    </h2>
                    <div className="flex items-center justify-center mt-4">
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                        width={64}
                        height={64}
                      />
                      <div className="font-bold text-5xl">
                        {Math.round(weather.main.temp)}°C
                      </div>
                    </div>
                    <div className="text-gray-600 mt-1 capitalize">
                      {weather.weather[0].description}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center"
                    >
                      <Thermometer className="w-6 h-6 mx-auto text-orange-500" />
                      <div className="text-gray-600">Feels Like</div>
                      <div className="font-semibold">
                        {weather.main.feels_like}°C
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center"
                    >
                      <Droplets className="w-6 h-6 mx-auto text-blue-500" />
                      <div className="text-gray-600">Humidity</div>
                      <div className="font-semibold">
                        {weather.main.humidity}%
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center"
                    >
                      <Wind className="w-6 h-6 mx-auto text-teal-500" />
                      <div className="text-gray-600">Wind</div>
                      <div className="font-semibold">
                        {weather.wind.speed} m/s
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        )}
      </div>
      {forecast && (
        <div className="mt-6">
          {/* Add a centered label */}
          <h2 className="text-2xl font-bold text-center text-white mb-4">
            6 Day Forecast
          </h2>
          <div className="ml-10 grid grid-cols-3 gap-4">
            {Object.entries(forecast)
              .slice(0, 6) // Limit to 6 cards
              .map(([date, dayData]) => (
                <Card key={date} className="bg-white/50 backdrop-blur">
                  <CardContent className="p-2">
                    <h3 className="text-xl font-bold text-center">
                      {new Date(date).toDateString()}
                    </h3>
                    <div className="grid grid-cols-3">
                      {dayData.map((item) => (
                        <div key={item.dt} className="text-center">
                          <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                            alt={item.weather[0].description}
                            width={50}
                            height={50}
                            className="justify-center mx-auto"
                          />
                          <div className="text-sm font-semibold">
                            {Math.round(item.main.temp)}°C
                          </div>
                          <div className="text-xs text-gray-600 capitalize">
                            {item.weather[0].description}
                          </div>
                          <div className="text-xs text-gray-600">
                            {item.dt_txt.split(" ")[1]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
