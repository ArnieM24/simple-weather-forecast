import { ForecastData } from "@/schema/forecastSchema";

export default function groupForecastByDay(list: ForecastData["list"]) {
  const grouped: Record<string, typeof list> = {};

  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; // Extract the date (YYYY-MM-DD)
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });

  return grouped;
}
