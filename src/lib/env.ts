import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().min(1, "NEXT_PUBLIC_API_BASE_URL is required"),
  API_ORIGIN: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  NEXT_PUBLIC_ENABLE_DEMO_LOGIN: z.string().optional(),
});

function getEnvConfig() {
  const isProduction = process.env.NODE_ENV === "production";

  const publicApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (isProduction && !publicApiUrl) {
    throw new Error(
      "Configuration Error: NEXT_PUBLIC_API_BASE_URL is required in production environments."
    );
  }

  const rawEnv = {
    NEXT_PUBLIC_API_BASE_URL:
      publicApiUrl || (isProduction ? "" : "http://localhost:8080/api"),
    API_ORIGIN: process.env.API_ORIGIN,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_ENABLE_DEMO_LOGIN: process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN,
  };

  const parsed = envSchema.safeParse(rawEnv);
  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new Error(`Invalid environment variables: ${errors}`);
  }

  return parsed.data;
}

export const env = getEnvConfig();
