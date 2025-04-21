import { z } from "zod";

export const forecastSchema = z.object({
  city: z.object({
    name: z.string(),
    country: z.string(),
  }),
  list: z.array(
    z.object({
      dt: z.number(),
      main: z.object({
        temp: z.number(),
        feels_like: z.number(),
        temp_min: z.number(),
        temp_max: z.number(),
        pressure: z.number(),
        humidity: z.number(),
      }),
      weather: z.array(
        z.object({
          id: z.number(),
          main: z.string(),
          description: z.string(),
          icon: z.string(),
        })
      ),
      formattedTime: z.string().optional(),
      wind: z.object({
        speed: z.number(),
        deg: z.number(),
      }),

      dt_txt: z.string(), // Date and time in text format
    })
  ),
});

export type ForecastData = z.infer<typeof forecastSchema>;
