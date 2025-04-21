import { z } from "zod";

export const weatherSchema = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
    pressure: z.number(),
  }),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
  dt: z.number(),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
  }),
});

export type WeatherData = z.infer<typeof weatherSchema>;
