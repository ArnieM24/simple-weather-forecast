import { ForecastData } from "@/schema/forecastSchema";

export default function groupForecastByDay(list: ForecastData["list"]) {
  const grouped: Record<string, typeof list> = {};

  list.forEach((item) => {
    // Step 1: Convert timestamp to formatted time
    const dateObj = new Date(item.dt * 1000);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;

    // Step 2: Attach the formattedTime to the item
    const itemWithTime = {
      ...item,
      formattedTime,
    };

    // Step 3: Group by date string (YYYY-MM-DD)
    const dateKey = item.dt_txt.split(" ")[0];

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(itemWithTime);
  });

  return grouped;
}
